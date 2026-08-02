# Clearwater Bank — Use Case Catalog

8 personalization use cases demonstrated or enabled by this build. Each includes business value, platform components, effort, and demo capability.

---

## Use Case 1: Behavioral Website Personalization

**Business Problem:** Every visitor sees the same homepage regardless of their browsing behavior.

**Solution:** Real-time Calculated Insights count product page views by category. Personalization decisions change the homepage hero, promo bar, life event module, and product recommendations based on behavioral thresholds.

**Example:** Visitor browses mortgage pages 3+ times → Homepage hero changes to "Your home is closer than you think" with mortgage-specific CTA and product rate.

**Platform Components:**
- Salesforce Interactions SDK (catalog events)
- Data Cloud (Product Browse Engagement DMO)
- Real-Time Calculated Insights (HomeLoanViewCount, InvestmentViewCount)
- Personalization Points with CI-based targeting rules
- Dynamic Content Schemas (Banner, Promo, Life Event, CTA)

**Effort:** 2-3 weeks

**Demo Status:** ✅ Fully live — green LIVE badges on homepage

---

## Use Case 2: Anonymous to Known Identity Resolution

**Business Problem:** Anonymous browsing data is lost when a visitor creates an account or logs in. CRM profile has no visibility into pre-conversion behavior.

**Solution:** SDK captures anonymous browsing with a device cookie. When the visitor identifies themselves (form submission, login), Identity Resolution merges all anonymous engagement records with the CRM Contact under one Unified Individual.

**Example:** Anonymous visitor browses 5 mortgage pages → fills pre-qualification form with email → IDR links anonymous deviceId to CRM Contact → all 5 prior page views now attributed to the customer's profile.

**Platform Components:**
- Salesforce Interactions SDK (identity + contactPointEmail events)
- Data Cloud Identity Resolution (Normalized Email + Device to Known rules)
- Individual Identity Link DMO
- Unified Individual profile

**Effort:** 1 week (part of core Data Cloud setup)

**Demo Status:** ✅ Live — form submission triggers identity merge, Console shows events

---

## Use Case 3: AI-Powered Product Recommendations

**Business Problem:** Product recommendations are manual, segment-based, and the same for everyone in a segment. No individual-level optimization.

**Solution:** Objective-based recommenders use ML to learn which products each visitor is most likely to engage with. Trained on engagement signals (ProductView, ProductClick, ApplicationStart). Individually ranked per visitor profile.

**Example:** Homepage "Personalized For You" shows 3 products selected by AI. Visitor who browses home loans sees mortgage products. Visitor who browses investments sees term deposits. Each ranking is unique.

**Platform Components:**
- Engagement Signals (ProductView, ProductClick, ApplicationStart)
- Custom Objective (Maximize Application Starts)
- Objective-Based Recommenders
- Rule-Based Recommenders (fallback)
- Product Recommendation Content Schema
- Goods Product DMO (product catalog)
- Item Data Graph

**Effort:** 3-4 weeks (includes 48-72h model training period)

**Demo Status:** ✅ Recommenders created — training in progress. Fallback recommender serving immediately.

---

## Use Case 4: Controlled A/B Experimentation

**Business Problem:** No evidence-based way to measure whether AI recommendations outperform manually curated content.

**Solution:** Salesforce Personalization Experiments split traffic between two recommenders on the same personalization point. Primary metric (Application Starts) and secondary metric (Product Clicks) measure which variant wins with statistical significance.

**Example:** Product Detail Page "You May Also Consider" — 50% see rule-based cross-sell (Complementary Products), 50% see AI-ranked products (Maximize Application Starts). After sufficient traffic, data tells you which approach drives more applications.

**Platform Components:**
- Personalization Experiments
- Two competing recommenders (rule-based vs objective-based)
- Engagement Signal metrics (ApplicationStart as primary, ProductClick as secondary)
- Experiment analytics dashboard

**Effort:** 1 week setup after recommenders trained. 2-4 weeks of traffic for statistical significance.

**Demo Status:** ✅ Experiment configured — experiment badge visible on PDP

---

## Use Case 5: Cross-Channel Web → Email Personalization

**Business Problem:** Website browsing behavior doesn't inform email campaigns. Visitors who show mortgage interest on the website receive generic product emails.

**Solution:** The same AI recommender that personalizes the website also generates email product recommendations via batch personalization. A Data Cloud segment identifies mortgage-interested visitors. MC Next segment-triggered flow sends personalized email with individually selected products.

