<script>
    /**
     * ServicesPackages Component
     * Displays pricing packages: Fresh Start, Comfort Clean, Deep Refresh
     * Includes checkmark features row and 3 pricing cards
     */

    const packages = [
        {
            name: "Fresh Start",
            type: "BASIC PACKAGE",
            description: "Light maintenance, small apartments, regular upkeep",
            price: 90,
            priceText: "Per visit (up to 2 bed / 1 bath)",
            includesText: "What's included:",
            features: [
                "Dusting all surfaces",
                "Vacuuming & mopping floors",
                "Kitchen wipe-down",
                "Bathroom cleaning",
                "Trash removal",
            ],
            highlighted: false,
        },
        {
            name: "Comfort Clean",
            type: "STANDARD PACKAGE",
            description: "Families, regular home care, busy professionals",
            price: 130,
            priceText: "Per visit (up to 2 bed / 1 bath)",
            includesText: "Includes everything in Basic, plus:",
            features: [
                "Make beds/change linens",
                "Inside microwave",
                "Baseboard wipe-down",
                "Spot wall cleaning",
                "Light fixture & ceiling fan dusting",
            ],
            highlighted: true,
            badge: "Most Popular",
        },
        {
            name: "Deep Refresh",
            type: "PREMIUM PACKAGE",
            description: "Seasonal deep clean, first-time clients, post-event",
            price: 180,
            priceText: "Per visit (up to 2 bed / 1 bath)",
            includesText: "Includes everything in Standard, plus:",
            features: [
                "Inside oven & fridge",
                "Inside cabinets",
                "Window interiors (up to 10)",
                "Detailed baseboard & molding",
                "Door frames & light switches",
            ],
            highlighted: false,
        },
    ];

    const checkmarks = ["Reliable", "Affordable", "Professional"];
</script>

