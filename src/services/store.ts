import { 
  CommunityEvent, 
  VolunteerOpportunity, 
  NeighborhoodImprovement, 
  LocalBusinessAd, 
  CommunityStats 
} from '../types';
import { 
  INITIAL_EVENTS, 
  INITIAL_VOLUNTEER, 
  INITIAL_IMPROVEMENTS, 
  INITIAL_BUSINESSES,
  SUBSCRIPTION_TIERS
} from '../data/initialData';

const KEYS = {
  EVENTS: 'civicpulse_events_v1',
  VOLUNTEER: 'civicpulse_volunteer_v1',
  IMPROVEMENTS: 'civicpulse_improvements_v1',
  BUSINESSES: 'civicpulse_businesses_v1',
};

class StoreService {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return fallback;
    }
  }

  private set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // --- EVENTS ---
  getEvents(): CommunityEvent[] {
    return this.get<CommunityEvent[]>(KEYS.EVENTS, INITIAL_EVENTS);
  }

  saveEvents(events: CommunityEvent[]): void {
    this.set(KEYS.EVENTS, events);
  }

  toggleRSVP(eventId: string): CommunityEvent[] {
    const events = this.getEvents();
    const updated = events.map(evt => {
      if (evt.id === eventId) {
        const isRSVPed = !evt.isRSVPed;
        const attendeeCount = isRSVPed ? evt.attendeeCount + 1 : Math.max(0, evt.attendeeCount - 1);
        return { ...evt, isRSVPed, attendeeCount };
      }
      return evt;
    });
    this.saveEvents(updated);
    return updated;
  }

  addEvent(newEvent: Omit<CommunityEvent, 'id' | 'attendeeCount' | 'isRSVPed'>): CommunityEvent {
    const events = this.getEvents();
    const created: CommunityEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      attendeeCount: 1,
      isRSVPed: true
    };
    const updated = [created, ...events];
    this.saveEvents(updated);
    return created;
  }

  // --- VOLUNTEER ---
  getVolunteerOpportunities(): VolunteerOpportunity[] {
    return this.get<VolunteerOpportunity[]>(KEYS.VOLUNTEER, INITIAL_VOLUNTEER);
  }

  saveVolunteer(volunteers: VolunteerOpportunity[]): void {
    this.set(KEYS.VOLUNTEER, volunteers);
  }

  toggleVolunteerSignup(volId: string): VolunteerOpportunity[] {
    const list = this.getVolunteerOpportunities();
    const updated = list.map(v => {
      if (v.id === volId) {
        const isSignedUp = !v.isSignedUp;
        const slotsFilled = isSignedUp ? v.slotsFilled + 1 : Math.max(0, v.slotsFilled - 1);
        const status: VolunteerOpportunity['status'] = slotsFilled >= v.slotsAvailable ? 'Filled' : v.status;
        return { ...v, isSignedUp, slotsFilled, status };
      }
      return v;
    });
    this.saveVolunteer(updated);
    return updated;
  }

  addVolunteerOpportunity(newVol: Omit<VolunteerOpportunity, 'id' | 'slotsFilled' | 'isSignedUp'>): VolunteerOpportunity {
    const list = this.getVolunteerOpportunities();
    const created: VolunteerOpportunity = {
      ...newVol,
      id: `vol-${Date.now()}`,
      slotsFilled: 0,
      isSignedUp: false
    };
    const updated = [created, ...list];
    this.saveVolunteer(updated);
    return created;
  }

  // --- IMPROVEMENTS ---
  getImprovements(): NeighborhoodImprovement[] {
    return this.get<NeighborhoodImprovement[]>(KEYS.IMPROVEMENTS, INITIAL_IMPROVEMENTS);
  }

  saveImprovements(list: NeighborhoodImprovement[]): void {
    this.set(KEYS.IMPROVEMENTS, list);
  }

  toggleImprovementVote(impId: string): NeighborhoodImprovement[] {
    const list = this.getImprovements();
    const updated = list.map(imp => {
      if (imp.id === impId) {
        const hasVoted = !imp.hasVoted;
        const votes = hasVoted ? imp.votes + 1 : Math.max(0, imp.votes - 1);
        return { ...imp, hasVoted, votes };
      }
      return imp;
    });
    this.saveImprovements(updated);
    return updated;
  }

  addImprovement(newImp: Omit<NeighborhoodImprovement, 'id' | 'votes' | 'hasVoted' | 'fundedAmount' | 'updates'>): NeighborhoodImprovement {
    const list = this.getImprovements();
    const created: NeighborhoodImprovement = {
      ...newImp,
      id: `imp-${Date.now()}`,
      votes: 1,
      hasVoted: true,
      fundedAmount: 0,
      updates: [
        {
          id: `u-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          status: newImp.status,
          note: 'Project issue reported to Myngenoegen DalmadaCommunity board.',
          author: newImp.reporterName
        }
      ]
    };
    const updated = [created, ...list];
    this.saveImprovements(updated);
    return created;
  }

  updateImprovementStatus(
    impId: string, 
    newStatus: NeighborhoodImprovement['status'], 
    note: string, 
    author: string
  ): NeighborhoodImprovement[] {
    const list = this.getImprovements();
    const updated = list.map(imp => {
      if (imp.id === impId) {
        const updates = [
          ...imp.updates,
          {
            id: `u-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            status: newStatus,
            note,
            author
          }
        ];
        return { ...imp, status: newStatus, updates };
      }
      return imp;
    });
    this.saveImprovements(updated);
    return updated;
  }

  // --- BUSINESS ADS & SUBSCRIPTIONS ---
  getBusinesses(): LocalBusinessAd[] {
    return this.get<LocalBusinessAd[]>(KEYS.BUSINESSES, INITIAL_BUSINESSES);
  }

  saveBusinesses(list: LocalBusinessAd[]): void {
    this.set(KEYS.BUSINESSES, list);
  }

  recordAdImpression(bizId: string): void {
    const list = this.getBusinesses();
    const updated = list.map(b => b.id === bizId ? { ...b, impressions: b.impressions + 1 } : b);
    this.saveBusinesses(updated);
  }

  recordAdClick(bizId: string): void {
    const list = this.getBusinesses();
    const updated = list.map(b => b.id === bizId ? { ...b, clicks: b.clicks + 1 } : b);
    this.saveBusinesses(updated);
  }

  recordDealRedeemed(bizId: string): void {
    const list = this.getBusinesses();
    const updated = list.map(b => b.id === bizId ? { ...b, dealsRedeemed: b.dealsRedeemed + 1, clicks: b.clicks + 1 } : b);
    this.saveBusinesses(updated);
  }

  addBusinessSubscription(newBiz: Partial<LocalBusinessAd> & { businessName: string; category: LocalBusinessAd['category']; tier: LocalBusinessAd['tier'] }): LocalBusinessAd {
    const list = this.getBusinesses();
    const created: LocalBusinessAd = {
      id: `biz-${Date.now()}`,
      businessName: newBiz.businessName,
      category: newBiz.category,
      tier: newBiz.tier,
      ownerEmail: newBiz.ownerEmail || 'sponsor@myngenoegen.co.za',
      ownerName: newBiz.ownerName || 'Local Merchant',
      logoUrl: newBiz.logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200',
      bannerUrl: newBiz.bannerUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      headline: newBiz.headline || 'Supporting $
{newBiz.businessName} & Myngenoegen Dalmada Community',
      bodyText: newBiz.bodyText || 'Proud local sponsor supporting Myngenoegen Dalmada events and infrastructure projects.',
      dealOffer: newBiz.dealOffer || '10% Discount for Neighborhood App Users',
      couponCode: newBiz.couponCode || `OAK-${Math.floor(1000 + Math.random() * 9000)}`,
      callToAction: newBiz.callToAction || 'Visit Store Today',
      websiteUrl: newBiz.websiteUrl || 'https://example.com',
      phone: newBiz.phone || '(555) 123-4567',
      address: newBiz.address || 'Main Street, District 4',
      activeStatus: 'Active',
      impressions: 1,
      clicks: 0,
      dealsRedeemed: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      latitude: newBiz.latitude || 45.4215,
      longitude: newBiz.longitude || -75.6972
    };
    const updated = [created, ...list];
    this.saveBusinesses(updated);
    return created;
  }

  // --- STATS CALCULATOR ---
  getCommunityStats(): CommunityStats {
    const events = this.getEvents();
    const volunteer = this.getVolunteerOpportunities();
    const improvements = this.getImprovements();
    const businesses = this.getBusinesses();

    const activeEventsCount = events.length;
    const totalVolunteerHours = volunteer.reduce((acc, v) => acc + (v.slotsFilled * v.hoursPerShift), 0) + 180;
    const resolvedImprovementsCount = improvements.filter(i => i.status === 'Completed' || i.status === 'In Progress').length;
    
    const activeBusinesses = businesses.filter(b => b.activeStatus === 'Active');
    const activeBusinessSponsorsCount = activeBusinesses.length;

    // Monthly recurring ad revenue
    const monthlyAdRevenue = activeBusinesses.reduce((acc, b) => {
      const tierObj = SUBSCRIPTION_TIERS.find(t => t.id === b.tier);
      return acc + (tierObj ? tierObj.priceMonthly : 0);
    }, 0);

    return {
      totalResidents: 1420,
      activeEventsCount,
      totalVolunteerHours,
      resolvedImprovementsCount,
      activeBusinessSponsorsCount,
      monthlyAdRevenue
    };
  }

  resetToDefaults(): void {
    localStorage.removeItem(KEYS.EVENTS);
    localStorage.removeItem(KEYS.VOLUNTEER);
    localStorage.removeItem(KEYS.IMPROVEMENTS);
    localStorage.removeItem(KEYS.BUSINESSES);
  }
}

export const store = new StoreService();
