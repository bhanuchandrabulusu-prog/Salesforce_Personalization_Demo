# Clearwater Bank — Demo Talk Track & Storyboard

## Demo Prerequisites

- localhost:3000 running with latest clearwater-bank.html
- Chrome Incognito ready (fresh session)
- Salesforce org open in a separate tab (for showing the backend)
- "Show Personalization Zones" toggle ready
- Console open (F12) — minimize until needed

**Total demo time: 15-20 minutes**

---

## Chapter 1: The Starting Point (2 minutes)

**Open:** Fresh incognito → http://localhost:3000/clearwater-bank.html

**Persona:** New Prospect (default)

**What to say:**

> "This is Clearwater Bank — a retail banking website. Right now, I'm a completely anonymous visitor. No cookies from a previous visit, no login, no account. The website has no idea who I am."
>
> "Notice the homepage hero: 'Welcome to Clearwater Bank' — generic content. Every first-time visitor sees this exact same page. Same headline, same products, same CTAs."
>
> "Let me show you something. I'll turn on the personalization zone overlay."

**Action:** Click "Show Personalization Zones"

> "Every blue-outlined box is a personalization zone — a place where Salesforce can make a decision about what to show. You can see the point name, the current decision, and the targeting rule for each zone."
>
> "Right now, all zones are showing default or first-time visitor content. Let's change that."

---

## Chapter 2: Building Behavioral Intent (3 minutes)

**Action:** Navigate to Mortgage Detail page

> "I'm now browsing the Clearwater Variable Home Loan page. Behind the scenes, the Salesforce Interactions SDK just sent a catalog event to Data Cloud. It captured what product I viewed, the product category — 'Home Loan' — and my anonymous device ID."

**Action:** Navigate to Home → Mortgage Detail → Home → Mortgage Detail

> "I'm clicking back and forth — just normal browsing behavior. Each time I visit the mortgage page, another catalog event fires. Data Cloud is counting: one view, two views, three views."
>
> "In Data Cloud, a real-time Calculated Insight is aggregating these views. It's asking: 'How many times has this anonymous visitor viewed Home Loan products?' Right now, the answer is 3."

**Action:** Wait 2-3 minutes (fill with Q&A or show the Salesforce backend)

**Optional — show the backend while waiting:**

> "While we wait for the data to process, let me show you what's happening in Salesforce."

- Show Data Cloud → Product Browse Engagement → records with type "Home Loan"
- Show the HomeLoan_Views CI → explain the real-time query
- Show Homepage_Hero_Banner → the 7 decisions in priority order

---

## Chapter 3: The Personalized Experience (3 minutes)

**Action:** Navigate to Homepage

> "Now watch the homepage hero."

**Expected:** Green LIVE banner appears. Hero changes to "Your home is closer than you think."

> "The entire homepage just adapted. The hero headline changed to 'Your home is closer than you think.' The CTA changed to 'Get Pre-Qualified.' There's a green LIVE PERSONALIZATION banner confirming this content came from Salesforce — not from the website's code."
>
> "Let me show you the zone overlay."

**Action:** Point to the hero_banner zone overlay

> "Look at the bottom strip: point: Homepage_Hero_Banner, decision: [ID], rule: the full priority stack. The engine evaluated 7 possible decisions and picked the one that matched this visitor's behavioral profile — 3+ home loan views."
>
> "No code change. No deployment. The marketing team configured this decision in the Salesforce UI. If they want to change the headline tomorrow, they click Save. It's live instantly."

**Action:** Scroll down to show other live zones (Promo Bar, Personalized For You, Life Event Module)

> "It's not just the hero. The promo bar changed to a mortgage offer. The product grid is showing AI-recommended products. The life event module is showing a calculator nudge. The entire page adapted — not one zone, but every zone, all from the same behavioral signal."

---

## Chapter 4: A Different Journey — Investment (3 minutes)

**Action:** Open a NEW incognito window (side by side if possible)

> "Let me show you what happens with a completely different visitor. Fresh browser, fresh cookie, zero history."

**Action:** Navigate to Investment Detail → Home → Investment Detail → Home

> "This visitor is browsing term deposits, not home loans. Different product category, different behavioral signal."

**Action:** Wait 2-3 minutes, then navigate to Homepage

> "Watch the homepage hero."

**Expected:** Hero changes to investment-themed content ("Make your money work harder")

> "Same website, same personalization engine, but a completely different experience — because this visitor's behavior tells a different story. The mortgage browser sees mortgage content. The investment browser sees investment content. Each experience is individually driven by data."

---

## Chapter 5: The Form — Anonymous to Known (3 minutes)

**Action:** Return to the first incognito window (mortgage browser)

> "Let's continue this visitor's journey. They've seen the personalized mortgage hero. They're interested. Let's see what happens when they take action."

**Action:** Navigate to Mortgage Detail → click the Apply CTA → Form opens

> "This is the pre-qualification form. When this visitor submits their details, four things happen simultaneously."

**Action:** Fill in: First Name = Sarah, Last Name = Chen, Email = sarah.chen@demo.com, Phone = 0412345678, Loan Amount = $500k-$750k

