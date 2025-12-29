<script lang="ts">
    import { page } from "$app/stores";
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import {
        bookings,
        jobProgress,
        type BookingStatus,
    } from "$lib/services/bookings";
    import {
        createRealtimeBookingStore,
        createRealtimeProgressStore,
    } from "$lib/services/realtime";

    const bookingId = $page.params.id;

    let booking = $state<any>(null);
    let progress = $state<any[]>([]);
    let isLoading = $state(true);
    let showRejectModal = $state(false);
    let rejectReason = $state("");

    // Realtime stores
    let bookingStore: any;
    let progressStore: any;

    onMount(async () => {
        bookingStore = createRealtimeBookingStore(bookingId);
        progressStore = createRealtimeProgressStore(bookingId);

        await bookingStore.init();
        await progressStore.init();

        bookingStore.subscribe((value: any) => {
            booking = value;
            isLoading = !value;
        });

        progressStore.subscribe((value: any[]) => {
            progress = value;
        });
    });

    onDestroy(() => {
        bookingStore?.destroy();
        progressStore?.destroy();
    });

    const statusConfig: Record<
        BookingStatus,
        { label: string; color: string; icon: string }
    > = {
        pending_review: {
            label: "Pending Review",
            color: "#eab308",
            icon: "⏳",
        },
        admin_modified: {
            label: "Changes Proposed",
            color: "#f97316",
            icon: "✏️",
        },
        customer_confirmed: {
            label: "Awaiting Approval",
            color: "#3b82f6",
            icon: "✓",
        },
        approved: { label: "Ready for Payment", color: "#22c55e", icon: "✓" },
        paid: { label: "Paid", color: "#22c55e", icon: "💳" },
        assigned: { label: "Staff Assigned", color: "#8b5cf6", icon: "👥" },
        in_progress: { label: "In Progress", color: "#a855f7", icon: "🧹" },
        completed: { label: "Completed", color: "#22c55e", icon: "✅" },
        cancelled: { label: "Cancelled", color: "#ef4444", icon: "✗" },
    };

    async function acceptChanges() {
        await bookings.acceptModifications(bookingId);
    }

    async function rejectChanges() {
        await bookings.rejectModifications(bookingId, rejectReason);
        showRejectModal = false;
        rejectReason = "";
    }

    async function proceedToPayment() {
        goto(`/checkout?booking=${bookingId}`);
    }

    const stageLabels = [
        "Submitted",
        "Reviewed",
        "Confirmed",
        "Approved",
        "Paid",
        "Assigned",
        "In Progress",
        "Completed",
    ];

    function getStageIndex(status: BookingStatus): number {
        const stages: BookingStatus[] = [
            "pending_review",
            "admin_modified",
            "customer_confirmed",
            "approved",
            "paid",
            "assigned",
            "in_progress",
            "completed",
        ];
        return stages.indexOf(status);
    }
</script>

