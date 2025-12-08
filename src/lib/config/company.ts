/**
 * Company Contact Information
 * Centralized configuration for all contact details used across the app
 */

export interface Location {
    name: string;
    city: string;
    province: string;
    address: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    isPrimary?: boolean;
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

export const companyInfo: CompanyInfo = {
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
        },
        {
            name: "Vancouver Office",
            city: "Vancouver",
            province: "BC",
            address: "456 Granville Street, Unit 200",
            postalCode: "V6C 1T2",
            country: "Canada",
            phone: "+1 (604) 555-0456",
            email: "vancouver@noblejade.ca"
        },
        {
            name: "Montreal Office",
            city: "Montreal",
            province: "QC",
            address: "789 Rue Sainte-Catherine O, Bureau 300",
            postalCode: "H3B 1A2",
            country: "Canada",
            phone: "+1 (514) 555-0789",
            email: "montreal@noblejade.ca"
        },
        {
            name: "Calgary Office",
            city: "Calgary",
            province: "AB",
            address: "101 Stephen Avenue SW, Suite 500",
            postalCode: "T2P 4J9",
            country: "Canada",
            phone: "+1 (403) 555-0321",
            email: "calgary@noblejade.ca"
        }
    ]
};

// Helper to get primary location
export const getPrimaryLocation = (): Location => {
    return companyInfo.locations.find(loc => loc.isPrimary) || companyInfo.locations[0];
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
