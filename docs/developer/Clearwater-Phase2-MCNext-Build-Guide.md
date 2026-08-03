# Clearwater Bank — Phase 2: Marketing Cloud Next Build Guide

## Overview

Phase 2 extends the Salesforce Personalization demo into cross-channel marketing using Marketing Cloud Next (MC Next). The same behavioural data captured by the Salesforce Interactions SDK now powers email flows, segments, and personalised email content.

**Prerequisites from Phase 1:**
- [ ] Salesforce Data 360 fully configured (data streams, DMOs, IDR, data graphs)
- [ ] Engagement Signals active (especially ApplicationStart — must be **flow-enabled**)
- [ ] Calculated Insights active (HomeLoanViewCount, InvestmentViewCount, ApplicationStartCount)
- [ ] MC Next Growth or Advanced Edition enabled on the org
- [ ] Email channel configured (verified sender, authenticated domain)
- [ ] At least one real email address in Contact Point Email DMO for testing

---

## What We're Building

| # | Use Case | Flow Type | Trigger | Channel |
|---|---|---|---|---|
| 1 | Abandoned Application Follow-Up | Automation Event-Triggered | ApplicationStart engagement signal | Email |
| 2 | Mortgage Interest Nurture | Segment-Triggered | Standard segment (scheduled) | Email |
| 3 | Post-Application Welcome Journey | Automation Event-Triggered | ApplicationStart engagement signal | Email |
| 4 | Cross-Channel Web → Email Recs | Batch Personalization Pipeline | Segment + Batch Job | Email |
| 5 | Form-Triggered Lead Capture | Automation Event-Triggered | Form submission event | Email + CRM |

---

## Step 1: Create Segments

Segments define the audiences for segment-triggered flows and batch personalization.

### Segment 1A: Mortgage Seekers — No Application

**Purpose:** Visitors who showed mortgage interest but haven't applied. Used for the Nurture Campaign (Use Case 2) and Batch Email Recs (Use Case 4).

**App Launcher → Segments → New**

| Setting | Value |
|---|---|
| Segment Builder | Visual Builder |
| Segment Type | Standard Segment |
| Segment On | **Unified Individual** |
| Data Space | default |
| Name | Mortgage Seekers No Application |
| Publish Type | Standard Publish |
| Publish Schedule | Every 24 hours (or as needed) |

**Include criteria:**

1. Drag **Related Attributes → Related Insights → HomeLoan_Views → HomeLoanViewCount** onto the canvas
2. Configure: Measurement = **Sum**, Operator = **Is Greater Than Or Equal To**, Value = **3**

**Exclude criteria:**

1. Click the **Exclude** tab
2. Drag **Related Attributes → Related Insights → Application Start Count → ApplicationStartCount** onto the canvas
3. Configure: Measurement = **Sum**, Operator = **Is Greater Than Or Equal To**, Value = **1**

This gives you: *People who viewed 3+ home loan pages AND have NOT started an application.*

**Save → Publish Now** (for initial testing)

**Verify:** After publishing, check the segment count. It should include Unified Individuals with mortgage browsing history but no ApplicationStart events.

---

### Segment 1B: Active Applicants

**Purpose:** Visitors who started an application. Used for the Welcome Journey exit criteria and future upsell flows.

**Segments → New**

| Setting | Value |
|---|---|
| Segment On | **Unified Individual** |
| Name | Active Applicants |
| Publish Schedule | Every 12 hours |

**Include criteria:**

1. Drag **Related Attributes → Related Insights → Application Start Count → ApplicationStartCount**
2. Configure: Sum, **Is Greater Than Or Equal To**, **1**

**Save → Publish Now**

---

### Segment 1C: All Known Visitors (for testing)

**Purpose:** A simple segment for test sends — anyone with a Contact Point Email.

**Segments → New**

| Setting | Value |
|---|---|
| Segment On | **Unified Individual** |
| Name | All Known Visitors |
| Publish Schedule | Standard, Every 24 hours |

