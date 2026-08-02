# Salesforce Personalization — Sitemap Implementation Guide
## Ownership, Inputs, Sequence & Required Assets

---

## 1. Who Owns the Sitemap?

**Short answer:** The Salesforce implementation partner (you) designs and builds the sitemap. The client's website team deploys it and provides the inputs you need.

**Why it can't be one side alone:**

| If only the website team builds it | If only the Salesforce partner builds it |
|---|---|
| They don't know the DMO structure, schema fields, engagement signal names, personalization point API names, or Data Cloud event naming rules | You don't know the URL patterns, DOM structure, authentication mechanism, SPA routing framework, or how the site deploys to production |

---

## 2. RACI Matrix

| Activity | Salesforce Partner | Client Website Team | Client Marketing/Business |
|---|---|---|---|
| **Define use cases and personalization zones** | A, C | C | R |
| **Provide page architecture document** | C | R, A | I |
| **Provide authentication flow details** | C | R, A | I |
| **Design Data Cloud schema** | R, A | C | I |
| **Design DMOs and mappings** | R, A | I | I |
| **Design personalization points and decisions** | R, A | I | C |
| **Design engagement signals and CIs** | R, A | I | I |
| **Write the sitemap JavaScript** | R, A | C | I |
| **Review sitemap against website code** | C | R, A | I |
| **Test sitemap in Sitemap Builder extension** | R | C | I |
| **Upload sitemap to Data Cloud connector** | R, A | I | I |
| **Deploy SDK CDN script to production website** | I | R, A | I |
| **Add sitemap to production connector** | R, A | I | I |
| **UAT — validate events in Data Cloud** | R, A | C | C |
| **UAT — validate personalization responses** | R | C | A |
| **Production go-live sign-off** | C | A | R |

R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## 3. Inputs Required from the Website Team

### 3.1 Page Architecture Document

This is the **single most important input.** Without it, the sitemap cannot be built.

| What you need | Example | Why |
|---|---|---|
| Complete list of page types and URLs | Homepage: `/`, PDP: `/products/{id}`, Category: `/category/{slug}` | Maps to sitemap `isMatch` functions |
| URL pattern for each page type | Static paths vs dynamic segments vs query params | Determines how `isMatch` detects each page |
| SPA or traditional page loads? | React SPA with hash routing, Next.js with server rendering, traditional multi-page | Determines whether SDK auto-detects navigation or needs manual `sendEvent` calls |
| SPA routing mechanism | Hash (`#page`), History API (`pushState`), framework router (React Router, Vue Router) | Determines how to trigger page type re-evaluation |
| Which pages exist today vs planned | "Product detail page launches next quarter" | Scoping — don't build sitemap for pages that don't exist |

**Deliverable from website team:** Page Architecture Document (see Asset 1 below)

---

### 3.2 Authentication & Identity Information

| What you need | Example | Why |
|---|---|---|
| How does a user authenticate? | Login form, SSO redirect, JWT token, OAuth | Determines when and how to fire identity events |
| Where is user identity available after login? | `window.userProfile.email`, cookie, JavaScript variable, API call | Determines how the sitemap reads the email/name |
| What user fields are available client-side? | Email, first name, last name, customer ID, loyalty tier | Determines which profile attributes the sitemap can send |
| Is identity available on page load or async? | Available in a cookie immediately vs fetched via API after load | Determines sync vs async identity resolution in the sitemap |
| Guest checkout / partial identity? | Email captured on form without full login | Determines whether to fire identity events from forms |

**Deliverable from website team:** Authentication & Identity Specification (see Asset 2 below)

---

### 3.3 Product / Catalog Information

| What you need | Example | Why |
|---|---|---|
| Where is product ID on the page? | URL path segment: `/products/SKU-123`, data attribute: `data-product-id`, JavaScript variable | Maps to `catalogObject.id` |
| Where is product name? | `<h1>` tag, meta tag, JS variable | Maps to `catalogObject.attributes.name` |
| Where is product category? | URL segment, breadcrumb, data attribute, JS variable | Maps to `catalogObject.type` — feeds CIs and recommender filters |
| How are product IDs formatted? | SKU: `SKU-123`, slug: `variable-home-loan`, numeric: `12345` | Must match IDs in the Goods Product DMO |
| Is there a data layer? | GTM dataLayer, custom `window.pageData` object | Simplifies extraction — one reliable source vs DOM scraping |

