import roadVideo from '../../assets/road.mp4';
import React, { useState } from 'react';
import { NeighborhoodImprovement, ImprovementStatus, UserRole, LocalBusinessAd, GeneratedImprovementPitch } from '../types';

interface ImprovementsViewProps {
  improvements: NeighborhoodImprovement[];
  businesses: LocalBusinessAd[];
  userRole: UserRole;
  onRefreshData: () => void;
  onOpenCreateImprovement: () => void;
}

const STATUS_ORDER: ImprovementStatus[] = ['Reported', 'Under Review', 'Funded', 'In Progress', 'Completed'];

const RoadEvidenceVideo = () => (
  <div className="rounded-xl overflow-hidden bg-black border-2 border-green-500 mb-6 shadow-lg">
    <video controls autoPlay muted loop playsInline className="w-full h-72 object-cover">
      <source src={roadVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="p-4 bg-zinc-900">
      <p className="text-white font-bold text-sm">REAL EVIDENCE: Pothole in Polokwane - CivicPulse</p>
      <p className="text-zinc-400 text-xs mt-1">Live evidence for judges - Municipal Road Failure - Location: Polokwane Limpopo</p>
    </div>
  </div>
);

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

  const filteredImprovements = selectedCategory === 'All' 
    ? improvements 
    : improvements.filter(imp => imp.category === selectedCategory);

  const categories = ['All', ...Array.from(new Set(improvements.map(i => i.category)))];

  return (
    <div className="space-y-8 pb-12">
      <RoadEvidenceVideo />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Fixes & Projects</h1>
          <p className="text-zinc-400 mt-1">Community improvements powered by local businesses</p>
        </div>
        <button
          onClick={onOpenCreateImprovement}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
        >
          + Report Issue
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              selectedCategory === cat 
                ? 'bg-white text-black' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredImprovements.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
            <p className="text-zinc-400">No improvements yet. Be first to report!</p>
          </div>
        ) : (
          filteredImprovements.map(imp => (
            <div key={imp.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 transition">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  imp.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                  imp.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {imp.status}
                </span>
                <span className="text-xs text-zinc-500">{imp.category}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{imp.title}</h3>
              <p className="text-zinc-400 text-sm line-clamp-3 mb-4">{imp.description}</p>
              <div className="flex justify-between items-center text-xs text-zinc-500">
                <span>{imp.location || 'Polokwane'}</span>
                <span>{new Date(imp.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};