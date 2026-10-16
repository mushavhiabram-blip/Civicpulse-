import React, { useState } from 'react';
import { store } from '../services/store';
import { generateLeaderPitchAI, LeaderPitchResult } from '../services/api';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Gift, 
  Sparkles, 
  Copy, 
  Check, 
  Wand2, 
  Loader2, 
  Award, 
  Download, 
  TrendingUp, 
  ChevronRight, 
  Radio, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  Store, 
  QrCode, 
  Share2, 
  FileText,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GrassrootsGrowthHubProps {
  onRefreshData: () => void;
  onOpenAdPortal: () => void;
}

interface GeographicNode {
  id: string;
  name: string;
  suburbWard: string;
  targetHouseholds: number;
  currentResidents: number;
  densityPercentage: number;
  status: 'Active Anchor Node' | 'Pre-Launch Onboarding' | 'Planning Phase';
  ratepayersPartner: string;
  cpfPartner: string;
  anchorSponsorsCount: number;
  monthlyRevenue: number;
}

const INITIAL_NODES: GeographicNode[] = [
  {
    id: 'node-1',
    name: 'Oakridge Suburb Node 1',
    suburbWard: 'Ward 4, Oakridge Municipality',
    targetHouseholds: 2000,
    currentResidents: 1420,
    densityPercentage: 71,
    status: 'Active Anchor Node',
    ratepayersPartner: 'Oakridge Ratepayers Association (Verified)',
    cpfPartner: 'Ward 4 Community Policing Forum (Active)',
    anchorSponsorsCount: 4,
    monthlyRevenue: 218
  },
  {
    id: 'node-2',
    name: 'Pinewood Ridge Node 2',
    suburbWard: 'Ward 5, Pinewood Heights',
    targetHouseholds: 1500,
    currentResidents: 340,
    densityPercentage: 22,
    status: 'Pre-Launch Onboarding',
    ratepayersPartner: 'Pinewood Ratepayers Guild (In Talks)',
    cpfPartner: 'Sector 2 CPF (Invited)',
    anchorSponsorsCount: 1,
    monthlyRevenue: 89
  },
  {
    id: 'node-3',
    name: 'Lakeside Estate Node 3',
    suburbWard: 'Ward 8, Lakeside West',
    targetHouseholds: 1800,
    currentResidents: 90,
    densityPercentage: 5,
    status: 'Planning Phase',
    ratepayersPartner: 'Pending Outreach',
    cpfPartner: 'Pending Outreach',
    anchorSponsorsCount: 0,
    monthlyRevenue: 0
  }
];

