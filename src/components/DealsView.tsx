import React, { useState } from 'react';
import { LocalBusinessAd } from '../types';
import { store } from '../services/store';
import { 
  Tag, 
  Search, 
  ExternalLink, 
  Building2, 
  Sparkles, 
  Check, 
  Phone, 
  MapPin,
  Gift,
  QrCode,
  X,
  Printer,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DealsViewProps {
  businesses: LocalBusinessAd[];
  onRefreshData: () => void;
  onOpenAdPortal: () => void;
}

export const DealsView: React.FC<DealsViewProps> = ({
  businesses,
  onRefreshData,
  onOpenAdPortal
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVoucherModal, setActiveVoucherModal] = useState<LocalBusinessAd | null>(null);

  const categories = ['All', 'Dining & Cafe', 'Retail & Market', 'Health & Wellness', 'Home Services'];

  const filtered = businesses.filter(b => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.dealOffer && b.dealOffer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch && b.activeStatus === 'Active';
  });

  const handleClaimDeal = (biz: LocalBusinessAd) => {
    if (biz.couponCode) {
      navigator.clipboard.writeText(biz.couponCode);
      setCopiedCode(biz.couponCode);
      store.recordDealRedeemed(biz.id);
      confetti({ particleCount: 65, spread: 60, origin: { y: 0.7 } });
      onRefreshData();
      setActiveVoucherModal(biz);

      setTimeout(() => setCopiedCode(null), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Gift className="w-3.5 h-3.5" />
              <span>Exclusive Neighborhood Resident Perks</span>
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Local Business Deals & Coupons
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Support neighborhood shops and save money. Local business sponsors fund community safety & park projects in exchange for resident visibility.
            </p>
          </div>

          <button
            onClick={onOpenAdPortal}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition active:scale-95 text-xs whitespace-nowrap shrink-0"
          >
            <Building2 className="w-4 h-4" />
            <span>Advertise Your Business ($29/mo)</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search deals & stores..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of Deals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(biz => (
          <div
            key={biz.id}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition group"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={biz.logoUrl}
                  alt={biz.businessName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md group-hover:scale-105 transition"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition">
                      {biz.businessName}
                    </h3>
                    {biz.tier === 'champion' && (
                      <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Premier Sponsor
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">{biz.category}</p>
                </div>
              </div>

              <p className="text-sm font-semibold text-emerald-300">
                {biz.headline}
              </p>

              <p className="text-xs text-slate-300 leading-relaxed">
                {biz.bodyText}
              </p>

              {/* Deal Offer Highlight Box */}
              {biz.dealOffer && (
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Special Resident Coupon
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {biz.dealOffer}
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaimDeal(biz)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1 shrink-0"
                  >
                    {copiedCode === biz.couponCode ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Tag className="w-3.5 h-3.5" />
                        <span>Claim Code</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{biz.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{biz.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {biz.dealsRedeemed} neighborhood residents claimed this deal
              </span>
              <a
                href={biz.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 font-semibold hover:underline flex items-center space-x-1"
              >
                <span>Visit Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* DIGITAL COUPON VOUCHER MODAL */}
      {activeVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setActiveVoucherModal(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-3 py-1 rounded-full">
                <Gift className="w-3.5 h-3.5" />
                <span>Official Oakridge Resident Digital Coupon</span>
              </span>
              <h3 className="text-2xl font-black text-white">{activeVoucherModal.businessName}</h3>
              <p className="text-xs text-slate-400">{activeVoucherModal.address} • {activeVoucherModal.phone}</p>
            </div>

            {/* Simulated Digital Voucher Ticket */}
            <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-dashed border-emerald-500/50 rounded-2xl p-6 text-center space-y-4 shadow-inner relative overflow-hidden">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                OFFER CODE REDEEMED
              </div>

              <div className="text-lg font-black text-white bg-emerald-950/60 py-2.5 px-4 rounded-xl border border-emerald-500/30 inline-block font-mono">
                {activeVoucherModal.couponCode}
              </div>

              <div className="text-sm font-bold text-emerald-300">
                {activeVoucherModal.dealOffer}
              </div>

              <div className="bg-white p-3 rounded-xl inline-block shadow-md my-2">
                <QrCode className="w-24 h-24 text-slate-950 mx-auto" />
                <span className="text-[9px] font-bold font-mono text-slate-600 block mt-1 uppercase">Scan at Merchant Register</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-tight">
                Present this digital coupon or code at check-out. Valid for Oakridge District residents.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (activeVoucherModal.couponCode) {
                    navigator.clipboard.writeText(activeVoucherModal.couponCode);
                    setCopiedCode(activeVoucherModal.couponCode);
                    setTimeout(() => setCopiedCode(null), 2500);
                  }
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
              >
                {copiedCode === activeVoucherModal.couponCode ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Code Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
