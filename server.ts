import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to instantiate Gemini GenAI client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// --- API ENDPOINTS ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. AI Ad Copy Generator for Local Businesses
app.post('/api/gemini/generate-ad-copy', async (req, res) => {
  try {
    const { businessName, category, specialOffer, targetAudience } = req.body;
    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    const ai = getGenAIClient();
    const prompt = `You are a local neighborhood community ad copywriter. Generate compelling advertisement copy for a local business in the neighborhood society.
Business Name: ${businessName}
Category: ${category || 'Local Service'}
Special Offer/Deal: ${specialOffer || 'Exclusive neighborhood discount'}
Target Audience: ${targetAudience || 'Local families and residents'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You craft engaging, warm, community-focused ads for local neighborhood bulletin boards and apps.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 catchy neighborhood-friendly headline options',
            },
            bodyCopy: {
              type: Type.STRING,
              description: 'An engaging 2-3 sentence paragraph explaining why residents should visit.',
            },
            suggestedDeals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 attractive promo offer ideas for residents.',
            },
            callToAction: {
              type: Type.STRING,
              description: 'Short button action label (e.g. "Claim Resident Deal", "Order Fresh Today").',
            },
          },
          required: ['headlines', 'bodyCopy', 'suggestedDeals', 'callToAction'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating AI ad copy:', error);
    res.status(500).json({ error: error.message || 'Failed to generate ad copy' });
  }
});

// 2. AI Community Event Planner
app.post('/api/gemini/plan-event', async (req, res) => {
  try {
    const { topicOrIdea, neighborhoodArea, estimatedAttendees } = req.body;
    if (!topicOrIdea) {
      return res.status(400).json({ error: 'Topic or event idea is required' });
    }

    const ai = getGenAIClient();
    const prompt = `Plan a warm, well-organized community event for local residents in ${neighborhoodArea || 'Oakridge District'}.
Event Idea: ${topicOrIdea}
Estimated Attendees: ${estimatedAttendees || '50 residents'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an experienced neighborhood community organizer. Create safe, inclusive, well-structured event plans.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTitle: {
              type: Type.STRING,
              description: 'An inviting, clear event title.',
            },
            description: {
              type: Type.STRING,
              description: 'Detailed 2-paragraph event description highlighting activities, food, and family friendliness.',
            },
            volunteerRoles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4 specific volunteer roles needed (e.g. Welcome Desk, Setup Crew, Refreshment Coordinator).',
            },
            safetyChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4 practical safety, accessibility, and permit reminders.',
            },
            recommendedCategory: {
              type: Type.STRING,
              description: 'One of: Clean-up, Block Party, Safety Watch, Gardening, Workshop, Family.',
            },
          },
          required: ['suggestedTitle', 'description', 'volunteerRoles', 'safetyChecklist', 'recommendedCategory'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error planning event:', error);
    res.status(500).json({ error: error.message || 'Failed to plan event' });
  }
});

