# Clearwater Bank — Personalization Coverage Gap Analysis

## What the DLO-to-DMO mappings cover vs what the demo website needs

The mapping guide covers **web SDK behavioral data flowing into DMOs**. But the Clearwater Bank demo has personalization scenarios that depend on **five additional data layers** beyond web SDK mappings. This document maps every personalization scenario to its data dependency and flags what's missing.

---

## Coverage Matrix

### ✅ Fully Covered by Web SDK Mappings

| Demo Scenario | Data Dependency | Covered By |
|---|---|---|
| Product page view tracking | `catalog` event → Product Browse Engagement DMO | Catalog section mapping |
| Product click tracking | `catalog` event → Product Browse Engagement DMO | Catalog section mapping |
| Anonymous visitor identity creation | `identity` event → Individual DMO | Identity DLO mapping |
| Email capture for identity resolution | `contactPointEmail` event → Contact Point Email DMO | Contact Point Email mapping |
| External ID matching | `partyIdentification` event → Party Identification DMO | Party Identification mapping |
| Personalization attribution tracking | `personalizationId` + `personalizationContentId` → Product Browse Engagement | Catalog section mapping |
| A/B experiment metric collection | Attribution fields on Product Browse Engagement | Catalog section mapping |
| Application start tracking | `ApplicationStart` custom event → engagement DLO | Custom event in schema |
| Calculator engagement tracking | `CalculatorEngagement` custom event → engagement DLO | Custom event in schema |
| Article click tracking | `ArticleClick` custom event → engagement DLO | Custom event in schema |

### ⚠️ Partially Covered — Needs Additional Configuration After Mapping

| Demo Scenario | What Mappings Provide | What's Still Needed |
|---|---|---|
| **Active Mortgage Seeker** real-time segment | Product Browse Engagement DMO receives catalog events with product type | **Engagement Signal**: create "ProductView" signal on Product Browse Engagement, filtered to `Engagement Channel Action = catalog-object-view-start`. Then build segment using this signal with filter `Product Category = Home Loan`, count ≥ 3, last 7 days |
| **Incomplete Application** real-time segment | ApplicationStart event lands in engagement DLO | **Custom DMO mapping** (Option B from mapping guide) + **Engagement Signal**: create "ApplicationStart" signal on the custom Application Engagement DMO. Then build segment: ApplicationStart fired, no ApplicationSubmit in 14 days |
| **Investment Interest** real-time segment | Product Browse Engagement receives product views | **Engagement Signal**: reuse "ProductView" signal. Build segment with filter `Product Category = Investment`, count ≥ 2 |
| **Product_Type_Affinity** calculated affinity | Product Browse Engagement has Product Category field mapped | **Calculated Affinity config**: create in Personalization UI. Object = Goods Product, dimension = ProductType. Signals: ProductView (Low+), ProductClick (Med+), ApplicationStart (High+) |
| **Content_Topic_Affinity** calculated affinity | ArticleClick event lands in engagement DLO | **Custom DMO** for Article Engagement + **Engagement Signal** on it + **Calculated Affinity config** |
| **MaxAppStarts_Personalized** recommender | ApplicationStart signal exists | **Custom Objective**: create "Maximize Application Starts" using ApplicationStart signal as metric. **Item Data Graph**: must include Application Engagement DMO. **Training period**: 48-72h of real data |
| **Recommender training feedback loop** | `personalizationId` mapped to Product Browse Engagement | Recommenders learn from the attribution link. Works automatically AFTER mappings + engagement signals + recommender config are all in place |

### ❌ NOT Covered by Web SDK Mappings — Separate Data Sources Required

These are the gaps. Each requires a data source outside the web connector.

#### Gap 1: CRM Profile Data for Merge Fields

**Affected demo scenarios:**
- `PDP_Infobar`: "Welcome back, Michael — as an existing Clearwater customer, you may qualify for our loyalty home loan rate"
- `Dashboard_Relationship_Banner`: Name, tier, accounts held
- `Homepage_Hero_Banner` (Existing Customer decision): "Welcome back, {FirstName}"
- `PDP_Application_Nudge` (Pre-Qualified decision): Credit Segment from CRM

**What's needed:**
- CRM data streams from Salesforce Core objects (Contact, Lead, Account)
- These flow through the **Salesforce CRM Connector** (not the web connector)
- Fields needed in the **Real-Time Profile Data Graph**:

| CRM Object | Field | Used For |
|---|---|---|
| Contact | FirstName | Merge field in hero, infobar, dashboard banner |
| Contact | LastName | Merge field |
| Contact | AccountId (→ Account) | Account-level relationship data |
| Account | Name | Business customer identification |
| Account | Type | Business vs Personal |
| Custom: Financial Account (or FSC object) | Product Type | "Products held" for cross-sell logic |
| Custom: Financial Account | Balance | Wealth segment threshold |
| Custom: Financial Account | Relationship Tier | Premier, Everyday, etc. |
| Custom: Financial Account | Status | Active, Closed |

