# Clearwater Bank — Recommender Build Guide

---

## Prerequisites Checklist

Before building any recommender, confirm:

- [ ] **Item Data Graph** (Clearwater Bank Products) is built and Active — Goods Product DMO with 16 products
- [ ] **Profile Data Graph** (Clearwater Bank Profile) includes **Application Engagement DMO** — needed for custom objective
- [ ] **Engagement Signals** are active: ProductView, ProductClick, ApplicationStart
- [ ] **Behavioral data is flowing** — at least some Product Browse Engagement and Application Engagement records exist

If Application Engagement DMO is NOT in the profile data graph yet:

> Data Cloud → Data Graphs → Clearwater Bank Profile → Edit
> 
> Add under Individual:
> ```
> Individual
>   └── Application Engagement
>         ☑ Application Engagement Id
>         ☑ Individual
>         ☑ Product
>         ☑ Engagement Date Time
>         ☑ Engagement Type
> ```
> Save and rebuild.

---

## Recommender 1: Most Viewed Products (Rule-Based)

**Build this first — used as fallback for all objective-based recommenders.**

**App Launcher → Recommenders → New**

### Basic Settings

| Setting | Value |
|---|---|
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Item Data Graph | Clearwater Bank Products |
| Name | Most Viewed Products |
| API Name | `MostViewed_AllProducts` |

### Recommendation Type

Select: **Rule-Based Recommendations** → Next

### Configuration

| Setting | Value |
|---|---|
| Data Graph Resource | Item Data Graph |
| Ranking | Goods Product > Product ID |

### Filters

None — return all products from the catalog.

### Save

Save and activate. **Works immediately — no training period.**

### What it does

Returns products from the catalog in a default order. No behavioral intelligence, no ML. This is the safety net — when objective-based recommenders are still training or don't have enough data, this ensures visitors always see product recommendations.

### Used by

- Fallback for `MaxAppStarts_Personalized`
- Fallback for `MaxAppStarts_Dashboard`
- Directly powers `Homepage_Featured_Products` (if built)

---

## Recommender 2: Personalized Products — Maximize Application Starts (Objective-Based)

**The core AI recommender. Creates the custom objective during setup.**

**App Launcher → Recommenders → New**

### Basic Settings

| Setting | Value |
|---|---|
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Item Data Graph | Clearwater Bank Products |
| Name | Personalized Products (Max Applications) |
| API Name | `MaxAppStarts_Personalized` |
| Fallback Recommender | **Most Viewed Products** (created in Step 1) |

### Recommendation Type

Select: **Objective-Based Recommendations** → Next

### Create Custom Objective

Select: **New Objective**

| Setting | Value |
|---|---|
| Objective Name | Maximize Application Starts |
| API Name | `Maximize_Application_Starts` |
| Purpose | Maximize |
| Engagement Signal Metric | **Application Start** (the signal on Application Engagement DMO) |

Click Next.

### Additional Training Signals

These help the ML model learn visitor preferences beyond just the primary objective:

| Signal | Select? | Why |
|---|---|---|
| **Product View** | ✅ Yes | Browsing behavior indicates interest |
| **Product Click** | ✅ Yes | Click behavior indicates stronger interest |

Click Next.

### Filters

None for now. You can add filters later to exclude specific products or restrict by category.

### Save

Save and activate. **Training begins — takes 48-72 hours** before the model produces personalized results. During training, the fallback recommender (Most Viewed Products) serves content.

### What it does

ML model learns patterns like:
- "Visitors who viewed 3+ home loan pages tend to apply for Variable Home Loan"
- "Visitors who browse savings AND investment pages tend to apply for Term Deposit"
- "Business segment visitors tend to apply for Business Growth Loan"

Uses the **Application Start** engagement signal as the optimization target — ranks products by likelihood of driving an application start for each individual visitor.

### Used by

- `Homepage_Personalized_For_You` — "Products tailored to your profile"
- `PDP_You_May_Also_Consider` — A/B experiment variant (objective-based)
- `Email_Product_Recommendations` — batch personalization for email

---

## Recommender 3: Dashboard Next Best Product (Objective-Based)

**Same objective, richer profile context for authenticated visitors.**

**App Launcher → Recommenders → New**

### Basic Settings

| Setting | Value |
|---|---|
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Item Data Graph | Clearwater Bank Products |
| Name | Dashboard Next Best Product |
| API Name | `MaxAppStarts_Dashboard` |
| Fallback Recommender | **Most Viewed Products** |

### Recommendation Type

Select: **Objective-Based Recommendations** → Next

### Select Existing Objective

Select: **Maximize Application Starts** (reuse — already created in Step 2)

### Additional Training Signals

| Signal | Select? |
|---|---|
| **Product View** | ✅ Yes |
| **Product Click** | ✅ Yes |

### Filters

None.

### Save

Save and activate. **Same 48-72 hour training period.**

### What it does

Same ML model and objective as Recommender 2, but when attached to the Dashboard personalization point, it runs against authenticated visitor profiles. Authenticated profiles have richer data (CRM fields, full browsing history across devices, identity-resolved engagement records) — so the recommendations are more precise.

