---
name: TechStore
description: Panel de control nocturno para gestión de tienda tech — vidrio oscuro, glows de señal, acentos teal/azul/ámbar.
colors:
  bg: "#06121d"
  bg-2: "#071a29"
  panel: "rgba(8, 24, 36, 0.86)"
  panel-strong: "rgba(10, 30, 44, 0.94)"
  panel-soft: "rgba(14, 36, 52, 0.82)"
  border: "rgba(132, 190, 214, 0.18)"
  border-strong: "rgba(132, 190, 214, 0.28)"
  text: "#eef7fb"
  muted: "#a9c0cc"
  signal-teal: "#48ddd6"
  circuit-blue: "#5d8cff"
  mint-reserve: "#7aeb9f"
  warm-amber: "#f2b34a"
  alert-coral: "#ff7a7a"
  vital-green: "#4be08b"
typography:
  body:
    fontFamily: "Inter, 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.68
  display:
    fontFamily: "Inter, 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2rem, 3.2vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.02
  label:
    fontFamily: "Inter, 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 800
    letterSpacing: "0.13em"
rounded:
  sm: "14px"
  md: "20px"
  lg: "26px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "18px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, {colors.signal-teal}, {colors.circuit-blue})"
    textColor: "#031018"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  input-field:
    backgroundColor: "rgba(2, 16, 24, 0.62)"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "13px 14px"
  card-module:
    backgroundColor: "{colors.panel-soft}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "20px"
  panel-shell:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: TechStore

## Overview

**Creative North Star: "The Night Console"**

TechStore es el panel de control nocturno de una tienda de tecnología: superficies de vidrio oscuro flotando sobre un fondo casi negro, con glows radiales de color marcando dónde está la actividad — como luces de estado en un centro de operaciones. La identidad es futurista y energética: los degradados teal→azul y los glows ámbar no son decoración de fondo, son señal — indican marca, estado en vivo (`status-pill--live`) y foco de atención.

Cada superficie —topbar, panel, tarjeta de auth, tarjeta de módulo— comparte el mismo lenguaje: fondo traslúcido con `backdrop-filter: blur`, borde teal muy tenue, esquinas muy redondeadas, y una sombra ambiental difusa en vez de una sombra dura direccional. No hay blanco puro en ningún lado; todo vive en el rango navy-casi-negro con acentos de señal.

