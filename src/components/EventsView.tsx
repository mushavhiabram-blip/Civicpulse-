import React, { useState } from 'react';
import { CommunityEvent, EventCategory, LocalBusinessAd } from '../types';
import { store } from '../services/store';
import { planEventAI, GeneratedEventPlan } from '../services/api';
import { AdBanner } from './AdBanner';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  Plus, 
  Search, 
  Tag, 
  Share2, 
  CheckCircle,
  ExternalLink,
  Bot,
  Clock,
  Building2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EventsViewProps {
  events: CommunityEvent[];
  businesses: LocalBusinessAd[];
  onRefreshData: () => void;
  onOpenCreateEvent: () => void;
}

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Block Party',
  'Gardening',
  'Safety Watch',
  'Clean-up',
  'Workshop',
  'Family'
];

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  businesses,
  onRefreshData,
  onOpenCreateEvent
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Event Planner state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiIdea, setAiIdea] = useState('');
  const [aiAttendees, setAiAttendees] = useState('50 residents');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPlanResult, setAiPlanResult] = useState<GeneratedEventPlan | null>(null);

  const filteredEvents = events.filter(evt => {
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRSVP = (evtId: string, currentRSVP?: boolean) => {
    store.toggleRSVP(evtId);
    if (!currentRSVP) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
    onRefreshData();
  };

  const handleAddToGoogleCalendar = (evt: CommunityEvent) => {
    // Build Google Calendar Web Link
    const startTimeStr = evt.date.replace(/-/g, '') + 'T100000Z';
    const endTimeStr = evt.date.replace(/-/g, '') + 'T130000Z';
    const title = encodeURIComponent(evt.title);
    const details = encodeURIComponent(`${evt.description}\n\nOrganized by: ${evt.organizerName}`);
    const location = encodeURIComponent(evt.location);

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeStr}/${endTimeStr}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const handleGenerateAiPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiIdea.trim()) return;
    setIsAiLoading(true);
    setAiPlanResult(null);

    try {
      const plan = await planEventAI({
        topicOrIdea: aiIdea,
        neighborhoodArea: 'Oakridge Community District #4',
        estimatedAttendees: aiAttendees
      });
      setAiPlanResult(plan);
    } catch (err: any) {
      alert(err.message || 'Failed to generate event plan.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePublishAiEvent = () => {
    if (!aiPlanResult) return;
    store.addEvent({
      title: aiPlanResult.suggestedTitle,
      description: aiPlanResult.description,
      category: (aiPlanResult.recommendedCategory as EventCategory) || 'Block Party',
      date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      time: '10:00 AM - 2:00 PM',
      location: 'Oakridge Community Center Grounds',
      organizerName: 'Neighborhood Planning AI & Volunteers',
      maxAttendees: 100,
      latitude: 45,
      longitude: 50,
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      tags: ['AI Planned', 'Neighborhood', 'Family Friendly']
    });
    confetti({ particleCount: 70, spread: 70 });
    setIsAiModalOpen(false);
    setAiPlanResult(null);
    setAiIdea('');
    onRefreshData();
  };

  // Champion Sponsor for Banner Placement
  const championSponsor = (businesses || []).find(b => b?.tier === 'champion') || (businesses || [])[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Oakridge Neighborhood Society Calendar</span>
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Community Events & Gatherings
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Connect with neighbors, join block parties, garden workshops, and local safety walks. 
              Organized by residents and co-sponsored by neighborhood businesses.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95 text-sm"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>AI Event Planner</span>
            </button>

            <button
              onClick={onOpenCreateEvent}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-95 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Host an Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Champion Sponsor Banner Placement */}
      {championSponsor && <AdBanner ad={championSponsor} />}

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, locations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredEvents.map(evt => {
          const isFull = evt.attendeeCount >= evt.maxAttendees;
          const percentage = Math.min(100, Math.round((evt.attendeeCount / evt.maxAttendees) * 100));

          return (
            <div
              key={evt.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                {/* Event Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {evt.category}
                  </span>

                  {/* RSVP Count Pill */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 border border-slate-800">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{evt.attendeeCount} / {evt.maxAttendees} Attending</span>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md">
                      {evt.title}
                    </h3>
                  </div>
                </div>

                {/* Event Details Content */}
                <div className="p-5 space-y-4">
                  {/* Business Sponsor Tag if applicable */}
                  {evt.sponsoredByBusinessName && (
                    <div className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs px-2.5 py-1 rounded-lg font-medium">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Co-Sponsored by <strong>{evt.sponsoredByBusinessName}</strong></span>
                    </div>
                  )}

                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center space-x-2 text-slate-200 font-medium">
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Users className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Organized by: <strong className="text-slate-300">{evt.organizerName}</strong></span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>RSVP Capacity</span>
                      <span>{percentage}% Booked</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(evt.tags || []).map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-800/80 mt-2">
                <button
                  onClick={() => handleAddToGoogleCalendar(evt)}
                  className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition border border-slate-700/80"
                  title="Add to Google Calendar"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Cal</span>
                </button>

                <button
                  onClick={() => handleRSVP(evt.id, evt.isRSVPed)}
                  disabled={isFull && !evt.isRSVPed}
                  className={`flex-1 flex items-center justify-center space-x-2 font-bold text-xs py-2.5 rounded-xl transition shadow-md ${
                    evt.isRSVPed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-500/50'
                      : isFull
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {evt.isRSVPed ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>RSVPed • Attending</span>
                    </>
                  ) : (
                    <span>{isFull ? 'Event Fully Booked' : 'RSVP Now (Free)'}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No community events found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or be the first neighbor to organize one!</p>
          <button
            onClick={onOpenCreateEvent}
            className="mt-4 inline-flex items-center space-x-2 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Host First Event</span>
          </button>
        </div>
      )}

      {/* AI EVENT PLANNER MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Neighborhood Event Planner</h2>
                <p className="text-xs text-slate-400">Powered by server-side Gemini AI for community organizers</p>
              </div>
            </div>

            <form onSubmit={handleGenerateAiPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  What kind of event or activity do you want to organize?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer ice cream social and seed swapping market"
                  value={aiIdea}
                  onChange={e => setAiIdea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Resident Attendance
                </label>
                <select
                  value={aiAttendees}
                  onChange={e => setAiAttendees(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="20-30 neighbors">Small Gathering (20-30 neighbors)</option>
                  <option value="50-100 residents">Medium Block Event (50-100 residents)</option>
                  <option value="200+ whole district">Large District Festival (200+ residents)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isAiLoading || !aiIdea.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 text-sm"
              >
                {isAiLoading ? (
                  <span>Generating Complete Event Proposal with Gemini AI...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Event Blueprint</span>
                  </>
                )}
              </button>
            </form>

            {/* Generated Plan Result */}
            {aiPlanResult && (
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
                <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-purple-200">
                      {aiPlanResult.suggestedTitle}
                    </h3>
                    <span className="bg-purple-500/20 text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {aiPlanResult.recommendedCategory}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiPlanResult.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Needed Volunteer Roles:
                      </div>
                      <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                        {(aiPlanResult.volunteerRoles || []).map((role, i) => (
                          <li key={i}>{role}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Safety & Prep Checklist:
                      </div>
                      <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                        {(aiPlanResult.safetyChecklist || []).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePublishAiEvent}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 text-sm shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Event to Neighborhood Calendar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
