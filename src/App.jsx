import { useState, useRef, useCallback, useEffect, createContext, useContext } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

// ═══════════════════════════════════════════════
// ALPS LOGO
// ═══════════════════════════════════════════════
const ALPS_LOGO = "data:image/webp;base64,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cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0REY5QThGOTBFODUxMUVEQTQ3QUJGMTM0NEJDNkMzMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0REY5QThGQTBFODUxMUVEQTQ3QUJGMTM0NEJDNkMzMiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRERjlBOEY3MEU4NTExRURBNDdBQkYxMzQ0QkM2QzMyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRERjlBOEY4MEU4NTExRURBNDdBQkYxMzQ0QkM2QzMyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+";

// ═══════════════════════════════════════════════
// ANALYTICS TRACKING
// ═══════════════════════════════════════════════
function trackEvent(action, category, label, value) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// ═══════════════════════════════════════════════
// LIVE COUNTER (Firebase)
// ═══════════════════════════════════════════════
const FIREBASE_URL = "https://whitelabel-c74aa-default-rtdb.europe-west1.firebasedatabase.app";

async function incrementCounter() {
  try {
    const res = await fetch(`${FIREBASE_URL}/counter/total.json`);
    const current = await res.json() || 0;
    await fetch(`${FIREBASE_URL}/counter/total.json`, {
      method: "PUT",
      body: JSON.stringify(current + 1),
    });
  } catch {}
}

function useCounter() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    fetch(`${FIREBASE_URL}/counter/total.json`)
      .then(r => r.json())
      .then(val => setCount(val || 0))
      .catch(() => setCount(null));
  }, []);
  return count;
}

// ═══════════════════════════════════════════════
// BROKER PROFILE CONTEXT
// ═══════════════════════════════════════════════
const BrokerContext = createContext();
function useBrokerProfile() { return useContext(BrokerContext); }

function BrokerProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try { const s = localStorage.getItem("alps_broker_profile"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const saveProfile = (p) => { setProfile(p); try { localStorage.setItem("alps_broker_profile", JSON.stringify(p)); } catch {} };
  return <BrokerContext.Provider value={{ profile, saveProfile }}>{children}</BrokerContext.Provider>;
}

// ═══════════════════════════════════════════════
// TOAST NOTIFICATION HOOK
// ═══════════════════════════════════════════════
function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };
  const ToastUI = () => toast ? (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: toast.type === "error" ? "#dc2626" : "#16a34a", color: "#fff",
      padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 9999, maxWidth: 440,
      textAlign: "center", animation: "fadeInUp 0.3s ease",
    }}>{toast.msg}</div>
  ) : null;
  return { show, ToastUI };
}

