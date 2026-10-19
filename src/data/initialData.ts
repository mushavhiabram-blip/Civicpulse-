import {
  CommunityEvent,
  VolunteerOpportunity,
  NeighborhoodImprovement,
  LocalBusinessAd,
  SubscriptionTier
} from '../types';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'supporter',
    name: 'Neighborhood Supporter',
    priceMonthly: 29,
    badge: 'Supporter',
    color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800',
    description: 'Perfect for small local boutiques',
    features: ['Directory listing', '1 coupon code', 'Sponsor badge', 'Basic analytics'],
    maxDeals: 1,
    priorityPlacement: false,
    mapPinHighlight: false
  },
  {
    id: 'sponsor',
    name: 'Community Sponsor',
    priceMonthly: 79,
    badge: 'Gold Sponsor',
    color: 'border-blue-200 bg-blue-50/50 text-blue-800',
    description: 'High visibility for local stores',
    features: ['Highlighted Pin', '3 deals', 'Banner placement', 'Co-sponsor tag', 'AI Copy Generator'],
    maxDeals: 3,
    priorityPlacement: true,
    mapPinHighlight: true
  },
  {
    id: 'champion',
    name: 'Civic Champion',
    priceMonthly: 199,
    badge: 'Premier Champion',
    color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900',
    description: 'Maximum exposure for anchor businesses',
    features: ['Top-tier banner', 'Exclusive Sponsored By', 'Unlimited deals', 'Golden Star Pin', 'AI Suite', 'Sponsor report'],
    maxDeals: 99,
    priorityPlacement: true,
    mapPinHighlight: true
  }
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'Myngenoegen & Dalmada Safety Walk',
    description: 'Join Mpho Mulamavhy (Gift) and Adroit K9 - Safety walk in Myngenoegen, Dalmada, Flora Park',
    category: 'Safety Watch',
    date: '2026-10-25',
    time: '18:00 - 20:00',
    location: '24 Geluk Street, Myngenoegen, Dalmada',
    organizerName: 'Mpho Mulamavhy (Gift) - Adroit Security Owner Lindo',
    attendeeCount: 12,
    maxAttendees: 60,
    isRSVPed: false,
    latitude: -23.8403,
    longitude: 29.4307,
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    tags: ['Safety', 'K9', 'Dalmada'],
    sponsoredByBusinessId: 'biz-1',
    sponsoredByBusinessName: 'Adroit Advanced Security & K9'
  }
];

export const INITIAL_VOLUNTEER: VolunteerOpportunity[] = [];
export const INITIAL_IMPROVEMENTS: NeighborhoodImprovement[] = [];

export const INITIAL_BUSINESSES: LocalBusinessAd[] = [
  {
    id: 'biz-1',
    businessName: 'Adroit Advanced Security & K9',
    ownerEmail: 'adroitk9@outlook.com',
    ownerName: 'Owner: Lindo | Field: Mpho Mulamavhy (Gift) 0725573204 / 0633457795',
    category: 'Security & Safety',
    tier: 'champion',
    logoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    headline: 'Myngenoegen & Dalmada - Call Mpho Gift 072 557 3204',
    bodyText: 'Mpho Mulamavhy (Gift) Field Officer Adroit Advanced Security & K9. PSIRA registered. 24 Geluk Street Myngenoegen Dalmada Polokwane 0700. Home R2500, K9 R3500, Executive R15000. Direct: 0725573204 / 0633457795 Office Lindo 0847997755. 24/7 Armed Response & K9.',
    dealOffer: 'R500 OFF - Ask for Mpho Gift - Free Assessment',
    couponCode: 'MPHO-GIFT-500',
    callToAction: 'WhatsApp Mpho: 072 557 3204',
    websiteUrl: 'https://wa.me/27725573204?text=Hi%20Mpho%20Gift%20Adroit%20Quote%20Dalmada',
    phone: '+27 72 557 3204 / +27 63 345 7795',
    address: '24 Geluk Street, Myngenoegen, Dalmada, Polokwane, 0700',
    activeStatus: 'Active',
    impressions: 5120,
    clicks: 390,
    dealsRedeemed: 88,
    joinedDate: '2026-02-01',
    latitude: -23.8403,
    longitude: 29.4307
  },
  {
    