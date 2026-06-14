// graph.js
// Figure 1 as an interactive inline SVG: four nodes and the eight connection types.
// Readable without JS; JS adds hover/focus highlighting and the edge description.

import { graphEdges } from "./data.js";

// Node centers in the SVG coordinate space.
const NODES = {
    "User": { x: 130, y: 80, color: "var(--user)" },
    "Element": { x: 510, y: 80, color: "var(--element)" },
    "Imperative Rule": { x: 130, y: 320, color: "var(--imperative)" },
    "Declarative Rule": { x: 510, y: 320, color: "var(--declarative)" }
};

const NODE_W = 156;
const NODE_H = 56;

// Per-edge geometry: path, label position, and the marker color (by source).
const EDGE_GEO = {
    a: { d: "M130 108 L130 292", color: "var(--user)", marker: "user", lx: 140, ly: 205 },
    h: { d: "M208 80 L432 80", color: "var(--user)", marker: "user", lx: 320, ly: 70 },
    b: { d: "M188 294 L452 106", color: "var(--imperative)", marker: "imp", lx: 300, ly: 192 },
    c: { d: "M208 310 L432 310", color: "var(--imperative)", marker: "imp", lx: 320, ly: 300 },
    d: { d: "M108 348 C 84 404, 160 404, 138 350", color: "var(--imperative)", marker: "imp", lx: 120, ly: 398 },
    e: { d: "M510 108 L510 292", color: "var(--declarative)", marker: "dec", lx: 520, ly: 205 },
    f: { d: "M488 348 C 464 404, 540 404, 518 350", color: "var(--declarative)", marker: "dec", lx: 500, ly: 398 },
    g: { d: "M432 332 L208 332", color: "var(--declarative)", marker: "dec", lx: 320, ly: 348 }
};

function markerDefs() {
    const one = (id, color) =>
        '<marker id="si-arrow-' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="' + color + '"></path></marker>';
    return (
        "<defs>" +
        one("user", "var(--user)") +
        one("imp", "var(--imperative)") +
        one("dec", "var(--declarative)") +
        "</defs>"
    );
}

function nodeMarkup(label) {
    const n = NODES[label];
    const x = n.x - NODE_W / 2;
    const y = n.y - NODE_H / 2;
    return (
        '<g class="si-node" data-node="' + label + '">' +
        '<rect x="' + x + '" y="' + y + '" width="' + NODE_W + '" height="' + NODE_H + '" rx="12" fill="' + n.color + '"></rect>' +
        '<text x="' + n.x + '" y="' + (n.y + 4) + '" text-anchor="middle">' + label + "</text>" +
        "</g>"
    );
}

function edgeMarkup(edge) {
    const g = EDGE_GEO[edge.id];
    return (
        '<g class="si-edge-group" data-edge="' + edge.id + '" tabindex="0" role="img" aria-label="' + edge.text + '">' +
        '<path class="si-edge-hit" d="' + g.d + '"></path>' +
        '<path class="si-edge" d="' + g.d + '" fill="none" stroke="' + g.color + '" stroke-width="2" marker-end="url(#si-arrow-' + g.marker + ')"></path>' +
        '<text class="si-edge-label" x="' + g.lx + '" y="' + g.ly + '" text-anchor="middle">' + edge.id + "</text>" +
        "</g>"
    );
}

function buildSVG() {
    return (
        '<svg viewBox="0 0 640 410" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Directed graph of the user interface: users, rules and elements">' +
        markerDefs() +
        graphEdges.map(edgeMarkup).join("") +
        Object.keys(NODES).map(nodeMarkup).join("") +
        "</svg>"
    );
}

export function initGraph(root, caption) {
    if (!root) return;
    root.innerHTML = buildSVG();
    const svg = root.querySelector("svg");
    const groups = [...root.querySelectorAll(".si-edge-group")];

    function activate(id) {
        const edge = graphEdges.find(e => e.id === id);
        if (!edge) return;
        root.classList.add("is-dim");
        groups.forEach(gr => {
            const on = gr.dataset.edge === id;
            gr.querySelector(".si-edge").classList.toggle("is-active", on);
        });
        // light up the endpoint nodes
        root.querySelectorAll(".si-node").forEach(nd => {
            const on = nd.dataset.node === edge.from || nd.dataset.node === edge.to;
            nd.classList.toggle("is-active", on);
        });
        if (caption) caption.textContent = "(" + id + ") " + edge.text;
    }

    function clear() {
        root.classList.remove("is-dim");
        root.querySelectorAll(".is-active").forEach(el => el.classList.remove("is-active"));
        if (caption) caption.textContent = "Hover an edge or a label to read its role.";
    }

    groups.forEach(gr => {
        gr.addEventListener("mouseenter", () => activate(gr.dataset.edge));
        gr.addEventListener("mouseleave", clear);
        gr.addEventListener("focus", () => activate(gr.dataset.edge));
        gr.addEventListener("blur", clear);
    });

    return svg;
}

// A non-interactive reduced copy for the hero background.
export function initGraphPreview(root) {
    if (!root) return;
    root.innerHTML = buildSVG();
}
