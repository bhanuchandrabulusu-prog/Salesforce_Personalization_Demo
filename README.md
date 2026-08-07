# Clearwater Bank — Salesforce Personalization Demo

A complete end-to-end demo for **Salesforce Personalization** (Data 360) built around a fictional retail bank. Demonstrates real-time website personalization, identity resolution, AI-powered product recommendations, A/B experimentation, and cross-channel Marketing Cloud Next integration.

---

## What This Is

A ready-to-use demo kit for showcasing Salesforce Personalization capabilities to financial services clients. Includes a working demo website, Salesforce Data 360 configuration artifacts, client-facing presentation materials, and developer build guides.

**Products demonstrated:**
- Salesforce Personalization (Data 360)
- Salesforce Interactions SDK
- Salesforce Data Cloud (Data Streams, DMOs, Identity Resolution, Data Graphs, Calculated Insights)
- Marketing Cloud Next (Flows, Segments, Email — Phase 2 in the works)

---

## Quick Start

### Prerequisites

- Python 3.x (for localhost)
- Chrome browser
- Access to a Salesforce org with Salesforce Personalization (Data 360) enabled (currently using Bhanu's SDO org). 
- Salesforce Interactions SDK Web Connector configured

### Run the Demo

```bash
# Clone the repo
git clone <repo-url>
cd clearwater-bank-demo

# Start local server
cd website
python -m http.server 3000

# Open in browser
# http://localhost:3000/clearwater-bank.html
```

### What You'll See

1. A banking website with 5 pages and 5 switchable visitor personas
2. Browse mortgage or investment pages 3+ times → homepage hero personalises in real-time
3. Fill the pre-qualification form → 4 events fire to Salesforce Data 360
4. Toggle "Show Personalisation Zones" → see every decision point on the page
5. Green ⚡ LIVE badges indicate content served by Salesforce Personalization

---

## Repository Structure

```
clearwater-bank-demo/
├── README.md
│
├── website/                          # Demo website files
│   ├── clearwater-bank.html          # Main demo site (HTML + React, SDK integration, 11 live zones)
│   └── ClearwaterBank.jsx            # React artifact version (mock only, no SDK)
│
├── data-360/                         # Salesforce Data 360 configuration
│   ├── clearwater-sitemap.js         # Interactions SDK sitemap (12 event types)
│   ├── clearwater-schema.json        # Web connector schema (14 events)
│   └── clearwater-products.csv       # Product catalog (16 financial products for Goods Product DMO)
│
├── docs/                             # Documentation
│   ├── client-facing/                # For client presentations
│   │   ├── Clearwater-Client-Deck.pptx
│   │   ├── Clearwater-Demo-Talk-Track.md
│   │   ├── Clearwater-Use-Case-Catalog.md
│   │   └── Clearwater-ROI-Framework.md
│   │
│   ├── internal/                     # For internal team / SMEs
│   │   ├── Clearwater-Internal-SME-Deck.pptx
│   │   └── Clearwater-Bank-Project-Assets.md
│   │
│   └── developer/                    # For builders / architects
│       ├── Clearwater-Bank-Build-Summary.md
│       ├── Clearwater-Setup-Runbook.md
│       ├── Clearwater-Lessons-Learned.md
│       ├── Clearwater-Testing-Guide.md
│       ├── Clearwater-All-Decision-Content.md
│       ├── Clearwater-Recommender-Build-Guide.md
│       ├── Clearwater-Recommendation-Points-Guide.md
│       ├── Clearwater-Bank-DLO-to-DMO-Mapping-Guide.md
│       ├── Clearwater-Bank-Personalization-Gap-Analysis.md
│       ├── Clearwater-Phase2-MCNext-Build-Guide.md
│       └── Sitemap-Implementation-Guide.md
```

---

## What Was Built

### Demo Website
- 5 pages: Home, Home Loans Hub, Mortgage Detail, Investment Detail, Online Banking Dashboard
- 5 switchable visitor personas (New Prospect, Mortgage Seeker, Premier Customer, Existing Customer, Business Owner)
- 11 live personalisation zones rendering real Salesforce Personalization responses
- Pre-qualification form firing 4 events to 4 data streams
- Personalisation zone overlay toggle showing decision metadata
- AWAC chat widget

### Salesforce Data 360
- Web connector with recommended schema + 3 custom events (14 event types total)
- 6 data streams: Behavioral Events, Identity, Contact Point Email, Contact Point Phone, Contact Point Address, Party Identification
- DLO-to-DMO mappings for all streams
- Custom Application Engagement DMO with Goods Product lookup
- 16 financial products in Goods Product DMO
- Identity Resolution ruleset with 3 recommended rules (Normalized Email, Lead to Contact, Device to Known)

### Data Graphs
- Real-Time Profile Graph: Unified Individual → Individual → Contact Points, Engagement DMOs, CIs
- Standard Item Graph: Goods Product (6 fields)

### Engagement Signals (5)
- ProductView, ProductClick, ApplicationStart (flow-enabled), ArticleClick, CalculatorEngagement

### Calculated Insights (5)
- HomeLoan_Views, Investment View Count, Application Start Count, Article Click Count, Product Category View Count

### Content Schemas (6)
- Banner, Promo, Infobar, CTA Card, Life Event Tile, Product Recommendation

### Personalisation Points (16)
- 10 Dynamic Content points with 27 decisions
- 6 Recommendation points (including 1 A/B experiment)

### Recommenders (4)
- Most Viewed Products (rule-based, fallback)
- Personalised Products — Maximise Application Starts (objective-based)
- Dashboard Next Best Product (objective-based)
- Complementary Products (rule-based)

---

## Use Cases Demonstrated

| # | Use Case | Status |
|---|---|---|
| 1 | Behavioural Website Personalisation | ✅ Live |
| 2 | Anonymous to Known Identity Resolution | ✅ Live |
| 3 | AI-Powered Product Recommendations | ✅ Built |
| 4 | A/B Experimentation (Rule vs AI) | ✅ Built |
| 5 | Cross-Channel Web → Email | 📐 Designed (Phase 2) |
| 6 | Pre-Qualification Form Capture | ✅ Live |
| 7 | Abandoned Application Follow-Up | 📐 Designed (Phase 2) |
| 8 | Personalised Dashboard (Next Best Product) | ✅ Built |

---

## File Reference

### Website & SDK

| File | Description |
|---|---|
| `clearwater-bank.html` | Demo website with Salesforce Interactions SDK integration and live personalisation rendering across 11 zones. Standalone HTML with inline React. |
| `ClearwaterBank.jsx` | React artifact version for Claude demos. Mock data only — no SDK connection. |
| `clearwater-sitemap.js` | Salesforce Interactions SDK sitemap. Handles page views, catalog events, identity events, form submissions, and personalisation fetch calls. Upload to Data Cloud Web Connector. |
| `clearwater-schema.json` | Web connector event schema. 14 event types (11 recommended + 3 custom: ApplicationStart, CalculatorEngagement, ArticleClick). Upload to Data Cloud Web Connector. |
| `clearwater-products.csv` | 16 financial products for the Goods Product DMO. Includes product ID, name, category, description, and custom ImageUrl field. |

### Client-Facing

| File | Description |
|---|---|
| `Clearwater-Client-Deck.pptx` | 11-slide capability presentation. Covers: the challenge, the vision, architecture, demo intro, 4 use cases, implementation approach, next steps. Basic design — intended for brand customisation. |
| `Clearwater-Demo-Talk-Track.md` | 8-chapter scripted demo walkthrough (15-20 minutes). Includes word-for-word narration, demo actions, recovery scenarios, and Q&A preparation. |
| `Clearwater-Use-Case-Catalog.md` | 8 use cases with business value, platform components, effort estimates, and demo status. |
| `Clearwater-ROI-Framework.md` | Value drivers, KPI definitions, ROI calculation templates, and benchmark figures. |

### Internal

| File | Description |
|---|---|
| `Clearwater-Internal-SME-Deck.pptx` | 10-slide internal demo kit presentation. Covers: what the demo shows, how to run it, architecture deep-dive, top 10 gotchas, available assets, client positioning, FAQ. Marked INTERNAL USE ONLY. |
| `Clearwater-Bank-Project-Assets.md` | Complete asset inventory with ownership, status, and audience tags for all 20+ project files. |

### Developer

| File | Description |
|---|---|
| `Clearwater-Bank-Build-Summary.md` | Complete build inventory. Everything that was configured in Salesforce, current status, known limitations, and future enhancements. |
| `Clearwater-Setup-Runbook.md` | 13-phase step-by-step guide to reproduce the entire demo from scratch. Estimated 8-10 hours for experienced practitioners. |
| `Clearwater-Lessons-Learned.md` | 25 documented gotchas, SDK quirks, and architecture decisions from the build. The most valuable developer asset in this project. |
| `Clearwater-Testing-Guide.md` | 14 test scripts covering every personalisation zone, persona, and user journey. Includes expected outcomes and troubleshooting. |
| `Clearwater-All-Decision-Content.md` | Content values for all 27 decisions across 10 dynamic content personalisation points. Copy-paste reference for building decisions in Salesforce. |
| `Clearwater-Recommender-Build-Guide.md` | Step-by-step instructions for creating all 4 recommenders, including custom objective configuration. |
| `Clearwater-Recommendation-Points-Guide.md` | Step-by-step instructions for creating all 6 recommendation-type personalisation points, including the A/B experiment. |
| `Clearwater-Bank-DLO-to-DMO-Mapping-Guide.md` | Field-level mapping reference for all engagement and profile data streams. |
| `Clearwater-Bank-Personalization-Gap-Analysis.md` | Analysis of what the web SDK provides vs what the full demo plan requires. |
| `Clearwater-Phase2-MCNext-Build-Guide.md` | Phase 2 build guide for Marketing Cloud Next: segments, email templates, 5 flow types, and the batch personalisation pipeline. |
| `Sitemap-Implementation-Guide.md` | Guide for real client implementations: RACI matrix, 8 required inputs from the client, 21 deliverable assets, 5-phase timeline, and 7 key risks. |

---

## Key Technical Notes

### SDK Patterns
- Uses `SalesforceInteractions.initSitemap()` — not the legacy `mcis.setPageType()`
- Catalog events must use the SDK constant `CatalogObjectInteractionName.ViewCatalogObject` — custom interaction names change field flattening
- Profile events (identity, contactPointEmail) use `user.attributes.eventType` with an `interaction` block — "Identity" cannot be used as an interaction name
- SPA hash navigation requires manual `sendEvent()` and `Personalization.fetch()` calls

### Data Cloud
- Schema upload format: `{"records": [...]}`
- Identity event requires `isAnonymous` field (required in recommended schema, not auto-populated by SDK)
- Contact Point Email schema field is `email` (not `emailAddress`)
- Streaming Calculated Insights cannot be edited after creation — delete and recreate
- CI filter values must match actual SDK event output (e.g., `View Catalog Object`, not `catalog-object-view-start`)

### Personalisation
- Decisions are priority-ordered: first qualifying rule wins
- Dynamic Content: marketer types content values per decision
- Recommendations: recommender selects products from catalog per visitor
- A/B Experiments: split traffic between two recommenders, measure engagement signal metrics
- Web Personalisation Manager (WPM) can inject content without website code changes

### Identity Resolution
- Real-time email matching works for identified visitors (form submission, login)
- The relationship between IDR, IndividualIdentityLink, and real-time personalisation engine resolution is not fully documented — observed behaviour may differ from the CI SQL definition
- Design personalisation decisions for both anonymous visitors (IsAnonymous-based) and identified visitors (CI-based) to ensure coverage

---

## Open Questions

These areas require further investigation or Salesforce documentation validation:

1. **Real-time personalisation engine resolution path:** How does the engine evaluate CIs for anonymous visitors when no IndividualIdentityLink record exists? Observed behaviour shows CI-based decisions firing, but the CI SQL query joins through IndividualIdentityLink. The runtime execution path appears to differ from the batch SQL path.

2. **Device to Known rule execution timing:** Documentation confirms real-time matching for exact email/phone. Device to Known behaviour (real-time vs batch) is not explicitly documented.

3. **Batch vs real-time CI evaluation:** Whether the Personalisation engine evaluates CIs using the same SQL join path as Query Studio, or uses the Real-Time Data Graph with a different traversal mechanism.

---

## Phases

### Phase 1: Salesforce Personalization (Complete ✅)
Website personalisation, identity resolution, recommenders, experimentation.

### Phase 2: Marketing Cloud Next (In Progress 🔧)
Cross-channel email flows, segments, batch personalisation pipeline. See `Clearwater-Phase2-MCNext-Build-Guide.md`.

---

## Contributing

This is an internal demo project. To extend or customise:

1. **Add a new product page:** Copy the Investment Detail page pattern in `clearwater-bank.html`. Add the page to the `navigateTo` config in `clearwater-sitemap.js` with the appropriate `catalogObject.type`.
2. **Add a new personalisation point:** Create in Salesforce → add to the `fetchPoints` array in the sitemap's `navigateTo` config → add `useLivePoint` hook in the HTML component.
3. **Add a new recommender:** Follow `Clearwater-Recommender-Build-Guide.md`.
4. **Customise for a different industry:** Replace product catalog, content schema attributes, and decision content values. The architecture and SDK patterns remain the same.

---

## License

Internal use only. Not for client distribution without review and brand customisation.
