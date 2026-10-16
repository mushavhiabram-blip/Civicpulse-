import React, { useState } from 'react';
import { LocalBusinessAd, SubscriptionTierId } from '../types';
import { SUBSCRIPTION_TIERS } from '../data/initialData';
import { store } from '../services/store';
import { generateAdCopyAI, GeneratedAdCopy, generatePayFastSubscriptionAI, PayFastSubscriptionResult } from '../services/api';
import { 
  Building2, 
  Sparkles, 
  Check, 
  Bot, 
  CreditCard, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Eye, 
  MousePointer, 
  Gift, 
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdPortalViewProps {
  businesses: LocalBusinessAd[];
  onRefreshData: () => void;
}

export const AdPortalView: React.FC<AdPortalViewProps> = ({
  businesses,
  onRefreshData
}) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierId>('sponsor');
  
  // Checkout & Campaign Modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [bizName, setBizName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [category, setCategory] = useState<LocalBusinessAd['category']>('Dining & Cafe');
  const [headline, setHeadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [dealOffer, setDealOffer] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // AI Ad Copy state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdCopyResult, setAiAdCopyResult] = useState<GeneratedAdCopy | null>(null);

  // PayFast Subscription state
  const [payFastResult, setPayFastResult] = useState<PayFastSubscriptionResult | null>(null);
  const [isPayFastLoading, setIsPayFastLoading] = useState(false);

  const handleGeneratePayFast = async () => {
    if (!ownerEmail) {
      alert('Please enter your contact email first');
      return;
    }
    const tierObj = SUBSCRIPTION_TIERS.find(t => t.id === selectedTier);
    const amountZAR = selectedTier === 'supporter' ? 350 : selectedTier === 'sponsor' ? 890 : 2500;
    
    setIsPayFastLoading(true);
    try {
      const res = await generatePayFastSubscriptionAI({
        tierName: tierObj?.name || 'Local Supporter',
        amountZAR,
        userEmail: ownerEmail,
        customUserId: `BIZ_${Math.floor(10000 + Math.random() * 90000)}`
      });
      setPayFastResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to generate PayFast subscription');
    } finally {
      setIsPayFastLoading(false);
    }
  };

  const handleRunAiAdCopy = async () => {
    if (!bizName.trim()) {
      alert('Please enter your business name first!');
      return;
    }
    setIsAiLoading(true);
    setAiAdCopyResult(null);

    try {
      const res = await generateAdCopyAI({
        businessName: bizName,
        category,
        specialOffer: dealOffer || 'Neighborhood Resident Discount',
        targetAudience: 'Oakridge local families and homeowners'
      });
      setAiAdCopyResult(res);
      if (res.headlines.length > 0) setHeadline(res.headlines[0]);
      if (res.bodyCopy) setBodyText(res.bodyCopy);
    } catch (err: any) {
      alert(err.message || 'Failed to generate ad copy');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCompleteSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !ownerEmail) return;

    store.addBusinessSubscription({
      businessName: bizName,
      ownerEmail,
      ownerName: ownerEmail.split('@')[0],
      category,
      tier: selectedTier,
      logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      headline: headline || `${bizName} - Proud Neighborhood Sponsor`,
      bodyText: bodyText || `Visit us on Main Street and support local community projects.`,
      dealOffer: dealOffer || '10% Discount for Neighborhood App Users',
      couponCode: couponCode || `OAK-${Math.floor(1000 + Math.random() * 9000)}`,
      callToAction: 'Visit Store Today',
      websiteUrl: websiteUrl || 'https://example.com',
      phone: phone || '(555) 123-4567',
      address: address || 'Main Street, District 4',
      latitude: 45 + (Math.random() * 10 - 5),
      longitude: 50 + (Math.random() * 10 - 5)
    });

    confetti({ particleCount: 80, spread: 80 });
    setIsCheckoutOpen(false);
    onRefreshData();
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-semibold px-3 py-1 rounded-full">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Local Business Advertising & Community Sponsorship Portal</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Reach 1,420+ Verified Local Neighborhood Families
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Sponsor neighborhood park improvements, green projects, and community events while displaying targeted ads, coupon deals, and highlighted pins on our interactive neighborhood map.
          </p>
        </div>

        <button
          onClick={() => {
            const sampleBiz = [
              { name: 'Oakridge Corner Hardware & Garden', tier: 'champion' as const, category: 'Home Services' as const, deal: '$15 Off Lawn & Garden Tools' },
              { name: 'Valley View Veterinary Clinic', tier: 'sponsor' as const, category: 'Health & Wellness' as const, deal: 'Free First Pet Exam & Wellness Package' },
              { name: 'Oakridge Fresh Organic Market', tier: 'champion' as const, category: 'Dining & Cafe' as const, deal: '10% Off Organic Produce Orders' }
            ];
            const pick = sampleBiz[Math.floor(Math.random() * sampleBiz.length)];

            store.addBusinessSubscription({
              businessName: pick.name,
              category: pick.category,
              tier: pick.tier,
              ownerEmail: 'auto-sponsor@oakridge.org',
              headline: `Auto-Launched Sponsor Campaign for ${pick.name}`,
              bodyText: `Supporting Oakridge neighborhood events and infrastructure projects.`,
              dealOffer: pick.deal,
              couponCode: `AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
              callToAction: 'Claim Coupon',
              websiteUrl: 'https://example.com',
              phone: '(555) 987-6543',
              address: 'Oakridge District Center'
            });

            onRefreshData();
            confetti({ particleCount: 75, spread: 70 });
            alert(`🎉 Auto-started new ${pick.tier.toUpperCase()} campaign for "${pick.name}"! Revenue updated.`);
          }}
          className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs transition shadow-xl shadow-amber-500/20 shrink-0 flex items-center space-x-2"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Auto-Start Sponsor Campaign</span>
        </button>
      </div>

      {/* TIERED PRICING MATRIX */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Select Your Ad Sponsorship Tier</h2>
          <p className="text-xs text-slate-400 mt-1">Flexible monthly subscriptions. Cancel or upgrade anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUBSCRIPTION_TIERS.map(tier => {
            const isFeatured = tier.id === 'sponsor';

            return (
              <div
                key={tier.id}
                className={`relative bg-slate-900 border ${
                  isFeatured ? 'border-amber-400 shadow-2xl shadow-amber-400/10 ring-2 ring-amber-400/20' : 'border-slate-800'
                } rounded-3xl p-6 flex flex-col justify-between transition group hover:scale-[1.02]`}
              >
                {isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular Choice
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mb-2 ${tier.color}`}>
                      {tier.badge}
                    </span>
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-white">${tier.priceMonthly}</span>
                    <span className="text-xs text-slate-400 font-semibold">/ month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedTier(tier.id);
                    setIsCheckoutOpen(true);
                  }}
                  className={`mt-8 w-full font-bold py-3 rounded-xl transition text-xs shadow-lg ${
                    isFeatured
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  Start Ad Campaign (${tier.priceMonthly}/mo)
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SPONSOR CAMPAIGNS DASHBOARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Active Business Advertiser Directory</h2>
            <p className="text-xs text-slate-400">Real-time impression & deal analytics tracked in real-time</p>
          </div>
          <button
            onClick={() => {
              setSelectedTier('champion');
              setIsCheckoutOpen(true);
            }}
            className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-400 transition"
          >
            + Add New Business
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map(biz => (
            <div key={biz.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <img src={biz.logoUrl} alt={biz.businessName} className="w-12 h-12 rounded-xl object-cover border border-slate-800" />
                  <div>
                    <h4 className="font-bold text-white text-base">{biz.businessName}</h4>
                    <span className="text-[11px] text-slate-400">{biz.category} • <strong className="text-amber-400">{biz.tier.toUpperCase()} TIER</strong></span>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {biz.activeStatus}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">"{biz.headline}"</p>

              {/* Analytics Row */}
              <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800 text-center text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Impressions</div>
                  <div className="font-bold text-white text-sm flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3 text-blue-400" /> {biz.impressions}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Ad Clicks</div>
                  <div className="font-bold text-emerald-400 text-sm flex items-center justify-center gap-1">
                    <MousePointer className="w-3 h-3 text-emerald-400" /> {biz.clicks}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Deals Claimed</div>
                  <div className="font-bold text-amber-400 text-sm flex items-center justify-center gap-1">
                    <Gift className="w-3 h-3 text-amber-400" /> {biz.dealsRedeemed}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHECKOUT & AI AD GENERATOR MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-950 font-black">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create Local Business Ad Campaign</h2>
                <p className="text-xs text-slate-400">Selected Tier: <strong className="text-amber-400 uppercase">{selectedTier}</strong></p>
              </div>
            </div>

            <form onSubmit={handleCompleteSubscription} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oakridge Family Pet Clinic"
                    value={bizName}
                    onChange={e => setBizName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Owner / Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@mybusiness.com"
                    value={ownerEmail}
                    onChange={e => setOwnerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* AI Copy Generator Trigger Button */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-purple-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Gemini AI Ad Copy Generator
                  </div>
                  <div className="text-[11px] text-slate-400">Generate high-converting neighborhood headline & offer text</div>
                </div>
                <button
                  type="button"
                  onClick={handleRunAiAdCopy}
                  disabled={isAiLoading || !bizName}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'Writing Copy...' : 'AI Auto-Fill'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Catchy Ad Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% Off All Grooming Services for Neighborhood Residents!"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ad Body Copy</label>
                <textarea
                  placeholder="Describe your services, hours, or local neighborhood roots..."
                  value={bodyText}
                  onChange={e => setBodyText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white h-20 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exclusive Coupon Deal Offer</label>
                  <input
                    type="text"
                    placeholder="e.g. FREE Coffee with Pastry"
                    value={dealOffer}
                    onChange={e => setDealOffer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Promo Code</label>
                  <input
                    type="text"
                    placeholder="e.g. OAK-PETS-20"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Simulated Checkout Box */}
              <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 text-xs space-y-2">
                <div className="flex justify-between font-bold text-white">
                  <span>Subscription Total ({selectedTier.toUpperCase()}):</span>
                  <span className="text-emerald-400">
                    R{selectedTier === 'supporter' ? '350.00' : selectedTier === 'sponsor' ? '890.00' : '2,500.00'} ZAR / month
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  ✔ Instant activation on Live Interactive Map & Resident Feed<br />
                  ✔ Includes automatic neighborhood improvement co-sponsor tag
                </div>
              </div>

              {/* PayFast Recurring Subscription Integration Box */}
              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>PayFast Recurring Payment Gateway (South Africa ZAR)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGeneratePayFast}
                    disabled={isPayFastLoading || !ownerEmail}
                    className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
                  >
                    <span>{isPayFastLoading ? 'Generating Hash...' : 'Generate PayFast MD5 Form'}</span>
                  </button>
                </div>

                {payFastResult && (
                  <div className="space-y-2 text-xs font-mono bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>PayFast Endpoint:</span>
                      <span className="text-amber-300">{payFastResult.processUrl}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Generated MD5 Signature:</span>
                      <span className="text-emerald-400 font-bold">{payFastResult.formData.signature}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Recurring Amount:</span>
                      <span className="text-white font-bold">R{payFastResult.formData.recurring_amount} / month</span>
                    </div>

                    <form action={payFastResult.processUrl} method="POST" target="_blank" className="pt-2">
                      {Object.entries(payFastResult.formData).map(([k, v]) => (
                        <input key={k} type="hidden" name={k} value={v} />
                      ))}
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
                      >
                        🚀 Proceed to Secure PayFast Checkout Gateway →
                      </button>
                    </form>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3.5 rounded-xl transition text-sm shadow-xl shadow-amber-400/20"
              >
                Confirm Subscription & Launch Ad Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
