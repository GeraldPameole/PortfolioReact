# Charte graphique

> Système de design du portfolio. Tous les tokens sont définis dans `src/styles/global.css`. Le site est en **dark mode unique** (pas de toggle clair/sombre).

## 1. Palette

### Fonds (du plus sombre au moins sombre)
| Token | Valeur | Usage |
|---|---|---|
| `--bg-0` | `#050816` | Fond principal du site (presque noir bleuté) |
| `--bg-1` | `#09091f` | Footer, sections secondaires |
| `--bg-2` | `#0f0f2e` | Inputs, cards |
| `--bg-3` | `#1a1a3e` | Cards survolées |
| `--bg-card` | `rgba(255,255,255,0.03)` | Cards "glass" semi-transparentes |
| `--bg-card-hover` | `rgba(255,255,255,0.06)` | État survolé |

### Couleurs d'accent
| Token | Valeur | Rôle |
|---|---|---|
| `--violet` | `#915EFF` | **Couleur primaire** — boutons, accents, liens importants |
| `--violet-light` | `#b48bff` | Hover, états actifs |
| `--cyan` | `#00cffd` | **Couleur secondaire** — gradients, contrepoints |
| `--cyan-light` | `#67e8f9` | Hover cyan |
| `--orange` | `#ff7b54` | Tertiaire — chiffres clés, badges |
| `--green` | `#00f5a0` | États positifs (disponibilité, succès) |
| `--pink` | `#f472b6` | Variations |

**Gradient signature** : `linear-gradient(to right, var(--violet), var(--cyan))` (titres "gradient-text").

### Texte (contraste AA garanti sur fond sombre)
| Token | Valeur | Contraste sur `--bg-0` | Usage |
|---|---|---|---|
| `--text-1` | `#ffffff` | 19:1 | Titres, h1, texte principal |
| `--text-2` | `#cbd5e1` | 13:1 | Corps important, sous-titres |
| `--text-3` | `#94a3b8` | **6:1** ✅ AA | Texte secondaire, descriptions |
| `--text-4` | `#7e8da4` | **5:1** ✅ AA | Métadonnées, dates, libellés discrets |

### Bordures et effets
| Token | Valeur | Usage |
|---|---|---|
| `--border` | `rgba(255,255,255,0.07)` | Bordures discrètes |
| `--border-bright` | `rgba(255,255,255,0.14)` | Survol, focus |
| `--glass` | `rgba(255,255,255,0.04)` | Effet verre / glassmorphism |
| `--shadow-md` | `0 8px 32px rgba(0,0,0,0.5)` | Ombres cartes |
| `--glow-violet` | `0 0 30px rgba(145,94,255,0.35)` | Lueur violette signature |

## 2. Typographies

| Token | Police | Usage |
|---|---|---|
| `--font-sans` | **Space Grotesk** (system-ui fallback) | Titres, h1-h6, navigation |
| `--font-body` | **Inter** (system-ui fallback) | Corps de texte, paragraphes |
| `--font-mono` | **JetBrains Mono** (Fira Code, monospace fallback) | Code, libellés techniques, badges |

Chargement : non bloquant via `media="print"` + `onload` (voir `BaseLayout.astro`).

## 3. Hiérarchie typographique

| Niveau | Taille (clamp) | Couleur | Poids |
|---|---|---|---|
| **h1 hero** (`name-line`) | `clamp(2.8rem, 7vw, 5.5rem)` | `--text-1` | 700 |
| **h1 sous-titre** (`title-line`) | `clamp(1.4rem, 3.2vw, 2.4rem)` | gradient text | 500 |
| **h2 section** | `clamp(1.8rem, 3.5vw, 2.8rem)` | `--text-1` | 700 |
| **h3 sous-section** | ~1.3-1.7rem | `--text-1` ou `--text-2` | 600-700 |
| **Corps** | `1rem-1.08rem` | `--text-2` ou `--text-3` | 400 |
| **Méta** | `0.72-0.82rem` | `--text-3` ou `--text-4` | 500-700 (mono) |

Line-height : `1.75-1.85` sur les corps de texte (lisibilité).

## 4. Rayons (border-radius)

| Token | Valeur | Usage |
|---|---|---|
| `--r-sm` | `6px` | Petits éléments (tags, badges) |
| `--r-md` | `12px` | Inputs, boutons |
| `--r-lg` | `20px` | Cards |
| `--r-xl` | `28px` | Sections, hero cards |
| `--r-full` | `9999px` | Pills, social links, badges arrondis |

## 5. Composants signature

- **`.btn-primary`** : fond violet, texte blanc, ombre lueur violette au hover.
- **`.btn-secondary`** : fond glass, bordure subtile, texte clair.
- **`.glass-card`** : `background: var(--glass)`, `backdrop-filter: blur(8px)`, bordure discrète.
- **`.gradient-text`** : `background-clip: text` avec gradient violet → cyan.
- **`.section-label`** : pill petite police mono, lettrage espacé, couleur d'accent.

## 6. Fond WebGL (signature)

Composant `ThreeBackground.astro`, présent uniquement sur la home (dans `Hero.astro`).

- **9 planètes** (Mercure → Pluton) en orbites lentes.
- **17 constellations** cyclées une à la fois.
- **6 nébuleuses** en blending additif (violet/rose).
- **Champ d'étoiles** (1800 desktop / 900 mobile).
- **Étiquettes flottantes** (pills) suivant les objets en projection 3D→2D.
- **Désactivation** : `prefers-reduced-motion` ou onglet caché ou hors-vue.

## 7. Espacement (Tailwind par défaut)

- Espacements verticaux courants : `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`, `6rem`, `8rem`.
- Container max : `1280px`.
- Padding section : `padding: 8rem 1.5rem 5rem` (hero), `padding: 4rem 0 2rem` (footer).

## 8. Iconographie

- **SVG inline** uniquement (pas d'icon font sauf Font Awesome anciens utilisés ponctuellement — à migrer).
- Stroke-width `2` à `2.5` standard.
- Tailles : `14-20px` typique.

## 9. États

- **Focus visible** : `outline: none; border-color: var(--violet); box-shadow: 0 0 0 3px rgba(145,94,255,0.12)` sur les inputs.
- **Hover** : translation légère `translate-y` + ombre accrue + bordure éclaircie.
- **Disabled** : opacité 0.6, curseur `not-allowed`.

## 10. Animation

- **Transitions** : `0.2s-0.7s ease` selon le contexte (boutons rapides, cards lentes).
- **`prefers-reduced-motion`** respecté : le fond WebGL et les transitions lourdes se désactivent.
- **ViewTransitions Astro** : navigation SPA avec fallback `swap`.
