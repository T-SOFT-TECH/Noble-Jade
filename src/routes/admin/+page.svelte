<script lang="ts">
    // Admin Dashboard Home - Real Data
    import { onMount } from "svelte";
    import {
        getDashboardStats,
        getRecentBookings,
        getTopStaff,
        type DashboardStats,
        type AdminBooking,
        type StaffMember,
    } from "$lib/services/admin";

    // Reactive state
    let isLoading = $state(true);
    let dashboardStats = $state<DashboardStats | null>(null);
    let recentBookings = $state<AdminBooking[]>([]);
    let topStaff = $state<StaffMember[]>([]);

    // Computed stats for display
    const stats = $derived(() => {
        if (!dashboardStats) return [];
        return [
            {
                label: "Total Bookings",
                value: dashboardStats.totalBookings.toLocaleString(),
                change: dashboardStats.bookingsChange,
                trend: dashboardStats.bookingsChange.startsWith("+")
                    ? "up"
                    : dashboardStats.bookingsChange.startsWith("-")
                      ? "down"
                      : "neutral",
                color: "purple",
            },
            {
                label: "Revenue (MTD)",
                value: `$${dashboardStats.revenue.toLocaleString()}`,
                change: dashboardStats.revenueChange,
                trend: dashboardStats.revenueChange.startsWith("+")
                    ? "up"
                    : dashboardStats.revenueChange.startsWith("-")
                      ? "down"
                      : "neutral",
                color: "green",
            },
            {
                label: "Active Staff",
                value: dashboardStats.activeStaff.toString(),
                change: "0",
                trend: "neutral",
                color: "blue",
            },
            {
                label: "Pending Reviews",
                value: dashboardStats.pendingReviews.toString(),
                change:
                    dashboardStats.pendingReviews > 0
                        ? `-${dashboardStats.pendingReviews}`
                        : "0",
                trend: dashboardStats.pendingReviews > 0 ? "down" : "neutral",
                color: "yellow",
            },
        ];
    });

    const statusColors: Record<string, string> = {
        pending_review: "#eab308",
        pending: "#eab308",
        confirmed: "#3b82f6",
        admin_modified: "#8b5cf6",
        customer_confirmed: "#06b6d4",
        approved: "#3b82f6",
        paid: "#10b981",
        assigned: "#6366f1",
        in_progress: "#a855f7",
        "in-progress": "#a855f7",
        completed: "#22c55e",
        cancelled: "#ef4444",
    };

    // Format date for display
    function formatDate(dateStr: string): string {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    // Format status for display
    function formatStatus(status: string): string {
        return status.replace(/_/g, " ").replace(/-/g, " ");
    }

    // Get initials from name
    function getInitials(name: string): string {
        if (!name) return "??";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    // Load data on mount
    onMount(async () => {
        try {
            const [statsData, bookingsData, staffData] = await Promise.all([
                getDashboardStats(),
                getRecentBookings(5),
                getTopStaff(3),
            ]);
            dashboardStats = statsData;
            recentBookings = bookingsData;
            topStaff = staffData;
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="admin-dashboard">
    <div class="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
    </div>

    {#if isLoading}
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading dashboard...</p>
        </div>
    {:else}
        <!-- Stats Grid -->
        <div class="stats-grid">
            {#each stats() as stat}
                <div class="stat-card {stat.color}">
                    <div class="stat-header">
                        <span class="stat-label">{stat.label}</span>
                        <span class="stat-change {stat.trend}">
                            {#if stat.trend === "up"}↑{:else if stat.trend === "down"}↓{/if}
                            {stat.change}
                        </span>
                    </div>
                    <p class="stat-value">{stat.value}</p>
                </div>
            {/each}
        </div>

        <div class="dashboard-grid">
            <!-- Recent Bookings -->
            <section class="card bookings-card">
                <div class="card-header">
                    <h2>Recent Bookings</h2>
                    <a href="/admin/bookings" class="view-all">View All →</a>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each recentBookings as booking}
                                <tr>
                                    <td class="id">{booking.id.slice(0, 8)}</td>
                                    <td>{booking.customerName}</td>
                                    <td>{booking.serviceType}</td>
                                    <td>{formatDate(booking.scheduledDate)}</td>
                                    <td>
                                        <span
                                            class="status-badge"
                                            style="background: {statusColors[
                                                booking.status
                                            ] ||
                                                '#6b7280'}20; color: {statusColors[
                                                booking.status
                                            ] || '#6b7280'}"
                                        >
                                            {formatStatus(booking.status)}
                                        </span>
                                    </td>
                                    <td class="amount">${booking.total || 0}</td
                                    >
                                </tr>
                            {:else}
                                <tr>
                                    <td colspan="6" class="empty-state"
                                        >No recent bookings</td
                                    >
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Sidebar Widgets -->
            <div class="widgets">
                <!-- Top Staff -->
                <section class="card">
                    <div class="card-header">
                        <h2>Top Staff</h2>
                        <a href="/admin/staff" class="view-all">View All →</a>
                    </div>
                    <div class="staff-list">
                        {#each topStaff as staff, i}
                            <div class="staff-item">
                                <span class="rank">#{i + 1}</span>
                                <div class="staff-avatar">
                                    {getInitials(staff.name)}
                                </div>
                                <div class="staff-info">
                                    <span class="staff-name">{staff.name}</span>
                                    <span class="staff-stats"
                                        >{staff.jobsCompleted} jobs • ★ {staff.averageRating}</span
                                    >
                                </div>
                            </div>
                        {:else}
                            <div class="empty-staff">No staff members yet</div>
                        {/each}
                    </div>
                </section>

                <!-- Quick Actions -->
                <section class="card">
                    <h2 class="card-title">Quick Actions</h2>
                    <div class="quick-actions">
                        <a href="/admin/bookings" class="action-btn purple">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            New Booking
                        </a>
                        <a href="/admin/users" class="action-btn blue">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                                />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="20" y1="8" x2="20" y2="14" />
                                <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                            Add User
                        </a>
                        <a href="/admin/staff" class="action-btn green">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            Add Staff
                        </a>
                        <a href="/admin/reviews" class="action-btn yellow">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polygon
                                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                />
                            </svg>
                            Review Queue
                        </a>
                    </div>
                </section>
            </div>
        </div>
    {/if}
</div>

<style>
    .admin-dashboard {
        color: var(--text-primary);
    }
    .page-header {
        margin-bottom: 2rem;
    }
    .page-header h1 {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
    }
    .page-header p {
        color: var(--text-secondary);
        margin: 0;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .stat-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.25rem;
        border: 1px solid var(--border-color);
    }
    .stat-card.purple {
        border-left: 3px solid var(--color-accent);
    }
    .stat-card.green {
        border-left: 3px solid #22c55e;
    }
    .stat-card.blue {
        border-left: 3px solid var(--color-alternate);
    }
    .stat-card.yellow {
        border-left: 3px solid #eab308;
    }

    .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
    .stat-change {
        font-size: 0.75rem;
        font-weight: 500;
        padding: 0.125rem 0.375rem;
        border-radius: 4px;
    }
    .stat-change.up {
        color: #22c55e;
        background: rgba(34, 197, 94, 0.1);
    }
    .stat-change.down {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
    }
    .stat-change.neutral {
        color: var(--text-muted);
        background: var(--glass-bg);
    }
    .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0;
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 1.5rem;
    }
    .card {
        background: var(--bg-secondary);
        border-radius: 12px;
        border: 1px solid var(--border-color);
        overflow: hidden;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--border-color);
    }
    .card-header h2,
    .card-title {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
    }
    .card-title {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--border-color);
    }
    .view-all {
        font-size: 0.75rem;
        color: var(--color-accent);
        text-decoration: none;
    }
    .view-all:hover {
        text-decoration: underline;
    }

    .table-container {
        overflow-x: auto;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th,
    td {
        padding: 0.875rem 1.25rem;
        text-align: left;
        font-size: 0.875rem;
    }
    th {
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--border-color);
    }
    td {
        border-bottom: 1px solid var(--border-color);
        color: var(--text-secondary);
    }
    tr:hover td {
        background: var(--glass-bg);
    }
    .id {
        color: var(--text-muted);
        font-family: monospace;
    }
    .amount {
        font-weight: 600;
        color: var(--text-primary);
    }
    .status-badge {
        display: inline-block;
        padding: 0.25rem 0.625rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .widgets {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .staff-list {
        padding: 0.5rem 0;
    }
    .staff-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.25rem;
    }
    .staff-item:hover {
        background: var(--glass-bg);
    }
    .rank {
        font-size: 0.75rem;
        color: var(--text-muted);
        width: 24px;
    }
    .staff-avatar {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: linear-gradient(
            135deg,
            var(--color-accent),
            var(--color-alternate)
        );
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .staff-info {
        display: flex;
        flex-direction: column;
    }
    .staff-name {
        font-size: 0.875rem;
        font-weight: 500;
    }
    .staff-stats {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .quick-actions {
        padding: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }
    .action-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.8125rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
    }
    .action-btn.purple {
        background: rgba(37, 99, 235, 0.1);
        color: var(--color-accent);
    }
    .action-btn.blue {
        background: rgba(37, 99, 235, 0.1);
        color: var(--color-alternate);
    }
    .action-btn.green {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
    }
    .action-btn.yellow {
        background: rgba(234, 179, 8, 0.1);
        color: #eab308;
    }
    .action-btn:hover {
        transform: translateY(-2px);
    }

    @media (max-width: 1200px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
    }
    @media (max-width: 640px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }

    /* Loading State */
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }

    .loading-container .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border-color);
        border-top-color: var(--color-accent);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Empty States */
    .empty-state {
        text-align: center;
        padding: 2rem;
        color: var(--text-muted);
    }

    .empty-staff {
        padding: 1.5rem;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.875rem;
    }
</style>