// ═══════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════
const PRODUCTS = [
  {
    id: "motor-legal",
    category: "Motor",
    categoryColor: "#E91E8B",
    title: "Motor Legal Protection",
    tagline: "Peace of mind if you're involved in a road traffic accident that isn't your fault.",
    icon: "⚖️",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    description: "Your car insurance should cover damage to your vehicle in a road traffic accident — but what about the other costs? Motor Legal Protection Insurance provides cover of up to £100,000 for legal and advisory fees, so you're never left out of pocket when it matters most.",
    features: [
      { icon: "💰", title: "Uninsured Loss Recovery", desc: "Recover costs like loss of earnings, your policy excess, and vehicle hire charges." },
      { icon: "🩹", title: "Personal Injury Claims", desc: "Cover for both drivers and passengers to pursue compensation for injuries sustained." },
      { icon: "🛡️", title: "Motoring Prosecution Defence", desc: "Legal protection to defend you against motoring prosecution charges." },
      { icon: "📝", title: "Contractual Disputes", desc: "Support for disputes relating to the sale or purchase of a motor vehicle." },
      { icon: "📱", title: "Online Claims Portal", desc: "Track your claim status, message your handler, and upload documents — all online." },
      { icon: "👤", title: "Dedicated Claims Handler", desc: "Every claim is managed by a real person — you'll always speak to someone who knows your case." },
    ],
  },
  {
    id: "alps-complete",
    category: "Motor",
    categoryColor: "#E91E8B",
    title: "Motor Legal Protection + Guaranteed Hire",
    tagline: "Complete motoring peace of mind — legal cover plus a replacement vehicle when you need it most.",
    icon: "🚗",
    image: "https://images.unsplash.com/photo-1449965408869-ebd13bc9e5a8?w=800&q=80",
    description: "Combining comprehensive Motor Legal Protection with a guaranteed replacement vehicle for up to 14 days following a fault accident, theft, fire, or total loss. You'll never be left without a vehicle when you need one most.",
    features: [
      { icon: "🚙", title: "Replacement Vehicle", desc: "A hire vehicle provided if your car is damaged and unroadworthy — regardless of fault status." },
      { icon: "📅", title: "Up to 14 Days Cover", desc: "Access a replacement vehicle for up to 14 days, with options to extend at reduced rates." },
      { icon: "🔄", title: "Two Claims Per Year", desc: "Cover for up to two claims during your policy period, up to a maximum aggregate of 14 days." },
      { icon: "🚐", title: "Vehicle Choice", desc: "Choose from a small hatchback or short wheelbase van to suit your needs." },
      { icon: "⭐", title: "Premium Options Available", desc: "Upgrade to Prestige, Family Saloon, or Large Van replacement vehicles." },
      { icon: "⚖️", title: "Full Legal Protection", desc: "Includes all the benefits of our Motor Legal Protection cover up to £100,000." },
    ],
  },
  {
    id: "motor-excess",
    category: "Motor",
    categoryColor: "#E91E8B",
    title: "Motor Excess Protection",
    tagline: "Don't let your insurance excess catch you off guard.",
    icon: "🔒",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
    description: "Paying an excess on a motor claim can be a significant and unexpected expense. Motor Excess Protection lets you safeguard yourself against this cost, so a fault claim or delay in third-party payment doesn't leave you financially stretched.",
    features: [
      { icon: "📊", title: "Flexible Cover Limits", desc: "Choose the right level of protection for you, with cover limits from £150 up to £2,000." },
      { icon: "📋", title: "Simple Claims Process", desc: "Complete a straightforward online form with proof of your excess payment — that's it." },
      { icon: "🚛", title: "Fleet Cover Available", desc: "Motor fleet risks covered with indemnity limits up to £10,000 for up to 30 drivers." },
      { icon: "📱", title: "Online Portal Access", desc: "View your claim status, communicate with your handler, and upload files — all in one place." },
    ],
  },
  {
    id: "auto-replace",
    category: "Motor",
    categoryColor: "#E91E8B",
    title: "Auto Replace",
    tagline: "A replacement vehicle when your car is off the road — up to 28 days.",
    icon: "🔄",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
    description: "If you're involved in a fault or disputed accident, theft, fire, or total loss, your main insurer may not provide a replacement vehicle. Auto Replace gives you up to 28 days' access to a suitable replacement, so you're never left stranded.",
    features: [
      { icon: "📅", title: "Flexible Duration", desc: "Select 7, 14, or 28 days' access to a hire vehicle depending on your situation." },
      { icon: "🚙", title: "Vehicle Choice", desc: "Four vehicle types available: small hatchback, family saloon, small van, or large van." },
      { icon: "🔄", title: "Multiple Claims", desc: "Up to 2 claims throughout the policy period, subject to the maximum aggregate days." },
      { icon: "📦", title: "Courier & Delivery Cover", desc: "Vehicles used for courier and delivery purposes can also be covered." },
    ],
  },
  {
    id: "road-rescue",
    category: "Motor",
    categoryColor: "#E91E8B",
    title: "Road Rescue",
    tagline: "Breakdown cover you can rely on — with a bigger network than the AA, RAC, and Green Flag.",
    icon: "🔧",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
    description: "Our Road Rescue service is managed by Call Assist, operating the UK's largest recovery network with 3,500 technicians handling 350,000 claims every year. From local breakdowns to European travel, you're covered.",
    features: [
      { icon: "📍", title: "Range of Cover Levels", desc: "Local recovery, nationwide recovery, homestart, and European travel options available." },
      { icon: "🚗", title: "Wide Vehicle Range", desc: "Cars, motorcycles, vans, couriers, driving schools, classic cars, and commercial vehicles." },
      { icon: "⛽", title: "Misfuelling Cover", desc: "Wrong fuel? We'll drain, flush, and refill with 10 litres of the correct fuel, plus up to £1,500 engine damage cover." },
      { icon: "🔑", title: "Lost & Stolen Keys", desc: "Up to £50 towards the cost of replacing lost or stolen keys." },
      { icon: "🚛", title: "Fleet Road Rescue", desc: "Pro rata rates for fleets with mixed cover types — no requirement for all vehicles to be covered." },
      { icon: "📏", title: "Generous Vehicle Dimensions", desc: "Vehicles up to 7.5T, 8.5m long, 2.5m wide, and 3.5m high can be covered." },
    ],
  },
  {
    id: "tools-transit",
    category: "Motor",
    categoryColor: "#E91E8B",
    title: "Tools in Transit",
    tagline: "Your tools are your livelihood — make sure they're protected.",
    icon: "🔨",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
    description: "If your tools are damaged or stolen, your ability to earn could be at stake. Tools in Transit protects your portable tools, tool kits, and test equipment while they're in or on your vehicle.",
    features: [
      { icon: "💥", title: "Damage Cover", desc: "Protection for tools damaged while being loaded onto, stored on, or unloaded from your vehicle." },
      { icon: "🔐", title: "Theft Cover", desc: "Covered even when your vehicle is unattended, plus overnight cover in well-lit areas near your home." },
      { icon: "📊", title: "Flexible Indemnity Limits", desc: "Choose cover from £500 up to £10,000 to match the value of your tools." },
      { icon: "📞", title: "Simple Claims Process", desc: "A dedicated team guides you through every step with as little fuss as possible." },
    ],
  },
  {
    id: "gap",
    category: "Motor",
    categoryColor: "#E91E8B",
    title: "GAP Insurance",
    tagline: "Bridge the gap between your vehicle's market value and what you paid for it.",
    icon: "📉",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
    description: "If your vehicle is written off, your motor insurer only pays its current market value — which can be thousands less than you originally paid. GAP Insurance covers the difference, protecting you from depreciation and outstanding finance.",
    features: [
      { icon: "⚡", title: "Fast Claims Payout", desc: "Expect payment within 24 hours of providing all required documentation." },
      { icon: "💳", title: "Reduces Finance Risk", desc: "Covers any outstanding balance on HP, Personal Car Loans, and PCP agreements." },
      { icon: "📈", title: "Eliminates Depreciation", desc: "Pays the difference between your insurance settlement and the original purchase price." },
      { icon: "📅", title: "180-Day Purchase Window", desc: "Up to 180 days after buying your vehicle to take out a GAP policy." },
      { icon: "🚗", title: "No Mileage Limits", desc: "Unlike many providers, there are no limitations on vehicle mileage." },
      { icon: "💷", title: "Up to £50,000 Cover", desc: "Claim limit of £50,000 on vehicles valued up to £125,000." },
    ],
  },
  {
    id: "pothole",
    category: "Motor",
    categoryColor: "#E91E8B",
    title: "Pothole Insurance",
    tagline: "Protect your vehicle from the UK's growing pothole problem — affordable cover from just £60.",
    icon: "🕳️",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80",
    description: "UK roads are getting worse. With over 225 pothole-related breakdowns every day and average repair bills of £460, a single pothole can leave you seriously out of pocket. Pothole Insurance provides up to £2,000 of cover for pothole-related damage — protecting your wheels, tyres, suspension, bodywork, and more — so one bad road doesn't mean one big bill.",
    features: [
      { icon: "🛞", title: "Tyre Damage", desc: "Up to £200 per tyre for pothole-related tyre damage." },
      { icon: "🔩", title: "Wheel Damage", desc: "Up to £250 per wheel for cracked, buckled, or damaged wheels." },
      { icon: "🔧", title: "Suspension Damage", desc: "Up to £500 for damage to suspension systems and shock absorbers." },
      { icon: "📐", title: "Wheel Alignment", desc: "Up to £150 for wheel alignment correction after a pothole impact." },
      { icon: "🚗", title: "Bodywork & Headlights", desc: "Up to £250 for damage to bodywork, paintwork, and headlights." },
      { icon: "🚐", title: "Wide Vehicle Range", desc: "Covers private cars, motorcycles, commercial vehicles, and motorhomes up to 3.5 tonnes." },
    ],
  },
  {
    id: "commercial-legal",
    category: "Commercial",
    categoryColor: "#00A69C",
    title: "Commercial Legal Protection",
    tagline: "Comprehensive legal cover for your business — without the cost of an in-house legal team.",
    icon: "🏢",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
    description: "Not every business can afford in-house legal expertise. Commercial Legal Protection provides comprehensive cover rated purely on business turnover, with no requirement to disclose wage roll. Choose from £50,000 or £100,000 indemnity limits.",
    features: [
      { icon: "📝", title: "Contract Disputes", desc: "Cover for disputes with customers or suppliers relating to the sale, hire, or supply of goods and services." },
      { icon: "👥", title: "Employment Disputes", desc: "Support for disputes around contracts of employment, discrimination, and restrictive covenants." },
      { icon: "🛡️", title: "Legal Defence", desc: "Defence against prosecution in a criminal court for an alleged act or omission." },
      { icon: "📊", title: "Tax Investigation", desc: "Cover for professional fees relating to Tax, PAYE, VAT, or NIC disputes." },
      { icon: "🏠", title: "Property Protection", desc: "Support in civil action for nuisance, trespass, or criminal damage to your business premises." },
      { icon: "⚖️", title: "Jury Service Expenses", desc: "Reimbursement for lost salary or wages when attending court for jury service." },
      { icon: "📞", title: "Helpline Support", desc: "Access a Legal Assistance helpline and tax advice line, operating 9am to 5pm." },
      { icon: "💰", title: "Debt Recovery", desc: "Included as standard with the AmTrust option to help recover money owed to your business." },
    ],
  },
  {
    id: "commercial-excess",
    category: "Commercial",
    categoryColor: "#00A69C",
    title: "Commercial Excess Protection",
    tagline: "Take a higher excess for lower premiums — and still be fully covered.",
    icon: "🏗️",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    description: "Opt for a higher commercial insurance excess to lower your premiums, while insuring that excess in the event of a claim. You get the same level of security and peace of mind, often at a lower overall cost.",
    features: [
      { icon: "📊", title: "Flexible Cover Limits", desc: "Indemnity limits ranging from £250 to £2,500 to match your policy excess." },
      { icon: "✅", title: "Simple to Understand", desc: "Covers the excess paid for any successful claim under your commercial insurance policy." },
      { icon: "🏦", title: "Strong Backing", desc: "Backed by a financially secure insurer with a proven claims track record." },
      { icon: "🔄", title: "Business Continuity", desc: "Mitigate unexpected financial burdens to keep your business running smoothly." },
    ],
  },
  {
    id: "sole-trader",
    category: "Commercial",
    categoryColor: "#00A69C",
    title: "Sole Trader Legal Protection",
    tagline: "Focus on growing your business — we'll handle the legal worries.",
    icon: "👤",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    description: "Running a one-person business means wearing many hats. Sole Trader Legal Protection gives you wide-ranging cover of up to £75,000, so you can concentrate on what you do best without worrying about legal issues affecting your business or personal affairs.",
    features: [
      { icon: "🏠", title: "Personal Cover", desc: "Protection for Consumer Disputes, Home Rights, Personal Taxation, Criminal Prosecution Defence, and Identity Theft." },
      { icon: "📝", title: "Contract Disputes", desc: "Cover for disputes with customers or suppliers about the sale, hire, or supply of goods and services." },
      { icon: "📊", title: "Tax Investigation", desc: "Cover for professional fees relating to Tax, PAYE, VAT, or NIC disputes." },
      { icon: "🏢", title: "Property Protection", desc: "Support for civil actions regarding nuisance, trespass, or criminal damage to your premises." },
      { icon: "📜", title: "Licence Protection", desc: "Legal support if a regulatory licence is unfairly suspended, revoked, or altered." },
      { icon: "💰", title: "Debt Recovery", desc: "Cover for recovering money owed to you from other businesses for goods or services provided." },
      { icon: "🩹", title: "Personal Injury & More", desc: "Also includes pothole damage, illegal clamping & towing, unenforceable parking fines, and vehicle identity theft." },
    ],
  },
  {
    id: "commercial-emergency",
    category: "Commercial",
    categoryColor: "#00A69C",
    title: "Commercial Property Emergency",
    tagline: "Fast, reliable emergency cover for your business premises — so disruption doesn't mean downtime.",
    icon: "🏗️",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    description: "When an emergency strikes at your business premises, you need help fast. Commercial Property Emergency provides rapid assistance and financial protection for SME businesses facing unexpected property emergencies — from boiler breakdowns and burst pipes to roof damage, pest infestations, and break-ins. Cover includes call-out charges, labour, parts, and materials.",
    features: [
      { icon: "🚿", title: "Plumbing & Drainage", desc: "Cover for burst pipes, blocked drains, and internal plumbing failures that could disrupt your business." },
      { icon: "🔥", title: "Boiler & Heating Breakdown", desc: "Assistance when your primary heating system fails — keeping your premises operational." },
      { icon: "🏠", title: "Roof Damage", desc: "Emergency support for sudden and unforeseen roofing issues at your business premises." },
      { icon: "🐛", title: "Pest Infestation", desc: "Professional removal of wasps, rodents, cockroaches, and other pests from your workplace." },
      { icon: "🔐", title: "Break-In & Vandalism", desc: "Emergency repairs following a break-in or vandalism to secure your premises." },
      { icon: "⚡", title: "Loss of Utilities", desc: "Help when the internal gas, electricity, or water supply fails at your property." },
    ],
  },
  {
    id: "landlord-legal",
    category: "Let Property",
    categoryColor: "#F5A623",
    title: "Landlord Legal Expenses",
    tagline: "When tenancies go wrong, make sure you're covered for every step.",
    icon: "🏘️",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    description: "Tenancy disputes can be lengthy, stressful, and expensive. Landlord Legal Expenses provides comprehensive cover and expert advice for owners of both commercial and residential let properties, with cover per property — not per tenant.",
    features: [
      { icon: "📋", title: "Breach of Tenancy", desc: "Legal assistance when a tenant breaches their obligations under the tenancy agreement." },
      { icon: "💷", title: "Rent Arrears Pursuit", desc: "Professional support to pursue outstanding rent payments from tenants." },
      { icon: "🚪", title: "Eviction Support", desc: "Guidance and cover for evicting anyone occupying your property without permission." },
      { icon: "🛡️", title: "Legal Defence", desc: "Defence in criminal and civil matters connected to ownership of the property." },
      { icon: "🏠", title: "Per-Property Cover", desc: "Cover stays with the property through any change in tenancy — no penalties within the policy period." },
      { icon: "💰", title: "Rent Protection Option", desc: "Upgrade to include rent indemnity cover for residential properties, with legal expenses included as standard." },
    ],
  },
  {
    id: "landlord-emergency",
    category: "Let Property",
    categoryColor: "#F5A623",
    title: "Landlord Home Emergency",
    tagline: "Protect your rental property from unexpected emergencies — 24/7.",
    icon: "🔧",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    description: "When an emergency strikes at your rental property, you need fast, reliable help. A nationwide network of qualified professionals is ready to handle everything from burst pipes to pest infestations, available around the clock.",
    features: [
      { icon: "🚿", title: "Plumbing & Drainage", desc: "Cover for blocked drains, toilets, and damaged internal drainage that could cause flooding." },
      { icon: "🔥", title: "Central Heating", desc: "Assistance for failure or complete breakdown of the primary heating system — no seasonal restrictions." },
      { icon: "⚡", title: "Loss of Utilities", desc: "Help when the internal gas, electricity, or water supply fails at the property." },
      { icon: "🐛", title: "Pest Infestation", desc: "Removal of wasps, hornets, mice, rats, or cockroaches from the property." },
      { icon: "🔑", title: "Lost Keys", desc: "A qualified locksmith deployed to enable access when the only available key is lost." },
    ],
  },
  {
    id: "landlord-excess",
    category: "Let Property",
    categoryColor: "#F5A623",
    title: "Landlord Excess Protection",
    tagline: "Don't let your landlord policy excess eat into your rental profits.",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    description: "When a successful claim is made on your landlord insurance, the excess you pay can be a significant cost. Landlord Excess Protection reimburses you for that excess, with flexible cover levels from £200 to £1,000.",
    features: [
      { icon: "📊", title: "Flexible Excess Levels", desc: "Choose the right level of protection, with cover ranging from £200 up to £1,000." },
      { icon: "✅", title: "Simple Claims", desc: "Make a claim easily via the claims website or by calling the claims team on weekdays." },
      { icon: "👥", title: "Managing Agents Covered", desc: "Policies can cover managing agents, provided names match between policies." },
    ],
  },
  {
    id: "pet-damage",
    category: "Let Property",
    categoryColor: "#F5A623",
    title: "Pet Damage Protection",
    tagline: "Accept pets with confidence — your property is protected.",
    icon: "🐾",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    description: "More tenants than ever have pets, and allowing them can widen your pool of applicants. Pet Damage Protection covers up to £5,000 of damage to your fixtures, fittings, and contents caused by tenants' pets — filling the gap your core insurance leaves.",
    features: [
      { icon: "🛋️", title: "Fixtures & Fittings Cover", desc: "Protection for landlord-owned fixtures, fittings, and contents damaged by tenants' pets." },
      { icon: "💷", title: "Up to £5,000 Cover", desc: "Comprehensive cover up to £5,000 per claim for pet-related damage." },
      { icon: "✅", title: "1-Year Work Guarantee", desc: "Any permanent repair work carried out by our suppliers is guaranteed for 12 months." },
      { icon: "🔄", title: "Recoverable Costs", desc: "The cost of any claim can be passed on to your tenant." },
    ],
  },
  {
    id: "home-legal",
    category: "Personal",
    categoryColor: "#5B4FBE",
    title: "Home Legal Protection",
    tagline: "Protecting your home, your family, and your rights.",
    icon: "🏡",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    description: "Home Legal Protection provides comprehensive legal cover for you and your family. From property disputes to employment issues, identity theft to social media defamation — you'll have expert support when you need it.",
    features: [
      { icon: "🏠", title: "Home Disputes", desc: "Legal support for physical damage to your home, personal property, or infringement of home rights." },
      { icon: "🏘️", title: "Property Sale & Purchase", desc: "Pursue or defend legal action from a breach of contract for the sale or purchase of your home." },
      { icon: "🛒", title: "Consumer Disputes", desc: "Defence in matters connected to the purchasing and selling of personal goods or services." },
      { icon: "📊", title: "Tax Protection", desc: "Accountancy fees covered if you're subject to an HMRC Full Enquiry." },
      { icon: "👥", title: "Employment Disputes", desc: "Legal support for claims of unfair dismissal or unfair selection for redundancy." },
      { icon: "🔐", title: "Identity Theft", desc: "Defence following an incident of ID theft, supported by a dedicated helpline." },
      { icon: "🩹", title: "Personal Injury", desc: "Pursue civil claims for injuries caused by the negligence of another." },
      { icon: "📱", title: "Social Media Defamation", desc: "Support if you're subjected to defamation via social media platforms." },
    ],
  },
  {
    id: "home-emergency",
    category: "Personal",
    categoryColor: "#5B4FBE",
    title: "Home Emergency",
    tagline: "When emergencies strike at home, help is just a phone call away.",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    description: "Working alongside your existing household buildings or contents policy, Home Emergency covers the cost of emergency call-out charges, labour, parts, and materials when unexpected problems hit your home.",
    features: [
      { icon: "🚿", title: "Plumbing & Drainage", desc: "Leaking pipes, blocked drains, and leaking radiators covered." },
      { icon: "🔥", title: "Heating", desc: "Sudden failure of your central heating system or boiler." },
      { icon: "⚡", title: "Loss of Utilities", desc: "Internal failure of your gas, electricity, or water supply." },
      { icon: "🏠", title: "Roofing", desc: "Sudden and unforeseen roofing issues that need immediate attention." },
      { icon: "🐛", title: "Pest Infestation", desc: "Removal of wasps, mice, rats, and cockroaches from your home." },
      { icon: "🔒", title: "Security", desc: "Cover for damaged windows, doors, and lost keys to keep your home secure." },
    ],
  },
  {
    id: "home-excess",
    category: "Personal",
    categoryColor: "#5B4FBE",
    title: "Home Excess Protection",
    tagline: "Safeguard yourself against unexpected home insurance excess costs.",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
    description: "When you need to claim on your home insurance, the excess can come at the worst possible time. Home Excess Protection lets you choose the right level of cover — from £50 to £2,000 — so you're never caught out by unexpected costs.",
    features: [
      { icon: "📊", title: "Flexible Cover Levels", desc: "Choose protection from £50 right through to £2,000 to match your home policy excess." },
      { icon: "🏡", title: "Outbuildings Covered", desc: "Any outbuildings and their contents covered under your main home insurance are included." },
      { icon: "🔄", title: "Multiple Claims", desc: "Cover continues throughout the policy period until your chosen aggregate limit is reached." },
      { icon: "✅", title: "Easy Claims Process", desc: "Make a claim online or call our friendly claims team during weekdays." },
    ],
  },
];

