export interface Service {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  description: string;
  timeline: string;
  fee: string;
  benefits: string[];
  docs: string[];
  process: string[];
}

export interface ComplianceItem {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  subtitle: string;
  badge: string | null;
  border: string;
  btn: string;
  features: string[];
  not: string[];
}

export const GOOGLE_FORM_URL = "/get-quote";

// Which Premium Package a service detail page's pricing card should lead to
export const SERVICE_TO_PACKAGE: Record<string, string> = {
  "pvt-ltd": "corporate-structuring",
  "llp": "corporate-structuring",
  "startup-india": "corporate-structuring",
  "opc": "corporate-structuring",
  "gst": "digital-infrastructure",
  "trademark": "contracts-compliance",
  "mou": "contracts-compliance",
  "jv-agreement": "contracts-compliance",
};

export const SERVICES: Service[] = [
  {
    id: "pvt-ltd",
    label: "Private Limited Company",
    icon: "building",
    tagline: "India's most preferred startup structure",
    description: "A Private Limited Company (Pvt. Ltd.) is the gold standard for Indian startups seeking scalability, investor readiness, and limited liability. Governed by the Ministry of Corporate Affairs (MCA) under the Companies Act 2013, it provides a separate legal identity, perpetual succession, and the ability to raise VC/angel funding. It's the backbone of India's startup ecosystem — from Day 1 ideation to IPO-ready scale.",
    timeline: "Day 1 to 3 Weeks",
    fee:  "Rs. 9448 (Adjustable) + Stamp Duty",
    benefits: ["Limited Liability Protection for all shareholders", "Separate Legal Entity with perpetual succession", "Easier fundraising from VCs, angels & institutions", "ESOP issuance for talent acquisition", "Higher credibility with vendors & partners", "Corporate bank account eligibility", " Website and Online Presence", "Legal Documentation", "Security Services","Cloud Storage", "Dedicated Professional Dashboard", "Company Employee Management", "Posh Compliance", "ICC"],
    docs: ["PAN Card of all Directors", "Aadhaar / Passport of Directors", "Passport-size Photographs", "Utility Bill (address proof)", "NOC from property owner", "DSC & DIN – we arrange", "MoA & AoA – we draft professionally"],
    process: ["Document collection & DSC application", "DIN procurement for all directors", "Name reservation via RUN on MCA", "SPICe+ form filing with MCA", "Certificate of Incorporation issued", "PAN & TAN allotment for the company", "Current bank account setup guidance"],
  },
  {
    id: "gst",
    label: " Online Presence & Security",
    icon: "fileText",
    tagline: "Build your digital footprint and protect your infrastructure from Day 1",
    description: "Whether you are launching a brand-new startup or transitioning an existing traditional business into the modern era, your digital infrastructure must be bulletproof. This package is engineered to establish your online presence and protect your digital assets from Day 1.We deliver an end-to-end digital foundation, including a custom-built website, enterprise-grade SSL certification, secure cloud networking, and access to a dedicated client dashboard. Built for scalability, this foundational setup seamlessly unlocks exclusive access to our premium tech-legal upgrades and advanced infrastructure add-ons as your business grows.",
    timeline: "5 Working Days",
    fee: "4,999 All-Inclusive (Adjust price as needed)",
    benefits: ["Custom-Built Website: Tailor-made web architecture designed for your specific business niche.", "Enterprise SSL Certification: Top-tier encryption to secure user data and pass corporate IT audits.", "Secure Cloud Networking: Fast, reliable, and secure hosting infrastructure.", "Official Corporate IDs: Professional business email addresses (e.g., founder@yourbrand.com) from Day 1.", "Dedicated Client Dashboard: Your centralized hub for managing your digital assets.", "Frictionless Onboarding: A completely hands-off experience for the founder.","Premium Scalability: Unlocks future access to advanced tech-legal upgrades and premium add-ons."],
    docs: [" Your Brand Vision & Ideas", "Your Preferred Color Scheme / Logo (If any)", "A 15-minute discovery chat with our tech architects ","No PAN, Aadhaar, or utility bills required to begin!", "💳 Pricing & Call to Action (Side Panel)"],
    process: ["Domain Strategy & Procurement: We discuss and secure the perfect domain name that aligns with your brand identity.", "Business Discovery: Tell us about your business, your target audience, and your operational goals.", "Tailor-Made Architecture: Your wish is our command. Our developers custom-build your website to match your exact vision.", "Security & Cloud Deployment: We integrate enterprise SSL certificates and deploy your site on secure cloud networks.", "The 5-Day Go-Live: Within 5 working days, your fully secured website is live, complete with your official corporate email IDs."],
  },
  {
    id: "trademark",
    label: "Trademark Registration",
    icon: "award",
    tagline: "Legally protect your brand forever",
    description: "Trademark Registration grants exclusive nationwide rights to your brand name, logo, or slogan under the Trade Marks Act 1999. A registered trademark lets you use the ® symbol, take legal action against infringers, and license or franchise your brand identity. For any startup serious about building brand equity and preventing intellectual property theft, trademark registration is a non-negotiable legal investment.",
    timeline: "2–3 Days for Filing (Examination: 12–18 months)",
    fee: "₹4,999 (Govt Fee + Professional)",
    benefits: ["Exclusive legal right to brand name & logo", "Right to use ® symbol post-registration", "Legal protection against counterfeiting", "Brand asset that compounds in value", "Licensing & franchising opportunities", "Priority in domain name disputes"],
    docs: ["Logo / Brand in high-res PNG", "PAN of Applicant (individual or company)", "Aadhaar / Certificate of Incorporation", "Signed Power of Attorney (TM-48)", "Business address proof", "Goods/services classification list", "Date of First Use in Commerce"],
    process: ["Comprehensive trademark search", "Class identification under Nice Classification", "Application drafting & POA execution", "Online filing on IP India portal", "Examination Report response if needed", "Publication in Trademark Journal", "Certificate of Registration issuance"],
  },
  {
    id: "llp",
    label: "LLP Registration",
    icon: "briefcase",
    tagline: "Flexibility meets limited liability",
    description: "A Limited Liability Partnership (LLP) combines the operational flexibility of a traditional partnership with the liability protection of a company. Under the LLP Act 2008, it has a separate legal identity, no minimum capital requirement, and lower compliance overhead than a Pvt. Ltd. — ideal for professional service firms, consultancies, boutique agencies, and businesses preferring a partnership model without unlimited personal risk.",
    timeline: "Day 1 to 3 Weeks",
    fee: "Rs. 5866 (Adjustable) + Stamp Duty",
    benefits: ["Limited liability for designated partners", "Separate legal entity & perpetual existence", "No minimum capital requirement", "Lower compliance vs. Pvt. Ltd.", "Flexible profit-sharing structure", "No upper limit on number of partners"],
    docs: ["PAN of all Designated Partners", "Aadhaar / Passport of all partners", "Passport-size Photographs", "Utility Bill (address proof)", "Registered Office proof (NOC + bill)", "Proposed LLP Name (3 options)", "LLP Agreement – we draft"],
    process: ["Name reservation via RUN-LLP on MCA", "DSC procurement for partners", "DPIN application for each partner", "FiLLiP Form filing on MCA", "Certificate of Incorporation issued", "LLP Agreement drafting & execution", "Form 3 filing with MCA"],
  },
  {
    id: "opc",
    label: "One Person Company",
    icon: "userCheck",
    tagline: "For solo founders who want corporate protection",
    description: "A One Person Company (OPC) gives a solo founder the benefits of a corporate entity with limited liability and full control. It is ideal for individual entrepreneurs who want a cleaner structure than a proprietorship while keeping decision-making simple.",
    timeline: "Day 1 to 3 Weeks",
    fee: "Rs. 6948 (Adjustable) + Stamp Duty",
    benefits: ["Limited liability for the solo founder", "100% ownership and control", "Better brand credibility than proprietorship", "Separate legal identity with perpetual succession", "Easy transition path to Pvt Ltd as you scale"],
    docs: ["PAN Card of the applicant", "Aadhaar / Passport of the applicant", "Passport-size photograph", "Utility bill (address proof)", "NOC from property owner", "DSC & DIN - we arrange", "MoA & AoA - we draft professionally"],
    process: ["Incorporation/Registration documentation starts on Day 1", "Your business website is live within 5 days", "Your OPC is market ready within 3 weeks"],
  },
  {
    id: "startup-india",
    label: "Startup India Recognition",
    icon: "rocket",
    tagline: "Unlock tax holidays & DPIIT funding",
    description: "Startup India Recognition is a DPIIT Government of India certification that grants qualifying startups exclusive benefits: 3-year income tax exemption (Sec. 80-IAC), capital gains tax exemption (Sec. 54EE), 80% rebate on patent filing fees, access to ₹10,000 Crore Fund of Funds, priority government tender eligibility, and self-certification under 9 labour and environmental laws. If your startup is younger than 10 years and demonstrates innovation, you should apply today.",
    timeline: "10–15 Working Days",
    fee: "₹3,999 (Professional Facilitation)",
    benefits: ["3-year Income Tax Holiday (Sec. 80-IAC)", "Capital Gains Exemption (Sec. 54EE)", "80% rebate on patent filing", "Access to ₹10,000 Cr Fund of Funds", "Government e-marketplace eligibility", "Self-certification under 9 labour laws", "Fast-track 90-day insolvency resolution"],
    docs: ["Certificate of Incorporation / Registration", "PAN of the Entity", "Aadhaar of Authorized Representative", "Innovation & Scalability write-up (we draft)", "Website / Product Demo link", "Pitch Deck / Business Plan", "Financial Statements if operational > 1 year"],
    process: ["Eligibility assessment (entity age & innovation)", "Startup India portal profile creation", "Self-certification under 9 labour laws", "DPIIT recognition application submission", "Government review & entity verification", "DIPP Certificate of Recognition issued", "Tax exemption application support (Sec. 80-IAC)"],
  },
  {
    id: "mou",
    label: "Memorandum of Understanding MoU",
    icon: "fileText",
    tagline: "Lay down the baseline for partnerships",
    description: "A Memorandum of Understanding (MoU) is a formal agreement between two or more parties outlining their mutual intent and cooperative framework. Although generally non-binding, it serves as the baseline for drafting definitive contracts, preventing misunderstandings during the initial stages of a joint venture, commercial alliance, or corporate partnership.",
    timeline: "2–3 Working Days",
    fee: "₹2,499 All-Inclusive",
    benefits: ["Defines clear roles and mutual expectations", "Acts as the foundation for definitive contracts", "Minimizes commercial negotiations friction", "Enables faster partnership kickoffs", "Non-binding nature allows project testing", "Confidentiality clauses protect business ideas"],
    docs: ["Details of both participating entities", "Scope of the proposed collaboration", "Contribution details (equity, capital, effort)", "Timeline & milestones of the project", "IP ownership guidelines", "Termination & exit clauses"],
    process: ["Requirement gathering & call with legal expert", "First draft compilation & alignment check", "Review and edits based on founder inputs", "Final MoU document delivery", "Signing and e-stamp execution guidance"],
  },
  {
    id: "jv-agreement",
    label: "Joint Venture Agreement",
    icon: "shield",
    tagline: "Structure alliances and shared growth",
    description: "A Joint Venture (JV) Agreement establishes the legal framework for two or more businesses combining resources to achieve a specific project or commercial goal. It details the equity structure, management control, profit sharing, intellectual property sharing, and exit mechanisms of the combined venture to safeguard all stakeholders.",
    timeline: "5–7 Working Days",
    fee: "₹9,999 All-Inclusive",
    benefits: ["Establishes equity allocation & shareholdings", "Clear control and board representation rules", "Protects IP brought by individual entities", "Detailed deadlock resolution procedures", "Pre-emption rights & exit mechanisms", "Statutory compliance guidelines"],
    docs: ["Incorporation details of partners", "Joint Venture business objectives", "Share capital contribution ratios", "Management & key staff structure details", "IP contribution details", "Arbitration & jurisdiction choice"],
    process: ["Structure discussion & strategy call", "Drafting of shareholding & management clauses", "First draft delivery & review rounds", "Final JV Agreement delivery", "Board resolution & execution support"],
  },
  {
    id: "nic-code",
    label: "NIC Code",
    icon: "layers",
    tagline: "Find the correct industry classification",
    description: "The National Industrial Classification (NIC) Code is a statistical classification system used to classify businesses based on their economic activities. The Ministry of Corporate Affairs, MSME, and Startup India portals require correct NIC codes for company registrations, GST applications, and Udyam registrations.",
    timeline: "Instant Search Tool",
    fee: "Free Utility",
    benefits: ["Mandatory for Udyam MSME Registration", "Required for SPICe+ MCA Company Filing", "Ensures correct tax bracket alignment", "Helps in licensing registrations", "Enables quick government data checks", "Facilitates bank account opening classifications"],
    docs: ["Describe your business activity", "Industry sector details", "Primary product or service name"],
    process: ["Enter search keywords of your activity", "Browse matching industrial sectors", "Select the specific 2-digit, 3-digit, or 5-digit code", "Copy the NIC code for official applications"],
  },
  {
    id: "tm-search",
    label: "Trademark Search",
    icon: "search",
    tagline: "Check if your brand name is free",
    description: "Trademark Search is a diagnostic check on the IP India database to determine if your proposed brand name, logo, or slogan is legally available or if it conflicts with existing registered trademarks. Conducting a search prevents application rejections, opposition from competitors, and infringement lawsuits.",
    timeline: "Instant Diagnostic",
    fee: "Free Utility",
    benefits: ["Prevents IP India TM rejections", "Finds potential brand name conflicts", "Checks phonetically similar marks", "Saves trademark filing fees & time", "Ensures clean brand registration", "Gives trademark class classifications"],
    docs: ["Brand Name to search", "Logo image (if searching device marks)", "Description of goods or services"],
    process: ["Query matching brand name in TM Database", "Perform wordmark and phonetic searches", "Classify activity under Nice Classification", "Review search report for conflicting applications"],
  },
  {
    id: "name-check",
    label: "Company Name Check",
    icon: "search",
    tagline: "Verify name availability on MCA database",
    description: "Company Name Check is an instant diagnostic search against the Ministry of Corporate Affairs (MCA) database. It verifies whether your proposed Private Limited or LLP company name complies with naming guidelines and is available for registration without conflicting with existing corporate names.",
    timeline: "Instant Check",
    fee: "Free Utility",
    benefits: ["Ensures RUN / SPICe+ MCA compliance", "Instantly flags identical company names", "Checks trademark naming conflicts", "Saves name application rejection fees", "Assists in selecting unique brand prefixes", "Checks suffix restrictions"],
    docs: ["Proposed company name prefix", "Selected structure type (Pvt Ltd / LLP)", "Primary business sector name"],
    process: ["Query MCA database for name prefix", "Filter active, inactive, and dissolved companies", "Flag phonetic name overlaps", "Verify trademark database for identical names"],
  },
  {
    id: "company-details",
    label: "Company Details",
    icon: "briefcase",
    tagline: "Search public director & registration details",
    description: "The Company Details Search retrieves public registration data of active Indian companies and LLPs from the MCA database. Access details like Date of Incorporation, Registered Address, Authorized Capital, Active Status, and list of Directors.",
    timeline: "Instant Search",
    fee: "Free Utility",
    benefits: ["Verify vendor / client credibility", "Access official date of incorporation", "Identify active directors & DIN numbers", "Check authorized and paid-up capital", "View official registered corporate address", "Monitor filing status (active/default)"],
    docs: ["Company name or CIN (Corporate ID Number)", "LLP name or LLPIN"],
    process: ["Enter CIN/LLPIN or Name prefix", "Fetch raw registration data from registry", "Display director and capital details", "Export details for verification"],
  },
  {
    id: "tm-class-search",
    label: "Trademark Class Search",
    icon: "search",
    tagline: "Identify correct Nice classification class",
    description: "Nice Classification divides goods and services into 45 distinct Trademark Classes (Classes 1-34 for goods, Classes 35-45 for services). Selecting the correct class is mandatory for filing trademark applications to protect your brand in the correct commercial segment.",
    timeline: "Instant Classification",
    fee: "Free Utility",
    benefits: ["Mandatory for trademark filings", "Identifies specific classification classes", "Prevents class amendment delays", "Protects brand in correct product categories", "Facilitates multi-class filings", "Covers ancillary services definitions"],
    docs: ["Product details list", "Service sector descriptions"],
    process: ["Search product/service keywords", "Locate classification class (1-45)", "Verify detailed class descriptions", "Select the correct class code"],
  },
  {
    id: "logo-maker",
    label: "Logo Maker",
    icon: "rocket",
    tagline: "Generate high-resolution vector logos",
    description: "The Logo Maker tool helps founders design and download professional, high-resolution vector logos tailored for their startup identity, ready for immediate business card usage, website launching, and trademark registration.",
    timeline: "Instant Builder",
    fee: "Free Startup Tool",
    benefits: ["Instant high-res logo creation", "Vector SVG/PNG file downloads", "Designed for trademark compatibility", "Modern fonts & layout options", "No design skills required", "Commercial use rights included"],
    docs: ["Brand Name", "Slogan or tagline", "Preferred icon theme or color scheme"],
    process: ["Enter brand name and tagline details", "Select your industry sector theme", "Choose preferred layouts and colors", "Download high-res vector logo file package"],
  },
];

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  // { icon: "fileText", title: "MCA Annual Filings", desc: "AOC-4, MGT-7, and DIR-3 KYC to stay penalty-free with the Ministry of Corporate Affairs.", color: "emerald" },
  // { icon: "dollarSign", title: "GST Returns & Invoicing", desc: "GSTR-1, GSTR-3B, GSTR-9 filings and GST-compliant invoice template setup.", color: "blue" },
  // { icon: "users", title: "TDS & Payroll Setup", desc: "TAN registration, monthly TDS deduction, Form 16 issuance, and full payroll compliance.", color: "purple" },
  { icon: "shield", title: "Shareholders Agreement (SHA)", desc: "Legally binding SHA covering vesting, anti-dilution, drag-along, tag-along, and ROFR clauses.", color: "orange" },
  { icon: "lock", title: "NDA & Confidentiality", desc: "Mutual and one-way NDA templates for vendor, employee, and investor use cases.", color: "pink" },
  { icon: "globe", title: "Website Legal Package", desc: "Privacy Policy, T&C, Cookie Policy, Refund Policy, and GDPR/IT Act compliance for your platform.", color: "teal" },
];

