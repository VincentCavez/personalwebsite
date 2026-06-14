// main.js
// Initializes the page: title block, links bar, the two-dimension cards, the abstract,
// every interactive component, the internal scrollspy, and the Copy BibTeX button.

import { paper, abstract } from "./data.js";
import { initExplorer } from "./explorer.js";
import { initSandbox } from "./sandbox.js";
import { initGraph } from "./graph.js";
import { initUseCases } from "./usecases.js";

// Related projects shown in the links bar.
const RELATED = [
    { label: "EuterPen (CHI '25)", url: "https://doi.org/10.1145/3706598.3713488" },
    { label: "EunomInk (ToCHI 2024)", url: "https://doi.org/10.1145/3630097" }
];

function renderAuthors() {
    const el = document.getElementById("si-authors");
    if (!el) return;
    el.innerHTML = paper.authors
        .map(a => {
            const name = a.url
                ? '<a class="si-author-name" href="' + a.url + '">' + a.name + "</a>"
                : '<span class="si-author-name">' + a.name + "</span>";
            return name + ' <span class="si-author-aff">(' + a.affiliation + ")</span>";
        })
        .join(", ");
}

function renderLinksBar() {
    const el = document.getElementById("si-linksbar");
    if (!el) return;
    let html =
        '<a class="si-link" href="' + paper.pdfUrl + '"><i class="fa fa-file-pdf"></i> Paper (PDF)</a>' +
        '<a class="si-link" href="' + paper.doiUrl + '"><i class="fa fa-external-link"></i> DOI</a>' +
        '<span class="si-link-group-label">Related projects:</span>';
    html += RELATED.map(r => '<a class="si-link" href="' + r.url + '">' + r.label + "</a>").join("");
    el.innerHTML = html;
}

function renderAbstract() {
    const el = document.getElementById("si-abstract");
    if (el) el.textContent = abstract;
}

function initCopyBibtex() {
    const btn = document.getElementById("si-copy-bibtex");
    const pre = document.getElementById("si-bibtex");
    if (!btn || !pre) return;
    const label = btn.querySelector(".si-copy-label");
    btn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(pre.textContent);
        } catch (err) {
            // Fallback for browsers without the async clipboard API.
            const r = document.createRange();
            r.selectNode(pre);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(r);
            document.execCommand("copy");
            sel.removeAllRanges();
        }
        btn.classList.add("is-copied");
        label.textContent = "Copied";
        setTimeout(() => {
            btn.classList.remove("is-copied");
            label.textContent = "Copy";
        }, 1600);
    });
}

function initScrollspy() {
    const links = [...document.querySelectorAll(".si-nav-link")];
    if (!links.length || !("IntersectionObserver" in window)) return;
    const byId = new Map(links.map(l => [l.getAttribute("href").slice(1), l]));
    const sections = [...byId.keys()].map(id => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    links.forEach(l => l.classList.remove("is-current"));
                    const link = byId.get(entry.target.id);
                    if (link) link.classList.add("is-current");
                }
            });
        },
        { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(s => obs.observe(s));
}

function boot() {
    renderAuthors();
    renderLinksBar();
    renderAbstract();

    initGraph(document.getElementById("si-graph"));
    initExplorer(document.getElementById("si-explorer"));
    initSandbox(document.getElementById("si-sandbox"));
    initUseCases(document.getElementById("si-usecases"));

    initCopyBibtex();
    initScrollspy();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
} else {
    boot();
}