**Key Characteristics:**
- Fondo navy-casi-negro (#06121d→#071a29) con glows radiales de color fijos en las esquinas, nunca al centro.
- Vidrio (glass) como material por defecto: blur + borde translúcido + gradiente sutil de luz encima del panel.
- Degradado teal→azul reservado casi exclusivamente para marca y acción primaria.
- Radios grandes en todo el sistema: nada es cuadrado, desde 14px hasta pill (999px).
- Texto de apoyo (labels, eyebrows, tags) siempre en mayúsculas con tracking amplio.

## Colors

Paleta de señal sobre base oscura: un acento primario (teal) que hace todo el trabajo de foco, un secundario (azul) que solo aparece emparejado con el primario en degradados, y un terciario (ámbar) reservado para glows de contexto secundario (banner, mensajes info).

### Primary
- **Signal Teal** (`#48ddd6`): acento principal. Botones primarios (en degradado con Circuit Blue), foco de inputs, iconografía de estado activo, `session-chip__label`, `eyebrow`, glows de esquina en casi todos los paneles.

### Secondary
- **Deep Circuit Blue** (`#5d8cff`): nunca aparece solo — siempre como el segundo punto del degradado de marca/botón primario, o como glow secundario opuesto al teal (esquinas contrarias del mismo panel).

### Tertiary
- **Warm Amber** (`#f2b34a`): acento de contexto, no de acción. Glow del `panel--banner`, tarjetas flotantes secundarias en el `showcase-stage`. Nunca se usa en botones ni en texto de marca.
- **Mint Reserve** (`#7aeb9f`, token `--primary-3`): definido en el sistema de tokens pero sin uso activo en el CSS actual — reservado, no fabricar un uso nuevo sin confirmarlo primero.

### Neutral
- **Text** (`#eef7fb`): texto principal sobre fondo oscuro.
- **Muted** (`#a9c0cc`): texto secundario — párrafos, `span` descriptivos, metadata de tarjetas.
- **Panel / Panel Strong / Panel Soft** (`rgba(8,24,36,.86)` / `rgba(10,30,44,.94)` / `rgba(14,36,52,.82)`): tres profundidades del mismo material de vidrio — strong para el panel hero/destacado, soft para paneles secundarios en grid, panel base para topbar y superficies estándar.
- **Border / Border Strong** (`rgba(132,190,214,.18)` / `rgba(132,190,214,.28)`): borde translúcido con tinte teal-azulado, nunca gris puro.

### Estado
- **Vital Green** (`#4be08b`): éxito, indicador `status-pill--live`, checkmarks de `check-list`.
- **Alert Coral** (`#ff7a7a`): error, `link-action--danger`, `badge--danger`.

### Named Rules
**The Gradient-Is-Sacred Rule.** El degradado teal→azul solo aparece en dos lugares: el `brand-mark` y `.btn--primary`. Es la firma visual de "esto es la marca / esto es la acción principal" — no se usa como decoración de fondo.

## Typography

**Display/Body Font:** Inter (con fallback `"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif`) — una sola familia para todo el sistema, sin fuente secundaria.

**Character:** Sans-serif técnica y neutra; toda la personalidad del sistema vive en color y forma, no en la tipografía. Los labels ganan carácter por mayúsculas + tracking, no por cambio de fuente.

### Hierarchy
- **Display / H1** (peso por defecto del navegador, `clamp(2rem, 3.2vw, 3.5rem)`, line-height 1.02): titulares de hero y auth-showcase. `max-width: 12ch` en el título de auth para forzar quiebre de línea corto.
- **H2** (por defecto, 1.28rem): encabezados de sección dentro de paneles.
- **Body / p** (400, 1rem implícito, line-height 1.68, color `--muted`): párrafos de apoyo, máximo 66ch en hero-copy.
- **Label** (800, ~0.72–0.82rem, letter-spacing 0.12–0.14em, uppercase): `eyebrow`, `session-chip__label`, `summary-card__label`, `module-card__tag`, `auth-stage__label`, encabezados de `.table th`. Es el patrón tipográfico más repetido del sistema.

### Named Rules
**The Shout-In-Small-Caps Rule.** Cualquier texto de metadata/etiqueta (no título, no párrafo) va en mayúsculas, peso 800, tracking ancho. Es la única variación tipográfica que el sistema usa para jerarquía secundaria.

## Layout

Contenedor central `main.shell`, ancho `min(1200px, calc(100% - 32px))`, centrado, con dos variantes de ancho (`--wide` 1360px para grillas densas, `--narrow` 980px para formularios/detalle). Ritmo vertical: gap 12–18px entre bloques, padding interno de panel 18–24px.

Grids predominantes: hero 1.22fr/0.78fr, `module-grid`/`flow-grid` a 3 columnas, `auth-shell` 1.05fr/0.9fr. Todas colapsan a 2 columnas en ≤1100px y a 1 columna apilada en ≤860px; en ≤540px se reduce padding de panel/topbar y el radio grande baja de 26px a 22px para no verse desproporcionado en pantallas chicas.

## Elevation & Depth

El sistema no usa sombra dura direccional como recurso principal — usa **vidrio + glow ambiental**. Cada panel combina: `backdrop-filter: blur(16px)`, un borde translúcido, un gradiente de luz sutil superpuesto (`rgba(255,255,255,.04)→.01`), y una sombra ambiental muy difusa (`--shadow: 0 28px 70px rgba(0,0,0,.38)`) que separa el panel del fondo sin dirección aparente. La profundidad "de color" viene de glows radiales posicionados en las esquinas de cada panel (pseudo-elementos `::before`/`::after`), nunca al centro.

### Shadow Vocabulary
- **Ambient panel shadow** (`0 28px 70px rgba(0,0,0,.38)`): base de todo panel/topbar, siempre presente, no reacciona a estado.
- **Button glow** (`0 18px 30px rgba(72,221,214,.18)`): exclusivo de `.btn--primary`, refuerza que ese botón es la acción de marca.
- **Hover response** (`0 18px 40px rgba(0,0,0,.24)` + `border-color: rgba(72,221,214,.34)`): único momento donde la sombra reacciona a interacción — `module-card:hover`.

### Named Rules
**The Corner-Glow-Not-Center Rule.** Los glows radiales de color siempre nacen fuera o en el borde del panel (posiciones negativas o esquinas), nunca centrados — así iluminan el marco sin competir con el contenido.

## Shapes

Radio generoso en todo el sistema, sin excepciones angulosas: 26px (`--radius`) en paneles/topbar, 20-22px en tarjetas y showcase-stage, 14-18px en botones/inputs/mini-items, y 999px (pill) en badges, chips y el `status-pill`. En ≤540px el radio de panel baja a 22px para mantener proporción, pero nunca llega a 0.

## Components

### Buttons
- **Shape:** radio 14px, `min-height: 46px`.
- **Primary:** degradado Signal Teal→Circuit Blue, texto navy oscuro (`#031018`), glow propio (ver Elevation).
- **Secondary:** fondo blanco al 5%, texto `--text`, borde `--border`.
- **Hover:** `translateY(-1px)` en ambas variantes — único feedback de hover en botones, sin cambio de color.

### Badges / Chips / Pills
- **Style:** radio pill (999px) o 18px según tamaño; fondo translúcido tintado por estado (`badge--success` verde, `badge--danger` coral, `badge--glass` neutro).
- **State:** `status-pill--live` añade un punto verde con halo (`box-shadow` circular) para indicar "en vivo".

### Cards / Containers
- **Corner Style:** 18-20px la mayoría; 26-28px en superficies grandes (`panel--hero`, `showcase-stage`, `auth-stage`).
- **Background:** siempre una de las tres variantes de panel (panel/panel-strong/panel-soft) con gradiente de luz encima.
- **Shadow Strategy:** ambient shadow global; `module-card` añade hover response (ver Elevation).
- **Border:** `1px solid var(--border)` casi universal; `border-strong` solo en `status-pill`.
- **Internal Padding:** 16-24px según densidad (mini-item 16px, panel 24px).

### Inputs / Fields
- **Style:** fondo navy oscuro translúcido (`rgba(2,16,24,.62)`), borde `--border`, radio 14px.
- **Focus:** borde vira a teal (`rgba(72,221,214,.65)`) + anillo de glow de 3px (`box-shadow: 0 0 0 3px rgba(72,221,214,.12)`).

### Table
- **Style:** sin bordes de celda verticales, solo divisor horizontal translúcido (`rgba(132,190,214,.15)`); encabezados en el patrón Label (mayúsculas, tracking, color `#d8eef4`); envoltura con scroll horizontal (`table-wrap`) para mantener el ancho mínimo de 1050px en pantallas chicas.

### Navigation (Topbar)
- **Signature component.** Combina marca (brand-mark con degradado + brand-copy) a la izquierda y `session-chip` + `status-pill` a la derecha. Es el único lugar donde conviven el degradado de marca y el indicador de estado en vivo en la misma vista — funciona como header persistente de "consola operativa".

## Do's and Don'ts

### Do:
- **Do** reservar el degradado Signal Teal→Circuit Blue solo para brand-mark y botón primario (The Gradient-Is-Sacred Rule).
- **Do** usar mayúsculas + tracking 0.12-0.14em + peso 800 para cualquier texto de metadata/etiqueta, nunca para títulos ni párrafos.
- **Do** posicionar los glows radiales en esquinas/bordes de cada panel, nunca centrados (The Corner-Glow-Not-Center Rule).
- **Do** mantener radios grandes (mínimo 14px) en absolutamente todo elemento interactivo o contenedor.

### Don't:
- **Don't** introducir sombras duras direccionales como sustituto del glow ambiental — rompe la coherencia "vidrio nocturno" del sistema.
- **Don't** usar blanco puro (#fff) como fondo o texto principal; el sistema vive en navy oscuro con `--text` (#eef7fb) casi-blanco solo para texto.
- **Don't** introducir un cuarto color de acento fuera de teal/azul/ámbar/verde/coral sin confirmarlo — la paleta actual ya cubre marca, estado positivo y estado negativo.
- **Don't** usar esquinas rectas (radio 0) en ningún componente nuevo.
