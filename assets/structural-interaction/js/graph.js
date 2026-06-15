// graph.js
// Figure 1 as a static inline SVG, matching the poster's directed graph:
// a diamond of light-filled nodes (User left, Imperative top, Declarative bottom, Element right),
// six edges labeled with their verb in the edge color, and a dotted "perceives" arrow.

import { graphEdges } from "./data.js";

// Nodes: light tint fill, colored border and colored text (poster style).
const NODES = {
    "User": { cx: 110, cy: 210, w: 132, h: 58, fill: "#FBF4DE", color: "var(--user)", lines: ["User"] },
    "Element": { cx: 690, cy: 210, w: 152, h: 58, fill: "#DFF1E6", color: "var(--element)", lines: ["Element"] },
    "Imperative Rule": { cx: 400, cy: 95, w: 190, h: 76, fill: "#FCE6E0", color: "var(--imperative)", lines: ["Imperative", "Rule"] },
    "Declarative Rule": { cx: 400, cy: 330, w: 200, h: 76, fill: "#E1E9FB", color: "var(--declarative)", lines: ["Declarative", "Rule"] }
};

// The six edges shown on the poster (the two self-loops are omitted there).
// Verb text is pulled from graphEdges by id.
const EDGES = [
    { id: "a", d: "M150 182 L314 121", color: "var(--user)", marker: "user", label: { x: 224, y: 142, anchor: "middle" } },
    { id: "b", d: "M494 113 L618 185", color: "var(--imperative)", marker: "imp", label: { x: 566, y: 138, anchor: "middle" } },
    { id: "c", d: "M385 133 L385 292", color: "var(--imperative)", marker: "imp", label: { x: 350, y: 216, anchor: "end" } },
    { id: "g", d: "M415 292 L415 133", color: "var(--declarative)", marker: "dec", label: { x: 450, y: 216, anchor: "start" } },
    { id: "e", d: "M497 320 L620 234", color: "var(--declarative)", marker: "dec", label: { x: 566, y: 300, anchor: "middle" } },
    { id: "h", d: "M110 240 L110 410 L690 410 L690 241", color: "var(--muted-color)", marker: "perc", label: { x: 400, y: 400, anchor: "middle" }, dash: true }
];

function markerDefs() {
    const one = (id, color) =>
        '<marker id="si-arrow-' + id + '" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="' + color + '"></path></marker>';
    return (
        "<defs>" +
        one("user", "var(--user)") +
        one("imp", "var(--imperative)") +
        one("dec", "var(--declarative)") +
        one("perc", "var(--muted-color)") +
        "</defs>"
    );
}

function nodeMarkup(name) {
    const n = NODES[name];
    const x = n.cx - n.w / 2;
    const y = n.cy - n.h / 2;
    let text;
    if (n.lines.length === 1) {
        text = '<text x="' + n.cx + '" y="' + (n.cy + 6) + '" text-anchor="middle" fill="' + n.color + '" font-weight="700" font-size="17">' + n.lines[0] + "</text>";
    } else {
        text =
            '<text x="' + n.cx + '" y="' + (n.cy - 7) + '" text-anchor="middle" fill="' + n.color + '" font-size="15" font-style="italic" font-weight="600">' + n.lines[0] + "</text>" +
            '<text x="' + n.cx + '" y="' + (n.cy + 16) + '" text-anchor="middle" fill="' + n.color + '" font-size="15" font-weight="700">' + n.lines[1] + "</text>";
    }
    return (
        '<g class="si-node">' +
        '<rect x="' + x + '" y="' + y + '" width="' + n.w + '" height="' + n.h + '" rx="10" fill="' + n.fill + '" stroke="' + n.color + '" stroke-width="2.5"></rect>' +
        text +
        "</g>"
    );
}

function edgeMarkup(e) {
    const verb = (graphEdges.find(g => g.id === e.id) || {}).verb || "";
    const dash = e.dash ? ' stroke-dasharray="8 7" stroke-linecap="round"' : "";
    return (
        '<g class="si-edge-group">' +
        '<path class="si-edge" d="' + e.d + '" fill="none" stroke="' + e.color + '" stroke-width="2.5" marker-end="url(#si-arrow-' + e.marker + ')"' + dash + "></path>" +
        '<text class="si-edge-text" x="' + e.label.x + '" y="' + e.label.y + '" text-anchor="' + e.label.anchor + '" fill="' + e.color + '">' + verb + "</text>" +
        "</g>"
    );
}

function buildSVG() {
    return (
        '<svg viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Directed graph: the user triggers imperative rules and perceives elements; imperative rules act on elements and declarative rules; declarative rules constrain imperative rules and elements.">' +
        markerDefs() +
        EDGES.map(edgeMarkup).join("") +
        Object.keys(NODES).map(nodeMarkup).join("") +
        "</svg>"
    );
}

export function initGraph(root) {
    if (!root) return;
    root.innerHTML = buildSVG();
}
