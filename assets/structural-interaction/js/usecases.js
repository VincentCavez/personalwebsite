// usecases.js
// Two before/after case studies. A Problem/Solution toggle swaps the inline SVG
// schematic, the state-couple badges, and the explanation sentence.

import { useCases } from "./data.js";
import { coupleBadges } from "./explorer.js";

// Lightweight SVG schematics drawn in the scoped palette (no raster figures).
const SCHEMATICS = {
    spreadsheets: {
        // grid where a selection is trapped inside a single cell
        problem:
            '<svg viewBox="0 0 320 160" role="img" aria-label="A selection trapped at a cell boundary on a spreadsheet grid">' +
            gridLines() +
            '<rect x="84" y="34" width="68" height="32" fill="rgba(221,107,79,0.18)" stroke="var(--enforcement)" stroke-dasharray="4 3"></rect>' +
            '<line x1="152" y1="28" x2="152" y2="72" stroke="var(--enforcement)" stroke-width="4"></line>' +
            cellText() +
            '<text x="160" y="150" text-anchor="middle" fill="var(--enforcement)" font-size="12" font-weight="600">selection blocks at the grid line</text>' +
            "</svg>",
        // pen stroke selecting substrings across cell boundaries
        solution:
            '<svg viewBox="0 0 320 160" role="img" aria-label="A pen stroke selecting substrings across cell boundaries">' +
            gridLines() +
            '<rect x="120" y="36" width="34" height="28" fill="rgba(61,163,93,0.22)"></rect>' +
            '<rect x="156" y="36" width="40" height="28" fill="rgba(61,163,93,0.22)"></rect>' +
            cellText() +
            '<path d="M112 50 C 150 30, 190 70, 210 46" fill="none" stroke="var(--element)" stroke-width="3" stroke-linecap="round"></path>' +
            '<text x="160" y="150" text-anchor="middle" fill="var(--element)" font-size="12" font-weight="600">the pen selects across the boundary</text>' +
            "</svg>"
    },
    scorewriting: {
        // two staves cramped together, rigid
        problem:
            '<svg viewBox="0 0 320 160" role="img" aria-label="Two music staves cramped close together">' +
            staff(30) + staff(96) +
            note(70, 30) + note(120, 96) + note(190, 30) +
            '<text x="160" y="150" text-anchor="middle" fill="var(--enforcement)" font-size="12" font-weight="600">fixed spacing, no room to sketch</text>' +
            "</svg>",
        // space carved between the staves, ink and an object in the gap
        solution:
            '<svg viewBox="0 0 320 160" role="img" aria-label="Space carved between two staves, filled with a sketch and an object">' +
            staff(22) + staff(118) +
            note(70, 22) + note(190, 22) +
            '<path d="M60 62 C 90 50, 110 80, 140 64 S 200 50, 230 70" fill="none" stroke="var(--element)" stroke-width="2.5" stroke-linecap="round"></path>' +
            '<rect x="200" y="56" width="40" height="26" rx="4" fill="none" stroke="var(--declarative)" stroke-width="2"></rect>' +
            '<text x="160" y="150" text-anchor="middle" fill="var(--element)" font-size="12" font-weight="600">space lifts open for free content</text>' +
            "</svg>"
    }
};

function gridLines() {
    let s = "";
    const x0 = 12, y0 = 28, cw = 74, ch = 32, cols = 4, rows = 3;
    for (let c = 0; c <= cols; c++) {
        const x = x0 + c * cw;
        s += '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + (y0 + rows * ch) + '" stroke="var(--declarative)" stroke-width="1.5" opacity="0.7"></line>';
    }
    for (let r = 0; r <= rows; r++) {
        const y = y0 + r * ch;
        s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + cols * cw) + '" y2="' + y + '" stroke="var(--declarative)" stroke-width="1.5" opacity="0.7"></line>';
    }
    return s;
}

function cellText() {
    return (
        '<text x="40" y="50" fill="#9a9ea6" font-size="12">A1</text>' +
        '<text x="120" y="50" fill="#9a9ea6" font-size="12">Smith</text>' +
        '<text x="200" y="50" fill="#9a9ea6" font-size="12">2026</text>'
    );
}

function staff(y) {
    let s = "";
    for (let i = 0; i < 5; i++) {
        s += '<line x1="20" y1="' + (y + i * 7) + '" x2="300" y2="' + (y + i * 7) + '" stroke="#9a9ea6" stroke-width="1"></line>';
    }
    return s;
}

function note(x, y) {
    return '<circle cx="' + x + '" cy="' + (y + 14) + '" r="5" fill="var(--imperative)"></circle>';
}

function statesMarkup(states) {
    return (
        '<div class="si-usecase-states">' +
        states
            .map(
                st =>
                    '<div class="si-usecase-state">' +
                    '<span class="si-state-name">' + st.structure + "</span>" +
                    coupleBadges(st.rigidity, st.enforcement) +
                    "</div>"
            )
            .join("") +
        "</div>"
    );
}

export function initUseCases(root) {
    if (!root) return;
    root.innerHTML = "";

    useCases.forEach(uc => {
        const card = document.createElement("section");
        card.className = "si-usecase";
        card.innerHTML =
            "<h3>" + uc.title + "</h3>" +
            '<div class="si-usecase-toggle" role="tablist">' +
            '<button type="button" role="tab" data-state="before" class="is-selected">' + uc.before.label + "</button>" +
            '<button type="button" role="tab" data-state="after">' + uc.after.label + "</button>" +
            "</div>" +
            '<div class="si-usecase-body">' +
            '<figure class="si-usecase-figure"></figure>' +
            '<div class="si-usecase-explain"></div>' +
            "</div>";

        const figure = card.querySelector(".si-usecase-figure");
        const explain = card.querySelector(".si-usecase-explain");
        const buttons = [...card.querySelectorAll(".si-usecase-toggle button")];

        function paint(stateKey) {
            const data = stateKey === "before" ? uc.before : uc.after;
            const svgKey = stateKey === "before" ? "problem" : "solution";
            figure.innerHTML = SCHEMATICS[uc.id][svgKey];
            explain.innerHTML = statesMarkup(data.states) + '<p class="si-prose" style="margin-top:0">' + data.text + "</p>";
            buttons.forEach(b => {
                const on = b.dataset.state === stateKey;
                b.classList.toggle("is-selected", on);
                b.setAttribute("aria-selected", on ? "true" : "false");
            });
        }

        buttons.forEach(b => b.addEventListener("click", () => paint(b.dataset.state)));
        paint("before");
        root.appendChild(card);
    });
}
