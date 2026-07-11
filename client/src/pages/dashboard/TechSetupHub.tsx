import { useContext, useState } from 'react';
import { AuthContext, type User } from '../../context/AuthContext';
import { Mail, Shield, Check, Globe, Monitor, Rocket, Layers, Activity, Eye, Server, Wifi, Code, Settings, CheckCircle2, Loader2 } from 'lucide-react';

interface TechSetupHubProps {
  user: User;
}

export default function TechSetupHub({ user }: TechSetupHubProps) {
  const auth = useContext(AuthContext);
  const [emailPlan, setEmailPlan] = useState<string | null>(user.emailPlan);
  const [webPlan, setWebPlan] = useState<string | null>(user.webPlan);
  const [emailActivated, setEmailActivated] = useState(user.emailActivated);
  const [webLaunched, setWebLaunched] = useState(user.webLaunched);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingWeb, setSavingWeb] = useState(false);

  const selectEmailPlan = async (id: string) => {
    setEmailPlan(id);
    if (auth) await auth.updateTechSetup({ emailPlan: id });
  };

  const selectWebPlan = async (id: string) => {
    setWebPlan(id);
    if (auth) await auth.updateTechSetup({ webPlan: id });
  };

  const activateEmail = async () => {
    setSavingEmail(true);
    if (auth) await auth.updateTechSetup({ emailActivated: true });
    setEmailActivated(true);
    setSavingEmail(false);
  };

  const launchWeb = async () => {
    setSavingWeb(true);
    if (auth) await auth.updateTechSetup({ webLaunched: true });
    setWebLaunched(true);
    setSavingWeb(false);
  };

  const domain = user.companyName.split(" ")[0].toLowerCase() + ".in";

  const emailPlans = [
    { id: "starter", name: "Starter Inbox", price: "₹499/mo", storage: "15 GB", aliases: 2, spam: "Basic Filter", features: ["Custom domain email", "Spam & phishing protection", "Mobile & web access", "2 email aliases"] },
    { id: "pro", name: "Business Pro", price: "₹999/mo", storage: "100 GB", aliases: 10, spam: "AI Spam Shield", features: ["Everything in Starter", "100 GB cloud storage", "10 team email aliases", "AI-powered spam shield", "Google Workspace sync"] },
    { id: "enterprise", name: "Enterprise Suite", price: "₹2,499/mo", storage: "Unlimited", aliases: "Unlimited", spam: "Enterprise Guard", features: ["Everything in Business Pro", "Unlimited storage & aliases", "SSO / SAML integration", "99.99% SLA uptime", "Dedicated support"] },
  ];

  const webOptions = [
    { id: "portfolio", icon: Monitor, name: "Portfolio Landing Page", desc: "A sleek one-page site showcasing your startup, team, product, and contact details. Deployed in under 15 minutes.", time: "~15 min", color: "grad-em" },
    { id: "saas", icon: Rocket, name: "SaaS Product Launch Page", desc: "High-converting product page with hero, features, pricing, and waitlist form. Built on Next.js with analytics integration.", time: "~45 min", color: "grad-blue" },
    { id: "ecom", icon: Layers, name: "E-commerce Starter", desc: "Shopify-integrated storefront with product catalog, payment gateway, and mobile-optimized design.", time: "~2 hrs", color: "grad-purple" },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="glass rounded-3xl p-7">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl grad-blue flex items-center justify-center shadow-xl">
            <Monitor size={26} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-black text-xl">Tech Setup & Operations Hub</h2>
            <p className="text-slate-400 text-sm">Configure your startup's digital identity — email, website, and workspace tools</p>
          </div>
        </div>
      </div>

      {/* SECTION 1: EMAIL SUITE */}
      <div className="glass rounded-3xl p-7">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Mail size={20} className="text-emerald-400"/>
          <h3 className="text-white font-black text-lg">Corporate Email Suite</h3>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/25">Setup Required</span>
        </div>
        <p className="text-slate-400 text-sm mb-6">Get professional inboxes on <strong className="text-emerald-400">@{domain}</strong> — founder@{domain}, team@{domain}, support@{domain} and more.</p>

        {/* Preview addresses */}
        <div className="grid sm:grid-cols-3 gap-3 mb-7">
          {[`founder@${domain}`, `team@${domain}`, `support@${domain}`].map((addr, i) => (
            <div key={i} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
              <div className="w-7 h-7 rounded-lg grad-em flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xs">{addr.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-slate-300 text-xs font-mono truncate">{addr}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {emailPlans.map(plan => (
            <button key={plan.id} onClick={() => selectEmailPlan(plan.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all block w-full ${emailPlan === plan.id ? "border-emerald-400 bg-emerald-500/10" : "border-slate-700/50 hover:border-emerald-500/40 hover:bg-slate-800/40"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-sm">{plan.name}</span>
                {emailPlan === plan.id && <Check size={14} className="text-emerald-400" strokeWidth={2.5} />}
              </div>
              <p className="text-emerald-400 font-black text-lg mb-3">{plan.price}</p>
              <div className="space-y-1.5">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Check size={11} className="text-emerald-400 flex-shrink-0" strokeWidth={2.5} />{f}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {emailActivated ? (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-emerald-400 font-bold text-sm">Corporate Email Suite Activated!</p>
              <p className="text-slate-400 text-xs font-medium">Your DNS records are being propagated. Inboxes will be live within 24–48 hours.</p>
            </div>
          </div>
        ) : (
          <button disabled={!emailPlan || savingEmail} onClick={activateEmail}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all ${emailPlan ? "grad-em hover:opacity-90 shadow-lg" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
            {savingEmail && <Loader2 size={15} className="animate-spin" />}
            {emailPlan ? `Activate ${emailPlans.find(p => p.id === emailPlan)?.name} →` : "Select a Plan to Continue"}
          </button>
        )}
      </div>

      {/* SECTION 2: WEBSITE LAUNCHPAD */}
      <div className="glass rounded-3xl p-7">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Globe size={20} className="text-blue-400" />
          <h3 className="text-white font-black text-lg">Instant Website Launchpad</h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold border border-blue-500/25">Beta</span>
        </div>
        <p className="text-slate-400 text-sm mb-6">Auto-deploy a custom startup website on <strong className="text-blue-400">{domain}</strong> — no coding required. Choose your template and we handle the rest.</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {webOptions.map(opt => {
            const Icon = opt.icon;
            return (
              <button key={opt.id} onClick={() => selectWebPlan(opt.id)}
                className={`p-5 rounded-2xl border-2 text-left transition-all block w-full ${webPlan === opt.id ? "border-blue-400 bg-blue-500/8" : "border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-800/40"}`}>
                <div className={`w-10 h-10 rounded-xl ${opt.color} flex items-center justify-center mb-4`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-bold text-sm">{opt.name}</h4>
                  {webPlan === opt.id && <Check size={14} className="text-blue-400" strokeWidth={2.5} />}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-3 font-medium">{opt.desc}</p>
                <span className="text-xs text-blue-400 font-semibold">⚡ Live in {opt.time}</span>
              </button>
            );
          })}
        </div>

        {/* Analytics integration */}
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {[
            { name: "Google Analytics 4", icon: Activity, color: "text-orange-400", desc: "Traffic & conversion tracking" },
            { name: "Hotjar Heatmaps", icon: Eye, color: "text-pink-400", desc: "User behavior analytics" },
            { name: "Razorpay Payments", icon: Globe, color: "text-blue-400", desc: "One-click payment integration" },
          ].map((tool, i) => {
            const Icon = tool.icon;
            return (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                <Icon size={16} className={`${tool.color} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className="text-white text-xs font-bold">{tool.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">{tool.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {webLaunched ? (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-blue-500/10 border border-blue-500/25">
            <CheckCircle2 size={18} className="text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-blue-400 font-bold text-sm">Website Build Initiated!</p>
              <p className="text-slate-400 text-xs font-medium">Your site is being built and deployed. You'll receive an email with the live URL shortly.</p>
            </div>
          </div>
        ) : (
          <button disabled={!webPlan || savingWeb} onClick={launchWeb}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all ${webPlan ? "grad-blue hover:opacity-90 shadow-lg" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
            {savingWeb && <Loader2 size={15} className="animate-spin" />}
            {webPlan ? `Launch ${webOptions.find(o => o.id === webPlan)?.name} →` : "Select a Template to Continue"}
          </button>
        )}
      </div>

      {/* Workspace tools */}
      <div className="glass rounded-3xl p-7">
        <div className="flex items-center gap-3 mb-6">
          <Settings size={20} className="text-purple-400" />
          <h3 className="text-white font-black text-lg">Workspace Management Tools</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Wifi, name: "Domain DNS Manager", desc: "Manage A, CNAME, MX records", status: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { icon: Server, name: "Cloud Hosting Panel", desc: "Server health, uptime & logs", status: "Standby", color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: Code, name: "API Key Vault", desc: "Manage third-party integrations", status: "2 Active", color: "text-purple-400", bg: "bg-purple-500/10" },
            { icon: Shield, name: "SSL Certificate", desc: "Auto-renewing HTTPS security", status: "Valid 365d", color: "text-orange-400", bg: "bg-orange-500/10" },
          ].map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} className="bento p-4 rounded-2xl border border-slate-700/30 hover:border-slate-600/60 transition-all bg-slate-800/30">
                <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center mb-3`}><Icon size={18} className={t.color} /></div>
                <h4 className="text-white font-bold text-sm mb-1">{t.name}</h4>
                <p className="text-slate-400 text-xs mb-2">{t.desc}</p>
                <span className={`text-xs font-bold ${t.color}`}>{t.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
