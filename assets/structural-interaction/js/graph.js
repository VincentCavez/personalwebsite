// graph.js
// Figure 1 as a static inline SVG: four nodes and the eight connection types.
// Each arrow carries its description written next to it (no interactivity, no examples).

import { graphEdges } from "./data.js";

// Node centers in the SVG coordinate space.
const NODES = {
    "User": { x: 150, y: 80, color: "var(--user)" },
    "Element": { x: 610, y: 80, color: "var(--element)" },
    "Imperative Rule": { x: 150, y: 360, color: "var(--imperative)" },
    "Declarative Rule": { x: 610, y: 360, color: "var(--declarative)" }
};

const NODE_W = 160;
const NODE_H = 56;

// Per-edge geometry: path, marker color (by source), and the label placed beside the arrow.
// Labels are split into lines by hand so they sit cleanly next to each arrow.
const EDGE_GEO = {
    a: {
        d: "M150 108 L150 332", color: "var(--user)", marker: "user",
        label: { x: 162, y: 200, anchor: "start", lines: ["The user triggers", "imperative rules."] }
    },
    h: {
        d: "M230 80 L530 80", color: "var(--user)", marker: "user",
        label: { x: 380, y: 42, anchor: "middle", lines: ["The user perceives elements,", "closing the interaction loop."] }
    },
    b: {
        d: "M214 348 L548 112", color: "var(--imperative)", marker: "imp",
        label: { x: 430, y: 182, anchor: "middle", lines: ["Imperative rules", "act on elements."] }
    },
    c: {
        d: "M230 360 L530 360", color: "var(--imperative)", marker: "imp",
        label: { x: 380, y: 346, anchor: "middle", lines: ["Imperative rules act on declarative rules."] }
    },
    d: {
        d: "M110 388 C 90 432, 210 432, 190 388", color: "var(--imperative)", marker: "imp",
        label: { x: 150, y: 452, anchor: "middle", lines: ["Imperative rules act on", "other imperative rules."] }
    },
    e: {
        d: "M610 332 L610 108", color: "var(--declarative)", marker: "dec",
        label: { x: 598, y: 200, anchor: "end", lines: ["Declarative rules", "constrain elements."] }
    },
    f: {
        d: "M570 388 C 550 432, 670 432, 650 388", color: "var(--declarative)", marker: "dec",
        label: { x: 610, y: 452, anchor: "middle", lines: ["Declarative rules constrain", "other declarative rules."] }
    },
    g: {
        d: "M530 380 L230 380", color: "var(--declarative)", marker: "dec",
        label: { x: 380, y: 400, anchor: "middle", lines: ["Declarative rules constrain imperative rules."] }
    }
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
        '<g class="si-node">' +
        '<rect x="' + x + '" y="' + y + '" width="' + NODE_W + '" height="' + NODE_H + '" rx="12" fill="' + n.color + '"></rect>' +
        '<text x="' + n.x + '" y="' + (n.y + 4) + '" text-anchor="middle">' + label + "</text>" +
        "</g>"
    );
}

function labelMarkup(label) {
    const tspans = label.lines
        .map((ln, i) => '<tspan x="' + label.x + '" dy="' + (i === 0 ? 0 : 14) + '">' + ln + "</tspan>")
        .join("");
    return (
        '<text class="si-edge-text" x="' + label.x + '" y="' + label.y + '" text-anchor="' + label.anchor + '">' +
        tspans +
        "</text>"
    );
}

function edgeMarkup(edge, withLabels) {
    const g = EDGE_GEO[edge.id];
    return (
        '<g class="si-edge-group">' +
        '<path class="si-edge" d="' + g.d + '" fill="none" stroke="' + g.color + '" stroke-width="2" marker-end="url(#si-arrow-' + g.marker + ')"></path>' +
        (withLabels ? labelMarkup(g.label) : "") +
        "</g>"
    );
}

function buildSVG(withLabels) {
    return (
        '<svg viewBox="0 0 760 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Directed graph of the user interface: the user triggers imperative rules and perceives elements; imperative rules act on elements, declarative rules and other imperative rules; declarative rules constrain elements, imperative rules and other declarative rules.">' +
        markerDefs() +
        graphEdges.map(e => edgeMarkup(e, withLabels)).join("") +
        Object.keys(NODES).map(nodeMarkup).join("") +
        "</svg>"
    );
}

export function initGraph(root) {
    if (!root) return;
    root.innerHTML = buildSVG(true);
}

// A non-interactive reduced copy for the hero background (no labels, kept uncluttered).
export function initGraphPreview(root) {
    if (!root) return;
    root.innerHTML = buildSVG(false);
}
