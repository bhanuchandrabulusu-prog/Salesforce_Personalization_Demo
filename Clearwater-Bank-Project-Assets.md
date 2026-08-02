# Clearwater Bank — Project Asset Inventory

---

# PART 1: CLIENT-FACING ASSETS
## For the SME / Subject Matter Advisor presenting to clients

The goal: Help clients understand what Salesforce Personalization + Data 360 can do, what the value is, and what it takes to implement — without drowning them in technical detail.

---

## Asset 1: Live Demo Website

**File:** `clearwater-bank.html` (served from localhost)

**What it shows clients:**
- A realistic financial services website with real-time personalization powered by Salesforce
- Visitor browses mortgage pages → homepage hero changes to mortgage-specific content
- Green "LIVE PERSONALIZATION" banner proves it's not a mockup — the content comes from Salesforce in real-time
- Persona switcher shows how different customer segments see different experiences
- Personalization zone overlay reveals every decision point on the page (toggle on/off)
- AWAC chat widget demonstrates Agentforce integration

**How to demo it:**
1. Start on Homepage as New Prospect — generic hero
2. Navigate to Mortgage Detail 3+ times — builds behavioral signal
3. Return to Homepage — hero changes to "Your home is closer than you think" with green LIVE indicator
4. Toggle "Show Personalization Zones" — reveals every personalization point, decision name, and targeting rule
5. Open AWAC chat — ask about home loans, show product recommendations

**Client talking points:**
- "This isn't a mockup — the hero content is being served by Salesforce Personalization in real-time based on this visitor's browsing behavior"
- "Every blue-outlined zone is a personalization point — a place where Salesforce makes a decision about what to show"
- "The same platform that personalizes the website can trigger personalized emails, SMS, and push notifications"
- "No code deployment needed to change the decisions — marketers update targeting rules and content in the Salesforce UI"

**STATUS:** ✅ Ready to demo

---

## Asset 2: Demo Storyboard / Talk Track

**Needs to be created.** A scripted walkthrough that tells the personalization story in business terms.

**Suggested structure:**

| Chapter | Duration | Story | Demo Action |
|---|---|---|---|
| 1. The Anonymous Visitor | 2 min | "A prospect lands on our banking website. We don't know who they are yet, but we start learning from their behavior." | Show homepage as New Prospect — generic content |
| 2. Behavioral Signal | 2 min | "They browse our home loan pages. After 3 views, the system recognizes mortgage intent — in real-time, not overnight." | Navigate to Mortgage Detail 3x |
| 3. The Personalized Experience | 2 min | "Next time they visit the homepage, the entire experience adapts. The hero changes, the CTA changes, the product recommendations change." | Return to Homepage — show LIVE hero |
| 4. Under the Hood | 3 min | "Let me show you how Salesforce makes this decision." Toggle personalization zones. Walk through the decision stack — Priority 1 through Default. | Toggle zones on. Point to decision/rule labels |
| 5. The Marketer's Control | 2 min | "The marketing team controls all of this without code. They create decisions, set targeting rules, and publish — all in the Salesforce UI." | Show Salesforce Personalization Points UI (screenshots or live) |
| 6. Cross-Channel Extension | 2 min | "The same behavioral data that personalizes the website can trigger a follow-up email with personalized mortgage products." | Explain the batch personalization → MC Next email flow |
| 7. AI-Powered Recommendations | 2 min | "When we add recommenders, the system learns which products drive the most applications — and adapts automatically." | Explain the MaxAppStarts objective and A/B experiment concept |

**STATUS:** ⬜ Not yet created — script needed

---

## Asset 3: Capability Overview Slide Deck

**Needs to be created.** A 10-15 slide PowerPoint for client presentations.

**Suggested slides:**

| Slide | Content |
|---|---|
| 1 | Title: "Real-Time Personalization with Salesforce Data 360 + Personalization" |
| 2 | The Problem: Generic customer experiences don't convert |
| 3 | The Solution: Behavioral data → real-time decisions → personalized content |
| 4 | Architecture Overview: Website → SDK → Data Cloud → Personalization Engine → Content |
| 5 | Demo: Clearwater Bank — what you'll see |
| 6 | Use Case 1: Behavioral Targeting (mortgage intent from browsing) |
| 7 | Use Case 2: Identity Resolution (anonymous → known customer) |
| 8 | Use Case 3: Cross-Channel Personalization (web → email) |
| 9 | Use Case 4: AI Recommendations (objective-based product recommendations) |
| 10 | Use Case 5: A/B Experimentation (rule-based vs AI) |
| 11 | What It Takes: Implementation timeline, team, prerequisites |
| 12 | Platform Components: Data 360, Salesforce Personalization, MC Next |
| 13 | Build vs Buy: What's out-of-box, what's custom |
| 14 | Next Steps |

