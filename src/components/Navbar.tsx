import React from 'react';
import { 
  AppView, 
  UserRole 
} from '../types';
import { 
  Building2, 
  Calendar, 
  HeartHandshake, 
  Lightbulb, 
  Map, 
  Tag, 
  TrendingUp, 
  ShieldCheck, 
  PlusCircle, 
  Sparkles,
  Users
} from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  monthlyRevenue: number;
  activeSponsorsCount: number;
  onOpenQuickCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  userRole,
  onChangeUserRole,
  monthlyRevenue,
  activeSponsorsCount,
  onOpenQuickCreate
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-xl">
      {/* Top Banner / Ticker */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white text-xs py-1 px-4 font-medium flex justify-between items-center overflow-x-auto">
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Live Community Network</span>
          <span>Oakridge District #4 Society • 1,420 Active Residents</span>
          <span className="text-white/60">•</span>
          <span className="text-emerald-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 inline" /> 
            {activeSponsorsCount} Local Business Sponsors Funding Improvements ($ {monthlyRevenue}/mo MRR)
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] pl-4">
          <button 
            onClick={() => onChangeUserRole('resident')} 
            className={`px-2 py-0.5 rounded transition ${userRole === 'resident' ? 'bg-white text-slate-900 font-bold' : 'hover:bg-white/20'}`}
          >
            Resident Mode
          </button>
          <button 
            onClick={() => onChangeUserRole('business_owner')} 
            className={`px-2 py-0.5 rounded transition ${userRole === 'business_owner' ? 'bg-white text-slate-900 font-bold' : 'hover:bg-white/20'}`}
          >
            Business Advertiser Mode
          </button>
          <button 
            onClick={() => onChangeUserRole('society_admin')} 
            className={`px-2 py-0.5 rounded transition ${userRole === 'society_admin' ? 'bg-white text-slate-900 font-bold' : 'hover:bg-white/20'}`}
          >
            App Owner / Admin
          </button>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectView('events')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Users className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-sans">CivicPulse</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Society Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Oakridge Society & Ad Network</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => onSelectView('events')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentView === 'events' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events</span>
          </button>

          <button
            onClick={() => onSelectView('volunteer')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentView === 'volunteer' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Volunteer</span>
          </button>

          <button
            onClick={() => onSelectView('improvements')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentView === 'improvements' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Improvements</span>
          </button>

          <button
            onClick={() => onSelectView('map')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentView === 'map' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>District Map</span>
          </button>

          <button
            onClick={() => onSelectView('deals')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentView === 'deals' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Local Deals</span>
          </button>

          <button
            onClick={() => onSelectView('ad_portal')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentView === 'ad_portal' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Sponsor Portal</span>
            <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded">Tiered Ads</span>
          </button>

          <button
            onClick={() => onSelectView('admin_revenue')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentView === 'admin_revenue' ? 'bg-amber-400 text-slate-950 shadow-md font-bold' : 'text-amber-300 hover:text-amber-200 hover:bg-amber-400/10'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Ad Revenue Dashboard</span>
          </button>
        </nav>

        {/* Quick Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenQuickCreate}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Post / Action</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Row */}
      <div className="flex lg:hidden overflow-x-auto py-2 px-4 space-x-2 border-t border-slate-800 bg-slate-900/90 text-xs">
        <button onClick={() => onSelectView('events')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'events' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}>Events</button>
        <button onClick={() => onSelectView('volunteer')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'volunteer' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}>Volunteer</button>
        <button onClick={() => onSelectView('improvements')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'improvements' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}>Improvements</button>
        <button onClick={() => onSelectView('map')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'map' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}>Map</button>
        <button onClick={() => onSelectView('deals')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'deals' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}>Deals</button>
        <button onClick={() => onSelectView('ad_portal')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'ad_portal' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}>Sponsor Ads</button>
        <button onClick={() => onSelectView('admin_revenue')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'admin_revenue' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-amber-300'}`}>Ad Revenue</button>
      </div>
    </header>
  );
};
