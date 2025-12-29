<script lang="ts">
    import { onMount } from "svelte";
    import { currentUser } from "$lib/stores/auth";
    import {
        getUserReviews,
        getPendingReviewBookings,
        submitReview as submitReviewService,
        type UserReview,
        type UserBooking,
    } from "$lib/services/user-dashboard";

    let reviews = $state<UserReview[]>([]);
    let pendingBookings = $state<UserBooking[]>([]);
    let isLoading = $state(true);

    let showReviewModal = $state(false);
    let selectedBooking = $state<string | null>(null);
    let rating = $state(5);
    let title = $state("");
    let comment = $state("");
    let isPublic = $state(true);
    let isSubmitting = $state(false);

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

    async function loadData() {
        if (!$currentUser?.id) return;

        isLoading = true;
        try {
            const [reviewsData, pendingData] = await Promise.all([
                getUserReviews($currentUser.id),
                getPendingReviewBookings($currentUser.id),
            ]);
            reviews = reviewsData;
            pendingBookings = pendingData;
        } catch (error) {
            console.error("Error loading reviews:", error);
        } finally {
            isLoading = false;
        }
    }

    function openReviewModal(bookingId: string) {
        selectedBooking = bookingId;
        showReviewModal = true;
    }

    function closeReviewModal() {
        showReviewModal = false;
        selectedBooking = null;
        rating = 5;
        title = "";
        comment = "";
    }

    async function submitReview() {
        if (!selectedBooking || !title || !comment || !$currentUser?.id) return;

        isSubmitting = true;
        try {
            const result = await submitReviewService(
                $currentUser.id,
                selectedBooking,
                {
                    rating,
                    title,
                    comment,
                    isPublic,
                },
            );

            if (result) {
                // Reload data to show the new review
                await loadData();
                closeReviewModal();
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            isSubmitting = false;
        }
    }

    function renderStars(count: number, interactive = false) {
        return Array(5)
            .fill(0)
            .map((_, i) => i < count);
    }

    onMount(() => {
        loadData();
    });
</script>

<svelte:head>
    <title>My Reviews - Dashboard</title>
</svelte:head>

<div class="reviews-page">
    <div class="page-header">
        <h1>My Reviews</h1>
        <p>Share your experience and help others</p>
    </div>

    <!-- Pending Reviews -->
    {#if isLoading}
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading reviews...</p>
        </div>
    {:else if pendingBookings.length > 0}
        <section class="section pending-section">
            <h2>Awaiting Your Review</h2>
            <div class="pending-cards">
                {#each pendingBookings as booking}
                    <div class="pending-card">
                        <div class="pending-info">
                            <span class="pending-type"
                                >{booking.serviceType}</span
                            >
                            <span class="pending-date"
                                >{formatDate(booking.scheduledDate)}</span
                            >
                        </div>
                        <button
                            class="review-btn"
                            onclick={() => openReviewModal(booking.id)}
                        >
                            Leave Review
                        </button>
                    </div>
                {/each}
            </div>
        </section>
    {/if}

    <!-- Past Reviews -->
    {#if !isLoading}
        <section class="section">
            <h2>Your Past Reviews</h2>

            {#if reviews.length > 0}
                <div class="reviews-list">
                    {#each reviews as review}
                        <div class="review-card">
                            <div class="review-header">
                                <div class="review-stars">
                                    {#each renderStars(review.rating) as filled}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill={filled
                                                ? "currentColor"
                                                : "none"}
                                            stroke="currentColor"
                                            stroke-width="2"
                                            class:filled
                                        >
                                            <polygon
                                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                            />
                                        </svg>
                                    {/each}
                                </div>
                                <span class="review-date"
                                    >{formatDate(review.created)}</span
                                >
                            </div>
                            <h3 class="review-title">{review.title}</h3>
                            <p class="review-comment">{review.comment}</p>

                            {#if review.response}
                                <div class="review-response">
                                    <div class="response-header">
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
                                                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                                            />
                                        </svg>
                                        <span>Response from Noble Jade</span>
                                    </div>
                                    <p>{review.response}</p>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {:else}
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
                        <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        />
                    </svg>
                    <h3>No reviews yet</h3>
                    <p>
                        After your first cleaning, you'll be able to leave a
                        review
                    </p>
                </div>
            {/if}
        </section>
    {/if}
</div>

<!-- Review Modal -->
{#if showReviewModal}
    <div class="modal-overlay" onclick={closeReviewModal}>
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <button class="modal-close" onclick={closeReviewModal}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <h2>Share Your Experience</h2>
            <p class="modal-subtitle">Your feedback helps us improve</p>

            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    submitReview();
                }}
            >
                <!-- Star Rating -->
                <div class="form-group">
                    <label>Rating</label>
                    <div class="rating-selector">
                        {#each [1, 2, 3, 4, 5] as star}
                            <button
                                type="button"
                                class="star-btn"
                                class:active={star <= rating}
                                onclick={() => (rating = star)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill={star <= rating
                                        ? "currentColor"
                                        : "none"}
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <polygon
                                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                    />
                                </svg>
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="form-group">
                    <label for="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        bind:value={title}
                        placeholder="Sum up your experience"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="comment">Your Review</label>
                    <textarea
                        id="comment"
                        bind:value={comment}
                        placeholder="Tell us about your experience..."
                        rows="4"
                        required
                    ></textarea>
                </div>

                <label class="checkbox-label">
                    <input type="checkbox" bind:checked={isPublic} />
                    <span>Make this review public on our website</span>
                </label>

                <button
                    type="submit"
                    class="submit-btn"
                    disabled={isSubmitting}
                >
                    {#if isSubmitting}
                        <span class="spinner"></span>
                        Submitting...
                    {:else}
                        Submit Review
                    {/if}
                </button>
            </form>
        </div>
    </div>
{/if}

<style>
    .reviews-page {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .page-header h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .page-header p {
        color: var(--text-secondary);
        margin: 0;
    }

    .section h2 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem 0;
    }

    /* Pending Section */
    .pending-section {
        padding: 1.5rem;
        background: linear-gradient(
            135deg,
            rgba(232, 35, 116, 0.05),
            rgba(168, 85, 247, 0.05)
        );
        border: 1px solid rgba(232, 35, 116, 0.1);
        border-radius: 16px;
    }

    .pending-cards {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .pending-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
    }

    .pending-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .pending-type {
        font-weight: 500;
        color: var(--text-primary);
    }

    .pending-date {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .review-btn {
        padding: 0.625rem 1.25rem;
        background: #e82374;
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .review-btn:hover {
        background: #d11d68;
    }

    /* Reviews List */
    .reviews-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .review-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 1.5rem;
    }

    .review-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.75rem;
    }

    .review-stars {
        display: flex;
        gap: 0.125rem;
        color: #eab308;
    }

    .review-stars svg:not(.filled) {
        color: var(--text-muted);
    }

    .review-date {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .review-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
    }

    .review-comment {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
    }

    .review-response {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--bg-tertiary);
        border-radius: 12px;
    }

    .response-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #e82374;
        margin-bottom: 0.5rem;
    }

    .review-response p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
    }

    /* Empty State */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }

    .empty-state svg {
        opacity: 0.4;
        margin-bottom: 1rem;
    }

    .empty-state h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .empty-state p {
        margin: 0;
    }

    /* Modal */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: 100;
    }

    .modal {
        background: var(--bg-primary);
        border-radius: 24px;
        padding: 2rem;
        max-width: 500px;
        width: 100%;
        position: relative;
    }

    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
    }

    .modal h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .modal-subtitle {
        color: var(--text-secondary);
        margin: 0 0 1.5rem 0;
    }

    .form-group {
        margin-bottom: 1.25rem;
    }

    .form-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }

    .rating-selector {
        display: flex;
        gap: 0.25rem;
    }

    .star-btn {
        padding: 0.25rem;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .star-btn.active {
        color: #eab308;
    }

    .star-btn:hover {
        transform: scale(1.1);
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 1rem;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #e82374;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
        cursor: pointer;
        margin-bottom: 1.5rem;
    }

    .checkbox-label input {
        accent-color: #e82374;
    }

    .submit-btn {
        width: 100%;
        padding: 1rem;
        background: #e82374;
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
        background: #d11d68;
    }

    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
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

    .loading-state .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border-color);
        border-top-color: var(--color-accent);
        margin-bottom: 1rem;
    }
</style>
