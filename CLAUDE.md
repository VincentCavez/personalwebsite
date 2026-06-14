# CLAUDE.md

Instructions de build pour Claude Code. Lis ce fichier en entier avant toute action. Ce fichier est autonome : il contient tout le contenu nécessaire (section « Données de contenu »).

---

## Ce qu'on construit

Une **page projet web** pour l'article *Structural Interaction: Shifting the Focus of User Interface Design*, **intégrée au site perso statique existant** comme sous-page, sur le modèle des pages projet de Damien Masson (`https://damienmasson.com/projects/chameleon.html`).

Le papier est théorique, donc **les widgets interactifs sont la démo**. Trois pièces interactives portent la page (voir « Composants interactifs »).

---

## Contraintes dures (non négociables)

1. **Style d'écriture** : ne jamais utiliser de tiret cadratin ni demi-cadratin (em dash, en dash) nulle part, ni dans le texte de la page ni dans les commentaires de code. Utiliser des parenthèses pour les incises.
2. **Intégration au site existant** : ne pas réinventer de shell. **Première étape obligatoire** : ouvrir une page projet existante du repo et la prendre comme gabarit (son `head`, ses polices, ses feuilles de style, son header/nav, son footer, sa structure de conteneur). Mirror ses conventions. Si le site utilise un générateur statique (Jekyll, Eleventy, Hugo, build maison), suivre cette convention plutôt que du HTML brut.
3. **Chemins relatifs** uniquement (la page vit sous `/projects/...`).
4. **CSS scoping** : tout le style des composants interactifs dans une feuille dédiée, classes préfixées `.si-`, pour ne jamais entrer en collision avec la feuille de style du site.
5. **Vanilla** : HTML / CSS / JS, aucun framework, aucune dépendance npm ajoutée, aucun build step propre au-delà de ce que le site utilise déjà. SVG inline pour les schémas, transforms CSS pour les démos.
6. **Texte de la page en anglais** (le papier et la venue sont internationaux). Ce fichier d'instructions est en français, c'est normal.

---

## Où vont les fichiers

