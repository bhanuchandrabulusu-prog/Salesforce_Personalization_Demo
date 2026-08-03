# Clearwater Bank — Lessons Learned & Gotchas

## Purpose

This document captures every significant pitfall, SDK quirk, architecture decision, and debugging lesson from building the Clearwater Bank Salesforce Personalization demo end-to-end. Each entry cost hours to diagnose. Reading this document first saves the next team from repeating them.

---

## SDK & Sitemap Gotchas

### 1. Use `initSitemap()` — not `mcis.setPageType()`

**What went wrong:** Initial sitemap used the legacy `mcis.setPageType()` API from Interaction Studio (MCP).

**Fix:** Salesforce Personalization (Data 360) uses a different SDK API. The correct pattern is `SalesforceInteractions.initSitemap({ pageTypes: [...] })` inside an `init().then()` callback. Custom events use `SalesforceInteractions.sendEvent()`, not `mcis.trackEvent()`.

**Rule:** If any documentation mentions `mcis` or `Evergage`, it's legacy Interaction Studio — not applicable to the current Data 360 SDK.

---

### 2. `file://` protocol blocks the SDK

**What went wrong:** Opened the HTML file directly from Windows Explorer. SDK cookie (`_sfid`) couldn't be set.

**Fix:** Must serve from `localhost` via `python -m http.server 3000`. The SDK requires HTTP/HTTPS for cookie operations.

**Console clue:** `[WARN]: Web SDK cookie (_sfid) could not be set. This is possibly due to a restricted top level domain.`

---

### 3. Empty `consents: []` blocks ALL events

**What went wrong:** Initialized the SDK with an empty consent array thinking it meant "no consent needed."

**Fix:** Empty array = "no consent given" = all events blocked. Must include explicit consent: `consents: [{ provider: "...", purpose: "Tracking", status: SalesforceInteractions.ConsentStatus.OptIn }]`.

**Console clue:** Events show as "Sent" but "Events translated for Data Cloud: []" is empty.

---

### 4. `SalesforceInteractions` is NOT on `window`

**What went wrong:** Tried accessing `window.SalesforceInteractions` from the website code. Returned undefined.

**Fix:** The SDK global only exists inside the sitemap execution context. Signal readiness to the website via a flag: `window.__cwSDKReady = true` set inside the sitemap's `init().then()` callback.

---

### 5. SPA hash navigation is NOT auto-detected

**What went wrong:** Changed URL hash from `#home` to `#mortgage` — SDK didn't fire a new page view event.

**Fix:** `initSitemap` evaluates page types on initial load only. For SPAs, create a `navigateTo()` function that manually calls `sendEvent()` and `Personalization.fetch()` on every hash change.

---

### 6. "Identity" is a reserved event type

**What went wrong:** Used `interaction.name: "Identity"` in `sendEvent()` to send identity data.

**Fix:** "Identity" is a profile-only event type. The SDK rejects it with: `[ERROR]: The eventType "Identity" is a profile-only event type and cannot be used in the interaction block. Use user.attributes.eventType instead.`

**Correct pattern:** Profile events use `user.attributes.eventType: "identity"` combined with an `interaction` block (e.g., `interaction.name: "User_Authenticated"`). The SDK splits this into two Data Cloud events: one engagement + one profile.

---

### 7. Profile events need an `interaction` block

**What went wrong:** Sent `sendEvent()` with only `user.attributes` and no `interaction` block. Events appeared in Console as translated but never created data stream records.

**Fix:** Per the Salesforce developer blog, a single `sendEvent()` with both `interaction` and `user.attributes` triggers multiple Data 360 events. The interaction block creates the engagement event; the `user.attributes.eventType` creates the profile event. Without the interaction block, the event may not be processed.

---

### 8. `emailAddress` vs `email` — field name mismatch

**What went wrong:** Sitemap sent `user.attributes.emailAddress` but the recommended schema's contactPointEmail event has a field named `email`. Events were ingested but the email value was dropped (field name didn't match).

