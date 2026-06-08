"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaignById = exports.getAllCampaigns = exports.getActiveCampaigns = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const campaignSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string(),
    type: zod_1.z.enum(['banner', 'discount', 'collection', 'hero']),
    status: zod_1.z.enum(['draft', 'active', 'expired']),
    imageUrl: zod_1.z.string().url(),
    discountPercentage: zod_1.z.number().nullable().optional(),
    targetProducts: zod_1.z.array(zod_1.z.string()),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    priority: zod_1.z.number().int().default(0)
});
const getActiveCampaigns = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch active campaigns' });
    }
};
exports.getActiveCampaigns = getActiveCampaigns;
const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const formatted = campaigns.map(c => ({
            ...c,
            targetProducts: JSON.parse(c.targetProducts)
        }));
        res.json(formatted);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch all campaigns' });
    }
};
exports.getAllCampaigns = getAllCampaigns;
const getCampaignById = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaign' });
    }
};
exports.getCampaignById = getCampaignById;
const createCampaign = async (req, res) => {
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.issues });
        }
        else {
            res.status(500).json({ error: 'Failed to create campaign' });
        }
    }
};
exports.createCampaign = createCampaign;
const updateCampaign = async (req, res) => {
    try {
        const data = campaignSchema.partial().parse(req.body);
        const { targetProducts, startDate, endDate, ...restData } = data;
        const updateData = { ...restData };
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.issues });
        }
        else {
            res.status(500).json({ error: 'Failed to update campaign' });
        }
    }
};
exports.updateCampaign = updateCampaign;
const deleteCampaign = async (req, res) => {
    try {
        await prisma.campaign.delete({
            where: { id: String(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete campaign' });
    }
};
exports.deleteCampaign = deleteCampaign;