**Deliverable from website team:** Product Data Layer Specification (see Asset 3 below)

---

### 3.4 DOM / Content Zone Information

| What you need | Example | Why |
|---|---|---|
| Where should personalized content render? | `#hero-banner`, `.recommendation-grid`, `[data-zone="promo"]` | Maps to content zone CSS selectors (for WPM) or React component hooks |
| Is the rendering framework-managed? | React state, Vue reactivity, server-rendered HTML | Determines if personalization inserts HTML or updates state |
| What's the fallback if personalization doesn't respond? | Default content stays, blank space, loading spinner | Determines flicker defense strategy |
| Z-index and CSS constraints? | Fixed headers, modal overlays, sticky elements | Affects where personalization content can be injected |

**Deliverable from website team:** Content Zone Specification (see Asset 4 below)

---

### 3.5 Custom Interactions / Business Events

| What you need | Example | Why |
|---|---|---|
| What business-meaningful actions can users take? | Add to cart, start application, submit form, download PDF, click CTA | Maps to custom `sendEvent` calls |
| How are these actions triggered? | Button click, form submit, AJAX callback, page load | Determines where to hook the event tracking code |
| What data is available at the moment of action? | Product ID, form values, selected options | Determines what fields to include in the event |
| Are there existing analytics events? | GTM events, Adobe Analytics calls, custom tracking | Can piggyback on existing event infrastructure |

**Deliverable from business + website team:** Interaction Event Catalog (see Asset 5 below)

---

### 3.6 Consent & Privacy

| What you need | Example | Why |
|---|---|---|
| Is there a cookie consent banner? | OneTrust, Cookiebot, custom | SDK must respect consent status |
| How does consent status get communicated to JavaScript? | Cookie value, JS variable, callback function | Determines how to wire consent into `SalesforceInteractions.init()` |
| Which consent categories apply? | "Analytics", "Marketing", "Functional" | Maps to consent provider/purpose in the SDK |
| GDPR / Privacy requirements? | User must opt-in before any tracking | Determines consent mode: opt-in required vs opt-out default |

**Deliverable from website team + legal:** Consent Integration Specification (see Asset 6 below)

---

### 3.7 Deployment & Infrastructure

| What you need | Example | Why |
|---|---|---|
| How are scripts deployed to the website? | Tag manager (GTM), direct in HTML, bundled in build pipeline | Determines how the CDN script tag gets added |
| Deployment cadence and process? | Weekly releases, CI/CD, manual deployment | Impacts timeline for SDK deployment |
| Testing environments? | Dev, staging, UAT, production | Determines where to test before go-live |
| Content Security Policy headers? | `script-src` restrictions | SDK CDN URL must be whitelisted |
| Performance budget? | "No script can add more than 200ms to page load" | SDK is ~30KB — usually fine but needs validation |

**Deliverable from website team:** Deployment & Infrastructure Checklist (see Asset 7 below)

---

## 4. Inputs Required from the Business / Marketing Team

| What you need | Why |
|---|---|
| **Personalization use cases** — which visitors should see what content, and where | Drives the entire sitemap design — what events to capture, what pages to personalize |
| **Priority of use cases** — which ones launch first | Scoping — sitemap should cover Phase 1 use cases at minimum |
| **Content for each decision** — headlines, images, CTAs per targeting rule | Needed for personalization point configuration (not sitemap, but validates sitemap captures the right data) |
| **KPIs and success metrics** — what does "working" look like | Determines which engagement signals and experiment metrics to build |
| **Segment definitions in business terms** — "Mortgage seekers are people who viewed home loan pages 3+ times" | Translates to CI thresholds and targeting rules |

**Deliverable from business team:** Personalization Use Case Brief (see Asset 8 below)

---

## 5. Complete Sequence — From Kickoff to Go-Live

### Phase 1: Discovery & Requirements (Weeks 1-2)

