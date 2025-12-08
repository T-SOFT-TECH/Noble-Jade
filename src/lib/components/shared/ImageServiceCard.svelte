<script lang="ts">
    // ImageServiceCard - Card with image on left, title on right, curved arrow on bottom-right
    let {
        title = "Residential Cleaning",
        href = "/services",
        buttonText = "Learn More",
        bgColor = "bg-accent",
        imageSrc = "/images/residential-building.webp",
        imageAlt = "Service image",
    }: {
        title?: string;
        href?: string;
        buttonText?: string;
        bgColor?: string;
        imageSrc?: string;
        imageAlt?: string;
    } = $props();

    const isAlternate = bgColor.includes("alternate");
</script>

<!-- Image Service Card - Image left, title right, arrow bottom-right -->
<div class="image-service-card group {bgColor}">
    <!-- Two-column layout -->
    <div class="card-inner">
        <!-- Left Column: Image -->
        <div class="card-image">
            <img src={imageSrc} alt={imageAlt} />
        </div>

        <!-- Right Column: Title -->
        <div class="card-content">
            <h3 class="card-title">{title}</h3>
        </div>
    </div>

    <!-- Arrow Section - Bottom Right -->
    <div class="card-arrow" class:alternate={isAlternate}>
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

    <!-- Button text -->
    <div class="card-btn-text">
        <a {href}>{buttonText}</a>
    </div>
</div>

<style>
    .image-service-card {
        --sc-shape-mask: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMyOF82NikiPgo8cGF0aCBkPSJNMy41Nzc0NmUtMDcgMEwwIDMwTDMwIDMwQzEzLjQzMjUgMzAgMS42MDE4MWUtMDcgMTYuNTY3NSAzLjU3NzQ2ZS0wNyAwWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMjhfNjYiPgo8cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMwKSByb3RhdGUoLTkwKSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=");
        --sc-shape-mask-02: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMzBMMzAgMEMzMCAxNi41Njc1IDE2LjU2NzUgMzAgMCAzMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
        --sc-arrow-bg: var(--bg-primary, #f8f8f8);

        display: block;
        width: 100%;
        position: relative;
        overflow: visible;
        transition: all 450ms ease;
        border-radius: 1.5rem;
        min-height: 220px;
    }

    .card-inner {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        min-height: 220px;
        padding: 1.5rem;
        gap: 1rem;
    }

    .card-image {
        width: 40%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-image img {
        max-width: 100%;
        height: auto;
        object-fit: contain;
    }

    .card-content {
        flex: 1;
        padding-right: 1rem;
    }

    .card-title {
        color: white;
        font-size: 1.75rem;
        line-height: 1.2;
        margin: 0;
        font-family: var(--font-heading, "Inter Tight", sans-serif);
        font-weight: 600;
    }

    /* Arrow section - white curved corner on bottom-right */
    .card-arrow {
        display: flex;
        width: 4.7em;
        align-items: end;
        justify-content: flex-end;
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0.5rem 1rem 0 0;
        border-top-left-radius: 34px;
        background: var(--sc-arrow-bg);
        z-index: 10;
    }

    /* Curved corner - left side */
    .card-arrow::before {
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
    .card-arrow::after {
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

    .arrow-btn:hover {
        transform: rotate(45deg);
        background-color: transparent;
        box-shadow: 0 0 0 2px #e82374 inset;
    }

    .arrow-btn:hover svg {
        color: #e82374;
    }

    .arrow-btn svg {
        width: 1.25rem;
        height: 1.25rem;
        color: white;
        transition: all 300ms ease;
    }

    .card-btn-text {
        position: absolute;
        bottom: 1.4em;
        right: 6em;
        z-index: 3;
    }

    .card-btn-text a {
        font-family: "Inter", sans-serif;
        font-weight: 500;
        font-size: 1rem;
        color: white;
        margin: 0;
        cursor: pointer;
        text-decoration: none;
    }

    .card-btn-text a:hover {
        text-decoration: underline;
    }

    /* Light theme adjustments */
    :global(:root.light) .image-service-card {
        --sc-arrow-bg: var(--bg-primary, #ffffff);
    }
</style>