**STATUS:** ⬜ Not yet created

---

## Asset 4: Use Case Catalog

**Needs to be created.** A one-pager per use case showing business value, platform components, and effort.

**Use cases demonstrated by this project:**

| # | Use Case | Business Value | Platform Components | Effort |
|---|---|---|---|---|
| 1 | Behavioral Website Personalization | Increase conversion by showing relevant content based on browsing behavior | Web SDK, Data Cloud, Personalization Points, CIs | 2-3 weeks |
| 2 | Anonymous to Known Identity Resolution | Unify anonymous browsing with CRM profile when visitor authenticates | Web SDK, Identity Resolution, Contact Point Email | 1 week |
| 3 | Real-Time Calculated Insights | Count and aggregate behavioral signals in real-time for instant targeting | Data Cloud CIs, Real-Time Data Graph | 1 week |
| 4 | Dynamic Content Decisioning | Multi-priority decision stack — first qualifying rule wins | Personalization Points, Dynamic Content Schemas | 1-2 weeks |
| 5 | AI Product Recommendations | ML-trained recommenders that optimize for a business objective | Engagement Signals, Custom Objectives, Recommenders, Item Data Graph | 3-4 weeks + training |
| 6 | A/B Experimentation | Test rule-based vs AI recommendations, measure real conversion impact | Experiments, 2 trained recommenders | 1 week after recommenders trained |
| 7 | Cross-Channel Personalization | Web behavior triggers personalized email via MC Next | Segments, Batch Personalization, MC Next Flows | 2 weeks |
| 8 | Agentforce Adaptive Website | AI-powered chat that uses personalization data to recommend products | AWAC, Einstein Retriever, Data Graphs | 3-4 weeks |

**STATUS:** ⬜ Not yet created — content exists in planning docs, needs formatting

---

## Asset 5: Architecture Diagram (Client-Friendly)

**Needs to be created.** A simplified visual showing the data flow without technical jargon.

