"""
Builds case-study data + images from Nimisha's Figma PDF export.

Sources
  • PDF (invisible text layer): exact characters, positions and sizes
  • tools/figma_faces.txt (from Figma): which text boxes are portfolio text, and
    the family/weight of every styled segment (counts of non-space characters)
  • PDF render: the artwork; text colours are sampled from it

Outputs per case-study frame
  public/img/cs/f<frame>.webp, f<frame>-2x.webp  artwork with live text erased (visual frames: full artwork)
  public/img/cs/f<frame>-i<k>.webp               photos / renders for the re-flowed (phone) view
  src/data/cases/<project>.json                  lines (desktop), paragraphs + cards + images (phone), links
"""
import io, json, os, sys
import numpy as np, cv2
import pymupdf as fitz
from PIL import Image, ImageFilter, ImageStat

ROOT = "/home/claude/work"
PDF = "/mnt/user-data/uploads/Portfolio/Nimisha VK_UI_UX Portfolio_Project 1 (Copy).pdf"
OUT_IMG = f"{ROOT}/site/public/img/cs"
OUT_DATA = f"{ROOT}/site/src/data/cases"
os.makedirs(OUT_IMG, exist_ok=True); os.makedirs(OUT_DATA, exist_ok=True)
SC = 1.5

FAM = {"P": "Poppins", "F": "Figtree", "K": "Parkinsans", "S": "League Spartan"}

PROJECTS = {
  "little-roots": ["6","7","8","9","10","11","12","13","14","15","32","16","17","18","19","20","21","22","23"],
  "mentora": ["24","25","26","27","28","29","30","31","33","34","35"],
  "hormona": ["36","37","38","39","40","41","42","43","44","45","46"],
  "yeola-paithani": ["47","48","49","50","51","52","53","54","55"],
}
VISUAL = {"13", "31", "16", "34", "45", "32", "33", "44"}
LINKS = {
  "23": [("View Prototype", "https://www.figma.com/proto/mU3JDRZJ8VPeDcVYWr1uVQ/Final-A5--Copy-?node-id=8-20097&viewport=285%2C224%2C0.07&t=jl8uyahJPrtSMfgx-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=8%3A17387&page-id=2%3A16345")],
  "35": [("View Prototype", "https://www.figma.com/proto/9Jqd5fiTflACqzREWqvM4F/CVD-Wireframes?node-id=492-588&t=SuDHkPgo883Pk5xZ-1")],
  "46": [("View prototype (Perimenopause)", "https://www.figma.com/proto/1X3GogtbJxRTaOYn6xtefD/Perimenopause-Prototype?node-id=12-23&viewport=437%2C125%2C0.06&t=uXWgSBBQjbpdCp7W-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1"),
         ("View prototype (Postpartum)", "https://www.figma.com/proto/lqlFhbzrh5PMQOYhERLFIE/Postpartum-Prototype?page-id=0%3A1&node-id=1-31&viewport=40%2C107%2C0.12&t=KaMvBpT6CO7QCAi7-1&scaling=scale-down&content-scaling=fixed")],
  "55": [("View prototype", "https://www.figma.com/proto/oyiSOTGyBavKK5icRH3Cdq/Paithani?node-id=2-2&t=jdp4zjp7xFA9s4oS-1")],
}

frames = {f[0]: (f[2], f[3]) for f in json.load(open(f"{ROOT}/frames.json"))}
only = set(sys.argv[1:])

# ---------- Figma text boxes ----------
NODES = {}
cur = None
for line in open(f"{ROOT}/tools/figma_faces.txt"):
    line = line.strip()
    if not line: continue
    if line.startswith("#"): cur = line[1:]; NODES[cur] = []; continue
    geo, segs = line.split(":")
    x, y, w, h = map(int, geo.split(","))
    parts = []
    for p in segs.split():
        code, _, cnt = p.partition(".")
        fam = FAM.get(code[0]); wt = int(code[1]); it = code.endswith("i")
        parts.append(((fam, wt * 100, it) if fam else None, int(cnt) if cnt else 10 ** 9))
    NODES[cur].append(dict(x=x, y=y, w=w, h=h, segs=parts))

doc = fitz.open(PDF); page = doc[0]
raw = page.get_text("rawdict")
CHARS = []
for bi, b in enumerate(raw["blocks"]):
    for li, l in enumerate(b.get("lines", [])):
        for s in l["spans"]:
            for ch in s["chars"]:
                CHARS.append(dict(c=ch["c"], bbox=ch["bbox"], ox=ch["origin"][0], base=ch["origin"][1], size=round(s["size"], 2), line=(bi, li)))
images = page.get_image_info(xrefs=True)
drawings = page.get_drawings()
_dl = page.get_displaylist()

