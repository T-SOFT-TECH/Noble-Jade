<script lang="ts">
    import { onMount } from "svelte";
    import { currentUser } from "$lib/stores/auth";
    import {
        getUserStats,
        getRecentBookings,
        type UserStats,
        type UserBooking,
    } from "$lib/services/user-dashboard";

    let isLoading = $state(true);
    let userStats = $state<UserStats>({
        totalBookings: 0,
        completedBookings: 0,
        walletBalance: 0,
        rewardPoints: 0,
    });
    let recentBookings = $state<UserBooking[]>([]);

    // Dashboard stats derived from real data
    const stats = $derived([
        {
            label: "Total Bookings",
            value: userStats.totalBookings.toString(),
            icon: "calendar",
            color: "blue",
        },
        {
            label: "Completed Jobs",
            value: userStats.completedBookings.toString(),
            icon: "check",
            color: "green",
        },
        {
            label: "Wallet Balance",
            value: `$${userStats.walletBalance.toFixed(2)}`,
            icon: "wallet",
            color: "purple",
        },
        {
            label: "Reward Points",
            value: userStats.rewardPoints.toString(),
            icon: "star",
            color: "yellow",
        },
    ]);

    const quickActions = [
        {
            name: "Book a Cleaning",
            href: "/get-quote",
            icon: "plus",
            primary: true,
        },
        {
            name: "View My Bookings",
            href: "/dashboard/bookings",
            icon: "calendar",
        },
        { name: "Top Up Wallet", href: "/dashboard/wallet", icon: "wallet" },
        { name: "Refer a Friend", href: "/dashboard/referrals", icon: "gift" },
    ];

    // Format date
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

    const statusColors: Record<string, string> = {
        pending: "#eab308",
        confirmed: "#3b82f6",
        approved: "#3b82f6",
        assigned: "#6366f1",
        in_progress: "var(--color-accent)",
        completed: "#22c55e",
        cancelled: "#ef4444",
    };

    // Load data
    async function loadData() {
        if (!$currentUser?.id) return;

        isLoading = true;
        try {
            const [stats, bookings] = await Promise.all([
                getUserStats($currentUser.id),
                getRecentBookings($currentUser.id, 5),
            ]);
            userStats = stats;
            recentBookings = bookings;
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        loadData();
    });
</script>

<div class="dashboard-home">
    <!-- Stats Grid -->
    <div class="stats-grid">
        {#each stats as stat}
            <div class="stat-card {stat.color}">
                <div class="stat-icon">
                    {#if stat.icon === "calendar"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    {:else if stat.icon === "check"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    {:else if stat.icon === "wallet"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect
                                x="1"
                                y="4"
                                width="22"
                                height="16"
                                rx="2"
                                ry="2"
                            />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                    {:else if stat.icon === "star"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                            />
                        </svg>
                    {/if}
                </div>
                <div class="stat-content">
                    <p class="stat-value">{stat.value}</p>
                    <p class="stat-label">{stat.label}</p>
                </div>
            </div>
        {/each}
    </div>

    <!-- Quick Actions -->
    <section class="section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
            {#each quickActions as action}
                <a
                    href={action.href}
                    class="action-card"
                    class:primary={action.primary}
                >
                    <div class="action-icon">
                        {#if action.icon === "plus"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        {:else if action.icon === "calendar"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        {:else if action.icon === "wallet"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <rect
                                    x="1"
                                    y="4"
                                    width="22"
                                    height="16"
                                    rx="2"
                                    ry="2"
                                />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                        {:else if action.icon === "gift"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polyline points="20 12 20 22 4 22 4 12" />
                                <rect x="2" y="7" width="20" height="5" />
                                <line x1="12" y1="22" x2="12" y2="7" />
                                <path
                                    d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"
                                />
                                <path
                                    d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
                                />
                            </svg>
                        {/if}
                    </div>
                    <span>{action.name}</span>
                </a>
            {/each}
        </div>
    </section>

    <!-- Recent Activity -->
    <section class="section">
        <div class="section-header">
            <h2 class="section-title">Recent Activity</h2>
            <a href="/dashboard/bookings" class="view-all">View All →</a>
        </div>
        {#if isLoading}
            <div class="activity-card">
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Loading bookings...</p>
                </div>
            </div>
        {:else if recentBookings.length === 0}
            <div class="activity-card">
                <div class="empty-state">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <h3>No bookings yet</h3>
                    <p>Your upcoming and past bookings will appear here.</p>
                    <a href="/get-quote" class="btn-primary"
                        >Book Your First Cleaning</a
                    >
                </div>
            </div>
        {:else}
            <div class="bookings-list">
                {#each recentBookings as booking}
                    <a href="/dashboard/bookings" class="booking-item">
                        <div class="booking-info">
                            <span class="booking-service"
                                >{booking.serviceType}</span
                            >
                            <span class="booking-date"
                                >{formatDate(booking.scheduledDate)}</span
                            >
                        </div>
                        <div class="booking-meta">
                            <span class="booking-amount"
                                >${booking.total || 0}</span
                            >
                            <span
                                class="booking-status"
                                style="background: {statusColors[
                                    booking.status
                                ] || '#6b7280'}20; color: {statusColors[
                                    booking.status
                                ] || '#6b7280'}"
                            >
                                {formatStatus(booking.status)}
                            </span>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </section>
</div>

<style>
    .dashboard-home {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .stat-card {
        background: var(--bg-secondary);
        border-radius: 16px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid var(--border-color);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stat-card.blue .stat-icon {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
    }

    .stat-card.green .stat-icon {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
    }

    .stat-card.purple .stat-icon {
        background: rgba(168, 85, 247, 0.1);
        color: #a855f7;
    }

    .stat-card.yellow .stat-icon {
        background: rgba(234, 179, 8, 0.1);
        color: #eab308;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
    }

    .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    /* Section */
    .section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    /* Quick Actions */
    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
    }

    .action-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        text-decoration: none;
        color: var(--text-primary);
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .action-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .action-card.primary {
        background: linear-gradient(135deg, #e82374, #d11d68);
        border-color: transparent;
        color: white;
    }

    .action-card.primary:hover {
        box-shadow: 0 4px 20px rgba(232, 35, 116, 0.3);
    }

    .action-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .action-card.primary .action-icon {
        background: rgba(255, 255, 255, 0.2);
    }

    /* Activity Card */
    .activity-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 2rem;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1rem;
        padding: 2rem;
        color: var(--text-secondary);
    }

    .empty-state svg {
        opacity: 0.5;
    }

    .empty-state h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .empty-state p {
        margin: 0;
        max-width: 300px;
    }

    .btn-primary {
        display: inline-flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        background: #e82374;
        color: white;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        margin-top: 0.5rem;
        transition: all 0.2s ease;
    }

    .btn-primary:hover {
        background: #d11d68;
        transform: translateY(-2px);
    }

    /* Section Header */
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .section-header .section-title {
        margin-bottom: 0;
    }

    .view-all {
        font-size: 0.875rem;
        color: var(--color-accent);
        text-decoration: none;
    }

    .view-all:hover {
        text-decoration: underline;
    }

    /* Loading State */
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: var(--text-secondary);
    }

    .spinner {
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

    /* Bookings List */
    .bookings-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .booking-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .booking-item:hover {
        border-color: var(--color-accent);
        transform: translateY(-2px);
    }

    .booking-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .booking-service {
        font-weight: 600;
        color: var(--text-primary);
    }

    .booking-date {
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    .booking-meta {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .booking-amount {
        font-weight: 600;
        color: var(--text-primary);
    }

    .booking-status {
        padding: 0.25rem 0.625rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
    }
</style>
