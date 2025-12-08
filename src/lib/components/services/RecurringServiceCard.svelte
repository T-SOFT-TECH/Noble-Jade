<script lang="ts">
    /**
     * RecurringServiceCard Component
     * A wide card (approx 1300x582) with two columns:
     * - Left: Large image with rounded corners
     * - Right: Title, description, features list, and price CTA
     */

    export let title: string = "Recurring Office Cleaning";
    export let description: string =
        "Our office cleaning service provides a clean, healthy, and professional workspace tailored to your needs. We offer flexible scheduling, eco-friendly products, and detailed cleaning of workspaces, common areas, restrooms, and kitchens.";
    export let imageSrc: string = "/images/image_02_services.jpg";
    export let imageAlt: string = "Service image";
    export let price: string = "$119";
    export let priceLabel: string = "/per hour";
    export let href: string = "/contact";
    export let features: string[] = [
        "Areas to clean (offices, lobbies, kitchens, restrooms, etc.)",
        "Frequency (daily, weekly, biweekly)",
        "Add-ons (carpet care, window cleaning, disinfection, etc.)",
    ];
</script>

<div class="recurring-card">
    <!-- Left: Image -->
    <div class="card-image">
        <img src={imageSrc} alt={imageAlt} loading="lazy" />
    </div>

    <!-- Right: Content -->
    <div class="card-content">
        <h3>{title}</h3>
        <p class="description">{description}</p>

        <!-- What's Included -->
        <div class="included-section">
            <div class="included-header">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        d="M9 4H15V6H20V8H18.8687L18.0977 19.131C18.0413 19.9247 17.3921 20.5 16.5 20.5H7.5C6.60788 20.5 5.9587 19.9247 5.9023 19.131L5.1313 8H4V6H9V4ZM7.14 8L7.892 19H16.108L16.86 8H7.14ZM10 10V17H8V10H10ZM16 10V17H14V10H16Z"
                    />
                </svg>
                <span>What's Included</span>
            </div>
            <ul class="features-list">
                {#each features as feature}
                    <li>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                            />
                        </svg>
                        <span>{feature}</span>
                    </li>
                {/each}
            </ul>
        </div>

        <!-- Price CTA -->
        <div class="price-cta">
            <div class="price">
                <span class="amount">{price}</span>
                <span class="label">{priceLabel}</span>
            </div>
            <a {href} class="arrow-btn" aria-label="Learn more">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                </svg>
            </a>
        </div>
    </div>
</div>

<style>
    /* CSS Variables for curved corners */
    .recurring-card {
        --curved-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M30,30 L30,0 C30,16.57 16.57,30 0,30 L30,30 Z' fill='%23000'/%3E%3C/svg%3E");
        --curved-mask-02: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M0,30 L30,30 C13.43,30 0,16.57 0,0 L0,30 Z' fill='%23000'/%3E%3C/svg%3E");
        display: grid;
        grid-template-columns: 1fr 1fr;
        background-color: var(--primary-color, #1384e2);
        border-radius: var(--border-radius-xl, 2rem);
        overflow: hidden;
        max-width: 1300px;
        min-height: 450px;
        margin: 0 auto;
        position: relative;
    }

    .card-image {
        padding: 1rem;
    }

    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--border-radius-lg, 1.5rem);
        min-height: 400px;
    }

    .card-content {
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: white;
    }

    .card-content h3 {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        font-style: italic;
    }

    .description {
        font-size: 0.95rem;
        line-height: 1.7;
        opacity: 0.9;
        margin-bottom: 1.5rem;
    }

    .included-section {
        margin-bottom: 1.5rem;
    }

    .included-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
    }

    .included-header svg {
        opacity: 0.9;
    }

    .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .features-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .features-list li svg {
        flex-shrink: 0;
        margin-top: 2px;
    }

    .price-cta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: rgba(255, 255, 255, 0.15);
        border-radius: var(--border-radius-lg, 1.5rem);
        padding: 1rem 1.25rem;
        margin-top: auto;
        position: relative;
    }

    /* Curved corner effect - left side */
    .price-cta::before {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        top: -30px;
        left: 0;
        -webkit-mask-image: var(--curved-mask-02);
        mask-image: var(--curved-mask-02);
        background-color: rgba(255, 255, 255, 0.15);
        transform: rotate(0deg);
        transition: all 300ms ease;
    }

    /* Curved corner effect - right side */
    .price-cta::after {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        top: -30px;
        right: 0;
        -webkit-mask-image: var(--curved-mask);
        mask-image: var(--curved-mask);
        background-color: rgba(255, 255, 255, 0.15);
        transform: rotate(0deg);
        transition: all 300ms ease;
    }

    .price {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
    }

    .amount {
        font-size: 2rem;
        font-weight: 700;
    }

    .label {
        font-size: 1rem;
        opacity: 0.8;
    }

    .arrow-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background-color: var(--accent-color, #e82374);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        text-decoration: none;
    }

    .arrow-btn:hover {
        background-color: var(--accent-hover, #d01e68);
        transform: rotate(-45deg) scale(1.1);
    }

    /* Responsive */
    @media (max-width: 900px) {
        .recurring-card {
            grid-template-columns: 1fr;
            min-height: auto;
        }

        .card-image {
            height: 300px;
        }

        .card-image img {
            min-height: 280px;
        }

        .card-content h3 {
            font-size: 1.5rem;
        }
    }

    @media (max-width: 640px) {
        .card-content {
            padding: 1.5rem;
        }

        .card-content h3 {
            font-size: 1.25rem;
        }

        .price-cta {
            flex-wrap: wrap;
            gap: 1rem;
        }

        .amount {
            font-size: 1.5rem;
        }
    }
</style>
