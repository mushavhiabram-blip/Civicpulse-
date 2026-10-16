import React, { useState } from 'react';
import { EventCategory, ImprovementStatus, LocalBusinessAd } from '../types';
import { store } from '../services/store';
import { 
  moderateContentAI, 
  draftVolunteerPostAI, 
  draftMaintenanceReportAI, 
  ModerationResult,
  DraftedVolunteerPost,
  DraftedMaintenanceReport
} from '../services/api';
import { 
  Calendar, 
  HeartHandshake, 
  Lightbulb, 
  Building2, 
  X, 
  Plus, 
  Check,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Wand2,
  Loader2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickCreateModalProps {
  initialType?: 'event' | 'volunteer' | 'improvement' | 'business';
  onClose: () => void;
  onRefreshData: () => void;
}

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  initialType = 'event',
  onClose,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'event' | 'volunteer' | 'improvement' | 'business'>(initialType);

  // Common fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  // Event specific
  const [eventDate, setEventDate] = useState('2026-08-15');
  const [eventTime, setEventTime] = useState('10:00 AM - 1:00 PM');
  const [organizerName, setOrganizerName] = useState('');

  // Volunteer specific
  const [organization, setOrganization] = useState('');
  const [slotsAvailable, setSlotsAvailable] = useState(10);
  const [hoursPerShift, setHoursPerShift] = useState(2);

  // Improvement specific
  const [estimatedCost, setEstimatedCost] = useState(500);

  // Business specific
  const [businessName, setBusinessName] = useState('');
  const [headline, setHeadline] = useState('');
  const [dealOffer, setDealOffer] = useState('');
  const [couponCode, setCouponCode] = useState('');

  // AI Drafting Assistant state
  const [roughPrompt, setRoughPrompt] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [showDraftBox, setShowDraftBox] = useState(false);

  // Moderation state
  const [isModerating, setIsModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);

  // AI Draft Assistant Handler
  const handleAIDraft = async () => {
    if (!roughPrompt.trim()) return;
    setIsDrafting(true);
    try {
      if (activeTab === 'volunteer') {
        const result: DraftedVolunteerPost = await draftVolunteerPostAI({
          roughNotes: roughPrompt,
          location: location || 'Oakridge Neighborhood Center'
        });
        setTitle(result.title);
        setDescription(`${result.description}\n\nKey Roles Needed: ${result.rolesNeeded.join(', ')}.\nImpact: ${result.impactStatement}`);
        setOrganization(result.organization);
        setSlotsAvailable(result.suggestedSlots || 10);
        setHoursPerShift(result.hoursPerShift || 2);
      } else if (activeTab === 'improvement') {
        const result: DraftedMaintenanceReport = await draftMaintenanceReportAI({
          roughIssue: roughPrompt,
          location: location || 'District Walkway'
        });
        setTitle(result.title);
        setDescription(`${result.structuredDescription}\n\nUrgency: ${result.urgencyReasoning}\nRecommended Action: ${result.recommendedAction}`);
        setEstimatedCost(result.estimatedCost || 500);
        setCategory(result.category || 'Safety');
      }
      setShowDraftBox(false);
      setRoughPrompt('');
    } catch (err) {
      console.error('Failed to draft post with AI:', err);
    } finally {
      setIsDrafting(false);
    }
  };

  // Submit Handler with AI Safety Moderation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModerating(true);
    setModerationResult(null);

    const fullContent = `${title} ${description} ${headline} ${businessName} ${dealOffer}`;

    try {
      // Step 1: Run Automated Feed Moderation (block hate speech, political harassment, slurs)
      const mod = await moderateContentAI({
        title,
        content: fullContent,
        postType: activeTab
      });

      if (!mod.isAllowed) {
        setModerationResult(mod);
        setIsModerating(false);
        return; // Block post addition!
      }

      // Step 2: Post is Clean -> Add to store
      executeStoreSave();
    } catch (err) {
      console.error('Moderation error, proceeding with standard store check:', err);
      executeStoreSave();
    } finally {
      setIsModerating(false);
    }
  };

  const executeStoreSave = () => {
    if (activeTab === 'event') {
      store.addEvent({
        title: title || 'Oakridge Neighborhood Gathering',
        description: description || 'A fun community gathering for local residents.',
        category: (category as EventCategory) || 'Block Party',
        date: eventDate,
        time: eventTime,
        location: location || 'Oakridge Park Pavilion',
        organizerName: organizerName || 'Neighborhood Resident Committee',
        maxAttendees: 80,
        latitude: 40 + Math.random() * 20,
        longitude: 35 + Math.random() * 20,
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
        tags: ['Community', 'Oakridge']
      });
    } else if (activeTab === 'volunteer') {
      store.addVolunteerOpportunity({
        title: title || 'Neighborhood Clean-up Shift',
        description: description || 'Help keep Oakridge parks clean and green.',
        organization: organization || 'Oakridge Eco Guild',
        category: category || 'Environment',
        date: eventDate,
        location: location || 'District 4 Park',
        slotsAvailable: Number(slotsAvailable),
        hoursPerShift: Number(hoursPerShift),
        requiredSkills: ['Teamwork', 'Punctuality'],
        status: 'Open'
      });
    } else if (activeTab === 'improvement') {
      store.addImprovement({
        title: title || 'New Street Lighting Proposal',
        category: (category as any) || 'Safety',
        location: location || 'Elm Street Walkway',
        description: description || 'Install solar LED lights for nighttime safety.',
        reporterName: organizerName || 'Oakridge Resident',
        estimatedCost: Number(estimatedCost),
        status: 'Reported',
        beforeImageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
        latitude: 30 + Math.random() * 30,
        longitude: 30 + Math.random() * 30
      });
    } else if (activeTab === 'business') {
      store.addBusinessSubscription({
        businessName: businessName || 'Oakridge Local Merchant',
        ownerEmail: 'contact@localbiz.com',
        ownerName: organizerName || 'Owner',
        category: 'Dining & Cafe',
        tier: 'sponsor',
        logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
        headline: headline || 'Welcome Oakridge Neighbors!',
        bodyText: description || 'Visit us for fresh local deals and support our community.',
        dealOffer: dealOffer || '10% Off for Residents',
        couponCode: couponCode || 'OAK-DISCOUNT-10',
        callToAction: 'Visit Store',
        websiteUrl: 'https://example.com',
        phone: '(555) 123-4567',
        address: location || '123 Main Street',
        latitude: 45,
        longitude: 50
      });
    }

    confetti({ particleCount: 60, spread: 60 });
    onRefreshData();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Create Community Post</h2>
        <p className="text-xs text-slate-400 mb-6">Organize an event, request volunteer help, report an improvement, or sponsor the neighborhood.</p>

        {/* Tab selector */}
        <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'event' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Event
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('volunteer')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'volunteer' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" /> Volunteer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('improvement')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'improvement' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" /> Improvement
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'business' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Sponsor
          </button>
        </div>

        {/* AI Draft Assistant Box for Volunteer and Maintenance/Improvement posts */}
        {(activeTab === 'volunteer' || activeTab === 'improvement') && (
          <div className="mb-5 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
                <Wand2 className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>AI Draft Assistant ({activeTab === 'volunteer' ? 'Structured Volunteer Request' : 'Structured Maintenance Issue Report'})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDraftBox(!showDraftBox)}
                className="text-[11px] text-purple-300 underline font-semibold hover:text-white"
              >
                {showDraftBox ? 'Hide Helper' : 'Draft with AI'}
              </button>
            </div>

            {showDraftBox && (
              <div className="space-y-2 pt-1 border-t border-purple-500/20">
                <textarea
                  placeholder={
                    activeTab === 'volunteer' 
                      ? "e.g. Need 5 people to help clean up leaves at Elm park on Saturday morning for 2 hours, bring gloves..."
                      : "e.g. Broken bench and missing solar sidewalk light near 4th street playground, dangerous at night for kids..."
                  }
                  value={roughPrompt}
                  onChange={e => setRoughPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-500/30 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={handleAIDraft}
                  disabled={isDrafting || !roughPrompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/20"
                >
                  {isDrafting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Formatting with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Format into Clean Structured Post</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI Moderation Warning Banner (if post is flagged) */}
        {moderationResult && !moderationResult.isAllowed && (
          <div className="mb-5 bg-red-950/80 border border-red-500/60 rounded-2xl p-4 text-red-200 space-y-2.5 animate-shake">
            <div className="flex items-center space-x-2 font-black text-xs text-red-400">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Post Blocked by AI Safety Moderation</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>Reason:</strong> {moderationResult.flaggedReason}
            </p>
            {moderationResult.suggestedCleanText && (
              <div className="bg-slate-950/80 border border-red-500/30 rounded-xl p-3 text-xs space-y-1">
                <span className="text-emerald-400 font-bold block">Suggested Civil Alternative:</span>
                <p className="text-slate-300 italic">"{moderationResult.suggestedCleanText}"</p>
                <button
                  type="button"
                  onClick={() => {
                    setDescription(moderationResult.suggestedCleanText || '');
                    setModerationResult(null);
                  }}
                  className="mt-2 text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-3 py-1 rounded-lg hover:bg-emerald-500/30 flex items-center space-x-1"
                >
                  <span>Apply Civil Text</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {activeTab === 'business' ? (
            <>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oakridge Cafe & Grill"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catchy Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Organic sourdough baked fresh daily!"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deal Offer</label>
                  <input
                    type="text"
                    placeholder="e.g. Free Coffee"
                    value={dealOffer}
                    onChange={e => setDealOffer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. FREE-CAFE-1"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title / Proposal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Community Garden Spring Planting"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Provide details for local neighbors..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white h-20 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location / Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Oakridge Park West"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organizer Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={organizerName}
                    onChange={e => setOrganizerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {activeTab === 'improvement' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Budget Needed ($)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={e => setEstimatedCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isModerating}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
          >
            {isModerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Checking AI Feed Safety Guard...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Publish Post</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
