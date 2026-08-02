# Clearwater Bank — All Personalization Point Decision Content

Build guide: create each personalization point, then add decisions in the order listed.
First decision created = highest priority. Last = lowest (fallback).

All targeting rules use either:
- Real-Time Calculated Insights (HomeLoanViewCount, ApplicationStartCount)
- Individual DMO attributes (Is Anonymous)
- Merge fields (Individual > First Name)

---

## HOMEPAGE

---

### 1. Homepage_Hero_Banner (ALREADY BUILT — add remaining decisions)

**Content Schema:** Banner
**Profile Data Graph:** Clearwater Bank Profile

Decisions 1-3 already exist. Add these:

#### Decision 4: Incomplete Application
**Targeting:** ApplicationStartCount ≥ 1 (from Application Start Count CI)

| Attribute | Value |
|---|---|
| Headline | Pick up where you left off |
| Subheadline | Your pre-qualification application is still waiting. It only takes a few minutes to complete. |
| CTA Text | Resume Application |
| CTA URL | /apply/resume |
| Image URL | |
| Eyebrow | ⏳ Application In Progress |

#### Decision 5: First-Time Visitor
**Targeting:** Individual > Is Anonymous = 1

| Attribute | Value |
|---|---|
| Headline | Welcome to Clearwater Bank |
| Subheadline | From everyday accounts to home loans and investments — find the right product for your life today. |
| CTA Text | Explore Accounts |
| CTA URL | /products |
| Image URL | |
| Eyebrow | Welcome to Clearwater Bank |

#### Decision 6: Existing Customer
**Targeting:** Individual > Is Anonymous = 0

| Attribute | Value |
|---|---|
| Headline | Welcome back, {FirstName} |
| Subheadline | Adding a savings account takes 3 minutes and earns you interest from day one. |
| CTA Text | See Your Offers |
| CTA URL | /offers |
| Image URL | |
| Eyebrow | Welcome back |

**Note:** {FirstName} is a merge field. When editing the Headline attribute, click "Add Merge Field" and select Individual > First Name from the data graph.

#### Decision 7: Default
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| Headline | Banking built around your life |
| Subheadline | Trusted by over 250,000 Australians. Accounts, loans, cards, and investments — all in one place. |
| CTA Text | Get Started |
| CTA URL | /products |
| Image URL | |
| Eyebrow | |

---

### 2. Homepage_Promo_Bar (NEW)

**Create Personalization Point:**

| Setting | Value |
|---|---|
| Name | Homepage Promo Bar |
| API Name | Homepage_Promo_Bar |
| Profile Data Graph | Clearwater Bank Profile |
| Type | Manual Content |
| Content Schema | Promo |

#### Decision 1: Mortgage Promo
**Targeting:** HomeLoanViewCount ≥ 3 (from HomeLoan_Views CI)

| Attribute | Value |
|---|---|
| Message | Limited offer: Home loan rates from 5.89% p.a. — lock in today before rates change. |
| CTA Text | View offer |
| CTA URL | /home-loans |

#### Decision 2: Investment Promo
**Targeting:** InvestmentViewCount ≥ 2 (from Investment View Count CI — rebuild with correct filter if needed)

| Attribute | Value |
|---|---|
| Message | Term deposits at 5.40% p.a. — Premier rates now available for eligible customers. |
| CTA Text | View rates |
| CTA URL | /products/investments |

#### Decision 3: Default Promo
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| Message | Open an Everyday Savings account today — 5.10% p.a. with zero fees. Takes 3 minutes. |
| CTA Text | Learn more |
| CTA URL | /products/everyday-savings |

---

### 3. Homepage_Life_Event_Module (NEW)

**Create Personalization Point:**

| Setting | Value |
|---|---|
| Name | Homepage Life Event Module |
| API Name | Homepage_Life_Event_Module |
| Profile Data Graph | Clearwater Bank Profile |
| Type | Manual Content |
| Content Schema | Life Event Tile |

#### Decision 1: Mortgage Calculator Nudge
**Targeting:** HomeLoanViewCount ≥ 1 (from HomeLoan_Views CI — anyone who viewed at least 1 home loan page)

| Attribute | Value |
|---|---|
| Icon | 🧮 |
| Pre Headline | Know your numbers |
| Title | Calculate your repayments and see what you can afford in under 2 minutes. |
| CTA Text | Open Calculator |
| CTA URL | /tools/calculator |

#### Decision 2: First Home Buyer Guide
**Targeting:** Individual > Is Anonymous = 1

| Attribute | Value |
|---|---|
| Icon | 🏠 |
| Pre Headline | First Home Buyer? |
| Title | Our step-by-step guide walks you through buying your first home. |
| CTA Text | Read the Guide |
| CTA URL | /learn/first-home-buyer |

#### Decision 3: Cross-Sell Savings
**Targeting:** Individual > Is Anonymous = 0

| Attribute | Value |
|---|---|
| Icon | 💰 |
| Pre Headline | A smarter way to save |
| Title | Clearwater customers with a linked savings account save $3,200 more per year on average. |
| CTA Text | Open Savings Account |
| CTA URL | /products/everyday-savings |

