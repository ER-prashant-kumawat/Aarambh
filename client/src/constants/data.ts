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

export const SERVICES: Service[] = [
  {
    id: "pvt-ltd",
    label: "Private Limited Company",
    icon: "building",
    tagline: "India's most preferred startup structure",
    description: "A Private Limited Company (Pvt. Ltd.) is the gold standard for Indian startups seeking scalability, investor readiness, and limited liability. Governed by the Ministry of Corporate Affairs (MCA) under the Companies Act 2013, it provides a separate legal identity, perpetual succession, and the ability to raise VC/angel funding. It's the backbone of India's startup ecosystem — from Day 1 ideation to IPO-ready scale.",
    timeline: "5–7 Working Days",
    fee: "₹6,999 All-Inclusive",
    benefits: ["Limited Liability for all shareholders", "Separate legal entity with perpetual existence", "VC / angel investor fundraising eligibility", "ESOP issuance for talent hiring", "High credibility with banks & vendors", "Corporate bank account opening"],
    docs: ["PAN Card of all Directors", "Aadhaar / Passport of Directors", "Passport-size Photographs", "Utility Bill (address proof)", "NOC from property owner", "DSC & DIN – we arrange", "MoA & AoA – we draft professionally"],
    process: ["Document collection & DSC application", "DIN procurement for all directors", "Name reservation via RUN on MCA", "SPICe+ form filing with MCA", "Certificate of Incorporation issued", "PAN & TAN allotment for the company", "Current bank account setup guidance"],
  },
  {
    id: "gst",
    label: "GST Registration",
    icon: "fileText",
    tagline: "Mandatory above ₹20L turnover",
    description: "GST Registration is legally mandatory for businesses exceeding ₹20 lakhs annual turnover (₹10 lakhs for special category states) and for all interstate supply entities. Your GSTIN unlocks the ability to collect GST from clients, claim Input Tax Credit (ITC) on business purchases, and qualify for government tenders. Our expert team ensures a clean, accurate, first-time-right filing on the GSTN portal.",
    timeline: "3–5 Working Days",
    fee: "₹1,499 All-Inclusive",
    benefits: ["Legal authorization to collect GST", "Input Tax Credit on all purchases", "Interstate trade eligibility", "e-Commerce platform selling access", "Government tender qualification", "Composition Scheme option for small biz"],
    docs: ["PAN of Business Owner / Company", "Aadhaar of Authorized Signatory", "Proof of Business Registration", "Bank Statement / Cancelled Cheque", "Utility Bill / Rent Agreement", "Board Resolution / Authorization Letter"],
    process: ["Business assessment & category identification", "Document verification & compilation", "GSTN portal application filing", "ARN generation & acknowledgment", "Government officer verification (if required)", "GSTIN Certificate issuance"],
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
    timeline: "7–10 Working Days",
    fee: "₹5,499 All-Inclusive",
    benefits: ["Limited liability for designated partners", "Separate legal entity & perpetual existence", "No minimum capital requirement", "Lower compliance vs. Pvt. Ltd.", "Flexible profit-sharing structure", "No upper limit on number of partners"],
    docs: ["PAN of all Designated Partners", "Aadhaar / Passport of all partners", "Passport-size Photographs", "Utility Bill (address proof)", "Registered Office proof (NOC + bill)", "Proposed LLP Name (3 options)", "LLP Agreement – we draft"],
    process: ["Name reservation via RUN-LLP on MCA", "DSC procurement for partners", "DPIN application for each partner", "FiLLiP Form filing on MCA", "Certificate of Incorporation issued", "LLP Agreement drafting & execution", "Form 3 filing with MCA"],
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
    name: "Starter Setup", 
    price: "₹4,999", 
    subtitle: "For solo founders & early ideas", 
    badge: null,
    border: "border-slate-200", 
    btn: "bg-slate-800 hover:bg-slate-700 text-white",
    features: ["Private Limited Company Registration", "MCA Filing Assistance", "PAN & TAN Allotment Guidance", "Current Bank Account Setup Support", "Digital Signature Certificate (1 Director)", "Basic MoA & AoA Drafting", "Post-Incorporation Compliance Checklist", "Email Support – 30 Days"],
    not: ["GST Registration", "Trademark Filing", "Startup India Recognition", "Priority Support"],
  },
  {
    name: "Hyper Growth Scale", 
    price: "₹11,999", 
    subtitle: "For serious startups ready to scale", 
    badge: "Most Popular",
    border: "border-emerald-400 ring-2 ring-emerald-400 ring-offset-2", 
    btn: "bg-emerald-600 hover:bg-emerald-500 text-white", // Note: 'grad-em' can be replaced with this if custom class isn't defined
    features: ["Everything in Starter Setup", "GST Registration (GSTIN)", "Trademark Filing (1 Class)", "Startup India DPIIT Recognition", "Shareholders Agreement (SHA)", "NDA Template (Mutual + One-way)", "Website Legal Pack (Privacy + T&C)", "MCA Annual Filing (Year 1)", "Dedicated Relationship Manager", "WhatsApp + Phone Support – 90 Days"],
    not: ["LLP Registration", "Full Payroll & TDS Setup"],
  },
  {
    name: "Full Stack Elite", 
    price: "₹24,999", 
    subtitle: "For funded startups & growth companies", 
    badge: "Best Value",
    border: "border-slate-700", 
    btn: "bg-slate-900 hover:bg-slate-800 text-white", 
    features: ["Everything in Hyper Growth Scale", "LLP Registration (if needed)", "Complete Payroll & TDS Architecture", "Trademark Filing (3 Classes)", "FSSAI / IE Code / Sector Licenses", "Founders' Agreement & ESOP Policy", "Full GST Return Filing (12 months)", "Corporate NDA + Vendor Agreements", "Pitch Deck Review & Investor Readiness", "Quarterly Compliance Health Check", "Dedicated Senior CA + Legal Advisor", "Priority WhatsApp + Phone – 12 Months"],
    not: ["LLP Registration", "Full Payroll & TDS Setup"], // Fixed the 'not' array for consistency
  },
  {
    name: "Enterprise Custom", // Note: Renamed from duplicate Full Stack Elite to avoid redundancy
    price: "Custom", 
    subtitle: "For enterprise scale & custom legal needs", 
    badge: "Enterprise",
    border: "border-purple-700", 
    btn: "bg-purple-600 hover:bg-purple-700 text-white",
    features: ["Everything in Full Stack Elite", "Custom Contract Drafting", "Dedicated Legal Team", "24/7 Priority Support", "International IP Protection", "Custom SLA Agreements", "Corporate Restructuring Advice"],
    not: [],
  },
];
