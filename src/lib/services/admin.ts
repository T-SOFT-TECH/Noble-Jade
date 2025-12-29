// Admin service - centralized functions for admin panel data
import { pb } from '$lib/pocketbase';

// ==================== TYPES ====================

export interface DashboardStats {
    totalBookings: number;
    revenue: number;
    activeStaff: number;
    pendingReviews: number;
    bookingsChange: string;
    revenueChange: string;
}

export interface AdminBooking {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceType: string;
    scheduledDate: string;
    timeSlot: string;
    status: string;
    total: number;
    expand?: {
        user?: any;
        assignedStaff?: any[];
    };
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    created: string;
    verified: boolean;
    avatar?: string;
}

export interface StaffMember extends AdminUser {
    jobsCompleted: number;
    averageRating: number;
    status: 'active' | 'on-leave' | 'inactive';
}

// ==================== DASHBOARD ====================

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        // Get booking counts
        const allBookings = await pb.collection('bookings').getList(1, 1, {});
        const totalBookings = allBookings.totalItems;

        // Get this month's bookings for revenue calculation
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch completed/paid bookings and filter by date in code
        const allPaidBookings = await pb.collection('bookings').getFullList({
            filter: `status = "completed" || status = "paid"`,
        });

        // Filter by this month's date in JavaScript
        const monthBookings = allPaidBookings.filter(b => {
            const bookingDate = new Date(b.created || b.scheduledDate);
            return bookingDate >= firstOfMonth;
        });
        const revenue = monthBookings.reduce((sum, b) => sum + (b.total || 0), 0);

        // Get active staff count
        const staffResult = await pb.collection('users').getList(1, 1, {
            filter: 'role = "staff"',
        });
        const activeStaff = staffResult.totalItems;

        // Get pending reviews (bookings pending review)
        const pendingResult = await pb.collection('bookings').getList(1, 1, {
            filter: 'status = "pending_review"',
        });
        const pendingReviews = pendingResult.totalItems;

        return {
            totalBookings,
            revenue,
            activeStaff,
            pendingReviews,
            bookingsChange: '+12%', // TODO: Calculate from historical data
            revenueChange: '+8%',   // TODO: Calculate from historical data
        };
    } catch (error) {
        console.error('[admin.ts] Error fetching dashboard stats:', error);
        return {
            totalBookings: 0,
            revenue: 0,
            activeStaff: 0,
            pendingReviews: 0,
            bookingsChange: '0%',
            revenueChange: '0%',
        };
    }
}

export async function getRecentBookings(limit = 5): Promise<AdminBooking[]> {
    try {
        const result = await pb.collection('bookings').getList<AdminBooking>(1, limit, {
            sort: '-scheduledDate',
            // Note: expand removed as it can cause issues if relations don't exist
        });
        return result.items;
    } catch (error) {
        console.error('[admin.ts] Error fetching recent bookings:', error);
        return [];
    }
}

export async function getTopStaff(limit = 3): Promise<StaffMember[]> {
    try {
        // Get staff users
        const staffResult = await pb.collection('users').getFullList<AdminUser>({
            filter: 'role = "staff"',
        });

        // For each staff member, count their completed jobs
        const staffWithStats: StaffMember[] = await Promise.all(
            staffResult.map(async (staff) => {
                // Count completed bookings assigned to this staff
                const bookingsResult = await pb.collection('bookings').getList(1, 1, {
                    filter: `assignedStaff ~ "${staff.id}" && status = "completed"`,
                });

                // Get reviews for this staff (if reviews collection exists)
                let avgRating = 4.5; // Default rating
                try {
                    const reviews = await pb.collection('reviews').getFullList({
                        filter: `staff ~ "${staff.id}"`,
                    });
                    if (reviews.length > 0) {
                        avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
                    }
                } catch {
                    // Reviews collection might not exist or be empty
                }

                return {
                    ...staff,
                    jobsCompleted: bookingsResult.totalItems,
                    averageRating: Math.round(avgRating * 10) / 10,
                    status: 'active' as const,
                };
            })
        );

        // Sort by jobs completed and return top N
        return staffWithStats
            .sort((a, b) => b.jobsCompleted - a.jobsCompleted)
            .slice(0, limit);
    } catch (error) {
        console.error('[admin.ts] Error fetching top staff:', error);
        return [];
    }
}

