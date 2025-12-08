<script lang="ts">
    /**
     * DiscountCards Component
     * Displays recurring client discount offers in 3 cards
     * - 5% Off Monthly Visits
     * - 10% Off Bi-Weekly Visits
     * - 15% Off Weekly Visits (highlighted)
     */

    const discounts = [
        {
            percentage: "5%",
            label: "Off Monthly Visits",
            image: "/images/spray-bottle.webp",
            highlighted: false,
        },
        {
            percentage: "10%",
            label: "Off Bi-Weekly Visits",
            image: "/wp-content/uploads/sites/3/2025/07/image_03_services.png",
            highlighted: false,
        },
        {
            percentage: "15%",
            label: "Off Weekly Visits",
            image: "/images/hand_pink_glove.png",
            highlighted: true,
        },
    ];
</script>

<section class="discount-section">
    <div class="container">
        <div class="discount-grid">
            {#each discounts as discount}
                <div
                    class="discount-card"
                    class:highlighted={discount.highlighted}
                >
                    <div class="discount-content">
                        <span
                            class="percentage"
                            class:highlighted={discount.highlighted}
                        >
                            {discount.percentage}
                        </span>
                        <span class="label">{discount.label}</span>
                        <span class="note">*Recurring clients discounts</span>
                    </div>
                    <div class="discount-image">
                        <img
                            src={discount.image}
                            alt={discount.label}
                            loading="lazy"
                        />
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .discount-section {
        padding: 2rem 1rem;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .discount-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .discount-card {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        padding: 1.5rem 1.25rem;
        padding-right: 0;
        background-color: var(--light-blue, #ecf4fd);
        border-radius: var(--border-radius-lg, 1.5rem);
        min-height: 140px;
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
    }

    :global(.dark) .discount-card {
        background-color: rgba(19, 132, 226, 0.1);
    }

    .discount-card.highlighted {
        background-color: var(--primary-color, #1384e2);
    }

    .discount-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    :global(.dark) .discount-card:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .discount-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .percentage {
        font-size: 3rem;
        font-weight: 400;
        color: var(--primary-color, #1384e2);
        line-height: 1;
    }

    .percentage.highlighted {
        color: white;
    }

    :global(.dark) .percentage:not(.highlighted) {
        color: var(--primary-color, #1384e2);
    }

    .label {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary, #1a1a1a);
    }

    :global(.dark) .label {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .discount-card.highlighted .label {
        color: white;
    }

    .note {
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
        margin-top: 0.5rem;
    }

    :global(.dark) .note {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .discount-card.highlighted .note {
        color: rgba(255, 255, 255, 0.7);
    }

    .discount-image {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 140px;
        height: 140px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
    }

    .discount-image img {
        width: 100%;
        height: auto;
        max-height: 140px;
        object-fit: contain;
        object-position: bottom right;
    }

    /* Responsive */
    @media (max-width: 900px) {
        .discount-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
        }
    }

    @media (max-width: 640px) {
        .percentage {
            font-size: 2rem;
        }

        .label {
            font-size: 0.9rem;
        }
    }
</style>