**Include criteria:**

1. Drag **Related Attributes → Contact Point Email → Email Address**
2. Configure: Operator = **Is Not Null**

**Save → Publish Now**

---

## Step 2: Create Email Templates

Create email content before building flows. MC Next emails are created as Content records.

### Email 2A: Abandoned Application Follow-Up

**App Launcher → Content → New → Email**

| Setting | Value |
|---|---|
| Name | Abandoned Application Follow-Up |
| Subject Line | Your home loan application is waiting, {{{Recipient.FirstName}}} |
| Preheader | It only takes a few more minutes to complete |
| From Address | noreply@clearwaterbank.demo (or your verified sender) |

**Email body content (use the drag-and-drop editor):**

```
Header section:
  Logo: Clearwater Bank
  
Hero section:
  Headline: Pick up where you left off
  Body: Hi {{{Recipient.FirstName}}},
  
  You recently started a pre-qualification for a Clearwater home loan. 
  Your application is saved and ready to complete — it only takes a few 
  more minutes.

CTA Button:
  Text: Resume Your Application →
  URL: https://clearwaterbank.com/apply/resume

Product section:
  Subheadline: The product you were looking at
  [Product card — populated from data graph or hardcoded for demo]:
    Clearwater Variable Home Loan
    Rates from 5.89% p.a.
    No ongoing fees | Free redraw | Unlimited extra repayments

Footer:
  Unsubscribe link
  Clearwater Bank | ABN XX XXX XXX XXX
```

**Personalisation:** Use merge fields from the data graph:
- `{{{Recipient.FirstName}}}` — resolves from Individual → First Name
- For product data, use the **Data Graph Data Provider** or **Lookup Data Graph Data Provider** to pull the specific product the visitor was viewing

**Save as Draft → Preview & Test**

---

### Email 2B: Mortgage Nurture — Email 1 (Interest Detected)

**Content → New → Email**

| Setting | Value |
|---|---|
| Name | Mortgage Nurture — Still Thinking? |
| Subject Line | Still thinking about a home loan, {{{Recipient.FirstName}}}? |
| Preheader | Here's what you need to know before you apply |

**Email body:**

```
Hero:
  Headline: Your home loan journey starts here
  Body: Hi {{{Recipient.FirstName}}},

  We noticed you've been exploring our home loan options. Whether you're 
  a first home buyer or looking to refinance, we're here to help.

3-column feature block:
  Column 1: Rates from 5.89% p.a. | Competitive variable rates
  Column 2: $0 ongoing fees | No hidden costs
  Column 3: Pre-qualify in 5 min | No credit score impact

CTA:
  Text: Explore Home Loans →
  URL: https://clearwaterbank.com/home-loans

Secondary CTA:
  Text: Calculate Your Repayments →
  URL: https://clearwaterbank.com/tools/calculator
```

**Save as Draft**

---

### Email 2C: Mortgage Nurture — Email 2 (Ready to Act)

**Content → New → Email**

| Setting | Value |
|---|---|
| Name | Mortgage Nurture — Ready to Take the Next Step? |
| Subject Line | Ready to take the next step, {{{Recipient.FirstName}}}? |

**Email body:**

```
Hero:
  Headline: You're closer than you think
  Body: Hi {{{Recipient.FirstName}}},

  Getting pre-qualified takes just 5 minutes and has no impact on your 
  credit score. Our mortgage specialists are ready when you are.

CTA:
  Text: Get Pre-Qualified Now →
  URL: https://clearwaterbank.com/apply/home-loan

Testimonial block:
  "Clearwater made the process so simple. I was pre-qualified in 
   minutes and settled in 4 weeks." — Sarah C., First Home Buyer
```

**Save as Draft**

---

### Email 2D: Post-Application Welcome

**Content → New → Email**

