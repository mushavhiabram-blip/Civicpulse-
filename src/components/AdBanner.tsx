import React, { useEffect } from 'react';
import { LocalBusinessAd } from '../types';
import { store } from '../services/store';
import { ExternalLink, Tag, ShieldCheck, Sparkles } from 'lucide-react';

interface AdBannerProps {
  ad: LocalBusinessAd;
  compact?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ ad, compact = false }) => {
  useEffect(() => {
    store.recordAdImpression(ad.id);
  }, [ad.id]);

  const handleAdClick = () => {
    store.recordAdClick(ad.id);
    if (ad.websiteUrl) {
      window.open(ad.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ad.couponCode) {
      navigator.clipboard.writeText(ad.couponCode);
      store.recordDealRedeemed(ad.id);
      alert(`Coupon code "${ad.couponCode}" copied to clipboard! Show this at ${ad.businessName} to claim your deal.`);
    }
  };

  if (compact) {
    return (
      <div 
        onClick={handleAdClick}
        className="group relative bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-3 shadow-md transition-all cursor-pointer overflow-hidden flex items-center space-x-3"
      >
        <div className="absolute top-1 right-2 text-[9px] font-bold tracking-wider text-amber-400/80 uppercase flex items-center gap-0.5">
          <Sparkles className="w-2.5 h-2.5" /> Sponsored
        </div>
        <img 
          src={ad.logoUrl} 
          alt={ad.businessName} 
          className="w-12 h-12 rounded-lg object-cover border border-slate-700 group-hover:scale-105 transition"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 truncate flex items-center gap-1.5">
            {ad.businessName}
            {ad.tier === 'champion' && (
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                Premier Sponsor
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-300 truncate">{ad.headline}</p>
          {ad.dealOffer && (
            <p className="text-[11px] font-semibold text-emerald-400 mt-0.5 truncate">
              🎁 {ad.dealOffer}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleAdClick}
      className="group relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 shadow-xl transition-all cursor-pointer overflow-hidden my-4"
    >
      {/* Top Banner Tag */}
      <div className="flex justify-between items-center mb-3 text-xs">
        <span className="inline-flex items-center space-x-1 bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold px-2.5 py-0.5 rounded-full text-[11px]">
          <Sparkles className="w-3 h-3 text-amber-400 inline" />
          <span>Verified Local Neighborhood Sponsor</span>
        </span>
        <span className="text-slate-400 text-[11px] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Supports Oakridge Community Fund
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-start space-x-4">
          <img 
            src={ad.logoUrl} 
            alt={ad.businessName} 
            className="w-16 h-16 rounded-xl object-cover border-2 border-slate-700 shadow-md group-hover:border-emerald-400 transition"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                {ad.businessName}
              </h3>
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-md border border-slate-700">
                {ad.category}
              </span>
            </div>
            <p className="text-sm font-medium text-emerald-200 mt-1">
              {ad.headline}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-2">
              {ad.bodyText}
            </p>
          </div>
        </div>

        {/* Promo Code Action */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5">
          {ad.dealOffer && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wide">
                Exclusive Resident Deal
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {ad.dealOffer}
              </div>
              {ad.couponCode && (
                <button
                  onClick={handleCopyCoupon}
                  className="mt-1.5 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-1 px-3 rounded-lg transition flex items-center justify-center space-x-1"
                >
                  <Tag className="w-3 h-3" />
                  <span>Copy Code: {ad.couponCode}</span>
                </button>
              )}
            </div>
          )}

          <button className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition">
            <span>{ad.callToAction || 'Visit Business Website'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
