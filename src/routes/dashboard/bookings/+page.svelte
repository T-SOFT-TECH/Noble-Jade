<script lang="ts">
    import { onMount } from "svelte";
    import { currentUser } from "$lib/stores/auth";
    import {
        getUserBookings,
        type UserBooking,
    } from "$lib/services/user-dashboard";

    let bookings = $state<UserBooking[]>([]);
    let isLoading = $state(true);
    let activeTab = $state("all");

    const tabs = [
        { id: "all", label: "All Bookings" },
        { id: "upcoming", label: "Upcoming" },
        { id: "completed", label: "Completed" },
        { id: "cancelled", label: "Cancelled" },
    ];

    const statusColors: Record<string, string> = {
        pending: "yellow",
        pending_review: "yellow",
        confirmed: "blue",
        approved: "blue",
        assigned: "purple",
        in_progress: "purple",
        completed: "green",
        cancelled: "red",
    };

    // Format date
    function formatDate(dateStr: string): string {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    // Format status for display
    function formatStatus(status: string): string {
        return status.replace(/_/g, " ").replace(/-/g, " ");
    }

    async function loadBookings() {
        if (!$currentUser?.id) return;

        isLoading = true;
        try {
            bookings = await getUserBookings($currentUser.id, {
                status: activeTab !== "all" ? activeTab : undefined,
            });
        } catch (error) {
            console.error("Error loading bookings:", error);
        } finally {
            isLoading = false;
        }
    }

    // Reload when tab changes
    $effect(() => {
        const _tab = activeTab;
        loadBookings();
    });

    onMount(() => {
        loadBookings();
    });
</script>

<svelte:head>
    <title>My Bookings - Noble Jade</title>
</svelte:head>

<div class="bookings-page">
    <div class="page-header">
        <h1 class="page-title">My Bookings</h1>
        <a href="/get-quote" class="btn-primary">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Booking
        </a>
    </div>

    <!-- Tabs -->
    <div class="tabs">
        {#each tabs as tab}
            <button
                class="tab"
                class:active={activeTab === tab.id}
                onclick={() => (activeTab = tab.id)}
            >
                {tab.label}
            </button>
        {/each}
    </div>

    <!-- Bookings List -->
    {#if isLoading}
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading bookings...</p>
        </div>
    {:else if bookings.length === 0}
        <div class="empty-state">
            <div class="empty-icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            </div>
            <h2>
                No bookings {activeTab !== "all"
                    ? `(${tabs.find((t) => t.id === activeTab)?.label})`
                    : "yet"}
            </h2>
            <p>
                {#if activeTab === "all"}
                    You haven't made any bookings. Book your first cleaning
                    service to get started!
                {:else}
                    No {activeTab} bookings found.
                {/if}
            </p>
            <a href="/get-quote" class="btn-primary">Book a Cleaning</a>
        </div>
    {:else}
        <div class="bookings-list">
            {#each bookings as booking}
                <div class="booking-card">
                    <div class="booking-header">
                        <span class="booking-id">#{booking.id.slice(0, 8)}</span
                        >
                        <span
                            class="booking-status {statusColors[
                                booking.status
                            ] || 'gray'}">{formatStatus(booking.status)}</span
                        >
                    </div>
                    <div class="booking-details">
                        <div class="detail">
                            <span class="label">Service</span>
                            <span class="value">{booking.serviceType}</span>
                        </div>
                        <div class="detail">
                            <span class="label">Date</span>
                            <span class="value"
                                >{formatDate(booking.scheduledDate)}</span
                            >
                        </div>
                        <div class="detail">
                            <span class="label">Time</span>
                            <span class="value"
                                >{booking.timeSlot || "TBD"}</span
                            >
                        </div>
                        <div class="detail">
                            <span class="label">Total</span>
                            <span class="value">${booking.total || 0}</span>
                        </div>
                    </div>
                    <div class="booking-actions">
                        <a
                            href="/dashboard/bookings/{booking.id}"
                            class="btn-outline">View Details</a
                        >
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .bookings-page {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .page-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: #e82374;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .btn-primary:hover {
        background: #d11d68;
    }

    /* Tabs */
    .tabs {
        display: flex;
        gap: 0.5rem;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.5rem;
        overflow-x: auto;
    }

    .tab {
        padding: 0.625rem 1rem;
        background: none;
        border: none;
        border-radius: 8px;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }

    .tab:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }

    .tab.active {
        background: #e82374;
        color: white;
    }

    /* Empty State */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 4rem 2rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
    }

    .empty-icon {
        color: var(--text-muted);
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .empty-state h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
    }

    .empty-state p {
        color: var(--text-secondary);
        max-width: 400px;
        margin: 0 0 1.5rem 0;
    }

    /* Bookings List */
    .bookings-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .booking-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.25rem;
    }

    .booking-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .booking-id {
        font-weight: 600;
        color: var(--text-primary);
    }

    .booking-status {
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .booking-status.yellow {
        background: rgba(234, 179, 8, 0.1);
        color: #eab308;
    }

    .booking-status.blue {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
    }

    .booking-status.purple {
        background: rgba(168, 85, 247, 0.1);
        color: #a855f7;
    }

    .booking-status.green {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
    }

    .booking-status.red {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }

    .booking-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .detail {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .detail .label {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .detail .value {
        font-weight: 500;
        color: var(--text-primary);
    }

    .booking-actions {
        display: flex;
        gap: 0.75rem;
    }

    .btn-outline {
        padding: 0.5rem 1rem;
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 0.875rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .btn-outline:hover {
        background: var(--bg-tertiary);
    }

    /* Loading State */
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
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
</style>
