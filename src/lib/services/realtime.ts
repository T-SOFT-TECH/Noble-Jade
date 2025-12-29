// Realtime subscription service for ALL PocketBase collections
import { pb } from '$lib/pocketbase';
import { writable, type Writable } from 'svelte/store';

export interface RealtimeSubscription {
    unsubscribe: () => void;
}

// Generic subscribe to any collection
export function subscribeToCollection(
    collection: string,
    callback: (data: any, action: string) => void,
    filter?: string
): RealtimeSubscription {
    pb.collection(collection).subscribe('*', (e) => {
        callback(e.record, e.action);
    });

    return {
        unsubscribe: () => {
            pb.collection(collection).unsubscribe('*');
        }
    };
}

// Subscribe to a specific record
export function subscribeToRecord(
    collection: string,
    recordId: string,
    callback: (data: any) => void
): RealtimeSubscription {
    pb.collection(collection).subscribe(recordId, (e) => {
        callback(e.record);
    });

    return {
        unsubscribe: () => {
            pb.collection(collection).unsubscribe(recordId);
        }
    };
}

// ==================== BOOKINGS ====================
export function subscribeToBooking(bookingId: string, callback: (data: any) => void) {
    return subscribeToRecord('bookings', bookingId, callback);
}

export function subscribeToAllBookings(callback: (data: any, action: string) => void) {
    return subscribeToCollection('bookings', callback);
}

export function subscribeToUserBookings(userId: string, callback: (data: any, action: string) => void) {
    return subscribeToCollection('bookings', (data, action) => {
        if (data.user === userId) callback(data, action);
    });
}

// ==================== JOB PROGRESS ====================
export function subscribeToJobProgress(bookingId: string, callback: (data: any, action: string) => void) {
    return subscribeToCollection('job_progress', (data, action) => {
        if (data.booking === bookingId) callback(data, action);
    });
}

// ==================== USERS ====================
export function subscribeToUsers(callback: (data: any, action: string) => void) {
    return subscribeToCollection('users', callback);
}

export function subscribeToUser(userId: string, callback: (data: any) => void) {
    return subscribeToRecord('users', userId, callback);
}

// ==================== REVIEWS ====================
export function subscribeToReviews(callback: (data: any, action: string) => void) {
    return subscribeToCollection('reviews', callback);
}

export function subscribeToUserReviews(userId: string, callback: (data: any, action: string) => void) {
    return subscribeToCollection('reviews', (data, action) => {
        if (data.user === userId) callback(data, action);
    });
}

// ==================== REFERRALS ====================
export function subscribeToReferrals(callback: (data: any, action: string) => void) {
    return subscribeToCollection('referrals', callback);
}

export function subscribeToUserReferrals(userId: string, callback: (data: any, action: string) => void) {
    return subscribeToCollection('referrals', (data, action) => {
        if (data.referrer === userId) callback(data, action);
    });
}

// ==================== WALLET TRANSACTIONS ====================
export function subscribeToWalletTransactions(userId: string, callback: (data: any, action: string) => void) {
    return subscribeToCollection('wallet_transactions', (data, action) => {
        if (data.user === userId) callback(data, action);
    });
}

// ==================== SERVICES ====================
export function subscribeToServices(callback: (data: any, action: string) => void) {
    return subscribeToCollection('services', callback);
}

// ==================== ADDONS ====================
export function subscribeToAddons(callback: (data: any, action: string) => void) {
    return subscribeToCollection('addons', callback);
}

// ==================== PROMO CODES ====================
export function subscribeToPromoCodes(callback: (data: any, action: string) => void) {
    return subscribeToCollection('promo_codes', callback);
}

// ==================== REACTIVE STORE FACTORIES ====================

// Create a reactive store for a single record
export function createRealtimeRecordStore<T>(collection: string, recordId: string, expand?: string) {
    const { subscribe, set }: Writable<T | null> = writable(null);
    let subscription: RealtimeSubscription | null = null;

    async function init() {
        try {
            const record = await pb.collection(collection).getOne(recordId, { expand });
            set(record as T);
            subscription = subscribeToRecord(collection, recordId, (data) => set(data as T));
        } catch (error) {
            console.error(`Error fetching ${collection}/${recordId}:`, error);
        }
    }

    function destroy() {
        subscription?.unsubscribe();
    }

    return { subscribe, init, destroy, set };
}

// Create a reactive store for a list of records
export function createRealtimeListStore<T>(
    collection: string,
    options?: { filter?: string; sort?: string; expand?: string }
) {
    const { subscribe, set, update }: Writable<T[]> = writable([]);
    let subscription: RealtimeSubscription | null = null;

    async function init() {
        try {
            const records = await pb.collection(collection).getFullList({
                filter: options?.filter,
                sort: options?.sort, // removed default -created
                expand: options?.expand
            });
            set(records as T[]);

            subscription = subscribeToCollection(collection, (data, action) => {
                update(items => {
                    if (action === 'create') {
                        // Check if matches filter (simple check)
                        return [data as T, ...items];
                    } else if (action === 'update') {
                        return items.map(item => (item as any).id === data.id ? data as T : item);
                    } else if (action === 'delete') {
                        return items.filter(item => (item as any).id !== data.id);
                    }
                    return items;
                });
            });
        } catch (error) {
            console.error(`Error fetching ${collection}:`, error);
        }
    }

    function destroy() {
        subscription?.unsubscribe();
    }

    return { subscribe, init, destroy, set, update };
}

// Convenience store creators
export const createRealtimeBookingStore = (id: string) =>
    createRealtimeRecordStore('bookings', id, 'user,assignedStaff');

export const createRealtimeProgressStore = (bookingId: string) =>
    createRealtimeListStore('job_progress', { filter: `booking = "${bookingId}"`, expand: 'staff' });

export const createRealtimeUsersStore = () =>
    createRealtimeListStore('users');

export const createRealtimeReviewsStore = (filter?: string) =>
    createRealtimeListStore('reviews', { filter, expand: 'user,booking' });

export const createRealtimeServicesStore = () =>
    createRealtimeListStore('services', { sort: 'sortOrder' });

export const createRealtimeAddonsStore = () =>
    createRealtimeListStore('addons', { sort: 'sortOrder' });
