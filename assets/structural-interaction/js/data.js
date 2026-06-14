// data.js

export const paper = {
  title: "Structural Interaction: Shifting the Focus of User Interface Design",
  venue: "DIS Companion '26, Singapore (June 13 to 17, 2026)",
  doi: "10.1145/3802974.3809476",
  doiUrl: "https://doi.org/10.1145/3802974.3809476",
  acmUrl: "https://dl.acm.org/doi/10.1145/3802974.3809476",
  pdfUrl: "https://vincentcavez.com/pdf/Structural_Interaction_Theory.pdf",
  authors: [
    { name: "Vincent Cavez", affiliation: "Stanford University", url: "https://www.vincentcavez.com/" },
    { name: "Kashif Imteyaz", affiliation: "Northeastern University", url: "" },
    { name: "Anne-Flore Cabouat", affiliation: "Universite Paris-Saclay, Inria, Telecom Paris", url: "" }
  ]
};

export const dimensions = {
  rigidity: {
    label: "Rigidity",
    summary: "How much a rule can be shaped (system control to user control).",
    values: [
      { value: "fixed", definition: "Immutable: no other rule can modify it.", example: "Email schema in Outlook (requires sender, recipient, subject, body)." },
      { value: "negotiable", definition: "Can be relaxed within bounds but not redefined.", example: "Volume limiter on iOS (adjust the max within a fixed range)." },
      { value: "malleable", definition: "Can be redefined entirely by the user.", example: "Custom keyboard shortcut in Photoshop." },
      { value: "authorable", definition: "The user can create rules that did not previously exist.", example: "New interaction behaviors in a visual programming environment." }
    ]
  },
  enforcement: {
    label: "Enforcement",
    summary: "How much a rule can yield during interaction (unyielding to yielding).",
    values: [
      { value: "persistent", definition: "Does not yield.", example: "A minimum panel width that blocks hard at its limit." },
      { value: "elastic", definition: "Yields under pressure but restores itself.", example: "Magnetic timeline in Final Cut Pro (clips resist gaps, re-snap on release)." },
      { value: "escapable", definition: "Tolerates momentary bypass.", example: "Indentation in VS Code (manual spacing overrides it locally)." },
      { value: "liftable", definition: "Can be removed temporarily or indefinitely.", example: "Spell-check in Word (disabled for a document)." }
    ]
  }
};

// rows = rigidity, cols = enforcement
export const cells = [
  { rigidity: "fixed", enforcement: "persistent", name: "Email structure", tool: "Outlook / Gmail", detail: "Schema is immutable, no field can be bypassed or removed." },
  { rigidity: "fixed", enforcement: "elastic", name: "Element positioning", tool: "Sibelius", detail: "Layout rules are immutable, magnetic snapping, restores default alignment." },
  { rigidity: "fixed", enforcement: "escapable", name: "Spreadsheet grid", tool: "Excel", detail: "Grid logic is immutable, paste-special and direct in-cell editing can bypass dependencies." },
  { rigidity: "fixed", enforcement: "liftable", name: "Read-only mode", tool: "Word", detail: "Protection behavior is immutable, toggling it off lifts all editing constraints entirely." },

  { rigidity: "negotiable", enforcement: "persistent", name: "Volume limiter", tool: "iOS", detail: "Maximum level is adjustable within a fixed range, limit blocks hard, never yields." },
  { rigidity: "negotiable", enforcement: "elastic", name: "Magnetic timeline", tool: "Final Cut Pro", detail: "Snap strength adjustable, clips resist gaps, re-snap on release." },
  { rigidity: "negotiable", enforcement: "escapable", name: "Indentation", tool: "VS Code", detail: "Tab size is adjustable within presets, manual spacing bypasses the rule momentarily." },
  { rigidity: "negotiable", enforcement: "liftable", name: "Spell-check", tool: "Word", detail: "Language and strictness are adjustable within presets, disableable entirely." },

  { rigidity: "malleable", enforcement: "persistent", name: "Keyboard shortcuts", tool: "Photoshop", detail: "Shortcuts are entirely reassignable, once set always active, never yields." },
  { rigidity: "malleable", enforcement: "elastic", name: "Layout guides", tool: "Illustrator", detail: "User creates guides, alignment constraints activate, release when elements move away." },
  { rigidity: "malleable", enforcement: "escapable", name: "Slide layouts", tool: "Keynote", detail: "Layouts are entirely redefinable, manual repositioning overrides on a single slide." },
  { rigidity: "malleable", enforcement: "liftable", name: "Auto-layout", tool: "Figma", detail: "Constraints are entirely redefinable, auto-layout removable entirely." },

  { rigidity: "authorable", enforcement: "persistent", name: "Custom constraints", tool: "Fusion 360", detail: "User creates novel geometric constraints, solver blocks violations, never yields." },
  { rigidity: "authorable", enforcement: "elastic", name: "Scroll-snap", tool: "CSS", detail: "Developer defines custom snap points, scrolling overshoots, snaps back on release." },
  { rigidity: "authorable", enforcement: "escapable", name: "Macros", tool: "Excel", detail: "User creates novel macros, Ctrl+Break can interrupt their execution." },
  { rigidity: "authorable", enforcement: "liftable", name: "Filters", tool: "Gmail", detail: "User creates novel filtering rules, disableable entirely." }
];

