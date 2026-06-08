"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaignController_1 = require("../controllers/campaignController");
const router = (0, express_1.Router)();
// Public routes (Frontend)
router.get('/', campaignController_1.getActiveCampaigns);
router.get('/:id', campaignController_1.getCampaignById);
// Admin routes
// In a real app, these would be protected by auth middleware
router.get('/admin/all', campaignController_1.getAllCampaigns);
router.post('/', campaignController_1.createCampaign);
router.put('/:id', campaignController_1.updateCampaign);
router.delete('/:id', campaignController_1.deleteCampaign);
exports.default = router;
