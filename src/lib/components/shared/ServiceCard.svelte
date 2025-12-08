<script lang="ts">
    import type { Snippet } from "svelte";

    // ServiceCard - exact recreation of service-card.html structure
    let {
        title = "Service Title",
        description = "Service description goes here.",
        href = "/services",
        buttonText = "Book Now",
        bgColor = "bg-alternate", // bg-accent or bg-alternate
        icon = null as Snippet | null,
    }: {
        title?: string;
        description?: string;
        href?: string;
        buttonText?: string;
        bgColor?: string;
        icon?: Snippet | null;
    } = $props();

    const isAlternate = bgColor.includes("alternate");
</script>

<!-- Service Card - exact bt_bb_card_icon structure -->
<div class="bt_bb_card_icon {bgColor}">
    <div class="bt_bb_card_icon_inner">
        <a {href} class="btCardLink" aria-label={title}></a>

        <!-- Icon Section -->
        <div class="bt_bb_card_icon_icon">
            <span class="bt_bb_icon_holder">
                {#if icon && typeof icon === "function"}
                    {@render icon()}
                {:else}
                    <!-- Default cleaning spray icon -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 72 72"
                        fill="none"
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
        <div class="bt_bb_card_icon_content">
            <div class="bt_bb_card_icon_title text-3xl">
                <h4>{title}</h4>
            </div>
            <div class="bt_bb_card_icon_text">
                <p>{description}</p>
            </div>
        </div>
    </div>

    <!-- Arrow Section -->
    <div class="bt_bb_card_icon_arrow" class:alternate={isAlternate}>
        <div class="arrow-button" class:alternate={isAlternate}>
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
        </div>
    </div>

    <!-- Book Now text -->
    <div class="bt_bb_card_icon_arrow_text">
        <p>{buttonText}</p>
    </div>
</div>

<style>
    /* Exact CSS from service-card.html - scoped with unique variable names */
    .bt_bb_card_icon {
        --sc-shape-mask: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMyOF82NikiPgo8cGF0aCBkPSJNMy41Nzc0NmUtMDcgMEwwIDMwTDMwIDMwQzEzLjQzMjUgMzAgMS42MDE4MWUtMDcgMTYuNTY3NSAzLjU3NzQ2ZS0wNyAwWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMjhfNjYiPgo8cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMwKSByb3RhdGUoLTkwKSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=");
        --sc-shape-mask-02: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMzBMMzAgMEMzMCAxNi41Njc1IDE2LjU2NzUgMzAgMCAzMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
        --sc-arrow-bg: var(--bg-primary, #f8f8f8);

        display: inline-block;
        width: 100%;
        position: relative;
        overflow: visible;
        transition: all 450ms ease;
        min-height: 320px;
        border-radius: 1.5rem;
    }

    .bt_bb_card_icon:hover {
        transform: translateY(-0.25em);
    }

    .bt_bb_card_icon_inner {
        position: relative;
        z-index: 2;
        padding: 2.125em;
        min-height: 320px;
    }

    .btCardLink {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .bt_bb_card_icon_icon {
        display: flex;
        z-index: 1;
        position: relative;
        padding-bottom: 1em;
    }

    .bt_bb_icon_holder {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bt_bb_icon_holder svg {
        width: 4rem;
        height: 4rem;
    }

    .bt_bb_card_icon_content {
        padding-top: 1em;
    }

    .bt_bb_card_icon_title h4 {
        color: white;
        font-size: 1.5rem;
        line-height: 1.3;
        margin: 0;
        font-family: var(--font-heading, "Inter Tight", sans-serif);
        font-weight: 500;
    }

    .bt_bb_card_icon_text {
        padding-top: 0.9em;
    }

    .bt_bb_card_icon_text p {
        color: white;
        line-height: 1.5;
        margin: 0;
        opacity: 0.9;
    }

    /* Arrow section - white curved corner */
    .bt_bb_card_icon_arrow {
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
    .bt_bb_card_icon_arrow::before {
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
    .bt_bb_card_icon_arrow::after {
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

    .arrow-button {
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

    .arrow-button.alternate {
        background: #e82374;
    }

    .bt_bb_card_icon:hover .arrow-button {
        transform: rotate(45deg);
        background-color: transparent;
        box-shadow: 0 0 0 2px #e82374 inset;
    }

    .bt_bb_card_icon:hover .arrow-button.alternate {
        box-shadow: 0 0 0 2px #e82374 inset;
    }

    .arrow-button svg {
        width: 1.25rem;
        height: 1.25rem;
        color: white;
        transition: all 300ms ease;
    }

    .bt_bb_card_icon:hover .arrow-button svg {
        color: #e82374;
    }

    .bt_bb_card_icon:hover .arrow-button.alternate svg {
        color: #e82374;
    }

    .bt_bb_card_icon_arrow_text {
        position: absolute;
        bottom: 1.4em;
        right: 6em;
        z-index: 3;
    }

    .bt_bb_card_icon_arrow_text p {
        font-family: "Inter", sans-serif;
        font-weight: 500;
        font-size: 1rem;
        color: white;
        margin: 0;
        cursor: pointer;
    }

    /* Light theme adjustments */
    :global(:root.light) .bt_bb_card_icon {
        --sc-arrow-bg: var(--bg-primary, #ffffff);
    }
</style>
