import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from './store';

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to get settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...updates };
    
    if (saveSettings(newSettings)) {
      return NextResponse.json(newSettings);
    } else {
      throw new Error('Failed to save to store');
    }
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
