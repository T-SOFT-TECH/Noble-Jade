<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { pb } from "$lib/pocketbase";
    import { bookings } from "$lib/services/bookings";

    const bookingId = $page.params.id;

    let booking = $state<any>(null);
    let staff = $state<any[]>([]);
    let isLoading = $state(true);
    let editMode = $state(false);

    // Editable fields
    let editData = $state({
        scheduledDate: "",
        timeSlot: "",
        total: 0,
        addons: [] as string[],
        customerVisibleNotes: "",
    });
    let selectedStaff = $state<string[]>([]);

    onMount(async () => {
        await loadBooking();
        await loadStaff();
    });

    async function loadBooking() {
        try {
            booking = await pb.collection("bookings").getOne(bookingId, {
                expand: "user,assignedStaff,modifiedBy",
            });
            editData = {
                scheduledDate: booking.scheduledDate?.split("T")[0] || "",
                timeSlot: booking.timeSlot,
                total: booking.total,
                addons: booking.addons || [],
                customerVisibleNotes: "",
            };
            selectedStaff = booking.assignedStaff || [];
        } catch (error) {
            console.error(error);
        } finally {
            isLoading = false;
        }
    }

    async function loadStaff() {
        try {
            staff = await pb
                .collection("users")
                .getFullList({ filter: "role = 'staff'" });
        } catch (e) {
            console.error(e);
        }
    }

    async function approveDirectly() {
        await bookings.approveBooking(bookingId);
        await loadBooking();
    }

    async function sendModifications() {
        await bookings.modifyBooking(
            bookingId,
            {
                scheduledDate: editData.scheduledDate,
                timeSlot: editData.timeSlot,
                total: editData.total,
                addons: editData.addons,
            },
            editData.customerVisibleNotes,
        );
        editMode = false;
        await loadBooking();
    }

    async function finalApprove() {
        await bookings.finalApprove(bookingId);
        await loadBooking();
    }

    async function assignSelectedStaff() {
        await bookings.assignStaff(bookingId, selectedStaff);
        await loadBooking();
    }

    async function cancelBooking() {
        if (confirm("Are you sure you want to cancel this booking?")) {
            await bookings.cancelBooking(bookingId);
            await loadBooking();
        }
    }

    const statusColors: Record<string, string> = {
        pending_review: "#eab308",
        admin_modified: "#f97316",
        customer_confirmed: "#3b82f6",
        approved: "#22c55e",
        paid: "#22c55e",
        assigned: "#8b5cf6",
        in_progress: "#a855f7",
        completed: "#22c55e",
        cancelled: "#ef4444",
    };
</script>

