import fs from 'fs';
import path from 'path';

export interface StoredCampaign {
  id: string;
  title: string;
  description: string;
  type: 'banner' | 'discount' | 'collection' | 'hero';
  status: 'draft' | 'active' | 'expired';
  imageData: string; // base64 data URI or external URL
  discountPercentage: number | null;
  targetProducts: string[];
  startDate: string;
  endDate: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// Use /tmp on Vercel (read-only filesystem except /tmp), or project root locally
const DATA_DIR = process.env.VERCEL ? '/tmp' : process.cwd();
const DATA_FILE = path.join(DATA_DIR, 'campaigns-data.json');

// In-memory cache for serverless environments where /tmp may be fresh
let memoryCache: StoredCampaign[] | null = null;

export function readCampaigns(): StoredCampaign[] {
  // Try memory cache first (for serverless warm starts)
  if (memoryCache !== null) {
    return [...memoryCache];
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw) as StoredCampaign[];
      memoryCache = data;
      return [...data];
    }
  } catch (error) {
    console.error('Error reading campaigns data file:', error);
  }

  return [];
}

export function writeCampaigns(campaigns: StoredCampaign[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(campaigns, null, 2), 'utf-8');
    memoryCache = [...campaigns];
  } catch (error) {
    console.error('Error writing campaigns data file:', error);
    // Still update memory cache even if file write fails
    memoryCache = [...campaigns];
  }
}

export function generateId(): string {
  return `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
