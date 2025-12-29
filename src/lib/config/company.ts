/**
 * Company Contact Information
 * Uses data from server-side load (fetched from PocketBase)
 * Falls back to hardcoded defaults if data not available
 */

import { getContext, setContext } from 'svelte';

export interface Location {
    id?: string;
    name: string;
    city: string;
    province: string;
    address: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    isPrimary?: boolean;
    sortOrder?: number;
    isActive?: boolean;
}

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
    locations: Location[];
}

// Default values (fallback if database unavailable)
export const defaultCompanyInfo: CompanyInfo = {
    name: "Noble Jade Janitorial Services",
    shortName: "NJJS",
    tagline: "Professional Cleaning Services You Can Trust",
    email: "info@noblejade.ca",
    phone: "+1 (416) 555-01233",
    tollFree: "1-800-555-JADE",
    website: "https://noblejade.ca",
    socialLinks: {
        facebook: "https://facebook.com/noblejadejanitorial",
        instagram: "https://instagram.com/noblejadejanitorial",
        twitter: "https://twitter.com/noblejadeca",
        linkedin: "https://linkedin.com/company/noble-jade-janitorial"
    },
    businessHours: {
        weekdays: "8:00 AM – 6:00 PM",
        saturday: "9:00 AM – 4:00 PM",
        sunday: "Closed"
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
    ]
};

// For backward compatibility - this will be overwritten by page data
export let companyInfo: CompanyInfo = defaultCompanyInfo;

// Set company info from page data (called from +layout.svelte)
export function setCompanyInfo(data: CompanyInfo) {
    companyInfo = data;
}

// Helper to get primary location
export const getPrimaryLocation = (): Location => {
    return companyInfo.locations.find(loc => loc.isPrimary) || companyInfo.locations[0] || defaultCompanyInfo.locations[0];
};

// Helper to format phone for tel: links
export const formatPhoneForLink = (phone: string): string => {
    return phone.replace(/[\s\-\(\)]/g, '');
};

// Helper to format full address
export const formatFullAddress = (location: Location): string => {
    return `${location.address}, ${location.city}, ${location.province} ${location.postalCode}, ${location.country}`;
};

export default companyInfo;
