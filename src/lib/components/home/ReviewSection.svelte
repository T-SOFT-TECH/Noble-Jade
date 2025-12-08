<script lang="ts">
    import ImageCard from "$lib/components/shared/ImageCard.svelte";

    const stats = [
        { label: "Punctuality of cleaners", percentage: 96 },
        { label: "Quality of cleaning", percentage: 94 },
        { label: "Respect for your home & belongings", percentage: 100 },
    ];
</script>

<!-- Client Reviews / Satisfaction Survey Section -->
<section class="review-section">
    <div class="review-container">
        <!-- Left Column - Image Card -->
        <div class="review-image-col">
            <ImageCard
                imageSrc="/images/image_10_home_01.png"
                imageAlt="Happy client holding plant"
                badge={{
                    icon: "check",
                    number: "96%",
                    label: "Satisfaction Rate",
                }}
                width="100%"
                height="auto"
            />
        </div>

        <!-- Right Column - Content -->
        <div class="review-content-col">
            <span class="review-label">SATISFACTION SURVEY</span>
            <h2 class="review-title">What Our Clients Think</h2>

            <!-- Google Rating -->
            <div class="google-rating">
                <svg
                    class="google-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                <div class="stars">
                    {#each [1, 2, 3, 4, 5] as star}
                        <svg
                            class="star"
                            class:half={star === 5}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#FFD700"
                        >
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            />
                        </svg>
                    {/each}
                </div>
                <span class="rating-text">4.7</span>
            </div>

            <!-- Progress Bars -->
            <div class="progress-bars">
                {#each stats as stat}
                    <div class="progress-item">
                        <div class="progress-header">
                            <span class="progress-label">{stat.label}</span>
                            <span class="progress-value"
                                >{stat.percentage}%</span
                            >
                        </div>
                        <div class="progress-track">
                            <div
                                class="progress-fill"
                                style="width: {stat.percentage}%;"
                            ></div>
                        </div>
                    </div>
                {/each}
            </div>

            <p class="survey-note">
                *Clients satisfaction survey based on 298 responses
            </p>

            <a href="/reviews" class="btn-accent">View All Reviews</a>
        </div>
    </div>
</section>

<style>
    .review-section {
        padding: 4rem 1rem;
        background: var(--bg-primary, #f8f8f8);
    }

    .review-container {
        max-width: 1300px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }

    .review-image-col {
        display: flex;
        justify-content: center;
    }

    .review-content-col {
        padding-left: 2rem;
    }

    .review-label {
        display: block;
        color: var(--color-accent, #e82374);
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }

    .review-title {
        font-size: 3rem;
        font-weight: 700;
        color: var(--text-primary, #252525);
        margin: 0 0 1.5rem 0;
        line-height: 1.2;
    }

    /* Google Rating */
    .google-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .google-icon {
        width: 20px;
        height: 20px;
    }

    .stars {
        display: flex;
        gap: 2px;
    }

    .star {
        color: #ffd700;
    }

    .star.half {
        opacity: 0.6;
    }

    .rating-text {
        font-weight: 600;
        color: var(--text-primary, #252525);
        margin-left: 0.25rem;
    }

    /* Progress Bars */
    .progress-bars {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        margin-bottom: 1.5rem;
    }

    .progress-item {
        width: 100%;
    }

    .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .progress-label {
        font-size: 0.95rem;
        color: var(--text-primary, #252525);
    }

    .progress-value {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-primary, #252525);
    }

    .progress-track {
        width: 100%;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: var(--color-alternate, #1384e2);
        border-radius: 4px;
        transition: width 1s ease-out;
    }

    .survey-note {
        font-size: 0.85rem;
        color: var(--text-secondary, #777);
        margin: 0 0 2rem 0;
    }

    /* Responsive */
    @media (max-width: 992px) {
        .review-container {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .review-content-col {
            padding-left: 0;
        }

        .review-title {
            font-size: 2.25rem;
        }
    }
</style>