| Setting | Value |
|---|---|
| Name | Welcome — Application Received |
| Subject Line | Thank you, {{{Recipient.FirstName}}} — your application is being reviewed |

**Email body:**

```
Hero:
  Headline: We've received your application
  Body: Hi {{{Recipient.FirstName}}},

  Thank you for your interest in Clearwater Bank. Your pre-qualification 
  application has been received and is being reviewed by our team.

What happens next (3 steps):
  Step 1: We review your application (1-2 business days)
  Step 2: A mortgage specialist contacts you to discuss options
  Step 3: You receive your pre-qualification outcome

CTA:
  Text: View Your Application Status →
  URL: https://clearwaterbank.com/apply/status

Support block:
  Need help? Contact our home loan team:
  Phone: 1300 CLEARWATER
  Email: homeloans@clearwaterbank.demo
```

**Save as Draft**

---

### Email 2E: Personalised Product Recommendations (for Use Case 4)

**Content → New → Email**

| Setting | Value |
|---|---|
| Name | Products Picked For You |
| Subject Line | {{{Recipient.FirstName}}}, products picked just for you |

**Email body:**

```
Hero:
  Headline: Based on your recent browsing
  Body: Hi {{{Recipient.FirstName}}},

  We've selected these products based on your activity on our website.

Product recommendation section:
  [Use Repeater component with Data Graph data provider]
  [Or use Activation data from Batch Personalization output]
  
  For each product (3 products):
    Product Name
    Product Category
    Description / Rate
    [Learn More →] button with product URL

CTA:
  Text: View All Products →
  URL: https://clearwaterbank.com/products
```

**Note:** The product data for this email comes from the **Batch Personalization Output DMO** via DMO Activation (see Step 5). The Repeater component in the email editor can pull product data from the activation data or from a Data Graph Data Provider.

**Save as Draft**

---

## Step 3: Build Use Case 1 — Abandoned Application Follow-Up

**Flow type:** Automation Event-Triggered Flow

**Trigger:** ApplicationStart engagement signal

### 3.1 Create the Flow

**App Launcher → Flows → New Flow → Start from Scratch**

Select trigger: **Automation Event-Triggered**

| Setting | Value |
|---|---|
| Name | Abandoned Application Follow-Up |
| Trigger Event | **ApplicationStart** (engagement signal) |
| Description | Sends follow-up email if application not completed within 24 hours |

### 3.2 Build the Flow Canvas

```
[Start: ApplicationStart event fires]
    │
    ▼
[Wait: 24 hours]
    │
    ▼
[Decision Split: Has the visitor completed the application?]
    │
    ├── YES (Application Complete) → [End Flow]
    │
    └── NO (Application Incomplete) → 
            │
            ▼
        [Send Email: "Abandoned Application Follow-Up"]
            │
            ▼
        [Wait: 3 days]
            │
            ▼
        [Decision Split: Has the visitor completed now?]
            │
            ├── YES → [End Flow]
            │
            └── NO → [Send Email: "Ready to Take the Next Step?"]
                        │
                        ▼
                    [End Flow]
```

### 3.3 Configure Each Element

**Wait Element:**
- Wait for: **24 Hours** (fixed duration)

**Decision Split — "Application Complete?":**
- This requires a way to check if a full application was submitted
- Since we only have ApplicationStart (not ApplicationComplete), use a simple check:
  - Path 1: **Application completed** — check if the Individual has a CRM record (Lead/Contact with Status = "Applied") or a second ApplicationStart event
  - Path 2: **Default** — application not completed (send follow-up)
- For the demo, use the default path since we don't have a completion event

**Send Email Element:**
- Content: **Abandoned Application Follow-Up** (created in Step 2A)
- Recipient: The individual from the trigger event
- Contact Point: **Email** (from Contact Point Email DMO)

### 3.4 Activate

- Save the flow
- Click **Activate**
- The flow is now live — every ApplicationStart event triggers it