**Suggested flow:**

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│  Customer        │    │  Salesforce       │    │  Marketing Team      │
│  visits website  │───→│  Data Cloud       │───→│  creates targeting   │
│  browses products│    │  captures behavior│    │  rules & content     │
│                  │    │  builds profile   │    │                      │
│  ← personalized  │←───│  makes real-time  │←───│  publishes decisions │
│    experience    │    │  decision         │    │                      │
└─────────────────┘    └──────────────────┘    └──────────────────────┘
```

**STATUS:** ⬜ Not yet created

---

## Asset 6: ROI / Value Framework

**Needs to be created.** Helps clients quantify the business case.

**Metrics this platform enables:**
- Conversion rate lift from personalized vs generic hero (measurable via experiment)
- Application start rate by personalization decision (measurable via attribution)
- Email engagement lift from behaviorally-triggered sends (measurable via MC Next reporting)
- Time-to-value: first personalization decision live in 2-3 weeks

**STATUS:** ⬜ Not yet created

---
---

# PART 2: DEVELOPER-FACING ASSETS
## For the Architect sharing with fellow developers

The goal: Enable another developer to understand what was built, reproduce it, extend it, and avoid the pitfalls we hit.

---

## Asset 1: Technical Build Summary

**File:** `Clearwater-Bank-Build-Summary.md`

**What it covers:**
- Complete inventory of what was built and in what order
- All data streams, mappings, CIs, engagement signals, personalization points
- Current status of every component

**STATUS:** ✅ Created (needs update with latest IDR and CI fixes)

---

## Asset 2: Demo Website + Source Code

**Files:**
- `clearwater-bank.html` — standalone HTML with SDK integration, live personalization rendering
- `ClearwaterBank.jsx` — React artifact version (demo only, no SDK)

**Key technical notes for developers:**
- SPA with hash-based routing
- SDK doesn't auto-detect hash navigation — manual `sendEvent` calls on page change via `clearwaterTrack.navigateTo()`
- Live personalization rendering via `clearwater:personalization` custom event → React state update
- Persona switcher fires identity events with `sendEvent` + `user.attributes`
- All mock content preserved as fallback when SDK not connected

**STATUS:** ✅ Ready

---

## Asset 3: Sitemap

**File:** `clearwater-sitemap.js`

**Key technical notes for developers:**
- Uses `initSitemap()` pattern (NOT legacy `mcis.setPageType`)
- Uses `sendEvent()` for custom events (NOT legacy `mcis.trackEvent`)
- SDK constant `CatalogObjectInteractionName.ViewCatalogObject` required for catalog events — produces `interactionName: "View Catalog Object"` and correct field flattening
- Custom interaction names (e.g., `catalog-object-view-start`) produce DIFFERENT field names (`catalogObjectType` vs `type`) — DO NOT use custom names for catalog events
- Profile events use `user.attributes.eventType` (NOT `interaction.name`) — "identity" and "contactPointEmail" are reserved profile event types
- All functions use `function()` syntax, not arrow functions — SDK loader may not support arrows
- `consents` must include explicit `ConsentStatus.OptIn` — empty array `[]` blocks all events

**STATUS:** ✅ Ready

---

## Asset 4: Schema

**File:** `clearwater-schema.json`

**Key technical notes for developers:**
- Based on Salesforce recommended schema (`web-connector-schema.json`) with 3 custom events appended
- Top-level structure: `{"records": [...]}` — NOT `{"events": [...]}` or bare array
- Field-level structure: `developerName`, `masterLabel`, `dataType`, `isDataRequired` — no `isCurrencyIsoCode`, no `availabilityStatus`
- Custom events (ApplicationStart, CalculatorEngagement, ArticleClick) only need the 6 mandatory auto-populated fields as required
- Identity event requires `isAnonymous` field (marked required in recommended schema) — SDK does NOT auto-populate this
- Contact Point Email requires `email` field (not `emailAddress`) — SDK sends `emailAddress` in `user.attributes` but schema field is `email`
- Schema is backwards-compatible only — cannot add required fields after upload

**STATUS:** ✅ Ready

---

## Asset 5: Products Catalog

**File:** `clearwater-products.csv`

**16 financial products loaded into Goods Product DMO.** Product IDs match sitemap `catalogObject.id` values.

**Custom field added to Goods Product DMO:** `ImageUrl__c` (Text)

**STATUS:** ✅ Ready

---

## Asset 6: DLO-to-DMO Mapping Guide

**File:** `Clearwater-Bank-DLO-to-DMO-Mapping-Guide.md`

**Covers:** All engagement and profile data stream mappings field-by-field. Includes personalization attribution fields (`personalizationId`, `personalizationContentId`).

**Known update needed:** Add the custom Application Engagement DMO mapping (was created mid-build).

**STATUS:** ✅ Created (needs minor update)

---

## Asset 7: Gap Analysis

**File:** `Clearwater-Bank-Personalization-Gap-Analysis.md`

**Covers:** What the web SDK provides vs what the full demo plan requires. 5 gaps identified with resolution paths.

**STATUS:** ✅ Created

---

## Asset 8: Lessons Learned / Gotchas Document

**Needs to be created.** The most valuable developer asset from this project. Every mistake we made and how we fixed it.

**Content from this build session:**

| # | Gotcha | What Went Wrong | Fix |
|---|---|---|---|
| 1 | `mcis.setPageType` doesn't exist | Used legacy Interaction Studio API instead of `initSitemap()` | Rewrote sitemap using `initSitemap` + `sendEvent` |
| 2 | `file://` protocol blocks SDK | Opened HTML as local file — SDK can't set cookies or make API calls | Must serve from `localhost` via `python -m http.server` |
| 3 | Interaction names can't have spaces | `"View Home Page"` rejected — eventType validation requires alphanumeric + underscores | Changed to `"View_Home_Page"` |
| 4 | `consents: []` blocks all events | Empty consent array means "no consent" — events translated but not sent to CDP | Added explicit `ConsentStatus.OptIn` |
| 5 | `SalesforceInteractions` not on `window` | SDK global only exists inside sitemap context, not on `window` object | Signal readiness via `window.__cwSDKReady` flag from sitemap `.then()` |
| 6 | SPA hash navigation not detected by SDK | `initSitemap` evaluates page types on initial load only — hash changes not auto-detected | Manual `sendEvent` + `Personalization.fetch` on every `navigateTo` call |
| 7 | `"Identity"` is reserved event type | Can't use "Identity" as `interaction.name` — it's a profile-only event type | Use `user.attributes.eventType: "identity"` with a regular interaction name |
| 8 | `emailAddress` vs `email` field mismatch | SDK uses `emailAddress` in `user.attributes` but schema field is `email` | Changed sitemap to use `email` matching schema |
| 9 | `isAnonymous` required but not sent | Recommended schema marks `isAnonymous` as required — SDK doesn't auto-send it | Added `isAnonymous: "false"` to identity event |
| 10 | `catalogObject.type` sent as "Product" | All catalog events had generic type — CI couldn't distinguish Home Loan from Investment | Changed to actual product category: `"Home Loan"` |
| 11 | Custom interaction names change field names | Using custom name instead of SDK constant changed `type` to `catalogObjectType` — schema mismatch | Must use `CatalogObjectInteractionName.ViewCatalogObject` for catalog events |
| 12 | CI can't edit after creation (streaming) | Real-time CIs are immutable — can't change filters | Delete and recreate with correct values |
| 13 | CI query needs IDR | CI joins through `IndividualIdentityLink` — no IDR = no join = zero results | Must run IDR before CI can produce output |
| 14 | IDR ruleset needs "Device to Known" rule | Email match alone doesn't link anonymous visitors | Added recommended rules including Device to Known |
| 15 | IDR ruleset must match Basic Settings | Multiple rulesets possible but only the one in Basic Settings feeds the Unified Individual used by data graphs | Align Basic Settings to the correct ruleset |
| 16 | Website doesn't render live responses | SDK returns personalization decisions but React code showed mock content | Added `useEffect` listener for `clearwater:personalization` event to override mock data with live attributes |
| 17 | Application Engagement needs custom DMO | Website Engagement has no Product field — objective-based recommender can't train without item-level tracking | Created custom Application Engagement DMO with Product field |
| 18 | Profile events need `interaction` block | Sending `user.attributes` alone (no interaction) may not generate profile records in data streams | Combined `interaction` + `user.attributes` in single `sendEvent` |