**Action:** Click Submit Pre-Qualification

> "Done. Four events just fired to four different data streams in Data Cloud."

**Action:** Point to the success screen showing the data flow

> "An identity event created Sarah's profile. A contact point email event captured her email. A contact point phone event captured her phone number. And an ApplicationStart event recorded her intent to apply."
>
> "Most importantly — Identity Resolution just kicked in. Sarah's anonymous browsing history — those 5 mortgage page views — is now merged with her new identity. When Sarah comes back tomorrow on a different device and logs in, all that browsing history follows her."

---

## Chapter 6: Cross-Channel Story (2 minutes)

**What to say (no demo action needed — narrative only):**

> "Here's where it gets powerful. The same behavioral data that personalized the website can now trigger an email via Marketing Cloud Next."
>
> "A segment-triggered flow watches for visitors with 3+ home loan views who haven't completed their application. Sarah qualifies. Within 24 hours, she receives a personalized email with the exact mortgage product she was looking at — the Variable Home Loan, the rate, a one-click link to resume."
>
> "The same AI recommender that showed products on the website generates the email product recommendations. One model, two channels, consistent experience."

**Optional — switch to Salesforce and show:**
- The MC Next Flow Builder canvas (if built)
- The segment definition
- The email template with dynamic product content

---

## Chapter 7: Under the Hood — For the Technical Audience (3 minutes)

**Action:** Open the Console (F12)

> "For those interested in the technical architecture, let me show you what's happening under the hood."

**Action:** Navigate between pages, point to Console output

> "Every page navigation fires a sendEvent call. You can see the translated event payload — eventType, product ID, product category. These events land in Data Cloud within seconds."
>
> "The Personalization.fetch call returns the decision response — you can see the personalizationPointName, the decision ID, and the content attributes. The website reads this response and renders it."

**Action:** Point to the architecture flow

> "The flow is: SDK → Data Cloud → Real-Time Data Graph → Calculated Insights → Personalization Engine → Decision → Content back to the website. All native Salesforce. No middleware, no custom API, no third-party tools."

---

## Chapter 8: Wrap-Up and Next Steps (2 minutes)

**What to say:**

> "What you just saw is a complete end-to-end personalization solution built entirely on Salesforce's native platform."
>
> "The behavioral targeting — browsing mortgage pages and seeing the homepage adapt — that's powered by Calculated Insights and Personalization Decisions."
>
> "The identity resolution — anonymous visitor becoming Sarah Chen, with all history preserved — that's Data Cloud's Identity Resolution running in real-time."
>
> "The AI recommendations — the product grid showing individually selected products — that's an objective-based recommender optimizing for application starts."
>
> "And the cross-channel story — the website behavior triggering a personalized email — that's MC Next consuming the same Data Cloud infrastructure."
>
> "All of this was built in approximately 6 weeks. The initial SDK deployment is a one-time setup. After that, every new personalization decision, targeting rule, and content change is done by the marketing team in the Salesforce UI — no code deployment required."
>
> "Our recommended next step: a half-day workshop to define your top 3-5 personalization use cases. From there, we can have your first personalized experience live in production within 6-7 weeks."

---

## Emergency Recovery Scenarios

| Problem during demo | What to say | Recovery |
|---|---|---|
| CI hasn't processed yet (hero doesn't change) | "The real-time insight needs a moment to aggregate. In production this happens in seconds. Let me show you what it looks like when it fires." | Show a screenshot or switch to regular Chrome where it already works |
| SDK not connected | "Let me check the connection." | Check localhost:3000 is running, hard refresh |
| Wrong decision fires | "You can see in the zone overlay which decision is active. The engine evaluates top-down, first match wins." | Use it as a teaching moment about priority order |
| Live data shows wrong name (Michael instead of Sarah) | "This is a testing artifact — in production, each visitor has one name. The merge field resolves from the most recent identity event." | Move past it quickly |

---

## Talking Points for Q&A

| Question | Answer |
|---|---|
| "How long does personalization take to respond?" | Under 200ms. The visitor never sees a loading state — flicker defense hides the zone until the decision arrives. |
| "Does the website team need to change code for every new personalization?" | No. After the initial SDK deployment, new decisions are configured entirely in Salesforce. The marketing team clicks Save and it's live. For complex rendering (product grids), the Web Personalization Manager can inject content without code. |
| "What happens if the personalization engine is down?" | The website falls back to default content. Flicker defense has a 2-second timeout — if no response, the visitor sees the generic page. No errors, no blank spaces. |
| "Can we use this with our existing CMS/AEM?" | Yes. The SDK loads as a script tag on any website. The personalization response is JSON — your CMS or React/Angular/Vue framework reads it and renders. For CMS-managed pages, the Web Personalization Manager can inject content directly into the DOM. |
| "How does this compare to Adobe Target?" | Both offer real-time web personalization. Salesforce's advantage: unified data layer. The same Data Cloud that powers personalization also powers segmentation, email, SMS, and CRM. No data replication or sync needed. |
| "What about privacy/consent?" | The SDK respects the consent banner. No events fire until the visitor opts in. Data Cloud handles consent preferences per channel and per purpose. |
