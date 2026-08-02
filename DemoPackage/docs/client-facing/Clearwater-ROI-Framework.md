# Clearwater Bank — ROI & Value Framework

## Purpose

This framework helps quantify the business case for Salesforce Personalization + Data 360. It maps platform capabilities to measurable business outcomes and provides a structure for tracking ROI post-implementation.

---

## Value Drivers

### 1. Conversion Rate Lift from Personalized Content

**What to measure:** Conversion rate (application starts, form submissions, product sign-ups) for visitors who receive personalized content vs those who see default content.

**How the platform enables measurement:**
- Personalization Attribution Intelligence tracks which decisions drove which conversions
- A/B experiments directly measure lift: Control (default) vs Variant (personalized)
- Attribution DMOs capture: which personalization point, which decision, which content → led to which conversion

**Benchmarks (industry averages):**

| Metric | Generic Experience | Personalized Experience | Typical Lift |
|---|---|---|---|
| Homepage → Product Page CTR | 2-4% | 5-8% | 2-3x |
| Product Page → Application Start | 1-3% | 3-7% | 2-4x |
| Email Open Rate | 15-20% | 25-35% | 50-75% lift |
| Email Click-Through Rate | 2-3% | 5-8% | 2-3x |

**Example calculation:**

| Metric | Before | After (personalized) | Impact |
|---|---|---|---|
| Monthly website visitors | 100,000 | 100,000 | — |
| Homepage → Mortgage page CTR | 3% | 6% (2x lift from personalized hero) | +3,000 additional product page visits |
| Mortgage page → Application start | 2% | 4% (personalized CTA + recommendations) | +60 additional applications/month |
| Application → Settlement | 30% | 30% (unchanged) | +18 additional settlements/month |
| Average loan value | $500,000 | $500,000 | — |
| Revenue per settlement | $5,000 (fees + margin) | $5,000 | — |
| **Monthly revenue impact** | — | — | **+$90,000/month** |
| **Annual revenue impact** | — | — | **+$1,080,000/year** |

---

### 2. Reduction in Content Production Costs

**What to measure:** Time and cost to create, deploy, and maintain personalized web experiences.

**Before personalization:**
- Marketing team creates segment-specific landing pages manually
- Each variation requires design + development + QA + deployment
- Changes take 2-4 weeks per variation
- 10 segments × 5 pages = 50 page variations to maintain

**After personalization:**
- One page template, multiple decisions configured in Salesforce UI
- New variations: marketer types content, sets targeting rule, clicks Save
- Changes are live in minutes, not weeks
- 10 decisions per page × 5 pages = 50 personalized experiences from 5 templates

| Metric | Before | After | Savings |
|---|---|---|---|
| Time to create a new personalized experience | 2-4 weeks | 30 minutes | 95% reduction |
| Development cost per variation | $5,000-$10,000 | $0 (marketer self-service) | 100% reduction |
| Annual content maintenance cost (50 variations) | $250,000-$500,000 | $25,000 (Salesforce admin time) | 90-95% reduction |

---

### 3. Cross-Channel Efficiency

**What to measure:** Reduction in duplicate effort when the same behavioral data powers multiple channels.

**Before:**
- Website personalization tool (Adobe Target, Optimizely) — separate data
- Email personalization (MCE, Braze) — separate segments
- CRM personalization — separate rules
- Each channel maintains its own customer profile and segment definitions
- Data sync between tools: 24-48 hour lag

**After:**
- One data source (Data Cloud) → one customer profile → one set of segments → one recommender
- Website, email, SMS, push all consume the same personalization decisions
- Behavioral data from website triggers email within hours, not days
- No data replication, no sync lag, no duplicate segment maintenance

| Metric | Before | After | Savings |
|---|---|---|---|
| Time to sync website behavior to email | 24-48 hours | Real-time (email trigger) or < 4 hours (batch) | 90% reduction |
| Number of tools maintaining customer profiles | 3-4 | 1 (Data Cloud) | 75% reduction |
| Duplicate segment definitions across tools | 50+ | 0 | 100% elimination |
| Marketing ops headcount for tool management | 2-3 FTEs | 1 FTE | 50-66% reduction |

---

### 4. AI Recommendation Revenue

**What to measure:** Incremental revenue from AI-optimized product recommendations vs manual/rule-based curation.

**How the platform enables measurement:**
- A/B experiment: Rule-based (control) vs AI objective-based (variant)
- Primary metric: Application Start Count
- Track through to settlement/activation for full revenue attribution

**Example calculation:**

| Metric | Rule-Based (manual) | AI-Optimized | Lift |
|---|---|---|---|
| Recommendation CTR | 3% | 5% | +67% |
| Application start rate from recs | 1.5% | 3% | +100% |
| Monthly applications from recs | 45 | 90 | +45 additional |
| Revenue per application | $2,000 | $2,000 | — |
| **Monthly incremental revenue** | — | — | **+$90,000** |

---

## KPIs to Track Post-Implementation

### Primary KPIs

| KPI | Definition | Source | Target |
|---|---|---|---|
| **Personalized Experience Rate** | % of page views that receive a live personalized decision (not default) | Personalization Pipeline Intelligence | > 60% within 3 months |
| **Conversion Rate Lift** | Application start rate for personalized vs default visitors | A/B experiment results | > 50% lift |
| **Cross-Channel Personalization Rate** | % of email sends that include behaviorally-driven content | MC Next + Batch Personalization metrics | > 30% within 6 months |
| **Identity Resolution Rate** | % of website visitors resolved to a Unified Individual | IDR metrics | > 40% (including Device to Known) |

### Secondary KPIs

| KPI | Definition | Source |
|---|---|---|
| **Personalization Response Time** | Average time from Personalization.fetch to content delivery | Pipeline Intelligence |
| **Recommender Accuracy** | % of recommended products that receive engagement (click or view) | Engagement Signal metrics |
| **Segment Freshness** | Time between behavioral event and segment membership update | Data Cloud segment metrics |
| **Decision Coverage** | % of personalization points with > 2 decisions (not just default) | Personalization Point audit |

---

## Implementation Investment

| Cost Category | Estimate | Notes |
|---|---|---|
| **Salesforce Licensing** | Varies by edition (MCG vs MCA) | Includes Data Cloud, Personalization, MC Next. Validate with Salesforce AE. |
| **Implementation Services** | 6-7 weeks × team rate | Discovery, design, build, test, go-live. Typically 2-3 consultants. |
| **Website Integration** | 1-2 sprints of web team time | SDK script tag deployment + optional rendering code for complex zones |
| **Ongoing Operations** | 0.5 FTE marketing ops | Decision management, content updates, experiment analysis, reporting |

---

## ROI Summary

| Benefit | Annual Value (Conservative) |
|---|---|
| Conversion rate lift (mortgage applications) | $500,000 - $1,000,000 |
| Content production cost reduction | $200,000 - $400,000 |
| Cross-channel efficiency (tool consolidation, headcount) | $150,000 - $300,000 |
| AI recommendation incremental revenue | $500,000 - $1,000,000 |
| **Total annual benefit** | **$1,350,000 - $2,700,000** |
| **Implementation cost (one-time)** | **$150,000 - $300,000** |
| **Payback period** | **1-3 months** |

*Note: These are illustrative estimates based on industry benchmarks. Actual ROI depends on traffic volume, product mix, conversion rates, and implementation scope. Recommend building a client-specific model during the discovery phase.*