**Fix:** Changed to `email` in the sitemap. Always validate SDK field names against the actual schema field names before uploading.

**Rule:** Check the schema JSON for exact `developerName` values. Don't assume the SDK uses the same names as the schema.

---

### 9. `isAnonymous` is required but not auto-populated

**What went wrong:** Identity events were rejected with "Required field(s) missing for event type." The recommended schema marks `isAnonymous` as required, but the SDK doesn't auto-populate it.

**Fix:** Explicitly include `isAnonymous: "false"` in every identity profile event.

---

### 10. Custom interaction names change catalog field flattening

**What went wrong:** Replaced the SDK constant `CatalogObjectInteractionName.ViewCatalogObject` with a custom string `"catalog-object-view-start"`. The translated event changed field names from `type`/`id` to `catalogObjectType`/`catalogObjectId` — breaking the schema mapping.

**Fix:** Must use the SDK constant for catalog events. It controls how `catalogObject` properties are flattened into the event payload. Custom names produce different field names that don't match the recommended schema.

**Rule:** Never replace SDK constants with custom strings for standard event types (catalog, cart, order). Use custom names only for genuinely custom events (ApplicationStart, ArticleClick).

---

## Data Cloud Gotchas

### 11. Schema upload format

**What went wrong:** Tried uploading schema as `{"events": [...]}` and as a bare array `[...]`. Both rejected.

**Fix:** Must be `{"records": [...]}`. No metadata fields (`availabilityStatus`, `fieldCount`, `isCurrencyIsoCode`) in the upload — those are read-only system fields.

---

### 12. Streaming CIs cannot be edited after creation

**What went wrong:** Created a real-time CI with wrong filter values. Tried to edit — blocked because streaming CIs are immutable.

**Fix:** Delete and recreate with correct values. Real-time CIs have no historical data to preserve, so deletion is safe. But you must re-add the new CI to the profile data graph and update all targeting rules that reference it.

---

### 13. CI queries require IDR to have run

**What went wrong:** CI returned 0 even though Product Browse Engagement DMO had records. Query Studio confirmed data existed.

**Fix:** The CI query joins through `IndividualIdentityLink` (Unified Individual → IndividualIdentityLink → Individual → engagement DMO). Without IDR creating the link, the JOIN returns zero. Must run IDR before CI produces output.

---

### 14. Real-time IDR: email match = instant, Device to Known = batch

**What went wrong:** Expected the Device to Known rule to create `IndividualIdentityLink` records in real-time for anonymous visitors. Records only appeared after batch IDR run.

**Documentation says:** "Real-time identity resolution is supported on exact match and exact normalized matching for emails and phone numbers." Device to Known uses Identity Match DMO — documentation does not explicitly confirm real-time support for this rule type.

**Practical impact:** Anonymous visitors who never identify themselves rely on batch IDR for CI-based personalization to work. Visitors who submit a form or log in (email identity event) get real-time matching.

**Design principle:** Design personalization so that anonymous visitors get meaningful default content (no CI dependency). CI-based decisions activate after the visitor identifies themselves, which triggers real-time email-based IDR.

---

### 15. IDR ruleset must match Basic Settings

**What went wrong:** Had two IDR rulesets. The profile data graph used one; the CI referenced the other's Unified Individual. CI returned 0.

**Fix:** Setup → Basic Settings → Identity Resolution Rulesets → must point to the same Unified Individual used by your profile data graph. Only one active ruleset per object per data space is recommended.

---

### 16. KQ (Key Qualifier) and segmentation

**What went wrong:** Segmentation returned 0 even though Query Studio JOINs worked. Suspected KQ mismatch.

