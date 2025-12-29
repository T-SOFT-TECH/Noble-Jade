import { writable, derived, get } from "svelte/store";
import { pb } from "$lib/pocketbase";
import { auth } from "./auth";

export interface Referral {
    id: string;
    referrer: string;
    referredEmail: string;
    referredName: string;
    status: "pending" | "registered" | "completed" | "rewarded";
    reward: number;
    createdAt: string;
    completedAt?: string;
}

export interface ReferralState {
    referralCode: string;
    referrals: Referral[];
    totalEarnings: number;
    isLoading: boolean;
    error: string | null;
}

function generateReferralCode(userId: string): string {
    const prefix = "JADE";
    const suffix = userId.substring(0, 6).toUpperCase();
    return `${prefix}${suffix}`;
}

function createReferralsStore() {
    const { subscribe, set, update } = writable<ReferralState>({
        referralCode: "",
        referrals: [],
        totalEarnings: 0,
        isLoading: false,
        error: null,
    });

    return {
        subscribe,

        // Initialize referral code
        init: () => {
            const authState = get(auth);
            if (authState.user) {
                update((state) => ({
                    ...state,
                    referralCode: generateReferralCode(authState.user!.id),
                }));
            }
        },

        // Fetch user's referrals
        fetchReferrals: async () => {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                const authState = get(auth);
                if (!authState.user) {
                    throw new Error("Not authenticated");
                }

                const records = await pb.collection("referrals").getFullList({
                    filter: `referrer = "${authState.user.id}"`,
                    sort: "-created",
                });

                const referrals = records as unknown as Referral[];
                const totalEarnings = referrals
                    .filter((r) => r.status === "rewarded")
                    .reduce((sum, r) => sum + r.reward, 0);

                update((state) => ({
                    ...state,
                    referrals,
                    totalEarnings,
                    isLoading: false,
                }));

                return { success: true };
            } catch (error: any) {
                update((state) => ({
                    ...state,
                    isLoading: false,
                    error: error.message || "Failed to fetch referrals",
                }));
                return { success: false, error: error.message };
            }
        },

        // Send referral invite
        sendInvite: async (email: string, name: string) => {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                const authState = get(auth);
                if (!authState.user) {
                    throw new Error("Not authenticated");
                }

                const record = await pb.collection("referrals").create({
                    referrer: authState.user.id,
                    referredEmail: email,
                    referredName: name,
                    status: "pending",
                    reward: 25, // $25 reward per successful referral
                });

                update((state) => ({
                    ...state,
                    referrals: [record as unknown as Referral, ...state.referrals],
                    isLoading: false,
                }));

                return { success: true };
            } catch (error: any) {
                update((state) => ({
                    ...state,
                    isLoading: false,
                    error: error.message || "Failed to send invite",
                }));
                return { success: false, error: error.message };
            }
        },

        // Get referral link
        getReferralLink: () => {
            const state = get({ subscribe });
            return `${window.location.origin}/register?ref=${state.referralCode}`;
        },

        // Clear store
        clear: () => {
            set({
                referralCode: "",
                referrals: [],
                totalEarnings: 0,
                isLoading: false,
                error: null,
            });
        },
    };
}

export const referrals = createReferralsStore();

// Derived stores
export const pendingReferrals = derived(referrals, ($referrals) =>
    $referrals.referrals.filter((r) => r.status === "pending").length
);

export const completedReferrals = derived(referrals, ($referrals) =>
    $referrals.referrals.filter((r) => r.status === "rewarded").length
);
