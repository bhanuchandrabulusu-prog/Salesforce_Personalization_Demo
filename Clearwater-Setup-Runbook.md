# Clearwater Bank — Setup Sequence Runbook

## Purpose

Step-by-step guide to reproduce the entire Clearwater Bank Salesforce Personalization demo from scratch. Follow in order — each phase depends on the previous one.

**Total estimated build time:** 8-10 hours for experienced practitioners. 2-3 days for first-timers.

---

## Phase 1: Data Cloud Foundation (30 minutes)

### 1.1 Create Web Connector

1. Setup → Websites & Mobile Apps → New
2. Name: `Clearwater Bank Demo`
3. Base URL: `http://localhost:3000`
4. Save → note the CDN script URL

### 1.2 Upload Schema

1. Download `clearwater-schema.json` (recommended schema + 3 custom events)
2. Web Connector → Upload Schema
3. Format must be `{"records": [...]}`
4. Verify: 14 event types created (11 recommended + 3 custom)

### 1.3 Create Data Streams

The schema upload auto-creates 6 data streams:
- Behavioral Events (engagement)
- Identity (profile)
- Contact Point Email (profile)
- Contact Point Phone (profile)
- Contact Point Address (profile — unused)
- Party Identification (profile — unused)

Verify each is **Active** and set to **Partial** refresh mode (not Incremental).

### 1.4 Upload Sitemap

1. Web Connector → Sitemap → Upload
2. Upload `clearwater-sitemap.js`
3. Verify: sitemap shows as active

---

## Phase 2: DLO-to-DMO Mappings (1 hour)

### 2.1 Behavioral Events Mapping

Map the behavioral events DLO to standard engagement DMOs:

**Catalog events → Product Browse Engagement DMO:**
- `catalog_id__c` → Product
- `catalog_type__c` → Product Category Name
- `catalog_interactionName__c` → Engagement Channel Action
- Standard fields: deviceId, dateTime, sessionId, eventId, sourceUrl, sourceChannel

**Custom events → Website Engagement DMO:**
- ArticleClick, CalculatorEngagement → Engagement Type

**ApplicationStart → Application Engagement DMO** (custom — see Phase 3)

### 2.2 Identity Mapping

Map Identity DLO → Individual DMO:
- `deviceId` → Individual Id (PK)
- `deviceId` → Party
- `firstName` → First Name
- `lastName` → Last Name
- `isAnonymous` → Is Anonymous

### 2.3 Contact Point Email Mapping

Map Contact Point Email DLO → Contact Point Email DMO:
- `deviceId` → Contact Point Email Id (PK)
- `deviceId` → Party
- `email` → Email Address

### 2.4 Contact Point Phone Mapping

Map Contact Point Phone DLO → Contact Point Phone DMO:
- `deviceId` → Contact Point Phone Id (PK)
- `deviceId` → Party
- `phoneNumber` → Telephone Number

---

## Phase 3: Custom DMO (15 minutes)

### 3.1 Create Application Engagement DMO

Data Cloud → Data Model → New Custom DMO

| Setting | Value |
|---|---|
| Name | Application Engagement |
| Category | Engagement |

**Fields:**

| Field | Type | Notes |
|---|---|---|
| Application Engagement Id | Text (PK) | Primary key |
| Individual | Text | Foreign key to Individual |
| Product | Lookup Relationship → Goods Product | Links to product catalog |
| Engagement Date Time | DateTime | When the application started |
| Engagement Type | Text | "ApplicationStart" |
| Application Status | Text | Loan amount range from form |

### 3.2 Map ApplicationStart to Application Engagement

Update the behavioral events DLO mapping:
- `ApplicationStart_id__c` → Product (or Goods Product lookup)
- `ApplicationStart_type__c` → (if needed)
- `eventType__c` → Engagement Type (filter: ApplicationStart)
- Standard fields: deviceId → Individual, dateTime → Engagement Date Time

---

## Phase 4: Products Catalog (30 minutes)

### 4.1 Add Custom Field to Goods Product DMO

Data Cloud → Data Model → Goods Product → Fields → New:
- Field: `ImageUrl__c` (Text)

### 4.2 Upload Products

1. Prepare `clearwater-products.csv` (16 financial products)
2. Data Cloud → Data Import → select Goods Product DMO
3. Upload CSV → map columns → execute

### 4.3 Verify

