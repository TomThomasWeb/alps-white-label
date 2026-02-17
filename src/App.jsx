import { useState, useRef, useCallback } from "react";

const PRODUCTS = [
  {
    id: "motor-legal",
    category: "Motor",
    categoryColor: "#E91E8B",
    title: "Motor Legal Protection",
    tagline: "Peace of mind if you're involved in a road traffic accident that isn't your fault.",
    icon: "⚖️",
    image: "https://images.unsplash.com/photo-1449965408869-ebd13bc9e5a8?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&q=80",
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

function adjustColor(hex, lightness) {
  const hsl = hexToHSL(hex);
  return `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`;
}

function ProductSheet({ product, config }) {
  const brandColor = config.brandColor || "#1a3a5c";
  const lightBg = adjustColor(brandColor, 95);
  const medBg = adjustColor(brandColor, 88);
  const darkText = adjustColor(brandColor, 15);

  return (
    <div style={{
      width: "100%",
      maxWidth: 850,
      margin: "0 auto 40px",
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      pageBreakAfter: "always",
    }}>
      {/* Header Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, 30)} 100%)`,
        padding: "36px 40px 32px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />
        <div style={{
          position: "absolute",
          bottom: -60,
          right: 100,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: 12,
            color: "#fff",
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}>
            <span>{product.icon}</span>
            {product.category} Add-On
          </div>
          {config.logoUrl && (
            <div style={{
              background: "#fff",
              borderRadius: 10,
              padding: "6px 14px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}>
              <img
                src={config.logoUrl}
                alt={config.brokerName}
                style={{ maxHeight: 36, maxWidth: 150, objectFit: "contain", display: "block" }}
                onError={(e) => { e.target.parentElement.style.display = "none"; }}
              />
            </div>
          )}
        </div>

        <h2 style={{
          margin: 0,
          fontSize: 32,
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.15,
          letterSpacing: -0.5,
        }}>
          {product.title}
        </h2>
        <p style={{
          margin: "10px 0 0",
          fontSize: 16,
          color: "rgba(255,255,255,0.85)",
          lineHeight: 1.5,
          maxWidth: 600,
        }}>
          {product.tagline}
        </p>
      </div>

      {/* Image + Description */}
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{
          flex: "0 0 280px",
          minHeight: 200,
          backgroundImage: `url(${product.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <div style={{ flex: 1, padding: "28px 32px" }}>
          <p style={{
            margin: 0,
            fontSize: 14.5,
            lineHeight: 1.7,
            color: "#444",
          }}>
            {product.description}
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{
        padding: "24px 32px 28px",
        background: lightBg,
      }}>
        <h3 style={{
          margin: "0 0 18px",
          fontSize: 18,
          fontWeight: 700,
          color: darkText,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{
            width: 32,
            height: 3,
            background: brandColor,
            borderRadius: 2,
            display: "inline-block",
          }} />
          What's Covered
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: product.features.length > 4 ? "1fr 1fr" : "1fr 1fr",
          gap: "14px",
        }}>
          {product.features.map((feature, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 10,
              padding: "16px 18px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              border: `1px solid ${medBg}`,
              transition: "box-shadow 0.2s",
            }}>
              <span style={{
                fontSize: 22,
                flexShrink: 0,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: lightBg,
                borderRadius: 8,
              }}>
                {feature.icon}
              </span>
              <div>
                <div style={{
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: darkText,
                  marginBottom: 3,
                }}>
                  {feature.title}
                </div>
                <div style={{
                  fontSize: 12.5,
                  color: "#666",
                  lineHeight: 1.55,
                }}>
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "18px 32px",
        background: adjustColor(brandColor, 97),
        borderTop: `1px solid ${medBg}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {config.brokerName && (
            <span style={{ fontSize: 13, fontWeight: 700, color: darkText }}>
              {config.brokerName}
            </span>
          )}
          {config.phone && (
            <span style={{ fontSize: 13, color: "#555" }}>
              📞 {config.phone}
            </span>
          )}
          {config.email && (
            <span style={{ fontSize: 13, color: "#555" }}>
              ✉️ {config.email}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          {config.fcaNumber && (
            <span style={{ fontSize: 10.5, color: "#999" }}>
              Authorised & Regulated by the FCA | Ref: {config.fcaNumber}
            </span>
          )}
          {config.footerMessage && (
            <span style={{ fontSize: 10.5, color: "#888", fontStyle: "italic" }}>
              {config.footerMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfigPanel({ config, setConfig, onGenerate }) {
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setConfig((c) => ({ ...c, logoUrl: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
    background: "#fff",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: "#475569",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      padding: "40px 36px",
      boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
      maxWidth: 520,
      margin: "0 auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          marginBottom: 16,
        }}>
          🏷️
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#1e293b" }}>
          Brand Your Product Sheets
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          Enter your details below and we'll generate professional product sheets with your branding.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Brokerage Name *</label>
          <input
            style={inputStyle}
            placeholder="e.g. Smith & Partners Insurance"
            value={config.brokerName}
            onChange={(e) => setConfig((c) => ({ ...c, brokerName: e.target.value }))}
          />
        </div>

        <div>
          <label style={labelStyle}>Your Logo</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: 10,
              padding: "20px 16px",
              textAlign: "center",
              cursor: "pointer",
              background: "#f8fafc",
              transition: "border-color 0.2s",
            }}
          >
            {config.logoUrl ? (
              <div>
                <img src={config.logoUrl} alt="Logo" style={{ maxHeight: 50, maxWidth: 200, objectFit: "contain" }} />
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>Click to change</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 28, marginBottom: 4 }}>📤</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Click to upload your logo</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>PNG, JPG, or SVG</div>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input
              style={inputStyle}
              placeholder="01234 567890"
              value={config.phone}
              onChange={(e) => setConfig((c) => ({ ...c, phone: e.target.value }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              style={inputStyle}
              placeholder="info@broker.co.uk"
              value={config.email}
              onChange={(e) => setConfig((c) => ({ ...c, email: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>FCA Reference Number</label>
          <input
            style={inputStyle}
            placeholder="e.g. 123456"
            value={config.fcaNumber}
            onChange={(e) => setConfig((c) => ({ ...c, fcaNumber: e.target.value }))}
          />
        </div>

        <div>
          <label style={labelStyle}>Brand Colour</label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="color"
              value={config.brandColor}
              onChange={(e) => setConfig((c) => ({ ...c, brandColor: e.target.value }))}
              style={{
                width: 52,
                height: 44,
                border: "2px solid #e2e8f0",
                borderRadius: 10,
                cursor: "pointer",
                padding: 2,
              }}
            />
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="#1a3a5c"
              value={config.brandColor}
              onChange={(e) => setConfig((c) => ({ ...c, brandColor: e.target.value }))}
            />
            <div style={{ display: "flex", gap: 4 }}>
              {["#1a3a5c", "#14532d", "#7c2d12", "#581c87", "#991b1b", "#0c4a6e"].map((c) => (
                <div
                  key={c}
                  onClick={() => setConfig((prev) => ({ ...prev, brandColor: c }))}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: c,
                    cursor: "pointer",
                    border: config.brandColor === c ? "3px solid #333" : "2px solid #e2e8f0",
                    transition: "border 0.15s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Custom Footer Message (optional)</label>
          <input
            style={inputStyle}
            placeholder="e.g. Protecting families since 1998"
            value={config.footerMessage}
            onChange={(e) => setConfig((c) => ({ ...c, footerMessage: e.target.value }))}
          />
        </div>

        <button
          onClick={onGenerate}
          disabled={!config.brokerName}
          style={{
            width: "100%",
            padding: "16px 24px",
            background: config.brokerName
              ? `linear-gradient(135deg, ${config.brandColor} 0%, ${adjustColor(config.brandColor, 30)} 100%)`
              : "#cbd5e1",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: config.brokerName ? "pointer" : "not-allowed",
            transition: "transform 0.15s, box-shadow 0.15s",
            letterSpacing: 0.3,
          }}
        >
          Generate Product Sheets →
        </button>
      </div>
    </div>
  );
}

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  return (
    <div style={{
      display: "flex",
      gap: 8,
      justifyContent: "center",
      flexWrap: "wrap",
      marginBottom: 28,
    }}>
      <button
        onClick={() => setSelectedCategory(null)}
        style={{
          padding: "8px 20px",
          borderRadius: 24,
          border: "2px solid",
          borderColor: !selectedCategory ? "#1e293b" : "#e2e8f0",
          background: !selectedCategory ? "#1e293b" : "#fff",
          color: !selectedCategory ? "#fff" : "#64748b",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        All Products ({PRODUCTS.length})
      </button>
      {CATEGORIES.map((cat) => {
        const count = PRODUCTS.filter((p) => p.category === cat.name).length;
        return (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            style={{
              padding: "8px 20px",
              borderRadius: 24,
              border: "2px solid",
              borderColor: selectedCategory === cat.name ? cat.color : "#e2e8f0",
              background: selectedCategory === cat.name ? cat.color : "#fff",
              color: selectedCategory === cat.name ? "#fff" : "#64748b",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {cat.icon} {cat.name} ({count})
          </button>
        );
      })}
    </div>
  );
}

export default function AlpsWhiteLabelApp() {
  const [config, setConfig] = useState({
    brokerName: "",
    logoUrl: "",
    phone: "",
    email: "",
    fcaNumber: "",
    brandColor: "#1a3a5c",
    footerMessage: "",
  });
  const [view, setView] = useState("setup");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set(PRODUCTS.map((p) => p.id)));
  const printRef = useRef(null);

  const filteredProducts = PRODUCTS.filter(
    (p) => (!selectedCategory || p.category === selectedCategory) && selectedProducts.has(p.id)
  );

  const toggleProduct = (id) => {
    setSelectedProducts((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const content = printRef.current?.innerHTML || "";
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${config.brokerName} - Product Sheets</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #fff; }
          @media print {
            body { background: #fff; }
            @page { margin: 0.5cm; size: A4; }
          }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }, [config.brokerName]);

  if (view === "setup") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 4,
          }}>
            White-Label Generator
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>
            Insurance Product Sheets — Customised to Your Brand
          </p>
        </div>
        <ConfigPanel
          config={config}
          setConfig={setConfig}
          onGenerate={() => setView("preview")}
        />
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ fontSize: 11, color: "#94a3b8" }}>
            Powered by Alps — The Leading Add-On Providers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f1f5f9",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    }}>
      {/* Top Bar */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => setView("setup")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#fff",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            ← Edit Details
          </button>
          <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{config.brokerName}</span>
            <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handlePrint}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: `linear-gradient(135deg, ${config.brandColor} 0%, ${adjustColor(config.brandColor, 30)} 100%)`,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>

      <div style={{ padding: "28px 20px" }}>
        {/* Category Filter */}
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* Product Toggles */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
          marginBottom: 32,
          maxWidth: 900,
          margin: "0 auto 32px",
        }}>
          {PRODUCTS.filter((p) => !selectedCategory || p.category === selectedCategory).map((p) => (
            <button
              key={p.id}
              onClick={() => toggleProduct(p.id)}
              style={{
                padding: "5px 12px",
                borderRadius: 16,
                border: `1.5px solid ${selectedProducts.has(p.id) ? p.categoryColor : "#e2e8f0"}`,
                background: selectedProducts.has(p.id) ? `${p.categoryColor}15` : "#fff",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                color: selectedProducts.has(p.id) ? p.categoryColor : "#94a3b8",
                transition: "all 0.15s",
              }}
            >
              {selectedProducts.has(p.id) ? "✓ " : ""}{p.title}
            </button>
          ))}
        </div>

        {/* Product Sheets */}
        <div ref={printRef}>
          {filteredProducts.map((product) => (
            <ProductSheet key={product.id} product={product} config={config} />
          ))}
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