// Figure 1 : 8 connection types (a to h)
export const graphEdges = [
  { id: "a", from: "User", to: "Imperative Rule", verb: "triggers", text: "The user triggers imperative rules." },
  { id: "b", from: "Imperative Rule", to: "Element", verb: "acts on", text: "Imperative rules act on elements." },
  { id: "c", from: "Imperative Rule", to: "Declarative Rule", verb: "acts on", text: "Imperative rules act on declarative rules (e.g. a shortcut toggling snap-to-grid)." },
  { id: "d", from: "Imperative Rule", to: "Imperative Rule", verb: "acts on", text: "Imperative rules act on other imperative rules." },
  { id: "e", from: "Declarative Rule", to: "Element", verb: "constrains", text: "Declarative rules constrain elements." },
  { id: "f", from: "Declarative Rule", to: "Declarative Rule", verb: "constrains", text: "Declarative rules constrain other declarative rules." },
  { id: "g", from: "Declarative Rule", to: "Imperative Rule", verb: "constrains", text: "Declarative rules constrain imperative rules (e.g. read-only mode prevents execution)." },
  { id: "h", from: "User", to: "Element", verb: "perceives", text: "The user perceives elements, closing the interaction loop." }
];

export const useCases = [
  {
    id: "spreadsheets",
    title: "Restoring escapability: spreadsheets on tablets",
    figure: "figures/figure2.png",
    figureAlt: "With one or two pen marks, users select substrings matching a pattern across cells in a column.",
    before: {
      label: "Problem",
      states: [{ structure: "Grid", rigidity: "fixed", enforcement: "persistent" }],
      text: "On desktop the grid is (fixed, escapable): immutable logic, yet nearly every rule tolerates momentary bypass (paste-special, in-cell text editing). On tablets, touch input removed those escape mechanisms, shifting specific rules to (fixed, persistent). The same rules now block hard where they used to yield."
    },
    after: {
      label: "Solution",
      states: [{ structure: "Grid", rigidity: "fixed", enforcement: "escapable" }],
      text: "Pen-based interactions enable fluid character-level selection across cell boundaries, temporarily disabling the grid's declarative rules and restoring escapable enforcement without altering its fixed rigidity."
    }
  },
  {
    id: "scorewriting",
    title: "Relaxing rigidity and enforcement: creative expression in score writing",
    figure: "figures/figure3.png",
    figureAlt: "Carving a pensieve by stretching space between two staves, then populating it with objects via drag and drop.",
    before: {
      label: "Problem",
      states: [
        { structure: "Musical rules", rigidity: "fixed", enforcement: "persistent" },
        { structure: "Positioning rules", rigidity: "fixed", enforcement: "elastic" }
      ],
      text: "Score-writing tools split into two sub-structures: musical rules (pitch spelling, rhythm, voice leading) are (fixed, persistent), and positioning rules (placement, bar spacing) are (fixed, elastic). This configuration hinders exploration: composers must either work within full notation enforcement or abandon digital structure for paper."
    },
    after: {
      label: "Solution",
      states: [
        { structure: "Musical rules", rigidity: "negotiable", enforcement: "persistent" },
        { structure: "Positioning rules", rigidity: "fixed", enforcement: "liftable" }
      ],
      text: "EuterPen targets each sub-structure independently. Musical rules shift from fixed to negotiable (freeform areas where notation relaxes and handwritten sketches coexist, keeping playback, search, and conversion). Positioning rules shift from elastic to liftable (elements move freely under the pen, alignment reapplied by the composer when ready). The perceived relaxation decomposes into two independent design moves."
    }
  }
];

export const abstract = "User interfaces rely on rules that govern how users create, organize, and transform content. We call these rules structure. While structure enables functionality, its rigid enforcement often conflicts with user intentions, particularly in productivity and creative workflows. As generative systems increasingly produce and adapt structure on behalf of users, there is a clear need for a vocabulary to reason about structural behavior. We introduce Structural Interaction, a framework that makes structure a primary object of design. We model the user interface as a directed graph of elements and rules, and characterize rule behavior along two orthogonal dimensions: rigidity (how much a rule can be shaped) and enforcement (how much it can yield during interaction). Four values per dimension generate a 16-cell design space. Through two use cases, we show how the framework diagnoses structural limitations in existing interfaces and guides the design of solutions operating independently on each dimension.";
