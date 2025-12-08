<script lang="ts">
    import ServicesHero from "$lib/components/services/ServicesHero.svelte";
    import FAQSection from "$lib/components/home/FAQSection.svelte";

    // Pricing packages data
    const packages = [
        {
            label: "BASIC PACKAGE",
            name: "Fresh Start",
            description: "Light maintenance, small apartments, regular upkeep",
            price: 90,
            priceNote: "Per visit (up to 2 bed / 1 bath)",
            isPopular: false,
            includes: "What's included:",
            features: [
                "Dusting all surfaces",
                "Vacuuming & mopping floors",
                "Kitchen wipe-down",
                "Bathroom cleaning",
                "Trash removal",
            ],
        },
        {
            label: "STANDARD PACKAGE",
            name: "Comfort Clean",
            description: "Families, regular home care, busy professionals",
            price: 130,
            priceNote: "Per visit (up to 2 bed / 1 bath)",
            isPopular: true,
            includes: "Includes everything in Basic, plus:",
            features: [
                "Make beds/change linens",
                "Inside microwave",
                "Baseboard wipe-down",
                "Spot wall cleaning",
                "Light fixture & ceiling fan dusting",
            ],
        },
        {
            label: "PREMIUM PACKAGE",
            name: "Deep Refresh",
            description: "Seasonal deep clean, first-time clients, post-event",
            price: 180,
            priceNote: "Per visit (up to 2 bed / 1 bath)",
            isPopular: false,
            includes: "Includes everything in Standard, plus:",
            features: [
                "Inside oven & fridge",
                "Inside cabinets",
                "Window interiors (up to 10)",
                "Detailed baseboard & molding",
                "Door frames & light switches",
            ],
        },
    ];

    // Tab data for price list
    let activeTab = 0;
    const tabs = [
        {
            name: "Home Cleaning",
            icon: "home",
            items: [
                {
                    service: "Standard Cleaning",
                    description:
                        "Dusting, vacuuming, mopping, kitchen, bathroom cleaning",
                    price: "$90",
                    note: "(up to 2 bed/1 bath)",
                },
                {
                    service: "Deep Cleaning",
                    description: "Includes baseboards, behind appliances, etc.",
                    price: "$160",
                    note: "(up to 2 bed/1 bath)",
                },
                {
                    service: "Move in/out Cleaning",
                    description:
                        "Empty home, deep clean of all rooms, bathrooms, kitchen",
                    price: "$180 – $250",
                    note: "",
                },
                {
                    service: "Post-Construction Cleaning",
                    description: "Debris removal, dust wipe-down, polishing",
                    price: "$250+",
                    note: "",
                },
            ],
        },
        {
            name: "Office Cleaning",
            icon: "building",
            items: [
                {
                    service: "Daily Office Clean",
                    description: "Trash, vacuuming, restrooms, kitchen",
                    price: "$75/visit",
                    note: "(up to 1,500 sq ft)",
                },
                {
                    service: "Weekly Deep Office",
                    description: "Includes full wipe-downs, carpet care",
                    price: "$150/visit",
                    note: "(up to 1,500 sq ft)",
                },
                {
                    service: "Medical/Dental Cleaning",
                    description: "Sanitization and specialized protocols",
                    price: "Custom Quote",
                    note: "",
                },
            ],
        },
        {
            name: "Add-On Services",
            icon: "plus",
            items: [
                {
                    service: "Inside Fridge",
                    description: "Deep clean interior shelves and drawers",
                    price: "$25",
                    note: "",
                },
                {
                    service: "Inside Oven",
                    description: "Remove grease and baked-on residue",
                    price: "$25",
                    note: "",
                },
                {
                    service: "Inside Windows",
                    description: "Clean interior window glass",
                    price: "$5/window",
                    note: "",
                },
                {
                    service: "Laundry (Wash, Dry, Fold)",
                    description: "One load of laundry",
                    price: "$20/load",
                    note: "",
                },
                {
                    service: "Organizing",
                    description: "Light organization of closets or pantry",
                    price: "$30/hr",
                    note: "",
                },
            ],
        },
    ];
</script>

<svelte:head>
    <title>Prices - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="View our transparent pricing for cleaning services. Choose from Basic, Standard, or Premium packages to fit your needs and budget."
    />
</svelte:head>