### Used by

- `Dashboard_Next_Best_Product` — "AI-powered next best product for authenticated customers"

### Why a separate recommender?

You could reuse `MaxAppStarts_Personalized` on the Dashboard. A separate recommender lets you:
- Add dashboard-specific filters later (e.g., exclude products the customer already holds)
- Track training and performance separately
- Apply different filter logic for authenticated vs anonymous contexts

---

## Recommender 4: Complementary Products (Rule-Based)

**Cross-sell on the product detail page — "you're looking at this, consider these too."**

**App Launcher → Recommenders → New**

### Basic Settings

| Setting | Value |
|---|---|
| Data Space | default |
| Profile Data Graph | Clearwater Bank Profile |
| Item Data Graph | Clearwater Bank Products |
| Name | Complementary Products |
| API Name | `Complementary_Products` |

### Recommendation Type

Select: **Rule-Based Recommendations** → Next

### Configuration

| Setting | Value |
|---|---|
| Data Graph Resource | Item Data Graph |
| Ranking | Goods Product > Product ID |

### Filters

Add a filter to **exclude the product currently being viewed:**

| Filter | Operator | Value |
|---|---|---|
| Goods Product > **Product ID** | Does Not Match | `{!catalogObjectId}` |

`{!catalogObjectId}` is a **dynamic context variable** — it resolves to the product ID from the current page's catalog event. On the mortgage detail page, this would be `clearwater-variable-home-loan`, so the recommender returns everything EXCEPT the Variable Home Loan.

**Note:** If the dynamic variable `{!catalogObjectId}` is not available in the filter dropdown, you may need to:
1. Go to the personalization point where this recommender will be used
2. Add `catalogObjectId` as a dynamic context variable on the point
3. Then reference it in the recommender filter

If this is not supported in the filter UI, remove the filter for now — the recommender will return all products including the current one. You can address this when building the personalization point.

### Save

Save and activate. **Works immediately — no training period.**

### What it does

Returns products from the catalog excluding the one the visitor is currently viewing. Rule-based — no ML, no behavioral intelligence. The value is in the exclusion filter: "show me products I'm NOT already looking at."

### Used by

- `PDP_You_May_Also_Consider` — A/B experiment control (rule-based)
- `PDP_Complementary_Products` — secondary cross-sell section
- `AppConf_CrossSell` — post-application recommendations

---

## Summary

| # | Recommender | Type | Objective | Training | Works immediately? |
|---|---|---|---|---|---|
| 1 | Most Viewed Products | Rule-Based | — | None | ✅ Yes |
| 2 | Personalized Products (Max Applications) | Objective-Based | Maximize Application Starts (new) | 48-72 hours | ❌ Fallback serves during training |
| 3 | Dashboard Next Best Product | Objective-Based | Maximize Application Starts (reuse) | 48-72 hours | ❌ Fallback serves during training |
| 4 | Complementary Products | Rule-Based | — | None | ✅ Yes |

---

## After Recommenders Are Built — Next Steps

### 1. Create Recommendation-Type Personalization Points

| Personalization Point | Recommender | Page |
|---|---|---|
| `Homepage_Personalized_For_You` | MaxAppStarts_Personalized | Homepage |
| `Hub_Product_Spotlight` | Complementary_Products (or MostViewed) | Home Loans Hub |
| `PDP_You_May_Also_Consider` | **Experiment:** Control = Complementary_Products, Variant = MaxAppStarts_Personalized | Mortgage Detail |
| `PDP_Complementary_Products` | Complementary_Products | Mortgage Detail |
| `Dashboard_Next_Best_Product` | MaxAppStarts_Dashboard | Dashboard |

### 2. Create the A/B Experiment

On `PDP_You_May_Also_Consider`:

| Setting | Value |
|---|---|
| Experiment Name | Cross-Sell: Rule vs AI on PDP |
| Control (50%) | Complementary Products (rule-based) |
| Variant (50%) | Personalized Products (objective-based) |
| Primary Metric | Application Start Count |
| Secondary Metrics | Product Click Count |
| Targeting | All visitors (or authenticated only for data quality) |

### 3. Update the Website

Update `clearwater-bank.html` to render live recommendation responses — similar to how the homepage hero renders live decision content. The recommender response returns product data (name, rate, image URL) from the Goods Product DMO via the item data graph.

### 4. Build Batch Personalization for Email (Use Case 4)

| Step | Action |
|---|---|
| Create standard segment | Mortgage Seekers No Application |
| Create personalization point | Email_Product_Recommendations (type: Recommendations) |
| Create batch personalization | Segment + Point → Output DMO |
| Create DMO activation | Output DMO → MC Next |
| Build MC Next email | Dynamic content from activation data |

---

## Recommender Simulation (Testing Before Go-Live)

After a recommender is created, you can **simulate** it without waiting for training:

**Recommenders → [your recommender] → Simulate**

Enter a Unified Individual ID and see what products would be returned. This helps validate:
- Filters are working (excluded products don't appear)
- The fallback recommender returns products when the primary has no data
- The profile data graph provides the expected context

For objective-based recommenders, simulation only works after training completes.
