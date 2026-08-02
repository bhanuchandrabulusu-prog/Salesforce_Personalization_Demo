# Clearwater Bank — Complete DLO-to-DMO Mapping Guide

## How to use this document

Open each data stream's mapping canvas in Data Cloud and follow section by section.
The engagement data stream has one canvas with multiple sections (one per event type).
Each profile data stream has its own canvas.

**Important:** There are two `eventType` fields in the engagement DLO — one in the "All Event Data" (common) section and one inside each event-specific section. Always use the **event-specific** `eventType` when mapping to a DMO's Engagement Type field. The common `eventType` should NOT be mapped.

Sources: Salesforce Personalization Behavioral Events Data Mapping Reference, Web SDK Connector Mappings (developer.salesforce.com), Identity Data Mapping Reference.

---

## 1. Engagement Data Stream — Behavioral Events DLO

All engagement events (catalog, cart, cartItem, order, orderItem, consentLog, inaction, ApplicationStart, CalculatorEngagement, ArticleClick) land in a single DLO. The mapping canvas shows sections grouped by event type.

### 1.1 All Event Data (Common Fields)

These fields appear once at the top of the mapping canvas. Map them to ALL relevant DMOs.

| DLO Field | DMO | DMO Field | Notes |
|---|---|---|---|
| `dateTime` | Product Browse Engagement | Created Date | |
| `dateTime` | Product Browse Engagement | Engagement Date Time | Map to BOTH Created Date and Engagement Date Time |
| `dateTime` | Shopping Cart Engagement | Created Date | |
| `dateTime` | Shopping Cart Engagement | Engagement Date Time | |
| `dateTime` | Shopping Cart Product Engagement | Created Date | |
| `dateTime` | Product Order Engagement | Created Date | |
| `dateTime` | Product Order Engagement | Engagement Date Time | |
| `deviceId` | Product Browse Engagement | Individual | |
| `deviceId` | Shopping Cart Engagement | Individual | |
| `deviceId` | Shopping Cart Product Engagement | Individual | |
| `deviceId` | Product Order Engagement | Individual | |
| `eventId` **(PK)** | Product Browse Engagement | Product Browse Engagement ID **(PK)** | Primary key mapping |
| `eventId` **(PK)** | Shopping Cart Engagement | Shopping Cart Engagement ID **(PK)** | Primary key mapping |
| `eventId` **(PK)** | Shopping Cart Product Engagement | Shopping Cart Engagement ID **(PK)** | Primary key mapping |
| `eventId` **(PK)** | Product Order Engagement | Product Order Engagement ID **(PK)** | Primary key mapping |
| `eventType` | — | — | **DO NOT MAP** the common eventType. Use event-section-specific eventType instead |
| `sessionId` | — | — | System field, not mapped to DMO |
| `category` | — | — | System field, not mapped to DMO |
| `pageView` | — | — | Not mapped |

### 1.2 Catalog Section → Product Browse Engagement DMO

**This is the primary section for Clearwater Bank.** Financial product page views and clicks flow here.

| DLO Field | DMO | DMO Field | Clearwater Bank Purpose |
|---|---|---|---|
| `id` | Product Browse Engagement | **Product** | Links to Financial Products catalog (Goods Product DMO) |
| `interactionName` | Product Browse Engagement | Engagement Channel Action | "catalog-object-view-start" or "catalog-object-click" |
| `productSku` | Product Browse Engagement | Product SKU | Optional — use if products have SKU codes |
| `eventType` | Product Browse Engagement | Engagement Type | Use the Catalog-section eventType, NOT the common one |
| `type` | Product Browse Engagement | Product Category | Maps to ProductType (Home Loan, Savings, etc.) |
| **`personalizationId`** | Product Browse Engagement | **Personalization** | **⚡ Links engagement back to the Personalization Point that served the decision** |
| **`personalizationContentId`** | Product Browse Engagement | **Personalization Content** | **⚡ Links engagement to the specific content/recommendation served** |
| `sourceUrl` | Product Browse Engagement | Product View URL | |
| `sourceUrlReferrer` | Product Browse Engagement | Referrer URL | |
| `sourceChannel` | Product Browse Engagement | Engagement Channel | |
| `sourceLocale` | Product Browse Engagement | Device Locale | |
| `sourcePageType` | Product Browse Engagement | Webpage Type | |

**Why `personalizationId` and `personalizationContentId` matter:** These two fields close the attribution loop. When the SDK serves a recommendation from a personalization point and the visitor clicks the product, these fields tell the Personalization engine which decision drove that engagement. Without them: no attribution intelligence, no experiment metrics, no recommender feedback loop.

### 1.3 Cart Section → Shopping Cart Engagement DMO