// ==================== BOOKINGS ====================

export interface BookingFilters {
    status?: string;
    dateRange?: 'today' | 'week' | 'month' | 'all';
    search?: string;
}

export async function getAllBookings(
    page = 1,
    perPage = 20,
    filters: BookingFilters = {}
): Promise<{ items: AdminBooking[]; totalItems: number; totalPages: number }> {
    try {
        const filterParts: string[] = [];

        // Status filter
        if (filters.status && filters.status !== 'all') {
            filterParts.push(`status = "${filters.status}"`);
        }

        // Date range filter
        if (filters.dateRange && filters.dateRange !== 'all') {
            const now = new Date();
            let startDate: Date;

            switch (filters.dateRange) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                default:
                    startDate = new Date(0);
            }
            filterParts.push(`scheduledDate >= "${startDate.toISOString().split('T')[0]}"`);
        }

        // Search filter
        if (filters.search) {
            filterParts.push(`(customerName ~ "${filters.search}" || id ~ "${filters.search}")`);
        }

        const result = await pb.collection('bookings').getList<AdminBooking>(page, perPage, {
            sort: '-scheduledDate',
            // Note: expand removed as it can cause issues if relations don't exist
            filter: filterParts.length > 0 ? filterParts.join(' && ') : undefined,
        });

        return {
            items: result.items,
            totalItems: result.totalItems,
            totalPages: result.totalPages,
        };
    } catch (error) {
        console.error('[admin.ts] Error fetching bookings:', error);
        return { items: [], totalItems: 0, totalPages: 0 };
    }
}

export async function getBookingStats(): Promise<{
    today: number;
    thisWeek: number;
    pending: number;
    completed: number;
}> {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const [todayResult, weekResult, pendingResult, completedResult] = await Promise.all([
            pb.collection('bookings').getList(1, 1, { filter: `scheduledDate >= "${todayStart.split('T')[0]}"` }),
            pb.collection('bookings').getList(1, 1, { filter: `scheduledDate >= "${weekStart.split('T')[0]}"` }),
            pb.collection('bookings').getList(1, 1, { filter: 'status = "pending_review"' }),
            pb.collection('bookings').getList(1, 1, { filter: 'status = "completed"' }),
        ]);

        return {
            today: todayResult.totalItems,
            thisWeek: weekResult.totalItems,
            pending: pendingResult.totalItems,
            completed: completedResult.totalItems,
        };
    } catch (error) {
        console.error('[admin.ts] Error fetching booking stats:', error);
        return { today: 0, thisWeek: 0, pending: 0, completed: 0 };
    }
}

// ==================== USERS ====================

export async function getAllUsers(
    page = 1,
    perPage = 20,
    filters: { role?: string; search?: string } = {}
): Promise<{ items: AdminUser[]; totalItems: number; totalPages: number }> {
    try {
        const filterParts: string[] = [];

        if (filters.role && filters.role !== 'all') {
            filterParts.push(`role = "${filters.role}"`);
        }

        if (filters.search) {
            filterParts.push(`(name ~ "${filters.search}" || email ~ "${filters.search}")`);
        }

        const result = await pb.collection('users').getList<AdminUser>(page, perPage, {
            sort: 'name', // changed from -created
            filter: filterParts.length > 0 ? filterParts.join(' && ') : undefined,
        });

        return {
            items: result.items,
            totalItems: result.totalItems,
            totalPages: result.totalPages,
        };
    } catch (error) {
        console.error('[admin.ts] Error fetching users:', error);
        return { items: [], totalItems: 0, totalPages: 0 };
    }
}

