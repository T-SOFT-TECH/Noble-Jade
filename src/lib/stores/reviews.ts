import { writable, derived, get } from "svelte/store";
import { pb } from "$lib/pocketbase";
import { auth } from "./auth";

export interface Review {
    id: string;
    user: string;
    booking: string;
    rating: number;
    title: string;
    comment: string;
    photos: string[];
    isPublic: boolean;
    createdAt: string;
    response?: string;
    responseDate?: string;
}

export interface ReviewState {
    reviews: Review[];
    isLoading: boolean;
    error: string | null;
}

function createReviewsStore() {
    const { subscribe, set, update } = writable<ReviewState>({
        reviews: [],
        isLoading: false,
        error: null,
    });

    return {
        subscribe,

        // Fetch user's reviews
        fetchUserReviews: async () => {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                const authState = get(auth);
                if (!authState.user) {
                    throw new Error("Not authenticated");
                }

                const records = await pb.collection("reviews").getFullList({
                    filter: `user = "${authState.user.id}"`,
                    sort: "-created",
                });

                update((state) => ({
                    ...state,
                    reviews: records as unknown as Review[],
                    isLoading: false,
                }));

                return { success: true };
            } catch (error: any) {
                update((state) => ({
                    ...state,
                    isLoading: false,
                    error: error.message || "Failed to fetch reviews",
                }));
                return { success: false, error: error.message };
            }
        },

        // Submit a new review
        submitReview: async (reviewData: {
            booking: string;
            rating: number;
            title: string;
            comment: string;
            photos?: File[];
            isPublic: boolean;
        }) => {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                const authState = get(auth);
                if (!authState.user) {
                    throw new Error("Not authenticated");
                }

                const formData = new FormData();
                formData.append("user", authState.user.id);
                formData.append("booking", reviewData.booking);
                formData.append("rating", reviewData.rating.toString());
                formData.append("title", reviewData.title);
                formData.append("comment", reviewData.comment);
                formData.append("isPublic", reviewData.isPublic.toString());

                // Add photos if any
                if (reviewData.photos) {
                    for (const photo of reviewData.photos) {
                        formData.append("photos", photo);
                    }
                }

                const record = await pb.collection("reviews").create(formData);

                update((state) => ({
                    ...state,
                    reviews: [record as unknown as Review, ...state.reviews],
                    isLoading: false,
                }));

                return { success: true, review: record };
            } catch (error: any) {
                update((state) => ({
                    ...state,
                    isLoading: false,
                    error: error.message || "Failed to submit review",
                }));
                return { success: false, error: error.message };
            }
        },

        // Clear store
        clear: () => {
            set({
                reviews: [],
                isLoading: false,
                error: null,
            });
        },
    };
}

export const reviews = createReviewsStore();

// Derived stores
export const averageRating = derived(reviews, ($reviews) => {
    if ($reviews.reviews.length === 0) return 0;
    const sum = $reviews.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / $reviews.reviews.length) * 10) / 10;
});