<div class="booking-detail">
    {#if isLoading}
        <div class="loading">Loading booking details...</div>
    {:else if booking}
        <div class="header">
            <a href="/dashboard/bookings" class="back-link"
                >← Back to Bookings</a
            >
            <h1>Booking #{booking.id.slice(0, 8)}</h1>
        </div>

        <!-- Status Tracker -->
        <div class="status-tracker">
            {#each stageLabels as label, i}
                <div
                    class="stage"
                    class:active={i <= getStageIndex(booking.status)}
                    class:current={i === getStageIndex(booking.status)}
                >
                    <div class="stage-dot">{i + 1}</div>
                    <span class="stage-label">{label}</span>
                </div>
            {/each}
        </div>

        <!-- Current Status Banner -->
        <div
            class="status-banner"
            style="background: {statusConfig[booking.status as BookingStatus]
                ?.color}20; border-color: {statusConfig[
                booking.status as BookingStatus
            ]?.color}"
        >
            <span class="status-icon"
                >{statusConfig[booking.status as BookingStatus]?.icon}</span
            >
            <div class="status-info">
                <strong
                    >{statusConfig[booking.status as BookingStatus]
                        ?.label}</strong
                >
                {#if booking.status === "admin_modified"}
                    <p>
                        The admin has proposed changes to your booking. Please
                        review and accept or request modifications.
                    </p>
                {:else if booking.status === "approved"}
                    <p>
                        Your booking is approved! Please proceed to payment to
                        confirm your appointment.
                    </p>
                {:else if booking.status === "in_progress"}
                    <p>
                        Your cleaning is in progress. Track the progress below
                        in realtime!
                    </p>
                {/if}
            </div>
        </div>

        <!-- Admin Modifications (if any) -->
        {#if booking.status === "admin_modified" && booking.proposedChanges}
            <section class="card modifications">
                <h2>Proposed Changes</h2>
                {#if booking.customerVisibleNotes}
                    <div class="admin-note">
                        <strong>Note from Admin:</strong>
                        <p>{booking.customerVisibleNotes}</p>
                    </div>
                {/if}
                <div class="changes-grid">
                    <div class="change-item">
                        <span class="label">Original Total</span>
                        <span class="old"
                            >${booking.proposedChanges.original?.total}</span
                        >
                    </div>
                    <div class="change-item">
                        <span class="label">New Total</span>
                        <span class="new"
                            >${booking.proposedChanges.modified?.total}</span
                        >
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-primary" onclick={acceptChanges}
                        >Accept Changes</button
                    >
                    <button
                        class="btn-secondary"
                        onclick={() => (showRejectModal = true)}
                        >Request Modifications</button
                    >
                </div>
            </section>
        {/if}

        <!-- Payment Button -->
        {#if booking.status === "approved"}
            <section class="card">
                <h2>Complete Your Booking</h2>
                <p>Total: <strong>${booking.total}</strong></p>
                <button class="btn-primary large" onclick={proceedToPayment}
                    >Proceed to Payment</button
                >
            </section>
        {/if}

        <!-- Realtime Job Progress -->
        {#if booking.status === "in_progress" || booking.status === "completed"}
            <section class="card progress-section">
                <h2>🔴 Live Progress</h2>
                <div class="progress-timeline">
                    {#each progress as update}
                        <div class="progress-item">
                            <div class="progress-time">
                                {new Date(update.created).toLocaleTimeString()}
                            </div>
                            <div class="progress-content">
                                <h4>{update.title}</h4>
                                {#if update.description}
                                    <p>{update.description}</p>
                                {/if}
                                {#if update.photos?.length}
                                    <div class="progress-photos">
                                        {#each update.photos as photo}
                                            <img
                                                src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/job_progress/${update.id}/${photo}`}
                                                alt="Progress"
                                            />
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {:else}
                        <p class="no-updates">Waiting for staff updates...</p>
                    {/each}
                </div>
            </section>
        {/if}

        <!-- Booking Details -->
        <section class="card">
            <h2>Booking Details</h2>
            <div class="details-grid">
                <div>
                    <span>Service</span><strong>{booking.serviceType}</strong>
                </div>
                <div>
                    <span>Date</span><strong
                        >{new Date(
                            booking.scheduledDate,
                        ).toLocaleDateString()}</strong
                    >
                </div>
                <div><span>Time</span><strong>{booking.timeSlot}</strong></div>
                <div>
                    <span>Property</span><strong
                        >{booking.propertyType} • {booking.squareFootage} sq ft</strong
                    >
                </div>
                <div>
                    <span>Rooms</span><strong
                        >{booking.bedrooms} bed • {booking.bathrooms} bath</strong
                    >
                </div>
                <div>
                    <span>Address</span><strong
                        >{booking.address}, {booking.city}</strong
                    >
                </div>
            </div>
        </section>
    {:else}
        <p>Booking not found.</p>
    {/if}
</div>

<!-- Reject Modal -->
{#if showRejectModal}
    <div
        class="modal-overlay"
        onclick={() => (showRejectModal = false)}
        role="dialog"
        aria-modal="true"
    >
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <h3>Request Modifications</h3>
            <textarea
                bind:value={rejectReason}
                placeholder="Describe what changes you'd like..."
            ></textarea>
            <div class="modal-actions">
                <button
                    class="btn-secondary"
                    onclick={() => (showRejectModal = false)}>Cancel</button
                >
                <button class="btn-primary" onclick={rejectChanges}
                    >Submit</button
                >
            </div>
        </div>
    </div>
{/if}

<style>
    .booking-detail {
        max-width: 900px;
        margin: 0 auto;
        padding: 1rem;
    }
    .loading {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
    .header {
        margin-bottom: 2rem;
    }
    .back-link {
        color: var(--primary);
        text-decoration: none;
        font-size: 0.875rem;
    }
    .header h1 {
        font-size: 1.5rem;
        margin: 0.5rem 0 0;
    }

    .status-tracker {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        overflow-x: auto;
        padding: 1rem 0;
    }
    .stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        opacity: 0.4;
        flex-shrink: 0;
    }
    .stage.active {
        opacity: 1;
    }
    .stage-dot {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .stage.active .stage-dot {
        background: #a855f7;
        border-color: #a855f7;
        color: white;
    }
    .stage.current .stage-dot {
        box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
    }
    .stage-label {
        font-size: 0.7rem;
        color: var(--text-secondary);
        text-align: center;
        max-width: 70px;
    }

    .status-banner {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid;
        margin-bottom: 1.5rem;
    }
    .status-icon {
        font-size: 1.5rem;
    }
    .status-info strong {
        display: block;
        margin-bottom: 0.25rem;
    }
    .status-info p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.8;
    }

    .card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--border-color);
    }
    .card h2 {
        font-size: 1.125rem;
        margin: 0 0 1rem;
    }

    .admin-note {
        background: rgba(168, 85, 247, 0.1);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    .admin-note strong {
        display: block;
        margin-bottom: 0.5rem;
        color: #a855f7;
    }

    .changes-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    .change-item {
        padding: 1rem;
        border-radius: 8px;
        background: var(--bg-primary);
    }
    .change-item .label {
        display: block;
        font-size: 0.75rem;
        opacity: 0.6;
        margin-bottom: 0.25rem;
    }
    .change-item .old {
        text-decoration: line-through;
        opacity: 0.5;
    }
    .change-item .new {
        color: #22c55e;
        font-weight: 600;
        font-size: 1.25rem;
    }

    .action-buttons {
        display: flex;
        gap: 1rem;
    }
    .btn-primary {
        padding: 0.75rem 1.5rem;
        background: #a855f7;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
    .btn-primary.large {
        width: 100%;
        padding: 1rem;
        font-size: 1.125rem;
    }
    .btn-secondary {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
    }

    .progress-section h2 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .progress-timeline {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .progress-item {
        display: flex;
        gap: 1rem;
        padding-left: 1rem;
        border-left: 2px solid #a855f7;
    }
    .progress-time {
        font-size: 0.75rem;
        color: var(--text-secondary);
        min-width: 70px;
    }
    .progress-content h4 {
        margin: 0 0 0.25rem;
        font-size: 0.9375rem;
    }
    .progress-content p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.7;
    }
    .progress-photos {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
    }
    .progress-photos img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
    }
    .no-updates {
        color: var(--text-secondary);
        font-style: italic;
    }

    .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
    .details-grid > div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .details-grid span {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }
    .modal {
        background: var(--bg-secondary);
        border-radius: 16px;
        padding: 1.5rem;
        max-width: 400px;
        width: 90%;
    }
    .modal h3 {
        margin: 0 0 1rem;
    }
    .modal textarea {
        width: 100%;
        min-height: 100px;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-primary);
        color: var(--text-primary);
        resize: none;
    }
    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1rem;
    }
</style>
