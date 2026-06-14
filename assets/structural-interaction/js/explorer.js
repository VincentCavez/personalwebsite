// explorer.js
// The 16-cell design space explorer (centerpiece).
// Renders the 4x4 grid from `cells`, with hover/focus detail and keyboard navigation.

import { cells, dimensions } from "./data.js";

const RIGIDITY_ORDER = dimensions.rigidity.values.map(v => v.value); // fixed -> authorable
const ENFORCEMENT_ORDER = dimensions.enforcement.values.map(v => v.value); // persistent -> liftable

// Shared badge markup for a (rigidity, enforcement) couple.
export function coupleBadges(rigidity, enforcement) {
    return (
        '<span class="si-couple">' +
        '<span class="si-badge si-badge--rigidity">' + rigidity + '</span>' +
        '<span class="si-badge si-badge--enforcement">' + enforcement + '</span>' +
        '</span>'
    );
}

function defOf(dimKey, value) {
    return dimensions[dimKey].values.find(v => v.value === value);
}

export function initExplorer(root) {
    if (!root) return;

    // Build the static scaffolding.
    root.innerHTML =
        '<div class="si-explorer-gridwrap">' +
        '  <div class="si-col-headers" role="presentation"></div>' +
        '  <div class="si-row-headers" role="presentation"></div>' +
        '  <div class="si-grid" role="grid" aria-label="Design space: rigidity by enforcement"></div>' +
        '</div>' +
        '<aside class="si-detail" aria-live="polite"></aside>';

    const colHeaders = root.querySelector(".si-col-headers");
    const rowHeaders = root.querySelector(".si-row-headers");
    const grid = root.querySelector(".si-grid");
    const detail = root.querySelector(".si-detail");

    // Column headers (enforcement).
    ENFORCEMENT_ORDER.forEach(value => {
        const def = defOf("enforcement", value);
        const el = document.createElement("div");
        el.className = "si-header-cell si-header-cell--col";
        el.tabIndex = 0;
        el.textContent = value;
        el.setAttribute("role", "columnheader");
        el.addEventListener("mouseenter", () => showDimension("enforcement", def));
        el.addEventListener("focus", () => showDimension("enforcement", def));
        colHeaders.appendChild(el);
    });

    // Row headers (rigidity).
    RIGIDITY_ORDER.forEach(value => {
        const def = defOf("rigidity", value);
        const el = document.createElement("div");
        el.className = "si-header-cell si-header-cell--row";
        el.tabIndex = 0;
        el.textContent = value;
        el.setAttribute("role", "rowheader");
        el.addEventListener("mouseenter", () => showDimension("rigidity", def));
        el.addEventListener("focus", () => showDimension("rigidity", def));
        rowHeaders.appendChild(el);
    });

    // Cells, in row-major order (rigidity rows, enforcement columns).
    const buttons = [];
    cells.forEach((cell, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "si-cell";
        btn.dataset.index = String(index);
        btn.setAttribute("role", "gridcell");
        btn.setAttribute(
            "aria-label",
            cell.name + " in " + cell.tool + ". Rigidity " + cell.rigidity + ", enforcement " + cell.enforcement + "."
        );
        // tab into the grid once, then arrow keys move within it.
        btn.tabIndex = index === 0 ? 0 : -1;

        const rIdx = RIGIDITY_ORDER.indexOf(cell.rigidity);
        const eIdx = ENFORCEMENT_ORDER.indexOf(cell.enforcement);
        const dotColor = eIdx >= rIdx ? "var(--enforcement)" : "var(--rigidity)";

        btn.innerHTML =
            '<span class="si-cell-dot" style="background:' + dotColor + '"></span>' +
            '<span class="si-cell-name">' + cell.name + '</span>' +
            '<span class="si-cell-tool">' + cell.tool + '</span>';

        btn.addEventListener("mouseenter", () => showCell(cell, btn));
        btn.addEventListener("focus", () => showCell(cell, btn));
        btn.addEventListener("click", () => pinCell(cell, btn));
        btn.addEventListener("keydown", e => onCellKey(e, index));

        grid.appendChild(btn);
        buttons.push(btn);
    });

    let pinnedBtn = null;

    function clearActive() {
        buttons.forEach(b => b.classList.remove("is-active"));
    }

    function showCell(cell, btn) {
        if (pinnedBtn) return; // a pinned cell stays shown until another is clicked
        renderDetail(cell, btn);
    }

    function pinCell(cell, btn) {
        pinnedBtn = btn;
        renderDetail(cell, btn);
    }

    function renderDetail(cell, btn) {
        clearActive();
        btn.classList.add("is-active");
        // Per-cell illustration from the project poster (vector SVG).
        // The figure removes itself if the file is missing.
        const figureSrc = "../assets/structural-interaction/figures/cells/" + cell.rigidity + "-" + cell.enforcement + ".svg";
        detail.innerHTML =
            "<h3>" + cell.name + "</h3>" +
            '<div class="si-detail-tool">' + cell.tool + "</div>" +
            coupleBadges(cell.rigidity, cell.enforcement) +
            '<figure class="si-detail-figure"><img src="' + figureSrc + '" alt="" loading="lazy" onerror="this.closest(\'.si-detail-figure\').remove()"></figure>' +
            '<p class="si-detail-text">' + cell.detail + "</p>";
    }

    function showDimension(dimKey, def) {
        if (pinnedBtn) return;
        clearActive();
        const dim = dimensions[dimKey];
        detail.innerHTML =
            "<h3>" + dim.label + " (" + def.value + ")</h3>" +
            '<p class="si-detail-text">' + def.definition + "</p>";
    }

    function onCellKey(e, index) {
        let next = index;
        if (e.key === "ArrowRight") next = (index % 4 === 3) ? index : index + 1;
        else if (e.key === "ArrowLeft") next = (index % 4 === 0) ? index : index - 1;
        else if (e.key === "ArrowDown") next = (index + 4 < 16) ? index + 4 : index;
        else if (e.key === "ArrowUp") next = (index - 4 >= 0) ? index - 4 : index;
        else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            pinCell(cells[index], buttons[index]);
            return;
        } else {
            return;
        }
        e.preventDefault();
        buttons[index].tabIndex = -1;
        buttons[next].tabIndex = 0;
        buttons[next].focus();
    }

    // Initial detail shows the first cell as a hint, nothing pinned.
    renderDetail(cells[0], buttons[0]);
    clearActive();
    detail.insertAdjacentHTML(
        "beforeend",
        '<p class="si-detail-hint">Hover or arrow through the grid. Press Enter to pin a cell.</p>'
    );
}