Data Explorer → Goods Product → should show 16 records with product names, categories, and image URLs.

---

## Phase 5: Identity Resolution (30 minutes)

### 5.1 Create Ruleset

Data Cloud → Identity Resolutions → New:
- Primary Object: Individual
- Name: `Clearwater Bank IDR`

### 5.2 Add Match Rules

Add 3 recommended rules:
1. **Normalized Email** — exact match on email
2. **Lead to Contact** — Identity Match Type: `lead-to-contact`
3. **Device to Known** — Identity Match Type: `device-to-known`

### 5.3 Configure Basic Settings

Setup → Basic Settings → Identity Resolution Rulesets → select the Unified Individual from your ruleset.

### 5.4 Enable Real-Time Matching

On the ruleset: enable real-time matching toggle.

### 5.5 Run Initial Build

Click Build/Run. Wait for completion. Verify: Individual Identity Link DMO has records.

---

## Phase 6: Data Graphs (45 minutes)

### 6.1 Real-Time Profile Data Graph

Data Cloud → Data Graphs → New:

| Setting | Value |
|---|---|
| Name | Clearwater Bank Profile (or SP Demo) |
| Type | Real-Time |
| Primary DMO | Unified Individual (from your IDR ruleset) |

**Add objects:**
```
Unified Individual
  └── Unified Link Individual
        └── Individual
              ├── Contact Point Email
              │     ☑ Email Address
              ├── Contact Point Phone
              │     ☑ Telephone Number
              ├── Product Browse Engagement
              │     ☑ Product Browse Engagement Id
              │     ☑ Individual
              │     ☑ Product Category Name
              │     ☑ Engagement Channel Action
              │     ☑ Product
              └── Application Engagement
                    ☑ Application Engagement Id
                    ☑ Individual
                    ☑ Product
                    ☑ Engagement Date Time
                    ☑ Engagement Type
```

**Insights tab:** Add CIs after they're created (Phase 7).

Save and build.

### 6.2 Standard Item Data Graph

Data Cloud → Data Graphs → New:

| Setting | Value |
|---|---|
| Name | Clearwater Bank Products |
| Type | Standard |
| Primary DMO | Goods Product |

**Select fields:**
- Goods Product Id
- Name
- Primary Product Category
- Product SKU
- Description
- ImageUrl__c

Save.

---

## Phase 7: Engagement Signals (30 minutes)

Create 5 engagement signals:

| Signal Name | DMO | Timestamp Field | User ID Field | Catalog ID Field | Filter |
|---|---|---|---|---|---|
| Product View | Product Browse Engagement | Engagement Date Time | Individual | Product | Engagement Channel Action = `View Catalog Object` |
| Product Click | Product Browse Engagement | Engagement Date Time | Individual | Product | Engagement Channel Action = `View Catalog Object` |
| Application Start | Application Engagement | Engagement Date Time | Individual | Product (Goods Product lookup) | Engagement Type = `ApplicationStart` |
| Article Click | Website Engagement | Engagement Date Time | Individual | — | Engagement Type = `ArticleClick` |
| Calculator Engagement | Website Engagement | Engagement Date Time | Individual | — | Engagement Type = `CalculatorEngagement` |

**For Application Start:** check "Make Signal Available in Flows" if you plan to build MC Next event-triggered flows.

---

## Phase 8: Calculated Insights (30 minutes per CI)

### 8.1 HomeLoan_Views (Real-Time)

| Setting | Value |
|---|---|
| Input | Clearwater Bank Profile (real-time data graph) |
| Filter 1 | Engagement Channel Action = `View Catalog Object` |
| Filter 2 | Product Category Name = `Home Loan` |
| Measure | Count of Product Browse Engagement Id → `HomeLoanViewCount` |
| Dimension | Unified Individual Id → `UnifiedIndividualId` |

### 8.2 Investment View Count (Real-Time)

Same pattern, change filters:
- Product Category Name = `Investment`
- Measure name: `InvestmentViewCount` or `investment_view_count`

### 8.3 Application Start Count (Real-Time)

| Setting | Value |
|---|---|
| Filter | Engagement Type = `ApplicationStart` |
| Measure | Count of Application Engagement Id → `ApplicationStartCount` |
| Dimension | Unified Individual Id |

### 8.4 Add CIs to Profile Data Graph

