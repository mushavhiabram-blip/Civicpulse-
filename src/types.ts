export type AppView = 
  | 'events' 
  | 'volunteer' 
  | 'improvements' 
  | 'map' 
  | 'deals' 
  | 'ad_portal' 
  | 'admin_revenue'
  | 'grassroots_hub';

export type UserRole = 'resident' | 'business_owner' | 'society_admin';

export type EventCategory = 'Clean-up' | 'Block Party' | 'Safety Watch' | 'Gardening' | 'Workshop' | 'Family';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM - 1:00 PM"
  location: string;
  organizerName: string;
  organizerAvatar?: string;
  attendeeCount: number;
  maxAttendees: number;
  isRSVPed?: boolean;
  latitude: number; // For map pin (relative 0-100)
  longitude: number; // For map pin (relative 0-100)
  imageUrl: string;
  tags: string[];
  sponsoredByBusinessId?: string;
  sponsoredByBusinessName?: string;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  organization: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  slotsAvailable: number;
  slotsFilled: number;
  hoursPerShift: number;
  requiredSkills: string[];
  status: 'Open' | 'Urgent' | 'Filled';
  isSignedUp?: boolean;
  sponsoredByBusinessName?: string;
}

export type ImprovementStatus = 'Reported' | 'Under Review' | 'Funded' | 'In Progress' | 'Completed';

export interface StatusUpdateLog {
  id: string;
  date: string;
  status: ImprovementStatus;
  note: string;
  author: string;
}

export interface NeighborhoodImprovement {
  id: string;
  title: string;
  category: 'Infrastructure' | 'Greenery' | 'Safety' | 'Art & Culture' | 'Accessibility';
  location: string;
  description: string;
  reporterName: string;
  votes: number;
  hasVoted?: boolean;
  status: ImprovementStatus;
  beforeImageUrl: string;
  afterImageUrl?: string;
  estimatedCost: number;
  fundedAmount: number;
  latitude: number;
  longitude: number;
  updates: StatusUpdateLog[];
  sponsoredByBusinessName?: string;
}

export type SubscriptionTierId = 'supporter' | 'sponsor' | 'champion';

export interface SubscriptionTier {
  id: SubscriptionTierId;
  name: string;
  priceMonthly: number;
  badge: string;
  color: string;
  description: string;
  features: string[];
  maxDeals: number;
  priorityPlacement: boolean;
  mapPinHighlight: boolean;
}

export interface LocalBusinessAd {
  id: string;
  businessName: string;
  ownerEmail: string;
  ownerName: string;
  category: 'Dining & Cafe' | 'Retail & Market' | 'Home Services' | 'Health & Wellness' | 'Entertainment' | 'Automotive';
  tier: SubscriptionTierId;
  logoUrl: string;
  bannerUrl: string;
  headline: string;
  bodyText: string;
  dealOffer?: string; // e.g. "15% discount for Oakridge Residents"
  couponCode?: string;
  callToAction: string;
  websiteUrl: string;
  phone: string;
  address: string;
  activeStatus: 'Active' | 'Pending Review' | 'Paused';
  impressions: number;
  clicks: number;
  dealsRedeemed: number;
  joinedDate: string;
  latitude: number;
  longitude: number;
}

export interface CommunityStats {
  totalResidents: number;
  activeEventsCount: number;
  totalVolunteerHours: number;
  resolvedImprovementsCount: number;
  activeBusinessSponsorsCount: number;
  monthlyAdRevenue: number;
}

export interface UserVolunteerStats {
  totalHoursLogged: number;
  eventsJoinedCount: number;
  badgesEarned: string[];
  civicRank: string;
}

export interface RevenueMetrics {
  mrr: number;
  totalAdRevenueAllTime: number;
  totalSponsorsCount: number;
  activeResidentUsers: number;
  tierBreakdown: { sponsor: number; champion: number; basic: number };
}

export interface GeneratedGazetteNewsletter {
  title: string;
  monthYear: string;
  editorNote: string;
  highlights: string[];
  sponsorShoutout: string;
  upcomingCallToAction: string;
}
