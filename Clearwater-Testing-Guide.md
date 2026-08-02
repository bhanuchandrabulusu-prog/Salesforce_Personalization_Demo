# Clearwater Bank — Personalization Testing Guide

## Prerequisites

- [ ] localhost:3000 running (`python -m http.server 3000`)
- [ ] Latest clearwater-bank.html deployed
- [ ] Latest clearwater-sitemap.js uploaded to Data Cloud connector
- [ ] All personalization points created and decisions set to **Live**
- [ ] CIs active and added to profile data graph
- [ ] DevTools Console open (F12)

---

## Test 1: Homepage Hero Banner — Behavioral Targeting

**Goal:** Prove that browsing behavior triggers a personalized hero.

### Test 1A: Default Decision (no browsing history)

| Setting | Value |
|---|---|
| Browser | Chrome Incognito (fresh session) |
| Persona | New Prospect |
| URL | http://localhost:3000/clearwater-bank.html |

**Steps:**
1. Open incognito window
2. Go to http://localhost:3000/clearwater-bank.html
3. Stay on homepage

**Expected outcome:**
- Console: `[Clearwater] Personalization response → home` with `personalizations: [{...}]`
- If Default decision exists: hero shows "Banking built around your life" (from Salesforce)
- If no Default decision: `"User did not qualify"` — hero shows mock persona content
- No green LIVE banner

---

### Test 1B: Mortgage Intent Decision (3+ home loan views)

