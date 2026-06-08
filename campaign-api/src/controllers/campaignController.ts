import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const campaignSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  type: z.enum(['banner', 'discount', 'collection', 'hero']),
  status: z.enum(['draft', 'active', 'expired']),
  imageUrl: z.string().url(),
  discountPercentage: z.number().nullable().optional(),
  targetProducts: z.array(z.string()),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  priority: z.number().int().default(0)
});

export const getActiveCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'active',
        startDate: { lte: now },
        endDate: { gte: now }
      },
      orderBy: [
        { priority: 'desc' },
        { startDate: 'desc' }
      ]
    });
    
    // Parse targetProducts back from JSON string
    const formatted = campaigns.map(c => ({
      ...c,
      targetProducts: JSON.parse(c.targetProducts)
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active campaigns' });
  }
};

export const getAllCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const formatted = campaigns.map(c => ({
      ...c,
      targetProducts: JSON.parse(c.targetProducts)
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all campaigns' });
  }
};

export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: String(req.params.id) }
    });
    
    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    
    res.json({
      ...campaign,
      targetProducts: JSON.parse(campaign.targetProducts)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
};

export const createCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = campaignSchema.parse(req.body);
    
    const { targetProducts, startDate, endDate, ...restData } = data;
    
    const campaign = await prisma.campaign.create({
      data: {
        ...restData,
        targetProducts: JSON.stringify(targetProducts),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }
    });
    
    res.status(201).json({
      ...campaign,
      targetProducts: JSON.parse(campaign.targetProducts)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  }
};

export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = campaignSchema.partial().parse(req.body);
    
    const { targetProducts, startDate, endDate, ...restData } = data;
    
    const updateData: any = { ...restData };
    if (targetProducts) {
      updateData.targetProducts = JSON.stringify(targetProducts);
    }
    if (startDate) {
      updateData.startDate = new Date(startDate);
    }
    if (endDate) {
      updateData.endDate = new Date(endDate);
    }

    const campaign = await prisma.campaign.update({
      where: { id: String(req.params.id) },
      data: updateData
    });
    
    res.json({
      ...campaign,
      targetProducts: JSON.parse(campaign.targetProducts)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(500).json({ error: 'Failed to update campaign' });
    }
  }
};

export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.campaign.delete({
      where: { id: String(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
};
