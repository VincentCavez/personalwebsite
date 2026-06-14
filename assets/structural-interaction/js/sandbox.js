// sandbox.js
// "Feel the rule": a resizable panel with a minimum width.
// Enforcement controls how the limit yields when you push the divider against it.
// Rigidity controls what you can do to the limit itself.

import { coupleBadges } from "./explorer.js";
import { dimensions } from "./data.js";

const ENFORCEMENT_ORDER = dimensions.enforcement.values.map(v => v.value);
const RIGIDITY_ORDER = dimensions.rigidity.values.map(v => v.value);

const ESCAPE_THRESHOLD = 60; // px past the limit before an escapable rule lets go
const DIVIDER_W = 10;
const RIGHT_MIN = 36; // keep the right panel visible

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Clauses describing how the rule behaves, composed into the live readout.
const RIG_CLAUSE = {
    fixed: "the minimum width is locked",
    negotiable: "the minimum width can be moved within bounds",
    malleable: "the minimum width can be placed anywhere",
    authorable: "you can add a maximum width on top of the minimum"
};
const ENF_CLAUSE = {
    persistent: "the divider blocks hard at the limit",
    elastic: "the divider gives under pressure and springs back on release",
    escapable: "the divider slips past once you push far enough or hold Alt",
    liftable: "the limit can be switched off entirely"
};