export const colorMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  blue: "bg-blue-100 text-blue-700 border border-blue-200",
  purple: "bg-purple-100 text-purple-700 border border-purple-200",
  orange: "bg-orange-100 text-orange-700 border border-orange-200",
  pink: "bg-pink-100 text-pink-700 border border-pink-200",
  teal: "bg-teal-100 text-teal-700 border border-teal-200",
};

export const PACKAGES: Package[] = [
  {
    id: "tier-1-digital-foundation",
    name: "🛡️ TIER 1 :  The Digital Foundation",
    price: "₹9,500", 
    subtitle: "Best for early-stage websites, solo consultants, and mobile apps requiring immediate statutory digital compliance.", 
    badge: "",
    border: "border-emerald-400 ring-2 ring-emerald-400 ring-offset-2", 
    btn: "bg-emerald-600 hover:bg-emerald-500 text-white", // Note: 'grad-em' can be replaced with this if custom class isn't defined
    features: ["Tech Delivery", "3-Day Express Web Presence Deployment", "Enterprise-Grade SSL Security Certificate", "Standard Cloud Repository for digital asset storage", "Legal Delivery", "Bespoke Website Terms of Service (ToS)", "DPDP-Compliant Data Privacy Policy", "Payment Gateway Cancellation & Refund Policy" ],
    not: ["LLP Registration", "Full Payroll & TDS Setup"],
  },
  {
    id: "tier-2-cofounder-shield",
    name: "🤝 TIER 2 : The Co-Founder Shield",
    price: "₹14,000", 
    subtitle: "Best for multi-founder teams building an MVP who need to lock in equity boundaries and secure their IP.", 
    badge: "",
    border: "border-slate-700", 
    btn: "bg-slate-900 hover:bg-slate-800 text-white", 
    features: ["Tech Delivery ","Dedicated Client Dashboard Setup","Encrypted Digital Boardroom for cap-table mapping","Secure E-Signing Workflows", "Legal Delivery","Bespoke Co-Founders Agreement","Custom Equity Vesting & Cliff Mechanics","Co-Founder Exit Protocols & Dispute Resolution","Mutual Non-Disclosure Agreement (NDA) Suite" ],
    not: ["LLP Registration", "Full Payroll & TDS Setup"], 
  },
  {
    id: "tier-3-complete-incubator",
    name: "🚀 TIER 3 : The Complete Tech-Legal Incubator",
    price: "₹24,500", 
    subtitle: "Everything required to incorporate, build, protect, and pitch to venture capitalists with absolute confidence.", 
    badge: "Our Flagship Ecosystem",
    border: "border-purple-700", 
    btn: "bg-purple-600 hover:bg-purple-700 text-white",
    features: ["Corporate Delivery","Complete Pvt Ltd or LLP Incorporation Advisory & Execution","Government Filing & Statutory Sign-off (By Authorized Advocates)","Tech Delivery ","Full Corporate Web Presence & Architecture","SSL Security & Cloud Server Setup","1-Year Dedicated Digital Vault Access (Your entire corporate history, secured)", "Legal Delivery","Master Services Agreement (MSA) Engine","Employment Offer Tiers & Independent Contractor Agreements","Employee Stock Ownership Plan (ESOP) Policy Outline","Bonus : Direct Retainer mapping with independent legal counsel via Jayam Law Chambers." ],
    not: [],
  },
  {
    id: "corporate-structuring",
    name: "🏛️ Corporate Structuring & Incorporation",
    price: "₹11,500",
    subtitle: "The right entity structure dictates your ability to raise funds, protect personal assets, and scale.",
    badge: "",
    border: "border-slate-700",
    btn: "bg-slate-900 hover:bg-slate-800 text-white",
    features: [
      "Private Limited Company (Pvt Ltd) — The Gold Standard",
      "Ideal for raising venture capital, issuing ESOPs & scalable equity structures",
      "Limited Liability Partnership (LLP) — The Bootstrapper's Shield",
      "Premium personal asset protection without heavy statutory audit compliance",
      "One Person Company (OPC) — The Solo Founder's Launchpad",
      "Corporate entity with limited liability, while you retain 100% control",
    ],
    not: [],
  },
  {
    id: "digital-infrastructure",
    name: "💻 Secure Digital Infrastructure (Tech)",
    price: "₹8,500",
    subtitle: "Traditional law firms don't write code. We build your digital footprint to pass enterprise IT audits.",
    badge: "",
    border: "border-slate-700",
    btn: "bg-slate-900 hover:bg-slate-800 text-white",
    features: [
      "Express Web Presence — Live in 3 Days",
      "Domain procurement to custom responsive web deployment",
      "Enterprise-Grade SSL Security with top-tier encryption",
      "Meets global data security standards & builds instant user trust",
      "Encrypted Digital Vault & Dashboard",
      "Secure cloud portal for contracts, entity milestones & boardroom data",
    ],
    not: [],
  },
  {
    id: "contracts-compliance",
    name: "📄 Corporate Contracts & Compliance Hub",
    price: "₹12,500",
    subtitle: "Stop using free templates. Protect your business with contracts drafted by legal architects.",
    badge: "",
    border: "border-slate-700",
    btn: "bg-slate-900 hover:bg-slate-800 text-white",
    features: [
      "Foundational Agreements — Bespoke Co-Founders' Agreements, Vesting Schedules & Mutual NDAs",
      "Full protection for your IP and equity splits",
      "Commercial Infrastructure — MSAs, Vendor Contracts & Employment Offer Letters",
      "Designed to protect your operational cash flow",
      "Data & Digital Compliance — Website Terms of Service (ToS) & Privacy Policies",
      "Strictly compliant with the new Digital Personal Data Protection (DPDP) Act",
    ],
    not: [],
  },
];