// 3. AI Neighborhood Improvement Project Pitch / Report Generator
app.post('/api/gemini/improvement-report', async (req, res) => {
  try {
    const { improvementTitle, category, description, estimatedCost } = req.body;
    if (!improvementTitle) {
      return res.status(400).json({ error: 'Improvement project title is required' });
    }

    const ai = getGenAIClient();
    const prompt = `Create a professional project proposal and sponsor pitch for a neighborhood improvement project.
Project Title: ${improvementTitle}
Category: ${category || 'Infrastructure'}
Description: ${description || 'Neighborhood enhancement project'}
Estimated Cost: $${estimatedCost || 500}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You write structured municipal and community project proposals for neighborhood boards and business sponsors.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectTitle: { type: Type.STRING },
            executiveSummary: { type: Type.STRING, description: 'Summary of the issue and proposed fix.' },
            communityImpact: { type: Type.STRING, description: 'Direct benefits to residents (safety, aesthetic, social).' },
            sponsorBenefits: { type: Type.STRING, description: 'Why local business sponsors should fund or co-brand this project.' },
            estimatedBudgetBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  cost: { type: Type.NUMBER },
                },
                required: ['item', 'cost'],
              },
            },
          },
          required: ['projectTitle', 'executiveSummary', 'communityImpact', 'sponsorBenefits', 'estimatedBudgetBreakdown'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating improvement pitch:', error);
    res.status(500).json({ error: error.message || 'Failed to generate improvement pitch' });
  }
});

// 4. AI Content Moderation & Feed Guard
app.post('/api/gemini/moderate-content', async (req, res) => {
  try {
    const { title, content, postType } = req.body;
    if (!content && !title) {
      return res.status(400).json({ error: 'Text content or title is required for moderation' });
    }

    const ai = getGenAIClient();
    const prompt = `Inspect the following community post for policy violations.
Post Type: ${postType || 'general_feed'}
Title: ${title || 'N/A'}
Content/Body: ${content || 'N/A'}

Analyze for:
1. Hate speech (racism, bigotry, targeted discrimination)
2. Political harassment (partisan attacks, political candidate harassment, inflammatory election commentary)
3. Personal slurs, threats, or aggressive harassment.

If clean, mark isAllowed: true.
If violating, mark isAllowed: false, detail flaggedReason, set moderationCategory ('hate_speech' | 'political_harassment' | 'personal_harassment' | 'safe'), and provide a civil, constructive suggestedCleanText.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an automated community safety moderator protecting local neighborhood boards from hate speech, harassment, and toxic partisan political disputes.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAllowed: { type: Type.BOOLEAN, description: 'True if clean and safe for community posting.' },
            flaggedReason: { type: Type.STRING, description: 'Explanation of policy violation or null if safe.' },
            moderationCategory: { type: Type.STRING, description: 'One of: safe, hate_speech, political_harassment, personal_harassment' },
            suggestedCleanText: { type: Type.STRING, description: 'Constructive civil alternative text.' },
            confidenceScore: { type: Type.NUMBER, description: 'Confidence between 0 and 1.' }
          },
          required: ['isAllowed', 'flaggedReason', 'moderationCategory', 'suggestedCleanText', 'confidenceScore']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error moderating content:', error);
    res.status(500).json({ error: error.message || 'Failed to moderate content' });
  }
});

// 5. AI Draft Assistant for Structured Volunteer Postings
app.post('/api/gemini/draft-volunteer-post', async (req, res) => {
  try {
    const { roughNotes, location } = req.body;
    if (!roughNotes) {
      return res.status(400).json({ error: 'Rough notes or title is required' });
    }

    const ai = getGenAIClient();
    const prompt = `Transform these rough volunteer request notes into a structured, highly organized community volunteer posting.
Notes: ${roughNotes}
Location: ${location || 'Oakridge Neighborhood Park'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You draft structured, engaging volunteer posts with clear roles, expectations, and impact.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Clean, appealing posting title.' },
            description: { type: Type.STRING, description: 'Well-written 2-paragraph overview.' },
            organization: { type: Type.STRING, description: 'Suggested community committee name.' },
            rolesNeeded: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 specific volunteer roles.'
            },
            requiredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Required skills or items to bring.'
            },
            suggestedSlots: { type: Type.NUMBER, description: 'Recommended volunteer slots needed.' },
            hoursPerShift: { type: Type.NUMBER, description: 'Shift duration in hours.' },
            impactStatement: { type: Type.STRING, description: 'Why this helps neighbors.' }
          },
          required: ['title', 'description', 'organization', 'rolesNeeded', 'requiredSkills', 'suggestedSlots', 'hoursPerShift', 'impactStatement']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error drafting volunteer post:', error);
    res.status(500).json({ error: error.message || 'Failed to draft volunteer post' });
  }
});

// 6. AI Draft Assistant for Maintenance / Improvement Reports
app.post('/api/gemini/draft-maintenance-report', async (req, res) => {
  try {
    const { roughIssue, location } = req.body;
    if (!roughIssue) {
      return res.status(400).json({ error: 'Rough issue text is required' });
    }

    const ai = getGenAIClient();
    const prompt = `Convert this rough hazard or maintenance observation into a structured, formal municipal/neighborhood board report.
Issue Notes: ${roughIssue}
Location: ${location || 'Oakridge District Main Walkway'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You craft formal, actionable municipal maintenance hazard reports with severity levels and estimated budgets.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Formal, concise issue title.' },
            category: { type: Type.STRING, description: 'One of: Safety, Infrastructure, Parks, Lighting, Sanitation' },
            severityLevel: { type: Type.STRING, description: 'One of: Low, Medium, High, Critical' },
            structuredDescription: { type: Type.STRING, description: 'Detailed technical description of hazard and recommended action.' },
            estimatedCost: { type: Type.NUMBER, description: 'Estimated budget needed in USD.' },
            recommendedAction: { type: Type.STRING, description: 'Action steps for public works or board.' },
            urgencyReasoning: { type: Type.STRING, description: 'Safety or risk justification.' }
          },
          required: ['title', 'category', 'severityLevel', 'structuredDescription', 'estimatedCost', 'recommendedAction', 'urgencyReasoning']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error drafting maintenance report:', error);
    res.status(500).json({ error: error.message || 'Failed to draft maintenance report' });
  }
});