#### Decision 4: Default Life Event
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| Icon | 📈 |
| Pre Headline | Financial Wellbeing |
| Title | Guides, tools, and expert insights to help you make confident financial decisions. |
| CTA Text | Browse the Hub |
| CTA URL | /learn |

---

## HOME LOANS HUB

---

### 4. Hub_Hero_Banner (NEW)

**Create Personalization Point:**

| Setting | Value |
|---|---|
| Name | Hub Hero Banner |
| API Name | Hub_Hero_Banner |
| Profile Data Graph | Clearwater Bank Profile |
| Type | Manual Content |
| Content Schema | Banner |

#### Decision 1: Returning Mortgage Seeker
**Targeting:** HomeLoanViewCount ≥ 3 (from HomeLoan_Views CI)

| Attribute | Value |
|---|---|
| Headline | You're in the right place |
| Subheadline | Our home loan specialists can pre-qualify you today. Rates from 5.89% p.a. |
| CTA Text | Get Pre-Qualified |
| CTA URL | /apply/home-loan |
| Image URL | |
| Eyebrow | Rates from 5.89% p.a. |

#### Decision 2: Existing Customer Hub
**Targeting:** Individual > Is Anonymous = 0

| Attribute | Value |
|---|---|
| Headline | Upgrade to a loyalty home loan rate |
| Subheadline | As an existing Clearwater customer, your loyalty rate starts at 5.79% p.a. |
| CTA Text | See Your Rate |
| CTA URL | /products/home-loan-loyalty |
| Image URL | |
| Eyebrow | Your Loyalty Rate |

#### Decision 3: Default Hub Hero
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| Headline | Home loans for every stage of life |
| Subheadline | From first home buyers to investors — we have the right loan for your situation. |
| CTA Text | Compare Home Loans |
| CTA URL | /home-loans/compare |
| Image URL | |
| Eyebrow | |

---

### 5. Hub_Calculator_Prompt (NEW)

**Create Personalization Point:**

| Setting | Value |
|---|---|
| Name | Hub Calculator Prompt |
| API Name | Hub_Calculator_Prompt |
| Profile Data Graph | Clearwater Bank Profile |
| Type | Manual Content |
| Content Schema | CTA Card |

#### Decision 1: Return Calculator User
**Targeting:** CalculatorEngagement count ≥ 1 (if you built an Application Start Count CI that also covers calculator, use that. Otherwise use a simple targeting rule or skip this decision for now)

| Attribute | Value |
|---|---|
| CTA Label | Continue where you left off |
| CTA Style | strong |
| CTA URL | /tools/calculator |
| Supporting Text | Your last calculation is saved. Adjust your numbers and see updated repayments. |

#### Decision 2: Default Calculator Prompt
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| CTA Label | Calculate your repayments |
| CTA Style | soft |
| CTA URL | /tools/calculator |
| Supporting Text | Find out what you can afford in under 2 minutes. No impact on your credit score. |

---

## MORTGAGE DETAIL PAGE

---

### 6. PDP_Offer_Badge (NEW)

**Create Personalization Point:**

| Setting | Value |
|---|---|
| Name | PDP Offer Badge |
| API Name | PDP_Offer_Badge |
| Profile Data Graph | Clearwater Bank Profile |
| Type | Manual Content |
| Content Schema | Infobar |

#### Decision 1: Recommended Badge
**Targeting:** HomeLoanViewCount ≥ 3 (from HomeLoan_Views CI)

| Attribute | Value |
|---|---|
| Message | ⭐ Recommended for You |
| Icon | star |
| Style | highlight |

#### Decision 2: Default (No Badge)
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| Message | |
| Icon | |
| Style | hidden |

**Note:** The website checks if Message is empty and hides the badge entirely.

---

### 7. PDP_Infobar (NEW)

**Create Personalization Point:**

| Setting | Value |
|---|---|
| Name | PDP Infobar |
| API Name | PDP_Infobar |
| Profile Data Graph | Clearwater Bank Profile |
| Type | Manual Content |
| Content Schema | Infobar |

#### Decision 1: Authenticated Customer
**Targeting:** Individual > Is Anonymous = 0

| Attribute | Value |
|---|---|
| Message | Welcome back, {FirstName} — as an existing Clearwater customer, you may qualify for our loyalty home loan rate. Your pre-assessment is ready. |
| Icon | check |
| Style | success |

**Note:** {FirstName} is a merge field. Click "Add Merge Field" on the Message attribute and select Individual > First Name.

#### Decision 2: Anonymous Prompt
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| Message | Already a Clearwater customer? Log in to see your personalized offer. |
| Icon | lock |
| Style | info |

---

### 8. PDP_Application_Nudge (NEW)

**Create Personalization Point:**

| Setting | Value |
|---|---|
| Name | PDP Application Nudge |
| API Name | PDP_Application_Nudge |
| Profile Data Graph | Clearwater Bank Profile |
| Type | Manual Content |
| Content Schema | CTA Card |

