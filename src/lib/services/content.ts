// Content service - fetch FAQs, testimonials, blog posts, pricing packages, services from PocketBase
import { pb } from '$lib/pocketbase';

// ==================== SERVICES ====================

export interface Service {
    id: string;
    name: string;
    slug: string;
    description: string;
    longDescription?: string;
    basePrice: number;
    icon?: string;
    image?: string;
    isActive: boolean;
    isPopular: boolean;
    sortOrder: number;
    features?: string[];
}

export async function getServices(): Promise<Service[]> {
    try {
        return await pb.collection('services').getFullList<Service>({
            filter: 'isActive = true',
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

export async function getPopularServices(): Promise<Service[]> {
    try {
        return await pb.collection('services').getFullList<Service>({
            filter: 'isActive = true && isPopular = true',
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching popular services:', error);
        return [];
    }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
    try {
        return await pb.collection('services').getFirstListItem<Service>(`slug = "${slug}"`);
    } catch (error) {
        console.error('Error fetching service by slug:', error);
        return null;
    }
}

export function getServiceImageUrl(service: Service): string {
    if (!service.image) return '/images/service-placeholder.jpg';
    return pb.files.getUrl(service, service.image);
}

// ==================== FAQs ====================

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    sortOrder: number;
    isActive: boolean;
}

export async function getFaqs(): Promise<FAQ[]> {
    try {
        return await pb.collection('faqs').getFullList<FAQ>({
            filter: 'isActive = true',
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }
}

export async function getFaqsByCategory(category: string): Promise<FAQ[]> {
    try {
        return await pb.collection('faqs').getFullList<FAQ>({
            filter: `isActive = true && category = "${category}"`,
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching FAQs by category:', error);
        return [];
    }
}

// ==================== TESTIMONIALS ====================

export interface Testimonial {
    id: string;
    quote: string;
    name: string;
    role: string;
    image?: string;
    rating: number;
    isFeatured: boolean;
    isActive: boolean;
    sortOrder: number;
}

export async function getTestimonials(): Promise<Testimonial[]> {
    try {
        return await pb.collection('testimonials').getFullList<Testimonial>({
            filter: 'isActive = true',
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
    try {
        return await pb.collection('testimonials').getFullList<Testimonial>({
            filter: 'isActive = true && isFeatured = true',
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching featured testimonials:', error);
        return [];
    }
}

// Get image URL for testimonial
export function getTestimonialImageUrl(testimonial: Testimonial): string {
    if (!testimonial.image) return '/images/default-avatar.jpg';
    return pb.files.getUrl(testimonial, testimonial.image);
}

// ==================== BLOG ====================

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    image?: string;
    author?: string;
    categories?: string[];
    tags?: string[];
    publishedAt?: string;
    isPublished: boolean;
    isFeatured: boolean;
    views: number;
    expand?: {
        author?: any;
        categories?: BlogCategory[];
    };
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
    try {
        return await pb.collection('blog_categories').getFullList<BlogCategory>({
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        return [];
    }
}

export async function getBlogPosts(page = 1, perPage = 10): Promise<{ items: BlogPost[]; totalPages: number }> {
    try {
        const result = await pb.collection('blog_posts').getList<BlogPost>(page, perPage, {
            filter: 'isPublished = true',
            sort: '-publishedAt',
            expand: 'author,categories',
        });
        return { items: result.items, totalPages: result.totalPages };
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return { items: [], totalPages: 0 };
    }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const post = await pb.collection('blog_posts').getFirstListItem<BlogPost>(
            `slug = "${slug}"`,
            { expand: 'author,categories' }
        );
        // Increment view count
        await pb.collection('blog_posts').update(post.id, { views: (post.views || 0) + 1 });
        return post;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
    try {
        return await pb.collection('blog_posts').getFullList<BlogPost>({
            filter: 'isPublished = true && isFeatured = true',
            sort: '-publishedAt',
            expand: 'author,categories',
        });
    } catch (error) {
        console.error('Error fetching featured posts:', error);
        return [];
    }
}

export function getBlogImageUrl(post: BlogPost): string {
    if (!post.image) return '/images/blog-placeholder.jpg';
    return pb.files.getUrl(post, post.image);
}

// ==================== PRICING PACKAGES ====================

export interface PricingPackage {
    id: string;
    name: string;
    label: string;
    description: string;
    price: number;
    priceNote: string;
    features: string[];
    isPopular: boolean;
    isActive: boolean;
    sortOrder: number;
}

export async function getPricingPackages(): Promise<PricingPackage[]> {
    try {
        return await pb.collection('pricing_packages').getFullList<PricingPackage>({
            filter: 'isActive = true',
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching pricing packages:', error);
        return [];
    }
}

// ==================== STATISTICS ====================

export interface Statistic {
    id: string;
    key: string;
    value: string;
    label: string;
    icon: string;
    sortOrder: number;
}

export async function getStatistics(): Promise<Statistic[]> {
    try {
        return await pb.collection('statistics').getFullList<Statistic>({
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return [];
    }
}

// ==================== SERVICE AREAS ====================

export interface ServiceArea {
    id: string;
    name: string;
    region: string;
    isActive: boolean;
    sortOrder: number;
}

export async function getServiceAreas(): Promise<ServiceArea[]> {
    try {
        return await pb.collection('service_areas').getFullList<ServiceArea>({
            filter: 'isActive = true',
            sort: 'sortOrder',
        });
    } catch (error) {
        console.error('Error fetching service areas:', error);
        return [];
    }
}