<div class="prices-page">
    <!-- Hero Section - Like Services Hero -->
    <ServicesHero
        titleText="Cleaning Services Packages & Pricing"
        backgroundText="pricing"
        backgroundImage="/images/about-hero.webp"
        buttonText="Get Quote"
        buttonLink="/get-quote"
        testimonial={{
            imageSrc: "/images/credentials_home_01.png",
            text: "Rebooking Rate",
            highlight: "80%",
        }}
    />

    <!-- Packages Section -->
    <section class="packages-section">
        <div class="container">
            <div class="section-header">
                <span class="superheadline">what we offer</span>
                <h2>Choose One Of Our Packages</h2>
                <div class="features-row">
                    <div class="feature">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                            />
                        </svg>
                        <span>Reliable</span>
                    </div>
                    <div class="feature">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                            />
                        </svg>
                        <span>Affordable</span>
                    </div>
                    <div class="feature">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                            />
                        </svg>
                        <span>Professional</span>
                    </div>
                </div>
            </div>

            <div class="packages-grid">
                {#each packages as pkg}
                    <div class="package-card" class:popular={pkg.isPopular}>
                        {#if pkg.isPopular}
                            <div class="popular-badge">Most Popular</div>
                        {/if}
                        <span class="package-label">{pkg.label}</span>
                        <h3>{pkg.name}</h3>
                        <p class="package-description">{pkg.description}</p>
                        <div class="price">
                            <span class="currency">$</span>
                            <span class="amount">{pkg.price}</span>
                        </div>
                        <span class="price-note">{pkg.priceNote}</span>
                        <a
                            href="/get-quote"
                            class="package-btn"
                            class:filled={pkg.isPopular}
                        >
                            Continue
                        </a>
                        <span class="includes-text">{pkg.includes}</span>
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

    <!-- Stats Cards Section -->
    <section class="stats-section">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-card blue">
                    <div class="stat-left">
                        <div class="stat-top-content">
                            <div class="stat-number">
                                80<span class="percent">%</span>
                            </div>
                            <h4>Clients Rebook Monthly</h4>
                        </div>
                        <p class="stat-bottom-text">
                            <span class="check-circle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                    />
                                </svg>
                            </span>
                            Book online, by phone or through social media.
                        </p>
                    </div>
                    <div class="stat-image">
                        <img
                            src="/wp-content/uploads/sites/3/2025/07/image_01_prices.png"
                            alt="Rebook statistic"
                        />
                    </div>
                    <!-- Curved corner element -->
                    <div class="curved-corner"></div>
                </div>
                <div class="stat-card pink">
                    <div class="stat-top">
                        <div class="stat-number">
                            10<span class="percent">%</span>
                        </div>
                        <h4>Off Bi-Weekly Visits</h4>
                    </div>
                    <p class="stat-bottom">
                        <span class="check-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                />
                            </svg>
                        </span>
                        Recurring clients discount
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Price List Section -->
    <section class="price-list-section">
        <div class="container">
            <div class="section-header-row">
                <div class="header-left">
                    <span class="superheadline">OFFERS AND DISCOUNTS</span>
                    <h2>Cleaning Services Price List</h2>
                </div>
                <a href="/get-quote" class="cta-btn">Get a Quote</a>
            </div>

            <div class="tabs-container">
                <div class="tabs-header">
                    {#each tabs as tab, index}
                        <button
                            class="tab-btn"
                            class:active={activeTab === index}
                            on:click={() => (activeTab = index)}
                        >
                            {#if tab.icon === "home"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                                    />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            {:else if tab.icon === "building"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <rect
                                        x="4"
                                        y="2"
                                        width="16"
                                        height="20"
                                        rx="2"
                                        ry="2"
                                    />
                                    <path d="M9 22v-4h6v4" /><path
                                        d="M8 6h.01"
                                    /><path d="M16 6h.01" />
                                    <path d="M12 6h.01" /><path
                                        d="M12 10h.01"
                                    /><path d="M12 14h.01" />
                                    <path d="M16 10h.01" /><path
                                        d="M16 14h.01"
                                    /><path d="M8 10h.01" />
                                    <path d="M8 14h.01" />
                                </svg>
                            {:else}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <circle cx="12" cy="12" r="10" /><line
                                        x1="12"
                                        y1="8"
                                        x2="12"
                                        y2="16"
                                    />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            {/if}
                            <span>{tab.name}</span>
                        </button>
                    {/each}
                </div>

                <div class="tab-content">
                    {#each tabs[activeTab].items as item, index}
                        <div class="price-row">
                            <div class="service-name">
                                <h4>{item.service}</h4>
                            </div>
                            <div class="service-description">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="var(--alternate-color)"
                                >
                                    <path
                                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                    />
                                </svg>
                                <span>{item.description}</span>
                            </div>
                            <div class="service-price">
                                <span class="price-value">{item.price}</span>
                                {#if item.note}
                                    <span class="price-note">{item.note}</span>
                                {/if}
                            </div>
                        </div>
                        {#if index < tabs[activeTab].items.length - 1}
                            <div class="row-divider"></div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <FAQSection />
</div>

<style>
    .prices-page {
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .superheadline {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        color: var(--text-secondary, #666);
        display: block;
        margin-bottom: 0.5rem;
    }

    :global(.dark) .superheadline {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    /* Packages Section */
    .packages-section {
        padding: 5rem 1rem;
        background: var(--light-blue, #ecf4fd);
        border-radius: var(--border-radius-xl, 2rem);
        margin: 3rem 1rem 0;
        position: relative;
        z-index: 1;
    }

    :global(.dark) .packages-section {
        background: var(--bg-secondary-dark, #252525);
    }

    .section-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .section-header h2 {
        font-size: 3.5rem;
        font-weight: 500;
        margin: 0 0 1rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .section-header h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .features-row {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .feature {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent-color, #e82374);
        font-weight: 500;
    }

    .packages-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .package-card {
        background: white;
        border-radius: var(--border-radius-lg, 1.5rem);
        padding: 2rem;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    :global(.dark) .package-card {
        background: var(--bg-primary-dark, #1a1a1a);
    }

    .package-card.popular {
        box-shadow: 0 4px 15px rgba(232, 35, 116, 0.08);
        padding-top: 3rem;
    }

    .popular-badge {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background: var(--accent-color, #e82374);
        color: white;
        text-align: center;
        padding: 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-radius: var(--border-radius-lg, 1.5rem)
            var(--border-radius-lg, 1.5rem) 0 0;
    }

    .package-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-secondary, #666);
        margin-bottom: 0.5rem;
    }

    :global(.dark) .package-label {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .package-card h3 {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 0 0 0.5rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .package-card h3 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .package-description {
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
        margin-bottom: 1.5rem;
    }

    :global(.dark) .package-description {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .price {
        display: flex;
        align-items: flex-start;
        margin-bottom: 0.25rem;
    }

    .currency {
        font-size: 1.5rem;
        font-weight: 500;
        color: var(--text-primary, #252525);
    }

    .amount {
        font-size: 3rem;
        font-weight: 500;
        line-height: 1;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .currency,
    :global(.dark) .amount {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .price-note {
        font-size: 0.75rem;
        color: var(--text-secondary, #666);
        margin-bottom: 1.5rem;
    }

    :global(.dark) .price-note {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .package-btn {
        position: relative;
        display: block;
        width: 100%;
        padding: 0.875rem;
        border-radius: 50px;
        text-align: center;
        text-decoration: none;
        font-weight: 500;
        border: 2px solid var(--accent-color, #e82374);
        color: var(--accent-color, #e82374);
        background: transparent;
        margin-bottom: 1.5rem;
        overflow: hidden;
        z-index: 1;
        transition: color 0.4s ease;
    }

    .package-btn::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--accent-color, #e82374);
        border-radius: 50px;
        z-index: -1;
        transition: transform 0.4s ease;
        transform: scaleX(0);
        transform-origin: right;
    }

    .package-btn:hover {
        color: white;
    }

    .package-btn:hover::before {
        transform: scaleX(1);
        transform-origin: left;
    }

    .package-btn.filled {
        color: white;
    }

    .package-btn.filled::before {
        transform: scaleX(1);
    }

    .package-btn.filled:hover {
        color: var(--accent-color, #e82374);
    }

    .package-btn.filled:hover::before {
        transform: scaleX(0);
        transform-origin: right;
    }

    .includes-text {
        font-size: 0.75rem;
        color: var(--text-secondary, #666);
        margin-bottom: 0.75rem;
    }

    :global(.dark) .includes-text {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .features-list li {
        position: relative;
        padding-left: 1.25rem;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .features-list li {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .features-list li::before {
        content: "•";
        position: absolute;
        left: 0;
        color: var(--accent-color, #e82374);
    }

    /* Stats Section */
    .stats-section {
        padding: 3rem 1rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
    }

    .stat-card {
        border-radius: var(--border-radius-lg, 1.5rem);
        padding: 2rem;
        color: white;
    }

    .stat-card.blue {
        background: linear-gradient(
            135deg,
            var(--alternate-color, #1384e2),
            #0a5a9e
        );
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: stretch;
        position: relative;
        border-radius: var(--border-radius-lg, 1.5rem);
        min-height: 200px;
        overflow: visible;
    }

    .curved-corner {
        --corner-bg: var(--bg-primary, #f8f8f8);
        position: absolute;
        bottom: 0;
        right: 0;
        width: 50px;
        height: 50px;
        background: var(--corner-bg);
        border-top-left-radius: 30px;
        z-index: 10;
    }

    .curved-corner::before {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
    }

    :global(.dark) .curved-corner {
        --corner-bg: var(--bg-primary-dark, #1a1a1a);
    }

    .stat-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2rem;
    }

    .stat-top-content {
        flex: 1;
    }

    .stat-bottom-text {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        opacity: 0.9;
        margin: 0;
        color: white;
    }

    .stat-card.pink {
        background: var(--accent-color, #e82374);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 220px;
    }

    .stat-top {
        flex: 1;
    }

    .stat-bottom {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        opacity: 0.9;
        margin: 0;
    }

    .check-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        flex-shrink: 0;
    }

    .stat-number {
        font-size: 4rem;
        font-weight: 500;
        line-height: 1;
        margin-bottom: 0.5rem;
    }

    .stat-number .percent {
        font-size: 2rem;
    }

    .stat-card h4 {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0 0 1rem;
    }

    .stat-card p {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        opacity: 0.9;
        margin: 0;
    }

    .stat-image img {
        max-height: 200px;
    }

    /* Price List Section */
    .price-list-section {
        padding: 3rem 1rem 5rem;
    }

    .section-header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 2rem;
    }

    .header-left h2 {
        font-size: 1.75rem;
        font-weight: 500;
        margin: 0;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .header-left h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .cta-btn {
        position: relative;
        background: transparent;
        color: white;
        padding: 0.875rem 1.5rem;
        border: 2px solid var(--accent-color, #e82374);
        border-radius: 50px;
        text-decoration: none;
        font-weight: 500;
        overflow: hidden;
        z-index: 1;
        transition: color 0.4s ease;
    }

    .cta-btn::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--accent-color, #e82374);
        border-radius: 50px;
        z-index: -1;
        transition: transform 0.4s ease;
        transform: scaleX(1);
        transform-origin: left;
    }

    .cta-btn:hover {
        color: var(--accent-color, #e82374);
    }

    .cta-btn:hover::before {
        transform: scaleX(0);
        transform-origin: right;
    }

    .tabs-container {
        background: var(--light-blue, #ecf4fd);
        border-radius: var(--border-radius-lg, 1.5rem);
        overflow: hidden;
    }

    :global(.dark) .tabs-container {
        background: var(--bg-secondary-dark, #252525);
    }

    .tabs-header {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    :global(.dark) .tabs-header {
        border-bottom-color: rgba(255, 255, 255, 0.05);
    }

    .tab-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        border: none;
        background: transparent;
        border-radius: 50px;
        cursor: pointer;
        font-weight: 500;
        color: var(--text-secondary, #666);
        transition: all 0.3s ease;
    }

    :global(.dark) .tab-btn {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .tab-btn:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    :global(.dark) .tab-btn:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .tab-btn.active {
        background: white;
        color: var(--text-primary, #252525);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    :global(.dark) .tab-btn.active {
        background: var(--bg-primary-dark, #1a1a1a);
        color: var(--text-primary-dark, #f5f5f5);
    }

    .tab-btn svg {
        color: var(--alternate-color, #1384e2);
    }

    .tab-content {
        padding: 1.5rem;
    }

    .price-row {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        gap: 1rem;
        align-items: center;
        padding: 1rem 0;
    }

    .service-name h4 {
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .service-name h4 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .service-description {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .service-description {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .service-price {
        text-align: right;
    }

    .price-value {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .price-value {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .service-price .price-note {
        display: block;
        font-size: 0.75rem;
        color: var(--text-secondary, #666);
        margin-bottom: 0;
    }

    .row-divider {
        height: 1px;
        background: var(--accent-color, #e82374);
        opacity: 0.2;
    }

    /* Responsive */
    @media (max-width: 992px) {
        .packages-grid {
            grid-template-columns: 1fr;
        }

        .stats-grid {
            grid-template-columns: 1fr;
        }

        .stat-card.blue {
            grid-template-columns: 1fr;
        }

        .stat-image {
            display: none;
        }

        .section-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }

        .price-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }

        .service-price {
            text-align: left;
        }
    }

    @media (max-width: 768px) {
        .tabs-header {
            flex-direction: column;
        }

        .packages-section {
            margin: -2rem 0.5rem 0;
        }

        .features-row {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
</style>