### 3.5 Test

1. Go to the demo website → Mortgage Detail → click Apply → fill form → submit
2. ApplicationStart event fires → flow starts
3. After 24 hours (or reduce to 5 minutes for testing) → email sends
4. Check: MC Next → Flow → Runs → verify the individual entered the flow

**Testing shortcut:** Set the wait to **5 minutes** during testing, then change to 24 hours before demo.

---

## Step 4: Build Use Case 2 — Mortgage Interest Nurture Campaign

**Flow type:** Segment-Triggered Flow

**Trigger:** Segment "Mortgage Seekers No Application" (created in Step 1A)

### 4.1 Create a Campaign (Optional but Recommended)

**App Launcher → Campaigns → New**

| Setting | Value |
|---|---|
| Name | Mortgage Interest Nurture |
| Type | Email |
| Status | Planned |

### 4.2 Create the Flow

From the Campaign, click **Add Flow → Single Email** (or create from Flows → New)

Select trigger: **Segment-Triggered**

| Setting | Value |
|---|---|
| Name | Mortgage Interest Nurture Flow |
| Segment | **Mortgage Seekers No Application** |
| Schedule | Weekly (or your preferred cadence) |
| Re-entry | After Completion |
| Associated Record | Mortgage Interest Nurture campaign |
| Segment Refresh | Immediately before running this flow |

### 4.3 Build the Flow Canvas

```
[Start: Segment "Mortgage Seekers No Application"]
    │
    ▼
[Send Email: "Still Thinking About a Home Loan?"]
    │
    ▼
[Wait: 5 days]
    │
    ▼
[Decision Split: Did they visit the website since Email 1?]
    │
    ├── YES (engaged) → [Send Email: "Ready to Take the Next Step?"]
    │                          │
    │                          ▼
    │                      [End Flow]
    │
    └── NO (not engaged) → [Send Email: First Home Buyer Guide]
                                │
                                ▼
                            [End Flow]
```

### 4.4 Configure the Decision Split

**"Did they visit the website?"**

Use a **Decision** element with criteria:
- Check: Related Insights → Product Category View Count → ProductViewCount
- Condition: Has **increased** since flow entry (or: Count > previous value)

Alternative (simpler): Use a **Wait Until Event** element that listens for a website engagement event (page view). If the event occurs within 5 days, take the "engaged" path. If timeout, take the "not engaged" path.

### 4.5 Exit Rules

Configure exit rules so individuals leave the flow if they:
- Start an application (enter the "Active Applicants" segment)
- Unsubscribe

**Flow → Exit Rules → Add:**
- Exit when individual enters segment: **Active Applicants**

### 4.6 Activate

Save → Activate → Flow runs on the scheduled cadence.

---

## Step 5: Build Use Case 3 — Post-Application Welcome Journey

**Flow type:** Automation Event-Triggered Flow

**Trigger:** ApplicationStart engagement signal (same as Use Case 1)

**Important:** You'll have two flows triggered by the same event. Use **entry criteria** to differentiate:
- Use Case 1 (Abandoned App): sends after 24h wait, checks for non-completion
- Use Case 3 (Welcome): sends immediately, no wait

### 5.1 Create the Flow

**Flows → New → Automation Event-Triggered**

| Setting | Value |
|---|---|
| Name | Post-Application Welcome Journey |
| Trigger Event | **ApplicationStart** |
| Description | Multi-touch welcome journey after application submission |

### 5.2 Build the Flow Canvas

```
[Start: ApplicationStart event fires]
    │
    ▼
[Send Email: "Welcome — Application Received"]
    │
    ▼
[Wait: 2 days]
    │
    ▼
[Send Email: "Meet Your Mortgage Specialist"]
    │
    ▼
[Wait: 5 days]
    │
    ▼
[Decision Split: Has application been completed/approved?]
    │
    ├── YES → [Send Email: "Congratulations — Next Steps"]
    │                │
    │                ▼
    │            [End Flow]
    │
    └── NO → [Send Email: "3 Things to Prepare for Your Application"]
                    │
                    ▼
                [End Flow]
```

