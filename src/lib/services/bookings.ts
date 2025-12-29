// Booking service with approval workflow
import { pb } from '$lib/pocketbase';
import { writable, get } from 'svelte/store';

export interface Booking {
    id: string;
    user: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceType: string;
    status: BookingStatus;
    total: number;
    scheduledDate: string;
    [key: string]: any;
}

export type BookingStatus =
    | 'pending_review'
    | 'admin_modified'
    | 'customer_confirmed'
    | 'approved'
    | 'paid'
    | 'assigned'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

// Create booking store
function createBookingStore() {
    const { subscribe, set, update } = writable<{
        bookings: Booking[];
        isLoading: boolean;
        error: string | null;
    }>({
        bookings: [],
        isLoading: false,
        error: null
    });

    return {
        subscribe,

        // Submit new booking (customer)
        async submitBooking(data: Partial<Booking>) {
            update(s => ({ ...s, isLoading: true, error: null }));
            try {
                const user = pb.authStore.model;
                const booking = await pb.collection('bookings').create({
                    ...data,
                    user: user?.id,
                    customerName: user?.name || data.customerName,
                    customerEmail: user?.email || data.customerEmail,
                    status: 'pending_review',
                    originalSubtotal: data.subtotal,
                    originalDiscount: data.discount,
                    originalTotal: data.total,
                    paymentStatus: 'pending',
                    currentStage: 0,
                });
                update(s => ({ ...s, isLoading: false }));
                return { success: true, booking };
            } catch (error: any) {
                update(s => ({ ...s, isLoading: false, error: error.message }));
                return { success: false, error: error.message };
            }
        },

        // Fetch user's bookings
        async fetchUserBookings(userId: string) {
            update(s => ({ ...s, isLoading: true }));
            try {
                const records = await pb.collection('bookings').getFullList({
                    filter: `user = "${userId}"`,
                    sort: '-created',
                    expand: 'assignedStaff'
                });
                update(s => ({ ...s, bookings: records as Booking[], isLoading: false }));
            } catch (error: any) {
                update(s => ({ ...s, isLoading: false, error: error.message }));
            }
        },

        // Fetch all bookings (admin)
        async fetchAllBookings() {
            update(s => ({ ...s, isLoading: true }));
            try {
                const records = await pb.collection('bookings').getFullList({
                    sort: '-created',
                    expand: 'user,assignedStaff'
                });
                update(s => ({ ...s, bookings: records as Booking[], isLoading: false }));
            } catch (error: any) {
                update(s => ({ ...s, isLoading: false, error: error.message }));
            }
        },

        // Admin: Approve booking directly (no modifications)
        async approveBooking(bookingId: string) {
            const admin = pb.authStore.model;
            return await pb.collection('bookings').update(bookingId, {
                status: 'approved',
                adminApprovedBy: admin?.id,
                adminApprovedAt: new Date().toISOString()
            });
        },

        // Admin: Modify booking and send to customer for confirmation
        async modifyBooking(bookingId: string, modifications: Partial<Booking>, notes: string) {
            const admin = pb.authStore.model;
            const currentBooking = await pb.collection('bookings').getOne(bookingId);

            return await pb.collection('bookings').update(bookingId, {
                ...modifications,
                status: 'admin_modified',
                proposedChanges: {
                    original: {
                        total: currentBooking.total,
                        scheduledDate: currentBooking.scheduledDate,
                        addons: currentBooking.addons,
                    },
                    modified: {
                        total: modifications.total,
                        scheduledDate: modifications.scheduledDate,
                        addons: modifications.addons,
                    }
                },
                customerVisibleNotes: notes,
                modifiedBy: admin?.id,
                modifiedAt: new Date().toISOString()
            });
        },

        // Customer: Accept modifications
        async acceptModifications(bookingId: string) {
            return await pb.collection('bookings').update(bookingId, {
                status: 'customer_confirmed',
                customerApprovedAt: new Date().toISOString()
            });
        },

        // Customer: Reject modifications
        async rejectModifications(bookingId: string, reason: string) {
            return await pb.collection('bookings').update(bookingId, {
                status: 'pending_review',
                customerRejectionReason: reason,
                proposedChanges: null
            });
        },

        // Admin: Final approval after customer confirms
        async finalApprove(bookingId: string) {
            const admin = pb.authStore.model;
            return await pb.collection('bookings').update(bookingId, {
                status: 'approved',
                adminApprovedBy: admin?.id,
                adminApprovedAt: new Date().toISOString()
            });
        },

        // Mark as paid
        async markAsPaid(bookingId: string, paymentId: string) {
            return await pb.collection('bookings').update(bookingId, {
                status: 'paid',
                paymentStatus: 'paid',
                paymentId,
                paidAt: new Date().toISOString()
            });
        },

        // Admin: Assign staff
        async assignStaff(bookingId: string, staffIds: string[]) {
            return await pb.collection('bookings').update(bookingId, {
                status: 'assigned',
                assignedStaff: staffIds,
                assignedAt: new Date().toISOString()
            });
        },

        // Staff: Start job
        async startJob(bookingId: string) {
            return await pb.collection('bookings').update(bookingId, {
                status: 'in_progress',
                currentStage: 1,
                jobStartedAt: new Date().toISOString()
            });
        },

        // Staff: Complete job
        async completeJob(bookingId: string) {
            return await pb.collection('bookings').update(bookingId, {
                status: 'completed',
                currentStage: 6,
                completedAt: new Date().toISOString()
            });
        },

        // Cancel booking
        async cancelBooking(bookingId: string, reason?: string) {
            return await pb.collection('bookings').update(bookingId, {
                status: 'cancelled',
                adminNotes: reason
            });
        }
    };
}

export const bookings = createBookingStore();

// Job progress service
export const jobProgress = {
    // Add progress update (staff only)
    async addProgress(data: {
        booking: string;
        stage: string;
        stageNumber: number;
        title: string;
        description?: string;
        photos?: File[];
    }) {
        const staff = pb.authStore.model;
        const formData = new FormData();

        formData.append('booking', data.booking);
        formData.append('staff', staff?.id || '');
        formData.append('stage', data.stage);
        formData.append('stageNumber', String(data.stageNumber));
        formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);

        // Add photos
        if (data.photos) {
            for (const photo of data.photos) {
                formData.append('photos', photo);
            }
        }

        const record = await pb.collection('job_progress').create(formData);

        // Update booking current stage
        await pb.collection('bookings').update(data.booking, {
            currentStage: data.stageNumber
        });

        return record;
    },

    // Get progress for booking
    async getProgress(bookingId: string) {
        return await pb.collection('job_progress').getFullList({
            filter: `booking = "${bookingId}"`,
            sort: 'created',
            expand: 'staff'
        });
    }
};
