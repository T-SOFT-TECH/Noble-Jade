<script lang="ts">
    // Bookings Management Page - Real Data
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        getAllBookings,
        getBookingStats,
        getAllStaff,
        type AdminBooking,
        type StaffMember,
    } from "$lib/services/admin";
    import { bookings as bookingsService } from "$lib/services/bookings";

    let searchQuery = $state("");
    let showStaffModal = $state(false);
    let selectedBooking = $state<AdminBooking | null>(null);
    let availableStaff = $state<StaffMember[]>([]);
    let selectedStaffIds = $state<string[]>([]);
    let isAssigning = $state(false);
    let statusFilter = $state("all");
    let dateFilter = $state("all");
    let isLoading = $state(true);
    let bookingsList = $state<AdminBooking[]>([]);
    let stats = $state([
        { label: "Today", value: 0, color: "var(--color-accent)" },
        { label: "This Week", value: 0, color: "#3b82f6" },
        { label: "Pending", value: 0, color: "#eab308" },
        { label: "Completed", value: 0, color: "#22c55e" },
    ]);

    // Filtered bookings based on search/filters
    const filteredBookings = $derived(() => {
        return bookingsList.filter((b) => {
            const matchesSearch =
                b.customerName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                b.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "all" || b.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
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
        in_progress: "var(--color-accent)",
        "in-progress": "var(--color-accent)",
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

    // Get assigned staff name
    function getStaffName(booking: AdminBooking): string {
        if (
            booking.expand?.assignedStaff &&
            booking.expand.assignedStaff.length > 0
        ) {
            return booking.expand.assignedStaff
                .map((s: any) => s.name)
                .join(", ");
        }
        return "Unassigned";
    }

    // Load data
    async function loadData() {
        isLoading = true;
        try {
            const [bookingsResult, statsData] = await Promise.all([
                getAllBookings(1, 50, {
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    dateRange:
                        dateFilter !== "all" ? (dateFilter as any) : undefined,
                    search: searchQuery || undefined,
                }),
                getBookingStats(),
            ]);
            bookingsList = bookingsResult.items;
            stats = [
                {
                    label: "Today",
                    value: statsData.today,
                    color: "var(--color-accent)",
                },
                {
                    label: "This Week",
                    value: statsData.thisWeek,
                    color: "#3b82f6",
                },
                {
                    label: "Pending",
                    value: statsData.pending,
                    color: "#eab308",
                },
                {
                    label: "Completed",
                    value: statsData.completed,
                    color: "#22c55e",
                },
            ];
        } catch (error) {
            console.error("Error loading bookings:", error);
        } finally {
            isLoading = false;
        }
    }

    // Reload when filters change
    $effect(() => {
        // Dependencies: statusFilter, dateFilter
        const _s = statusFilter;
        const _d = dateFilter;
        loadData();
    });

    onMount(() => {
        loadData();
        loadStaff();
    });

    // Load staff for assignment
    async function loadStaff() {
        try {
            availableStaff = await getAllStaff();
        } catch (error) {
            console.error("Error loading staff:", error);
        }
    }

    // Handle new booking
    function handleNewBooking() {
        goto("/get-quote");
    }

    // Open staff assignment modal
    function openStaffModal(booking: AdminBooking) {
        selectedBooking = booking;
        // Get assigned staff from expand if available
        const currentStaff =
            booking.expand?.assignedStaff?.map((s: any) => s.id) || [];
        selectedStaffIds = currentStaff;
        showStaffModal = true;
    }

    // Close staff modal
    function closeStaffModal() {
        showStaffModal = false;
        selectedBooking = null;
        selectedStaffIds = [];
    }

    // Assign staff to booking
    async function handleAssignStaff() {
        if (!selectedBooking || selectedStaffIds.length === 0) return;
        isAssigning = true;
        try {
            await bookingsService.assignStaff(
                selectedBooking.id,
                selectedStaffIds,
            );
            await loadData();
            closeStaffModal();
        } catch (error) {
            console.error("Error assigning staff:", error);
            alert("Failed to assign staff");
        } finally {
            isAssigning = false;
        }
    }

    // Toggle staff selection
    function toggleStaffSelection(staffId: string) {
        if (selectedStaffIds.includes(staffId)) {
            selectedStaffIds = selectedStaffIds.filter((id) => id !== staffId);
        } else {
            selectedStaffIds = [...selectedStaffIds, staffId];
        }
    }
</script>

<div class="bookings-page">
    <div class="page-header">
        <div class="header-left">
            <h1>Bookings</h1>
            <p>Manage all cleaning appointments</p>
        </div>
        <button class="add-btn" onclick={handleNewBooking}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
        </button>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
        {#each stats as stat}
            <div class="stat-mini">
                <span class="stat-value" style="color: {stat.color}"
                    >{stat.value}</span
                >
                <span class="stat-label">{stat.label}</span>
            </div>
        {/each}
    </div>

    <!-- Filters -->
    <div class="filters">
        <div class="search-box">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
                type="text"
                placeholder="Search bookings..."
                bind:value={searchQuery}
            />
        </div>
        <div class="filter-group">
            <select bind:value={statusFilter}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
            <select bind:value={dateFilter}>
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
            </select>
        </div>
    </div>

    <!-- Bookings Table -->
    <div class="table-card">
        {#if isLoading}
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Loading bookings...</p>
            </div>
        {:else}
            <table>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date & Time</th>
                        <th>Staff</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredBookings() as booking}
                        <tr>
                            <td class="id">{booking.id.slice(0, 8)}</td>
                            <td>
                                <div class="customer-cell">
                                    <span class="customer-name"
                                        >{booking.customerName}</span
                                    >
                                    <span class="customer-email"
                                        >{booking.customerEmail}</span
                                    >
                                </div>
                            </td>
                            <td>{booking.serviceType}</td>
                            <td>
                                <div class="datetime-cell">
                                    <span
                                        >{formatDate(
                                            booking.scheduledDate,
                                        )}</span
                                    >
                                    <span class="time"
                                        >{booking.timeSlot || "TBD"}</span
                                    >
                                </div>
                            </td>
                            <td>
                                <span
                                    class:unassigned={getStaffName(booking) ===
                                        "Unassigned"}
                                >
                                    {getStaffName(booking)}
                                </span>
                            </td>
                            <td>
                                <span
                                    class="status-badge"
                                    style="background: {statusColors[
                                        booking.status
                                    ] || '#6b7280'}20; color: {statusColors[
                                        booking.status
                                    ] || '#6b7280'}"
                                >
                                    {formatStatus(booking.status)}
                                </span>
                            </td>
                            <td class="amount">${booking.total || 0}</td>
                            <td>
                                <div class="action-btns">
                                    <a
                                        href="/admin/bookings/{booking.id}"
                                        class="icon-btn"
                                        title="View Details"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                            />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </a>
                                    <button
                                        class="icon-btn"
                                        title="Edit"
                                        onclick={() =>
                                            goto(
                                                `/admin/bookings/${booking.id}`,
                                            )}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                            />
                                            <path
                                                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        class="icon-btn"
                                        title="Assign Staff"
                                        onclick={() => openStaffModal(booking)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                                            />
                                            <circle cx="8.5" cy="7" r="4" />
                                            <line
                                                x1="20"
                                                y1="8"
                                                x2="20"
                                                y2="14"
                                            />
                                            <line
                                                x1="23"
                                                y1="11"
                                                x2="17"
                                                y2="11"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="8" class="empty-state"
                                >No bookings found</td
                            >
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</div>

<!-- Staff Assignment Modal -->
{#if showStaffModal}
    <div
        class="modal-overlay"
        onclick={closeStaffModal}
        onkeydown={(e) => e.key === "Escape" && closeStaffModal()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div class="modal" role="document" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>Assign Staff</h2>
                <button class="close-btn" onclick={closeStaffModal}>×</button>
            </div>
            <div class="modal-body">
                {#if availableStaff.length === 0}
                    <p class="no-staff">
                        No staff members available. Please add staff first.
                    </p>
                {:else}
                    <p class="modal-info">
                        Select staff members to assign to booking #{selectedBooking?.id?.slice(
                            0,
                            8,
                        )}
                    </p>
                    <div class="staff-list">
                        {#each availableStaff as staff}
                            <label
                                class="staff-item"
                                class:selected={selectedStaffIds.includes(
                                    staff.id,
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedStaffIds.includes(
                                        staff.id,
                                    )}
                                    onchange={() =>
                                        toggleStaffSelection(staff.id)}
                                />
                                <div class="staff-info">
                                    <span class="staff-name">{staff.name}</span>
                                    <span class="staff-jobs"
                                        >{staff.jobsCompleted} jobs completed</span
                                    >
                                </div>
                                <span class="staff-rating"
                                    >★ {staff.averageRating}</span
                                >
                            </label>
                        {/each}
                    </div>
                {/if}
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick={closeStaffModal}
                    >Cancel</button
                >
                <button
                    class="btn-primary"
                    disabled={isAssigning || selectedStaffIds.length === 0}
                    onclick={handleAssignStaff}
                >
                    {isAssigning ? "Assigning..." : "Assign Staff"}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .bookings-page {
        color: var(--text-primary);
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
    }

    .header-left h1 {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
    }
    .header-left p {
        color: var(--text-secondary);
        margin: 0;
    }

    .add-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: var(--color-accent);
        color: var(--text-primary);
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .add-btn:hover {
        background: #9333ea;
    }

    .stats-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .stat-mini {
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
        border: 1px solid var(--glass-bg);
    }

    .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
    }
    .stat-label {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .filters {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .search-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        flex: 1;
        max-width: 350px;
    }

    .search-box input {
        background: none;
        border: none;
        color: var(--text-primary);
        width: 100%;
        outline: none;
    }

    .search-box svg {
        color: rgba(255, 255, 255, 0.4);
    }

    .filter-group {
        display: flex;
        gap: 0.5rem;
    }

    .filter-group select {
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
    }

    .table-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        border: 1px solid var(--glass-bg);
        overflow: hidden;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }
    th,
    td {
        padding: 1rem 1.25rem;
        text-align: left;
        font-size: 0.875rem;
    }
    th {
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
        font-size: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
    }
    td {
        border-bottom: 1px solid var(--border-color);
    }
    tr:hover td {
        background: rgba(255, 255, 255, 0.02);
    }

    .id {
        color: var(--text-muted);
        font-family: monospace;
    }
    .amount {
        font-weight: 600;
    }

    .customer-cell,
    .datetime-cell {
        display: flex;
        flex-direction: column;
    }
    .customer-name {
        font-weight: 500;
    }
    .customer-email {
        font-size: 0.75rem;
        color: var(--text-muted);
    }
    .time {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .unassigned {
        color: #eab308;
        font-style: italic;
    }

    .status-badge {
        padding: 0.25rem 0.625rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .action-btns {
        display: flex;
        gap: 0.5rem;
    }
    .icon-btn {
        padding: 0.375rem;
        background: var(--glass-bg);
        border: none;
        color: var(--text-secondary);
        border-radius: 6px;
        cursor: pointer;
    }
    .icon-btn:hover {
        background: var(--border-color);
        color: var(--text-primary);
    }

    @media (max-width: 1024px) {
        .stats-row {
            grid-template-columns: repeat(2, 1fr);
        }
        .filters {
            flex-direction: column;
        }
        .search-box {
            max-width: none;
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

    .empty-state {
        text-align: center;
        padding: 2rem;
        color: var(--text-muted);
    }

    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }

    .modal {
        background: var(--bg-secondary);
        border-radius: 16px;
        width: 100%;
        max-width: 480px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem;
        border-bottom: 1px solid var(--glass-bg);
    }

    .modal-header h2 {
        font-size: 1.125rem;
        margin: 0;
    }

    .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
    }

    .modal-body {
        padding: 1.25rem;
    }

    .modal-info {
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }

    .no-staff {
        color: var(--text-muted);
        text-align: center;
        padding: 2rem;
    }

    .staff-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .staff-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .staff-item:hover {
        background: var(--border-color);
    }

    .staff-item.selected {
        border-color: var(--color-accent);
        background: rgba(168, 85, 247, 0.1);
    }

    .staff-item input[type="checkbox"] {
        accent-color: var(--color-accent);
    }

    .staff-info {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .staff-name {
        font-weight: 500;
    }

    .staff-jobs {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .staff-rating {
        color: #eab308;
        font-weight: 500;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 1.25rem;
        border-top: 1px solid var(--glass-bg);
    }

    .btn-secondary,
    .btn-primary {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .btn-secondary {
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
    }

    .btn-primary {
        background: var(--color-accent);
        border: none;
        color: var(--text-primary);
    }

    .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