**How to set up:**
1. Data Cloud → Data Streams → New → Salesforce CRM → select Contact, Lead, Account objects
2. Map CRM DLOs to Individual DMO, Account DMO
3. Add these CRM-sourced objects and fields to your **Real-Time Profile Data Graph**
4. The data graph makes them available as merge fields and targeting rule attributes in personalization points

**Without this:** Merge fields return blank/default values. Targeting rules based on "Customer Status = Active" or "Relationship Tier = Premier" won't fire.

---

#### Gap 2: Financial Products Catalog (Goods Product DMO)

**Affected demo scenarios:**
- All recommenders (need a product catalog to recommend from)
- `Homepage_Personalized_For_You`: objective-based product recs
- `PDP_You_May_Also_Consider`: A/B experiment with rule-based vs objective-based
- `Dashboard_Next_Best_Product`: authenticated deep-profile recs
- All product browse engagement tracking (the `id` field in catalog events must match Product IDs in the catalog)
- Item data graph (required for recommenders)

**What's needed:**
- Load financial product records into the **Goods Product DMO** (or a custom Product DMO)
- Add custom fields: `ProductType__c`, `InterestRate__c`, `TargetSegment__c`, `ImageUrl__c`, `ApplyUrl__c`
- Product IDs must match the `catalog.id` values in the sitemap (e.g., "clearwater-variable-home-loan")

**How to load:**
- Option A: CSV upload via Data Cloud → Data Streams → New → File Upload
- Option B: Ingestion API
- Option C: Salesforce CRM Connector (if products are in a Salesforce Product2 or custom object)

**After loading, build the Item Data Graph:**
- Primary DMO: Goods Product
- Add fields: Product ID, Product Name, ProductType, InterestRate, ImageUrl, ApplyUrl
- Add Calculated Insights if using rule-based recommenders (e.g., MostViewedCount CI, CoHeldProducts CI)

**Without this:** Recommenders have nothing to recommend. Product Browse Engagement records have no Product to link to. The item data graph is empty.

---

#### Gap 3: Real-Time Profile Data Graph Configuration

**Affected demo scenarios:**
- ALL personalization points on the website (every `Personalization.fetch()` call)
- All targeting rules in decisions
- All merge fields
- All recommender filters using profile data

**What's needed:**

The Real-Time Profile Data Graph is the central nervous system. It must include:

| Object / Component | Fields to Include | Powers |
|---|---|---|
| Unified Individual | (auto-selected) | Root object |
| Unified Link Individual | (auto-selected) | Links to source individuals |
| Individual | Individual ID | Identity |
| Contact Point Email | Email Address | Identity resolution, email merge field |
| Contact Point Phone | Telephone Number | Phone merge field |
| Product Browse Engagement | Created Date, Product ID, Product Category, Engagement Channel Action | Browsing history for targeting rules |
| Application Engagement (custom DMO) | Created Date, Product, Application Status | Incomplete application segment, custom objective |
| Contact (via CRM) | FirstName, LastName, Account | Merge fields |
| Account (via CRM) | Name, Type | Business customer targeting |
| Financial Account (custom or FSC) | Product Type, Balance, Tier, Status | Wealth segment, cross-sell logic |
| Real-Time Segment Memberships | Segment ID, Timestamp | All segment-based targeting rules |
| Calculated Insights | Product_Type_Affinity scores | Affinity-based targeting rules |

**How to build:**
1. Data Cloud → Data Graphs → New → Real-Time Data Graph
2. Primary DMO: Unified Individual
3. Expand: Unified Link Individual → Individual → Contact Point Email, Contact Point Phone
4. Add: Product Browse Engagement, Application Engagement (custom)
5. Add: CRM objects (Contact, Account, custom Financial Account)
6. Add: Segment Memberships (for real-time segments)
7. Add: Calculated Insights (for affinity scores)
8. Set consumption limits, save and build

**Without this:** Personalization points return empty responses. No targeting rules can evaluate. Merge fields return defaults.

---

#### Gap 4: Identity Resolution Ruleset

**Affected demo scenarios:**
- All authenticated personalization (Premier Customer, Existing Customer personas)
- Dashboard page (requires known individual)
- Merge fields (require matched CRM profile)
- Segments that use CRM data

**What's needed:**

| Rule | Object | Field | Match Method | Purpose |
|---|---|---|---|---|
| Rule 1 | Contact Point Email | Email Address | Exact | Match web visitor email to CRM Contact |
| Rule 2 | Party Identification | Identification Number | Exact | Match external user IDs |
| Rule 3 | (Fallback) | Device ID / Cookie | Exact | Maintain anonymous profile continuity |

**How to set up:**
1. Data Cloud → Identity Resolution → New Ruleset
2. Select data space, select real-time data graph
3. Add match rules in priority order
4. Enable real-time matching
5. Schedule batch reconciliation (daily)

