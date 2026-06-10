import { NextRequest } from 'next/server';
import { readCampaigns, writeCampaigns } from '../store';

export const dynamic = 'force-dynamic';

// GET /api/campaigns/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaigns = readCampaigns();
    const campaign = campaigns.find((c) => c.id === id);

    if (!campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return Response.json(campaign);
  } catch (error) {
    console.error('GET /api/campaigns/[id] error:', error);
    return Response.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}

// PUT /api/campaigns/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const campaigns = readCampaigns();
    const index = campaigns.findIndex((c) => c.id === id);

    if (index === -1) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const existing = campaigns[index];
    const updated = {
      ...existing,
      ...body,
      id: existing.id, // prevent ID overwrite
      createdAt: existing.createdAt, // preserve original creation time
      updatedAt: new Date().toISOString(),
    };

    campaigns[index] = updated;
    writeCampaigns(campaigns);

    return Response.json(updated);
  } catch (error) {
    console.error('PUT /api/campaigns/[id] error:', error);
    return Response.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

// DELETE /api/campaigns/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaigns = readCampaigns();
    const index = campaigns.findIndex((c) => c.id === id);

    if (index === -1) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    campaigns.splice(index, 1);
    writeCampaigns(campaigns);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/campaigns/[id] error:', error);
    return Response.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}