| Setting | Value |
|---|---|
| Browser | Same incognito window from Test 1A |
| Persona | New Prospect (don't switch) |

**Steps:**
1. Click **Mortgage Detail** in nav
2. Click **Home** in nav
3. Click **Mortgage Detail**
4. Click **Home**
5. Click **Mortgage Detail**
6. Click **Home**
7. Wait 2-3 minutes for CI to process
8. Click **Home** one more time

**Expected outcome:**
- Console: `[Clearwater UI] ✓ Rendering live hero: Your home is closer than you think`
- Green LIVE PERSONALIZATION banner appears at top
- Hero headline changes to **"Your home is closer than you think"**
- CTA changes to **"Get Pre-Qualified"**
- Eyebrow shows **"🏠 Home Loan Spotlight"**
- Featured card shows **"⚡ Live Decision"** badge
- Hero background shifts to green-navy gradient

**If it doesn't work:**
- Check Console for CI value: `HomeLoanViewCount` must be ≥ 3
- Check Data Cloud → Product Browse Engagement → records exist with `type: "Home Loan"`
- Check CI is added to profile data graph
- Wait another 2 minutes and retry

---

### Test 1C: Investment Interest Decision

| Setting | Value |
|---|---|
| Browser | New incognito window (fresh deviceId) |
| Persona | New Prospect |

**Steps:**
1. You need an investment product page to browse — the current demo only has Mortgage Detail
2. **Skip this test** unless you add an Investment product page to the website
3. Alternative: manually create Product Browse Engagement records with `type: "Investment"` via API

---

### Test 1D: Incomplete Application Decision

| Setting | Value |
|---|---|
| Browser | Same incognito from Test 1B (or new one) |
| Persona | New Prospect |

**Steps:**
1. Navigate to **Mortgage Detail**
2. Click the **Apply CTA** (opens pre-qualification form)
3. Fill in: First Name = Test, Last Name = User, Email = test@demo.com
4. Click **Submit Pre-Qualification**
5. Close the form
6. Navigate to **Home**
7. Wait 2-3 minutes for Application Start Count CI to process
8. Navigate to **Home** again

**Expected outcome:**
- If Incomplete Application decision priority is higher than Mortgage Intent: hero changes to **"Pick up where you left off"**
- If Mortgage Intent is higher priority: hero still shows mortgage content (priority wins)
- Console: check which decisionId was returned

**Note:** This test depends on decision priority order. If Mortgage Intent (priority 2) is higher than Incomplete Application (priority 4), the mortgage hero always wins for a visitor who has both 3+ views AND an application start.

---

### Test 1E: First-Time Visitor Decision

| Setting | Value |
|---|---|
| Browser | New incognito window (fresh deviceId, zero history) |
| Persona | New Prospect |

**Steps:**
1. Open fresh incognito
2. Go to homepage — DO NOT navigate anywhere else first

**Expected outcome:**
- If First-Time Visitor decision exists (Is Anonymous = 1): hero shows **"Welcome to Clearwater Bank"**
- This fires before any behavioral data exists

---

### Test 1F: Existing Customer Decision

| Setting | Value |
|---|---|
| Browser | New incognito window |
| Persona | Start as New Prospect, then switch |

**Steps:**
1. Open fresh incognito
2. Go to homepage as New Prospect
3. Switch persona to **Existing Customer** (fires identity event)
4. Wait for re-fetch (500ms)

**Expected outcome:**
- If Existing Customer decision exists (Is Anonymous = 0): hero shows **"Welcome back, {FirstName}"**
- If merge field works: shows actual first name from identity event (e.g., "Welcome back, Michael")
- If merge field returns blank: shows "Welcome back, " or default value

**Note:** If this visitor also has 3+ mortgage views (from the same session before switching persona), Mortgage Intent (higher priority) wins over Existing Customer.

---

## Test 2: Homepage Promo Bar

| Setting | Value |
|---|---|
| Browser | Same session as Test 1B (has mortgage history) |
| Persona | New Prospect |

**Steps:**
1. After Test 1B completed, you're on the homepage with mortgage intent
2. Look at the promo bar below the nav

**Expected outcome:**
- If Mortgage Promo decision fires: shows **"Limited offer: Home loan rates from 5.89%..."** with ⚡ LIVE badge
- If Default Promo fires: shows **"Open an Everyday Savings account today..."**
- Console: check for `Homepage_Promo_Bar` in personalization response

---

## Test 3: Homepage Personalized For You (Recommendations)

| Setting | Value |
|---|---|
| Browser | Same session as Test 1B |
| Persona | Any |

**Steps:**
1. On homepage, scroll to "Products tailored to your profile" section

**Expected outcome — if recommender is trained:**
- Section header changes to **"⚡ AI-Powered Recommendations"**
- ⚡ LIVE badge appears
- 3 product cards from the Goods Product DMO (real product names, categories, descriptions)
- Product cards show "⚡ AI Recommended" tag

**Expected outcome — if recommender is still training:**
- Fallback recommender serves products
- Or mock persona content shows if no recommendation returned

**Console check:**
```
[Clearwater UI] ✓ Live data for Homepage_Personalized_For_You (recommendations:3)
```

---

## Test 4: Homepage Life Event Module

| Setting | Value |
|---|---|
| Browser | Same session |
| Persona | Any |

**Steps:**
1. On homepage, scroll to the life event tile (below products)

**Expected outcome:**
- If Mortgage Calculator Nudge decision fires (HomeLoanViewCount ≥ 1): shows **"Know your numbers"** / **"Calculate your repayments..."**
- If First Home Buyer Guide fires (Is Anonymous = 1): shows **"First Home Buyer?"**
- If Cross-Sell Savings fires (Is Anonymous = 0): shows **"A smarter way to save"**
- If Default: shows **"Financial Wellbeing"**
- Live tile shows ⚡ LIVE badge and green background

---

## Test 5: Home Loans Hub

**Note:** Hub page zones (Hub_Hero_Banner, Hub_Product_Spotlight, Hub_Calculator_Prompt) are NOT wired to live rendering in the current HTML — they show mock content only. Console will show personalization responses but the UI won't change.

| Setting | Value |
|---|---|
| Browser | Any |
| Persona | Any |

**Steps:**
1. Navigate to **Home Loans** page
2. Check Console for personalization response

**Expected Console output:**
```
[Clearwater] Personalization response → loans {personalizations: [...]}
```

**Expected UI:** Mock content only (no green treatment). Live rendering for Hub pages is a future update.

---

## Test 6: Mortgage Detail — Offer Badge

| Setting | Value |
|---|---|
| Browser | Session with 3+ mortgage views |
| Persona | New Prospect |

**Steps:**
1. Navigate to **Mortgage Detail**
2. Look for the badge above the product title

**Expected outcome:**
- If Recommended Badge decision fires (HomeLoanViewCount ≥ 3): shows **"⭐ Recommended for You"** with green dot
- If no decision fires: no badge shown (default decision returns empty message)

---

## Test 7: Mortgage Detail — Infobar

| Setting | Value |
|---|---|
| Browser | Any |
| Persona | **Existing Customer** |

**Steps:**
1. Switch to Existing Customer persona
2. Navigate to **Mortgage Detail**
3. Look below the product title for the green infobar

**Expected outcome:**
- If Authenticated Customer decision fires (Is Anonymous = 0): shows **"Welcome back, {FirstName} — as an existing Clearwater customer..."** with ⚡ LIVE badge
- If merge field works: shows "Welcome back, Michael"
- If Anonymous Prompt fires: shows **"Already a Clearwater customer? Log in..."**

---

## Test 8: Mortgage Detail — Cross-Sell (A/B Experiment)

| Setting | Value |
|---|---|
| Browser | Any |
| Persona | Any |

**Steps:**
1. Navigate to **Mortgage Detail**
2. Scroll to "You may also consider" section

**Expected outcome — if experiment is active and recommender responding:**
- 3 product cards from Goods Product DMO
- ⚡ LIVE badge + ⚗️ A/B Experiment Active badge both visible
- Products tagged "⚡ AI Recommended"
- Console shows which variant was served (check `personalizationId`)

**Expected outcome — if recommender not trained yet:**
- Fallback products or mock content
- ⚗️ A/B Experiment Active badge still shows (mock)

---

## Test 9: Mortgage Detail — Pre-Qualification Form

| Setting | Value |
|---|---|
| Browser | Any |
| Persona | **New Prospect** |

**Steps:**
1. Navigate to **Mortgage Detail**
2. Click the Apply CTA button on the sticky card (right side)
3. Form modal opens
4. Fill in: Sarah, Chen, sarah.chen@test.com, 0412345678, $500k-$750k
5. Click **Submit Pre-Qualification**

**Expected Console output:**
```
[Clearwater] Form → identity event: Sarah Chen sarah.chen@test.com
[Clearwater] Form → contactPointEmail event: sarah.chen@test.com
[Clearwater] Form → contactPointPhone event: 0412345678
[Clearwater] Form → ApplicationStart event: clearwater-variable-home-loan loanAmount: 500k-750k
[Clearwater] ✓ Form submission complete. 3-4 events fired...
```

**Expected UI:**
- Form shows success screen with green checkmark
- "What just happened in Data 360" section shows the 5 data flow steps
- "Continue Browsing" button closes the form

**Expected Data Cloud impact (check after 2-3 minutes):**
- Identity data stream: new record
- Contact Point Email data stream: new record
- Contact Point Phone data stream: new record (if phone provided)
- Behavioral Events data stream: ApplicationStart event

---

## Test 10: Dashboard — Relationship Banner (Merge Fields)

| Setting | Value |
|---|---|
| Browser | Any |
| Persona | **Premier Customer** or **Existing Customer** |

**Steps:**
1. Switch to Premier Customer or Existing Customer
2. Navigate to **Online Banking**

**Expected outcome:**
- If Dashboard_Relationship_Banner decision fires (Is Anonymous = 0):
  - Shows **"Welcome back, {FirstName}"** with ⚡ LIVE badge
  - If merge field works: actual name ("Welcome back, Sarah" or "Welcome back, Michael")
  - Eyebrow shows "Good afternoon"
- If no decision fires: mock content (Sarah's Dashboard / Michael's Dashboard)

---

## Test 11: Dashboard — Next Best Product (AI Recommendation)

| Setting | Value |
|---|---|
| Browser | Any |
| Persona | **Premier Customer** or **Existing Customer** |

**Steps:**
1. On the Dashboard page, look at the NBA module on the right side

**Expected outcome — if recommender trained and responding:**
- Card header: **"⚡ LIVE AI RECOMMENDATION"**
- Product name from Goods Product DMO
- Product category shown
- ⚡ LIVE badge in the card body
- Green gradient on card header
- Console: `[Clearwater UI] ✓ Live data for Dashboard_Next_Best_Product (recommendations:1)`

**Expected outcome — if recommender still training:**
- Fallback product or mock NBA content (SMSF Investment Account for Premier, Savings for Existing)

---

## Test 12: Prospect-to-Customer Journey (Identity Resolution)

**Goal:** Prove anonymous browsing merges with authenticated identity.

| Setting | Value |
|---|---|
| Browser | **New incognito window** |
| Persona | Start as **New Prospect** |

**Steps:**
1. Open fresh incognito → homepage
2. Navigate to Mortgage Detail → Home → Mortgage Detail → Home → Mortgage Detail → Home (3+ views)
3. Wait 2-3 minutes
4. Navigate to Home → verify live mortgage hero fires (green treatment)
5. **Now switch to Existing Customer** persona
6. Console shows: `🔄 Prospect → Existing Customer (Michael Torres). Identity event sent.`
7. Navigate to Home again

**Expected outcome:**
- Mortgage hero STILL fires — because the same deviceId carries the behavioral history
- Identity event merges this deviceId with Michael Torres' CRM profile
- In Data Cloud: all Product Browse Engagement records from steps 2-3 now belong to Michael's Unified Individual

**Verification in Data Cloud (after 2-3 minutes):**
- Data Cloud → Unified Individual Profiles → search michael.torres@clearwaterbank.demo
- Should show the browsing engagement records from the anonymous session

---

## Test 13: Cross-Device Identity (Advanced)

**Goal:** Prove that logging in on a new device inherits prior browsing history.

| Setting | Value |
|---|---|
| Browser 1 | Regular Chrome (has 15+ mortgage views from earlier testing) |
| Browser 2 | **New incognito window** (fresh deviceId, zero history) |

**Steps:**
1. In incognito: go to homepage as New Prospect
2. Navigate to Mortgage Detail ONCE → Home
3. Homepage should NOT show live mortgage hero (only 1 view, need 3)
4. **Switch to Existing Customer** persona (fires identity: michael.torres@clearwaterbank.demo)
5. Wait for IDR to merge (a few seconds)
6. Navigate to Home

**Expected outcome:**
- Mortgage hero fires — because IDR merged the new deviceId with Michael's Unified Individual
- Michael's Unified Individual already has 15+ Home Loan views from Browser 1
- CI counts ALL views across ALL devices = 16+ → ≥ 3 threshold → decision fires
- Console: live hero content returned

---

## Test 14: Personalization Zone Overlay

**Goal:** Verify all zones show correct point names, decisions, and rules.

| Setting | Value |
|---|---|
| Browser | Any active session with live data |
| Persona | Any |

**Steps:**
1. Click **"Show Personalization Zones"** toggle in the demo bar
2. Navigate through all 4 pages
3. Check every blue-outlined zone

**Expected outcome per zone:**
- Blue outline (or green if live decision active)
- Zone name badge (top left): e.g., `📍 hero_banner`
- Info strip (bottom): `point:` `decision:` `rule:` values
- Live zones show: `decision: ⚡ Live from Salesforce Personalization`
- Mock zones show: `decision: Default — New Visitor Welcome` (or whatever the mock says)

---

## Quick Reference: Which Decisions Fire for Which Persona

| Decision | New Prospect (anon, no history) | Prospect (3+ mortgage views) | Existing Customer | Premier Customer |
|---|---|---|---|---|
| **Mortgage Intent** (HomeLoanViewCount ≥ 3) | ❌ | ✅ Priority 2 | ✅ if has views | ✅ if has views |
| **Investment Interest** (InvestmentViewCount ≥ 2) | ❌ | ❌ | ❌ | ❌ (no investment page in demo) |
| **Incomplete Application** (AppStartCount ≥ 1) | ❌ | ❌ unless applied | ✅ if applied | ✅ if applied |
| **First-Time Visitor** (Is Anonymous = 1) | ✅ | ✅ | ❌ | ❌ |
| **Existing Customer** (Is Anonymous = 0) | ❌ | ❌ | ✅ | ✅ |
| **Default** (Always) | ✅ fallback | ✅ fallback | ✅ fallback | ✅ fallback |

**Priority wins:** If a visitor matches multiple decisions, the highest-priority (lowest number) wins. Mortgage Intent (P2) beats Existing Customer (P6) every time.

---

## Troubleshooting Quick Reference

| Symptom | Likely cause | Fix |
|---|---|---|
| Console: no `[Clearwater]` messages | Old HTML file | Download latest, hard refresh |
| Console: `SDK not found after 15s` | Running from `file://` | Use localhost:3000 |
| Console: `User did not qualify for a decision` | CI threshold not met OR no Default decision | Add Default decision or generate more views |
| Console: response has `data: []` | Recommender still training OR no products in catalog | Wait 48-72h or check Goods Product records |
| Console: response has `attributes: {}` (empty) | Decision exists but no content values filled in | Edit decision, fill in attribute values |
| Green hero shows for wrong persona | Same deviceId carries behavioral data across persona switches | Expected behavior — use different browsers for clean personas |
| Promo bar / life event / badge not showing live | The zone isn't wired to live rendering | Check useLivePoint is called for that zone |
| Hub pages don't show live content | Hub pages not wired to live rendering yet | Expected — future update |
| Identity data streams empty | Wrong field names or missing required fields | Check schema: `email` not `emailAddress`, `isAnonymous` required |
| CI returns 0 | IDR not run, or KQ mismatch, or wrong filter values | Check IDR ran, check CI filter matches actual event values |
