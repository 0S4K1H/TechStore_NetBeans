# Product Marketing Context

**Document version:** v1
**Last updated:** 2026-08-15

## Product Overview
**One-liner:** TechStore is a unified electronics commerce platform with a public storefront and an internal operations panel for catalog, stock, suppliers, orders, users, and support.
**What it does:** It lets visitors browse and buy technology products while giving internal staff a role-based admin area to manage products, suppliers, carts, orders, tickets, and users from the same system.
**Product category:** E-commerce platform for technology retail
**Product type:** Hybrid e-commerce + admin operations system
**Business model:** Online retail store supported by internal operational workflows

## Target Audience
**Target companies:** Electronics and tech retail businesses, or any store that needs a storefront plus operational back office
**Decision-makers:** Store owners, administrators, supervisors, commercial staff
**Primary use case:** Browse products, place orders, and manage the store from a single platform
**Jobs to be done:**
- Find technology products fast and with confidence
- Keep stock, suppliers, and orders under control
- Handle support and internal operations without switching systems
**Use cases:**
- Customer browsing and checkout
- Admin product and stock management
- Supplier and order tracking
- Support ticket handling

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Cliente | Price, trust, catalog clarity, support | Finds messy catalogs and weak buying confidence | Clear catalog, real inventory, simple purchase flow |
| Administrador | Control, permissions, operational visibility | Jumps between spreadsheets and disconnected tools | One panel to manage products, users, suppliers, orders, tickets |
| Empleado comercial | Speed, catalog updates, order follow-up | Needs to act fast without full admin access | Role-based access for daily operations without risk |

## Problems & Pain Points
**Core problem:** Tech purchasing and store operations are usually fragmented, slow, and hard to trust.
**Why alternatives fall short:**
- Marketplaces are broad but noisy
- Manual processes create stock and order mistakes
- Legacy systems often separate storefront and back office
**What it costs them:** Time lost, stock errors, weak customer confidence, and slower operations
**Emotional tension:** Users want clarity and trust; staff want control without complexity

## Competitive Landscape
**Direct:** Electronics stores and e-commerce sites with catalog + checkout flows
**Secondary:** Large marketplaces like Mercado Libre or retailer catalogs that are broad but cluttered
**Indirect:** WhatsApp sales, spreadsheets, and manual order tracking

## Differentiation
**Key differentiators:**
- Unified React storefront + Java/Tomcat backend
- Real MySQL data and role-based access
- Operational modules for products, suppliers, users, carts, orders, and tickets
- Premium, dark tech aesthetic with a controlled brand feel
**How we do it differently:** One system serves customers and internal staff without splitting the experience into separate apps.
**Why that's better:** Less friction, clearer ownership, and easier scaling of both commerce and operations
**Why customers choose us:** They get a store that feels modern and a backend that actually supports day-to-day work

## Objections
| Objection | Response |
|-----------|----------|
| "¿El stock es real?" | Sí: la tienda está conectada a una base de datos MySQL y la UI consume datos reales. |
| "¿Puedo administrar productos y proveedores?" | Sí: el panel interno incluye módulos para productos, proveedores, usuarios, pedidos, carritos, tickets y reportes. |
| "¿Es solo una maqueta?" | No: la app ya está unificada en React + backend Java, con despliegue en Tomcat. |

**Anti-persona:** Someone who only wants a static brochure site or a marketplace that depends on third-party sellers

## Switching Dynamics
**Push:** Catalogs that feel generic, unreliable, or hard to maintain
**Pull:** A clean storefront plus a real admin panel in one system
**Habit:** Teams used to spreadsheets, old JSP pages, or disconnected tools
**Anxiety:** Fear that the new stack will break, duplicate work, or hide stock errors

## Customer Language
**How they describe the problem:**
- "Necesito ver el catálogo rápido"
- "Quiero administrar productos y stock sin enredos"
- "No quiero volver a entrar a otra plataforma para cada cosa"
**How they describe us:**
- "Una sola tienda y un solo panel"
- "Inventario real"
- "Panel interno protegido"
**Words to use:**
- catálogo real
- inventario
- panel interno
- garantía
- soporte
- compra sin fricción
**Words to avoid:**
- revolucionario
- ultra optimizado
- disruptivo
- mágico
- bestial
**Glossary:**
| Term | Meaning |
|------|---------|
| Panel interno | Admin area for internal staff |
| Inventario real | Data-backed stock and product availability |
| Tickets | Support cases or incidents |
| Proveedores | Supplier records and management |

## Brand Voice
**Tone:** Premium, direct, calm, trustworthy
**Style:** Short sentences, clear benefits, no filler
**Personality:** Precise, modern, confident, technical

## Proof Points
**Metrics:** Real data coming from MySQL/JDBC-backed modules
**Customers:** Not public yet; product is in development / evidence stage
**Testimonials:** None yet
**Value themes:**
| Theme | Proof |
|-------|-------|
| Unified commerce | React storefront + Java backend in one deployment |
| Operational control | Role-based admin modules for product, supplier, order, ticket, and user management |
| Trust | Login, session handling, and protected internal routes |
| Scalability | Modular routes and API-based data access |

## Goals
**Business goal:** Make TechStore feel like a real premium retail brand, not a demo
**Conversion action:** Explore products, trust the brand, and enter the internal panel when appropriate
**Current metrics:** Not tracked yet in product analytics

## Changelog
*Newest first. One line per revision: what changed and why.*
- v2 (2026-08-15) — Added a cinematic visual asset layer for categories and missing-product fallbacks, plus motion direction for storefront cards.
- v1 (2026-08-15) — Initial context drafted from the current TechStore codebase and docs to unify branding, audience, and conversion language.