def render(x0, y0, x1, y1, scale):
    pix = _dl.get_pixmap(clip=fitz.Rect(x0, y0, x1, y1), matrix=fitz.Matrix(scale, scale), alpha=False)
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")

def save(im, name, q=80): im.save(f"{OUT_IMG}/{name}.webp", quality=q, method=6)

def detail(im):
    g = im.convert("L").resize((max(8, im.width // 4), max(8, im.height // 4)))
    return ImageStat.Stat(g.filter(ImageFilter.FIND_EDGES)).mean[0]

def text_mask(shape, boxes, pad=3):
    m = np.zeros(shape[:2], np.uint8)
    for (x0, y0, x1, y1) in boxes:
        m[max(0, int(y0 * SC) - pad):int(y1 * SC) + pad, max(0, int(x0 * SC) - pad):int(x1 * SC) + pad] = 255
    return m

def ring(arr, mask, x0, y0, x1, y1, pad=3, band=6):
    H, W = mask.shape
    X0, Y0 = max(0, int(x0 * SC) - pad - band), max(0, int(y0 * SC) - pad - band)
    X1, Y1 = min(W, int(x1 * SC) + pad + band), min(H, int(y1 * SC) + pad + band)
    return arr[Y0:Y1, X0:X1][mask[Y0:Y1, X0:X1] == 0]

def sample_colour(arr, mask, box):
    x0, y0, x1, y1 = box
    px = ring(arr, mask, *box)
    bg = np.median(px, axis=0) if len(px) else np.array([255, 255, 255])
    inner = arr[int(y0 * SC):int(y1 * SC), int(x0 * SC):int(x1 * SC)].reshape(-1, 3).astype(float)
    if not len(inner): return "#000000"
    d = np.linalg.norm(inner - bg, axis=1)
    if d.max() < 25: return "#000000"
    core = inner[d >= d.max() * 0.8]
    return "#%02x%02x%02x" % tuple(int(round(v)) for v in np.median(core, axis=0))

def erase(img, boxes):
    arr = np.array(img)
    mask = text_mask(arr.shape, boxes)
    inp = np.zeros_like(mask); pad = 3
    for (x0, y0, x1, y1) in boxes:
        px = ring(arr, mask, x0, y0, x1, y1)
        Y0, Y1 = max(0, int(y0 * SC) - pad), int(y1 * SC) + pad
        X0, X1 = max(0, int(x0 * SC) - pad), int(x1 * SC) + pad
        if len(px) and px.std(axis=0).max() < 7:
            arr[Y0:Y1, X0:X1] = np.median(px, axis=0)
        else:
            inp[Y0:Y1, X0:X1] = 255
    if inp.any(): arr = cv2.inpaint(arr, inp, 5, cv2.INPAINT_TELEA)
    return Image.fromarray(arr)

def in_frame(y, fy, fh): return fy - 1 <= y < fy + fh

for slug, names in PROJECTS.items():
    if only and slug not in only: continue
    out_frames = []
    for name in names:
        fy, fh = frames[name]
        visual = name in VISUAL
        nodes = [n for n in NODES.get(name, []) if any(s[0] for s in n["segs"])]
        if visual:  # only the frame title stays live
            nodes = [n for n in nodes if n["h"] >= 85 and n["y"] < 70]

        # characters inside portfolio text boxes, with their face from Figma
        fchars = [dict(c, y=c["base"] - fy) for c in CHARS if in_frame(c["base"], fy, fh)]
        assigned = []
        for ni, n in enumerate(nodes):
            inside = [c for c in fchars if n["x"] - 4 <= (c["bbox"][0] + c["bbox"][2]) / 2 <= n["x"] + n["w"] + 4
                      and n["y"] - 4 <= c["y"] - c["size"] * 0.35 <= n["y"] + n["h"] + 4 and not c.get("_used")]
            if not inside: continue
            mx = max(c["size"] for c in inside)
            inside = [c for c in inside if c["size"] >= mx * 0.42]  # stray hidden text
            inside.sort(key=lambda c: (round(c["y"] / max(4, c["size"] * 0.5)), c["ox"]))
            segs = [list(s) for s in n["segs"]]; si = 0; face = segs[0][0]
            for c in inside:
                c["_used"] = True; c["node"] = ni
                if c["c"].strip():
                    while si < len(segs) - 1 and segs[si][1] <= 0: si += 1
                    face = segs[si][0] or face; segs[si][1] -= 1
                c["face"] = face
                if face: assigned.append(c)

        full = render(0, fy, 1920, fy + fh, SC)
        farr = np.array(full)

        # ---- rows (same node + baseline) split into positioned segments ----
        rows = {}
        for c in assigned: rows.setdefault((c["node"], round(c["y"] / 3)), []).append(c)
        dlines = []
        for (ni, _), cs in rows.items():
            cs.sort(key=lambda c: c["ox"])
            segs_ = [[]]
            for c in cs:
                cur_ = segs_[-1]
                if cur_ and c["c"].strip() and cur_[-1]["c"].strip() and c["bbox"][0] - cur_[-1]["bbox"][2] > c["size"] * 0.6:
                    segs_.append([])
                segs_[-1].append(c)
            for k, sg in enumerate(segs_):
                while sg and not sg[-1]["c"].strip(): sg.pop()
                while sg and not sg[0]["c"].strip(): sg.pop(0)
                if not sg: continue
                dlines.append(dict(cs=sg, node=ni, seg=k, nseg=len(segs_), base=max(c["y"] for c in sg),
                                   size=max(c["size"] for c in sg), x=sg[0]["ox"], x1=max(c["bbox"][2] for c in sg)))
        dlines.sort(key=lambda l: (round(l["base"]), l["x"]))

        boxes = [(l["x"] - 2, l["base"] - l["size"] * 1.02, l["x1"] + 2, l["base"] + l["size"] * 0.32) for l in dlines]
        fmask = text_mask(farr.shape, boxes)
        pal = []
        def snap(c):
            rgb = np.array([int(c[i:i + 2], 16) for i in (1, 3, 5)])
            for p in pal:
                if np.linalg.norm(p[0] - rgb) < 28: return p[1]
            pal.append((rgb, c)); return c
        for l in dlines:
            runs = []
            for c in l["cs"]:
                f = c["face"]
                if runs and runs[-1]["face"] == f and abs(runs[-1]["size"] - c["size"]) < 0.3:
                    runs[-1]["text"] += c["c"]; runs[-1]["x1"] = max(runs[-1]["x1"], c["bbox"][2])
                else:
                    runs.append(dict(face=f, size=c["size"], text=c["c"], x0=c["bbox"][0], x1=c["bbox"][2]))
            for r in runs:
                box = (r["x0"], l["base"] - r["size"] * 0.95, r["x1"], l["base"] + r["size"] * 0.25)
                r["color"] = snap(sample_colour(farr, fmask, box))
            l["runs"] = [dict(text=r["text"], fam=r["face"][0], w=r["face"][1], it=r["face"][2], size=r["size"], color=r["color"]) for r in runs]

        bg = erase(full, boxes) if (dlines and not visual) else full

        # ---- cards (simple filled shapes) ----
        cards = []
        for dr in drawings:
            if dr.get("fill") is None or dr.get("type") not in ("f", "fs") or len(dr["items"]) > 14: continue
            r = dr["rect"]
            if not in_frame(r.y0 + 1, fy, fh): continue
            w, h = r.width, r.height
            if w * h < 25000 or w > 1880 or h > fh - 20 or w < 120 or h < 60: continue
            col = "#%02x%02x%02x" % tuple(round(c * 255) for c in dr["fill"][:3])
            c = dict(x=r.x0, y=r.y0 - fy, w=w, h=h, fill=col, op=round(dr.get("fill_opacity", 1) or 1, 2))
            if not any(abs(c["x"] - u["x"]) < 3 and abs(c["y"] - u["y"]) < 3 and abs(c["w"] - u["w"]) < 3 for u in cards):
                cards.append(c)
        def card_of(x, y, area=0):
            best = None
            for ci, c in enumerate(cards):
                if c["x"] - 3 <= x <= c["x"] + c["w"] + 3 and c["y"] - 3 <= y <= c["y"] + c["h"] + 3 and c["w"] * c["h"] > area * 1.05:
                    if best is None or c["w"] * c["h"] < cards[best]["w"] * cards[best]["h"]: best = ci
            return best

        # ---- one paragraph per Figma text box (re-flowed view) ----
        paras = []
        for ni, n in enumerate(nodes):
            ls = [l for l in dlines if l["node"] == ni]
            if not ls: continue
            rowsd = {}
            for l in ls: rowsd.setdefault(round(l["base"] / 3), []).append(l)
            rlist = [sorted(v, key=lambda l: l["x"]) for k, v in sorted(rowsd.items())]
            runs = []
            def add(text, r):
                if runs and all(runs[-1][k] == r[k] for k in ("fam", "w", "it", "color")) and abs(runs[-1]["size"] - r["size"]) < 0.3:
                    runs[-1]["text"] += text
                else: runs.append(dict(r, text=text))
            prev_w = None; prev_multi = False
            for ri, row in enumerate(rlist):
                first = "".join(r["text"] for r in row[0]["runs"])
                if ri > 0:
                    hard = (prev_w is not None and prev_w < n["w"] * 0.72) or first.startswith("•") or len(row) > 1 or prev_multi
                    sep = "\n" if hard else ("" if runs[-1]["text"].endswith(("-", "–")) else " ")
                    runs[-1]["text"] += sep
                for si_, seg in enumerate(row):
                    for j, r in enumerate(seg["runs"]):
                        add(((" " if si_ > 0 and j == 0 else "") + r["text"]), r)
                prev_w = row[-1]["x1"] - row[0]["x"]; prev_multi = len(row) > 1
            x0 = min(l["x"] for l in ls); x1 = max(l["x1"] for l in ls)
            cx = (x0 + x1) / 2
            centred = len(rlist) > 1 and max(r[0]["x"] for r in rlist) - min(r[0]["x"] for r in rlist) > 8 and \
                      max(abs((r[0]["x"] + r[-1]["x1"]) / 2 - cx) for r in rlist) < 12
            card = card_of(cx, (ls[0]["base"] + ls[-1]["base"]) / 2 - ls[0]["size"] / 3)
            if card is not None:
                c = cards[card]
                if abs(cx - (c["x"] + c["w"] / 2)) < 12 and (x1 - x0) < c["w"] * 0.85: centred = True
            paras.append(dict(runs=runs, card=card, x0=x0, x1=x1, top=min(l["base"] for l in ls) - ls[0]["size"],
                              size=max(l["size"] for l in ls), align="center" if centred else "left"))
        paras.sort(key=lambda p: (round(p["top"]), p["x0"]))

        # ---- photos / renders for the re-flowed view ----
        kept = []
        if not visual:
            for k, im in enumerate(images):
                x0, y0, x1, y1 = im["bbox"]
                if not (in_frame(y0 + 2, fy, fh) or in_frame(y1 - 2, fy, fh)): continue
                x0, x1 = max(0, x0), min(1920, x1); y0, y1 = max(fy, y0), min(fy + fh, y1)
                w, h = x1 - x0, y1 - y0
                if w * h < 9000 or w < 60 or h < 60 or (w > 1880 and h > fh - 20): continue
                y = y0 - fy
                crop = bg.crop((round(x0 * SC), round(y * SC), round(x1 * SC), round((y + h) * SC)))
                if detail(crop) < 6: continue
                if any(abs(x0 - q["x"]) < 8 and abs(y - q["y"]) < 8 for q in kept): continue
                nm = f"f{name}-i{k}"
                if crop.width > 900: crop = crop.resize((900, round(crop.height * 900 / crop.width)), Image.LANCZOS)
                save(crop, nm, 80)
                kept.append(dict(x=round(x0), y=round(y), w=round(w), h=round(h), src=f"/img/cs/{nm}.webp", ar=round(w / h, 4), card=card_of(x0 + w / 2, y + h / 2, w * h)))

        save(bg, f"f{name}-2x", 78)
        save(bg.resize((1920, round(fh)), Image.LANCZOS), f"f{name}", 80)

        small = bg.resize((96, max(2, round(96 * fh / 1920))))
        border = [small.getpixel((x, 1)) for x in range(96)] + [small.getpixel((x, small.height - 2)) for x in range(96)]
        bghex = "#%02x%02x%02x" % max(set(border), key=border.count)
        title_line = next((l for l in dlines if l["size"] >= 55), None)
        title = "".join(r["text"] for r in title_line["runs"]).strip() if title_line else ""
        baked = []
        if visual:
            for n in NODES.get(name, []):
                if n in nodes: continue
                cs = [c for c in fchars if n["x"] - 4 <= c["ox"] <= n["x"] + n["w"] + 4 and n["y"] - 4 <= c["y"] - c["size"] * 0.35 <= n["y"] + n["h"] + 4]
                t = "".join(c["c"] for c in sorted(cs, key=lambda c: (round(c["y"] / 8), c["ox"]))).strip()
                if t: baked.append(" ".join(t.split()))

        out_frames.append(dict(
            id=name, h=fh, visual=visual, bg=bghex, title=title,
            lines=[dict(x=round(l["x"], 1), base=round(l["base"], 1), runs=l["runs"]) for l in dlines],
            paras=[dict(runs=p["runs"], card=p["card"], x=round(p["x0"]), y=round(p["top"]), x1=round(p["x1"]), size=p["size"], align=p["align"]) for p in paras],
            cards=[dict(fill=c["fill"], op=c["op"], x=round(c["x"]), y=round(c["y"]), w=round(c["w"]), h=round(c["h"])) for c in cards],
            images=kept, links=LINKS.get(name, []), baked=baked[:20]))
        print(slug, name, "lines", len(dlines), "paras", len(paras), "imgs", len(kept), flush=True)
    json.dump(dict(slug=slug, frames=out_frames), open(f"{OUT_DATA}/{slug}.json", "w"), ensure_ascii=False)
