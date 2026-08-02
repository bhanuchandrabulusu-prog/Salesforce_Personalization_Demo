// ═══════════════════════════════════════════════════════════════════════════════
// CLEARWATER BANK — SALESFORCE DATA 360 SITEMAP (v3)
// ═══════════════════════════════════════════════════════════════════════════════
// Salesforce Interactions SDK APIs used:
//   - SalesforceInteractions.init()         → initialize SDK
//   - SalesforceInteractions.initSitemap()  → register page types
//   - SalesforceInteractions.sendEvent()    → fire custom events
//   - SalesforceInteractions.Personalization.fetch() → request decisions
//   - SalesforceInteractions.CatalogObjectInteractionName → catalog events
// ═══════════════════════════════════════════════════════════════════════════════


// ── INTERNAL HELPER ─────────────────────────────────────────────────────────
function _dispatchPersonalization(page, response) {
  window.dispatchEvent(
    new CustomEvent("clearwater:personalization", {
      detail: { page: page, response: response },
    })
  );
}


// ── INITIALIZE SDK ──────────────────────────────────────────────────────────
SalesforceInteractions.init({
  consents: [{
    provider: "Clearwater Bank Demo",
    purpose: "Tracking",
    status: SalesforceInteractions.ConsentStatus.OptIn
  }],
  personalization: {
    dataspace: "default",
  },
}).then(function() {

  console.log("[Clearwater Sitemap] ✓ SDK initialized.");

  // Signal to the HTML page that the SDK is ready
  // (SalesforceInteractions is not on window — only available in sitemap context)
  window.__cwSDKReady = true;
  window.dispatchEvent(new Event("clearwater:sdk-ready"));

  SalesforceInteractions.setLoggingLevel(4);


  // ═══════════════════════════════════════════════════════════════════════════
  // SITEMAP CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════

  SalesforceInteractions.initSitemap({

    // ── GLOBAL CONFIG ───────────────────────────────────────────────────────
    // Profile attributes defined globally apply to EVERY page type.
    // When email is available (visitor authenticated), the SDK automatically
    // generates identity and contactPointEmail profile events alongside
    // the engagement event — these feed the Identity and Contact Point Email
    // data streams.
    global: {
      user: {
        attributes: {
          email: function() {
            return window.sessionStorage.getItem("clearwater_email") || undefined;
          },
          firstName: function() {
            return window.sessionStorage.getItem("clearwater_firstName") || undefined;
          },
          lastName: function() {
            return window.sessionStorage.getItem("clearwater_lastName") || undefined;
          },
        },
      },
    },

    // ── PAGE TYPES ──────────────────────────────────────────────────────────
    pageTypes: [

      // ── HOME PAGE ─────────────────────────────────────────────────────────
      {
        name: "home",

        isMatch: function() {
          return !window.location.hash || window.location.hash === "#home";
        },

        interaction: {
          name: "View_Home_Page",
        },

        onRender: function() {
          SalesforceInteractions.Personalization.fetch([
            "Homepage_Hero_Banner",
            "Homepage_Personalized_For_You",
            "Homepage_Life_Event_Module",
            "Homepage_Promo_Bar",
          ])
            .then(function(response) { _dispatchPersonalization("home", response); })
            .catch(function(err) { console.warn("[Clearwater Sitemap] homepage fetch error:", err); });
        },
      },

      // ── HOME LOANS HUB ────────────────────────────────────────────────────
      {
        name: "solution",

        isMatch: function() {
          return window.location.hash === "#loans";
        },

        interaction: {
          name: "View_Home_Loans_Hub",
        },

        onRender: function() {
          SalesforceInteractions.Personalization.fetch([
            "Hub_Hero_Banner",
            "Hub_Product_Spotlight",
            "Hub_Calculator_Prompt",
          ])
            .then(function(response) { _dispatchPersonalization("loans", response); })
            .catch(function(err) { console.warn("[Clearwater Sitemap] loans fetch error:", err); });
        },
      },

      // ── MORTGAGE PRODUCT DETAIL ───────────────────────────────────────────
      {
        name: "product",

        isMatch: function() {
          return window.location.hash === "#mortgage";
        },

        interaction: {
          name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
          catalogObject: {
            type: "Home Loan",
            id: function() { return "clearwater-variable-home-loan"; },
            attributes: {
              name: function() { return "Clearwater Variable Home Loan"; },
            },
          },
        },

        onRender: function() {
          SalesforceInteractions.Personalization.fetch([
            "PDP_Offer_Badge",
            "PDP_Infobar",
            "PDP_Application_Nudge",
            "PDP_You_May_Also_Consider",
            "PDP_Complementary_Products",
          ])
            .then(function(response) { _dispatchPersonalization("mortgage", response); })
            .catch(function(err) { console.warn("[Clearwater Sitemap] mortgage fetch error:", err); });
        },
      },

      // ── ONLINE BANKING DASHBOARD ──────────────────────────────────────────
      {
        name: "account",

        isMatch: function() {
          return window.location.hash === "#dashboard";
        },

        interaction: {
          name: "View_Dashboard",
        },

        onRender: function() {
          SalesforceInteractions.Personalization.fetch([
            "Dashboard_Next_Best_Product",
            "Dashboard_Relationship_Banner",
            "Dashboard_Life_Event_Prompt",
          ])
            .then(function(response) { _dispatchPersonalization("dashboard", response); })
            .catch(function(err) { console.warn("[Clearwater Sitemap] dashboard fetch error:", err); });
        },
      },

    ],

  });

  console.log("[Clearwater Sitemap] ✓ initSitemap called. Page types registered.");


  // ═══════════════════════════════════════════════════════════════════════════
  // CUSTOM EVENT TRACKING
  // ═══════════════════════════════════════════════════════════════════════════

  window.clearwaterTrack = {

    // ── SPA Navigation ────────────────────────────────────────────────────
    // Call this from React when the user navigates between pages.
    // The SDK's initSitemap only evaluates isMatch on initial load —
    // for SPA hash navigation we need to manually send the page view
    // event and fetch personalization decisions for the new page.
    navigateTo: function(page) {
      var pageConfig = {
        home:       { name: "View_Home_Page",         pageType: "home",     fetchPoints: ["Homepage_Hero_Banner","Homepage_Personalized_For_You","Homepage_Life_Event_Module","Homepage_Promo_Bar"] },
        loans:      { name: "View_Home_Loans_Hub",    pageType: "solution", fetchPoints: ["Hub_Hero_Banner","Hub_Product_Spotlight","Hub_Calculator_Prompt"] },
        mortgage:   { name: "View_Mortgage_Detail",   pageType: "product",  fetchPoints: ["PDP_Offer_Badge","PDP_Infobar","PDP_Application_Nudge","PDP_You_May_Also_Consider","PDP_Complementary_Products"] },
        investment: { name: "View_Investment_Detail",  pageType: "product",  fetchPoints: ["PDP_Offer_Badge","PDP_Infobar","PDP_You_May_Also_Consider"] },
        dashboard:  { name: "View_Dashboard",          pageType: "account",  fetchPoints: ["Dashboard_Next_Best_Product","Dashboard_Relationship_Banner","Dashboard_Life_Event_Prompt"] },
      };

      var config = pageConfig[page];
      if (!config) return;

      // Send page view event
      var eventPayload = {
        interaction: {
          name: config.name,
        },
      };

      // For mortgage page, add catalog object
      if (page === "mortgage") {
        eventPayload.interaction.name = SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject;
        eventPayload.interaction.catalogObject = {
          type: "Home Loan",
          id: "clearwater-variable-home-loan",
          attributes: {
            name: "Clearwater Variable Home Loan",
          },
        };
      }

      // For investment page, add catalog object with Investment type
      if (page === "investment") {
        eventPayload.interaction.name = SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject;
        eventPayload.interaction.catalogObject = {
          type: "Investment",
          id: "clearwater-term-deposit",
          attributes: {
            name: "Clearwater Term Deposit",
          },
        };
      }

      SalesforceInteractions.sendEvent(eventPayload);
      // Log the ACTUAL event name being sent, not the config name
      var actualName = config.name;
      if (page === "mortgage") actualName = "ViewCatalogObject (type: Home Loan, id: clearwater-variable-home-loan)";
      if (page === "investment") actualName = "ViewCatalogObject (type: Investment, id: clearwater-term-deposit)";
      console.log("[Clearwater] Page view →", page, actualName);

      // Fetch personalization decisions for the new page
      if (config.fetchPoints.length > 0) {
        SalesforceInteractions.Personalization.fetch(config.fetchPoints)
          .then(function(response) { _dispatchPersonalization(page, response); })
          .catch(function(err) { console.warn("[Clearwater] Fetch error for", page, err); });
      }
    },

    // ── ApplicationStart ──────────────────────────────────────────────────
    applicationStart: function(productId, productCategory) {
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "ApplicationStart",
          eventType: "ApplicationStart",
          catalogObject: {
            type: productCategory || "Home Loan",
            id: productId || "clearwater-variable-home-loan",
          },
        },
      });
      console.log("[Clearwater] ApplicationStart →", productId, productCategory);
    },

    // ── Form Submit (Pre-Qualification) ─────────────────────────────────
    // Fires multiple events from a single form submission:
    //   1. Identity profile event (firstName, lastName, email, isAnonymous)
    //   2. Contact Point Email profile event (email)
    //   3. Contact Point Phone profile event (phoneNumber) — if provided
    //   4. ApplicationStart engagement event (productId, loanAmount as status)
    //
    // Each event type feeds a different data stream:
    //   identity → Identity data stream → Individual DMO
    //   contactPointEmail → Contact Point Email data stream → Contact Point Email DMO
    //   contactPointPhone → Contact Point Phone data stream → Contact Point Phone DMO
    //   ApplicationStart → Behavioral Events data stream → Application Engagement DMO
    formSubmit: function(formData) {
      if (!formData || !formData.email || !formData.firstName) {
        console.warn("[Clearwater] formSubmit requires at least email and firstName");
        return;
      }

      // Store in session for global user attributes on subsequent page views
      window.sessionStorage.setItem("clearwater_email", formData.email);
      window.sessionStorage.setItem("clearwater_firstName", formData.firstName);
      if (formData.lastName) window.sessionStorage.setItem("clearwater_lastName", formData.lastName);

      // 1. Identity profile event → Identity data stream
      SalesforceInteractions.sendEvent({
        interaction: { name: "Form_Submission" },
        user: {
          attributes: {
            eventType: "identity",
            firstName: formData.firstName,
            lastName: formData.lastName || "",
            email: formData.email,
            isAnonymous: "false",
          },
        },
      });
      console.log("[Clearwater] Form → identity event:", formData.firstName, formData.lastName, formData.email);

      // 2. Contact Point Email profile event → Contact Point Email data stream
      SalesforceInteractions.sendEvent({
        interaction: { name: "Form_Submission" },
        user: {
          attributes: {
            eventType: "contactPointEmail",
            email: formData.email,
          },
        },
      });
      console.log("[Clearwater] Form → contactPointEmail event:", formData.email);

      // 3. Contact Point Phone profile event → Contact Point Phone data stream
      //    Only fires if phone number was provided
      if (formData.phone) {
        SalesforceInteractions.sendEvent({
          interaction: { name: "Form_Submission" },
          user: {
            attributes: {
              eventType: "contactPointPhone",
              phoneNumber: formData.phone,
            },
          },
        });
        console.log("[Clearwater] Form → contactPointPhone event:", formData.phone);
      }

      // 4. ApplicationStart engagement event → Application Engagement DMO
      //    loanAmount stored in applicationStatus field (available in schema)
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "ApplicationStart",
          eventType: "ApplicationStart",
          catalogObject: {
            type: formData.productCategory || "Home Loan",
            id: formData.productId || "clearwater-variable-home-loan",
          },
          applicationStatus: formData.loanAmount || "",
        },
      });
      console.log("[Clearwater] Form → ApplicationStart event:", formData.productId, "loanAmount:", formData.loanAmount);

      console.log("[Clearwater] ✓ Form submission complete. 3-4 events fired across Identity, Contact Point Email, Contact Point Phone, and Application Engagement data streams.");
    },

    // ── CalculatorEngagement ──────────────────────────────────────────────
    calculatorEngagement: function(calculatorType) {
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "CalculatorEngagement",
          eventType: "CalculatorEngagement",
        },
      });
      console.log("[Clearwater] CalculatorEngagement →", calculatorType);
    },

    // ── Product Click ─────────────────────────────────────────────────────
    productClick: function(productId, productCategory) {
      SalesforceInteractions.sendEvent({
        interaction: {
          name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
          catalogObject: {
            type: productCategory || "Product",
            id: productId,
          },
        },
      });
      console.log("[Clearwater] catalog-object-click →", productId, productCategory);
    },

    // ── Identity / Login ──────────────────────────────────────────────────
    identifyUser: function(email, firstName, lastName) {
      if (!email) return;
      window.sessionStorage.setItem("clearwater_email", email);
      if (firstName) window.sessionStorage.setItem("clearwater_firstName", firstName);
      if (lastName) window.sessionStorage.setItem("clearwater_lastName", lastName);

      // Per Salesforce blog: combine interaction + user.attributes in ONE call.
      // The SDK splits this into TWO Data 360 events:
      //   1. Engagement event from the interaction block
      //   2. Profile event from user.attributes.eventType
      // Sending user.attributes WITHOUT an interaction block may not work.

      // Identity + engagement event
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "User_Authenticated",
        },
        user: {
          attributes: {
            eventType: "identity",
            firstName: firstName || "",
            lastName: lastName || "",
            email: email,
            isAnonymous: "false",
          },
        },
      });

      // ContactPointEmail + engagement event
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "User_Authenticated",
        },
        user: {
          attributes: {
            eventType: "contactPointEmail",
            email: email,
          },
        },
      });

      console.log("[Clearwater] Identity + ContactPointEmail →", email, firstName, lastName);
    },

    // ── Article Click ─────────────────────────────────────────────────────
    articleClick: function(articleId, articleTopic) {
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "ArticleClick",
          eventType: "ArticleClick",
        },
      });
      console.log("[Clearwater] ArticleClick →", articleId, articleTopic);
    },

  };

  console.log("[Clearwater Sitemap] ✓ Custom event tracking registered.");

}).catch(function(err) {
  console.error("[Clearwater Sitemap] ✗ SDK init failed:", err);
});