| Step | Who | Activity | Output |
|---|---|---|---|
| 1.1 | Business + SF Partner | Use case workshop — define what to personalize, for whom, with what content | **Asset 8: Use Case Brief** |
| 1.2 | Website Team + SF Partner | Page architecture walkthrough — URL patterns, SPA framework, routing model | **Asset 1: Page Architecture Document** |
| 1.3 | Website Team + SF Partner | Authentication & identity deep-dive — how login works, what data is available | **Asset 2: Auth & Identity Spec** |
| 1.4 | Website Team + SF Partner | Product/catalog data review — where product data lives on each page | **Asset 3: Product Data Layer Spec** |
| 1.5 | Website Team + SF Partner | Content zone identification — where personalized content renders on each page | **Asset 4: Content Zone Spec** |
| 1.6 | Business + Website Team | Custom interaction catalog — what actions to track beyond page views | **Asset 5: Interaction Event Catalog** |
| 1.7 | Website Team + Legal | Consent integration review — banner type, consent flow, privacy rules | **Asset 6: Consent Integration Spec** |
| 1.8 | Website Team | Deployment & infrastructure checklist | **Asset 7: Deployment Checklist** |

---

### Phase 2: Design (Weeks 2-3)

| Step | Who | Activity | Output |
|---|---|---|---|
| 2.1 | SF Partner | Design the Data Cloud schema — events, fields, required/optional | **Asset 9: Schema Design Document** |
| 2.2 | SF Partner | Design DLO-to-DMO mappings — engagement + profile streams | **Asset 10: Mapping Guide** |
| 2.3 | SF Partner | Design personalization points, decisions, targeting rules | **Asset 11: Personalization Point Design** |
| 2.4 | SF Partner | Design engagement signals, CIs, and data graphs | **Asset 12: Data Architecture Document** |
| 2.5 | SF Partner | Design the sitemap — page types, events, identity, personalization fetch | **Asset 13: Sitemap Design Document** |
| 2.6 | SF Partner | Design review with website team — validate all assumptions | **Sign-off on design** |

---

### Phase 3: Build (Weeks 3-5)

| Step | Who | Activity | Output |
|---|---|---|---|
| 3.1 | SF Partner | Upload schema, create data streams, configure mappings | Data Cloud configured |
| 3.2 | SF Partner | Create custom DMOs, identity resolution, data graphs | Data foundation ready |
| 3.3 | SF Partner | Create engagement signals, CIs | Metrics ready |
| 3.4 | SF Partner | Create content schemas, personalization points, decisions | Personalization configured |
| 3.5 | SF Partner | Write sitemap JavaScript | **Asset 14: clearwater-sitemap.js** |
| 3.6 | SF Partner | Upload sitemap to connector, test with Sitemap Builder extension | Sitemap validated |
| 3.7 | Website Team | Add CDN script tag to staging/dev environment | SDK deployed to test |
| 3.8 | SF Partner + Website Team | Joint testing — validate events flow, decisions return | Test results documented |

---

### Phase 4: Integration Testing (Week 5-6)

| Step | Who | Activity | Output |
|---|---|---|---|
| 4.1 | SF Partner | Validate data streams receiving events | Data flow confirmed |
| 4.2 | SF Partner | Validate DMO records created correctly | Mapping confirmed |
| 4.3 | SF Partner | Validate identity resolution merges correctly | IDR confirmed |
| 4.4 | SF Partner | Validate CIs producing output | Metrics confirmed |
| 4.5 | SF Partner | Validate personalization decisions fire for correct targeting rules | Decisions confirmed |
| 4.6 | Website Team | Validate personalized content renders correctly on the website | Rendering confirmed |
| 4.7 | Website Team | Validate consent integration works | Consent confirmed |
| 4.8 | Website Team | Validate performance — page load times with SDK | Performance confirmed |
| 4.9 | SF Partner | Validate attribution — personalizationId flows back to engagement records | Attribution confirmed |
| 4.10 | All | End-to-end UAT — full user journey | **Asset 15: UAT Sign-off** |

---

### Phase 5: Go-Live (Week 6-7)

| Step | Who | Activity | Output |
|---|---|---|---|
| 5.1 | Website Team | Deploy CDN script to production | SDK live on production |
| 5.2 | SF Partner | Switch connector to production sitemap | Production sitemap active |
| 5.3 | SF Partner | Monitor data streams for first production events | Production data flowing |
| 5.4 | SF Partner | Monitor personalization responses | Production decisions firing |
| 5.5 | All | Hypercare — monitor for errors, missing events, consent issues | **Asset 16: Go-Live Monitoring Checklist** |
| 5.6 | SF Partner | Handover documentation | **Asset 17: Runbook for ongoing operations** |

---

