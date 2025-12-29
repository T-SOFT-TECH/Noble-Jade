/**
 * User Dashboard Service
 * Functions for fetching user-specific data from PocketBase
 */

import { pb } from "$lib/pocketbase";

// Types
export interface UserStats {
    totalBookings: number;
    completedBookings: number;
    walletBalance: number;
    rewardPoints: number;
}

export interface UserBooking {
    id: string;
    customerName: string;
    customerEmail: string;
    serviceType: string;
    scheduledDate: string;
    timeSlot: string;
    status: string;
    total: number;
    created: string;
    expand?: {
        assignedStaff?: any[];
    };
}

export interface UserReview {
    id: string;
    booking: string;
    rating: number;
    title: string;
    comment: string;
    isPublic: boolean;
    response?: string;
    created: string;
    expand?: {
        booking?: UserBooking;
    };
}

/**
 * Get user dashboard stats
 */
export async function getUserStats(userId: string): Promise<UserStats> {
    try {
        // Get all user bookings to calculate stats
        const bookings = await pb.collection("bookings").getFullList({
            filter: `user = "${userId}"`,
        });

        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(
            (b) => b.status === "completed"
        ).length;

        // Get user record for wallet balance
        let walletBalance = 0;
        try {
            const user = await pb.collection("users").getOne(userId);
            walletBalance = user.walletBalance || 0;
        } catch {
            // User might not have wallet field
        }

        return {
            totalBookings,
            completedBookings,
            walletBalance,
            rewardPoints: 0, // TODO: Implement reward points system
        };
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return {
            totalBookings: 0,
            completedBookings: 0,
            walletBalance: 0,
            rewardPoints: 0,
        };
    }
}

/**
 * Get user's bookings with optional status filter
 */
export async function getUserBookings(
    userId: string,
    options?: {
        status?: string;
        limit?: number;
    }
): Promise<UserBooking[]> {
    try {
        let filter = `user = "${userId}"`;

        if (options?.status && options.status !== "all") {
            if (options.status === "upcoming") {
                // Upcoming = confirmed or pending, with future date
                const today = new Date().toISOString().split("T")[0];
                filter += ` && scheduledDate >= "${today}" && (status = "confirmed" || status = "pending" || status = "approved" || status = "assigned")`;
            } else if (options.status === "completed") {
                filter += ` && status = "completed"`;
            } else if (options.status === "cancelled") {
                filter += ` && status = "cancelled"`;
            } else {
                filter += ` && status = "${options.status}"`;
            }
        }

        const result = await pb.collection("bookings").getList(1, options?.limit || 50, {
            filter,
            sort: "-scheduledDate",
            expand: "assignedStaff",
        });

        return result.items as unknown as UserBooking[];
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return [];
    }
}

/**
 * Get recent bookings for dashboard
 */
export async function getRecentBookings(userId: string, limit = 5): Promise<UserBooking[]> {
    return getUserBookings(userId, { limit });
}

/**
 * Get user's reviews
 */
export async function getUserReviews(userId: string): Promise<UserReview[]> {
    try {
        const result = await pb.collection("reviews").getFullList({
            filter: `user = "${userId}"`,
            // sort removed - created field not available
            expand: "booking",
        });

        return result as unknown as UserReview[];
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        return [];
    }
}

/**
 * Get completed bookings that don't have a review yet
 */
export async function getPendingReviewBookings(userId: string): Promise<UserBooking[]> {
    try {
        // Get completed bookings
        const completedBookings = await pb.collection("bookings").getFullList({
            filter: `user = "${userId}" && status = "completed"`,
            // sort removed - created field not available
        });

        // Get user's reviews to find which bookings already have reviews
        const reviews = await pb.collection("reviews").getFullList({
            filter: `user = "${userId}"`,
        });

        const reviewedBookingIds = new Set(reviews.map((r) => r.booking));

        // Filter out bookings that already have reviews
        const pendingReviewBookings = completedBookings.filter(
            (b) => !reviewedBookingIds.has(b.id)
        );

        return pendingReviewBookings as unknown as UserBooking[];
    } catch (error) {
        console.error("Error fetching pending review bookings:", error);
        return [];
    }
}

/**
 * Submit a review for a booking
 */
export async function submitReview(
    userId: string,
    bookingId: string,
    data: {
        rating: number;
        title: string;
        comment: string;
        isPublic?: boolean;
    }
): Promise<UserReview | null> {
    try {
        const review = await pb.collection("reviews").create({
            user: userId,
            booking: bookingId,
            rating: data.rating,
            title: data.title,
            comment: data.comment,
            isPublic: data.isPublic ?? true,
        });

        return review as unknown as UserReview;
    } catch (error) {
        console.error("Error submitting review:", error);
        return null;
    }
}