Data Graphs → Clearwater Bank Profile → Edit → Insights tab → add all CIs → rebuild.

---

## Phase 9: Content Schemas (15 minutes)

Create 6 content schemas:

| Schema Name | Type | Attributes |
|---|---|---|
| Banner | Dynamic Content | Headline, Subheadline, CTA Text, CTA URL, Image URL, Eyebrow |
| Promo | Dynamic Content | Message, CTA Text, CTA URL |
| Infobar | Dynamic Content | Message, Icon, Style |
| CTA Card | Dynamic Content | CTA Label, CTA Style, CTA URL, Supporting Text |
| Life Event Tile | Dynamic Content | Icon, Pre Headline, Title, CTA Text, CTA URL |
| Product Recommendation | Recommendations | Select Goods Product fields (Id, Name, Category, Description, ImageUrl) |

---

## Phase 10: Personalization Points + Decisions (1-2 hours)

### 10.1 Dynamic Content Points (10 points, 27 decisions)

See `Clearwater-All-Decision-Content.md` for complete content values per decision.

Build in this order:
1. Homepage_Hero_Banner (7 decisions)
2. Homepage_Promo_Bar (3 decisions)
3. Homepage_Life_Event_Module (4 decisions)
4. Hub_Hero_Banner (3 decisions)
5. Hub_Calculator_Prompt (2 decisions)
6. PDP_Offer_Badge (2 decisions)
7. PDP_Infobar (2 decisions)
8. PDP_Application_Nudge (3 decisions)
9. Dashboard_Relationship_Banner (2 decisions)
10. Dashboard_Life_Event_Prompt (2 decisions)

### 10.2 Recommendation Points (6 points)

See `Clearwater-Recommendation-Points-Guide.md` for complete instructions.

Build after recommenders are created:
1. Homepage_Personalized_For_You (AI recommender)
2. Hub_Product_Spotlight (Complementary recommender)
3. PDP_Complementary_Products (Complementary recommender)
4. Dashboard_Next_Best_Product (Dashboard AI recommender)
5. PDP_You_May_Also_Consider (A/B experiment)
6. Email_Product_Recommendations (batch — for MC Next email)

---

## Phase 11: Recommenders (25 minutes + training time)

See `Clearwater-Recommender-Build-Guide.md` for complete instructions.

Build in this order:
1. Most Viewed Products (rule-based, works immediately — fallback)
2. Personalized Products Max Applications (objective-based, 48-72h training)
3. Dashboard Next Best Product (objective-based, 48-72h training)
4. Complementary Products (rule-based, works immediately)

---

## Phase 12: Website Deployment (15 minutes)

### 12.1 Add CDN Script

Add to the website `<head>`:
```html
<script src="https://cdn.c360a.salesforce.com/beacon/c360a/YOUR_CONNECTOR_ID/scripts/c360a.min.js"></script>
```

### 12.2 Serve Locally

```bash
cd /path/to/ClearWater_Demo
python -m http.server 3000
```

Open: http://localhost:3000/clearwater-bank.html

### 12.3 Verify SDK

- Console: `[Clearwater Sitemap] ✓ SDK initialized.`
- Demo bar: green "SDK Connected" badge
- Console: events translating for Data Cloud on page navigation

---

## Phase 13: End-to-End Validation (30 minutes)

See `Clearwater-Testing-Guide.md` for complete test scripts (14 tests).

**Quick validation sequence:**

1. Fresh incognito → Homepage → Default hero ✅
2. Navigate Mortgage Detail 3x → wait 3 min → Homepage → LIVE mortgage hero ✅
3. Click Apply → fill form → 4 events in Console ✅
4. Switch to authenticated persona → identity events fire ✅
5. Check Data Cloud → records in all data streams ✅
6. Check Unified Individual profile → merged data ✅
7. Toggle Personalization Zones → all zones show correct point names and decisions ✅

---

## Post-Build: Ongoing Operations

| Task | Frequency | Who |
|---|---|---|
| Create/update decisions | As needed | Marketing team |
| Monitor pipeline intelligence | Weekly | SF admin |
| Review experiment results | Bi-weekly | Marketing + analytics |
| IDR batch run | Scheduled (hourly or daily) | Automated |
| CI health check | Monthly | SF admin |
| Recommender retraining | Automatic (continuous) | System |
| SDK version updates | Quarterly | Web team |
