
  import { CommunityEvent, VolunteerOpportunity, NeighborhoodImprovement, LocalBusinessAd, SubscriptionTier } from '../types';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  { id: 'supporter', name: 'Neighborhood Supporter', priceMonthly: 29, badge: 'Supporter', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800', description: 'Small local businesses', features: ['Directory listing'], maxDeals: 1, priorityPlacement: false, mapPinHighlight: false },
  { id: 'sponsor', name: 'Community Sponsor', priceMonthly: 79, badge: 'Gold Sponsor', color: 'border-blue-200 bg-blue-50/50 text-blue-800', description: 'Local sponsors', features: ['Map Pin'], maxDeals: 3, priorityPlacement: true, mapPinHighlight: true },
  { id: 'champion', name: 'Civic Champion', priceMonthly: 199, badge: 'Premier Champion', color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900', description: 'Top sponsor', features: ['Banner'], maxDeals: 99, priorityPlacement: true, mapPinHighlight: true }
];

export const INITIAL_EVENTS: CommunityEvent[] = [];
export const INITIAL_VOLUNTEER: VolunteerOpportunity[] = [];
export const INITIAL_IMPROVEMENTS: NeighborhoodImprovement[] = [];

export const INITIAL_BUSINESSES: LocalBusinessAd[] = [
  {
    id: 'biz-1',
    businessName: 'Adroit Advanced Security & K9',
    ownerEmail: 'adroit.advanced.k9@gmail.com',
    ownerName: 'Owner: Lindo | Field Officer: Mpho Mulamavhy (Gift) 0725573204 / 0633457795',
    category: 'Security & Safety',
    tier: 'champion',
    logoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    headline: 'Myngenoegen & Dalmada Protected - Call Mpho Gift 0725573204',
    bodyText: 'Adroit Advanced Security & K9. Field Officer Mpho Mulamavhy (Gift). PSIRA Registered. Based 24 Geluk Street Myngenoegen Dalmada Polokwane 0700. Home Secure R2500, K9 Unit R3500, Executive R15000. Direct: Mpho 0725573204 / 0633457795 Office Lindo 0847997755. 24/7 Armed Response Dalmada Flora Park Bendor Myngenoegen Polokwane.',
    dealOffer: 'R500 OFF - Ask For Mpho Gift - Free Security Assessment',
    couponCode: 'MPHO-GIFT-500',
    callToAction: 'WhatsApp Mpho Gift: 072 557 3204',
    websiteUrl: 'https://wa.me/27725573204?text=Hi%20Mpho%20Gift%20Adroit%20Security%20Quote%20Myngenoegen',
    phone: '+27 72 557 3204 / +27 63 345 7795 / Office +27 84 799 7755',
    address: '24 Geluk Street, Myngenoegen, Dalmada, Polokwane, 0700',
    activeStatus: 'Active',
    impressions: 0,
    clicks: 0,
    dealsRedeemed: 0,
    joinedDate: '2026-10-19',
    latitude: -23.8403,
    longitude: 29.4307
  },
  {
    id: 'biz-2',
    businessName: 'MJ Gateway Residence',
    ownerEmail: 'mjgateway.res@gmail.com',
    ownerName: 'Manager: Portia 0766141352',
    category: 'Student Housing',
    tier: 'sponsor',
    logoUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    headline: 'Student Accommodation - Call Portia 0766141352',
    bodyText: 'MJ Gateway Residence - Student accommodation Myngenoegen Dalmada. Manager Portia 0766141352. NSFAS Friendly, WiFi, Safe Parking, Secured by Adroit K9 Security Mpho 0725573204. TUT, University of Limpopo, Capricorn College students welcome.',
    dealOffer: 'NSFAS Accepted - Secure Housing',
    couponCode: 'PORTIA-MJ-076',
    callToAction: 'Call/WhatsApp Portia: 076 614 1352',
    websiteUrl: 'https://wa.me/27766141352?text=Hi%20Portia%20MJ%20Gateway%20Room%20Enquiry',
    phone: '+27 76 614 1352',
    address: 'MJ Gateway Residence, Myngenoegen, Dalmada, Polokwane, 0700',
    activeStatus: 'Active',
    impressions: 0,
    clicks: 0,
    dealsRedeemed: 0,
    joinedDate: '2026-10-19',
    latitude: -23.8415,
    longitude: 29.432
  }
];