#### Decision 1: Strong CTA (High Intent)
**Targeting:** HomeLoanViewCount ≥ 3 (from HomeLoan_Views CI)

| Attribute | Value |
|---|---|
| CTA Label | Get Pre-Qualified Now |
| CTA Style | strong |
| CTA URL | /apply/home-loan |
| Supporting Text | Based on your browsing, you may be eligible. Decision in as little as 5 minutes. |

#### Decision 2: Resume Application
**Targeting:** ApplicationStartCount ≥ 1 (from Application Start Count CI)

| Attribute | Value |
|---|---|
| CTA Label | Continue Your Application |
| CTA Style | strong |
| CTA URL | /apply/resume |
| Supporting Text | You started this application — it only takes a few more minutes to complete. |

#### Decision 3: Soft CTA (Default)
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| CTA Label | Explore This Loan |
| CTA Style | soft |
| CTA URL | /products/variable-home-loan |
| Supporting Text | Learn more about rates, features, and how to apply. |

---

## DASHBOARD

---

### 9. Dashboard_Relationship_Banner (NEW)

**Create Personalization Point:**

| Setting | Value |
|---|---|
| Name | Dashboard Relationship Banner |
| API Name | Dashboard_Relationship_Banner |
| Profile Data Graph | Clearwater Bank Profile |
| Type | Manual Content |
| Content Schema | Banner |

#### Decision 1: Authenticated Welcome
**Targeting:** Individual > Is Anonymous = 0

| Attribute | Value |
|---|---|
| Headline | Welcome back, {FirstName} |
| Subheadline | Your accounts and personalized insights are ready. |
| CTA Text | View Statements |
| CTA URL | /banking/statements |
| Image URL | |
| Eyebrow | Good afternoon |

**Note:** {FirstName} is a merge field.

#### Decision 2: Default
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| Headline | Your Dashboard |
| Subheadline | Log in to see your accounts and personalized insights. |
| CTA Text | Log In |
| CTA URL | /login |
| Image URL | |
| Eyebrow | Clearwater Online Banking |

---

### 10. Dashboard_Life_Event_Prompt (NEW)

**Create Personalization Point:**

| Setting | Value |
|---|---|
| Name | Dashboard Life Event Prompt |
| API Name | Dashboard_Life_Event_Prompt |
| Profile Data Graph | Clearwater Bank Profile |
| Type | Manual Content |
| Content Schema | Life Event Tile |

#### Decision 1: Mortgage Interest
**Targeting:** HomeLoanViewCount ≥ 1 (from HomeLoan_Views CI)

| Attribute | Value |
|---|---|
| Icon | 🏠 |
| Pre Headline | Thinking about a home loan? |
| Title | Based on your recent browsing, you might be interested in our home loan options. Pre-qualify in minutes. |
| CTA Text | Explore Home Loans |
| CTA URL | /home-loans |

#### Decision 2: Default Financial Tip
**Targeting:** Always (No Rules)

| Attribute | Value |
|---|---|
| Icon | 💡 |
| Pre Headline | Financial Tip |
| Title | Access your free credit score in the Clearwater app — no impact to your score, updated monthly. |
| CTA Text | Check Your Score |
| CTA URL | /tools/credit-score |

---

## SUMMARY

| # | Personalization Point | Content Schema | Decisions to Create | Type |
|---|---|---|---|---|
| 1 | Homepage_Hero_Banner | Banner | +4 (add to existing) | Dynamic Content |
| 2 | Homepage_Promo_Bar | Promo | 3 (new) | Dynamic Content |
| 3 | Homepage_Life_Event_Module | Life Event Tile | 4 (new) | Dynamic Content |
| 4 | Hub_Hero_Banner | Banner | 3 (new) | Dynamic Content |
| 5 | Hub_Calculator_Prompt | CTA Card | 2 (new) | Dynamic Content |
| 6 | PDP_Offer_Badge | Infobar | 2 (new) | Dynamic Content |
| 7 | PDP_Infobar | Infobar | 2 (new) | Dynamic Content |
| 8 | PDP_Application_Nudge | CTA Card | 3 (new) | Dynamic Content |
| 9 | Dashboard_Relationship_Banner | Banner | 2 (new) | Dynamic Content |
| 10 | Dashboard_Life_Event_Prompt | Life Event Tile | 2 (new) | Dynamic Content |
| | **TOTAL** | | **27 decisions** | |

## CIs referenced in targeting rules

| CI Name | Decisions that use it |
|---|---|
| HomeLoan_Views (HomeLoanViewCount) | Hero D2, Promo D1, Life Event D1, Hub Hero D1, Offer Badge D1, App Nudge D1, Dash Life Event D1 |
| Investment View Count | Hero D1 & D3, Promo D2 |
| Application Start Count (ApplicationStartCount) | Hero D4, App Nudge D2 |
| Individual > Is Anonymous | Hero D5 & D6, Life Event D2 & D3, Hub Hero D2, Infobar D1, Dash Banner D1 |
| Individual > First Name (merge field) | Hero D6, Infobar D1, Dash Banner D1 |