## 6. Complete Asset List

### Requirements Documents (from client)

| # | Asset | Owner | Format | Purpose |
|---|---|---|---|---|
| 1 | **Page Architecture Document** | Website Team | Spreadsheet or Confluence | Every page type, URL pattern, SPA routing details |
| 2 | **Authentication & Identity Specification** | Website Team | Document | How login works, where user data is available in JS |
| 3 | **Product Data Layer Specification** | Website Team | Document | Where product ID/name/category exist on each page |
| 4 | **Content Zone Specification** | Website Team | Document + screenshots | DOM targets for personalized content, CSS selectors |
| 5 | **Interaction Event Catalog** | Business + Website Team | Spreadsheet | Business events to track: name, trigger, data available |
| 6 | **Consent Integration Specification** | Website Team + Legal | Document | Banner type, consent API, privacy requirements |
| 7 | **Deployment & Infrastructure Checklist** | Website Team | Checklist | How scripts deploy, CSP rules, environments |
| 8 | **Personalization Use Case Brief** | Business / Marketing | Document | What to personalize, for whom, success metrics |

### Design Documents (from SF Partner)

| # | Asset | Owner | Format | Purpose |
|---|---|---|---|---|
| 9 | **Schema Design Document** | SF Partner | Spreadsheet + JSON | Events, fields, required flags, event-to-DMO mapping intent |
| 10 | **DLO-to-DMO Mapping Guide** | SF Partner | Spreadsheet | Field-level mapping for every data stream |
| 11 | **Personalization Point Design** | SF Partner | Spreadsheet | Every point, every decision, targeting rules, content schema, priority order |
| 12 | **Data Architecture Document** | SF Partner | Diagram + document | Data graphs, CIs, engagement signals, IDR ruleset, how data flows |
| 13 | **Sitemap Design Document** | SF Partner | Document | Page type mapping, event catalog, identity flow, personalization fetch plan |

### Build Artifacts (from SF Partner)

| # | Asset | Owner | Format | Purpose |
|---|---|---|---|---|
| 14 | **Sitemap JavaScript** | SF Partner | `.js` file | The actual sitemap code to upload |
| 15 | **Schema JSON** | SF Partner | `.json` file | The schema to upload to the connector |
| 16 | **Product Catalog CSV** | SF Partner / Client | `.csv` file | Product records to load into Goods Product DMO |

### Testing & Go-Live Documents

| # | Asset | Owner | Format | Purpose |
|---|---|---|---|---|
| 17 | **Test Plan** | SF Partner | Document | Test cases for every event, every decision, every edge case |
| 18 | **UAT Sign-off** | All | Sign-off document | Formal approval that everything works |
| 19 | **Go-Live Monitoring Checklist** | SF Partner | Checklist | What to monitor in the first 48 hours |
| 20 | **Operations Runbook** | SF Partner | Document | How to update decisions, add events, troubleshoot issues post-go-live |

### Lessons Learned (from SF Partner)

| # | Asset | Owner | Format | Purpose |
|---|---|---|---|---|
| 21 | **Gotchas & Lessons Learned** | SF Partner | Document | Platform-specific pitfalls, SDK quirks, naming rules — saves the next team weeks |

---

## 7. Key Risk Areas to Address Early

| Risk | Impact | Mitigation |
|---|---|---|
| Website team doesn't provide page architecture on time | Sitemap design delayed by weeks | Request this in the kickoff meeting — it's the #1 blocker |
| SPA framework doesn't fire hashchange/popstate | SDK doesn't detect navigation → no events on page changes | Identify SPA routing mechanism in discovery, build manual sendEvent pattern |
| Product IDs on website don't match IDs in Goods Product DMO | Engagement records can't link to products → recommenders fail | Agree on ID format in discovery, validate with sample data |
| Consent banner blocks SDK entirely | Zero data flows until visitor consents | Test consent integration early in Phase 3, not Phase 4 |
| Schema uploaded with wrong required fields | Events rejected → no data → everything downstream fails | Validate schema against actual SDK event output BEFORE uploading |
| Identity available async (API call after page load) | Identity event fires too late or not at all | Design the sitemap to handle async identity with callbacks/promises |
| Website team deploys CDN script without testing | Events fire on production before personalization points are ready | Coordinate deployment timing — SDK should go live AFTER Salesforce config is complete |
