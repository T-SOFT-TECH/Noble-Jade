<script lang="ts">
    // StatsCard - A card with text on left and overflowing image on right
    let {
        stat = "80%",
        title = "Clients Rebook Monthly",
        href = "/services",
        buttonText = "Book Now",
        bgColor = "bg-alternate",
        imageSrc = "/images/hand_pink_glove.png",
        imageAlt = "Decorative image",
    }: {
        stat?: string;
        title?: string;
        href?: string;
        buttonText?: string;
        bgColor?: string;
        imageSrc?: string;
        imageAlt?: string;
    } = $props();
</script>

<!-- Stats Card Component -->
<div class="stats-card group {bgColor} h-full">
    <!-- Two-column layout -->
    <div class="flex h-full">
        <!-- Left Column: Text Content -->
        <div
            class="flex-1 p-8 pb-20 flex flex-col justify-center relative z-10"
        >
            <h3 class="text-5xl md:text-6xl font-bold text-white mb-3">
                {stat}
            </h3>
            <p class="text-xl md:text-2xl font-medium text-white leading-snug">
                {title}
            </p>
        </div>

        <!-- Right Column: Image (anchored to bottom, overflows at top) -->
        <div class="relative w-[45%] shrink-0 self-stretch">
            <img
                src={imageSrc}
                alt={imageAlt}
                class="absolute bottom-0 right-0 w-full h-[140%] object-contain object-bottom"
            />
        </div>
    </div>

    <!-- Curved corner arrow section - bottom left -->
    <div class="stats-arrow">
        <a {href} class="stats-btn" aria-label={buttonText}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
                class="w-5 h-5 text-white transition-all duration-300 group-hover:rotate-45"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
            </svg>
        </a>
        <span class="text-white font-medium ml-3">{buttonText}</span>
    </div>
</div>

<style>
    .stats-card {
        --stats-arrow-bg: var(--bg-primary, #f8f8f8);

        position: relative;
        overflow: visible;
        border-radius: 1.5rem;
        min-height: 100%;
        height: 100%;
        transition: all 450ms ease;
    }

    .stats-card:hover {
        transform: translateY(-0.25em);
    }

    .stats-arrow {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        background: var(--stats-arrow-bg);
        border-top-right-radius: 34px;
        z-index: 20;
    }

    .stats-arrow::before {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        bottom: 0;
        right: -30px;
        -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMzBMMzAgMEMzMCAxNi41Njc1IDE2LjU2NzUgMzAgMCAzMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
        mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMzBMMzAgMEMzMCAxNi41Njc1IDE2LjU2NzUgMzAgMCAzMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
        background: var(--stats-arrow-bg);
        transform: scaleX(-1);
    }

    .stats-arrow::after {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        top: -30px;
        left: 0;
        -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMyOF82NikiPgo8cGF0aCBkPSJNMy41Nzc0NmUtMDcgMEwwIDMwTDMwIDMwQzEzLjQzMjUgMzAgMS42MDE4MWUtMDcgMTYuNTY3NSAzLjU3NzQ2ZS0wNyAwWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMjhfNjYiPgo8cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMwKSByb3RhdGUoLTkwKSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=");
        mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMyOF82NikiPgo8cGF0aCBkPSJNMy41Nzc0NmUtMDcgMEwwIDMwTDMwIDMwQzEzLjQzMjUgMzAgMS42MDE4MWUtMDcgMTYuNTY3NSAzLjU3NzQ2ZS0wNyAwWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMjhfNjYiPgo8cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMwKSByb3RhdGUoLTkwKSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=");
        background: var(--stats-arrow-bg);
    }

    .stats-btn {
        width: 2.75rem;
        height: 2.75rem;
        background: #e82374;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 300ms ease;
    }

    .stats-card:hover .stats-btn {
        background-color: transparent;
        box-shadow: 0 0 0 2px #e82374 inset;
    }

    .stats-card:hover .stats-btn svg {
        color: #e82374;
    }

    :global(:root.light) .stats-card {
        --stats-arrow-bg: var(--bg-primary, #ffffff);
    }
</style>
