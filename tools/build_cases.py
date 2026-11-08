"""
Builds case-study data + images.

Sources
  • tools/figma_text_*.json  – every portfolio text box exported from Figma: position, size,
                                alignment, resize mode and styled segments (exact characters,
                                font, size, colour, line height, letter spacing, lists, links)
  • tools/figma_breaks.txt    – soft line breaks (Shift+Enter) inside those boxes
  • the Figma page exported as PDF – the artwork (rendered, then the live text is erased),
                                cards and photos for the phone layout

Outputs per frame
  public/img/cs/f<frame>.webp, f<frame>-2x.webp   artwork without the live text (visual frames: full artwork)
  public/img/cs/f<frame>-i<k>.webp                photos / renders used in the phone layout
  src/data/cases/<project>.json                   text boxes, cards, images, links
"""
import io, json, os, sys
import numpy as np, cv2
import pymupdf as fitz
from PIL import Image, ImageFilter, ImageStat

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get("PORTFOLIO_ROOT", os.path.dirname(HERE))
SITE = os.environ.get("PORTFOLIO_SITE", os.path.join(ROOT, "site") if os.path.isdir(os.path.join(ROOT, "site")) else ROOT)
PDF = os.environ.get("PORTFOLIO_PDF", "/mnt/user-data/uploads/Portfolio/Nimisha VK_UI_UX Portfolio_Project 1 (Copy).pdf")
OUT_IMG = f"{SITE}/public/img/cs"
OUT_DATA = f"{SITE}/src/data/cases"
os.makedirs(OUT_IMG, exist_ok=True); os.makedirs(OUT_DATA, exist_ok=True)
SC = 1.5

PROJECTS = {
  "little-roots": ["6","7","8","9","10","11","12","13","14","15","32","16","17","18","19","20","21","22","23"],
  "mentora": ["24","25","26","27","28","29","30","31","33","34","35"],
  "hormona": ["36","37","38","39","40","41","42","43","44","45","46"],
  "yeola-paithani": ["47","48","49","50","51","52","53","54","55"],
}
VISUAL = {"13", "31", "16", "34", "45", "32", "33", "44"}
LINKS = {
  "23": ["https://www.figma.com/proto/mU3JDRZJ8VPeDcVYWr1uVQ/Final-A5--Copy-?node-id=8-20097&viewport=285%2C224%2C0.07&t=jl8uyahJPrtSMfgx-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=8%3A17387&page-id=2%3A16345"],
  "35": ["https://www.figma.com/proto/9Jqd5fiTflACqzREWqvM4F/CVD-Wireframes?node-id=492-588&t=SuDHkPgo883Pk5xZ-1"],
  "46": ["https://www.figma.com/proto/1X3GogtbJxRTaOYn6xtefD/Perimenopause-Prototype?node-id=12-23&viewport=437%2C125%2C0.06&t=uXWgSBBQjbpdCp7W-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1",
         "https://www.figma.com/proto/lqlFhbzrh5PMQOYhERLFIE/Postpartum-Prototype?page-id=0%3A1&node-id=1-31&viewport=40%2C107%2C0.12&t=KaMvBpT6CO7QCAi7-1&scaling=scale-down&content-scaling=fixed"],
  "55": ["https://www.figma.com/proto/oyiSOTGyBavKK5icRH3Cdq/Paithani?node-id=2-2&t=jdp4zjp7xFA9s4oS-1"],
}
FAM = {"P": "Poppins", "F": "Figtree", "K": "Parkinsans", "S": "League Spartan"}
WEIGHT = {"Thin": 100, "ExtraLight": 200, "Light": 300, "Regular": 400, "Medium": 500, "SemiBold": 600,
          "Semi Bold": 600, "Bold": 700, "ExtraBold": 800, "Black": 900}

frames = {f[0]: (f[2], f[3]) for f in json.load(open(f"{HERE}/frames.json"))}
only = set(sys.argv[1:])
ONLY_FRAMES = set(filter(None, os.environ.get("FRAMES", "").split(",")))
TEXT_ONLY = os.environ.get("TEXT_ONLY") == "1"  # re-read Figma text, keep the rendered artwork

# ---------- Figma text ----------
TEXT = {}
for part in "abc":
    TEXT.update(json.load(open(f"{HERE}/figma_text_{part}.json")))
