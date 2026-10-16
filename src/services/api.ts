export interface GeneratedAdCopy {
  headlines: string[];
  bodyCopy: string;
  suggestedDeals: string[];
  callToAction: string;
}

export interface GeneratedEventPlan {
  suggestedTitle: string;
  description: string;
  volunteerRoles: string[];
  safetyChecklist: string[];
  recommendedCategory: string;
}

export interface GeneratedImprovementPitch {
  projectTitle: string;
  executiveSummary: string;
  communityImpact: string;
  sponsorBenefits: string;
  estimatedBudgetBreakdown: { item: string; cost: number }[];
}

export interface GeneratedGazette {
  title: string;
  monthYear: string;
  editorNote: string;
  highlightedProjects: string[];
  volunteerSpotlight: string;
  sponsorShoutouts: string[];
}

export interface ModerationResult {
  isAllowed: boolean;
  flaggedReason?: string;
  moderationCategory: 'safe' | 'hate_speech' | 'political_harassment' | 'personal_harassment';
  suggestedCleanText?: string;
  confidenceScore: number;
}

export interface DraftedVolunteerPost {
  title: string;
  description: string;
  organization: string;
  rolesNeeded: string[];
  requiredSkills: string[];
  suggestedSlots: number;
  hoursPerShift: number;
  impactStatement: string;
}

export interface DraftedMaintenanceReport {
  title: string;
  category: string;
  severityLevel: string;
  structuredDescription: string;
  estimatedCost: number;
  recommendedAction: string;
  urgencyReasoning: string;
}

export async function moderateContentAI(params: {
  title?: string;
  content: string;
  postType?: string;
}): Promise<ModerationResult> {
  const res = await fetch('/api/gemini/moderate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to moderate content');
  }

  return await res.json();
}

export async function draftVolunteerPostAI(params: {
  roughNotes: string;
  location?: string;
}): Promise<DraftedVolunteerPost> {
  const res = await fetch('/api/gemini/draft-volunteer-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to draft volunteer post');
  }

  return await res.json();
}

export async function draftMaintenanceReportAI(params: {
  roughIssue: string;
  location?: string;
}): Promise<DraftedMaintenanceReport> {
  const res = await fetch('/api/gemini/draft-maintenance-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to draft maintenance report');
  }

  return await res.json();
}

export async function generateAdCopyAI(params: {
  businessName: string;
  category: string;
  specialOffer?: string;
  targetAudience?: string;
}): Promise<GeneratedAdCopy> {
  const res = await fetch('/api/gemini/generate-ad-copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate AI Ad Copy');
  }

  return await res.json();
}

export async function planEventAI(params: {
  topicOrIdea: string;
  neighborhoodArea: string;
  estimatedAttendees?: string;
}): Promise<GeneratedEventPlan> {
  const res = await fetch('/api/gemini/plan-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to plan AI Event');
  }

  return await res.json();
}

export async function generateImprovementPitchAI(params: {
  improvementTitle: string;
  category: string;
  description: string;
  estimatedCost: number;
}): Promise<GeneratedImprovementPitch> {
  const res = await fetch('/api/gemini/improvement-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate improvement pitch');
  }

  return await res.json();
}

export interface LeaderPitchResult {
  subjectLine: string;
  executiveSummary: string;
  keyBenefits: string[];
  coMarketingPledge: string;
  suggestedCallToAction: string;
}

export async function generateLeaderPitchAI(params: {
  targetOrgType: string;
  targetOrgName?: string;
  nodeName?: string;
}): Promise<LeaderPitchResult> {
  const res = await fetch('/api/gemini/leader-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate leader pitch');
  }

  return await res.json();
}

export interface PayFastSubscriptionResult {
  processUrl: string;
  formData: Record<string, string>;
}

export async function generatePayFastSubscriptionAI(params: {
  merchantId?: string;
  merchantKey?: string;
  passphrase?: string;
  tierName: string;
  amountZAR: number | string;
  userEmail: string;
  customUserId?: string;
}): Promise<PayFastSubscriptionResult> {
  const res = await fetch('/api/payfast/generate-subscription-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate PayFast subscription form');
  }

  return await res.json();
}

export async function generateNeighborhoodDigestAI(): Promise<GeneratedGazette> {
  const res = await fetch('/api/gemini/neighborhood-digest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate Neighborhood Digest');
  }

  return await res.json();
}
