import React, { useState } from 'react';
import { VolunteerOpportunity, LocalBusinessAd } from '../types';
import { store } from '../services/store';
import { AdBanner } from './AdBanner';
import { 
  HeartHandshake, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VolunteerViewProps {
  opportunities: VolunteerOpportunity[];
  businesses?: LocalBusinessAd[];
  onRefreshData: () => void;
  onOpenCreateVolunteer: () => void;
}

export const VolunteerView: React.FC<VolunteerViewProps> = ({
  opportunities = [],
  businesses = [],
  onRefreshData,
  onOpenCreateVolunteer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Open' | 'Urgent'>('All');

  const filtered = (opportunities || []).filter(vol => {
    const matchesStatus = selectedStatusFilter === 'All' || vol.status === selectedStatusFilter;
    const matchesSearch = vol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vol.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vol.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSignup = (volId: string, currentSignedUp?: boolean) => {
    store.toggleVolunteerSignup(volId);
    if (!currentSignedUp) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    }
    onRefreshData();
  };

  const totalVolunteersEngaged = (opportunities || []).reduce((acc, v) => acc + v.slotsFilled, 0);

  // Sponsor for banner
  const sponsor = (businesses || []).find(b => b?.tier === 'sponsor') || (businesses || [])[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Civic Action & Neighborhood Giving</span>
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Volunteer Opportunities
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Lend a hand to help local seniors, plant native trees, guard school crosswalks, and support neighborhood initiatives.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-emerald-400">{totalVolunteersEngaged}</div>
              <div className="text-[11px] text-slate-400 font-medium">Shifts Filled</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <button
              onClick={onOpenCreateVolunteer}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition text-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Post Need</span>
            </button>
          </div>
        </div>
      </div>

      {sponsor && <AdBanner ad={sponsor} />}

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedStatusFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedStatusFilter === 'All' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            All Shifts
          </button>
          <button
            onClick={() => setSelectedStatusFilter('Urgent')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              selectedStatusFilter === 'Urgent' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-rose-300'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" /> Urgent Help Needed
          </button>
          <button
            onClick={() => setSelectedStatusFilter('Open')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedStatusFilter === 'Open' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Open Slots
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter roles or skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Volunteer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(vol => {
          const slotsLeft = vol.slotsAvailable - vol.slotsFilled;
          const isFull = slotsLeft <= 0;

          return (
            <div
              key={vol.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {vol.organization}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-emerald-300 transition">
                      {vol.title}
                    </h3>
                  </div>

                  {vol.status === 'Urgent' ? (
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                      <AlertCircle className="w-3.5 h-3.5" /> Urgent
                    </span>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                      {vol.category}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {vol.description}
                </p>

                {vol.sponsoredByBusinessName && (
                  <div className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs px-2.5 py-1 rounded-lg">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sponsored by <strong>{vol.sponsoredByBusinessName}</strong></span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{vol.date} ({vol.hoursPerShift} hrs/shift)</span>
                  </div>
                  <div className="flex items-center space-x-2 truncate">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{vol.location}</span>
                  </div>
                </div>

                {/* Required Skills tags */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Required Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(vol.requiredSkills || []).map(skill => (
                      <span key={skill} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="text-slate-400">Slots: </span>
                  <span className={`font-bold ${isFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {vol.slotsFilled} of {vol.slotsAvailable} Filled ({isFull ? 'Full' : `${slotsLeft} open`})
                  </span>
                </div>

                <button
                  onClick={() => handleSignup(vol.id, vol.isSignedUp)}
                  disabled={isFull && !vol.isSignedUp}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md ${
                    vol.isSignedUp
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-rose-950 hover:text-rose-300'
                      : isFull
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {vol.isSignedUp ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Shift Reserved</span>
                    </>
                  ) : (
                    <span>{isFull ? 'Shift Filled' : 'Sign Up for Shift'}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