<section class="services-packages">
    <div class="container">
        <!-- Header -->
        <div class="header">
            <span class="superheadline">what we offer</span>
            <h2 class="">Choose One Of Our Packages</h2>
        </div>

        <!-- Checkmarks Row -->
        <div class="checkmarks-row">
            {#each checkmarks as item}
                <div class="checkmark-item">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"
                        />
                    </svg>
                    <span>{item}</span>
                </div>
            {/each}
        </div>

        <!-- Pricing Cards -->
        <div class="packages-grid">
            {#each packages as pkg}
                <div class="package-card" class:highlighted={pkg.highlighted}>
                    {#if pkg.badge}
                        <div class="badge">{pkg.badge}</div>
                    {/if}
                    <div class="package-header">
                        <span class="package-type">{pkg.type}</span>
                        <h3>{pkg.name}</h3>
                        <p class="package-description">{pkg.description}</p>
                    </div>
                    <div class="price-section">
                        <span class="currency">$</span>
                        <span class="price">{pkg.price}</span>
                    </div>
                    <p class="price-text">{pkg.priceText}</p>
                    <a
                        href="/contact"
                        class="continue-btn"
                        class:filled={pkg.highlighted}
                    >
                        Continue
                    </a>
                    <p class="includes-text">{pkg.includesText}</p>
                    <ul class="features-list">
                        {#each pkg.features as feature}
                            <li>{feature}</li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .services-packages {
        padding: 4rem 1rem;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .header {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .superheadline {
        text-transform: uppercase;
        font-size: 0.875rem;
        letter-spacing: 0.1em;
        color: var(--text-secondary, #666);
        margin-bottom: 0.5rem;
        display: block;
    }

    :global(.dark) .superheadline {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .header h2 {
        font-size: 3.25rem;
        font-weight: 400;
        color: var(--text-primary, #1a1a1a);
    }

    :global(.dark) .header h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .checkmarks-row {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
        margin-bottom: 2.5rem;
    }

    .checkmark-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent-color, #e82374);
        font-size: 1.125rem;
        font-weight: 500;
    }

    .checkmark-item span {
        color: var(--text-primary, #1a1a1a);
    }

    :global(.dark) .checkmark-item span {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .packages-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        align-items: end;
    }

    .package-card {
        background-color: white;
        border: 2px solid var(--border-color, #e5e5e5);
        border-radius: var(--border-radius-lg, 1.5rem);
        padding: 2rem;
        position: relative;
        transition: all 0.3s ease;
    }

    :global(.dark) .package-card {
        background-color: var(--bg-secondary-dark, #1e1e1e);
        border-color: var(--border-color-dark, #333);
    }

    .package-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    :global(.dark) .package-card:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .package-card.highlighted {
        background-color: var(--bg-primary-dark, #1a1a1a);
        border-color: var(--bg-primary-dark, #1a1a1a);
        padding-top: 3.5rem;
    }

    :global(.dark) .package-card.highlighted {
        background-color: var(--primary-color, #1384e2);
        border-color: var(--primary-color, #1384e2);
    }

    .badge {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        background-color: var(--accent-color, #e82374);
        color: white;
        padding: 0.5rem 1.25rem;
        border-radius: var(--border-radius-md, 0.75rem);
        font-size: 0.875rem;
        font-weight: 600;
        white-space: nowrap;
    }

    .package-header {
        margin-bottom: 1.5rem;
    }

    .package-type {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        color: var(--text-secondary, #666);
        display: block;
        margin-bottom: 0.5rem;
    }

    .package-card.highlighted .package-type {
        color: rgba(255, 255, 255, 0.7);
    }

    .package-header h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary, #1a1a1a);
        margin-bottom: 0.5rem;
    }

    :global(.dark) .package-header h3 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .package-card.highlighted .package-header h3 {
        color: white;
    }

    .package-description {
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
        line-height: 1.5;
    }

    :global(.dark) .package-description {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .package-card.highlighted .package-description {
        color: rgba(255, 255, 255, 0.7);
    }

    .price-section {
        display: flex;
        align-items: flex-start;
        margin-bottom: 0.25rem;
    }

    .currency {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary, #1a1a1a);
        margin-top: 0.5rem;
    }

    :global(.dark) .currency {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .package-card.highlighted .currency {
        color: white;
    }

    .price {
        font-size: 4rem;
        font-weight: 700;
        line-height: 1;
        color: var(--text-primary, #1a1a1a);
    }

    :global(.dark) .price {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .package-card.highlighted .price {
        color: white;
    }

    .price-text {
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
        margin-bottom: 1.5rem;
    }

    :global(.dark) .price-text {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .package-card.highlighted .price-text {
        color: rgba(255, 255, 255, 0.7);
    }

    .continue-btn {
        display: block;
        width: 100%;
        padding: 1rem;
        text-align: center;
        border: 2px solid var(--accent-color, #e82374);
        color: var(--accent-color, #e82374);
        background-color: transparent;
        border-radius: var(--border-radius-md, 0.75rem);
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin-bottom: 1.5rem;
        position: relative;
        overflow: hidden;
    }

    .continue-btn::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transition: left 0.5s ease;
    }

    .continue-btn:hover {
        background-color: var(--accent-color, #e82374);
        color: white;
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 25px rgba(232, 35, 116, 0.35);
    }

    .continue-btn:hover::before {
        left: 100%;
    }

    .continue-btn:active {
        transform: translateY(0) scale(0.98);
        box-shadow: 0 4px 15px rgba(232, 35, 116, 0.25);
    }

    .continue-btn.filled {
        background-color: var(--accent-color, #e82374);
        color: white;
    }

    .continue-btn.filled:hover {
        background-color: var(--accent-hover, #d01e68);
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 25px rgba(232, 35, 116, 0.4);
    }

    .continue-btn.filled:active {
        transform: translateY(0) scale(0.98);
    }

    .includes-text {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary, #1a1a1a);
        margin-bottom: 0.75rem;
    }

    :global(.dark) .includes-text {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .package-card.highlighted .includes-text {
        color: white;
    }

    .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .features-list li {
        position: relative;
        padding-left: 1.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .features-list li {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .package-card.highlighted .features-list li {
        color: rgba(255, 255, 255, 0.8);
    }

    .features-list li::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--accent-color, #e82374);
        font-weight: 600;
    }

    .package-card.highlighted .features-list li::before {
        color: white;
    }

    /* Responsive */
    @media (max-width: 992px) {
        .packages-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
        }

        .package-card.highlighted {
            order: -1;
        }
    }

    @media (max-width: 640px) {
        .services-packages {
            padding: 3rem 1rem;
        }

        .header h2 {
            font-size: 1.75rem;
        }

        .checkmarks-row {
            gap: 1rem;
        }

        .price {
            font-size: 3rem;
        }
    }
</style>
