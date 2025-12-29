<script lang="ts">
    const reviews = [
        {
            id: "1",
            customer: "Sarah J.",
            rating: 5,
            title: "Amazing service!",
            date: "Dec 7, 2024",
            status: "approved",
            booking: "B001",
        },
        {
            id: "2",
            customer: "Michael C.",
            rating: 4,
            title: "Very good cleaning",
            date: "Dec 6, 2024",
            status: "pending",
            booking: "B002",
        },
        {
            id: "3",
            customer: "Emily D.",
            rating: 5,
            title: "Exceeded expectations",
            date: "Dec 5, 2024",
            status: "approved",
            booking: "B003",
        },
        {
            id: "4",
            customer: "James W.",
            rating: 3,
            title: "Could be better",
            date: "Dec 4, 2024",
            status: "pending",
            booking: "B004",
        },
    ];

    let statusFilter = $state("all");
    const filteredReviews = $derived(() =>
        reviews.filter(
            (r) => statusFilter === "all" || r.status === statusFilter,
        ),
    );
</script>

<div class="reviews-page">
    <div class="page-header">
        <div>
            <h1>Reviews</h1>
            <p>Moderate customer reviews</p>
        </div>
    </div>

    <div class="filters">
        <button
            class="filter-btn"
            class:active={statusFilter === "all"}
            onclick={() => (statusFilter = "all")}>All</button
        >
        <button
            class="filter-btn"
            class:active={statusFilter === "pending"}
            onclick={() => (statusFilter = "pending")}>Pending</button
        >
        <button
            class="filter-btn"
            class:active={statusFilter === "approved"}
            onclick={() => (statusFilter = "approved")}>Approved</button
        >
    </div>

    <div class="reviews-list">
        {#each filteredReviews() as review}
            <div class="review-card">
                <div class="review-top">
                    <div class="stars">
                        {"★".repeat(review.rating)}{"☆".repeat(
                            5 - review.rating,
                        )}
                    </div>
                    <span class="badge {review.status}">{review.status}</span>
                </div>
                <h3>{review.title}</h3>
                <p class="meta">
                    {review.customer} • {review.date} • Booking {review.booking}
                </p>
                <div class="actions">
                    {#if review.status === "pending"}
                        <button class="approve-btn">Approve</button>
                        <button class="reject-btn">Reject</button>
                    {:else}
                        <button class="view-btn">View</button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .reviews-page {
        color: var(--text-primary);
    }
    .page-header {
        margin-bottom: 1.5rem;
    }
    .page-header h1 {
        font-size: 1.75rem;
        margin: 0;
    }
    .page-header p {
        color: var(--text-secondary);
        margin: 0;
    }
    .filters {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }
    .filter-btn {
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: 6px;
        cursor: pointer;
    }
    .filter-btn.active {
        background: var(--color-accent);
        border-color: var(--color-accent);
        color: var(--text-primary);
    }
    .reviews-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .review-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.25rem;
        border: 1px solid var(--glass-bg);
    }
    .review-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
    .stars {
        color: #eab308;
    }
    .badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        text-transform: capitalize;
    }
    .badge.pending {
        background: #eab30820;
        color: #eab308;
    }
    .badge.approved {
        background: #22c55e20;
        color: #22c55e;
    }
    .review-card h3 {
        margin: 0 0 0.25rem;
        font-size: 1rem;
    }
    .meta {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin: 0 0 1rem;
    }
    .actions {
        display: flex;
        gap: 0.5rem;
    }
    .approve-btn {
        padding: 0.5rem 1rem;
        background: #22c55e;
        border: none;
        color: var(--text-primary);
        border-radius: 6px;
        cursor: pointer;
    }
    .reject-btn {
        padding: 0.5rem 1rem;
        background: rgba(239, 68, 68, 0.2);
        border: none;
        color: #ef4444;
        border-radius: 6px;
        cursor: pointer;
    }
    .view-btn {
        padding: 0.5rem 1rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 6px;
        cursor: pointer;
    }
</style>