**STATUS:** ⬜ Not yet created as standalone document — content above, needs formatting

---

## Asset 9: Setup Sequence Runbook

**Needs to be created.** Step-by-step build guide a developer can follow to reproduce this from scratch.

**Suggested structure:**

| Phase | Steps | Duration | Prerequisites |
|---|---|---|---|
| 1. Schema + Connector | Create connector, upload schema, create data streams | 30 min | Data Cloud access |
| 2. DLO-to-DMO Mappings | Map all engagement + profile streams | 1 hour | Data streams deployed |
| 3. Custom DMOs | Create Application Engagement DMO | 15 min | — |
| 4. Products Catalog | Upload CSV, map to Goods Product, add ImageUrl custom field | 30 min | — |
| 5. Identity Resolution | Create ruleset with 3 recommended rules, run initial build | 30 min | Identity data stream active |
| 6. Data Graphs | Real-Time Profile Graph + Standard Item Graph | 45 min | IDR, products loaded |
| 7. Engagement Signals | 5 signals (ProductView, ProductClick, ApplicationStart, ArticleClick, CalculatorEngagement) | 30 min | DMO mappings active |
| 8. Calculated Insights | Home Loan View Count (+ others as needed) | 30 min per CI | Data graph, engagement data flowing |
| 9. Content Schemas | 5 dynamic content schemas (Banner, Promo, Infobar, CTA Card, Life Event Tile) | 15 min | — |
| 10. Personalization Points | Create points + decisions with targeting rules | 1-2 hours | CIs, data graph, content schemas |
| 11. Sitemap | Upload to connector | 5 min | Personalization point API names finalized |
| 12. Website | Set CDN URL, serve from localhost, test | 15 min | Sitemap uploaded |
| 13. Validation | End-to-end test: browse → CI counts → decision fires → content renders | 30 min | Everything above |

**Total estimated build time:** 8-10 hours for a developer who knows the platform. 2-3 days for first-timers (accounting for learning and troubleshooting).

**STATUS:** ⬜ Not yet created — structure above, needs step-by-step detail

---

## Asset 10: All Deliverable Files

| File | Type | Purpose | Audience |
|---|---|---|---|
| `clearwater-bank.html` | HTML | Demo website with live SDK integration | Both |
| `ClearwaterBank.jsx` | React | Artifact version (no SDK, persona mock only) | Client demo in Claude |
| `clearwater-sitemap.js` | JavaScript | Data 360 sitemap — events + personalization fetch | Developer |
| `clearwater-schema.json` | JSON | Web connector schema — event definitions | Developer |
| `clearwater-products.csv` | CSV | Financial products catalog (16 products) | Developer |
| `Clearwater-Bank-Build-Summary.md` | Markdown | Complete build inventory and status | Developer |
| `Clearwater-Bank-DLO-to-DMO-Mapping-Guide.md` | Markdown | Field-level mapping reference | Developer |
| `Clearwater-Bank-Personalization-Gap-Analysis.md` | Markdown | Coverage analysis — what's built vs needed | Both |

---

## Assets Still Needed

| Asset | Primary Audience | Priority | Estimated Effort |
|---|---|---|---|
| **Demo Talk Track / Storyboard** | Client-facing | 🔴 High | 2 hours |
| **Capability Slide Deck (10-15 slides)** | Client-facing | 🔴 High | 3 hours |
| **Architecture Diagram (client-friendly)** | Client-facing | 🟡 Medium | 1 hour |
| **Use Case One-Pagers** | Client-facing | 🟡 Medium | 3 hours (8 use cases) |
| **ROI / Value Framework** | Client-facing | 🟡 Medium | 2 hours |
| **Lessons Learned / Gotchas** | Developer | 🔴 High | 1 hour (content exists above) |
| **Setup Sequence Runbook** | Developer | 🔴 High | 3 hours |
| **Updated Build Summary** | Developer | 🟡 Medium | 1 hour |
| **Updated Mapping Guide** | Developer | 🟡 Medium | 30 min |
