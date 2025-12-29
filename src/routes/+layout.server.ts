// Root layout server load - fetch company info for all pages
import type { LayoutServerLoad } from './$types';

// Always use localhost for server-side fetch since it runs on the same machine
const POCKETBASE_URL = 'http://127.0.0.1:8090';

export const load: LayoutServerLoad = async ({ fetch }) => {
    try {
        console.log('[+layout.server.ts] Fetching settings from:', `${POCKETBASE_URL}/api/collections/settings/records`);

        // Fetch settings
        const settingsRes = await fetch(`${POCKETBASE_URL}/api/collections/settings/records?perPage=100`);

        if (!settingsRes.ok) {
            console.error('[+layout.server.ts] Settings fetch failed:', settingsRes.status, settingsRes.statusText);
            throw new Error(`Settings fetch failed: ${settingsRes.status}`);
        }

        const settingsData = await settingsRes.json();
        console.log('[+layout.server.ts] Settings data received:', settingsData.items?.length || 0, 'items');

        const settings: Record<string, any> = {};
        if (settingsData.items) {
            for (const record of settingsData.items) {
                settings[record.key] = record.value;
            }
        }

        // Fetch locations
        const locationsRes = await fetch(`${POCKETBASE_URL}/api/collections/locations/records?filter=(isActive=true)&sort=sortOrder`);

        if (!locationsRes.ok) {
            console.error('[+layout.server.ts] Locations fetch failed:', locationsRes.status, locationsRes.statusText);
        }

        const locationsData = await locationsRes.json();
        console.log('[+layout.server.ts] Locations data received:', locationsData.items?.length || 0, 'items');

        const locations = locationsData.items?.map((loc: any) => ({
            id: loc.id,
            name: loc.name,
            city: loc.city,
            province: loc.province,
            address: loc.address,
            postalCode: loc.postalCode,
            country: loc.country || 'Canada',
            phone: loc.phone,
            email: loc.email,
            isPrimary: loc.isPrimary,
            sortOrder: loc.sortOrder,
            isActive: loc.isActive,
        })) || [];

        const companyInfo = {
            name: settings.company_name || "Noble Jade Janitorial Services",
            shortName: settings.company_short_name || "NJJS",
            tagline: settings.company_tagline || "Professional Cleaning Services You Can Trust",
            email: settings.contact_email || "info@noblejade.ca",
            phone: settings.contact_phone || "+1 (416) 555-0123",
            tollFree: settings.toll_free || "1-800-555-JADE",
            website: settings.website_url || "https://noblejade.ca",
            socialLinks: {
                facebook: settings.social_facebook || "https://facebook.com/noblejadejanitorial",
                instagram: settings.social_instagram || "https://instagram.com/noblejadejanitorial",
                twitter: settings.social_twitter || "https://twitter.com/noblejadeca",
                linkedin: settings.social_linkedin || "https://linkedin.com/company/noble-jade-janitorial",
            },
            businessHours: {
                weekdays: settings.hours_weekdays || "8:00 AM – 6:00 PM",
                saturday: settings.hours_saturday || "9:00 AM – 4:00 PM",
                sunday: settings.hours_sunday || "Closed",
            },
            locations: locations.length > 0 ? locations : [
                {
                    name: "Head Office",
                    city: "Toronto",
                    province: "ON",
                    address: "123 Yonge Street, Suite 400",
                    postalCode: "M5C 1W4",
                    country: "Canada",
                    phone: "+1 (416) 555-0123",
                    email: "toronto@noblejade.ca",
                    isPrimary: true
                }
            ],
        };

        console.log('[+layout.server.ts] Returning companyInfo with phone:', companyInfo.phone);

        return { companyInfo };
    } catch (error) {
        console.error('[+layout.server.ts] Error loading company info:', error);
        // Return defaults on error
        return {
            companyInfo: {
                name: "Noble Jade Janitorial Services",
                shortName: "NJJS",
                tagline: "Professional Cleaning Services You Can Trust",
                email: "info@noblejade.ca",
                phone: "+1 (416) 555-0123",
                tollFree: "1-800-555-JADE",
                website: "https://noblejade.ca",
                socialLinks: {
                    facebook: "https://facebook.com/noblejadejanitorial",
                    instagram: "https://instagram.com/noblejadejanitorial",
                    twitter: "https://twitter.com/noblejadeca",
                    linkedin: "https://linkedin.com/company/noble-jade-janitorial",
                },
                businessHours: {
                    weekdays: "8:00 AM – 6:00 PM",
                    saturday: "9:00 AM – 4:00 PM",
                    sunday: "Closed",
                },
                locations: [
                    {
                        name: "Head Office",
                        city: "Toronto",
                        province: "ON",
                        address: "123 Yonge Street, Suite 400",
                        postalCode: "M5C 1W4",
                        country: "Canada",
                        phone: "+1 (416) 555-0123",
                        email: "toronto@noblejade.ca",
                        isPrimary: true
                    }
                ],
            }
        };
    }
};