### 5.3 Activate

Save → Activate.

---

## Step 6: Build Use Case 4 — Cross-Channel Batch Personalisation Pipeline

This is the most complex use case — it connects Salesforce Personalization recommenders to MC Next email via Batch Personalization.

### 6.1 Prerequisites

| Prerequisite | Status |
|---|---|
| Segment: Mortgage Seekers No Application | ✅ Created in Step 1A |
| Personalization Point: Email_Product_Recommendations | ✅ Created in Phase 1 |
| Recommender: Personalized Products (Max Applications) | ✅ Created in Phase 1 (training) |
| MC Next email: Products Picked For You | ✅ Created in Step 2E |

### 6.2 Create the Batch Personalisation Job

**App Launcher → Batch Personalizations → New**

| Setting | Value |
|---|---|
| Name | Mortgage Email Recommendations |
| Data Space | default |
| Target Segment | **Mortgage Seekers No Application** |
| Personalization Point | **Email_Product_Recommendations** |
| Contact Point Filter | **Contact Point Email** |
| Schedule | Same as segment (weekly) |
| Refresh Type | Full |
| Status | Active |

**What happens when this runs:**

```
Segment refreshes (weekly)
  → 50 people qualify as Mortgage Seekers No Application
    → Batch job evaluates each person against the recommender
      → For each person: 3 individually ranked products selected
        → Output DMO: 50 rows with PersonID + ActivationData (JSON)
```

### 6.3 Create DMO Activation

**Data Cloud → Activations → New**

| Setting | Value |
|---|---|
| Type | DMO Activation |
| Source | Batch Personalization Output DMO (auto-created) |
| Target | **Marketing Cloud Next** (or Data Cloud activation target) |
| Attributes | Select: ProfileID, IndividualId, ActivationData |
| Schedule | Triggered by batch job completion |

### 6.4 Create the Segment-Triggered Flow

**Flows → New → Segment-Triggered**

| Setting | Value |
|---|---|
| Name | Weekly Personalised Product Email |
| Segment | **Mortgage Seekers No Application** |
| Schedule | Weekly (match the batch job) |

**Flow canvas:**

```
[Start: Segment]
    │
    ▼
[Send Email: "Products Picked For You"]
    │
    ▼
[End Flow]
```

**The email template** uses data from the activation to render personalised product cards per recipient.

### 6.5 Wiring Email Content to Activation Data

In the email template "Products Picked For You":
- Use the **Repeater** component to loop through recommended products
- Data source: **Data Graph Data Provider** or **Activation attributes**
- Each loop iteration renders one product card with Name, Category, Rate, CTA

**Note:** The exact method to wire batch personalisation output to email content depends on your MC Next edition and available data providers. Options include:
1. **Data Graph Data Provider** — pulls product data from the Goods Product DMO at send time
2. **Lookup Data Graph Data Provider** — looks up specific products by ID from the activation data
3. **AMPscript or Handlebars** — parse the ActivationData JSON in the email template

---

## Step 7: Build Use Case 5 — Form-Triggered Lead Capture

**Flow type:** Automation Event-Triggered (Form-Triggered)

This use case captures form submissions from the website and creates/updates CRM records.

### 7.1 Option A: Using the Website Form (Already Built)

The pre-qualification form on the demo website already fires identity, contactPointEmail, contactPointPhone, and ApplicationStart events. These create Individual and Contact Point records in Salesforce Data 360.

To create CRM records (Lead/Contact) from these events, add a **Salesforce Record-Triggered Flow** or use the **Determine CRM Record for Individual** flow template.

### 7.2 Option B: Using an MC Next Native Form

**App Launcher → Content → New → Form**

