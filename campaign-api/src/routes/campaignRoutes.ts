import { Router } from 'express';
import {
  getActiveCampaigns,
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController';

const router = Router();

// Public routes (Frontend)
router.get('/', getActiveCampaigns);
router.get('/:id', getCampaignById);

// Admin routes
// In a real app, these would be protected by auth middleware
router.get('/admin/all', getAllCampaigns);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

export default router;