<div class="booking-detail">
    {#if isLoading}
        <div class="loading">Loading...</div>
    {:else if booking}
        <div class="header">
            <a href="/admin/bookings" class="back-link">← Back</a>
            <div class="header-main">
                <h1>Booking #{booking.id.slice(0, 8)}</h1>
                <span
                    class="status-badge"
                    style="background: {statusColors[
                        booking.status
                    ]}20; color: {statusColors[booking.status]}"
                    >{booking.status}</span
                >
            </div>
        </div>

        <div class="content-grid">
            <!-- Main Content -->
            <div class="main-col">
                <!-- Customer Info -->
                <section class="card">
                    <h2>Customer</h2>
                    <p><strong>{booking.customerName}</strong></p>
                    <p>{booking.customerEmail} • {booking.customerPhone}</p>
                </section>

                <!-- Service Details -->
                <section class="card">
                    <div class="card-header">
                        <h2>Service Details</h2>
                        {#if !editMode && (booking.status === "pending_review" || booking.status === "pending" || booking.status === "customer_confirmed")}
                            <button
                                class="edit-btn"
                                onclick={() => (editMode = true)}>Edit</button
                            >
                        {/if}
                    </div>

                    {#if editMode}
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="date">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    bind:value={editData.scheduledDate}
                                />
                            </div>
                            <div class="form-group">
                                <label for="time">Time</label>
                                <select
                                    id="time"
                                    bind:value={editData.timeSlot}
                                >
                                    <option>8:00 AM</option>
                                    <option>9:00 AM</option>
                                    <option>10:00 AM</option>
                                    <option>11:00 AM</option>
                                    <option>1:00 PM</option>
                                    <option>2:00 PM</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="total">Total ($)</label>
                                <input
                                    type="number"
                                    id="total"
                                    bind:value={editData.total}
                                />
                            </div>
                            <div class="form-group full-width">
                                <label for="notes">Notes to Customer</label>
                                <textarea
                                    id="notes"
                                    bind:value={editData.customerVisibleNotes}
                                    placeholder="Explain any changes..."
                                ></textarea>
                            </div>
                        </div>
                        <div class="edit-actions">
                            <button
                                class="btn-secondary"
                                onclick={() => (editMode = false)}
                                >Cancel</button
                            >
                            <button
                                class="btn-primary"
                                onclick={sendModifications}
                                >Send to Customer</button
                            >
                        </div>
                    {:else}
                        <div class="details-grid">
                            <div>
                                <span>Service</span><strong
                                    >{booking.serviceType}</strong
                                >
                            </div>
                            <div>
                                <span>Property</span><strong
                                    >{booking.propertyType} • {booking.squareFootage}
                                    sq ft</strong
                                >
                            </div>
                            <div>
                                <span>Rooms</span><strong
                                    >{booking.bedrooms} bed, {booking.bathrooms}
                                    bath</strong
                                >
                            </div>
                            <div>
                                <span>Date</span><strong
                                    >{new Date(
                                        booking.scheduledDate,
                                    ).toLocaleDateString()}</strong
                                >
                            </div>
                            <div>
                                <span>Time</span><strong
                                    >{booking.timeSlot}</strong
                                >
                            </div>
                            <div>
                                <span>Frequency</span><strong
                                    >{booking.frequency}</strong
                                >
                            </div>
                        </div>
                        <div class="address-row">
                            <span>📍</span>
                            <div>
                                <strong>{booking.address}</strong>
                                <p>
                                    {booking.city}, {booking.province}
                                    {booking.postalCode}
                                </p>
                            </div>
                        </div>
                    {/if}
                </section>

                <!-- Staff Assignment -->
                {#if booking.status === "paid" || booking.status === "assigned"}
                    <section class="card">
                        <h2>Assign Staff</h2>
                        <div class="staff-list">
                            {#each staff as member}
                                <label class="staff-option">
                                    <input
                                        type="checkbox"
                                        value={member.id}
                                        bind:group={selectedStaff}
                                    />
                                    <span>{member.name}</span>
                                </label>
                            {/each}
                        </div>
                        <button
                            class="btn-primary"
                            onclick={assignSelectedStaff}
                            >Assign Selected</button
                        >
                    </section>
                {/if}
            </div>

            <!-- Sidebar -->
            <div class="side-col">
                <!-- Pricing -->
                <section class="card">
                    <h2>Pricing</h2>
                    {#if booking.originalTotal !== booking.total}
                        <div class="price-row">
                            <span>Original</span><span class="strike"
                                >${booking.originalTotal}</span
                            >
                        </div>
                    {/if}
                    <div class="price-row total">
                        <span>Total</span><span>${booking.total}</span>
                    </div>
                </section>

                <!-- Actions -->
                <section class="card actions-card">
                    <h2>Actions</h2>
                    {#if booking.status === "pending_review" || booking.status === "pending"}
                        <button
                            class="btn-primary full"
                            onclick={approveDirectly}
                            >Approve (No Changes)</button
                        >
                        <button
                            class="btn-secondary full"
                            onclick={() => (editMode = true)}
                            >Modify Booking</button
                        >
                    {:else if booking.status === "customer_confirmed"}
                        <button class="btn-primary full" onclick={finalApprove}
                            >Final Approval</button
                        >
                    {/if}
                    {#if booking.status !== "completed" && booking.status !== "cancelled"}
                        <button class="btn-danger full" onclick={cancelBooking}
                            >Cancel Booking</button
                        >
                    {/if}
                </section>

                <!-- Timeline -->
                <section class="card">
                    <h2>Timeline</h2>
                    <div class="timeline">
                        <div class="tl-item">
                            <span>Created</span><span
                                >{new Date(
                                    booking.created,
                                ).toLocaleString()}</span
                            >
                        </div>
                        {#if booking.modifiedAt}
                            <div class="tl-item">
                                <span>Modified</span><span
                                    >{new Date(
                                        booking.modifiedAt,
                                    ).toLocaleString()}</span
                                >
                            </div>
                        {/if}
                        {#if booking.customerApprovedAt}
                            <div class="tl-item">
                                <span>Customer Confirmed</span><span
                                    >{new Date(
                                        booking.customerApprovedAt,
                                    ).toLocaleString()}</span
                                >
                            </div>
                        {/if}
                        {#if booking.adminApprovedAt}
                            <div class="tl-item">
                                <span>Approved</span><span
                                    >{new Date(
                                        booking.adminApprovedAt,
                                    ).toLocaleString()}</span
                                >
                            </div>
                        {/if}
                        {#if booking.paidAt}
                            <div class="tl-item">
                                <span>Paid</span><span
                                    >{new Date(
                                        booking.paidAt,
                                    ).toLocaleString()}</span
                                >
                            </div>
                        {/if}
                    </div>
                </section>
            </div>
        </div>
    {/if}
</div>

<style>
    .booking-detail {
        color: var(--text-primary);
    }
    .loading {
        text-align: center;
        padding: 3rem;
        opacity: 0.5;
    }
    .back-link {
        color: var(--color-accent);
        text-decoration: none;
        font-size: 0.875rem;
    }
    .header-main {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    .header-main h1 {
        font-size: 1.5rem;
        margin: 0;
    }
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .content-grid {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 1.5rem;
        margin-top: 1.5rem;
    }
    .card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.25rem;
        border: 1px solid var(--border-color);
        margin-bottom: 1rem;
    }
    .card h2 {
        font-size: 0.875rem;
        margin: 0 0 1rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .edit-btn {
        background: none;
        border: none;
        color: var(--color-accent);
        cursor: pointer;
        font-size: 0.875rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .form-group.full-width {
        grid-column: span 2;
    }
    .form-group label {
        font-size: 0.75rem;
        opacity: 0.6;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.5rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-primary);
    }
    .form-group textarea {
        min-height: 80px;
        resize: none;
    }
    .edit-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1rem;
    }

    .details-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 1rem;
    }
    .details-grid > div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .details-grid span {
        font-size: 0.7rem;
        opacity: 0.5;
    }
    .address-row {
        display: flex;
        gap: 0.75rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    .address-row p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.6;
    }

    .staff-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    .staff-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        background: var(--glass-bg);
        border-radius: 6px;
        cursor: pointer;
    }

    .price-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
    }
    .price-row.total {
        font-size: 1.25rem;
        font-weight: 600;
        border-top: 1px solid var(--border-color);
        margin-top: 0.5rem;
        padding-top: 1rem;
    }
    .strike {
        text-decoration: line-through;
        opacity: 0.5;
    }

    .actions-card {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .btn-primary {
        padding: 0.75rem 1rem;
        background: var(--color-accent);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
    .btn-secondary {
        padding: 0.75rem 1rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
    }
    .btn-danger {
        padding: 0.75rem 1rem;
        background: rgba(239, 68, 68, 0.1);
        border: none;
        color: #ef4444;
        border-radius: 8px;
        cursor: pointer;
    }
    .full {
        width: 100%;
    }

    .timeline {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .tl-item {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
    }
    .tl-item span:first-child {
        opacity: 0.5;
    }

    @media (max-width: 1024px) {
        .content-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
