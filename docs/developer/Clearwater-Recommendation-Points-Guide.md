# Clearwater Bank — Recommendation Personalization Points Build Guide

---

## Prerequisites

- [ ] All 4 recommenders created and active
- [ ] Most Viewed Products (rule-based) — working immediately
- [ ] Personalized Products Max Applications (objective-based) — training
- [ ] Dashboard Next Best Product (objective-based) — training
- [ ] Complementary Products (rule-based) — working immediately
- [ ] Profile Data Graph includes Application Engagement DMO
- [ ] Item Data Graph (Goods Product) is active with 16 products

---

## Point 1: Homepage_Personalized_For_You

**The "Products tailored to your profile" section on the homepage.**

**App Launcher → Personalization Points → New**

### Basic Settings

| Setting | Value |
|---|---|
| Name | Homepage Personalized For You |
| API Name | `Homepage_Personalized_For_You` |
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Personalization Type | **Recommendations** |
| Item Data Graph | Clearwater Bank Products |

### Decision

Add one decision:

| Setting | Value |
|---|---|
| Name | AI Product Recommendations |
| Recommender | **Personalized Products (Max Applications)** |
| Number of items to return | 3 |
| Targeting Rule | Always (No Rules) |
| Status | Live |

**Note:** While the objective-based recommender is training (48-72h), the fallback recommender (Most Viewed Products) automatically serves content. You don't need a separate fallback decision — the fallback is configured on the recommender itself.

### What the response looks like

```json
{
  "personalizations": [{
    "personalizationPointName": "Homepage_Personalized_For_You",
    "data": [
      {
        "id": "clearwater-variable-home-loan",
        "attributes": {
          "Name": "Clearwater Variable Home Loan",
          "PrimaryProductCategory": "Home Loan",
          "Description": "Variable rate home loan from 5.89%...",
          "ImageUrl__c": "https://..."
        }
      },
      {
        "id": "everyday-savings",
        "attributes": {
          "Name": "Everyday Savings Account",
          "PrimaryProductCategory": "Savings",
          ...
        }
      },
      {
        "id": "visa-classic",
        "attributes": { ... }
      }
    ]
  }]
}
```

Key difference from dynamic content: the content comes from the **Goods Product DMO** (`data` array), not hand-written attributes. Each product in the array has all the fields from the Item Data Graph.

---

## Point 2: Hub_Product_Spotlight

**The product highlight on the Home Loans Hub page.**

**App Launcher → Personalization Points → New**

### Basic Settings

| Setting | Value |
|---|---|
| Name | Hub Product Spotlight |
| API Name | `Hub_Product_Spotlight` |
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Personalization Type | **Recommendations** |
| Item Data Graph | Clearwater Bank Products |

### Decision

| Setting | Value |
|---|---|
| Name | Hub Spotlight |
| Recommender | **Complementary Products** |
| Number of items to return | 3 |
| Targeting Rule | Always (No Rules) |
| Status | Live |

### Why Complementary Products here

On the Home Loans Hub, the visitor is already in the loans context. Complementary Products with the exclusion filter will show products OTHER than the one they may have just viewed — useful for highlighting alternative loan types or complementary products like insurance.

---

## Point 3: PDP_Complementary_Products

**The secondary cross-sell section on the Mortgage Detail page.**

**App Launcher → Personalization Points → New**

### Basic Settings

| Setting | Value |
|---|---|
| Name | PDP Complementary Products |
| API Name | `PDP_Complementary_Products` |
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Personalization Type | **Recommendations** |
| Item Data Graph | Clearwater Bank Products |

### Decision

| Setting | Value |
|---|---|
| Name | Complementary Cross-Sell |
| Recommender | **Complementary Products** |
| Number of items to return | 3 |
| Targeting Rule | Always (No Rules) |
| Status | Live |

---

## Point 4: Dashboard_Next_Best_Product

**The AI-powered "What should this customer do next?" module on the dashboard.**

**App Launcher → Personalization Points → New**

### Basic Settings

| Setting | Value |
|---|---|
| Name | Dashboard Next Best Product |
| API Name | `Dashboard_Next_Best_Product` |
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Personalization Type | **Recommendations** |
| Item Data Graph | Clearwater Bank Products |

### Decision

| Setting | Value |
|---|---|
| Name | AI Next Best Product |
| Recommender | **Dashboard Next Best Product** |
| Number of items to return | 1 |
| Targeting Rule | Always (No Rules) |
| Status | Live |

### Why only 1 item

The dashboard NBA module shows a single, focused recommendation — "here's what you should do next." Multiple recommendations dilute the message. One strong recommendation with a clear CTA is more effective in the authenticated banking context.

---

## Point 5: PDP_You_May_Also_Consider (A/B Experiment)

**The cross-sell section on the Mortgage Detail page — testing rule-based vs AI.**

