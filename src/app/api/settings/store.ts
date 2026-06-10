import fs from 'fs';
import path from 'path';

// Define the shape of our settings
export interface StoreSettings {
  storeName: string;
  tagline: string;
  currency: string;
  whatsapp: string;
  email: string;
  location: string;
  brandColor: string;
  font: string;
  style: string;
  newOrderAlerts: string;
  campaignExpiry: string;
  lowStockAlerts: string;
  // About Page
  aboutTitle: string;
  aboutSubtitle: string;
  aboutStory: string;
  aboutQuote: string;
  // Contact Page
  contactTitle: string;
  contactSubtitle: string;
}

const defaultSettings: StoreSettings = {
  storeName: 'Mensah',
  tagline: 'Luxury Tailored Menswear',
  currency: 'GHS (Ghanaian Cedi)',
  whatsapp: '+233 59 269 6949',
  email: 'info@mensah.com',
  location: '123 Savile Row, London, W1S 3PR',
  brandColor: '#B8860B (Luxury Gold)',
  font: 'Playfair Display / Inter',
  style: 'Luxury Minimalist',
  newOrderAlerts: 'WhatsApp redirect',
  campaignExpiry: 'Auto-status update',
  lowStockAlerts: 'Dashboard indicator',
  aboutTitle: 'The Heritage of Mensah',
  aboutSubtitle: 'Born from a passion for exquisite tailoring, Mensah represents the pinnacle of luxury menswear.',
  aboutStory: 'Our master tailors bring decades of experience to every cut, stitch, and finish. We source only the finest fabrics from world-renowned mills.',
  aboutQuote: 'We don\'t just make clothes. We create confidence, preserve culture, and craft legacy.',
  contactTitle: 'Contact Us',
  contactSubtitle: 'Whether you are looking to schedule a fitting, inquire about our bespoke services, or simply say hello, our team is here to assist you.',
};

export const getSettingsPath = () => {
  if (process.env.VERCEL) {
    return path.join('/tmp', 'settings-data.json');
  }
  return path.join(process.cwd(), 'settings-data.json');
};

export const getSettings = (): StoreSettings => {
  const settingsPath = getSettingsPath();
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error('Error reading settings store:', error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: StoreSettings) => {
  const settingsPath = getSettingsPath();
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing settings store:', error);
    return false;
  }
};