for line in open(f"{HERE}/figma_breaks.txt"):
    if not line.strip(): continue
    key, *idx = line.split(); fr, xy = key.split("@"); x, y = map(int, xy.split(","))
    node = next(n for n in TEXT[fr] if n[0] == x and n[1] == y)
    pos = 0
    want = sorted(int(i) for i in idx)
    for s in node[6]:  # soft breaks arrived as spaces: turn those spaces back into line breaks
        t = list(s[0])
        for i in want:
            if pos <= i < pos + len(t) and t[i - pos] == " ": t[i - pos] = "\n"
        pos += len(s[0]); s[0] = "".join(t)

def style_of(seg):
    text, font, size, col, lh, ls, lst, case, und = seg
    fam_code, _, style = font.partition("|")
    fam = FAM.get(fam_code[0]) if not fam_code.startswith("x:") else fam_code[2:]
    italic = "Italic" in style
    w = WEIGHT.get(style.replace("Italic", "").strip() or "Regular", 400)
    return dict(fam=fam, w=w, it=italic, size=size, color="#" + col.split("@")[0], lh=lh, ls=ls, list=lst == "U", link=bool(und))

def node_lines(node):
    """Split a Figma text box into lines (by line breaks), each a list of styled runs."""
    lines = [dict(runs=[], list=False)]
    for seg in node[6]:
        st = style_of(seg)
        # Figma: "\r\n" and U+2028 break the line; a lone "\r" renders as a space
        text = seg[0].replace("\r\n", "\n").replace("\r", " ").replace(" ", "\n")
        parts = text.split("\n")
        for i, p in enumerate(parts):
            if i > 0: lines.append(dict(runs=[], list=False))
            if p:
                lines[-1]["runs"].append(dict(st, text=p))
                if st["list"]: lines[-1]["list"] = True
    while lines and not lines[-1]["runs"]: lines.pop()
    for l in lines:
        for r in l["runs"]: r.pop("list", None)
    return lines

# ---------- PDF artwork ----------
doc = fitz.open(PDF); page = doc[0]
# glyph boxes of the portfolio fonts (PDF Type3 font objects identified in Figma) – used to erase text tightly
PORTFOLIO_FONTS = {4798, 5292, 5740, 6240, 6700, 7204, 10214, 10712, 11692, 12692, 13196, 13676, 14148, 15666, 18688,
                   21180, 22176, 23186, 23672, 24676, 25528, 27052, 27522, 29048, 30062, 30568, 31582, 32086, 32602, 33070, 34040}
GLYPHS = []
for b in page.get_text("rawdict")["blocks"]:
    for l in b.get("lines", []):
        for sp in l["spans"]:
            fid = int(sp["font"].split("(")[1].split()[0]) if "(" in sp["font"] else 0
            if fid not in PORTFOLIO_FONTS: continue
            for ch in sp["chars"]:
                x0, y0, x1, y1 = ch["bbox"]
                if ch["c"].strip() and x1 - x0 > 0.3: GLYPHS.append((x0, y0, x1, y1))
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

def erase(img, boxes):
    """boxes: (x0, y0, x1, y1, [text rgb, …]). Remove only the glyph pixels (matched by colour) inside each box."""
    arr = np.array(img).astype(np.int16)
    H, W = arr.shape[:2]
    allmask = np.zeros((H, W), np.uint8)
    for x0, y0, x1, y1, _ in boxes:
        allmask[max(0, int(y0 * SC) - 2):int(y1 * SC) + 2, max(0, int(x0 * SC) - 2):int(x1 * SC) + 2] = 1
    inp = np.zeros((H, W), np.uint8)
    out = arr.copy()
    for x0, y0, x1, y1, cols in boxes:
        X0, Y0 = max(0, int(x0 * SC) - 3), max(0, int(y0 * SC) - 3)
        X1, Y1 = min(W, int(x1 * SC) + 3), min(H, int(y1 * SC) + 3)
        if X1 <= X0 or Y1 <= Y0: continue
        sub = arr[Y0:Y1, X0:X1].astype(float)
        d_tx = np.min([np.linalg.norm(sub - np.array(c, float), axis=2) for c in cols], axis=0)
        core = (d_tx < 16).astype(np.uint8)                      # glyph cores: (almost) exactly the text colour
        k = 3 if (y1 - y0) < 40 else 5 if (y1 - y0) < 80 else 7
        m = cv2.dilate(core, np.ones((k, k), np.uint8))          # plus their anti-aliased edges
        rest = sub[m == 0]
        if not len(rest): continue
        flat = rest.std(axis=0).max() < 8
        if flat:
            out[Y0:Y1, X0:X1][m > 0] = np.median(rest, axis=0)
        elif (y1 - y0) < 120:  # tight glyph box over artwork: rebuild the whole glyph area
            inp[Y0:Y1, X0:X1] = 1
        else:
            inp[Y0:Y1, X0:X1] = np.maximum(inp[Y0:Y1, X0:X1], m)
    out = out.clip(0, 255).astype(np.uint8)
    if inp.any(): out = cv2.inpaint(out, inp * 255, 4, cv2.INPAINT_TELEA)
    return Image.fromarray(out)

