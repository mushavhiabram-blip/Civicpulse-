
  import { CommunityEvent, VolunteerOpportunity, NeighborhoodImprovement, LocalBusinessAd, SubscriptionTier } from '../types';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  { id: 'supporter', name: 'Neighborhood Supporter', priceMonthly: 29, badge: 'Supporter', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800', description: 'Small shops', features: ['Listing'], maxDeals: 1, priorityPlacement: false, mapPinHighlight: false },
  { id: 'sponsor', name: 'Community Sponsor', priceMonthly: 79, badge: 'Gold Sponsor', color: 'border-blue-200 bg-blue-50/50 text-blue-800', description: 'Local stores', features: ['Pin'], maxDeals: 3, priorityPlacement: true, mapPinHighlight: true },
  { id: 'champion', name: 'Civic Champion', priceMonthly: 199, badge: 'Premier Champion', color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900', description: 'Max exposure', features: ['Banner'], maxDeals: 99, priorityPlacement: true, mapPinHighlight: true }
];

export const INITIAL_EVENTS: CommunityEvent[] = [];
export const INITIAL_VOLUNTEER: VolunteerOpportunity[] = [];
export const INITIAL_IMPROVEMENTS: NeighborhoodImprovement[] = [];

export const INITIAL_BUSINESSES: LocalBusinessAd[] = [
  {
    id: 'biz-1',
    businessName: 'Adroit Advanced Security & K9',
    ownerEmail: 'adroitk9@outlook.com',
    ownerName: 'Owner Lindo | Field Mpho Mulamavhy Gift 0725573204',
    category: 'Security',
    tier: 'champion',
    logoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    headline: 'Myngenoegen Dalmada - Call Mpho 0725573204',
    bodyText: 'Mpho Mulamavhy Gift Field Officer Adroit Security K9. 24 Geluk Street Myngenoegen Dalmada Polokwane 0700. R2500 Home R3500 K9 R15000 Executive. 0725573204 0633457795 Lindo 0847997755',
    dealOffer: 'R500 OFF Ask for Mpho',
    couponCode: 'MPHO500',
    callToAction: 'WhatsApp Mpho 0725573204',
    websiteUrl: 'https://wa.me/27725573204',
    phone: '0725573204',
    address: '24 Geluk Street Myngenoegen Dalmada Polokwane 0700',
    activeStatus: 'Active',
    impressions: 100,
    clicks: 10,
    dealsRedeemed: 2,
    joinedDate: '2026-02-01',
    latitude: -23.8403,
    longitude: 29.4307
  },
  {
    id: 'biz-2',
    businessName: 'MJ Gateway Residence',
    ownerEmail: 'mj.gateway@gmail.com',
    ownerName: 'Portia 0766141352',
    category: 'Student Housing',
    tier: 'sponsor',
    logoUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    headline: 'Student Rooms - Call Portia 0766141352',
    bodyText: 'MJ Gateway student res Myngenoegen Dalmada. Manager Portia 0766141352. NSFAS WiFi parking security Adroit',
    dealOffer: 'Contact Portia',
    couponCode: 'MJPORTIA',
    callToAction: 'Call Portia 0766141352',
    websiteUrl: 'https://wa.me/27766141352',
    phone: '0766141352',
    address: 'MJ Gateway Myngenoegen Dalmada Polokwane',
    activeStatus: 'Active',
    impressions: 50,
    clicks: 5,
    dealsRedeemed: 1,
    joinedDate: '2026-05-01',
    latitude: -23.8415,
    longitude: 29.432
  }
];
    