import { useState, useRef, useEffect } from "react";
import {
  ChevronRight, ChevronDown, Send, Eye, EyeOff, User,
  Building2, Star, Home, CheckCircle, Shield, Calculator,
  Bot, X, Bell, Sparkles, Lock, Layers
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────
const C = {
  navy:     "#0F2A4A",
  blue:     "#1B6CA8",
  blueMid:  "#2382C6",
  blueLt:   "#EEF5FD",
  gold:     "#B8952A",
  goldLt:   "#FDF8EE",
  slate:    "#64748B",
  slateLt:  "#94A3B8",
  bg:       "#F4F7FB",
  white:    "#FFFFFF",
  green:    "#059669",
  greenLt:  "#ECFDF5",
  border:   "#E2E8F0",
  purple:   "#7C3AED",
  purpleLt: "#F5F3FF",
  text:     "#1E293B",
  textMd:   "#475569",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

// ─── Personas ─────────────────────────────────────────────────────────
const PERSONAS = [
  { id: "prospect", label: "New Prospect",      Icon: User,        color: C.slate,  bg: "#F1F5F9", desc: "Anonymous visitor — first visit, no account",   segment: "New Prospect" },
  { id: "mortgage", label: "Mortgage Seeker",   Icon: Home,        color: C.blue,   bg: C.blueLt,  desc: "Viewed home loan pages 4× this week",            segment: "Active Mortgage Seeker (RT)" },
  { id: "premier",  label: "Premier Customer",  Icon: Star,        color: C.gold,   bg: C.goldLt,  desc: "Sarah Chen · Premier Tier · $450k AUM",          segment: "Wealth Customer" },
  { id: "existing", label: "Existing Customer", Icon: CheckCircle, color: C.green,  bg: C.greenLt, desc: "Michael Torres · Checking Account holder",        segment: "Existing Retail Customer" },
  { id: "business", label: "Business Owner",    Icon: Building2,   color: C.purple, bg: C.purpleLt,desc: "Apex Solutions Pty Ltd",                          segment: "Business Customer" },
];

// ─── Personalised Content per Persona ────────────────────────────────
const HERO = {
  prospect: { eyebrow:"Welcome to Clearwater Bank", headline:"Banking built\naround your life.", sub:"From everyday accounts to home loans and investments — find the right product for your life today.", cta:"Explore Accounts", cta2:"See All Products", decision:"Default — New Visitor Welcome", rule:"Always (No Conditions)", featured:{ label:"Most Popular", name:"Everyday Savings", rate:"5.10%", unit:"p.a.", type:"Savings Account" } },
  mortgage: { eyebrow:"🏠 Home Loan Spotlight", headline:"Your home is closer\nthan you think.", sub:"Rates from 5.89% p.a. Pre-qualify in minutes. Our home loan specialists are ready when you are.", cta:"Get Pre-Qualified", cta2:"Calculate Repayments", decision:"Mortgage Intent High", rule:"Segment: Active Mortgage Seeker", featured:{ label:"Recommended for You", name:"First Home Buyer Package", rate:"5.89%", unit:"p.a.", type:"Home Loan" } },
  premier:  { eyebrow:"Clearwater Premier ✦", headline:"Your wealth,\nguided by expertise.", sub:"Exclusive investment portfolios, a dedicated relationship manager, and priority access for Premier members.", cta:"Talk to Your Advisor", cta2:"View Your Portfolio", decision:"Wealth Management Existing", rule:"Segment: Wealth Customer", featured:{ label:"Premier Exclusive", name:"Investment Portfolio", rate:"Managed", unit:"returns", type:"Wealth Management" } },
  existing: { eyebrow:"Welcome back, Michael", headline:"Make the most of\nyour relationship.", sub:"You're already with us — adding a savings account takes 3 minutes and earns you interest from day one.", cta:"See Your Offers", cta2:"Go to Dashboard", decision:"Existing Retail Customer", rule:"Direct Attr: Customer Status = Active", featured:{ label:"Your Next Offer", name:"Clearwater Savings", rate:"5.35%", unit:"p.a.*", type:"Loyalty Rate" } },
  business: { eyebrow:"Clearwater Business Banking", headline:"Built for the way\nyou do business.", sub:"Business loans from 6.20% p.a., merchant services, and dedicated support for growing businesses.", cta:"Explore Business Banking", cta2:"Speak to a Specialist", decision:"Business Banking Customer", rule:"Segment: Business Customer", featured:{ label:"Recommended for Apex", name:"Business Growth Loan", rate:"6.20%", unit:"p.a.", type:"Business Loan" } },
};

const PROMO = {
  prospect: null,
  mortgage: "🏠  Limited offer: Home loan rates from 5.89% p.a. — lock in today before rates change.",
  premier:  "✦  Premier: Your Q3 portfolio review is ready. Your advisor has availability this week.",
  existing: "✓  As a Clearwater customer, you qualify for our loyalty savings rate of 5.35% p.a.",
  business: "🏢  Business Growth Loans — no establishment fee until 31 August. Terms apply.",
};

const FOR_YOU = {
  prospect: [
    { name:"Everyday Savings",      type:"Savings",         rate:"5.10% p.a.",      tag:"Most Popular",       tagColor:C.green  },
    { name:"Clearwater Home Loan",  type:"Home Loan",       rate:"From 5.89%",      tag:"Low Rate",           tagColor:C.blue   },
    { name:"Visa Classic Card",     type:"Credit Card",     rate:"0% for 12 months",tag:"Intro Offer",        tagColor:C.purple },
  ],
  mortgage: [
    { name:"First Home Buyer Package",  type:"Home Loan",   rate:"5.89% p.a.",      tag:"⭐ Recommended",     tagColor:C.blue   },
    { name:"Home Loan Pre-Approval",    type:"Home Loan",   rate:"Free — instant",  tag:"Fast Track",         tagColor:C.navy   },
    { name:"Offset Mortgage",           type:"Home Loan",   rate:"5.95% p.a.",      tag:"Save More",          tagColor:C.blueMid},
  ],
  premier:  [
    { name:"Premier Investment Portfolio", type:"Wealth",   rate:"Managed returns", tag:"✦ Exclusive",        tagColor:C.gold   },
    { name:"Term Deposit — Enhanced",      type:"Term Dep.",rate:"5.40% p.a.",      tag:"Premier Rate",       tagColor:C.gold   },
    { name:"Platinum Visa",                type:"Credit Card",rate:"$0 annual fee", tag:"Premier Benefit",    tagColor:C.navy   },
  ],
  existing: [
    { name:"Clearwater Savings Account",  type:"Savings",   rate:"5.35% p.a.*",     tag:"⭐ For Michael",     tagColor:C.green  },
    { name:"Home Loan — Loyalty Rate",    type:"Home Loan", rate:"5.79% p.a.*",     tag:"Your Rate",          tagColor:C.blue   },
    { name:"Personal Loan",               type:"Personal",  rate:"From 8.99%",      tag:"Pre-Assessed",       tagColor:C.purple },
  ],
  business: [
    { name:"Business Growth Loan",        type:"Biz Loan",  rate:"From 6.20%",      tag:"⭐ For Apex",        tagColor:C.purple },
    { name:"Business Transaction Acct",   type:"Biz Acct.", rate:"No monthly fees", tag:"Essential",          tagColor:C.navy   },
    { name:"Business Visa Card",          type:"Biz Credit",rate:"55 days free",    tag:"1.5% Cashback",      tagColor:C.blue   },
  ],
};

const LIFE_TILE = {
  prospect: { icon:"🏠", pre:"First Home Buyer?",       title:"Our step-by-step guide walks you through buying your first home.",  cta:"Read the Guide",          decision:"Default Life Event",             rule:"Always (fallback)" },
  mortgage: { icon:"🧮", pre:"Know your numbers",        title:"Calculate your repayments and see what you can afford in under 2 minutes.", cta:"Open Calculator", decision:"Life Event: Mortgage Calc Nudge", rule:"Segment: Active Mortgage Seeker" },
  premier:  { icon:"📈", pre:"Q3 Portfolio Review",      title:"Your quarterly investment summary is ready. See how your portfolio performed.", cta:"View Summary",  decision:"Life Event: Wealth Review",      rule:"Segment: Wealth Customer" },
  existing: { icon:"💰", pre:"A smarter way to save",    title:"Clearwater customers with a linked savings account save $3,200 more per year on average.", cta:"Open Savings Account", decision:"Life Event: Cross-Sell Savings", rule:"Segment: Existing, No Savings Product" },
  business: { icon:"📊", pre:"Cash flow insights",       title:"See how Clearwater Business helps 12,000+ Australian businesses manage cash flow and grow.", cta:"Watch the Demo", decision:"Life Event: Business Growth",   rule:"Segment: Business Customer" },
};

const MORTGAGE_CTA = {
  prospect: { badge:null,                     infobar:null,  ctaLabel:"Explore This Loan →",          ctaStyle:"soft",   decision:"Default — General Prospect",         rule:"Always (fallback)" },
  mortgage: { badge:"⭐ Recommended for You",  infobar:null,  ctaLabel:"Get Pre-Qualified Now →",      ctaStyle:"strong", decision:"Mortgage Intent High — Strong CTA",   rule:"Segment: Active Mortgage Seeker" },
  premier:  { badge:"✦ Premier Rate Available",infobar:null,  ctaLabel:"Speak to Your Advisor →",      ctaStyle:"medium", decision:"Premier Loyalty Offer",              rule:"Segment: Wealth Customer" },
  existing: { badge:"✓ Loyalty Rate: 5.79% p.a.*", infobar:"Welcome back, Michael — as an existing Clearwater customer, you may qualify for our loyalty home loan rate. Your pre-assessment is ready.", ctaLabel:"View Your Loyalty Rate →", ctaStyle:"strong", decision:"Authenticated Existing Customer", rule:"Direct Attr: Customer Status = Active" },
  business: { badge:null,                     infobar:null,  ctaLabel:"Explore Business Loan Options →",ctaStyle:"soft",  decision:"Business Re-Route",                  rule:"Segment: Business Customer" },
};

const CROSS_SELL = {
  prospect: [{ name:"Everyday Savings",          rate:"5.10% p.a.",      type:"Savings Account"   }, { name:"Home & Contents Insurance", rate:"Bundle discount",  type:"Insurance"         }, { name:"Visa Classic Card",         rate:"0% for 12 months", type:"Credit Card"       }],
  mortgage: [{ name:"Offset Mortgage",           rate:"5.95% p.a.",      type:"Home Loan Variant" }, { name:"Home & Contents Insurance", rate:"Save $240/yr",     type:"Insurance"         }, { name:"Repayment Insurance",       rate:"From $12/month",   type:"Protection"        }],
  premier:  [{ name:"Premier Investment Portfolio",rate:"Managed returns",type:"Wealth"            }, { name:"Term Deposit — 5.40%",      rate:"Premier rate",     type:"Investment"        }, { name:"Platinum Visa",             rate:"$0 fee — benefit", type:"Credit Card"       }],
  existing: [{ name:"Clearwater Savings Account",rate:"5.35% p.a.*",     type:"Savings"           }, { name:"Repayment Insurance",       rate:"From $12/month",   type:"Protection"        }, { name:"Personal Loan",             rate:"From 8.99%",       type:"Personal Loan"     }],
  business: [{ name:"Business Growth Loan",       rate:"From 6.20%",      type:"Business Loan"     }, { name:"Business Transaction Acct", rate:"No fees",          type:"Account"           }, { name:"Merchant Services",         rate:"From 0.8% txn",    type:"Payments"          }],
};

const DASH_DATA = {
  premier: {
    name:"Sarah", tier:"Premier Member", tierColor:C.gold,
    accounts:[
      { label:"Premier Investment Portfolio", value:"$452,300", note:"+2.4% this quarter", pos:true  },
      { label:"Term Deposit",                 value:"$50,000",  note:"Matures in 47 days", pos:null  },
      { label:"Platinum Visa",                value:"$2,140 owing", note:"$18,000 limit",  pos:null  },
    ],
    nba:{ name:"SMSF Investment Account", desc:"Your portfolio size may unlock additional tax advantages via a self-managed super fund. Your advisor has flagged this for your next quarterly review.", cta:"Discuss with Advisor", decision:"Objective-Based: MaxAppStarts (Premier)", rule:"Segment: Wealth Customer + AUM > $400k" },
    tip:"Premier clients with an offset mortgage save an average of $14,200 over the life of their loan.",
  },
  existing: {
    name:"Michael", tier:"Everyday Banking", tierColor:C.blue,
    accounts:[
      { label:"Everyday Checking", value:"$4,280.50", note:"Last transaction: Today", pos:null },
    ],
    nba:{ name:"Clearwater Savings — 5.10% p.a.", desc:"Linking a savings account to your checking account takes 3 minutes and earns you interest from day one. Michael, you're pre-assessed and ready to apply.", cta:"Open in 3 Minutes", decision:"Rule-Based: Complementary to Checking", rule:"Segment: Existing Customer, No Savings Product" },
    tip:"Access your free credit score in the Clearwater app — no impact to your score, updated monthly.",
  },
};

// ─── Persona Zone Wrapper ─────────────────────────────────────────────
function PZone({ zoneName, pointName, decision, rule, children, show, style: outerStyle = {} }) {
  if (!show) return <div style={outerStyle}>{children}</div>;
  return (
    <div style={{ position:"relative", paddingTop:20, ...outerStyle }}>
      <div style={{ position:"absolute", top:3, left:14, zIndex:20, background:C.blue, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 12px", borderRadius:99, fontFamily:"monospace", letterSpacing:"0.07em", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5, boxShadow:"0 2px 6px rgba(27,108,168,0.35)" }}>
        <span>📍</span>{zoneName}
      </div>
      <div style={{ outline:`2px solid ${C.blue}`, outlineOffset:3, borderRadius:10, background:"rgba(27,108,168,0.035)" }}>
        {children}
        <div style={{ background:C.navy, padding:"7px 14px", display:"flex", gap:20, flexWrap:"wrap", borderTop:"1px solid rgba(255,255,255,0.07)", borderRadius:"0 0 8px 8px" }}>
          <span style={{ fontSize:10.5, fontFamily:"monospace" }}><span style={{ color:C.slateLt }}>point: </span><span style={{ color:"#E2E8F0" }}>{pointName}</span></span>
          <span style={{ fontSize:10.5, fontFamily:"monospace" }}><span style={{ color:C.slateLt }}>decision: </span><span style={{ color:"#FCD34D" }}>{decision}</span></span>
          <span style={{ fontSize:10.5, fontFamily:"monospace" }}><span style={{ color:C.slateLt }}>rule: </span><span style={{ color:"#86EFAC" }}>{rule}</span></span>
        </div>
      </div>
    </div>
  );
}

// ─── Demo Control Bar ─────────────────────────────────────────────────
function DemoBar({ persona, setPersona, showZones, setShowZones }) {
  const p = PERSONAS.find(x => x.id === persona);
  const Icon = p.Icon;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:C.navy, padding:"0 20px", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 10px rgba(0,0,0,0.3)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", gap:10, height:50 }}>
        <Layers size={14} color={C.slateLt} />
        <span style={{ fontSize:10.5, color:C.slateLt, fontWeight:700, letterSpacing:"0.07em", whiteSpace:"nowrap" }}>SALESFORCE PERSONALIZATION</span>
        <span style={{ fontSize:10, background:"rgba(27,108,168,0.7)", color:"#93C5FD", padding:"1px 8px", borderRadius:99 }}>DEMO</span>
        <div style={{ width:1, height:22, background:"rgba(255,255,255,0.1)", margin:"0 6px" }} />
        <span style={{ fontSize:11, color:C.slateLt, whiteSpace:"nowrap" }}>Visitor persona:</span>

        {/* Persona selector */}
        <div style={{ position:"relative" }}>
          <button onClick={() => setOpen(!open)} style={{ background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.14)", color:"#fff", borderRadius:7, padding:"4px 10px 4px 8px", display:"flex", alignItems:"center", gap:7, cursor:"pointer", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
            <div style={{ width:20, height:20, borderRadius:"50%", background:p.bg, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon size={11} color={p.color} /></div>
            {p.label}
            <ChevronDown size={11} style={{ opacity:0.6 }} />
          </button>
          {open && (
            <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, background:C.white, borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.2)", border:`1px solid ${C.border}`, minWidth:270, zIndex:200, overflow:"hidden" }}>
              {PERSONAS.map(px => {
                const Ic = px.Icon;
                return (
                  <button key={px.id} onClick={() => { setPersona(px.id); setOpen(false); }} style={{ width:"100%", padding:"11px 16px", background:persona === px.id ? px.bg : "#fff", border:"none", borderBottom:`1px solid ${C.border}`, cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:px.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Ic size={14} color={px.color} /></div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{px.label}</div>
                      <div style={{ fontSize:11, color:C.textMd }}>{px.desc}</div>
                    </div>
                    {persona === px.id && <CheckCircle size={13} color={C.green} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ fontSize:10.5, background:"rgba(27,108,168,0.45)", color:"#93C5FD", padding:"2px 10px", borderRadius:99, fontFamily:"monospace", whiteSpace:"nowrap", marginLeft:4 }}>
          {p.segment}
        </div>

        <div style={{ flex:1 }} />

        <button onClick={() => setShowZones(!showZones)} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 14px", background:showZones ? C.blue : "rgba(255,255,255,0.07)", border:`1px solid ${showZones ? C.blue : "rgba(255,255,255,0.14)"}`, color:"#fff", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, transition:"background 0.2s" }}>
          {showZones ? <Eye size={13}/> : <EyeOff size={13}/>}
          {showZones ? "Hide Zones" : "Show Personalization Zones"}
        </button>
      </div>
    </div>
  );
}

// ─── Bank Navigation ──────────────────────────────────────────────────
function Navbar({ page, setPage, persona }) {
  const auth = ["premier","existing"].includes(persona);
  const navItems = [{ id:"home", label:"Home" }, { id:"loans", label:"Home Loans" }, { id:"mortgage", label:"Mortgage Detail" }, { id:"dashboard", label:"Online Banking" }];
  return (
    <header style={{ background:C.white, borderBottom:`1px solid ${C.border}`, position:"sticky", top:50, zIndex:90 }}>
      <div style={{ background:C.navy, padding:"5px 20px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"flex-end", gap:20 }}>
          {["Personal Banking","Business","About Us"].map(t => <span key={t} style={{ fontSize:11, color:"rgba(255,255,255,0.45)", cursor:"pointer" }}>{t}</span>)}
          {auth
            ? <span style={{ fontSize:11, color:"#86EFAC", fontWeight:600, cursor:"pointer" }}>✓ {persona === "premier" ? "Sarah Chen" : "Michael Torres"} | Sign Out</span>
            : <span style={{ fontSize:11, color:"rgba(255,255,255,0.45)", cursor:"pointer" }}>Login to Online Banking →</span>}
        </div>
      </div>
      <nav style={{ maxWidth:1200, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", height:62 }}>
        <button onClick={() => setPage("home")} style={{ display:"flex", alignItems:"center", gap:10, background:"none", border:"none", cursor:"pointer", padding:0, marginRight:40 }}>
          <div style={{ width:36, height:36, background:C.navy, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:16, fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700 }}>C</span>
          </div>
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.1 }}>Clearwater Bank</div>
            <div style={{ fontSize:9.5, color:C.slateLt, letterSpacing:"0.14em", fontWeight:600 }}>TRUSTED SINCE 1987</div>
          </div>
        </button>
        <div style={{ display:"flex", gap:2, flex:1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ padding:"8px 14px", background:"none", border:"none", borderBottom:page === item.id ? `2.5px solid ${C.blue}` : "2.5px solid transparent", cursor:"pointer", fontSize:13.5, fontWeight:page === item.id ? 600 : 400, color:page === item.id ? C.blue : C.textMd, borderRadius:0 }}>
              {item.label}
            </button>
          ))}
        </div>
        <button style={{ background:C.navy, color:"#fff", border:"none", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>Open an Account</button>
      </nav>
    </header>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────
function ProductCard({ name, type, rate, tag, tagColor }) {
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:13, padding:22, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:tagColor }} />
      <div style={{ display:"inline-flex", alignItems:"center", background:`${tagColor}18`, color:tagColor, fontSize:10.5, fontWeight:700, padding:"3px 10px", borderRadius:99, marginBottom:12, letterSpacing:"0.04em" }}>{tag}</div>
      <div style={{ fontSize:11, color:C.slateLt, fontWeight:600, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em" }}>{type}</div>
      <div style={{ fontSize:15.5, fontWeight:700, color:C.text, marginBottom:8 }}>{name}</div>
      <div style={{ fontSize:26, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:18 }}>{rate}</div>
      <button style={{ width:"100%", padding:"9px 0", background:"transparent", border:`1.5px solid ${C.blue}`, color:C.blue, borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>Learn More →</button>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────
function HomePage({ persona, showZones }) {
  const h = HERO[persona];
  const promo = PROMO[persona];
  const products = FOR_YOU[persona];
  const tile = LIFE_TILE[persona];
  const p = PERSONAS.find(x => x.id === persona);

  return (
    <div>
      {promo && (
        <PZone zoneName="homepage_promo_bar" pointName="Homepage_Promo_Bar" decision={`Segment-targeted offer — ${p.segment}`} rule={`Segment: ${p.segment}`} show={showZones}>
          <div style={{ background:p.bg, borderBottom:`1px solid ${C.border}`, padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"center", gap:14 }}>
            <span style={{ fontSize:13, color:C.text }}>{promo}</span>
            <button style={{ background:p.color, color:"#fff", border:"none", padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", flexShrink:0 }}>View offer</button>
          </div>
        </PZone>
      )}

      {/* Hero */}
      <PZone zoneName="hero_banner" pointName="Homepage_Hero_Banner" decision={h.decision} rule={h.rule} show={showZones}>
        <section style={{ background:`linear-gradient(140deg, ${C.navy} 0%, #163869 55%, #0d2038 100%)`, padding:"72px 20px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.035 }}>
            {[...Array(8)].map((_,i) => <div key={i} style={{ position:"absolute", width:2, height:"100%", background:"#fff", left:`${12.5*(i+1)}%`, transform:"skewX(-15deg)" }} />)}
          </div>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", gap:56, position:"relative" }}>
            <div style={{ flex:1, maxWidth:520 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.09)", borderRadius:99, padding:"4px 14px", marginBottom:20 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:persona === "premier" ? "#F5DFA0" : "#4ADE80" }} />
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.75)", fontWeight:500 }}>{h.eyebrow}</span>
              </div>
              <h1 style={{ fontSize:50, fontWeight:700, color:"#fff", lineHeight:1.1, marginBottom:20, fontFamily:"'Playfair Display',Georgia,serif", whiteSpace:"pre-line" }}>{h.headline}</h1>
              <p style={{ fontSize:17, color:"rgba(255,255,255,0.68)", lineHeight:1.65, marginBottom:36, maxWidth:440 }}>{h.sub}</p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button style={{ background:persona === "premier" ? C.gold : C.blue, color:"#fff", border:"none", padding:"14px 28px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer" }}>{h.cta} →</button>
                <button style={{ background:"transparent", color:"rgba(255,255,255,0.7)", border:"1.5px solid rgba(255,255,255,0.22)", padding:"14px 22px", borderRadius:10, fontSize:14, cursor:"pointer" }}>{h.cta2}</button>
              </div>
            </div>
            {/* Featured card */}
            <div style={{ flex:"0 0 270px" }}>
              <div style={{ background:"rgba(255,255,255,0.07)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.14)", borderRadius:20, padding:28, color:"#fff" }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>{h.featured.label}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>{h.featured.type}</div>
                <div style={{ fontSize:17, fontWeight:700, marginBottom:6 }}>{h.featured.name}</div>
                <div style={{ fontSize:42, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:persona === "premier" ? "#F5DFA0" : "#93C5FD", lineHeight:1 }}>{h.featured.rate}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:24 }}>{h.featured.unit}</div>
                <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:18 }}>
                  <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.35)", marginBottom:10, fontFamily:"monospace" }}>Powered by Salesforce Personalization</div>
                  <div style={{ display:"flex", gap:6 }}>
                    <span style={{ fontSize:10, background:"rgba(27,108,168,0.5)", color:"#93C5FD", padding:"2px 8px", borderRadius:99 }}>AI Recommended</span>
                    <span style={{ fontSize:10, background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.4)", padding:"2px 8px", borderRadius:99 }}>Real-Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PZone>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"52px 20px" }}>
        {/* For You Products */}
        <PZone zoneName="homepage_personalized_for_you" pointName="Homepage_Personalized_For_You" decision={`Objective-Based: Maximize App Starts — ${p.segment}`} rule={`Segment: ${p.segment}`} show={showZones} style={{ marginBottom:60 }}>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
              <div>
                <div style={{ fontSize:11, color:C.blue, fontWeight:700, letterSpacing:"0.1em", marginBottom:6, textTransform:"uppercase" }}>Recommended for You</div>
                <h2 style={{ fontSize:28, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif" }}>Products tailored to your profile</h2>
              </div>
              <span style={{ fontSize:13, color:C.blue, cursor:"pointer", fontWeight:600, whiteSpace:"nowrap" }}>See all products →</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
              {products.map((prod,i) => <ProductCard key={i} {...prod} />)}
            </div>
          </div>
        </PZone>

        {/* Life Event + Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:24, marginBottom:56 }}>
          <PZone zoneName="homepage_life_event_module" pointName="Homepage_Life_Event_Module" decision={tile.decision} rule={tile.rule} show={showZones}>
            <div style={{ background:C.navy, borderRadius:16, padding:40, color:"#fff" }}>
              <div style={{ fontSize:40, marginBottom:18 }}>{tile.icon}</div>
              <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>{tile.pre}</div>
              <h3 style={{ fontSize:22, fontWeight:700, lineHeight:1.45, marginBottom:26, fontFamily:"'Playfair Display',Georgia,serif" }}>{tile.title}</h3>
              <button style={{ background:C.blue, color:"#fff", border:"none", padding:"12px 24px", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer" }}>{tile.cta} →</button>
            </div>
          </PZone>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[{n:"250,000+",l:"Australian customers",icon:"👥"},{n:"35 years",l:"of trusted banking",icon:"🏦"},{n:"4.8 ★",l:"App Store rating",icon:"📱"}].map((s,i) => (
              <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px", display:"flex", alignItems:"center", gap:16 }}>
                <span style={{ fontSize:28 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize:24, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif" }}>{s.n}</div>
                  <div style={{ fontSize:13, color:C.textMd }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Hub Banner */}
        <div style={{ background:C.blueLt, borderRadius:16, padding:"36px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
          <div>
            <div style={{ fontSize:11, color:C.blue, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Financial Wellbeing Hub</div>
            <h3 style={{ fontSize:22, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:10 }}>Guides, tools and expert insights</h3>
            <p style={{ fontSize:14, color:C.textMd, maxWidth:420, lineHeight:1.6 }}>From first home buyer guides to investment strategies — curated content to help you make confident financial decisions.</p>
          </div>
          <button style={{ background:C.navy, color:"#fff", border:"none", padding:"14px 28px", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer", flexShrink:0 }}>Browse the Hub →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Home Loans Hub ───────────────────────────────────────────────────
function LoansHubPage({ persona, showZones }) {
  const p = PERSONAS.find(x => x.id === persona);
  const hubHero = {
    prospect: { headline:"Home loans for every stage of life", sub:"From first home buyers to investors — we have the right loan for your situation.", badge:null },
    mortgage: { headline:"You're in the right place.", sub:"Our home loan specialists can pre-qualify you today. Rates from 5.89% p.a.", badge:"Rates from 5.89% p.a. →" },
    premier:  { headline:"Premier rates — reserved for you", sub:"As a Premier member, you're eligible for rates not available to the general public.", badge:"Premier Exclusive" },
    existing: { headline:"Upgrade to a loyalty home loan rate", sub:"Michael, as an existing Clearwater customer, your loyalty rate starts at 5.79% p.a.", badge:"Your Loyalty Rate" },
    business: { headline:"Property financing for your business", sub:"Commercial property loans, development finance, and SMSF lending — all in one place.", badge:null },
  };
  const hh = hubHero[persona];
  const rate1 = persona === "existing" ? "5.79%" : "5.89%";
  const tag1  = persona === "existing" ? "Your Loyalty Rate" : persona === "mortgage" ? "⭐ Recommended" : "Most Popular";
  const tag1c = persona === "existing" ? C.green : C.blue;

  return (
    <div>
      <PZone zoneName="hub_hero_banner" pointName="Hub_Hero_Banner" decision={`Hub Hero — ${p.segment}`} rule={`Segment: ${p.segment}`} show={showZones}>
        <section style={{ background:C.blueLt, borderBottom:`1px solid ${C.border}`, padding:"60px 20px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>
            {hh.badge && <div style={{ display:"inline-block", background:C.blue, color:"#fff", fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:99, marginBottom:16 }}>{hh.badge}</div>}
            <h1 style={{ fontSize:40, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", maxWidth:600, marginBottom:16 }}>{hh.headline}</h1>
            <p style={{ fontSize:17, color:C.textMd, maxWidth:520, marginBottom:30 }}>{hh.sub}</p>
            <div style={{ display:"flex", gap:12 }}>
              <button style={{ background:C.navy, color:"#fff", border:"none", padding:"13px 26px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                {persona === "mortgage" ? "Get Pre-Qualified" : "Compare Home Loans"} →
              </button>
              <button style={{ background:"transparent", border:`1.5px solid ${C.navy}`, color:C.navy, padding:"13px 18px", borderRadius:10, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                <Calculator size={14}/>Calculate Repayments
              </button>
            </div>
          </div>
        </section>
      </PZone>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"48px 20px" }}>
        <PZone zoneName="hub_product_spotlight" pointName="Hub_Product_Spotlight" decision={`Product Type Affinity — ${p.segment}`} rule="Affinity: ProductType weighted for visitor segment" show={showZones}>
          <div>
            <h2 style={{ fontSize:26, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:28 }}>Compare our home loans</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
              {[
                { name:"Variable Home Loan", rate:rate1, tag:tag1, tagColor:tag1c, features:["No ongoing fees","Free redraw facility","Unlimited extra repayments"] },
                { name:"Fixed Rate Home Loan", rate:"5.99%", tag:"Rate Security", tagColor:C.navy, features:["Lock in your rate for certainty","1, 2 or 3 year terms","Structured budgeting"] },
                { name:"Offset Mortgage", rate:"5.95%", tag:"Save on Interest", tagColor:C.blueMid, features:["100% offset account","Linked transaction account","Unlimited extra repayments"] },
              ].map((loan,i) => (
                <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:24, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:loan.tagColor }} />
                  <div style={{ display:"inline-block", background:`${loan.tagColor}18`, color:loan.tagColor, fontSize:10.5, fontWeight:700, padding:"3px 10px", borderRadius:99, marginBottom:12 }}>{loan.tag}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:8 }}>{loan.name}</div>
                  <div style={{ fontSize:32, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>{loan.rate}</div>
                  <div style={{ fontSize:12, color:C.textMd, marginBottom:20 }}>p.a. interest rate</div>
                  {loan.features.map((f,j) => (
                    <div key={j} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8, fontSize:13, color:C.textMd }}><CheckCircle size={12} color={C.green}/>{f}</div>
                  ))}
                  <button style={{ width:"100%", marginTop:20, padding:"11px 0", background:C.navy, color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>Apply Now →</button>
                </div>
              ))}
            </div>
          </div>
        </PZone>
      </div>
    </div>
  );
}

// ─── Mortgage PDP ─────────────────────────────────────────────────────
function MortgagePage({ persona, showZones }) {
  const mc = MORTGAGE_CTA[persona];
  const cs = CROSS_SELL[persona];
  const p = PERSONAS.find(x => x.id === persona);
  const iRate = persona === "existing" ? "5.79%" : "5.89%";
  const cRate = persona === "existing" ? "5.84%" : "5.94%";

  return (
    <div>
      <div style={{ background:C.blueLt, borderBottom:`1px solid ${C.border}`, padding:"11px 20px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", gap:8, fontSize:13, color:C.textMd }}>
          <span style={{ color:C.blue, cursor:"pointer" }}>Home</span><span>/</span>
          <span style={{ color:C.blue, cursor:"pointer" }}>Home Loans</span><span>/</span>
          <span>Clearwater Variable Home Loan</span>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 350px", gap:44, alignItems:"start" }}>

          {/* Left */}
          <div>
            {mc.badge && (
              <PZone zoneName="pdp_offer_badge" pointName="PDP_Offer_Badge" decision="Segment-Targeted Offer Badge" rule={mc.rule} show={showZones}>
                <div style={{ display:"inline-flex", background:`${p.color}15`, border:`1px solid ${p.color}40`, color:p.color, fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:99, marginBottom:16 }}>{mc.badge}</div>
              </PZone>
            )}
            <div style={{ fontSize:11, color:C.slateLt, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Home Loan</div>
            <h1 style={{ fontSize:36, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:18 }}>Clearwater Variable Home Loan</h1>

            {mc.infobar && (
              <PZone zoneName="pdp_infobar" pointName="PDP_Infobar" decision="Authenticated Existing Customer — Merge Fields Active" rule="Direct Attr: Customer Status = Active" show={showZones} style={{ marginBottom:20 }}>
                <div style={{ background:C.greenLt, border:`1px solid ${C.green}40`, borderRadius:10, padding:"14px 18px", display:"flex", gap:12, alignItems:"flex-start" }}>
                  <CheckCircle size={17} color={C.green} style={{ flexShrink:0, marginTop:1 }}/>
                  <p style={{ fontSize:14, color:"#065f46", lineHeight:1.55 }}>{mc.infobar}</p>
                </div>
              </PZone>
            )}

            {/* Rates */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:36, marginTop:24 }}>
              {[
                { label:"Interest Rate",     value:iRate, sub:"p.a. variable",        hl:persona === "existing" },
                { label:"Comparison Rate*",  value:cRate, sub:"p.a.",                 hl:false },
                { label:"Min. Deposit",      value:"5%",  sub:"of property value",    hl:false },
              ].map((r,i) => (
                <div key={i} style={{ background:r.hl ? C.greenLt : C.bg, border:`1px solid ${r.hl ? C.green+"40" : C.border}`, borderRadius:12, padding:"18px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:11, color:C.slateLt, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>{r.label}</div>
                  <div style={{ fontSize:30, fontWeight:700, color:r.hl ? C.green : C.navy, fontFamily:"'Playfair Display',Georgia,serif" }}>{r.value}</div>
                  <div style={{ fontSize:12, color:C.textMd }}>{r.sub}</div>
                  {r.hl && <div style={{ fontSize:10, color:C.green, fontWeight:700, marginTop:4 }}>YOUR LOYALTY RATE</div>}
                </div>
              ))}
            </div>

            {/* Features */}
            <h3 style={{ fontSize:18, fontWeight:700, color:C.navy, marginBottom:18, fontFamily:"'Playfair Display',Georgia,serif" }}>Key features</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {["No application or ongoing fees","Free redraw facility","Extra repayments at no cost","Offset account available (+0.06%)","Split loan options available","Online account management"].map((f,i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <CheckCircle size={15} color={C.green} style={{ flexShrink:0, marginTop:2 }}/>
                  <span style={{ fontSize:14, color:C.textMd }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Apply card */}
          <div style={{ position:"sticky", top:124 }}>
            <PZone zoneName="pdp_application_nudge" pointName="PDP_Application_Nudge" decision={mc.decision} rule={mc.rule} show={showZones}>
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", boxShadow:"0 4px 24px rgba(15,42,74,0.08)" }}>
                <div style={{ background:C.navy, padding:"22px 24px 18px" }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginBottom:4 }}>Your rate</div>
                  <div style={{ fontSize:42, fontWeight:700, color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1 }}>{iRate}</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:4 }}>p.a. variable</div>
                </div>
                <div style={{ padding:22 }}>
                  <button style={{ width:"100%", padding:"14px 0", background:mc.ctaStyle === "strong" ? C.blue : C.navy, color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:10 }}>
                    {mc.ctaLabel}
                  </button>
                  {mc.ctaStyle !== "strong" && (
                    <button style={{ width:"100%", padding:"12px 0", background:"transparent", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.textMd, cursor:"pointer" }}>Calculate My Repayments</button>
                  )}
                  <div style={{ marginTop:20, paddingTop:18, borderTop:`1px solid ${C.border}` }}>
                    {[{I:Shield,t:"No impact on your credit score"},{I:Calculator,t:"Decision in as little as 5 minutes"},{I:CheckCircle,t:"Free borrowing power assessment"}].map(({I,t},i) => (
                      <div key={i} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10, fontSize:12.5, color:C.textMd }}>
                        <I size={14} color={C.blue}/>{t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PZone>
          </div>
        </div>

        {/* Cross-sell */}
        <PZone zoneName="pdp_you_may_also_consider" pointName="PDP_You_May_Also_Consider" decision={`Cross-Sell — ⚗️ A/B Experiment Active: Rule-Based vs Objective-Based for ${p.segment}`} rule={`Segment: ${p.segment}`} show={showZones} style={{ marginTop:52 }}>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h3 style={{ fontSize:22, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif" }}>You may also consider</h3>
              <span style={{ fontSize:11, background:"#FEF3C7", color:"#92400E", padding:"3px 10px", borderRadius:99, fontWeight:700 }}>⚗️ A/B Experiment Active</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
              {cs.map((item,i) => (
                <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                  <div style={{ fontSize:10.5, color:C.slateLt, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>{item.type}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>{item.name}</div>
                  <div style={{ fontSize:20, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:14 }}>{item.rate}</div>
                  <button style={{ fontSize:13, color:C.blue, background:"none", border:"none", padding:0, cursor:"pointer", fontWeight:600 }}>Find out more →</button>
                </div>
              ))}
            </div>
          </div>
        </PZone>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────
function DashboardPage({ persona, showZones }) {
  const auth = ["premier","existing"].includes(persona);
  if (!auth) return (
    <div style={{ maxWidth:1200, margin:"80px auto", padding:"0 20px", textAlign:"center" }}>
      <Lock size={40} color={C.border} style={{ marginBottom:20 }}/>
      <h2 style={{ fontSize:28, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:12 }}>Clearwater Online Banking</h2>
      <p style={{ fontSize:16, color:C.textMd, marginBottom:32, maxWidth:380, margin:"0 auto 32px" }}>Switch to <strong>Premier Customer</strong> or <strong>Existing Customer</strong> using the persona selector above to experience the authenticated dashboard.</p>
      <div style={{ display:"inline-flex", padding:"10px 20px", background:C.blueLt, borderRadius:10, fontSize:13, color:C.blue }}>↑ Use the persona switcher in the top bar</div>
    </div>
  );

  const d = DASH_DATA[persona];

  return (
    <div style={{ background:C.bg, minHeight:"60vh" }}>
      <div style={{ background:C.navy, padding:"32px 20px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <PZone zoneName="dashboard_relationship_banner" pointName="Dashboard_Relationship_Banner" decision="Authenticated — Merge Fields: Name, Tier, Products" rule="Direct Attr: Email not null + Products held" show={showZones}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:6 }}>Good afternoon</div>
                <h1 style={{ fontSize:32, fontWeight:700, color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:10 }}>{d.name}'s Dashboard</h1>
                <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:`${d.tierColor}20`, border:`1px solid ${d.tierColor}40`, borderRadius:99, padding:"4px 14px" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:d.tierColor }}/>
                  <span style={{ fontSize:12, color:d.tierColor, fontWeight:700 }}>{d.tier}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.14)", color:"#fff", padding:"8px 16px", borderRadius:8, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                  <Bell size={13}/>Notifications
                </button>
                <button style={{ background:C.blue, border:"none", color:"#fff", padding:"8px 16px", borderRadius:8, fontSize:13, cursor:"pointer", fontWeight:600 }}>+ Transfer</button>
              </div>
            </div>
          </PZone>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 370px", gap:28 }}>
          <div>
            <h2 style={{ fontSize:18, fontWeight:700, color:C.navy, marginBottom:16 }}>Your Accounts</h2>
            {d.accounts.map((acc,i) => (
              <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:11, color:C.slateLt, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{acc.label}</div>
                  <div style={{ fontSize:28, fontWeight:700, color:C.navy, fontFamily:"'Playfair Display',Georgia,serif" }}>{acc.value}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:13, color:acc.pos ? C.green : C.textMd, fontWeight:acc.pos ? 700 : 400 }}>{acc.note}</div>
                  <button style={{ marginTop:8, fontSize:12, color:C.blue, background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>View details →</button>
                </div>
              </div>
            ))}
            <div style={{ background:C.blueLt, borderRadius:12, padding:24, marginTop:20 }}>
              <div style={{ fontSize:11, color:C.blue, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>💡 Financial Tip</div>
              <h4 style={{ fontSize:15.5, fontWeight:700, color:C.navy, marginBottom:8 }}>{persona === "premier" ? "Maximising your offset strategy" : "Understanding your credit score"}</h4>
              <p style={{ fontSize:13.5, color:C.textMd, lineHeight:1.6 }}>{d.tip}</p>
            </div>
          </div>

          {/* Next Best Product */}
          <div>
            <PZone zoneName="dashboard_next_best_product" pointName="Dashboard_Next_Best_Product" decision={d.nba.decision} rule={d.nba.rule} show={showZones}>
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", boxShadow:"0 4px 20px rgba(15,42,74,0.07)" }}>
                <div style={{ background:`linear-gradient(135deg,${C.navy},#163869)`, padding:"20px 22px" }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                    <Sparkles size={13} color={persona === "premier" ? "#F5DFA0" : "#93C5FD"}/>
                    <span style={{ fontSize:10.5, color:"rgba(255,255,255,0.5)", fontWeight:700, letterSpacing:"0.09em" }}>NEXT BEST PRODUCT — AI</span>
                  </div>
                  <div style={{ fontSize:17, fontWeight:700, color:"#fff" }}>{d.nba.name}</div>
                </div>
                <div style={{ padding:"20px 22px" }}>
                  <p style={{ fontSize:14, color:C.textMd, lineHeight:1.65, marginBottom:20 }}>{d.nba.desc}</p>
                  <button style={{ width:"100%", padding:"13px 0", background:persona === "premier" ? C.gold : C.blue, color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>{d.nba.cta} →</button>
                  <button style={{ width:"100%", padding:"11px 0", marginTop:8, background:"transparent", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.slate, cursor:"pointer" }}>Not right now</button>
                </div>
              </div>
            </PZone>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginTop:20 }}>
              <h4 style={{ fontSize:14, fontWeight:700, color:C.navy, marginBottom:14 }}>Quick Actions</h4>
              {["Transfer funds","Pay a bill","View statements","Update details"].map((a,i,arr) => (
                <button key={i} style={{ width:"100%", padding:"11px 14px", background:"none", border:"none", borderBottom:i < arr.length-1 ? `1px solid ${C.border}` : "none", textAlign:"left", cursor:"pointer", fontSize:13.5, color:C.blue, display:"flex", justifyContent:"space-between" }}>
                  {a}<ChevronRight size={14}/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AWAC Chat ────────────────────────────────────────────────────────
const CHAT_RESPONSES = {
  home:    { text:"Great question — buying your first home is a big step! Based on your recent browsing, our First Home Buyer Package looks like a strong fit. Here are a few options to explore:", products:["First Home Buyer Package — 5.89% p.a.","Home Loan Pre-Approval (Free & instant)","Repayment Calculator"] },
  invest:  { text:"Smart thinking. For building wealth over time, I'd look at a mix of managed investments and term deposits. Here's what our wealth team recommends:", products:["Premier Investment Portfolio","Term Deposit — 5.40% p.a.","Book a Wealth Consultation"] },
  save:    { text:"The fastest way to grow savings is to link them to your everyday account. Our Everyday Savings account earns 5.10% p.a. with zero fees — takes 3 minutes to open:", products:["Everyday Savings — 5.10% p.a.","Clearwater Savings Goals Tool","Automatic round-up feature"] },
  business:{ text:"For business banking, it really depends on your cashflow needs. Here's what we recommend for businesses at your stage:", products:["Business Growth Loan — from 6.20%","Business Transaction Account (No fees)","Speak to a Business Specialist"] },
};

function AWACChat({ open, onClose }) {
  const [messages, setMessages] = useState([{ role:"agent", text:"Hi! I'm your Clearwater Financial Advisor, powered by Agentforce and Salesforce Personalization. What can I help you with today?", products:null }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  const send = () => {
    const txt = input.trim(); if (!txt) return;
    setInput(""); setMessages(prev => [...prev,{ role:"user", text:txt, products:null }]); setTyping(true);
    setTimeout(() => {
      const low = txt.toLowerCase();
      const key = low.includes("home") || low.includes("buy") || low.includes("house") || low.includes("mortgage") ? "home" : low.includes("invest") || low.includes("wealth") || low.includes("portfolio") ? "invest" : low.includes("business") || low.includes("loan") ? "business" : "save";
      const r = CHAT_RESPONSES[key];
      setMessages(prev => [...prev,{ role:"agent", text:r.text, products:r.products }]); setTyping(false);
    }, 1400);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, typing]);

  if (!open) return null;
  return (
    <div style={{ position:"fixed", bottom:88, right:24, width:360, maxHeight:520, background:C.white, borderRadius:20, boxShadow:"0 12px 48px rgba(15,42,74,0.2)", border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", overflow:"hidden", zIndex:300 }}>
      <div style={{ background:C.navy, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:C.blue, display:"flex", alignItems:"center", justifyContent:"center" }}><Bot size={18} color="#fff"/></div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>Clearwater Advisor</div>
            <div style={{ fontSize:10.5, color:"#86EFAC", display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#86EFAC", display:"inline-block" }}/>Agentforce + Salesforce Personalization
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer" }}><X size={17}/></button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
        {messages.map((m,i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth:"86%", background:m.role === "user" ? C.blue : C.bg, color:m.role === "user" ? "#fff" : C.text, borderRadius:12, padding:"10px 14px", fontSize:13.5, lineHeight:1.5 }}>{m.text}</div>
            {m.products && (
              <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:6, width:"100%" }}>
                {m.products.map((prod,j) => (
                  <button key={j} style={{ textAlign:"left", background:C.blueLt, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", fontSize:12.5, color:C.navy, cursor:"pointer", fontWeight:500, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    {prod}<ChevronRight size={12} color={C.blue}/>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && <div style={{ background:C.bg, borderRadius:12, padding:"10px 14px", fontSize:13, color:C.textMd, width:"fit-content" }}>Clearwater Advisor is typing…</div>}
        <div ref={endRef}/>
      </div>

      <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about home loans, savings…" style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", fontSize:13, outline:"none", fontFamily:"Inter,system-ui,sans-serif" }}/>
        <button onClick={send} style={{ background:C.blue, border:"none", borderRadius:8, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}><Send size={14} color="#fff"/></button>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────
export default function ClearwaterBank() {
  const [page, setPage] = useState("home");
  const [persona, setPersona] = useState("prospect");
  const [showZones, setShowZones] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg, minHeight:"100vh", color:C.text }}>
      <style>{FONTS}</style>
      <DemoBar persona={persona} setPersona={setPersona} showZones={showZones} setShowZones={setShowZones}/>
      <Navbar page={page} setPage={setPage} persona={persona}/>
      <main>
        {page === "home"      && <HomePage      persona={persona} showZones={showZones}/>}
        {page === "loans"     && <LoansHubPage  persona={persona} showZones={showZones}/>}
        {page === "mortgage"  && <MortgagePage  persona={persona} showZones={showZones}/>}
        {page === "dashboard" && <DashboardPage persona={persona} showZones={showZones}/>}
      </main>

      {/* AWAC bubble */}
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:200 }}>
        <button onClick={() => setChatOpen(!chatOpen)} style={{ width:56, height:56, borderRadius:"50%", background:C.navy, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(15,42,74,0.28)", position:"relative" }}>
          <Bot size={24} color="#fff"/>
          <div style={{ position:"absolute", top:0, right:0, width:16, height:16, background:"#10B981", borderRadius:"50%", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Sparkles size={8} color="#fff"/>
          </div>
        </button>
        <AWACChat open={chatOpen} onClose={() => setChatOpen(false)}/>
      </div>

      <footer style={{ background:C.navy, color:"rgba(255,255,255,0.38)", padding:"28px 20px", marginTop:60, textAlign:"center", fontSize:12, lineHeight:1.8 }}>
        <div>© 2025 Clearwater Bank · ABN 12 345 678 901 · AFSL 123456 · Australian Credit Licence 123456</div>
        <div>This is a Salesforce Personalization demo environment. All rates, products, and customer data are fictional.</div>
      </footer>
    </div>
  );
}