**Without this:** Web visitors stay anonymous forever. CRM data never merges into the web profile. Authenticated decisions can't access CRM fields.

---

#### Gap 5: Engagement Signals + Custom Objective

**Affected demo scenarios:**
- All real-time segments (depend on engagement signals)
- All calculated affinities (depend on engagement signals)
- MaxAppStarts recommender (depends on custom objective which depends on custom engagement signal)
- Experiment primary metric (Application Start Count)

**What's needed (create in Personalization UI → Engagement Signals):**

| Signal Name | API Name | DMO | Filter | Creates Metric |
|---|---|---|---|---|
| Product View | ProductView | Product Browse Engagement | Engagement Channel Action = `catalog-object-view-start` | View Count |
| Product Click | ProductClick | Product Browse Engagement | Engagement Channel Action = `catalog-object-click` | Click Count |
| Application Start | ApplicationStart | Custom Application Engagement DMO | Engagement Type = `ApplicationStart` | Application Start Count |
| Article Click | ArticleClick | Custom Article Engagement DMO | Engagement Type = `ArticleClick` | Click Count |
| Calculator Use | CalculatorEngagement | Website Engagement | Engagement Type = `CalculatorEngagement` | Session Count |

**Custom Objective (create after signals exist):**
- Name: Maximize Application Starts
- Metric: ApplicationStart signal → Application Start Count
- Used by: MaxAppStarts_Personalized recommender, MaxAppStarts_Dashboard recommender

**Without this:** Recommenders can't train. Segments can't populate. Affinities can't calculate. Experiments can't measure.

---

## Complete Build Dependency Chain

```
Web SDK Mappings (what you just built)
  └─ enables: behavioral data flowing into DMOs
       │
       ├─ Gap 1: CRM Data Streams + CRM-to-DMO mappings
       │    └─ enables: merge fields, CRM-based targeting rules
       │
       ├─ Gap 2: Financial Products Catalog load
       │    └─ enables: product catalog for recommenders, product links in engagement
       │
       ├─ Gap 4: Identity Resolution Ruleset
       │    └─ enables: anonymous-to-known profile merge
       │         └─ enables: authenticated personalization, CRM data in profile
       │
       ├─ Gap 3: Real-Time Profile Data Graph
       │    └─ requires: Gaps 1, 2, 4 completed first
       │    └─ enables: ALL personalization points, targeting rules, merge fields
       │
       └─ Gap 5: Engagement Signals + Custom Objective
            └─ requires: DMO mappings active + some behavioral data flowing
            └─ enables: segments, affinities, recommender training, experiments
```

---

## Recommended Build Order

| Phase | What to Build | Depends On | Unblocks |
|---|---|---|---|
| 1 | ✅ Web SDK DLO-to-DMO mappings | Schema uploaded (done) | Behavioral data flow |
| 2 | CRM Data Streams (Contact, Lead, Account) | Salesforce CRM Connector | CRM data in Data Cloud |
| 3 | Financial Products Catalog load | Product records prepared | Recommenders, item data graph |
| 4 | Custom DMOs (Application Engagement, Article Engagement) | Engagement DLO active | Custom event mapping |
| 5 | Custom event DLO-to-DMO mapping (ApplicationStart → custom DMO) | Phase 4 | Custom engagement signals |
| 6 | Identity Resolution Ruleset | Contact Point Email mapped (Phase 1) | Profile merging |
| 7 | Real-Time Profile Data Graph | Phases 1-6 | All personalization points |
| 8 | Item Data Graph | Phase 3 (catalog loaded) | Recommenders |
| 9 | Engagement Signals (5 signals) | Phases 1, 4, 5 | Segments, affinities, objectives |
| 10 | Custom Objective (Maximize Application Starts) | Phase 9 | Objective-based recommenders |
| 11 | Calculated Affinities (2) | Phase 9 | Affinity-based targeting |
| 12 | Segments (12) | Phases 7, 9 | Decision targeting rules |
| 13 | Personalization Points (21) + Decisions | Phases 7, 8, 12 | Website personalization |
| 14 | Recommenders (8) | Phases 8, 10 + 48-72h training | Product recommendations |
| 15 | Experiment on PDP | Phase 14 (recommenders trained) | A/B test |
| 16 | Upload sitemap + CDN URL to website | Phase 13 | Live demo |

---

## Sources

- Salesforce Personalization: Using Data Graphs With Personalization
- Salesforce Personalization: Profile Data Graphs in Personalization Points
- Salesforce Personalization: Personalization Point Considerations
- Salesforce Personalization: Add a Merge Field
- Salesforce Personalization: Real-Time Identity Resolution for Personalization
- Salesforce Personalization: Using Segmentation with Salesforce Personalization
- Salesforce Personalization: Set Up Personalization Features in Marketing Cloud Next
- Salesforce Personalization: Behavioral Events Data Mappings
- Data 360 Integration Guide: Web SDK Connector Mappings
- Data 360: Accelerated Data Ingest (Real-Time CRM Ingestion)
