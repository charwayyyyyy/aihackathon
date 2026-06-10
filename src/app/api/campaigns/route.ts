import { NextRequest } from 'next/server';
import { readCampaigns, writeCampaigns, generateId, type StoredCampaign } from './store';

export const dynamic = 'force-dynamic';

// GET /api/campaigns - get active campaigns (public) or all campaigns (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const campaigns = readCampaigns();

    if (all) {
      // Admin: return all campaigns, sorted by creation date
      const sorted = [...campaigns].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return Response.json(sorted);
    }

    // Public: return only active campaigns within date range
    const now = new Date();
    const active = campaigns
      .filter(
        (c) =>
          c.status === 'active' &&
          new Date(c.startDate) <= now &&
          new Date(c.endDate) >= now
      )
      .sort((a, b) => b.priority - a.priority || new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    return Response.json(active);
  } catch (error) {
    console.error('GET /api/campaigns error:', error);
    return Response.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// POST /api/campaigns - create a new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      type,
      status,
      imageData,
      discountPercentage,
      targetProducts,
      startDate,
      endDate,
      priority,
    } = body;

    if (!title || !type || !status || !startDate || !endDate) {
      return Response.json(
        { error: 'Missing required fields: title, type, status, startDate, endDate' },
        { status: 400 }
      );
    }

    const campaigns = readCampaigns();
    const now = new Date().toISOString();

    const newCampaign: StoredCampaign = {
      id: generateId(),
      title,
      description: description || '',
      type,
      status,
      imageData: imageData || '',
      discountPercentage: discountPercentage ?? null,
      targetProducts: targetProducts || [],
      startDate,
      endDate,
      priority: priority ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    campaigns.push(newCampaign);
    writeCampaigns(campaigns);

    return Response.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error('POST /api/campaigns error:', error);
    return Response.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
