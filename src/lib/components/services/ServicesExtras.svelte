<script>
    /**
     * ServicesExtras Component
     * Displays the "Customize Your Clean With Extras" section
     * 6 cards showing additional cleaning services with icons and prices
     */

    const extras = [
        {
            title: "Laundry Wash & Fold",
            price: "From $17",
            icon: "🧺",
            color: "#4f46e5",
        },
        {
            title: "Inside Fridge Clean",
            price: "From $17",
            icon: "❄️",
            color: "#0891b2",
        },
        {
            title: "Inside Oven Clean",
            price: "From $17",
            icon: "🔥",
            color: "#ea580c",
        },
        {
            title: "Carpet Cleaning",
            price: "From $17",
            icon: "🧹",
            color: "#7c3aed",
        },
        {
            title: "Tile Cleaning",
            price: "From $17",
            icon: "✨",
            color: "#0d9488",
        },
        {
            title: "Furniture Vacuuming",
            price: "From $17",
            icon: "🛋️",
            color: "#be185d",
        },
    ];
</script>

<section class="services-extras">
    <div class="container">
        <!-- Header Row -->
        <div class="header-row">
            <div class="header-content">
                <h2>Customize Your Clean With Extras</h2>
                <p>
                    Whether you're preparing for guests, moving in or out, or
                    simply want to refresh your space, our add-ons help you
                    personalize your cleaning experience.
                </p>
            </div>
            <a href="/contact" class="book-now-btn">Book Now</a>
        </div>

        <!-- Extras Grid -->
        <div class="extras-grid">
            {#each extras as extra}
                <a href="/services" class="extra-card">
                    <div
                        class="extra-icon"
                        style="background-color: {extra.color}15; color: {extra.color}"
                    >
                        <span class="icon-emoji">{extra.icon}</span>
                    </div>
                    <div class="extra-content">
                        <h4>{extra.title}</h4>
                        <span class="price">{extra.price}</span>
                    </div>
                    <div class="extra-arrow">
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
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>

<style>
    .services-extras {
        background-color: var(--light-blue, #ecf4fd);
        padding: 4rem 1rem;
        border-radius: var(--border-radius-lg, 1.5rem);
    }

    :global(.dark) .services-extras {
        background-color: rgba(19, 132, 226, 0.1);
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
        margin-bottom: 2.5rem;
        flex-wrap: wrap;
    }

    .header-content {
        flex: 1;
        min-width: 300px;
    }

    .header-content h2 {
        font-size: 2rem;
        font-weight: 600;
        color: var(--text-primary, #1a1a1a);
        margin-bottom: 0.75rem;
    }

    :global(.dark) .header-content h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .header-content p {
        color: var(--text-secondary, #666);
        line-height: 1.6;
        max-width: 600px;
    }

    :global(.dark) .header-content p {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .book-now-btn {
        display: inline-flex;
        align-items: center;
        padding: 0.875rem 1.75rem;
        background-color: var(--accent-color, #e82374);
        color: white;
        font-weight: 500;
        border-radius: var(--border-radius-md, 0.75rem);
        text-decoration: none;
        transition: all 0.3s ease;
        white-space: nowrap;
    }

    .book-now-btn:hover {
        background-color: var(--accent-hover, #d01e68);
        transform: translateY(-2px);
    }

    .extras-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
    }

    .extra-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: white;
        border-radius: var(--border-radius-lg, 1.5rem);
        text-decoration: none;
        transition: all 0.3s ease;
        position: relative;
    }

    :global(.dark) .extra-card {
        background-color: var(--bg-secondary-dark, #1e1e1e);
    }

    .extra-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    :global(.dark) .extra-card:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .extra-icon {
        width: 80px;
        height: 80px;
        flex-shrink: 0;
        border-radius: var(--border-radius-md, 0.75rem);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-emoji {
        font-size: 2.5rem;
    }

    .extra-content {
        flex: 1;
    }

    .extra-content h4 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary, #1a1a1a);
        margin-bottom: 0.25rem;
    }

    :global(.dark) .extra-content h4 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .price {
        font-size: 0.9rem;
        color: var(--primary-color, #1384e2);
        font-weight: 500;
    }

    .extra-arrow {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid var(--accent-color, #e82374);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--accent-color, #e82374);
        transition: all 0.3s ease;
    }

    .extra-card:hover .extra-arrow {
        background-color: var(--accent-color, #e82374);
        color: white;
        transform: rotate(-45deg);
    }

    /* Responsive */
    @media (max-width: 992px) {
        .extras-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 640px) {
        .services-extras {
            padding: 3rem 1rem;
        }

        .header-row {
            flex-direction: column;
            align-items: stretch;
        }

        .book-now-btn {
            align-self: flex-start;
        }

        .extras-grid {
            grid-template-columns: 1fr;
        }

        .header-content h2 {
            font-size: 1.5rem;
        }
    }
</style>