export const GrassrootsGrowthHub: React.FC<GrassrootsGrowthHubProps> = ({
  onRefreshData,
  onOpenAdPortal
}) => {
  const [nodes, setNodes] = useState<GeographicNode[]>(INITIAL_NODES);
  const [activeNodeId, setActiveNodeId] = useState<string>('node-1');

  // Pillar 1: Leader Pitching State
  const [pitchOrgType, setPitchOrgType] = useState<'Ratepayers Association' | 'Community Policing Forum (CPF)' | 'Neighborhood Watch'>('Ratepayers Association');
  const [pitchOrgName, setPitchOrgName] = useState('Oakridge Ratepayers Association');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState<LeaderPitchResult | null>(null);
  const [isPitchCopied, setIsPitchCopied] = useState(false);

  // Pillar 2: Anchor Free Trial State
  const [anchorBizName, setAnchorBizName] = useState('');
  const [anchorCategory, setAnchorCategory] = useState<'Home Services' | 'Health & Wellness' | 'Retail & Market' | 'Dining & Cafe'>('Home Services');
  const [anchorEmail, setAnchorEmail] = useState('');
  const [anchorSpecialOffer, setAnchorSpecialOffer] = useState('');
  const [isTrialIssued, setIsTrialIssued] = useState(false);

  // Active Node Object
  const currentNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  // AI Leader Pitch Generator Handler
  const handleGeneratePitch = async () => {
    setIsGeneratingPitch(true);
    setGeneratedPitch(null);
    try {
      const pitch = await generateLeaderPitchAI({
        targetOrgType: pitchOrgType,
        targetOrgName: pitchOrgName,
        nodeName: currentNode.name
      });
      setGeneratedPitch(pitch);
    } catch (err) {
      console.error('Failed to generate pitch deck:', err);
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleCopyPitch = () => {
    if (!generatedPitch) return;
    const text = `SUBJECT: ${generatedPitch.subjectLine}\n\n${generatedPitch.executiveSummary}\n\nKEY BENEFITS FOR YOUR MEMBERS:\n${generatedPitch.keyBenefits.map(b => `• ${b}`).join('\n')}\n\nPROPOSED CO-BRANDING AGREEMENT:\n${generatedPitch.coMarketingPledge}\n\nNEXT STEPS:\n${generatedPitch.suggestedCallToAction}`;
    navigator.clipboard.writeText(text);
    setIsPitchCopied(true);
    setTimeout(() => setIsPitchCopied(false), 2500);
  };

  // Issue 3-Month Free Trial Offer for Anchor Local Business
  const handleIssueAnchorTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorBizName.trim()) return;

    store.addBusinessSubscription({
      businessName: anchorBizName,
      category: anchorCategory,
      tier: 'sponsor', // Tier 2 Sponsor Tier ($89/mo value)
      ownerEmail: anchorEmail || 'anchor@oakridge.org',
      headline: `Anchor Community Partner: ${anchorBizName}`,
      bodyText: `Official Anchor Sponsor partnering with local Ratepayers & Neighborhood Watch. Offering exclusive resident deals!`,
      dealOffer: anchorSpecialOffer || 'Exclusive 15% Resident Voucher + Priority Service',
      couponCode: `ANCHOR3FREE-${Math.floor(1000 + Math.random() * 9000)}`,
      callToAction: 'Claim Anchor Resident Deal',
      address: `${currentNode.name} Commercial Hub`
    });

    // Update node anchor count
    setNodes(prev => prev.map(n => n.id === activeNodeId ? {
      ...n,
      anchorSponsorsCount: n.anchorSponsorsCount + 1,
      monthlyRevenue: n.monthlyRevenue + 89
    } : n));

    onRefreshData();
    setIsTrialIssued(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    // Reset inputs
    setAnchorBizName('');
    setAnchorEmail('');
    setAnchorSpecialOffer('');
    setTimeout(() => setIsTrialIssued(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold px-3 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Grassroots Growth & Partner Acquisition Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Node-by-Node Community Launch Strategy
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Execute high-density neighborhood growth by partnering with existing trusted leadership (Ratepayers Associations & CPFs), onboarding local anchor businesses with 3-month trial incentives, and establishing deep resident density node-by-node.
          </p>
        </div>

        {/* 3 Pillars Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-purple-500/20">
          <div className="bg-slate-950/80 border border-purple-500/20 rounded-2xl p-3.5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-purple-400 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5" />
              <span>1. Partner Leaders</span>
            </div>
            <p className="text-xs font-bold text-white">Ratepayers & CPFs</p>
            <p className="text-[11px] text-slate-400">Leverage existing trusted leaders lacking modern tools.</p>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-3.5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center space-x-1">
              <Gift className="w-3.5 h-3.5" />
              <span>2. Anchor Advertisers</span>
            </div>
            <p className="text-xs font-bold text-white">3-Month Free Trial (Tier 2)</p>
            <p className="text-[11px] text-slate-400">Lock in local security & hardware stores for co-marketing.</p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-3.5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>3. Single Node Density</span>
            </div>
            <p className="text-xs font-bold text-white">70%+ Household Goal</p>
            <p className="text-[11px] text-slate-400">Establish local density in one suburb before expanding.</p>
          </div>
        </div>
      </div>

      {/* PILLAR 3: GEOGRAPHIC NODE SELECTOR & DENSITY METER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-black text-white">Geographic Node Density Radar</h3>
            </div>
            <p className="text-xs text-slate-400">Grassroots onboarding focuses density in one suburb node before expanding adjacent wards.</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-bold">Active Node:</span>
            <select
              value={activeNodeId}
              onChange={e => setActiveNodeId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-emerald-400 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                  {n.name} ({n.densityPercentage}% Density)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Node Performance Meter */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black text-white">{currentNode.name}</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  currentNode.densityPercentage >= 70
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {currentNode.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentNode.suburbWard}</p>
            </div>

            <div className="flex items-center space-x-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Residents</span>
                <span className="text-white font-bold">{currentNode.currentResidents} / {currentNode.targetHouseholds}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Anchors</span>
                <span className="text-emerald-400 font-bold">{currentNode.anchorSponsorsCount} Active</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Node Revenue</span>
                <span className="text-amber-300 font-bold">${currentNode.monthlyRevenue}/mo</span>
              </div>
            </div>
          </div>

          {/* Density Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Household Penetration Density</span>
              <span className={currentNode.densityPercentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                {currentNode.densityPercentage}% (Target: 70%+ Expansion Threshold)
              </span>
            </div>
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 relative">
              <div
                className={`h-full transition-all duration-700 ${
                  currentNode.densityPercentage >= 70
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-amber-500 to-amber-300'
                }`}
                style={{ width: `${Math.min(100, currentNode.densityPercentage)}%` }}
              />
            </div>
          </div>

          {/* Node Strategic Advice Callout */}
          {currentNode.densityPercentage >= 70 ? (
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Critical Mass Reached! Density is 71%. Unlocked Node 2 Expansion Kit & Door-Hanger Flyer distribution.</span>
              </div>
              <button 
                onClick={() => setActiveNodeId('node-2')}
                className="bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-400 shrink-0"
              >
                Launch Node 2 →
              </button>
            </div>
          ) : (
            <div className="bg-amber-950/40 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-200 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span>Density Strategy: Focus all community leader outreach and local security flyer drops in this node to reach 70% before moving to Node 2.</span>
            </div>
          )}
        </div>
      </div>

      {/* PILLAR 1: PARTNER WITH EXISTING COMMUNITY LEADERS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Partner with Existing Community Leaders</h3>
            <p className="text-xs text-slate-400">Pitch Ratepayers Associations, Community Policing Forums (CPFs), and Neighborhood Watches who already hold resident engagement.</p>
          </div>
        </div>

        {/* Existing Leader Status Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Ratepayers Associations</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active Partner
              </span>
            </div>
            <p className="text-xs text-slate-300 font-bold">{currentNode.ratepayersPartner}</p>
            <p className="text-[11px] text-slate-500">Provides municipal escalation tracking, community improvement voting, and formal board backing.</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Community Policing Forums</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active CPF
              </span>
            </div>
            <p className="text-xs text-slate-300 font-bold">{currentNode.cpfPartner}</p>
            <p className="text-[11px] text-slate-500">Integrates GIS map safety alerts, neighborhood watch patrol logs, and emergency broadcasts.</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Verified Leader Badges</span>
              </span>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Official Access
              </span>
            </div>
            <p className="text-xs text-slate-300 font-bold">Verified Executive Pass</p>
            <p className="text-[11px] text-slate-500">Leaders receive verified society admin badges to co-moderate feeds and publish official bulletins.</p>
          </div>
        </div>

        {/* AI Pitch Generator for Leaders */}
        <div className="bg-gradient-to-r from-purple-950/60 via-slate-950 to-indigo-950/60 border border-purple-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
              <Wand2 className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>AI Community Leader Pitch Generator</span>
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
              Zero-Cost Tool Pitch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Target Organization Type</label>
              <select
                value={pitchOrgType}
                onChange={e => setPitchOrgType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 font-bold focus:outline-none"
              >
                <option value="Ratepayers Association">Ratepayers Association</option>
                <option value="Community Policing Forum (CPF)">Community Policing Forum (CPF)</option>
                <option value="Neighborhood Watch">Neighborhood Watch Executive</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Organization Name</label>
              <input
                type="text"
                value={pitchOrgName}
                onChange={e => setPitchOrgName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 font-bold focus:outline-none"
                placeholder="e.g. Ward 4 Ratepayers Executive Committee"
              />
            </div>
          </div>

          <button
            onClick={handleGeneratePitch}
            disabled={isGeneratingPitch}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black py-3 rounded-xl text-xs transition shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-2"
          >
            {isGeneratingPitch ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting Customized Leader Proposal Deck...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Partnership Pitch Deck for {pitchOrgName}</span>
              </>
            )}
          </button>

          {/* Rendered AI Pitch Deck Result */}
          {generatedPitch && (
            <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-5 space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div>
                  <span className="text-[10px] text-purple-400 uppercase font-black tracking-wider block">Generated Proposal Letter</span>
                  <p className="font-bold text-white text-sm">{generatedPitch.subjectLine}</p>
                </div>
                <button
                  onClick={handleCopyPitch}
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition"
                >
                  {isPitchCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isPitchCopied ? 'Copied Pitch!' : 'Copy Proposal Text'}</span>
                </button>
              </div>

              <div className="text-slate-300 leading-relaxed space-y-2 whitespace-pre-line">
                {generatedPitch.executiveSummary}
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                <span className="text-emerald-400 font-bold block text-[11px] uppercase">Key Benefits for Their Members:</span>
                <ul className="space-y-1 text-slate-300">
                  {generatedPitch.keyBenefits.map((b, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300 space-y-1">
                <span className="text-amber-300 font-bold text-[11px] block uppercase">Proposed Co-Branding Agreement:</span>
                <p>{generatedPitch.coMarketingPledge}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PILLAR 2: ANCHOR LOCAL ADVERTISERS (3-MONTH FREE TRIAL ON TIER 2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Anchor Local Advertisers — 3-Month Free Trial Portal</h3>
              <p className="text-xs text-slate-400">Target local security providers, hardware stores, & nurseries. Offer 3 months free on Tier 2 ($89/mo value) for client co-marketing.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg shadow-amber-400/20">
              $267 Value Offer
            </span>
          </div>
        </div>

        {/* Incentive Strategy Explanation Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <Store className="w-4 h-4" />
              <span>Target Anchor Merchants</span>
            </div>
            <p className="text-xs text-slate-300">
              Local Security Companies (ADT, Fidelity, Shield), Hardware Stores (Valley Eco Hardware), Nurseries, & Pet Clinics.
            </p>
            <p className="text-[11px] text-slate-500">
              These businesses already communicate with 80%+ of the neighborhood via billing statements, physical store checkouts, or patrol vehicles.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <QrCode className="w-4 h-4" />
              <span>Co-Marketing Pledge Trade</span>
            </div>
            <p className="text-xs text-slate-300">
              In exchange for 3 Months Free on Tier 2 (Sponsor Tier), the anchor merchant places app QR codes on their checkout counter or includes flyers in monthly client bills.
            </p>
            <p className="text-[11px] text-slate-500">
              Drives 300-500 new resident app installs per anchor merchant with zero cash outlay!
            </p>
          </div>
        </div>

        {/* Issue Anchor 3-Month Trial Form */}
        <form onSubmit={handleIssueAnchorTrial} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-white">Issue Anchor 3-Month Free Trial (Tier 2 Sponsor)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Tier 2: $89/mo value x 3 months = $267 Free</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Anchor Business Name</label>
              <input
                type="text"
                required
                value={anchorBizName}
                onChange={e => setAnchorBizName(e.target.value)}
                placeholder="e.g. Oakridge Shield Security Solutions"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Category</label>
              <select
                value={anchorCategory}
                onChange={e => setAnchorCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 font-bold focus:outline-none"
              >
                <option value="Home Services">Home Services (Security, Hardware)</option>
                <option value="Retail & Market">Retail & Market</option>
                <option value="Health & Wellness">Health & Wellness (Pet Care, Clinic)</option>
                <option value="Dining & Cafe">Dining & Cafe</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Contact Email</label>
              <input
                type="email"
                value={anchorEmail}
                onChange={e => setAnchorEmail(e.target.value)}
                placeholder="owner@shieldsecurity.co.za"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1 text-xs">Anchor Resident Offer (Deal for Neighbors)</label>
            <input
              type="text"
              value={anchorSpecialOffer}
              onChange={e => setAnchorSpecialOffer(e.target.value)}
              placeholder="e.g. Free Home Security Audit + $20 Voucher for Oakridge Residents"
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-xl shadow-amber-400/20 flex items-center justify-center space-x-2"
          >
            <Gift className="w-4 h-4 fill-current" />
            <span>Issue 3-Month Free Trial Voucher & Activate Anchor Ad</span>
          </button>

          {isTrialIssued && (
            <div className="bg-emerald-950/80 border border-emerald-500/40 p-3.5 rounded-xl text-xs text-emerald-200 flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>3-Month Free Tier 2 Voucher successfully issued and anchor ad active in district feed!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