- **Ce fichier** (`CLAUDE.md`) : racine du repo.
- **La page** : `projects/structural-interaction.html` (dossier `projects/` à la racine, à côté de `index.html`). Si des pages projet existent déjà ailleurs, suivre cet emplacement.
- **Les assets** (à adapter à l'arborescence du site) :
  ```
  assets/structural-interaction/
    css/si.css        # styles des composants, classes .si-
    js/data.js        # donnees de contenu (section dediee plus bas)
    js/explorer.js    # explorateur 16 cases
    js/sandbox.js     # bac a sable panneau redimensionnable
    js/graph.js       # graphe oriente
    js/usecases.js    # toggles avant/apres
    js/main.js        # init, scrollspy interne, bouton copier BibTeX
    figures/          # fig1, fig2, fig3 extraites du PDF
    og-image.png      # optionnel (sinon reutiliser celle du site)
  ```
- **Le PDF du papier** est déjà hébergé sur le site : le lier, ne pas le dupliquer (voir `paper.pdfUrl`).

---

## Faits du projet

- Titre : Structural Interaction: Shifting the Focus of User Interface Design
- Auteurs : Vincent Cavez (Stanford University), Kashif Imteyaz (Northeastern University), Anne-Flore Cabouat (Université Paris-Saclay, Inria, Télécom Paris)
- Venue : DIS Companion '26, Singapore (June 13 to 17, 2026)
- DOI : 10.1145/3802974.3809476
- ACM DL : https://dl.acm.org/doi/10.1145/3802974.3809476
- PDF : https://www.vincentcavez.com/Structural_Interaction_Theory.pdf (remplacer par le chemin relatif du repo si disponible)

---

## Sections de la page (dans l'ordre)

1. **Header / nav du site** : repris du gabarit existant.
2. **Title block** : titre, venue + date, auteurs avec affiliations et liens.
3. **Hero / teaser** : tagline + bouton « Explore the framework » qui scrolle vers l'explorateur. Tagline : *Structure is not merely something interfaces have; it is something interfaces do.* Aperçu réduit non interactif du graphe (ou grille 4x4) en fond.
4. **Links bar** : Paper (PDF), ACM DL (DOI), et « Related projects » (EuterPen, spreadsheets + pen).
5. **TL;DR** : voir « Données de contenu ».
6. **The framework** : (a) defining structure (éléments + règles déclaratives / impératives), (b) graphe orienté interactif, (c) les deux dimensions Rigidity et Enforcement, chacune un axe à 4 crans avec définition au survol.
7. **The 16-cell design space** : explorateur interactif. Centre de la page.
8. **Feel the rule** : bac à sable panneau redimensionnable.
9. **The framework in practice** : deux études de cas, toggles avant/après + figures.
10. **Why it matters** : voir « Données de contenu ».
11. **Abstract** : abstract complet.
12. **Cite** : BibTeX avec bouton « Copy ».
13. **Footer** : repris du site.

---

## Composants interactifs

Priorité : 1 et 2 sont les pièces signature, à faire en premier et à soigner. 3 et 4 renforcent et peuvent suivre.

### 1. Explorateur de l'espace de design 16 cases (PIÈCE MAÎTRESSE)

Rendre la Table 1 vivante, piloté par `cells` dans `data.js`.

- Grille **4x4**. Lignes = **Rigidity** (haut vers bas : fixed, negotiable, malleable, authorable, du contrôle système vers le contrôle utilisateur). Colonnes = **Enforcement** (gauche vers droite : persistent, elastic, escapable, liftable, du non cédant vers le cédant).
- Chaque case : nom de la sous-structure + outil (ex. « Spreadsheet grid / Excel »).
- Au survol ou focus clavier : panneau de détail (à côté sur desktop, dessous sur mobile) avec le nom complet, le couple `(rigidity, enforcement)` en deux badges colorés, et l'explication (`detail`).
- En-têtes d'axes survolables : définition de la dimension et de chaque valeur (depuis `dimensions`).
- Encodage 2D subtil optionnel (ne jamais dégrader le contraste du texte).
- Clavier : flèches entre cases, Entrée pour fixer ; chaque case est un bouton avec `aria-label` décrivant son couple.
- Mobile : grille lisible (réduire le texte, ou accordéon par ligne de Rigidity), détail dessous.

### 2. Bac à sable « Feel the rule » : panneau redimensionnable (SIGNATURE)

Faire ressentir les valeurs d'Enforcement, puisque le papier parle de la façon dont une règle réagit quand on pousse contre elle. Métaphore : **un panneau redimensionnable avec une largeur minimale** (exemple littéral du papier pour `persistent`).

Terrain : un split horizontal avec un **séparateur draggable** (souris et tactile). Le panneau de gauche a une largeur ; une **ligne de limite** discrète marque le minimum. On tire le séparateur vers la gauche, poussant le panneau contre son minimum.

**Contrôle Enforcement (4 crans)**, change le comportement de la limite en direct :

- `persistent` : le séparateur bute net, rien ne passe.
- `elastic` : on peut pousser sous le minimum tant qu'on maintient (résistance visible), retour au minimum au relâchement.
- `escapable` : la limite résiste, mais en franchissant un seuil (distance ou vitesse) ou avec une touche modificatrice (ex. Alt), le séparateur passe et reste où on le lâche ; la limite réapparaît au geste suivant.
- `liftable` : un interrupteur retire la limite entièrement, le panneau se replie librement.

**Contrôle Rigidity (4 crans)**, change ce qu'on peut faire à la règle elle-même :

- `fixed` : limite verrouillée, on ne fait que la subir.
- `negotiable` : on déplace la limite, mais seulement entre deux bornes.
- `malleable` : on place la limite où on veut.
- `authorable` : on ajoute une contrainte qui n'existait pas (ex. une largeur maximale en plus).

Libellé en direct annonçant le couple courant, ex. « (fixed, elastic): the minimum width is locked, and the divider springs back when released. »

Implémentation : largeur en état JS, tween ressort pour `elastic`, seuil/modificateur pour `escapable`, toggle pour `liftable`, poignée draggable sur la limite pour la Rigidity. Respecter `prefers-reduced-motion`. **Si le temps manque, livrer l'axe Enforcement seul d'abord**, Rigidity ensuite.

### 3. Graphe orienté de l'UI (Figure 1 interactive)

SVG reproduisant le modèle : nœuds User, Imperative Rule, Declarative Rule, Element, et les 8 connexions (a à h). Au survol/focus d'une arête ou d'une étiquette : surligner l'arête et afficher sa description (depuis `graphEdges`). Couleurs sémantiques (User ambre, Imperative corail, Declarative bleu, Element vert). Lisible sans JS, le JS ajoute les états de survol.

### 4. Études de cas avant/après

Pour chaque étude de cas, un toggle « Problem / Solution » qui échange l'image, les badges de couples d'états et la phrase d'explication (depuis `useCases`). Pas d'animation lourde.

---

## Données de contenu

Mets ce bloc tel quel dans `assets/structural-interaction/js/data.js`.

```js
// data.js

export const paper = {
  title: "Structural Interaction: Shifting the Focus of User Interface Design",
  venue: "DIS Companion '26, Singapore (June 13 to 17, 2026)",
  doi: "10.1145/3802974.3809476",
  doiUrl: "https://doi.org/10.1145/3802974.3809476",
  acmUrl: "https://dl.acm.org/doi/10.1145/3802974.3809476",
  pdfUrl: "https://www.vincentcavez.com/Structural_Interaction_Theory.pdf",
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
```

### TL;DR (langage clair, gras sur les mots-clés)

> User interfaces run on **rules** that decide how you create, organize, and transform content. We call those rules **structure**. Structural Interaction makes structure a **first-class design object** and describes how any rule behaves along two independent axes: **rigidity** (how much a rule can be shaped) and **enforcement** (how much it yields when you push against it). Four values per axis give a **16-cell design space** for diagnosing and designing interfaces.

### Why it matters (prose, 3 points)

1. **Precise diagnosis.** Once rigidity and enforcement are separated, you can tell apart problems that look identical. "This tool is too rigid" often conflates two independent properties that need different fixes.
2. **Complements existing models.** Where DIRA decomposes interfaces into parts and interaction substrates define adjustable environments, the state couple specifies how each individual rule should respond during interaction.
3. **A vocabulary for generative UIs.** When an LLM produces and evolves structure at runtime, rigidity and enforcement give users and systems a shared language for how much structure should yield, when, and under whose control. A candidate future dimension is **agentivity** (how control over imperative rules is distributed across the user, the system, and generative agents).

### BibTeX

Reconstruit depuis le format de référence ACM du papier (fait autorité). L'export ACM DL ajoute `isbn` et `articleno` : Vincent les fournira.

```bibtex
@inproceedings{cavez2026structural,
  author    = {Cavez, Vincent and Imteyaz, Kashif and Cabouat, Anne-Flore},
  title     = {Structural Interaction: Shifting the Focus of User Interface Design},
  year      = {2026},
  publisher = {Association for Computing Machinery},
  address   = {New York, NY, USA},
  url       = {https://doi.org/10.1145/3802974.3809476},
  doi       = {10.1145/3802974.3809476},
  booktitle = {Designing Interactive Systems Conference (DIS Companion '26)},
  series    = {DIS Companion '26},
  location  = {Singapore, Singapore},
  numpages  = {5}
}
```

### Related projects (barre de liens)

- EuterPen (CHI '25) : https://doi.org/10.1145/3706598.3713488
- Spreadsheets on Interactive Surfaces, pen + grid (TOCHI 2024) : https://doi.org/10.1145/3630097

---

## Direction artistique

**Le look global vient du site existant** : reprendre polices, tailles, fonds, couleurs de texte, marges. La page doit ressembler aux autres pages projet du site. Pas de bandeaux de couleur décoratifs, pas de filet sous les titres.

Les couleurs sémantiques ne servent qu'aux composants interactifs (badges, nœuds du graphe, en-têtes d'axes), en accents, dans le scope `.si-` :

```css
.si-scope {
  --user: #E0A23C;        /* User (ambre) */
  --imperative: #DD6B4F;  /* Imperative rule (corail) */
  --declarative: #3E6BD6; /* Declarative rule (bleu) */
  --element: #3DA35D;     /* Element (vert) */
  --rigidity: #3E6BD6;
  --enforcement: #DD6B4F;
}
```

Motif récurrent : la grille et les couples d'états. Réutiliser les badges `(rigidity, enforcement)` partout (explorateur, études de cas). Les composants interactifs peuvent s'élargir au-delà de la colonne de lecture ; garder de l'air ; mettre l'explorateur en avant.

---

## Accessibilité et responsive

- HTML sémantique (`section`, `figure`, `figcaption`).
- Tous les composants utilisables au clavier, focus visible.
- `aria-label` sur les cases de l'explorateur et les contrôles du bac à sable.
- Contraste AA minimum (attention aux badges colorés).
- `prefers-reduced-motion: reduce` : couper ou réduire ressorts et transitions.
- Tester à 360px, 768px, 1200px. Grille 16 cases exploitable sur mobile.
- Reprendre les meta Open Graph / Twitter du gabarit, ajuster titre, description (= TL;DR) et `og:image`.

---

## Assets à extraire / fournir

Extraire du PDF et placer dans `figures/` :

- **Figure 1** : graphe orienté (référence pour le SVG du composant 3).
- **Figure 2** : sélection au stylo à travers les cellules (use case 1).
- **Figure 3** : EuterPen, espace étiré entre portées (use case 2).

À confirmer avec Vincent : chemin relatif du PDF dans le repo, pages perso des co-auteurs, `isbn` et `articleno` pour le BibTeX, `og-image` dédiée ou non.

---

## Ordre de build

1. **Shell** : créer la page en reprenant le gabarit d'une page projet existante (head, nav, footer, conteneur). Chemins relatifs. `si.css` vide scoping `.si-`. Poser la structure des sections, title block, links bar, blocs vides. Pas d'interactivité encore.
2. **Data layer** : `data.js` avec le bloc ci-dessus.
3. **Explorateur 16 cases** rendu depuis les données. Pièce maîtresse, à soigner.
4. **Bac à sable** : panneau redimensionnable, Enforcement d'abord, Rigidity ensuite.
5. **Graphe orienté** SVG avec survol.
6. **Études de cas** avec toggles avant/après et figures.
7. **Finitions** : scrollspy interne, bouton « Copy » BibTeX (Clipboard API + retour visuel), meta OG, contraste, focus.
8. **QA** (voir ci-dessous).

Commiter à chaque jalon. Garder le code lisible et commenté (sans tirets cadratins ni demi-cadratins dans les commentaires).

---

## Lancer et vérifier (QA)

- Servir la racine du site en local (souvent `python3 -m http.server`, ou la commande de dev du générateur) et ouvrir `/projects/structural-interaction.html`.
- Vérifier : aucun texte qui déborde, le clavier sur chaque composant, `prefers-reduced-motion`, le rendu à 360 / 768 / 1200px, et que le shell colle visuellement aux autres pages du site.
- Vérifier qu'aucun chemin absolu ne traîne (tout doit fonctionner sous le sous-chemin `/projects/`).