**Example:** Visitor browses mortgage pages 3+ times but doesn't apply → enters "Mortgage Seekers No Application" segment → 24 hours later receives email with "Based on your recent browsing" featuring the 3 mortgage products most relevant to their profile.

**Platform Components:**
- Data Cloud Segments (Mortgage Seekers No Application)
- Batch Personalization (segment + recommender → Output DMO)
- DMO Activation to MC Next
- MC Next Segment-Triggered Flow
- Personalized email template with dynamic product content

**Effort:** 2 weeks (after recommenders and segments are built)

**Demo Status:** ⬜ Architecture designed — MC Next flows not yet built

---

## Use Case 6: Pre-Qualification Form Capture

**Business Problem:** Form submissions create leads but don't link to prior browsing behavior. Marketing has no visibility into what the visitor was interested in before filling the form.

**Solution:** A single form submission fires 4 events to 4 data streams: identity, contactPointEmail, contactPointPhone, and ApplicationStart. Identity Resolution immediately merges all prior anonymous browsing with the new identity. Application data lands in the custom Application Engagement DMO with a lookup to the specific product.

**Example:** Visitor fills "Get Pre-Qualified" form on the mortgage page with name, email, phone, loan amount → 4 events fire → IDR links profile → all prior Home Loan views attributed → ApplicationStart tracked against Variable Home Loan product.

**Platform Components:**
- Salesforce Interactions SDK (formSubmit function)
- Identity data stream → Individual DMO
- Contact Point Email data stream → Contact Point Email DMO
- Contact Point Phone data stream → Contact Point Phone DMO
- Behavioral Events data stream → Application Engagement DMO (custom)
- Identity Resolution (real-time email match)

**Effort:** 1 week (sitemap function + data stream mappings)

**Demo Status:** ✅ Fully live — form on mortgage page, 4 events in Console

---

## Use Case 7: Abandoned Application Follow-Up

**Business Problem:** Visitors who start an application but don't complete it are not followed up with promptly.

**Solution:** The ApplicationStart engagement signal triggers an event-triggered MC Next flow. If no application completion event occurs within 24 hours, a personalized follow-up email is sent with the specific product and a resume link.

**Example:** Visitor clicks "Get Pre-Qualified" on the Variable Home Loan page → ApplicationStart event fires → 24 hours pass with no completion → MC Next sends "Your home loan application is waiting" email with the Variable Home Loan rate and a resume CTA.

**Platform Components:**
- ApplicationStart Engagement Signal (flow-enabled)
- MC Next Automation Event-Triggered Flow
- Decision split (check for completion)
- Personalized email template
- Data Graph lookup for product details

**Effort:** 1 week (after engagement signals are configured)

**Demo Status:** ⬜ Architecture designed — MC Next flow not yet built

---

## Use Case 8: Personalized Dashboard (Next Best Product)

**Business Problem:** Online banking dashboards show the same content to every customer regardless of their profile, products held, or browsing behavior.

**Solution:** An authenticated-context AI recommender analyzes the customer's full profile (CRM data + cross-device browsing history + identity-resolved engagement) to determine the single best product recommendation. Shown as a "Next Best Product" card on the dashboard.

**Example:** Michael Torres holds an Everyday Checking account, has browsed home loan pages 5 times, and has no savings product → AI recommends "Everyday Savings — 5.10% p.a." as his next best product, with a personalized message: "Linking a savings account takes 3 minutes."

**Platform Components:**
- Objective-Based Recommender (MaxAppStarts_Dashboard)
- Authenticated profile data (CRM fields + browsing history)
- Real-Time Profile Data Graph
- Dashboard_Next_Best_Product personalization point
- Product Recommendation Content Schema

**Effort:** 1 week (after recommender is trained)

**Demo Status:** ✅ Personalization point built — recommender training in progress

---

## Summary Matrix

| # | Use Case | Channel | Effort | Demo Status |
|---|---|---|---|---|
| 1 | Behavioral Website Personalization | Web | 2-3 weeks | ✅ Live |
| 2 | Anonymous to Known Identity Resolution | Web + Data | 1 week | ✅ Live |
| 3 | AI Product Recommendations | Web | 3-4 weeks | ✅ Built |
| 4 | A/B Experimentation | Web | 1 week | ✅ Built |
| 5 | Cross-Channel Web → Email | Web + Email | 2 weeks | ⬜ Designed |
| 6 | Pre-Qualification Form Capture | Web + Data | 1 week | ✅ Live |
| 7 | Abandoned Application Follow-Up | Email | 1 week | ⬜ Designed |
| 8 | Personalized Dashboard (NBA) | Web | 1 week | ✅ Built |