export function initSandbox(root) {
    if (!root) return;

    root.innerHTML =
        '<div class="si-sandbox-stage" id="si-stage">' +
        '  <div class="si-panel" id="si-panel">panel</div>' +
        '  <div class="si-divider" id="si-divider" role="separator" tabindex="0" aria-orientation="vertical" aria-label="Resize the panel. Use left and right arrows."></div>' +
        '  <div class="si-panel-right">content</div>' +
        '  <div class="si-limit-line" id="si-limit-min"></div>' +
        '  <div class="si-limit-grab" id="si-limit-grab" title="Drag to move the limit"></div>' +
        '  <div class="si-limit-line si-limit-max is-hidden" id="si-limit-max"></div>' +
        '  <div class="si-limit-grab is-hidden" id="si-limit-grab-max" title="Drag to move the maximum"></div>' +
        '</div>' +
        '<div class="si-sandbox-controls">' +
        '  <div class="si-control si-control--enforcement">' +
        '    <h3>Enforcement</h3>' +
        '    <div class="si-segmented" id="si-enf"></div>' +
        '    <div class="si-liftable-row is-hidden" id="si-lift-row">' +
        '      <label><input type="checkbox" id="si-lift"> Remove the limit</label>' +
        '    </div>' +
        '    <p class="si-control-hint" id="si-enf-hint"></p>' +
        '  </div>' +
        '  <div class="si-control si-control--rigidity">' +
        '    <h3>Rigidity</h3>' +
        '    <div class="si-segmented" id="si-rig"></div>' +
        '    <p class="si-control-hint" id="si-rig-hint"></p>' +
        '  </div>' +
        '</div>' +
        '<div class="si-sandbox-readout" id="si-readout" aria-live="polite"></div>';

    const stage = root.querySelector("#si-stage");
    const panel = root.querySelector("#si-panel");
    const divider = root.querySelector("#si-divider");
    const limitMin = root.querySelector("#si-limit-min");
    const limitGrab = root.querySelector("#si-limit-grab");
    const limitMax = root.querySelector("#si-limit-max");
    const limitGrabMax = root.querySelector("#si-limit-grab-max");
    const liftRow = root.querySelector("#si-lift-row");
    const liftBox = root.querySelector("#si-lift");
    const readout = root.querySelector("#si-readout");

    const state = {
        enforcement: "persistent",
        rigidity: "fixed",
        width: 0,
        minLimit: 0,
        maxLimit: 0,
        lifted: false
    };

    function stageWidth() {
        return stage.getBoundingClientRect().width;
    }

    // Initialise absolute pixel values from fractions once the stage has a width.
    function layout() {
        const sw = stageWidth();
        if (!sw) return;
        state.minLimit = Math.round(sw * 0.32);
        state.maxLimit = Math.round(sw * 0.78);
        state.width = Math.round(sw * 0.55);
        applyWidth(state.width, false);
        applyLimits();
    }

    function maxPanel() {
        return stageWidth() - DIVIDER_W - RIGHT_MIN;
    }

    function applyWidth(w, animate) {
        const clamped = Math.max(0, Math.min(w, maxPanel()));
        state.width = clamped;
        panel.style.flex = "0 0 auto";
        panel.style.transition = animate && !reduceMotion ? "width 0.28s ease" : "none";
        panel.style.width = clamped + "px";
        panel.textContent = Math.round(clamped) + " px";
    }

    function applyLimits() {
        const showMin = !(state.enforcement === "liftable" && state.lifted);
        limitMin.classList.toggle("is-hidden", !showMin);
        limitMin.style.left = state.minLimit + "px";

        // The limit grab handle is only draggable when rigidity allows it.
        const canMove = state.rigidity === "negotiable" || state.rigidity === "malleable" || state.rigidity === "authorable";
        limitGrab.classList.toggle("is-hidden", !canMove || !showMin);
        limitGrab.style.left = state.minLimit + "px";

        const authorable = state.rigidity === "authorable";
        limitMax.classList.toggle("is-hidden", !authorable);
        limitGrabMax.classList.toggle("is-hidden", !authorable);
        limitMax.style.left = state.maxLimit + "px";
        limitGrabMax.style.left = state.maxLimit + "px";
    }

    // ---- Divider drag (enforcement behavior) ----
    let escaped = false; // escapable: whether this gesture has already slipped past

    function desiredFromPointer(clientX) {
        return clientX - stage.getBoundingClientRect().left;
    }

    function resolveWidth(desired, altKey) {
        const min = state.minLimit;
        const authorable = state.rigidity === "authorable";
        let w = desired;

        if (state.enforcement === "liftable" && state.lifted) {
            w = desired; // limit removed, collapse freely
        } else if (state.enforcement === "persistent" || (state.enforcement === "liftable" && !state.lifted)) {
            w = Math.max(desired, min); // hard stop
        } else if (state.enforcement === "elastic") {
            // yields under pressure with visible resistance, restored on release
            w = desired < min ? min - (min - desired) * 0.35 : desired;
        } else if (state.enforcement === "escapable") {
            if (escaped) {
                w = desired;
            } else if (desired < min) {
                if (min - desired > ESCAPE_THRESHOLD || altKey) {
                    escaped = true;
                    w = desired;
                } else {
                    w = min; // resist
                }
            } else {
                w = desired;
            }
        }

        if (authorable) w = Math.min(w, state.maxLimit); // the added max constraint
        return w;
    }

    function startDividerDrag(e) {
        e.preventDefault();
        escaped = false;
        const move = ev => {
            const p = ev.touches ? ev.touches[0] : ev;
            applyWidth(resolveWidth(desiredFromPointer(p.clientX), ev.altKey), false);
        };
        const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            // Elastic restores to the limit when released.
            if (state.enforcement === "elastic" && state.width < state.minLimit) {
                applyWidth(state.minLimit, true);
            }
            escaped = false;
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    }

    divider.addEventListener("pointerdown", startDividerDrag);

    divider.addEventListener("keydown", e => {
        const step = e.shiftKey ? 24 : 8;
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            applyWidth(resolveWidthKeyboard(state.width - step, e.altKey), false);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            applyWidth(resolveWidthKeyboard(state.width + step, e.altKey), false);
        }
    });

    // Keyboard nudge respects the limit but cannot trip the escape threshold by distance,
    // so Alt is offered as the explicit escape for escapable rules.
    function resolveWidthKeyboard(desired, altKey) {
        if (state.enforcement === "escapable" && altKey) escaped = true;
        const w = resolveWidth(desired, altKey);
        escaped = false;
        return w;
    }

    // ---- Limit grab drag (rigidity behavior) ----
    function startLimitDrag(which) {
        return e => {
            if (state.rigidity === "fixed") return;
            e.preventDefault();
            const sw = stageWidth();
            const move = ev => {
                const p = ev.touches ? ev.touches[0] : ev;
                let x = p.clientX - stage.getBoundingClientRect().left;
                if (which === "min") {
                    if (state.rigidity === "negotiable") {
                        x = Math.max(sw * 0.15, Math.min(x, sw * 0.45)); // bounded
                    } else {
                        x = Math.max(0, Math.min(x, sw - DIVIDER_W)); // anywhere
                    }
                    state.minLimit = Math.round(x);
                } else {
                    x = Math.max(state.minLimit + 20, Math.min(x, sw - DIVIDER_W));
                    state.maxLimit = Math.round(x);
                }
                applyLimits();
                // keep the panel consistent with the new limit
                applyWidth(resolveWidth(state.width, false), false);
            };
            const up = () => {
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", up);
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
        };
    }

    limitGrab.addEventListener("pointerdown", startLimitDrag("min"));
    limitGrabMax.addEventListener("pointerdown", startLimitDrag("max"));

    // ---- Segmented controls ----
    function buildSegmented(container, values, current, onPick) {
        container.innerHTML = "";
        values.forEach(v => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = v;
            b.classList.toggle("is-selected", v === current);
            b.addEventListener("click", () => {
                onPick(v);
                [...container.children].forEach(c => c.classList.toggle("is-selected", c === b));
            });
            container.appendChild(b);
        });
    }

    buildSegmented(root.querySelector("#si-enf"), ENFORCEMENT_ORDER, state.enforcement, v => {
        state.enforcement = v;
        state.lifted = false;
        liftBox.checked = false;
        liftRow.classList.toggle("is-hidden", v !== "liftable");
        layoutClampAndRender();
    });

    buildSegmented(root.querySelector("#si-rig"), RIGIDITY_ORDER, state.rigidity, v => {
        state.rigidity = v;
        layoutClampAndRender();
    });

    liftBox.addEventListener("change", () => {
        state.lifted = liftBox.checked;
        layoutClampAndRender();
    });

    function layoutClampAndRender() {
        applyLimits();
        applyWidth(resolveWidth(state.width, false), false);
        render();
    }

    function render() {
        const hintR = dimensions.rigidity.values.find(x => x.value === state.rigidity);
        const hintE = dimensions.enforcement.values.find(x => x.value === state.enforcement);
        root.querySelector("#si-rig-hint").textContent = hintR.definition + " (" + hintR.example + ")";
        root.querySelector("#si-enf-hint").textContent = hintE.definition + " (" + hintE.example + ")";
        readout.innerHTML =
            coupleBadges(state.rigidity, state.enforcement) +
            '<p class="si-readout-text">(' + state.rigidity + ", " + state.enforcement + "): " +
            RIG_CLAUSE[state.rigidity] + ", and " + ENF_CLAUSE[state.enforcement] + ".</p>";
    }

    // Initial layout once the element is measurable.
    requestAnimationFrame(() => {
        layout();
        applyLimits();
        render();
    });

    // Keep limits proportional-ish on resize without fighting the user mid-drag.
    let resizeRaf = 0;
    window.addEventListener("resize", () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
            const sw = stageWidth();
            state.minLimit = Math.min(state.minLimit, sw - DIVIDER_W);
            state.maxLimit = Math.min(state.maxLimit, sw - DIVIDER_W);
            applyWidth(Math.min(state.width, maxPanel()), false);
            applyLimits();
        });
    });
}