const CATEGORIES = [
  { name: "Motor", color: "#E91E8B", icon: "🚗" },
  { name: "Commercial", color: "#00A69C", icon: "🏢" },
  { name: "Let Property", color: "#F5A623", icon: "🏘️" },
  { name: "Personal", color: "#5B4FBE", icon: "🏡" },
];

const CLAIMS_PRODUCTS = [
  {
    id: "motor-legal-claims",
    title: "Motor Legal / Alps Complete",
    icon: "🚗",
    color: "#E91E8B",
    headline: "In the event of an accident",
    claimsPhone: "01260 241000",
    steps: [
      "Check that everyone is okay — if anyone is injured, call 999 immediately for an ambulance and the police.",
      "Move to a safe place, providing you are not seriously injured.",
      "Take photographs of the scene — include all vehicles involved and any visible damage.",
      "Record the following: date and time of the accident, third party details (name, registration, vehicle make/model), and any witness details.",
    ],
    footerNote: "You can track your claim online using the Valid8 portal at valid8.alpsltd.co.uk",
  },
  {
    id: "road-rescue-claims",
    title: "Road Rescue (Breakdown)",
    icon: "🔧",
    color: "#0891B2",
    headline: "In the event of a breakdown",
    claimsPhone: "+44 1260 547059",
    steps: [
      "Call the number above.",
      "Quote your vehicle registration — that's all you need.",
    ],
    footerNote: null,
  },
  {
    id: "landlord-legal-claims",
    title: "Landlord Legal",
    icon: "🏘️",
    color: "#F5A623",
    headline: "Making a Landlord Legal claim",
    claimsPhone: "01260 241000",
    steps: [
      "Call the number above and follow the prompts for Landlord Legal claims.",
      "Have your policy number or postcode ready so the team can locate your policy.",
      "The team will guide you through setting up your claim.",
    ],
    footerNote: null,
  },
];

// ═══════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function adjustColor(hex, lightness) { const hsl = hexToHSL(hex); return `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`; }
const FONT = "'Segoe UI', system-ui, -apple-system, sans-serif";
const PROFILE_FIELDS = ["brokerName", "logoUrl", "brandColor", "secondaryColor", "fcaNumber", "phone", "email"];
function profileCompleteness(p) { if (!p) return 0; return PROFILE_FIELDS.filter(k => p[k]).length; }

