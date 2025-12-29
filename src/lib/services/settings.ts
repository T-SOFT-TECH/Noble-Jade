// Settings service - fetch and update site settings from PocketBase
import { pb } from '$lib/pocketbase';
import { writable, type Writable } from 'svelte/store';

export interface Setting {
    id: string;
    key: string;
    value: any;
    category: string;
    label: string;
    description?: string;
}

export interface Location {
    id: string;
    name: string;
    city: string;
    province: string;
    address: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    isPrimary: boolean;
    sortOrder: number;
    isActive: boolean;
}

// Cache for settings
let settingsCache: Map<string, any> = new Map();
let cacheLoaded = false;

// Load all settings into cache
export async function loadSettings(): Promise<Map<string, any>> {
    if (cacheLoaded) return settingsCache;

    try {
        const records = await pb.collection('settings').getFullList<Setting>();
        settingsCache = new Map();
        for (const record of records) {
            settingsCache.set(record.key, record.value);
        }
        cacheLoaded = true;
    } catch (error: any) {
        console.error('Error loading settings:', error);
        throw new Error(error?.message || 'Failed to load settings');
    }
    return settingsCache;
}

// Get a single setting value
export async function getSetting(key: string, defaultValue: any = null): Promise<any> {
    await loadSettings();
    return settingsCache.get(key) ?? defaultValue;
}

// Get multiple settings by keys
export async function getSettings(keys: string[]): Promise<Record<string, any>> {
    await loadSettings();
    const result: Record<string, any> = {};
    for (const key of keys) {
        result[key] = settingsCache.get(key) ?? null;
    }
    return result;
}

// Get all settings by category
export async function getSettingsByCategory(category: string): Promise<Setting[]> {
    try {
        return await pb.collection('settings').getFullList<Setting>({
            filter: `category = "${category}"`,
            sort: 'key',
        });
    } catch (error: any) {
        console.error('Error fetching settings by category:', error);
        throw new Error(error?.message || 'Failed to fetch settings');
    }
}

// Update a setting
export async function updateSetting(key: string, value: any): Promise<void> {
    try {
        const existing = await pb.collection('settings').getFirstListItem<Setting>(`key = "${key}"`);
        await pb.collection('settings').update(existing.id, { value });
        settingsCache.set(key, value);
    } catch (error: any) {
        console.error('Error updating setting:', error);
        throw new Error(error?.message || `Failed to update setting: ${key}`);
    }
}

// Bulk update settings
export async function updateSettings(updates: Record<string, any>): Promise<void> {
    const errors: string[] = [];

    for (const [key, value] of Object.entries(updates)) {
        try {
            await updateSetting(key, value);
        } catch (error: any) {
            errors.push(`${key}: ${error.message}`);
        }
    }

    if (errors.length > 0) {
        throw new Error(`Failed to update some settings:\n${errors.join('\n')}`);
    }
}

// ==================== LOCATIONS ====================

export async function getLocations(): Promise<Location[]> {
    try {
        return await pb.collection('locations').getFullList<Location>({
            filter: 'isActive = true',
            sort: 'sortOrder',
        });
    } catch (error: any) {
        console.error('Error fetching locations:', error);
        throw new Error(error?.message || 'Failed to fetch locations');
    }
}

export async function getAllLocations(): Promise<Location[]> {
    try {
        return await pb.collection('locations').getFullList<Location>({
            sort: 'sortOrder',
        });
    } catch (error: any) {
        console.error('Error fetching all locations:', error);
        throw new Error(error?.message || 'Failed to fetch locations');
    }
}

export async function getPrimaryLocation(): Promise<Location | null> {
    try {
        return await pb.collection('locations').getFirstListItem<Location>('isPrimary = true');
    } catch (error: any) {
        // Not finding a primary location is not an error
        if (error?.status === 404) return null;
        throw new Error(error?.message || 'Failed to fetch primary location');
    }
}

export async function createLocation(data: Partial<Location>): Promise<Location> {
    try {
        return await pb.collection('locations').create<Location>(data);
    } catch (error: any) {
        console.error('Error creating location:', error);
        throw new Error(error?.message || 'Failed to create location');
    }
}

export async function updateLocation(id: string, data: Partial<Location>): Promise<Location> {
    try {
        return await pb.collection('locations').update<Location>(id, data);
    } catch (error: any) {
        console.error('Error updating location:', error);
        throw new Error(error?.message || 'Failed to update location');
    }
}

export async function deleteLocation(id: string): Promise<void> {
    try {
        await pb.collection('locations').delete(id);
    } catch (error: any) {
        console.error('Error deleting location:', error);
        throw new Error(error?.message || 'Failed to delete location');
    }
}

// ==================== COMPANY INFO HELPER ====================

export interface CompanyInfo {
    name: string;
    shortName: string;
    tagline: string;
    email: string;
    phone: string;
    tollFree?: string;
    website: string;
    socialLinks: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };
    businessHours: {
        weekdays: string;
        saturday: string;
        sunday: string;
    };
}

export async function getCompanyInfo(): Promise<CompanyInfo> {
    const settings = await getSettings([
        'company_name', 'company_short_name', 'company_tagline', 'website_url',
        'contact_email', 'contact_phone', 'toll_free',
        'social_facebook', 'social_instagram', 'social_twitter', 'social_linkedin',
        'hours_weekdays', 'hours_saturday', 'hours_sunday',
    ]);

    return {
        name: settings.company_name || 'Noble Jade Janitorial Services',
        shortName: settings.company_short_name || 'NJJS',
        tagline: settings.company_tagline || 'Professional Cleaning Services You Can Trust',
        email: settings.contact_email || 'info@noblejade.ca',
        phone: settings.contact_phone || '+1 (416) 555-0123',
        tollFree: settings.toll_free || '',
        website: settings.website_url || 'https://noblejade.ca',
        socialLinks: {
            facebook: settings.social_facebook || '',
            instagram: settings.social_instagram || '',
            twitter: settings.social_twitter || '',
            linkedin: settings.social_linkedin || '',
        },
        businessHours: {
            weekdays: settings.hours_weekdays || '8:00 AM – 6:00 PM',
            saturday: settings.hours_saturday || '9:00 AM – 4:00 PM',
            sunday: settings.hours_sunday || 'Closed',
        },
    };
}

// Clear cache (call after updates)
export function clearSettingsCache() {
    settingsCache = new Map();
    cacheLoaded = false;
}