Not primary for Clearwater Bank demo (banking doesn't use shopping carts), but included in the recommended schema.

| DLO Field | DMO | DMO Field |
|---|---|---|
| `eventType` | Shopping Cart Engagement | Engagement Type |
| `interactionName` | Shopping Cart Engagement | Engagement Channel Action |
| `personalizationId` | Shopping Cart Engagement | Personalization |
| `personalizationContentId` | Shopping Cart Engagement | Personalization Content |
| `sourceChannel` | Shopping Cart Engagement | Engagement Channel |
| `sourceLocale` | Shopping Cart Engagement | Device Locale |
| `sourcePageType` | Shopping Cart Engagement | Source Page Type |
| `sourceUrl` | Shopping Cart Engagement | Link URL |
| `sourceUrlReferrer` | Shopping Cart Engagement | Referrer URL |

### 1.4 Cart Item Section → Shopping Cart Product Engagement DMO

| DLO Field | DMO | DMO Field |
|---|---|---|
| `catalogObjectId` | Shopping Cart Product Engagement | Product |
| `catalogObjectType` | Shopping Cart Product Engagement | Product Category |
| `currency` | Shopping Cart Product Engagement | Currency |
| `price` | Shopping Cart Product Engagement | Product Price |
| `quantity` | Shopping Cart Product Engagement | Product Quantity |
| `eventType` | Shopping Cart Product Engagement | Engagement Type |
| `personalizationId` | Shopping Cart Product Engagement | Personalization Content |
| `personalizationContentId` | Shopping Cart Product Engagement | Personalization |

### 1.5 Order Section → Product Order Engagement DMO

| DLO Field | DMO | DMO Field |
|---|---|---|
| `eventType` | Product Order Engagement | Engagement Type |
| `interactionName` | Product Order Engagement | Engagement Channel Action |
| `orderId` | Product Order Engagement | Correlation ID |
| `orderTotalValue` | Product Order Engagement | Adjusted Total Product Amount |
| `orderTotalValue` | Product Order Engagement | Total Product Amount |
| `orderCurrency` | Product Order Engagement | Currency |
| `personalizationId` | Product Order Engagement | Personalization |
| `personalizationContentId` | Product Order Engagement | Personalization Content |
| `sourceUrl` | Product Order Engagement | Link URL |
| `sourceUrlReferrer` | Product Order Engagement | Referrer URL |
| `sourceChannel` | Product Order Engagement | Engagement Channel |
| `sourceLocale` | Product Order Engagement | Device Locale |
| `sourcePageType` | Product Order Engagement | Webpage Type |

### 1.6 Consent Log Section

| DLO Field | DMO | DMO Field |
|---|---|---|
| Not mapped | Not mapped | Not mapped |

### 1.7 Order Item Section

| DLO Field | DMO | DMO Field |
|---|---|---|
| Not mapped | Not mapped | Not mapped |

### 1.8 Custom Events — ApplicationStart, CalculatorEngagement, ArticleClick

These three Clearwater Bank custom events appear as additional sections in the same engagement DLO. They need custom DMO mapping — two options:

**Option A — Map to existing Website Engagement DMO (simpler)**

Map all three custom events to the Website Engagement DMO using generic fields. This works for demo and basic segmentation but limits field-level granularity.

| DLO Field | DMO | DMO Field | Notes |
|---|---|---|---|
| `eventType` (from each custom section) | Website Engagement | Engagement Type | "ApplicationStart", "CalculatorEngagement", or "ArticleClick" |
| `id` (ApplicationStart, ArticleClick) | Website Engagement | External Record ID | Product ID or Article ID |
| `topic` (ArticleClick only) | Website Engagement | — | Requires custom field on Website Engagement DMO |
| `calculatorType` (CalculatorEngagement only) | Website Engagement | — | Requires custom field on Website Engagement DMO |
| `applicationId` (ApplicationStart only) | Website Engagement | — | Requires custom field on Website Engagement DMO |

**Option B — Create custom DMOs (recommended for production)**

Create dedicated DMOs for richer data modeling:

**Custom DMO: Application Engagement**

| DLO Field | Custom DMO Field | Data Type |
|---|---|---|
| `eventId` | Application Engagement ID (PK) | Text |
| `dateTime` | Engagement Date Time | DateTime |
| `deviceId` | Individual | Text (lookup) |
| `eventType` | Engagement Type | Text |
| `id` | Product | Text (lookup to Goods Product) |
| `applicationId` | Application ID | Text |
| `applicationStatus` | Application Status | Text |

**Custom DMO: Article Engagement**

| DLO Field | Custom DMO Field | Data Type |
|---|---|---|
| `eventId` | Article Engagement ID (PK) | Text |
| `dateTime` | Engagement Date Time | DateTime |
| `deviceId` | Individual | Text (lookup) |
| `eventType` | Engagement Type | Text |
| `id` | Article ID | Text |
| `topic` | Topic | Text |

---

## 2. Profile Data Streams

Each profile event type creates a separate data stream with its own mapping canvas.

### 2.1 Identity DLO → Individual DMO

| DLO Field | DMO | DMO Field | Notes |
|---|---|---|---|
| `deviceId` **(PK)** | Individual | Individual ID **(PK)** | Primary key — this becomes the anonymous individual record |
| `dateTime` | Individual | Created Date | |
| `firstName` | Individual | First Name | |
| `lastName` | Individual | Last Name | |
| `isAnonymous` | Individual | Is Anonymous | "1" = anonymous, "0" = known |
| `userName` | Individual | External Record ID | If captured |

### 2.2 Contact Point Email DLO → Contact Point Email DMO

| DLO Field | DMO | DMO Field | Notes |
|---|---|---|---|
| `deviceId` **(PK)** | Contact Point Email | Contact Point Email ID **(PK)** | |
| `deviceId` | Contact Point Email | Party | Links to Individual |
| `dateTime` | Contact Point Email | Created Date | |
| `email` | Contact Point Email | Email Address | **Key field for identity resolution** |

### 2.3 Contact Point Phone DLO → Contact Point Phone DMO

| DLO Field | DMO | DMO Field | Notes |
|---|---|---|---|
| `deviceId` **(PK)** | Contact Point Phone | Contact Point Phone ID **(PK)** | |
| `deviceId` | Contact Point Phone | Party | Links to Individual |
| `dateTime` | Contact Point Phone | Created Date | |
| `phoneNumber` | Contact Point Phone | Telephone Number | |

### 2.4 Contact Point Address DLO → Contact Point Address DMO

| DLO Field | DMO | DMO Field |
|---|---|---|
| Not mapped | Not mapped | Not mapped |

Per Salesforce documentation: do NOT map Contact Point Address fields for the web connector.

### 2.5 Party Identification DLO → Party Identification DMO

| DLO Field | DMO | DMO Field | Notes |
|---|---|---|---|
| `deviceId` **(PK)** | Party Identification | Party Identification ID **(PK)** | |
| `deviceId` | Party Identification | Party | Links to Individual |
| `dateTime` | Party Identification | Created Date | |
| `userId` | Party Identification | Identification Number | External user ID |
| `IDType` | Party Identification | Party Identification Type | e.g., "CRM_ID", "LOYALTY_ID" |
| `IDName` | Party Identification | Identification Name | Human-readable name for the ID type |

---

## 3. Post-Mapping Validation Checklist

After completing all mappings, verify:

- [ ] **Product Browse Engagement** has `personalizationId` → Personalization and `personalizationContentId` → Personalization Content mapped
- [ ] **Product Browse Engagement** has `id` → Product mapped (this links to your Financial Products catalog)
- [ ] **Individual DMO** has `deviceId` → Individual ID (PK) mapped
- [ ] **Contact Point Email** has `email` → Email Address mapped (required for identity resolution)
- [ ] **Party Identification** has `userId` → Identification Number mapped (if using external IDs)
- [ ] You used the **event-section-specific** `eventType` (not the common one) for each DMO's Engagement Type field
- [ ] Data streams show status "Active" or "Deploying" after saving mappings
- [ ] Custom events (ApplicationStart, CalculatorEngagement, ArticleClick) are either mapped to Website Engagement with custom fields OR to dedicated custom DMOs

---

## 4. What to Build Next (After Mappings Are Active)

| Step | What | Why |
|---|---|---|
| 1 | **Financial Products catalog** — load records into Goods Product DMO | Product IDs in catalog events must match records in the DMO |
| 2 | **Identity Resolution ruleset** — Email Exact Match rule | Merges anonymous deviceId-based individuals with CRM contacts |
| 3 | **Data Graphs** — Real-Time Profile + Item data graphs | Required for personalization points, recommenders, and targeting rules |
| 4 | **Engagement Signals** — ProductView, ProductClick, ApplicationStart | Required before recommenders can train |
| 5 | **Calculated Affinities** — Product_Type_Affinity, Content_Topic_Affinity | Powers affinity-based targeting rules |
| 6 | **Segments** — 12 Clearwater Bank segments | Powers decision targeting rules |
| 7 | **Personalization Points** — 21 points with decisions | Must match API names in clearwater-sitemap.js |
| 8 | **Recommenders** — 8 recommenders (allow 48-72h training) | Objective-based need engagement signal data first |
| 9 | **Experiments** — A/B on PDP_You_May_Also_Consider | After recommenders are trained |

---

## Sources

- Salesforce Personalization: Behavioral Events Data Mappings (help.salesforce.com)
- Data 360 Integration Guide: Web SDK Connector Mappings (developer.salesforce.com)
- Salesforce Personalization: Identity Data Mappings (help.salesforce.com)
- Salesforce Personalization: Contact Point Email Data Mapping (help.salesforce.com)
- Salesforce Personalization: Party Identification Data Mapping (help.salesforce.com)
- Salesforce Personalization: Engagement Signal Examples — Product View, Product Click (help.salesforce.com)