// ═══════════════════════════════════════════════
// RESPONSIVE STYLES INJECTOR
// ═══════════════════════════════════════════════
function GlobalStyles() {
  useEffect(() => {
    const id = "alps-global-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes fadeInUp { from { opacity:0; transform:translate(-50%,20px); } to { opacity:1; transform:translate(-50%,0); } }
      @media (max-width: 640px) {
        .alps-topnav { flex-wrap: wrap !important; height: auto !important; padding: 10px 16px !important; gap: 8px !important; }
        .alps-topnav .alps-nav-pills { flex-wrap: wrap !important; justify-content: center !important; }
        .alps-tool-grid { grid-template-columns: 1fr !important; }
        .alps-claims-grid { grid-template-columns: 1fr !important; }
        .alps-preview-row { flex-direction: column !important; align-items: center !important; }
        .alps-pricing-grid { grid-template-columns: 1fr !important; }
        .alps-profile-2col { grid-template-columns: 1fr !important; }
        .alps-sheet-features { grid-template-columns: 1fr !important; }
        .alps-sheet-body { flex-direction: column !important; }
        .alps-sheet-img { flex: none !important; height: 180px !important; width: 100% !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}

// ═══════════════════════════════════════════════
// TOPNAV
// ═══════════════════════════════════════════════
function TopNav({ title }) {
  const location = useLocation();
  const tools = [
    { path: "/product-sheet-generator", label: "Product Sheets" },
    { path: "/claims-guidance-card", label: "Claims Cards" },
    { path: "/email-templates", label: "Email Templates" },
  ];
  return (
    <div className="alps-topnav" style={{
      background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      position: "sticky", top: 0, zIndex: 100, height: 56, fontFamily: FONT,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link to="/" style={{
          width: 34, height: 34, borderRadius: 8, background: "#f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "center",
          textDecoration: "none", fontSize: 18, border: "1px solid #e2e8f0",
        }}>🏠</Link>
        <span style={{ color: "#cbd5e1", fontSize: 14 }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{title}</span>
      </div>
      <div className="alps-nav-pills" style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {tools.map((t) => (
          <Link key={t.path} to={t.path} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            textDecoration: "none",
            background: location.pathname === t.path ? "#1e293b" : "#f1f5f9",
            color: location.pathname === t.path ? "#fff" : "#64748b",
            border: `1px solid ${location.pathname === t.path ? "#1e293b" : "#e2e8f0"}`,
          }}>{t.label}</Link>
        ))}
        <Link to="/broker-profile" style={{
          padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
          textDecoration: "none", background: "#231d68", color: "#fff", marginLeft: 4,
        }}>⚙️ Branding Settings</Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ONBOARDING WIZARD
// ═══════════════════════════════════════════════
function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    brokerName: "", logoUrl: "", brandColor: "#1a3a5c", secondaryColor: "#E91E8B",
    fcaNumber: "", phone: "", email: "", website: "", footerMessage: "",
  });
  const fileRef = useRef(null);
  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) { const r = new FileReader(); r.onload = (ev) => setForm(f => ({ ...f, logoUrl: ev.target.result })); r.readAsDataURL(file); }
  };
  const inputStyle = { width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 };

  const steps = [
    // Step 1: Name + Contact
    <div key="s1" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>👋</div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Welcome! Let's get you set up</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>First, tell us about your brokerage.</p>
      </div>
      <div>
        <label style={labelStyle}>Firm / Trading Name *</label>
        <input style={inputStyle} placeholder="e.g. Smith & Partners Insurance" value={form.brokerName} onChange={(e) => setForm(f => ({ ...f, brokerName: e.target.value }))} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="alps-profile-2col">
        <div><label style={labelStyle}>Phone</label><input style={inputStyle} placeholder="01234 567890" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
        <div><label style={labelStyle}>Email</label><input style={inputStyle} placeholder="info@broker.co.uk" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} /></div>
      </div>
      <div><label style={labelStyle}>FCA Reference Number</label><input style={inputStyle} placeholder="e.g. 123456" value={form.fcaNumber} onChange={(e) => setForm(f => ({ ...f, fcaNumber: e.target.value }))} /></div>
    </div>,
    // Step 2: Logo + Colours
    <div key="s2" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎨</div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Your branding</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Upload your logo and pick your brand colours.</p>
      </div>
      <div>
        <label style={labelStyle}>Logo</label>
        <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #cbd5e1", borderRadius: 10, padding: "24px 16px", textAlign: "center", cursor: "pointer", background: "#f8fafc" }}>
          {form.logoUrl ? <div><img src={form.logoUrl} alt="Logo" style={{ maxHeight: 60, maxWidth: 220, objectFit: "contain" }} /><div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>Click to change</div></div>
          : <div><div style={{ fontSize: 32, marginBottom: 4 }}>📤</div><div style={{ fontSize: 13, color: "#64748b" }}>Click to upload your logo</div></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogo} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="alps-profile-2col">
        <div>
          <label style={labelStyle}>Primary Colour</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="color" value={form.brandColor} onChange={(e) => setForm(f => ({ ...f, brandColor: e.target.value }))} style={{ width: 48, height: 40, border: "2px solid #e2e8f0", borderRadius: 8, cursor: "pointer", padding: 2 }} />
            <input style={{ ...inputStyle, flex: 1 }} value={form.brandColor} onChange={(e) => setForm(f => ({ ...f, brandColor: e.target.value }))} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Secondary Colour</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="color" value={form.secondaryColor} onChange={(e) => setForm(f => ({ ...f, secondaryColor: e.target.value }))} style={{ width: 48, height: 40, border: "2px solid #e2e8f0", borderRadius: 8, cursor: "pointer", padding: 2 }} />
            <input style={{ ...inputStyle, flex: 1 }} value={form.secondaryColor} onChange={(e) => setForm(f => ({ ...f, secondaryColor: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>,
    // Step 3: Review
    <div key="s3" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Looking good!</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Here's a preview of your branding. You can always edit these later.</p>
      </div>
      <div style={{ background: `linear-gradient(135deg, ${form.brandColor} 0%, ${adjustColor(form.brandColor, 30)} 100%)`, borderRadius: 14, padding: "28px 24px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          {form.logoUrl && <div style={{ background: "#fff", borderRadius: 8, padding: "6px 12px", display: "inline-flex" }}><img src={form.logoUrl} alt="" style={{ maxHeight: 30, objectFit: "contain" }} /></div>}
          <span style={{ fontSize: 12, opacity: 0.7 }}>Preview</span>
        </div>
        <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{form.brokerName || "Your Brokerage"}</h3>
        <div style={{ fontSize: 12, opacity: 0.8, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {form.phone && <span>📞 {form.phone}</span>}
          {form.email && <span>✉️ {form.email}</span>}
          {form.fcaNumber && <span>FCA: {form.fcaNumber}</span>}
        </div>
      </div>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: FONT }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: "40px 36px", boxShadow: "0 8px 48px rgba(0,0,0,0.08)", maxWidth: 520, width: "100%" }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? form.brandColor : "#e2e8f0", transition: "background 0.3s" }} />
          ))}
        </div>
        {steps[step]}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#64748b" }}>← Back</button>
          ) : <div />}
          {step < 2 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.brokerName} style={{
              padding: "12px 28px", borderRadius: 10, border: "none",
              background: (step === 0 && !form.brokerName) ? "#cbd5e1" : `linear-gradient(135deg, ${form.brandColor} 0%, ${adjustColor(form.brandColor, 30)} 100%)`,
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: (step === 0 && !form.brokerName) ? "not-allowed" : "pointer",
            }}>Next →</button>
          ) : (
            <button onClick={() => onComplete(form)} style={{
              padding: "12px 28px", borderRadius: 10, border: "none",
              background: `linear-gradient(135deg, ${form.brandColor} 0%, ${adjustColor(form.brandColor, 30)} 100%)`,
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>🚀 Launch Toolkit</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// HOMEPAGE
// ═══════════════════════════════════════════════
function HomePage() {
  const { profile } = useBrokerProfile();
  const completeness = profileCompleteness(profile);
  const pct = Math.round((completeness / PROFILE_FIELDS.length) * 100);
  const count = useCounter();

  const tools = [
    { path: "/product-sheet-generator", title: "Product Sheet Generator", desc: "Create branded product PDFs for your clients", icon: "📄", color: "#E91E8B" },
    { path: "/claims-guidance-card", title: "Claims Guidance Card", desc: "Generate branded claims cards for your clients at point of sale", icon: "📋", color: "#0891B2" },
    { path: "/email-templates", title: "Email Templates", desc: "Branded, ready-to-send emails for every stage of the client journey", icon: "✉️", color: "#7c3aed" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)", fontFamily: FONT }}>
      <div style={{ padding: "48px 24px 20px", textAlign: "center" }}>
        <img src={ALPS_LOGO} alt="Alps" style={{ height: 48, objectFit: "contain", marginBottom: 20 }} />
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1e293b", margin: "0 0 8px", letterSpacing: -1 }}>Broker Toolkit</h1>
        <p style={{ fontSize: 16, color: "#64748b", margin: 0, maxWidth: 460, marginInline: "auto", lineHeight: 1.6 }}>Everything your team needs to support and win clients</p>
        {count !== null && count > 0 && (
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 24, background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 14 }}>🚀</span>
            <span style={{ fontSize: 14, color: "#64748b" }}><strong style={{ color: "#1e293b", fontSize: 16 }}>{count.toLocaleString()}</strong> broker tools used and counting</span>
          </div>
        )}
      </div>

      {/* Profile bar */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        {profile ? (
          <Link to="/broker-profile" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "10px 20px", borderRadius: 24,
            background: "#fff", border: "1px solid #e2e8f0",
            fontSize: 13, color: "#64748b", textDecoration: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            {profile.logoUrl && <img src={profile.logoUrl} alt="" style={{ height: 20, borderRadius: 4 }} />}
            <span style={{ fontWeight: 600, color: "#1e293b" }}>{profile.brokerName}</span>
            {pct < 100 && (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{pct}% complete</span>
                <div style={{ width: 48, height: 4, borderRadius: 2, background: "#e2e8f0", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#16a34a", borderRadius: 2 }} />
                </div>
              </span>
            )}
            <span style={{ color: "#94a3b8" }}>· Edit</span>
          </Link>
        ) : (
          <Link to="/broker-profile" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 22px", borderRadius: 24,
            background: "linear-gradient(135deg, #E91E8B 0%, #F5A623 100%)",
            fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none",
          }}>Set Up Your Broker Profile →</Link>
        )}
      </div>

      {/* Tool cards */}
      <div className="alps-tool-grid" style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {tools.map((tool) => (
          <Link key={tool.path} to={tool.path} style={{
            textDecoration: "none", background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: 16, padding: "32px 28px", display: "block",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = tool.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${tool.color}15`; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${tool.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>{tool.icon}</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{tool.title}</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>{tool.desc}</p>
          </Link>
        ))}
        <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 16, padding: "32px 28px", opacity: 0.6 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18, color: "#94a3b8" }}>🔜</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#94a3b8" }}>More Tools Coming Soon</h3>
          <p style={{ margin: 0, fontSize: 14, color: "#94a3b8", lineHeight: 1.5 }}>We're building more tools to help you win and support clients.</p>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "0 24px 40px" }}>
        <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 4px" }}>If you experience any problems, or require any assistance, please get in touch with marketing at <a href="mailto:tom.thomas@alpsltd.co.uk" style={{ color: "#64748b" }}>tom.thomas@alpsltd.co.uk</a></p>
        <p style={{ fontSize: 9, color: "#cbd5e1" }}>v2.0</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// BROKER PROFILE PAGE
// ═══════════════════════════════════════════════
function BrokerProfilePage() {
  const { profile, saveProfile } = useBrokerProfile();
  const [form, setForm] = useState(profile || {
    brokerName: "", logoUrl: "", brandColor: "#1a3a5c", secondaryColor: "#E91E8B",
    fcaNumber: "", phone: "", email: "", website: "", footerMessage: "",
  });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);
  const handleLogo = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setForm(prev => ({ ...prev, logoUrl: ev.target.result })); r.readAsDataURL(f); } };
  const handleSave = () => { saveProfile(form); setSaved(true); setTimeout(() => setSaved(false), 3000); trackEvent("profile_saved", "profile", form.brokerName); };
  const inputStyle = { width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: FONT }}>
      <TopNav title="Broker Profile" />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "36px 20px 60px" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#1e293b" }}>Your Broker Profile</h2>
            <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>These details are applied across all tools automatically.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div><label style={labelStyle}>Firm / Trading Name *</label><input style={inputStyle} placeholder="e.g. Smith & Partners" value={form.brokerName} onChange={(e) => setForm(f => ({ ...f, brokerName: e.target.value }))} /></div>
            <div>
              <label style={labelStyle}>Your Logo</label>
              <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #cbd5e1", borderRadius: 10, padding: "20px 16px", textAlign: "center", cursor: "pointer", background: "#f8fafc" }}>
                {form.logoUrl ? <div><img src={form.logoUrl} alt="Logo" style={{ maxHeight: 50, maxWidth: 200, objectFit: "contain" }} /><div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>Click to change</div></div>
                : <div><div style={{ fontSize: 28, marginBottom: 4 }}>📤</div><div style={{ fontSize: 13, color: "#64748b" }}>Click to upload your logo</div></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogo} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="alps-profile-2col">
              <div><label style={labelStyle}>Primary Colour</label><div style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="color" value={form.brandColor} onChange={(e) => setForm(f => ({ ...f, brandColor: e.target.value }))} style={{ width: 48, height: 40, border: "2px solid #e2e8f0", borderRadius: 8, cursor: "pointer", padding: 2 }} /><input style={{ ...inputStyle, flex: 1 }} value={form.brandColor} onChange={(e) => setForm(f => ({ ...f, brandColor: e.target.value }))} /></div></div>
              <div><label style={labelStyle}>Secondary Colour</label><div style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="color" value={form.secondaryColor} onChange={(e) => setForm(f => ({ ...f, secondaryColor: e.target.value }))} style={{ width: 48, height: 40, border: "2px solid #e2e8f0", borderRadius: 8, cursor: "pointer", padding: 2 }} /><input style={{ ...inputStyle, flex: 1 }} value={form.secondaryColor} onChange={(e) => setForm(f => ({ ...f, secondaryColor: e.target.value }))} /></div></div>
            </div>
            <div><label style={labelStyle}>FCA Reference Number</label><input style={inputStyle} placeholder="e.g. 123456" value={form.fcaNumber} onChange={(e) => setForm(f => ({ ...f, fcaNumber: e.target.value }))} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="alps-profile-2col">
              <div><label style={labelStyle}>Phone Number</label><input style={inputStyle} placeholder="01234 567890" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><label style={labelStyle}>Email Address</label><input style={inputStyle} placeholder="info@broker.co.uk" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            </div>
            <div><label style={labelStyle}>Website URL (optional)</label><input style={inputStyle} placeholder="www.broker.co.uk" value={form.website} onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))} /></div>
            <div><label style={labelStyle}>Footer Message (optional)</label><input style={inputStyle} placeholder="e.g. Protecting families since 1998" value={form.footerMessage} onChange={(e) => setForm(f => ({ ...f, footerMessage: e.target.value }))} /><p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>Shown at the bottom of your product sheets and claims cards.</p></div>
            <button onClick={handleSave} disabled={!form.brokerName} style={{ width: "100%", padding: "16px 24px", background: form.brokerName ? `linear-gradient(135deg, ${form.brandColor} 0%, ${adjustColor(form.brandColor, 30)} 100%)` : "#cbd5e1", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: form.brokerName ? "pointer" : "not-allowed" }}>{saved ? "✓ Profile Saved!" : "Save Profile"}</button>
            <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", margin: 0, lineHeight: 1.6 }}>Your details are saved locally on this device. You'll need to re-enter them if using a different browser or device.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PRODUCT SHEET COMPONENT
// ═══════════════════════════════════════════════
function ProductSheet({ product, config }) {
  const brandColor = config.brandColor || "#1a3a5c";
  const lightBg = adjustColor(brandColor, 95);
  const medBg = adjustColor(brandColor, 88);
  const darkText = adjustColor(brandColor, 15);
  return (
    <div style={{ width: "100%", maxWidth: 850, margin: "0 auto 40px", background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontFamily: FONT, pageBreakAfter: "always" }}>
      <div style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, 30)} 100%)`, padding: "36px 40px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "#fff", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}><span>{product.icon}</span>{product.category} Add-On</div>
          {config.logoUrl && <div style={{ background: "#fff", borderRadius: 10, padding: "6px 14px", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}><img src={config.logoUrl} alt={config.brokerName} style={{ maxHeight: 36, maxWidth: 150, objectFit: "contain", display: "block" }} onError={(e) => { e.target.parentElement.style.display = "none"; }} /></div>}
        </div>
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: -0.5 }}>{product.title}</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
          <p style={{ margin: "10px 0 0", fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, maxWidth: 600, flex: 1 }}>{product.tagline}</p>
          {config.showPricing && config.prices[product.id] && (
            <div style={{ background: "#fff", borderRadius: 12, padding: "8px 18px", textAlign: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>From</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: brandColor, lineHeight: 1.1 }}>£{config.prices[product.id]}</div>
              <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>per year</div>
            </div>
          )}
        </div>
      </div>
      <div className="alps-sheet-body" style={{ display: "flex", gap: 0 }}>
        <div className="alps-sheet-img" style={{ flex: "0 0 280px", minHeight: 200, backgroundImage: `url(${product.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ flex: 1, padding: "28px 32px" }}><p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "#444" }}>{product.description}</p></div>
      </div>
      <div style={{ padding: "24px 32px 28px", background: lightBg }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 18, fontWeight: 700, color: darkText, display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 32, height: 3, background: brandColor, borderRadius: 2, display: "inline-block" }} />What's Covered</h3>
        <div className="alps-sheet-features" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {product.features.map((feature, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start", border: `1px solid ${medBg}` }}>
              <span style={{ fontSize: 22, flexShrink: 0, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: lightBg, borderRadius: 8 }}>{feature.icon}</span>
              <div><div style={{ fontWeight: 700, fontSize: 13.5, color: darkText, marginBottom: 3 }}>{feature.title}</div><div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.55 }}>{feature.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "18px 32px", background: adjustColor(brandColor, 97), borderTop: `1px solid ${medBg}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {config.brokerName && <span style={{ fontSize: 13, fontWeight: 700, color: darkText }}>{config.brokerName}</span>}
          {config.phone && <span style={{ fontSize: 13, color: "#555" }}>📞 {config.phone}</span>}
          {config.email && <span style={{ fontSize: 13, color: "#555" }}>✉️ {config.email}</span>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          {config.fcaNumber && <span style={{ fontSize: 10.5, color: "#999" }}>Authorised & Regulated by the FCA | Ref: {config.fcaNumber}</span>}
          {config.footerMessage && <span style={{ fontSize: 10.5, color: "#888", fontStyle: "italic" }}>{config.footerMessage}</span>}
        </div>
      </div>
    </div>
  );
}

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
      <button onClick={() => setSelectedCategory(null)} style={{ padding: "8px 20px", borderRadius: 24, border: `2px solid ${!selectedCategory ? "#1e293b" : "#e2e8f0"}`, background: !selectedCategory ? "#1e293b" : "#fff", color: !selectedCategory ? "#fff" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>All ({PRODUCTS.length})</button>
      {CATEGORIES.map((cat) => { const c = PRODUCTS.filter(p => p.category === cat.name).length; return (
        <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} style={{ padding: "8px 20px", borderRadius: 24, border: `2px solid ${selectedCategory === cat.name ? cat.color : "#e2e8f0"}`, background: selectedCategory === cat.name ? cat.color : "#fff", color: selectedCategory === cat.name ? "#fff" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{cat.icon} {cat.name} ({c})</button>
      ); })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// PRODUCT SHEET GENERATOR (with preview nav)
// ═══════════════════════════════════════════════
function ProductSheetGenerator() {
  const { profile } = useBrokerProfile();
  const { show, ToastUI } = useToast();
  const [config, setConfig] = useState(() => {
    let savedPrices = {};
    try { const sp = localStorage.getItem("alps_prices"); if (sp) savedPrices = JSON.parse(sp); } catch {}
    return {
      brokerName: profile?.brokerName || "", logoUrl: profile?.logoUrl || "",
      phone: profile?.phone || "", email: profile?.email || "",
      fcaNumber: profile?.fcaNumber || "", brandColor: profile?.brandColor || "#1a3a5c",
      footerMessage: profile?.footerMessage || "", showPricing: Object.keys(savedPrices).length > 0,
      prices: savedPrices,
    };
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set(PRODUCTS.map(p => p.id)));
  const [previewIdx, setPreviewIdx] = useState(0);
  const printRef = useRef(null);

  // Persist prices
  useEffect(() => { try { localStorage.setItem("alps_prices", JSON.stringify(config.prices)); } catch {} }, [config.prices]);

  const filteredProducts = PRODUCTS.filter(p => (!selectedCategory || p.category === selectedCategory) && selectedProducts.has(p.id));
  const toggleProduct = (id) => { setSelectedProducts(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); setPreviewIdx(0); };

  const handlePrint = useCallback(() => {
    const pw = window.open("", "_blank");
    if (!pw) { show("Pop-up blocked — please allow pop-ups for this site and try again.", "error"); return; }
    const content = printRef.current?.innerHTML || "";
    pw.document.write(`<!DOCTYPE html><html><head><title>${config.brokerName} - Product Sheets</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',system-ui,sans-serif;background:#fff;}@media print{body{background:#fff;}@page{margin:0.5cm;size:A4;}}</style></head><body>${content}</body></html>`);
    pw.document.close();
    setTimeout(() => pw.print(), 500);
    show("Your sheets are ready — check the new tab! 🎉");
    trackEvent("sheets_generated", "product_sheets", config.brokerName, filteredProducts.length);
    incrementCounter();
  }, [config.brokerName, show]);

  const hasProfile = config.brokerName;
  const inputStyle = { width: "100%", padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff", boxSizing: "border-box" };
  const currentProduct = filteredProducts[previewIdx] || null;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: FONT }}>
      <TopNav title="Product Sheet Generator" />
      <ToastUI />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#1e293b" }}>Product Sheet Generator</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Select products below to preview and export branded marketing sheets.</p>
        </div>

        {!profile && !config.brokerName && (
          <div style={{ background: "#fff", border: "2px solid #F5A623", borderRadius: 12, padding: "24px", textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Set Up Your Broker Profile First</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>Your branding details are needed to generate product sheets.</p>
            <Link to="/broker-profile" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #E91E8B 0%, #F5A623 100%)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Complete Your Profile →</Link>
          </div>
        )}

        {/* Pricing Toggle */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 28, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }} onClick={() => setConfig(c => ({ ...c, showPricing: !c.showPricing }))}>
            <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${config.showPricing ? config.brandColor : "#cbd5e1"}`, background: config.showPricing ? config.brandColor : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {config.showPricing && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
            </div>
            <div><span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Would you like to add pricing to these flyers?</span><span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>Only products with a price filled in will display it</span></div>
          </label>
          {config.showPricing && (
            <div className="alps-pricing-grid" style={{ marginTop: 16, padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, maxHeight: 280, overflowY: "auto" }}>
              {PRODUCTS.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 7, color: "#fff", background: p.categoryColor, borderRadius: 3, padding: "1px 5px", fontWeight: 700, textTransform: "uppercase", flexShrink: 0, width: 60, textAlign: "center" }}>{p.category}</span>
                  <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
                  <div style={{ position: "relative", flexShrink: 0, width: 80 }}>
                    <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>£</span>
                    <input style={{ ...inputStyle, padding: "6px 8px 6px 20px", fontSize: 11, width: 80, textAlign: "right" }} type="text" placeholder="—" value={config.prices[p.id] || ""} onChange={(e) => setConfig(c => ({ ...c, prices: { ...c.prices, [p.id]: e.target.value } }))} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasProfile && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
            <button onClick={handlePrint} style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${config.brandColor} 0%, ${adjustColor(config.brandColor, 30)} 100%)`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🖨️ Print / Save as PDF ({filteredProducts.length} sheets)</button>
          </div>
        )}

        {hasProfile && (
          <div style={{ maxWidth: 650, margin: "0 auto 28px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>📄</span>
            <div style={{ fontSize: 11.5, color: "#475569", lineHeight: 1.7 }}><strong>1.</strong> Click <strong>'Print / Save as PDF'</strong> above. <strong>2.</strong> Change <strong>'Destination'</strong> to <strong>'Save as PDF'</strong>. <strong>3.</strong> Ensure both <strong>'Headers and Footers'</strong> and <strong>'Background Graphics'</strong> are selected. <strong>4.</strong> Hit <strong>'Save'</strong> and that's it! 🎉</div>
          </div>
        )}

        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <div style={{ textAlign: "center", marginBottom: 14 }}><p style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Select which products you'd like to generate flyers for:</p></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 32, maxWidth: 900, margin: "0 auto 32px" }}>
          {PRODUCTS.filter(p => !selectedCategory || p.category === selectedCategory).map(p => (
            <button key={p.id} onClick={() => toggleProduct(p.id)} style={{ padding: "5px 12px", borderRadius: 16, border: `1.5px solid ${selectedProducts.has(p.id) ? p.categoryColor : "#e2e8f0"}`, background: selectedProducts.has(p.id) ? `${p.categoryColor}15` : "#fff", fontSize: 11.5, fontWeight: 600, cursor: "pointer", color: selectedProducts.has(p.id) ? p.categoryColor : "#94a3b8" }}>
              {selectedProducts.has(p.id) ? "✓ " : ""}{p.title}
            </button>
          ))}
        </div>

        {/* Preview navigation */}
        {filteredProducts.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <button onClick={() => setPreviewIdx(i => Math.max(0, i - 1))} disabled={previewIdx === 0} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: previewIdx === 0 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, color: previewIdx === 0 ? "#cbd5e1" : "#475569" }}>← Prev</button>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{previewIdx + 1} of {filteredProducts.length}</span>
            <button onClick={() => setPreviewIdx(i => Math.min(filteredProducts.length - 1, i + 1))} disabled={previewIdx >= filteredProducts.length - 1} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: previewIdx >= filteredProducts.length - 1 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, color: previewIdx >= filteredProducts.length - 1 ? "#cbd5e1" : "#475569" }}>Next →</button>
          </div>
        )}

        {/* Single preview */}
        {currentProduct && <ProductSheet product={currentProduct} config={config} />}

        {/* Hidden print container with ALL selected */}
        <div ref={printRef} style={{ display: "none" }}>
          {filteredProducts.map(product => <ProductSheet key={product.id} product={product} config={config} />)}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>No products selected</p>
            <p style={{ fontSize: 13 }}>Toggle products above to include them in your sheets.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// CLAIMS CARD PREVIEW
// ═══════════════════════════════════════════════
function ClaimsCardPreview({ product, profile, format }) {
  const brandColor = profile.brandColor || "#1a3a5c";
  const isBC = format === "business-card";
  if (isBC) {
    return (
      <div style={{ width: "100%", maxWidth: 425, minHeight: 275, background: "#fff", borderRadius: 8, overflow: "hidden", fontFamily: FONT, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
        <div style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, 30)} 100%)`, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {profile.logoUrl && <div style={{ background: "#fff", borderRadius: 6, padding: "4px 8px", display: "inline-flex" }}><img src={profile.logoUrl} alt="" style={{ maxHeight: 18, objectFit: "contain" }} /></div>}
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{product.title}</span>
        </div>
        <div style={{ flex: 1, padding: "8px 16px 6px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 6 }}><div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 5px", fontSize: 12, fontWeight: 800, color: "#1e293b" }}>{product.headline}</h3>
            <div style={{ background: `${product.color}10`, borderRadius: 6, padding: "5px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Claims Line</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: product.color, letterSpacing: 0.5 }}>{product.claimsPhone}</div>
            </div>
          </div></div>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#64748b", marginBottom: 3 }}>What to do:</div>
            {product.steps.map((step, i) => <div key={i} style={{ display: "flex", gap: 5, alignItems: "flex-start", marginBottom: 2 }}><span style={{ fontSize: 7, fontWeight: 800, color: product.color, flexShrink: 0, minWidth: 10 }}>{i+1}.</span><span style={{ fontSize: 7, color: "#475569", lineHeight: 1.4 }}>{step}</span></div>)}
          </div>
          {product.footerNote && <div style={{ fontSize: 6.5, color: "#94a3b8", fontStyle: "italic", marginBottom: 4, lineHeight: 1.4 }}>💡 {product.footerNote}</div>}
          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: 7, color: "#94a3b8", lineHeight: 1.5 }}>{profile.phone && <div>📞 {profile.phone}</div>}{profile.email && <div>✉️ {profile.email}</div>}</div>
            {profile.footerMessage && <span style={{ fontSize: 6, color: "#b0b8c4", fontStyle: "italic" }}>{profile.footerMessage}</span>}
          </div>
        </div>
      </div>
    );
  }
  // A5
  return (
    <div style={{ width: "100%", maxWidth: 500, minHeight: 700, background: "#fff", borderRadius: 12, overflow: "hidden", fontFamily: FONT, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, 30)} 100%)`, padding: "28px 32px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          {profile.logoUrl && <div style={{ background: "#fff", borderRadius: 8, padding: "6px 12px", display: "inline-flex" }}><img src={profile.logoUrl} alt="" style={{ maxHeight: 32, objectFit: "contain" }} /></div>}
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{product.title}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{product.headline}</h2>
      </div>
      <div style={{ padding: "20px 32px", background: `${product.color}08`, borderBottom: `2px solid ${product.color}20`, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Claims Line</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: product.color, letterSpacing: 0.5 }}>{product.claimsPhone}</div>
      </div>
      <div style={{ flex: 1, padding: "24px 32px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#1e293b" }}>What to do:</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {product.steps.map((step, i) => <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: `${product.color}15`, color: product.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{i+1}</div>
            <p style={{ margin: 0, fontSize: 13.5, color: "#334155", lineHeight: 1.6, paddingTop: 3 }}>{step}</p>
          </div>)}
        </div>
        {product.footerNote && (
          <div style={{ marginTop: 20, padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, color: "#64748b", lineHeight: 1.5, fontStyle: "italic" }}>
            💡 {product.footerNote.includes("valid8.alpsltd.co.uk") ? <>{product.footerNote.split("valid8.alpsltd.co.uk")[0]}<a href="https://valid8.alpsltd.co.uk" target="_blank" rel="noopener noreferrer" style={{ color: "#0891B2", fontWeight: 600 }}>valid8.alpsltd.co.uk</a>{product.footerNote.split("valid8.alpsltd.co.uk")[1]}</> : product.footerNote}
          </div>
        )}
      </div>
      <div style={{ padding: "16px 32px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafbfc" }}>
        <div style={{ fontSize: 12, color: "#64748b" }}>{profile.phone && <span style={{ marginRight: 12 }}>📞 {profile.phone}</span>}{profile.email && <span>✉️ {profile.email}</span>}</div>
        {profile.footerMessage && <span style={{ fontSize: 9, color: "#94a3b8", fontStyle: "italic" }}>{profile.footerMessage}</span>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// CLAIMS GUIDANCE CARD PAGE
// ═══════════════════════════════════════════════
function ClaimsGuidanceCard() {
  const { profile } = useBrokerProfile();
  const { show, ToastUI } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewFormat, setPreviewFormat] = useState("a5");

  const handleExport = (format, product) => {
    if (!product || !profile) return;
    const pw = window.open("", "_blank");
    if (!pw) { show("Pop-up blocked — please allow pop-ups for this site.", "error"); return; }
    const brandColor = profile.brandColor || "#1a3a5c";
    const isBC = format === "business-card";
    const pageSize = isBC ? "85mm 55mm" : "148mm 210mm";
    const stepsHTML = product.steps.map((step, i) => `<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px;"><div style="width:28px;height:28px;border-radius:8px;flex-shrink:0;background:${product.color}22;color:${product.color};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;">${i+1}</div><p style="margin:0;font-size:13.5px;color:#334155;line-height:1.6;padding-top:3px;">${step}</p></div>`).join("");
    const stepsHTMLCompact = product.steps.map((step, i) => `<div style="display:flex;gap:4px;align-items:flex-start;margin-bottom:1px;"><span style="font-size:6px;font-weight:800;color:${product.color};flex-shrink:0;min-width:8px;">${i+1}.</span><span style="font-size:6px;color:#475569;line-height:1.4;">${step}</span></div>`).join("");
    const footerNoteHTML = product.footerNote ? product.footerNote.replace('valid8.alpsltd.co.uk', '<a href="https://valid8.alpsltd.co.uk" style="color:#0891B2;font-weight:600;">valid8.alpsltd.co.uk</a>') : "";
    let body;
    if (isBC) {
      body = `<div style="width:85mm;height:55mm;background:#fff;font-family:'Segoe UI',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;"><div style="background:linear-gradient(135deg,${brandColor} 0%,${brandColor}cc 100%);padding:6px 10px;display:flex;justify-content:space-between;align-items:center;">${profile.logoUrl ? `<div style="background:#fff;border-radius:3px;padding:2px 5px;display:inline-flex;"><img src="${profile.logoUrl}" style="max-height:12px;object-fit:contain;" /></div>` : ""}<span style="font-size:6px;color:rgba(255,255,255,0.8);font-weight:600;">${product.title}</span></div><div style="flex:1;padding:5px 10px 4px;display:flex;flex-direction:column;"><h3 style="margin:0 0 3px;font-size:9px;font-weight:800;color:#1e293b;">${product.headline}</h3><div style="background:${product.color}10;border-radius:4px;padding:3px 8px;text-align:center;margin-bottom:3px;"><div style="font-size:5px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Claims Line</div><div style="font-size:12px;font-weight:800;color:${product.color};">${product.claimsPhone}</div></div><div style="margin-bottom:2px;"><div style="font-size:6px;font-weight:700;color:#64748b;margin-bottom:1px;">What to do:</div>${stepsHTMLCompact}</div>${product.footerNote ? `<div style="font-size:5px;color:#94a3b8;font-style:italic;margin-bottom:2px;line-height:1.3;">💡 ${footerNoteHTML}</div>` : ""}<div style="margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;"><div style="font-size:5.5px;color:#94a3b8;line-height:1.4;">${profile.phone ? `<div>📞 ${profile.phone}</div>` : ""}${profile.email ? `<div>✉️ ${profile.email}</div>` : ""}</div><span style="font-size:5px;color:#cbd5e1;">${profile.footerMessage || ""}</span></div></div></div>`;
    } else {
      body = `<div style="width:148mm;min-height:210mm;background:#fff;font-family:'Segoe UI',system-ui,sans-serif;display:flex;flex-direction:column;"><div style="background:linear-gradient(135deg,${brandColor} 0%,${brandColor}cc 100%);padding:24px 28px 20px;position:relative;overflow:hidden;"><div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.06);"></div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">${profile.logoUrl ? `<div style="background:#fff;border-radius:6px;padding:5px 10px;display:inline-flex;"><img src="${profile.logoUrl}" style="max-height:28px;object-fit:contain;" /></div>` : ""}<span style="font-size:9px;color:rgba(255,255,255,0.6);font-weight:600;">${product.title}</span></div><h2 style="margin:0;font-size:24px;font-weight:800;color:#fff;line-height:1.2;">${product.headline}</h2></div><div style="padding:18px 28px;background:${product.color}08;border-bottom:2px solid ${product.color}20;text-align:center;"><div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Claims Line</div><div style="font-size:28px;font-weight:800;color:${product.color};">${product.claimsPhone}</div></div><div style="flex:1;padding:20px 28px;"><h3 style="margin:0 0 14px;font-size:13px;font-weight:700;color:#1e293b;">What to do:</h3>${stepsHTML}${product.footerNote ? `<div style="margin-top:18px;padding:10px 14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;font-size:11px;color:#64748b;line-height:1.5;font-style:italic;">💡 ${footerNoteHTML}</div>` : ""}</div><div style="padding:14px 28px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;background:#fafbfc;"><div style="font-size:11px;color:#64748b;">${profile.phone ? `<span style="margin-right:12px;">📞 ${profile.phone}</span>` : ""}${profile.email ? `<span>✉️ ${profile.email}</span>` : ""}</div><span style="font-size:8px;color:#94a3b8;font-style:italic;">${profile.footerMessage || ""}</span></div></div>`;
    }
    pw.document.write(`<!DOCTYPE html><html><head><title>${profile.brokerName} - ${product.title}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',system-ui,sans-serif;background:#fff;}@media print{body{background:#fff;}@page{margin:0;size:${pageSize};}}</style></head><body>${body}</body></html>`);
    pw.document.close();
    setTimeout(() => pw.print(), 500);
    show(`${isBC ? "Business card" : "A5 card"} ready — check the new tab! 🎉`);
    trackEvent("claims_card_exported", "claims_cards", `${product.title} - ${isBC ? "business_card" : "a5"}`);
    incrementCounter();
  };

  const handleDownloadAll = (format) => {
    if (!profile) return;
    CLAIMS_PRODUCTS.forEach((p, i) => {
      setTimeout(() => handleExport(format, p), i * 600);
    });
  };

  const product = CLAIMS_PRODUCTS.find(p => p.id === selectedProduct);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: FONT }}>
      <TopNav title="Claims Guidance Card" />
      <ToastUI />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#1e293b" }}>Claims Guidance Cards</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Select a product to preview and export branded claims cards for your clients.</p>
        </div>

        {!profile && (
          <div style={{ background: "#fff", border: "2px solid #F5A623", borderRadius: 12, padding: "24px", textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Set Up Your Broker Profile First</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>Your branding details are needed to generate claims cards.</p>
            <Link to="/broker-profile" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #E91E8B 0%, #F5A623 100%)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Complete Your Profile →</Link>
          </div>
        )}

        {/* Product selector */}
        <div className="alps-claims-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {CLAIMS_PRODUCTS.map(cp => (
            <div key={cp.id} onClick={() => setSelectedProduct(cp.id)} style={{
              background: "#fff", borderRadius: 14, padding: "24px 20px",
              border: `2px solid ${selectedProduct === cp.id ? cp.color : "#e2e8f0"}`,
              cursor: "pointer", textAlign: "center",
              boxShadow: selectedProduct === cp.id ? `0 4px 16px ${cp.color}20` : "none",
              transition: "all 0.15s",
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{cp.icon}</div>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{cp.title}</h3>
              <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{cp.headline}</p>
            </div>
          ))}
        </div>

        {/* Download All */}
        {profile && (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
            <button onClick={() => handleDownloadAll("a5")} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569" }}>📄 Download All 3 as A5</button>
            <button onClick={() => handleDownloadAll("business-card")} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569" }}>🃏 Download All 3 as Business Cards</button>
          </div>
        )}

        {product && profile && (
          <div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
              <button onClick={() => handleExport("a5", product)} style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}cc 100%)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📄 Download A5 Card</button>
              <button onClick={() => handleExport("business-card", product)} style={{ padding: "12px 24px", borderRadius: 10, border: `2px solid ${product.color}`, background: "#fff", color: product.color, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🃏 Download Business Card</button>
            </div>

            <div style={{ maxWidth: 600, margin: "0 auto 28px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>📄</span>
              <div style={{ fontSize: 11.5, color: "#475569", lineHeight: 1.7 }}><strong>1.</strong> Click a download button. <strong>2.</strong> Change <strong>'Destination'</strong> to <strong>'Save as PDF'</strong>. <strong>3.</strong> Ensure <strong>'Background Graphics'</strong> is selected. <strong>4.</strong> Hit <strong>'Save'</strong>.</div>
            </div>

            {/* Format toggle */}
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20 }}>
              {[{ key: "a5", label: "A5 Leave-Behind" }, { key: "business-card", label: "Business Card" }].map(f => (
                <button key={f.key} onClick={() => setPreviewFormat(f.key)} style={{
                  padding: "8px 20px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: previewFormat === f.key ? "#1e293b" : "#f1f5f9",
                  color: previewFormat === f.key ? "#fff" : "#64748b",
                  border: `1px solid ${previewFormat === f.key ? "#1e293b" : "#e2e8f0"}`,
                }}>{f.label}</button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <ClaimsCardPreview product={product} profile={profile} format={previewFormat} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// EMAIL TEMPLATES TOOL
// ═══════════════════════════════════════════════
const EMAIL_STAGES = [
  { id: "intro", icon: "📬", title: "Introduction & Awareness", desc: "First contact and product awareness" },
  { id: "quote", icon: "💬", title: "At Point of Quote", desc: "Follow-up after quoting" },
  { id: "sale", icon: "✅", title: "At Point of Sale", desc: "Welcome and confirmation emails" },
  { id: "midterm", icon: "🔄", title: "Mid-Term", desc: "Check-ins during the policy" },
  { id: "renewal", icon: "🔔", title: "Renewal", desc: "Renewal notices and confirmations" },
  { id: "crosssell", icon: "🔀", title: "Cross-Sell", desc: "Introduce complementary products" },
];

const PRODUCT_CLAIMS = {
  "motor-legal": { phone: "01260 241000", instruction: "In the event of an accident, check everyone is safe (call 999 if needed), move to a safe place, photograph the scene, and record third party details. Claims can be tracked via the Valid8 portal at valid8.alpsltd.co.uk" },
  "alps-complete": { phone: "01260 241000", instruction: "In the event of an accident, check everyone is safe (call 999 if needed), move to a safe place, photograph the scene, and record third party details. Claims can be tracked via the Valid8 portal at valid8.alpsltd.co.uk" },
  "road-rescue": { phone: "+44 1260 547059", instruction: "Call the number above and quote your vehicle registration — that's all you need." },
  "landlord-legal": { phone: "01260 241000", instruction: "Call the number above and follow the prompts for Landlord Legal. Have your policy number or postcode ready." },
};

function getClaimsInfo(productId) {
  if (PRODUCT_CLAIMS[productId]) return PRODUCT_CLAIMS[productId];
  return { phone: "[CLAIMS PHONE NUMBER]", instruction: "[CLAIMS INSTRUCTIONS]" };
}

function buildEmailTemplates(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const pName = product ? product.title : "[PRODUCT NAME]";
  const pDesc = product ? product.description : "[PRODUCT DESCRIPTION]";
  const claims = getClaimsInfo(productId);
  const category = product ? product.category : "";
  const contextWord = category === "Motor" ? "vehicle" : category === "Let Property" ? "property" : category === "Commercial" ? "business" : "home";

  return {
    intro: [
      {
        id: "1a", title: "General Product Introduction", desc: "Introduce a product the client may not know about",
        subject: `Something worth knowing about — ${pName}`,
        body: `I wanted to get in touch to let you know about something I can arrange on your behalf that you may find valuable.\n\n${pName} is designed to give you additional peace of mind by providing ${product ? product.tagline.toLowerCase() : "[KEY BENEFIT]"}.\n\nIn plain terms, ${product ? pDesc.split(".")[0].toLowerCase() + "." : "[BRIEF EXPLANATION OF WHAT THE PRODUCT COVERS]."}\n\nThis is something I'd recommend considering — there's no obligation, but I wanted to make sure you were aware it's available.\n\nIf you'd like to find out more or get a quote, just reply to this email or give me a call. I'm always happy to talk things through.`,
      },
      {
        id: "1b", title: "Soft Awareness Nudge", desc: "Raise awareness of a gap in protection",
        subject: `Is your ${contextWord} fully protected?`,
        body: `I hope you're well. I just wanted to drop you a quick line about something that comes up quite often with clients.\n\nMany people don't realise that their main insurance policy may not cover everything — and that's where ${pName} comes in. It's designed to ${product ? product.tagline.toLowerCase() : "[EXPLAIN CORE BENEFIT IN ONE SENTENCE]"}.\n\nIt's the kind of cover you hope you'll never need, but you'll be very glad to have if the situation arises.\n\nIf you'd like to have a quick conversation about whether it's right for you, I'm here whenever suits. No pressure at all — just looking out for you.`,
      },
    ],
    quote: [
      {
        id: "2a", title: "Post-Quote Follow-Up", desc: "Follow up after providing a quote",
        subject: `Following up on your quote — ${pName}`,
        body: `Thank you for your time [earlier today/yesterday] — it was good to speak with you.\n\nAs discussed, I wanted to follow up regarding ${pName}. Just as a reminder, this provides ${product ? product.tagline.toLowerCase() : "[BRIEF DESCRIPTION OF COVER]"}.\n\n${product ? pDesc.split(".").slice(0, 2).join(".") + "." : "[ONE OR TWO SENTENCES EXPLAINING THE COVER IN PLAIN ENGLISH]."}\n\nIf you'd like to go ahead, just let me know and I can get everything set up for you. And of course, if you have any questions at all, I'm here to help.\n\nThere's no rush — take your time and come back to me whenever you're ready.`,
      },
      {
        id: "2b", title: "Cross-Sell Alongside Quote", desc: "Suggest additional cover alongside a main policy",
        subject: "A few options worth considering alongside your policy",
        body: `While we're getting your main policy arranged, I wanted to flag something that works really well alongside it.\n\n${pName} is designed to ${product ? product.tagline.toLowerCase() : "[KEY BENEFIT]"} — and it's particularly useful because ${product ? pDesc.split(".")[0].toLowerCase() + "." : "[BRIEF EXPLANATION]."}\n\nIt's a relatively small addition that can make a big difference when you need it most.\n\nWould you like me to talk you through the details before we finalise everything? Happy to have a quick chat at a time that suits.`,
      },
    ],
    sale: [
      {
        id: "3a", title: "Welcome & Policy Confirmation", desc: "Confirm cover is in place",
        subject: `You're covered — your ${pName} policy is confirmed`,
        body: `Great news — your ${pName} policy is now in place. You're covered.\n\nAs a reminder, this policy provides ${product ? product.tagline.toLowerCase() : "[KEY BENEFIT]"}.\n\nA few important things to keep in mind:\n\n• Your policy includes a 14-day cooling-off period from the start date. If you change your mind during this time, you can cancel and receive a full refund.\n\n• If you need to make a claim, here's what to do:\n  Phone: ${claims.phone}\n  ${claims.instruction}\n\nPlease keep these details somewhere safe — you may need them at short notice.\n\nIf you have any questions at any point during your policy, don't hesitate to get in touch. I'm here throughout.`,
      },
      {
        id: "3b", title: "Policy Documents Delivery", desc: "Accompany policy documents",
        subject: `Your ${pName} documents are enclosed`,
        body: `Please find enclosed your policy documents for ${pName}.\n\nThe most important thing to keep handy is your claims contact number: ${claims.phone}. In the event you need to make a claim, this is the first number to call.\n\nI'd encourage you to have a read through the key facts document at your convenience — it sets out exactly what's covered and any conditions to be aware of.\n\nIf anything is unclear or you have questions, just give me a call or drop me an email. I'm always happy to help.`,
      },
    ],
    midterm: [
      {
        id: "4a", title: "Mid-Term Check-In", desc: "Friendly check-in during the policy",
        subject: "Just checking in — [CLIENT FIRST NAME]",
        fields: ["clientFirstName"],
        body: `I hope all is well. I just wanted to check in and make sure you're happy with your ${pName} cover.\n\nAs a quick reminder, your policy provides ${product ? product.tagline.toLowerCase() : "[KEY BENEFIT]"} — so you've got peace of mind there.\n\nHave there been any changes to your circumstances since we last spoke? For example, any changes to your ${contextWord} or personal situation that might be worth reviewing?\n\nIf so, it's always worth having a quick conversation so we can make sure your cover still fits. And if everything's fine, that's great — just wanted to check.\n\nFeel free to get in touch any time.`,
      },
      {
        id: "4b", title: "Circumstances Change Prompt", desc: "Prompt clients to report changes",
        subject: "Has anything changed since you took out your policy?",
        body: `I'm reaching out because it's always a good idea to check in from time to time.\n\nIf anything has changed recently — a new ${contextWord}, a change of address, or any other update — it's important to let me know sooner rather than later. Changes like these can sometimes affect your cover under ${pName}, and I'd hate for you to find that out at the point of a claim.\n\nIt only takes a couple of minutes to update, and I can make sure everything is still working as it should.\n\nJust drop me a reply or give me a call — I'm always happy to help.`,
      },
    ],
    renewal: [
      {
        id: "5a", title: "30-Day Renewal Notice", desc: "Notify client of upcoming renewal",
        subject: `Your ${pName} is due to renew next month`,
        fields: ["renewalDate", "renewalPremium"],
        body: `I'm writing to let you know that your ${pName} policy is due for renewal on [RENEWAL DATE].\n\n${product ? "As a reminder, this policy provides " + product.tagline.toLowerCase() + "." : "[BRIEF DESCRIPTION OF COVER]."}\n\n[If premium is known: Your renewal premium is £[RENEWAL PREMIUM].]\n\nI'll be in touch again closer to the date, but in the meantime, if you have any questions or would like to discuss your options, please don't hesitate to get in touch.\n\nI'm here to make sure you've got the right cover at the right price.`,
      },
      {
        id: "5b", title: "7-Day Renewal Reminder", desc: "Reminder before renewal lapses",
        subject: `Your ${pName} renews in 7 days — here's what you need to know`,
        fields: ["renewalDate"],
        body: `A quick reminder that your ${pName} policy is due to renew on [RENEWAL DATE].\n\nIf your policy lapses, you would be without ${product ? product.tagline.toLowerCase() : "[KEY BENEFIT]"} — and that could leave you exposed at exactly the wrong moment.\n\nIf you're happy to continue, there's nothing you need to do — I'll take care of the rest. But if you'd like to discuss your renewal or explore alternatives, please get in touch before [RENEWAL DATE].\n\nI'm here to help.`,
      },
      {
        id: "5c", title: "Post-Renewal Confirmation", desc: "Confirm successful renewal",
        subject: `Your ${pName} has renewed — you're still covered`,
        body: `Good news — your ${pName} policy has renewed successfully, and you're still fully covered.\n\nAs a reminder, this policy provides ${product ? product.tagline.toLowerCase() : "[KEY BENEFIT]"}.\n\nYour claims contact number remains: ${claims.phone}\n\nThank you for your continued trust — I appreciate you choosing to arrange your cover through me. As always, if you need anything at all, don't hesitate to get in touch.`,
      },
    ],
    crosssell: [
      {
        id: "6a", title: "Bundle Suggestion", desc: "Introduce a complementary product",
        subject: "Something that pairs well with your existing cover",
        fields: ["existingProduct"],
        body: `Since you already have [EXISTING PRODUCT] in place, I wanted to let you know about ${pName} — it's a natural complement that a lot of my clients find valuable.\n\nWhile your existing cover takes care of [EXISTING PRODUCT AREA], ${pName} picks up where it leaves off by providing ${product ? product.tagline.toLowerCase() : "[KEY BENEFIT]"}.\n\nTogether, the two give you much more comprehensive protection — and it's surprisingly affordable.\n\nWould you like me to run through the details? No obligation at all — just a quick conversation to see if it makes sense for you.`,
      },
      {
        id: "6b", title: "Gap in Cover Nudge", desc: "Raise an area of risk the client may have missed",
        subject: "One area of cover we haven't yet discussed…",
        body: `I wanted to get in touch about something we haven't covered yet — and it's an area that's worth thinking about.\n\n${pName} is designed to ${product ? product.tagline.toLowerCase() : "[KEY BENEFIT]"}. It's the kind of protection that many people don't think about until it's too late.\n\n${product ? pDesc.split(".")[0] + "." : "[BRIEF EXPLANATION OF WHAT THIS PRODUCT COVERS]."}\n\nI'm not trying to sell you something you don't need — but I'd feel remiss if I didn't at least make you aware. If you'd like to have a quick chat about it, I'm here whenever suits.`,
      },
    ],
  };
}

function EmailTemplates() {
  const { profile } = useBrokerProfile();
  const { show, ToastUI } = useToast();
  const [stage, setStage] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [fields, setFields] = useState({ clientName: "", clientFirstName: "", renewalDate: "", renewalPremium: "", existingProduct: "" });

  const templates = selectedProduct ? buildEmailTemplates(selectedProduct) : buildEmailTemplates("");
  const stageTemplates = stage ? (templates[stage] || []) : [];
  const currentTemplate = stageTemplates.find(t => t.id === templateId);

  const firmName = profile?.brokerName || "[FIRM NAME]";
  const fcaNum = profile?.fcaNumber || "[FCA NUMBER]";
  const senderPhone = profile?.phone || "[PHONE]";
  const senderEmail = profile?.email || "[EMAIL]";
  const footerMessage = profile?.footerMessage || "";

  const complianceFooter = `${firmName} is authorised and regulated by the Financial Conduct Authority. FCA Registration Number: ${fcaNum}. This email and any attachments are confidential and intended solely for the addressee.\n\n${senderPhone} | ${senderEmail}${footerMessage ? "\n" + footerMessage : ""}`;

  const fillPlaceholders = (text) => {
    let t = text;
    if (fields.clientFirstName) t = t.replace(/\[CLIENT FIRST NAME\]/g, fields.clientFirstName);
    if (fields.renewalDate) t = t.replace(/\[RENEWAL DATE\]/g, fields.renewalDate);
    if (fields.renewalPremium) t = t.replace(/\[RENEWAL PREMIUM\]/g, fields.renewalPremium);
    if (fields.existingProduct) {
      t = t.replace(/\[EXISTING PRODUCT\]/g, fields.existingProduct);
      t = t.replace(/\[EXISTING PRODUCT AREA\]/g, fields.existingProduct);
    }
    return t;
  };

  const highlightPlaceholders = (text) => {
    return text.replace(/\[([A-Z\s\/]+)\]/g, '<span style="background:#fef3c7;color:#92400e;padding:1px 4px;border-radius:3px;font-weight:600;">[$1]</span>');
  };

  const getFullEmail = (plain = false) => {
    if (!currentTemplate) return "";
    const greeting = fields.clientName ? `Dear ${fields.clientName},` : "Dear [CLIENT NAME],";
    const signoff = `Kind regards,\n${firmName}`;
    const body = fillPlaceholders(currentTemplate.body);
    const full = `${greeting}\n\n${body}\n\n${signoff}\n\n---\n${complianceFooter}`;
    return full;
  };

  const handleDownloadTxt = () => {
    if (!currentTemplate) return;
    const subject = fillPlaceholders(currentTemplate.subject);
    const content = `Subject: ${subject}\n\n${getFullEmail()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentTemplate.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    show("Plain text file downloaded! 📄");
    trackEvent("email_downloaded", "email_templates", `${currentTemplate.title} - txt`);
    incrementCounter();
  };

  const handleDownloadPdf = () => {
    if (!currentTemplate) return;
    const pw = window.open("", "_blank");
    if (!pw) { show("Pop-up blocked — please allow pop-ups.", "error"); return; }
    const subject = fillPlaceholders(currentTemplate.subject);
    const bodyHtml = fillPlaceholders(currentTemplate.body).replace(/\n/g, "<br>");
    const greeting = fields.clientName ? `Dear ${fields.clientName},` : "Dear [CLIENT NAME],";
    const brandColor = profile?.brandColor || "#1a3a5c";
    const logoHtml = profile?.logoUrl ? `<img src="${profile.logoUrl}" style="max-height:40px;object-fit:contain;margin-bottom:16px;" />` : "";

    pw.document.write(`<!DOCTYPE html><html><head><title>${subject}</title><style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Segoe UI',system-ui,sans-serif;padding:40px 50px;color:#1e293b;font-size:13px;line-height:1.7;}
      @media print{@page{margin:20mm;size:A4;}}
    </style></head><body>
      ${logoHtml}
      <div style="border-bottom:3px solid ${brandColor};padding-bottom:12px;margin-bottom:24px;">
        <div style="font-size:11px;color:#64748b;font-weight:600;">${firmName}</div>
        <div style="font-size:18px;font-weight:800;color:${brandColor};margin-top:4px;">Subject: ${subject}</div>
      </div>
      <p style="margin-bottom:16px;">${greeting}</p>
      <div style="margin-bottom:24px;">${bodyHtml}</div>
      <p style="margin-bottom:4px;">Kind regards,</p>
      <p style="font-weight:700;margin-bottom:32px;">${firmName}</p>
      <div style="border-top:1px solid #e2e8f0;padding-top:16px;font-size:10px;color:#94a3b8;line-height:1.6;">
        <p>${firmName} is authorised and regulated by the Financial Conduct Authority. FCA Registration Number: ${fcaNum}.</p>
        <p style="margin-top:4px;">This email and any attachments are confidential and intended solely for the addressee.</p>
        <p style="margin-top:8px;">${senderPhone} | ${senderEmail}${footerMessage ? "<br>" + footerMessage : ""}</p>
      </div>
    </body></html>`);
    pw.document.close();
    setTimeout(() => pw.print(), 500);
    show("PDF letter ready — check the new tab! 🎉");
    trackEvent("email_downloaded", "email_templates", `${currentTemplate.title} - pdf`);
    incrementCounter();
  };

  const inputStyle = { width: "100%", padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: FONT }}>
      <TopNav title="Email Templates" />
      <ToastUI />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#1e293b" }}>Email Templates</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Branded, ready-to-send emails for every stage of the client journey.</p>
        </div>

        {!profile && (
          <div style={{ background: "#fff", border: "2px solid #F5A623", borderRadius: 12, padding: "24px", textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Set Up Your Broker Profile First</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>Your branding details are needed to generate email templates.</p>
            <Link to="/broker-profile" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #E91E8B 0%, #F5A623 100%)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Complete Your Profile →</Link>
          </div>
        )}

        {/* Breadcrumb navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "#94a3b8" }}>
          <span onClick={() => { setStage(null); setTemplateId(null); }} style={{ cursor: "pointer", fontWeight: 600, color: stage ? "#7c3aed" : "#1e293b" }}>Journey Stage</span>
          {stage && <><span>→</span><span onClick={() => setTemplateId(null)} style={{ cursor: "pointer", fontWeight: 600, color: templateId ? "#7c3aed" : "#1e293b" }}>{EMAIL_STAGES.find(s => s.id === stage)?.title}</span></>}
          {templateId && currentTemplate && <><span>→</span><span style={{ fontWeight: 600, color: "#1e293b" }}>{currentTemplate.title}</span></>}
        </div>

        {/* Stage 1: Select Journey Stage */}
        {!stage && (
          <div className="alps-claims-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {EMAIL_STAGES.map(s => (
              <div key={s.id} onClick={() => setStage(s.id)} style={{
                background: "#fff", borderRadius: 14, padding: "28px 24px", cursor: "pointer",
                border: "2px solid #e2e8f0", textAlign: "center", transition: "all 0.15s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7c3aed"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>{s.icon}</div>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Stage 2: Select Template */}
        {stage && !templateId && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stageTemplates.map(t => (
              <div key={t.id} onClick={() => setTemplateId(t.id)} style={{
                background: "#fff", borderRadius: 12, padding: "20px 24px", cursor: "pointer",
                border: "2px solid #e2e8f0", display: "flex", alignItems: "center", gap: 16,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7c3aed"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#7c3aed12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>✉️</div>
                <div>
                  <h4 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{t.title}</h4>
                  <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{t.desc}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 16, color: "#cbd5e1" }}>→</span>
              </div>
            ))}
          </div>
        )}

        {/* Stage 3: Customise & Export */}
        {stage && templateId && currentTemplate && (
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }} className="alps-profile-2col">
            {/* Left: Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Product</h4>
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select a product...</option>
                  {CATEGORIES.map(cat => (
                    <optgroup key={cat.name} label={cat.name}>
                      {PRODUCTS.filter(p => p.category === cat.name).map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div style={{ background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Personalise</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div><label style={labelStyle}>Client Full Name</label><input style={inputStyle} placeholder="e.g. John Smith" value={fields.clientName} onChange={(e) => setFields(f => ({ ...f, clientName: e.target.value }))} /></div>
                  {(currentTemplate.fields || []).includes("clientFirstName") && (
                    <div><label style={labelStyle}>Client First Name</label><input style={inputStyle} placeholder="e.g. John" value={fields.clientFirstName} onChange={(e) => setFields(f => ({ ...f, clientFirstName: e.target.value }))} /></div>
                  )}
                  {(currentTemplate.fields || []).includes("renewalDate") && (
                    <div><label style={labelStyle}>Renewal Date</label><input style={inputStyle} placeholder="e.g. 15th April 2026" value={fields.renewalDate} onChange={(e) => setFields(f => ({ ...f, renewalDate: e.target.value }))} /></div>
                  )}
                  {(currentTemplate.fields || []).includes("renewalPremium") && (
                    <div><label style={labelStyle}>Renewal Premium</label><input style={inputStyle} placeholder="e.g. 29.99" value={fields.renewalPremium} onChange={(e) => setFields(f => ({ ...f, renewalPremium: e.target.value }))} /></div>
                  )}
                  {(currentTemplate.fields || []).includes("existingProduct") && (
                    <div><label style={labelStyle}>Existing Product</label><input style={inputStyle} placeholder="e.g. Motor Legal Protection" value={fields.existingProduct} onChange={(e) => setFields(f => ({ ...f, existingProduct: e.target.value }))} /></div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={handleDownloadTxt} style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" }}>📄 Download as Plain Text (.txt)</button>
                <button onClick={handleDownloadPdf} style={{ padding: "12px 20px", borderRadius: 10, border: "2px solid #7c3aed", background: "#fff", color: "#7c3aed", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" }}>🖨️ Download as PDF Letter</button>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              {/* Subject bar */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Subject</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }} dangerouslySetInnerHTML={{ __html: highlightPlaceholders(fillPlaceholders(currentTemplate.subject)) }} />
              </div>
              {/* From/To */}
              <div style={{ padding: "12px 24px", borderBottom: "1px solid #f1f5f9", fontSize: 12, color: "#64748b" }}>
                <div><strong>From:</strong> {firmName} ({senderEmail})</div>
                <div><strong>To:</strong> {fields.clientName || "[CLIENT NAME]"}</div>
              </div>
              {/* Body */}
              <div style={{ padding: "24px", fontSize: 13.5, lineHeight: 1.75, color: "#334155" }}>
                <div dangerouslySetInnerHTML={{ __html: highlightPlaceholders(
                  `${fields.clientName ? "Dear " + fields.clientName + "," : "Dear [CLIENT NAME],"}<br><br>` +
                  fillPlaceholders(currentTemplate.body).replace(/\n/g, "<br>") +
                  `<br><br>Kind regards,<br><strong>${firmName}</strong>`
                ) }} />
              </div>
              {/* Compliance footer */}
              <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", background: "#f8fafc", fontSize: 10, color: "#94a3b8", lineHeight: 1.6 }}>
                <p>{firmName} is authorised and regulated by the Financial Conduct Authority. FCA Registration Number: {fcaNum}.</p>
                <p style={{ marginTop: 4 }}>This email and any attachments are confidential and intended solely for the addressee.</p>
                <p style={{ marginTop: 6 }}>{senderPhone} | {senderEmail}{footerMessage ? ` | ${footerMessage}` : ""}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════
function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-V6JN8F3TLS", { page_path: location.pathname });
    }
  }, [location.pathname]);
  return null;
}

function App() {
  const { profile, saveProfile } = useBrokerProfile();
  const [onboarded, setOnboarded] = useState(() => {
    try { return !!localStorage.getItem("alps_broker_profile") || !!localStorage.getItem("alps_onboarded"); } catch { return false; }
  });

  if (!onboarded && !profile) {
    return <OnboardingWizardWrapper />;
  }

  return (
    <>
      <GlobalStyles />
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/broker-profile" element={<BrokerProfilePage />} />
        <Route path="/product-sheet-generator" element={<ProductSheetGenerator />} />
        <Route path="/claims-guidance-card" element={<ClaimsGuidanceCard />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
      </Routes>
    </>
  );
}

// Wrapper needed because useContext must be inside provider
function OnboardingWizardWrapper() {
  const { saveProfile } = useBrokerProfile();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  if (done) return null;
  return (
    <OnboardingWizard onComplete={(form) => {
      saveProfile(form);
      try { localStorage.setItem("alps_onboarded", "1"); } catch {}
      trackEvent("onboarding_complete", "profile", form.brokerName);
      setDone(true);
      navigate("/");
    }} />
  );
}

export default function AppWrapper() {
  return (
    <BrokerProvider>
      <App />
    </BrokerProvider>
  );
}
