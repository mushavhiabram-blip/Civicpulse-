import React, { useState } from 'react';
import { NeighborhoodImprovement, LocalBusinessAd, UserRole, ImprovementStatus } from '../types';
import { store } from '../services/store';
import { generateImprovementPitchAI, GeneratedImprovementPitch } from '../services/api';
import { AdBanner } from './AdBanner';
import { 
  Lightbulb, 
  ThumbsUp, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Bot,
  X,
  History,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ImprovementsViewProps {
  improvements: NeighborhoodImprovement[];
  businesses: LocalBusinessAd[];
  userRole: UserRole;
  onRefreshData: () => void;
  onOpenCreateImprovement: () => void;
}

const STATUS_ORDER: ImprovementStatus[] = ['Reported', 'Under Review', 'Funded', 'In Progress', 'Completed'];

export const ImprovementsView: React.FC<ImprovementsViewProps> = ({
  improvements,
  businesses,
  userRole,
  onRefreshData,
  onOpenCreateImprovement
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // AI Pitch Modal
  const [pitchModalImp, setPitchModalImp] = useState<NeighborhoodImprovement | null>(null);
  const [isPitchLoading, setIsPitchLoading] = useState(false);
  const [pitchData, setPitchData] = useState<GeneratedImprovementPitch | null>(null);

  // Admin status update modal
  const [adminUpdateImp, setAdminUpdateImp] = useState<NeighborhoodImprovement | null>(null);
  const [newStatus, setNewStatus] = useState<ImprovementStatus>('In Progress');
  const [statusNote, setStatusNote] = useState('');

  const categories = ['All', 'Infrastructure', 'Greenery', 'Safety', 'Art & Culture', 'Accessibility'];

  const filtered = improvements.filter(imp => selectedCategory === 'All' || imp.category === selectedCategory);

  const handleVote = (impId: string, hasVoted?: boolean) => {
    store.toggleImprovementVote(impId);
    if (!hasVoted) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    }
    onRefreshData();
  };

  const handleGenerateAiPitch = async (imp: NeighborhoodImprovement) => {
    setPitchModalImp(imp);
    setIsPitchLoading(true);
    setPitchData(null);

    try {
      const res = await generateImprovementPitchAI({
        improvementTitle: imp.title,
        category: imp.category,
        description: imp.description,
        estimatedCost: imp.estimatedCost
      });
      setPitchData(res);
    } catch (err: any) {
      alert(err.message || 'Failed to generate project pitch');
    } finally {
      setIsPitchLoading(false);
    }
  };

  const handleSaveAdminStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUpdateImp) return;

    store.updateImprovementStatus(adminUpdateImp.id, newStatus, statusNote || 'Status updated by Society Board.', 'Oakridge Admin Board');
    confetti({ particleCount: 50, spread: 60 });
    setAdminUpdateImp(null);
    setStatusNote('');
    onRefreshData();
  };

  const totalFunded = improvements.reduce((acc, i) => acc + i.fundedAmount, 0);

  return (
    <div className="space-y-8 pb-12">        {/* REAL ROAD VIDEO - Polokwane Evidence */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-4 shadow-lg">
        <h3 className="font-black text-slate-900 mb-2">📍 REAL EVIDENCE: Pothole in Polokwane - road.mp4</h3>
        <video controls playsInline className="w-full rounded-xl bg-black">
          <source src="/road.mp4" type="video/mp4" />
        </video>
        <p className="text-xs text-slate-600 mt-2 font-medium">Live evidence for judges: CivicPulse AI detects & tracks this road repair</p>
      </div>
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Real-Time Neighborhood Enhancement Tracker</span>
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Neighborhood Improvements
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Propose local projects, vote on priority fixes, track progress live, and match funds with neighborhood business sponsors.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-400">${totalFunded}</div>
              <div className="text-[11px] text-slate-400 font-medium">Sponsor Raised</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <button
              onClick={onOpenCreateImprovement}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition text-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue / Propose</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Improvement Cards Feed */}
      <div className="space-y-6">
        {filtered.map(imp => {
          const fundingPercentage = Math.min(100, Math.round((imp.fundedAmount / imp.estimatedCost) * 100));
          const currentStepIndex = STATUS_ORDER.indexOf(imp.status);

          return (
            <div
              key={imp.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition space-y-6"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* Image Section */}
                <div className="lg:w-72 shrink-0">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-48 bg-slate-950">
                    <img
                      src={imp.afterImageUrl && imp.status === 'Completed' ? imp.afterImageUrl : imp.beforeImageUrl}
                      alt={imp.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-300 border border-amber-400/30">
                      {imp.status === 'Completed' ? '✨ After Completion' : '📷 Initial Report Photo'}
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700">
                        {imp.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {imp.location}
                      </span>
                    </div>

                    {/* Upvote Pill */}
                    <button
                      onClick={() => handleVote(imp.id, imp.hasVoted)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        imp.hasVoted
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{imp.votes} Resident Votes</span>
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-white">{imp.title}</h3>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {imp.description}
                  </p>

                  {imp.sponsoredByBusinessName && (
                    <div className="inline-flex items-center space-x-2 bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1.5 rounded-xl font-medium">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>Co-Funded by Local Sponsor: <strong>{imp.sponsoredByBusinessName}</strong></span>
                    </div>
                  )}

                  {/* Funding Bar */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Budget Funded</span>
                      <span className="text-emerald-400 font-bold">${imp.fundedAmount} / ${imp.estimatedCost} ({fundingPercentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${fundingPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Real-time Status Tracker Timeline */}
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Real-Time Lifecycle Progress
                    </div>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {STATUS_ORDER.map((st, idx) => {
                        const isDone = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                          <div key={st} className="space-y-1">
                            <div className={`h-2 rounded-full transition-all ${
                              isCurrent ? 'bg-amber-400 shadow-md shadow-amber-400/50' : isDone ? 'bg-emerald-500' : 'bg-slate-800'
                            }`} />
                            <div className={`text-[10px] font-semibold truncate ${
                              isCurrent ? 'text-amber-300 font-bold' : isDone ? 'text-emerald-400' : 'text-slate-600'
                            }`}>
                              {st}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Status Logs */}
                  {imp.updates && imp.updates.length > 0 && (
                    <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <History className="w-3.5 h-3.5 text-emerald-400" /> Recent Progress Log:
                      </div>
                      <div className="space-y-1">
                        {imp.updates.slice(-2).map(u => (
                          <div key={u.id} className="text-[11px] text-slate-300 flex items-start gap-2">
                            <span className="text-slate-500 shrink-0">{u.date}:</span>
                            <span className="font-medium text-emerald-300">[{u.status}]</span>
                            <span className="text-slate-300">{u.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Row */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Reported by <strong className="text-slate-200">{imp.reporterName}</strong>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleGenerateAiPitch(imp)}
                    className="flex items-center space-x-1.5 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-500/40 text-xs px-3 py-2 rounded-xl transition"
                  >
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Generate AI Sponsor Proposal</span>
                  </button>

                  {userRole === 'society_admin' && (
                    <button
                      onClick={() => setAdminUpdateImp(imp)}
                      className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI SPONSOR PITCH MODAL */}
      {pitchModalImp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setPitchModalImp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Business Sponsor Proposal Pitch</h2>
                <p className="text-xs text-slate-400">Targeted pitch to pitch local business advertisers for project funding</p>
              </div>
            </div>

            {isPitchLoading ? (
              <div className="py-12 text-center text-slate-300 text-sm space-y-3">
                <Bot className="w-8 h-8 text-indigo-400 animate-bounce mx-auto" />
                <p>Gemini AI is generating structured project pitch & ROI proposal for sponsors...</p>
              </div>
            ) : pitchData ? (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="text-base font-bold text-indigo-300">{pitchData.projectTitle}</h3>
                  <p className="text-slate-300 leading-relaxed">{pitchData.executiveSummary}</p>
                </div>

                <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                  <div className="font-bold text-emerald-400 text-xs">Neighborhood Resident Benefits:</div>
                  <p className="text-slate-300">{pitchData.communityImpact}</p>
                </div>

                <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                  <div className="font-bold text-amber-300 text-xs">Why Local Businesses Should Sponsor ($ Benefit):</div>
                  <p className="text-slate-300">{pitchData.sponsorBenefits}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="font-bold text-slate-300 mb-2">Itemized Cost Breakdown:</div>
                  <div className="space-y-1">
                    {(pitchData.estimatedBudgetBreakdown || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>{item.item}</span>
                        <span className="font-bold text-emerald-400">${item.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`PROPOSAL: ${pitchData.projectTitle}\n\n${pitchData.executiveSummary}\n\nSponsor Benefits: ${pitchData.sponsorBenefits}`);
                    alert('Proposal copied to clipboard!');
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition"
                >
                  Copy Sponsor Pitch to Send to Advertisers
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ADMIN STATUS UPDATE MODAL */}
      {adminUpdateImp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setAdminUpdateImp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2">Update Project Lifecycle</h3>
            <p className="text-xs text-slate-400 mb-4">{adminUpdateImp.title}</p>

            <form onSubmit={handleSaveAdminStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Lifecycle Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as ImprovementStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {STATUS_ORDER.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status Note / Milestone Update</label>
                <textarea
                  placeholder="e.g. Contractors hired. Materials scheduled for delivery next Wednesday."
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white h-24 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition"
              >
                Save Live Status Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
