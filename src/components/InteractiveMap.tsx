import React, { useState } from 'react';
import { CommunityEvent, NeighborhoodImprovement, LocalBusinessAd } from '../types';
import { 
  MapPin, 
  Calendar, 
  Lightbulb, 
  Building2, 
  Sparkles, 
  X, 
  ExternalLink,
  Layers,
  Tag,
  ShieldCheck
} from 'lucide-react';

interface InteractiveMapProps {
  events: CommunityEvent[];
  improvements: NeighborhoodImprovement[];
  businesses: LocalBusinessAd[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  events,
  improvements,
  businesses
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Events' | 'Improvements' | 'Businesses'>('All');
  const [selectedPin, setSelectedPin] = useState<{
    type: 'event' | 'improvement' | 'business';
    data: CommunityEvent | NeighborhoodImprovement | LocalBusinessAd;
  } | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Map Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="inline-flex items-center space-x-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Oakridge District #4 Interactive GIS Map</span>
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white">Neighborhood Map & Business Directory</h1>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'All' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Pins
          </button>
          <button
            onClick={() => setFilterType('Events')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'Events' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setFilterType('Improvements')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'Improvements' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Improvements
          </button>
          <button
            onClick={() => setFilterType('Businesses')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'Businesses' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sponsor Pins
          </button>
        </div>
      </div>

      {/* MAP CANVAS STYLED CONTAINER */}
      <div className="relative w-full h-[600px] bg-slate-950 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* SVG Grid lines to simulate map grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Map Vector Graphic Roads & Parks overlay representation */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-0 w-full h-12 bg-slate-700 -rotate-3" />
          <div className="absolute top-0 left-1/3 w-16 h-full bg-slate-700 rotate-6" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-emerald-800/60 rounded-full blur-xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-900/40 rounded-full blur-2xl" />
        </div>

        {/* Map Title Label */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3.5 py-2 rounded-2xl z-20 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-white">Live Oakridge District Coordinates</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl z-20 text-[11px] space-y-1.5">
          <div className="font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">Map Legend</div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Community Events</span>
          </div>
          <div className="flex items-center space-x-2 text-amber-400">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Improvement Projects</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-400">
            <div className="w-3 h-3 rounded-full bg-purple-500 flex items-center justify-center text-[8px] font-black text-slate-950">
              ★
            </div>
            <span>Business Sponsors</span>
          </div>
        </div>

        {/* EVENT PINS */}
        {(filterType === 'All' || filterType === 'Events') &&
          events.map(evt => (
            <button
              key={evt.id}
              onClick={() => setSelectedPin({ type: 'event', data: evt })}
              style={{ top: `${evt.latitude}%`, left: `${evt.longitude}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/50 group-hover:scale-125 transition border-2 border-white">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="absolute top-9 bg-slate-950/90 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition">
                  {evt.title}
                </span>
              </div>
            </button>
          ))}

        {/* IMPROVEMENT PINS */}
        {(filterType === 'All' || filterType === 'Improvements') &&
          improvements.map(imp => (
            <button
              key={imp.id}
              onClick={() => setSelectedPin({ type: 'improvement', data: imp })}
              style={{ top: `${imp.latitude}%`, left: `${imp.longitude}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/50 group-hover:scale-125 transition border-2 border-white">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <span className="absolute top-9 bg-slate-950/90 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition">
                  {imp.title}
                </span>
              </div>
            </button>
          ))}

        {/* BUSINESS SPONSOR PINS */}
        {(filterType === 'All' || filterType === 'Businesses') &&
          businesses.map(biz => {
            const isGold = biz.tier === 'sponsor' || biz.tier === 'champion';

            return (
              <button
                key={biz.id}
                onClick={() => setSelectedPin({ type: 'business', data: biz })}
                style={{ top: `${biz.latitude}%`, left: `${biz.longitude}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-10 h-10 rounded-2xl ${
                    isGold ? 'bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 ring-4 ring-amber-400/30' : 'bg-purple-600 text-white'
                  } flex items-center justify-center font-black shadow-xl group-hover:scale-125 transition border-2 border-white`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  {isGold && (
                    <span className="absolute -top-2 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                      ★
                    </span>
                  )}
                  <span className="absolute top-11 bg-slate-950/95 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md pointer-events-none opacity-90 group-hover:opacity-100 transition">
                    {biz.businessName}
                  </span>
                </div>
              </button>
            );
          })}
      </div>

      {/* SELECTED PIN MODAL DRAWER */}
      {selectedPin && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => setSelectedPin(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {selectedPin.type === 'event' && (() => {
            const data = selectedPin.data as CommunityEvent;
            return (
              <div className="space-y-3">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Community Event Pin
                </span>
                <h3 className="text-xl font-bold text-white">{data.title}</h3>
                <p className="text-xs text-slate-300">{data.description}</p>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>📅 {data.date} • {data.time}</div>
                  <div>📍 {data.location}</div>
                </div>
              </div>
            );
          })()}

          {selectedPin.type === 'improvement' && (() => {
            const data = selectedPin.data as NeighborhoodImprovement;
            return (
              <div className="space-y-3">
                <span className="bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Neighborhood Project Pin
                </span>
                <h3 className="text-xl font-bold text-white">{data.title}</h3>
                <p className="text-xs text-slate-300">{data.description}</p>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Status: <strong className="text-amber-300">{data.status}</strong></div>
                  <div>Budget: ${data.fundedAmount} / ${data.estimatedCost}</div>
                </div>
              </div>
            );
          })()}

          {selectedPin.type === 'business' && (() => {
            const data = selectedPin.data as LocalBusinessAd;
            return (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img src={data.logoUrl} alt={data.businessName} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                  <div>
                    <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {data.tier.toUpperCase()} SPONSOR
                    </span>
                    <h3 className="text-xl font-bold text-white">{data.businessName}</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-300">{data.bodyText}</p>
                {data.dealOffer && (
                  <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-xl text-xs font-bold text-emerald-300">
                    🎁 Resident Deal: {data.dealOffer} (Use Code: {data.couponCode})
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