// 7. AI Community Leader Pitch Generator
app.post('/api/gemini/leader-pitch', async (req, res) => {
  try {
    const { targetOrgType, targetOrgName, nodeName } = req.body;
    if (!targetOrgType) {
      return res.status(400).json({ error: 'targetOrgType is required' });
    }

    const ai = getGenAIClient();
    const prompt = `Create a high-converting, professional partnership pitch letter and proposal deck summary for a local community organization.
Target Organization Type: ${targetOrgType} (e.g. Ratepayers Association, Community Policing Forum - CPF, or Neighborhood Watch)
Organization Name: ${targetOrgName || 'Oakridge Ratepayers Association'}
Geographic Node / Suburb: ${nodeName || 'Oakridge Suburb Node 1'}

Highlight:
1. Why they should partner with CivicPulse: They already have user trust and engagement but lack modern digital tools.
2. What CivicPulse provides: Digital issue logging, real-time map alerts, automated safety moderation, and monetized ad revenue to fund local projects.
3. Zero cost partnership structure for their organization.
4. Immediate call-to-action to co-brand the local node.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert community growth strategist crafting persuasive partnership pitch decks for local civic leaders, Ratepayers Associations, and CPFs.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectLine: { type: Type.STRING, description: 'Compelling email subject line.' },
            executiveSummary: { type: Type.STRING, description: '2-paragraph pitch letter.' },
            keyBenefits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4 bullet points highlighting benefits for their organization.'
            },
            coMarketingPledge: { type: Type.STRING, description: 'Proposed co-branding agreement.' },
            suggestedCallToAction: { type: Type.STRING, description: 'Next steps for board approval.' }
          },
          required: ['subjectLine', 'executiveSummary', 'keyBenefits', 'coMarketingPledge', 'suggestedCallToAction']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating leader pitch:', error);
    res.status(500).json({ error: error.message || 'Failed to generate leader pitch' });
  }
});

// --- PAYFAST RECURRING SUBSCRIPTION HELPER ---

interface PayFastSubscriptionParams {
  merchantId?: string;
  merchantKey?: string;
  passphrase?: string;
  tierName: string;
  amountZAR: number | string;
  userEmail: string;
  customUserId: string;
  returnUrl?: string;
  cancelUrl?: string;
  notifyUrl?: string;
}

function createPayFastSubscription({
  merchantId = process.env.PAYFAST_MERCHANT_ID || '10000100', // Default PayFast Sandbox ID
  merchantKey = process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a',
  passphrase = process.env.PAYFAST_PASSPHRASE || '',
  tierName,
  amountZAR,
  userEmail,
  customUserId,
  returnUrl = 'https://civicpulse.co.za/payment/success',
  cancelUrl = 'https://civicpulse.co.za/payment/cancel',
  notifyUrl = 'https://api.civicpulse.co.za/v1/payments/payfast-webhook',
}: PayFastSubscriptionParams) {
  const formattedAmount = parseFloat(amountZAR.toString()).toFixed(2);

  const payload: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,

    name_first: 'Local Business',
    email_address: userEmail,
    m_payment_id: `SUB-${customUserId}-${Date.now()}`,
    amount: formattedAmount,
    item_name: `CivicPulse Business ${tierName}`,

    subscription_type: '1',        // 1 = Recurring payment
    billing_date: new Date().toISOString().split('T')[0], // Starts today
    recurring_amount: formattedAmount,
    frequency: '3',                // 3 = Monthly
    cycles: '0',                   // 0 = Infinite until cancelled
  };

  // Generate PayFast Signature (MD5 Hash)
  let getString = '';
  for (const key in payload) {
    if (payload[key] !== undefined && payload[key] !== '') {
      getString += `${key}=${encodeURIComponent(payload[key].trim()).replace(/%20/g, '+')}&`;
    }
  }

  if (passphrase) {
    getString += `passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
  } else {
    getString = getString.slice(0, -1);
  }

  const signature = crypto.createHash('md5').update(getString).digest('hex');
  const processUrl = merchantId === '10000100'
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';

  return {
    processUrl,
    formData: { ...payload, signature },
  };
}

// PayFast Form Generation Endpoint
app.post('/api/payfast/generate-subscription-form', (req, res) => {
  try {
    const { merchantId, merchantKey, passphrase, tierName, amountZAR, userEmail, customUserId } = req.body;
    if (!tierName || !amountZAR || !userEmail) {
      return res.status(400).json({ error: 'tierName, amountZAR, and userEmail are required' });
    }

    const result = createPayFastSubscription({
      merchantId,
      merchantKey,
      passphrase,
      tierName,
      amountZAR,
      userEmail,
      customUserId: customUserId || `BIZ_${Math.floor(10000 + Math.random() * 90000)}`,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error generating PayFast subscription:', error);
    res.status(500).json({ error: error.message || 'Failed to generate PayFast subscription form' });
  }
});

// PayFast ITN Webhook Callback Endpoint
app.post('/api/payments/payfast-webhook', (req, res) => {
  try {
    console.log('Received PayFast Webhook Notification (ITN):', req.body);
    // Respond with HTTP 200 OK to acknowledge PayFast ITN callback
    res.status(200).send('OK');
  } catch (error: any) {
    console.error('Error handling PayFast webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 4. AI Monthly Society Gazette & News Digest
app.post('/api/gemini/neighborhood-digest', async (req, res) => {
  try {
    const ai = getGenAIClient();
    const prompt = `Generate an uplifting Monthly CivicPulse Gazette for Oakridge District #4 celebrating recent community improvements, volunteer achievements, upcoming block events, and thanking local business sponsors.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are the Chief Editor of the Oakridge Community Monthly Newsletter.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Newsletter edition title' },
            monthYear: { type: Type.STRING, description: 'e.g. August 2026 Edition' },
            editorNote: { type: Type.STRING, description: 'A warm opening letter to residents.' },
            highlightedProjects: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 top neighborhood achievements or completed improvements.',
            },
            volunteerSpotlight: { type: Type.STRING, description: 'Story honoring outstanding volunteer dedication.' },
            sponsorShoutouts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Special acknowledgment of local business sponsors.',
            },
          },
          required: ['title', 'monthYear', 'editorNote', 'highlightedProjects', 'volunteerSpotlight', 'sponsorShoutouts'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating digest:', error);
    res.status(500).json({ error: error.message || 'Failed to generate neighborhood digest' });
  }
});

// --- SERVER SETUP ---

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicPulse server running on http://0.0.0.0:${PORT}`);
  });
}

start();
