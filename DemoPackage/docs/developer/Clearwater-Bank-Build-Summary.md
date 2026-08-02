# Clearwater Bank — Build Summary (Updated)

**Last Updated:** August 2026
**Status:** Demo environment fully operational

---

## What Was Built

### Website
- Standalone HTML demo site with 5 pages: Home, Home Loans Hub, Mortgage Detail, Investment Detail, Online Banking Dashboard
- 5 switchable visitor personas with identity event support
- Salesforce Interactions SDK integration with live personalization rendering
- 11 live rendering zones across all pages using useLivePoint hook
- Pre-qualification form firing 4 events to 4 data streams
- Personalization zone overlay toggle showing decision metadata
- AWAC chat widget with scripted responses

### Data Cloud
- Web connector with recommended schema (14 events)
- 6 data streams with DLO-to-DMO mappings
- Custom Application Engagement DMO with Goods Product lookup
- 16 financial products in Goods Product DMO
- Identity Resolution with 3 recommended rules

### Data Graphs
- Real-Time Profile: Unified Individual → Individual → Contact Points, Engagement DMOs, CIs
- Standard Item: Goods Product (6 fields)

### Engagement Signals (5)
- ProductView, ProductClick, ApplicationStart, ArticleClick, CalculatorEngagement

### Calculated Insights (5)
- HomeLoan_Views, Investment View Count, Application Start Count, Article Click Count, Product Category View Count

### Content Schemas (6)
- Banner, Promo, Infobar, CTA Card, Life Event Tile, Product Recommendation

### Personalization Points (16)
- 10 Dynamic Content points (27 decisions total)
- 6 Recommendation points (including 1 A/B experiment)

### Recommenders (4)
- Most Viewed Products (rule-based, fallback)
- Personalized Products Max Applications (objective-based, training)
- Dashboard Next Best Product (objective-based, training)
- Complementary Products (rule-based)

---

## All Deliverable Files (20 files)

### Website & SDK (4 files)
- clearwater-bank.html — Demo website with live rendering
- clearwater-sitemap.js — Data 360 sitemap
- clearwater-schema.json — Web connector schema
- clearwater-products.csv — Product catalog

### Client-Facing Assets (5 files)
- Clearwater-Bank-Personalization-Capability-Deck.pptx — 14-slide deck
- Clearwater-Demo-Talk-Track.md — Scripted demo walkthrough
- Clearwater-Use-Case-Catalog.md — 8 use cases
- Clearwater-ROI-Framework.md — Value drivers and KPIs
- Clearwater-Bank-Project-Assets.md — Asset inventory

### Developer-Facing Assets (11 files)
- Clearwater-Bank-Build-Summary.md — This document
- Clearwater-Bank-DLO-to-DMO-Mapping-Guide.md — Field mappings
- Clearwater-All-Decision-Content.md — 27 decision content values
- Clearwater-Recommender-Build-Guide.md — 4 recommender instructions
- Clearwater-Recommendation-Points-Guide.md — 6 point instructions
- Clearwater-Testing-Guide.md — 14-test validation
- Clearwater-Lessons-Learned.md — 25 gotchas
- Clearwater-Setup-Runbook.md — 13-phase reproduction guide
- Clearwater-Bank-Personalization-Gap-Analysis.md — Coverage analysis
- Sitemap-Implementation-Guide.md — Real implementation guide
- ClearwaterBank.jsx — React artifact (mock only)
