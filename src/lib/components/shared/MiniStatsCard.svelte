<script lang="ts">
    // MiniStatsCard - Compact card like screenshot: 80% + "Clients Rebook Monthly"
    // Similar to ServiceCard but with stat/title instead of icon
    let {
        stat = "80%",
        title = "Clients Rebook Monthly",
        href = "/services",
        buttonText = "Book Now",
        bgColor = "bg-accent",
        width = "100%",
        height = "auto",
    }: {
        stat?: string;
        title?: string;
        href?: string;
        buttonText?: string;
        bgColor?: string;
        width?: string;
        height?: string;
    } = $props();

    const isAlternate = bgColor.includes("alternate");
</script>

<!-- Mini Stats Card - Compact stats display with curved arrow on right -->
<div
    class="mini-stats-card group {bgColor}"
    style="width: {width}; height: {height};"
>
    <div class="mini-card-inner">
        <!-- Content Section - Stat + Title (no icon) -->
        <div class="mini-card-content">
            <h3 class="stat-number">{stat}</h3>
            <p class="stat-title">{title}</p>
        </div>
    </div>

    <!-- Arrow Section -->
    <div class="mini-card-arrow" class:alternate={isAlternate}>
        <a
            {href}
            class="arrow-btn"
            class:alternate={isAlternate}
            aria-label={buttonText}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
            </svg>
        </a>
    </div>

    <!-- Book Now text -->
    <div class="mini-card-btn-text">
        <a {href}>{buttonText}</a>
    </div>
</div>

<style>
    .mini-stats-card {
        --sc-shape-mask: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMyOF82NikiPgo8cGF0aCBkPSJNMy41Nzc0NmUtMDcgMEwwIDMwTDMwIDMwQzEzLjQzMjUgMzAgMS42MDE4MWUtMDcgMTYuNTY3NSAzLjU3NzQ2ZS0wNyAwWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMjhfNjYiPgo8cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMwKSByb3RhdGUoLTkwKSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=");
        --sc-shape-mask-02: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMzBMMzAgMEMzMCAxNi41Njc1IDE2LjU2NzUgMzAgMCAzMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
        --sc-arrow-bg: var(--bg-primary, #f8f8f8);

        display: inline-block;
        position: relative;
        overflow: visible;
        transition: all 450ms ease;
        border-radius: 1.5rem;
        min-height: 220px;
    }

    .mini-card-inner {
        position: relative;
        z-index: 2;
        padding: 2rem;
        min-height: 220px;
        display: flex;
        align-items: center;
    }

    .mini-card-content {
        padding-top: 0;
        width: 50%;
    }

    .stat-number {
        color: white;
        font-size: 3.5rem;
        line-height: 1;
        margin: 0 0 0.5rem 0;
        font-family: var(--font-heading, "Inter Tight", sans-serif);
        font-weight: 600;
    }

    .stat-title {
        color: white;
        font-size: 1.4rem;
        line-height: 1.3;
        margin: 0;
        font-weight: 500;
    }

    /* Arrow section - white curved corner */
    .mini-card-arrow {
        display: flex;
        width: 4.7em;
        height: 100%;
        align-items: end;
        justify-content: flex-end;
        position: relative;
        margin-left: auto;
        padding: 0.5rem 1rem 0 0;
        border-top-left-radius: 34px;
        background: var(--sc-arrow-bg);
        margin-top: -50px;
        z-index: 2;
    }

    /* Curved corner - left side */
    .mini-card-arrow::before {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        bottom: 0;
        left: -30px;
        -webkit-mask-image: var(--sc-shape-mask-02);
        mask-image: var(--sc-shape-mask-02);
        background: var(--sc-arrow-bg);
        transition: all 300ms ease;
    }

    /* Curved corner - top */
    .mini-card-arrow::after {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        top: -30px;
        right: 0;
        -webkit-mask-image: var(--sc-shape-mask);
        mask-image: var(--sc-shape-mask);
        background: var(--sc-arrow-bg);
        transform: rotate(-90deg);
        transition: all 300ms ease;
    }

    .arrow-btn {
        width: 3rem;
        height: 3rem;
        background: #e82374;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 300ms ease;
        box-shadow: 0 0 0 1px transparent inset;
    }

    .arrow-btn.alternate {
        background: #e82374;
    }

    .mini-stats-card:hover .arrow-btn {
        transform: rotate(45deg);
        background-color: transparent;
        box-shadow: 0 0 0 2px #e82374 inset;
    }

    .mini-stats-card:hover .arrow-btn.alternate {
        box-shadow: 0 0 0 2px #e82374 inset;
    }

    .arrow-btn svg {
        width: 1.25rem;
        height: 1.25rem;
        color: white;
        transition: all 300ms ease;
    }

    .mini-stats-card:hover .arrow-btn svg {
        color: #e82374;
    }

    .mini-stats-card:hover .arrow-btn.alternate svg {
        color: #e82374;
    }

    .mini-card-btn-text {
        position: absolute;
        bottom: 1.4em;
        right: 6em;
        z-index: 3;
    }

    .mini-card-btn-text a {
        font-family: "Inter", sans-serif;
        font-weight: 500;
        font-size: 1rem;
        color: white;
        margin: 0;
        cursor: pointer;
        text-decoration: none;
    }

    .mini-card-btn-text a:hover {
        text-decoration: underline;
    }

    /* Light theme adjustments */
    :global(:root.light) .mini-stats-card {
        --sc-arrow-bg: var(--bg-primary, #ffffff);
    }
</style>