**Finding:** Both KQs were NULL, and IDs matched. `NULL IS NOT DISTINCT FROM NULL` evaluates to TRUE — so KQ was NOT the issue. The actual problem was IDR not having run (see #13).

**Rule:** If segmentation returns 0 but Query Studio works, check IDR first. KQ issues are real but less common than missing IDR links.

---

### 17. `catalogObject.type` is the product CATEGORY, not a label

**What went wrong:** Set `catalogObject.type: "Product"` for all catalog events. All Product Browse Engagement records had Product Category Name = "Product" — making it impossible to distinguish home loans from investments in CIs.

**Fix:** Set `type` to the actual product category: `"Home Loan"`, `"Investment"`, etc. This value flows to the `Product Category Name` field on Product Browse Engagement DMO and is what CIs filter on.

---

## Personalization Gotchas

### 18. Merge field sort order matters

**What went wrong:** A merge field on `Individual > First Name` with ascending sort order returned "Michael" when the visitor was Sarah. Both names existed on Individual records linked to the same Unified Individual (from testing with multiple demo personas).

**Fix:** Changed sort order to Created Date Descending — picks the most recently identified name. In production this isn't an issue (one person = one name), but in testing environments with multiple test identities, sort order affects which value the merge field resolves to.

---

### 19. Shared personalization points across pages inherit the same content

**What went wrong:** PDP_Infobar was shared between the Mortgage Detail and Investment Detail pages. The decision content mentioned "home loan rate" — which made no sense on the investment page.

**Fix:** Either make the content product-agnostic ("personalized rate" instead of "home loan rate") or create separate personalization points per page. Shared points require generic content.

---

### 20. Default decisions are essential — not optional

**What went wrong:** Tested personalization without a Default decision. New visitors with no behavioral data saw "User did not qualify" in the Console and an empty personalization response.

**Fix:** Every personalization point needs a Default decision with targeting rule "Always (No Rules)" as the lowest priority. Visitors should never see a blank space.

---

### 21. Recommender needs DMO relationship, not just matching IDs

**What went wrong:** The Application Engagement DMO's `Product` field stored the same product IDs as the Goods Product DMO's `Product ID` field. But the recommender couldn't find engagement signals because there was no formal relationship between the two DMOs.

**Fix:** Added a Lookup Relationship field on Application Engagement pointing to Goods Product DMO. Plain text fields with matching values don't constitute navigable relationships in Data Cloud.

---

### 22. Website must explicitly render live data

**What went wrong:** Salesforce Personalization returned decision content in the Console (visible as JSON), but the website showed mock content. The SDK delivers the response, but the website code must read it and render it.

**Fix:** Added `useLivePoint` hook that listens for `clearwater:refresh` events, reads from `window.__cwPersonalizationData`, and overrides mock content with live attributes. Every zone needs this hook — Salesforce doesn't inject content into the DOM (unless using WPM).

---

## Architecture Decisions

### 23. CIs vs Segments for web personalization

**Decision:** CIs are sufficient for website personalization targeting rules. Segments are not needed for real-time web decisions.

**Rationale:** CIs produce per-individual numeric values in real-time. Targeting rules compare these values (≥ 3, ≥ 2) to make decisions. Segments add latency (batch processing) and are designed for audience definitions, not per-visitor thresholds.

**When segments ARE needed:** MC Next flows (segment-triggered), batch personalization, DMO activations, cross-channel targeting.

---

### 24. SDK constant vs custom interaction names

**Decision:** Use SDK constants (`CatalogObjectInteractionName.ViewCatalogObject`) for standard catalog events. Use custom names only for genuinely custom events.

**Rationale:** The SDK constant controls field flattening behavior. `ViewCatalogObject` produces `type`, `id`, `attributeName`. A custom name produces `catalogObjectType`, `catalogObjectId`, `catalogObjectAttributesName`. The recommended schema expects the standard field names.

---

### 25. One form, multiple events

**Decision:** A single form submission fires 3-4 separate `sendEvent` calls: identity, contactPointEmail, contactPointPhone (if provided), and ApplicationStart.

**Rationale:** Each event type feeds a different data stream and DMO. There's no way to send all data in one event — the SDK routes data by `eventType`. Profile events go to profile data streams; engagement events go to behavioral data streams.
