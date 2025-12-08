<script lang="ts">
    import type { Snippet } from "svelte";

    // ServiceCardLeft - A service card with curved corner arrow on the LEFT side
    let {
        title = "Service Title",
        description = "Service description goes here.",
        href = "/services",
        buttonText = "Book Now",
        bgColor = "bg-accent", // bg-accent or bg-alternate
        icon = null as Snippet | null,
    }: {
        title?: string;
        description?: string;
        href?: string;
        buttonText?: string;
        bgColor?: string;
        icon?: Snippet | null;
    } = $props();

    // Determine if using alternate color for hover effects
    const isAlternate = bgColor.includes("alternate");
</script>

<!-- Service Card Component - Left Corner Variant -->
<div class="sc-left group {bgColor}">
    <!-- Inner container -->
    <div class="sc-left-inner">
        <!-- Clickable link overlay -->
        <a {href} class="absolute inset-0 z-20" aria-label={title}></a>

        <!-- Icon Section -->
        <div class="sc-left-icon">
            <span class="flex items-center justify-center">
                {#if icon}
                    {@render icon()}
                {:else}
                    <!-- Default cleaning spray icon -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 72 72"
                        fill="none"
                        class="w-16 h-16"
                    >
                        <path
                            d="M20 32 L20 58 Q20 62 24 62 L36 62 Q40 62 40 58 L40 32 Q40 28 36 28 L24 28 Q20 28 20 32Z"
                            fill="white"
                            opacity="0.2"
                        />
                        <path
                            d="M22 32 L22 56 Q22 60 26 60 L34 60 Q38 60 38 56 L38 32 Q38 30 36 30 L24 30 Q22 30 22 32Z"
                            stroke="white"
                            stroke-width="2"
                            fill="none"
                        />
                        <rect
                            x="26"
                            y="22"
                            width="8"
                            height="8"
                            rx="1"
                            stroke="white"
                            stroke-width="2"
                            fill="none"
                        />
                        <path
                            d="M34 24 L42 24"
                            stroke="white"
                            stroke-width="2"
                        />
                        <path
                            d="M42 22 L46 22 L46 26 L42 26 L42 22Z"
                            stroke="white"
                            stroke-width="2"
                            fill="none"
                        />
                        <circle cx="52" cy="18" r="2" fill="white" />
                        <circle cx="56" cy="24" r="1.5" fill="white" />
                        <circle cx="54" cy="30" r="1.5" fill="white" />
                        <circle cx="50" cy="14" r="1" fill="white" />
                        <circle cx="58" cy="20" r="1" fill="white" />
                        <path
                            d="M60 12 L62 14 M60 14 L62 12"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                        />
                        <path
                            d="M48 8 L49 10 M48 10 L49 8"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                        />
                    </svg>
                {/if}
            </span>
        </div>

        <!-- Content Section -->
        <div class="sc-left-content">
            <h4
                class="text-white text-2xl font-medium leading-tight m-0"
                style="font-family: var(--font-heading, 'Inter Tight', sans-serif);"
            >
                {title}
            </h4>
            <p class="text-white/90 leading-relaxed mt-3 m-0">
                {description}
            </p>
        </div>
    </div>

    <!-- Arrow Section - White curved corner on LEFT side -->
    <div class="sc-left-arrow" class:alternate={isAlternate}>
        <div class="sc-left-btn" class:alternate={isAlternate}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
                class="w-5 h-5 text-white transition-colors duration-300"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
            </svg>
        </div>
    </div>

    <!-- Button text - positioned on the right of the arrow (left side) -->
    <div class="absolute bottom-[1.4em] left-24 z-30">
        <p class="font-medium text-white m-0 cursor-pointer">{buttonText}</p>
    </div>
</div>

<style>
    /* SCOPED: ServiceCardLeft - unique class names */
    .sc-left {
        --sc-left-mask: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMyOF82NikiPgo8cGF0aCBkPSJNMy41Nzc0NmUtMDcgMEwwIDMwTDMwIDMwQzEzLjQzMjUgMzAgMS42MDE4MWUtMDcgMTYuNTY3NSAzLjU3NzQ2ZS0wNyAwWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMjhfNjYiPgo8cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMwKSByb3RhdGUoLTkwKSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=");
        --sc-left-mask-02: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMzBMMzAgMEMzMCAxNi41Njc1IDE2LjU2NzUgMzAgMCAzMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
        --sc-left-arrow-bg: var(--bg-primary, #f8f8f8);

        display: inline-block;
        width: 100%;
        position: relative;
        overflow: visible;
        transition: all 450ms ease;
        min-height: 320px;
        border-radius: 1.5rem;
    }

    .sc-left:hover {
        transform: translateY(-0.25em);
    }

    .sc-left-inner {
        position: relative;
        z-index: 2;
        padding: 2.125em;
        min-height: 320px;
    }

    .sc-left-icon {
        display: flex;
        z-index: 1;
        position: relative;
        padding-bottom: 1em;
    }

    .sc-left-content {
        padding-top: 1em;
    }

    .sc-left-arrow {
        display: flex;
        width: 4.7em;
        height: 100%;
        align-items: end;
        justify-content: flex-start;
        position: relative;
        margin-right: auto;
        padding: 0.5rem 0 0 1rem;
        border-top-right-radius: 34px;
        background: var(--sc-left-arrow-bg);
        margin-top: -50px;
        z-index: 2;
    }

    .sc-left-arrow::before {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        bottom: 0;
        right: -30px;
        -webkit-mask-image: var(--sc-left-mask-02);
        mask-image: var(--sc-left-mask-02);
        background: var(--sc-left-arrow-bg);
        transform: scaleX(-1) rotate(0deg);
        transition: all 300ms ease;
    }

    .sc-left-arrow::after {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        top: -30px;
        left: 0;
        -webkit-mask-image: var(--sc-left-mask);
        mask-image: var(--sc-left-mask);
        background: var(--sc-left-arrow-bg);
        transform: rotate(0deg);
        transition: all 300ms ease;
    }

    .sc-left-btn {
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

    .sc-left-btn.alternate {
        background: #e82374;
    }

    .sc-left:hover .sc-left-btn {
        transform: rotate(45deg);
        background-color: transparent;
        box-shadow: 0 0 0 2px #e82374 inset;
    }

    .sc-left:hover .sc-left-btn.alternate {
        box-shadow: 0 0 0 2px #e82374 inset;
    }

    .sc-left:hover .sc-left-btn svg {
        color: #e82374;
    }

    :global(:root.light) .sc-left {
        --sc-left-arrow-bg: var(--bg-primary, #ffffff);
    }
</style>