| Setting | Value |
|---|---|
| Name | First Home Buyer Guide Request |
| Form Type | Signup Form |

**Form fields:**
- First Name (required)
- Last Name (required)
- Email (required)
- Phone (optional)
- "I'm interested in" dropdown: Home Loans / Investments / Savings

**Form Handler:** Configure to create/update a Lead or Contact in CRM

**Landing Page:**
- Create a Landing Page to host the form
- URL: clearwaterbank.demo/guide

**Automation Event-Triggered Flow:**

| Setting | Value |
|---|---|
| Name | Guide Request Follow-Up |
| Trigger | Form Submission (from the MC Next form) |

**Flow canvas:**

```
[Start: Form Submission]
    │
    ▼
[Create/Update Lead in CRM]
    │
    ▼
[Send Email: "Your First Home Buyer Guide"]
    │
    ▼
[Wait: 3 days]
    │
    ▼
[Decision Split: Did they visit the website?]
    │
    ├── YES → [Add to Mortgage Interest Nurture segment]
    │
    └── NO → [Send Email: "Don't miss our home loan guide"]
```

---

## Build Order & Timeline

| Order | What to Build | Depends On | Time |
|---|---|---|---|
| 1 | Segments (3) | CIs active, IDR running | 30 min |
| 2 | Email templates (5) | Email channel configured | 2 hours |
| 3 | Use Case 3: Welcome Journey | Email 2D, ApplicationStart signal | 30 min |
| 4 | Use Case 1: Abandoned App | Email 2A, ApplicationStart signal | 30 min |
| 5 | Use Case 2: Nurture Campaign | Segment 1A, Emails 2B+2C | 45 min |
| 6 | Use Case 5: Form Flow | MC Next form or website form | 30 min |
| 7 | Use Case 4: Batch Pipeline | Segment 1A, Email 2E, Batch Personalization, Activation | 2 hours |

**Total estimated time: 6-7 hours**

---

## Testing Checklist

| Test | How to verify |
|---|---|
| Segments have members | Data Cloud → Segments → check count after publish |
| ApplicationStart triggers flow | Submit demo form → check Flow → Runs |
| Email renders correctly | Content → Preview & Test → select a test individual |
| Merge fields resolve | Preview shows actual first name, not placeholder |
| Wait elements work | Set to 5 min for testing → verify email sends after wait |
| Exit rules work | Start application → verify individual exits Nurture flow |
| Batch personalization produces output | Batch Jobs → check Output DMO records |
| Activation delivers to MC Next | Activations → check delivery status |
| End-to-end: browse → segment → email | Browse 3+ mortgage pages → wait for segment refresh → verify email received |

---

## Demo Script Addition for MC Next

After showing the website personalisation demo (Phase 1), add this 3-minute chapter:

> "Everything we just showed on the website is powered by behavioural data in Salesforce Data 360. That same data doesn't stop at the website — it flows into Marketing Cloud Next."
>
> *[Switch to MC Next Flow Builder]*
>
> "Here's what happens after someone clicks Apply on the website. The ApplicationStart engagement signal fires — you saw it in the Console. This triggers two flows simultaneously."
>
> *[Show Welcome Journey flow]*
>
> "This Welcome Journey sends an immediate confirmation email, then follows up in 2 days with specialist information. All automated, all personalised with the visitor's name and the product they applied for."
>
> *[Show Abandoned Application flow]*
>
> "And if they don't complete their application, this separate flow kicks in after 24 hours with a personalised reminder — featuring the exact product they were looking at."
>
> *[Show Nurture Campaign flow]*
>
> "For visitors who browse but don't apply, this weekly nurture campaign sends relevant mortgage content. The same Data 360 segment that identifies mortgage seekers feeds both the website personalisation AND the email journey."
>
> *[Show email preview]*
>
> "The email isn't generic. It uses the same AI recommender that powers the website to select individually ranked products for each recipient. One model, two channels, consistent experience."
