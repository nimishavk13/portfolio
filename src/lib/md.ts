// Tiny inline formatter for case-study copy: **bold** and ==highlight==.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const md = (s: string) =>
  esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/==(.+?)==/g, '<mark class="hl">$1</mark>');