def pick_card(cards, x, y, area=0):
    """Smallest card under the point; of near-identical stacked shapes, the one painted last (on top)."""
    hits = [ci for ci, c in enumerate(cards)
            if c["x"] - 3 <= x <= c["x"] + c["w"] + 3 and c["y"] - 3 <= y <= c["y"] + c["h"] + 3 and c["w"] * c["h"] > area * 1.05]
    if not hits: return None
    smallest = min(cards[ci]["w"] * cards[ci]["h"] for ci in hits)
    return max(ci for ci in hits if cards[ci]["w"] * cards[ci]["h"] <= smallest * 2)

def in_frame(y, fy, fh): return fy - 1 <= y < fy + fh

for slug, names in PROJECTS.items():
    if only and slug not in only: continue
    out_frames = []
    for name in names:
        if ONLY_FRAMES and name not in ONLY_FRAMES: continue
        fy, fh = frames[name]
        visual = name in VISUAL
        nodes = TEXT.get(name, [])
        if TEXT_ONLY:
            prev = next(f for f in json.load(open(f"{OUT_DATA}/{slug}.json"))["frames"] if f["id"] == name)
        full = None if TEXT_ONLY else render(0, fy, 1920, fy + fh, SC)

        boxes, tnodes = [], []
        for n in nodes:
            x, y, w, h, align, resize, segs = n
            lines = node_lines(n)
            if not lines: continue
            cols = sorted({tuple(int(r["color"][i:i + 2], 16) for i in (1, 3, 5)) for l in lines for r in l["runs"]})
            gl = [g for g in GLYPHS if x - 4 <= (g[0] + g[2]) / 2 <= x + w + 4 and fy + y - 4 <= (g[1] + g[3]) / 2 <= fy + y + h + 4]
            nchars = sum(len(r["text"].replace(" ", "")) for l in lines for r in l["runs"])
            if gl and len(gl) >= nchars * 0.9:  # erase glyph by glyph, so markers, arcs and icons inside the box survive
                for g in gl: boxes.append((g[0] - 1.5, g[1] - fy - 1, g[2] + 1.5, g[3] - fy + 1, cols))
            elif all(r["fam"] == "League Spartan" for l in lines for r in l["runs"]):
                boxes.append((x + w * 0.2, y + h * 0.15, x + w * 0.8, y + h * 0.6, cols))
            else:
                boxes.append((x - 2, y - 2, x + w + 2, y + h + 2, cols))
            size = max(r["size"] for l in lines for r in l["runs"])
            tnodes.append(dict(x=x, y=y, w=w, h=h, align={"L": "left", "C": "center", "R": "right", "J": "justify"}[align],
                               resize=resize, size=size, lines=lines))
        if TEXT_ONLY:
            links = LINKS.get(name, []); li = 0
            cards = prev["cards"]
            for t in tnodes:
                if any(r.get("link") for l in t["lines"] for r in l["runs"]) and li < len(links):
                    t["href"] = links[li]; li += 1
                for l in t["lines"]:
                    for r in l["runs"]: r.pop("link", None)
                t["card"] = pick_card(cards, t["x"] + min(t["w"], 600) / 2, t["y"] + min(t["h"], 200) / 2)
            for im in prev["images"]:
                im["card"] = pick_card(cards, im["x"] + im["w"] / 2, im["y"] + im["h"] / 2, im["w"] * im["h"])
            out_frames.append(dict(prev, nodes=tnodes))
            continue
        bg = full if visual else erase(full, boxes)

        links = LINKS.get(name, []); li = 0
        for t in tnodes:
            if any(r.get("link") for l in t["lines"] for r in l["runs"]) and li < len(links):
                t["href"] = links[li]; li += 1
            for l in t["lines"]:
                for r in l["runs"]: r.pop("link", None)

        cards = []
        for dr in drawings:
            if dr.get("fill") is None or dr.get("type") not in ("f", "fs") or len(dr["items"]) > 14: continue
            r = dr["rect"]
            if not in_frame(r.y0 + 1, fy, fh): continue
            w, h = r.width, r.height
            if w * h < 25000 or w > 1880 or h > fh - 20 or w < 120 or h < 60: continue
            col = "#%02x%02x%02x" % tuple(round(c * 255) for c in dr["fill"][:3])
            if col == "#000000": continue
            c = dict(x=round(r.x0), y=round(r.y0 - fy), w=round(w), h=round(h), fill=col, op=round(dr.get("fill_opacity", 1) or 1, 2))
            if not any(abs(c["x"] - u["x"]) < 3 and abs(c["y"] - u["y"]) < 3 and abs(c["w"] - u["w"]) < 3 for u in cards):
                cards.append(c)
        def card_of(x, y, area=0):
            return pick_card(cards, x, y, area)
        for t in tnodes:
            t["card"] = card_of(t["x"] + min(t["w"], 600) / 2, t["y"] + min(t["h"], 200) / 2, 0)

        kept = []
        if not visual:
            for k, im in sorted(enumerate(images), key=lambda t: -(t[1]["bbox"][2] - t[1]["bbox"][0]) * (t[1]["bbox"][3] - t[1]["bbox"][1])):
                x0, y0, x1, y1 = im["bbox"]
                if y1 <= fy + 2 or y0 >= fy + fh - 2: continue
                x0, x1 = max(0, x0), min(1920, x1); y0, y1 = max(fy, y0), min(fy + fh, y1)
                w, h = x1 - x0, y1 - y0
                if w * h < 9000 or w < 60 or h < 60 or (w > 1880 and h > fh - 20): continue
                y = y0 - fy
                crop = bg.crop((round(x0 * SC), round(y * SC), round(x1 * SC), round((y + h) * SC)))
                dt = detail(crop)
                a = np.array(crop.resize((64, 64))).reshape(-1, 3).astype(int) // 12
                dom = np.unique(a, axis=0, return_counts=True)[1].max() / len(a)
                if dt < 9 or dom > 0.45: continue
                if max(w, h) < 140 and dom > 0.32: continue
                if any(q["x"] - 4 <= x0 and q["y"] - 4 <= y and x0 + w <= q["x"] + q["w"] + 4 and y + h <= q["y"] + q["h"] + 4 for q in kept): continue
                nm = f"f{name}-i{k}"
                if crop.width > 900: crop = crop.resize((900, round(crop.height * 900 / crop.width)), Image.LANCZOS)
                save(crop, nm, 80)
                kept.append(dict(x=round(x0), y=round(y), w=round(w), h=round(h), src=f"/img/cs/{nm}.webp", card=card_of(x0 + w / 2, y + h / 2, w * h)))
            kept.sort(key=lambda q: (q["y"], q["x"]))

        save(bg, f"f{name}-2x", 78)
        save(bg.resize((1920, round(fh)), Image.LANCZOS), f"f{name}", 80)
        small = bg.resize((96, max(2, round(96 * fh / 1920))))
        border = [small.getpixel((x, 1)) for x in range(96)] + [small.getpixel((x, small.height - 2)) for x in range(96)]
        bghex = "#%02x%02x%02x" % max(set(border), key=border.count)
        title = next(("".join(r["text"] for l in t["lines"] for r in l["runs"]).strip() for t in tnodes if t["size"] >= 55), "")

        out_frames.append(dict(id=name, h=fh, visual=visual, bg=bghex, title=title, nodes=tnodes, cards=cards, images=kept))
        print(slug, name, "boxes", len(tnodes), "imgs", len(kept), flush=True)

    path = f"{OUT_DATA}/{slug}.json"
    if ONLY_FRAMES and os.path.exists(path):
        old = json.load(open(path))["frames"]; new = {f["id"]: f for f in out_frames}
        out_frames = [new.get(f["id"], f) for f in old]
    json.dump(dict(slug=slug, frames=out_frames), open(path, "w"), ensure_ascii=False)