export async function updateUser(userId: string, data: Partial<AdminUser>): Promise<AdminUser | null> {
    try {
        return await pb.collection('users').update<AdminUser>(userId, data);
    } catch (error) {
        console.error('[admin.ts] Error updating user:', error);
        return null;
    }
}

export async function deleteUser(userId: string): Promise<boolean> {
    try {
        await pb.collection('users').delete(userId);
        return true;
    } catch (error) {
        console.error('[admin.ts] Error deleting user:', error);
        return false;
    }
}

// ==================== STAFF ====================

export async function getAllStaff(): Promise<StaffMember[]> {
    try {
        const staffResult = await pb.collection('users').getFullList<AdminUser>({
            filter: 'role = "staff"',
            sort: 'name',
        });

        // Enrich with stats
        const staffWithStats: StaffMember[] = await Promise.all(
            staffResult.map(async (staff) => {
                const bookingsResult = await pb.collection('bookings').getList(1, 1, {
                    filter: `assignedStaff ~ "${staff.id}" && status = "completed"`,
                });

                let avgRating = 4.5;
                try {
                    const reviews = await pb.collection('reviews').getFullList({
                        filter: `staff ~ "${staff.id}"`,
                    });
                    if (reviews.length > 0) {
                        avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
                    }
                } catch {
                    // Reviews collection might not exist
                }

                return {
                    ...staff,
                    jobsCompleted: bookingsResult.totalItems,
                    averageRating: Math.round(avgRating * 10) / 10,
                    status: 'active' as const, // TODO: Add status field to users
                };
            })
        );

        return staffWithStats;
    } catch (error) {
        console.error('[admin.ts] Error fetching staff:', error);
        return [];
    }
}

export async function createStaffMember(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
}): Promise<AdminUser | null> {
    try {
        const result = await pb.collection('users').create<AdminUser>({
            ...data,
            passwordConfirm: data.password,
            role: 'staff',
            emailVisibility: true,
        });
        return result;
    } catch (error: any) {
        console.error('[admin.ts] Error creating staff:', error);
        // Extract meaningful error message from PocketBase error
        const message = error?.response?.data?.email?.message
            || error?.response?.data?.password?.message
            || error?.response?.data?.name?.message
            || error?.response?.message
            || error?.message
            || 'Failed to create staff member';
        throw new Error(message);
    }
}

// ==================== CALCULATOR SETTINGS ====================

export interface CalculatorSetting {
    id: string;
    key: string;
    label: string;
    value: number;
    category: 'base_prices' | 'space_rates' | 'addons' | 'discounts';
    description: string;
    sortOrder: number;
}

export async function getCalculatorSettings(): Promise<CalculatorSetting[]> {
    try {
        const records = await pb.collection('calculator_settings').getFullList<CalculatorSetting>({
            sort: 'category,sortOrder',
        });
        return records;
    } catch (error) {
        console.error('[admin.ts] Error fetching calculator settings:', error);
        return [];
    }
}

export async function getCalculatorSettingsMap(): Promise<Record<string, number>> {
    try {
        const records = await pb.collection('calculator_settings').getFullList<CalculatorSetting>({
            fields: 'key,value',
        });
        const map: Record<string, number> = {};
        for (const record of records) {
            map[record.key] = record.value;
        }
        return map;
    } catch (error) {
        console.error('[admin.ts] Error fetching calculator settings map:', error);
        return {};
    }
}

export async function updateCalculatorSetting(id: string, value: number): Promise<CalculatorSetting | null> {
    try {
        return await pb.collection('calculator_settings').update<CalculatorSetting>(id, { value });
    } catch (error: any) {
        console.error('[admin.ts] Error updating calculator setting:', error);
        throw new Error(error?.message || 'Failed to update setting');
    }
}