This one is different — it uses an **Experiment** instead of a single decision.

### Step 1: Create the Personalization Point

**App Launcher → Personalization Points → New**

| Setting | Value |
|---|---|
| Name | PDP You May Also Consider |
| API Name | `PDP_You_May_Also_Consider` |
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Personalization Type | **Recommendations** |
| Item Data Graph | Clearwater Bank Products |

### Step 2: Create the Experiment

**On the personalization point → Experiments tab → New Experiment**

| Setting | Value |
|---|---|
| Experiment Name | Cross-Sell Rule vs AI |
| API Name | `CrossSell_Rule_vs_AI` |
| Status | Active |

### Step 3: Configure Experiment Variants

| Variant | Split | Recommender | Items |
|---|---|---|---|
| **Control** | 50% | **Complementary Products** (rule-based) | 3 |
| **Variant** | 50% | **Personalized Products (Max Applications)** (objective-based) | 3 |

### Step 4: Configure Metrics

| Metric | Type | Engagement Signal |
|---|---|---|
| **Primary** | Application Start Count | Application Start signal |
| **Secondary** | Product Click Count | Product Click signal |

### Step 5: Configure Targeting

| Setting | Value |
|---|---|
| Targeting Rule | Always (No Rules) — all visitors enter the experiment |

**Alternative:** Target authenticated visitors only (`Is Anonymous = 0`) for higher data quality — authenticated visitors have richer profiles, so the AI recommender has more signal to work with. This produces faster statistical significance.

### What the experiment measures

```
50% of visitors see:
  Complementary Products (rule-based)
  → "Offset Mortgage, Insurance, Savings"
  → How many click Apply? → Application Start Count = X

50% of visitors see:
  Personalized Products (AI)
  → "First Home Buyer Package, Savings, Personal Loan" (individually ranked)
  → How many click Apply? → Application Start Count = Y

After enough traffic:
  If Y > X with statistical significance → AI wins
  If X > Y → rules win
  If X ≈ Y → no difference, rules are simpler and cheaper
```

### How long to run

Depends on traffic volume. Generally:

| Daily visitors to PDP | Time to significance |
|---|---|
| 100+ | 1-2 weeks |
| 50 | 3-4 weeks |
| 10 (demo) | Not enough — show the setup, explain the methodology |

For the demo, show the experiment configuration and explain the methodology. You won't get statistical significance from demo traffic.

---

## Point 6: Email_Product_Recommendations (Batch Personalization)

**Not on the website — powers personalized email content via MC Next.**

**App Launcher → Personalization Points → New**

| Setting | Value |
|---|---|
| Name | Email Product Recommendations |
| API Name | `Email_Product_Recommendations` |
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Personalization Type | **Recommendations** |
| Item Data Graph | Clearwater Bank Products |

### Decision

| Setting | Value |
|---|---|
| Name | Email Recs |
| Recommender | **Personalized Products (Max Applications)** |
| Number of items to return | 3 |
| Targeting Rule | Always (No Rules) |
| Status | Live |

### What makes this different

This personalization point is never called by the website SDK. Instead, it's used by the **Batch Personalization** pipeline:

```
Standard Segment (Mortgage Seekers No Application)
  → Batch Personalization job evaluates each person against this point
    → Output DMO: 1 row per person with their 3 recommended products
      → DMO Activation → MC Next
        → Email template reads product data
          → Each recipient gets individually recommended products
```

Build the batch pipeline after the recommender finishes training.

---

## Summary

| # | Personalization Point | Type | Recommender | Items | Page |
|---|---|---|---|---|---|
| 1 | Homepage_Personalized_For_You | Recommendations | Personalized Products (AI) | 3 | Homepage |
| 2 | Hub_Product_Spotlight | Recommendations | Complementary Products | 3 | Home Loans Hub |
| 3 | PDP_Complementary_Products | Recommendations | Complementary Products | 3 | Mortgage Detail |
| 4 | Dashboard_Next_Best_Product | Recommendations | Dashboard Next Best Product (AI) | 1 | Dashboard |
| 5 | PDP_You_May_Also_Consider | **Experiment** | Control: Complementary / Variant: AI | 3 | Mortgage Detail |
| 6 | Email_Product_Recommendations | Recommendations (batch) | Personalized Products (AI) | 3 | MC Next email |

---

## After All Points Are Built — Update the Website

The website currently shows mock product data from the persona switcher. After these points are live, update `clearwater-bank.html` to:

1. Read recommendation responses from `window.__cwPersonalizationData`
2. Parse the `data` array (array of product objects from Goods Product DMO)
3. Render product cards using `attributes.Name`, `attributes.PrimaryProductCategory`, `attributes.ImageUrl__c`

Same pattern as the homepage hero live rendering — listen for `clearwater:personalization` event, check for the point name, override mock content with real data.
