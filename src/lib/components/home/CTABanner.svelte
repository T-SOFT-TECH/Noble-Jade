<!-- CTA Banner Section -->
<script lang="ts">
    let {
        imageSrc = "/images/image_07_home_01.png",
        imageAlt = "Clean living room with vacuum",
        imagePosition = "center" as "center" | "bottom",
    }: {
        imageSrc?: string;
        imageAlt?: string;
        imagePosition?: "center" | "bottom";
    } = $props();
</script>

<section
    class="cta-banner py-16 rounded-[40px] w-full mx-auto bg-accent relative overflow-visible"
>
    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div
            class="w-full h-full"
            style="background-image: 
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px);
            background-size: 40px 40px;"
        ></div>
    </div>

    <div class="container mx-auto px-6 lg:px-2 relative z-10">
        <div
            class="flex flex-col lg:flex-row items-center justify-between gap-8"
        >
            <!-- Left: Text Content -->
            <div class="text-white text-center lg:text-left max-w-3xl">
                <h2
                    class="text-3xl lg:text-6xl mb-4 font-heading leading-tight"
                >
                    Enjoy a Sparkling Clean Home Today
                </h2>
                <p class="text-lg opacity-90">
                    Contact us for more detailed plan.
                </p>
            </div>

            <!-- Right: Image with sparkles (center position - inside flex) -->
            {#if imagePosition === "center"}
                <div class="relative hidden lg:block">
                    <!-- Sparkle decorations -->
                    <svg
                        class="absolute -top-4 right-8 w-6 h-6 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M12 0L14 8L22 10L14 12L12 20L10 12L2 10L10 8L12 0Z"
                        />
                    </svg>
                    <svg
                        class="absolute top-1/2 -right-4 w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M12 0L14 8L22 10L14 12L12 20L10 12L2 10L10 8L12 0Z"
                        />
                    </svg>
                    <svg
                        class="absolute bottom-4 right-1/3 w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M12 0L14 8L22 10L14 12L12 20L10 12L2 10L10 8L12 0Z"
                        />
                    </svg>

                    <!-- Image -->
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        class="w-auto object-contain relative z-10"
                    />
                </div>
            {/if}
        </div>
    </div>

    <!-- Image positioned at bottom (outside flex, absolute to section) -->
    {#if imagePosition === "bottom"}
        <div class="image-bottom hidden lg:block">
            <img src={imageSrc} alt={imageAlt} class="img-bottom" />
        </div>
    {/if}

    <!-- Book Now text inside the card -->
    <div class="absolute bottom-6 right-24 z-10">
        <span class="text-white font-medium">Book Now</span>
    </div>

    <!-- Curved corner arrow section - bottom right (smaller, transparent) -->
    <div class="cta-arrow">
        <a href="/contact" class="cta-btn" aria-label="Book Now">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
                class="w-5 h-5 text-white transition-all duration-300"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
            </svg>
        </a>
    </div>
</section>

<style>
    .cta-banner {
        --cta-arrow-bg: var(--bg-primary, #f8f8f8);
    }

    .cta-arrow {
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        padding: 0.5rem;
        background: var(--cta-arrow-bg);
        border-top-left-radius: 34px;
        z-index: 20;
    }

    .cta-arrow::before {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        bottom: 0;
        left: -30px;
        -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMzBMMzAgMEMzMCAxNi41Njc1IDE2LjU2NzUgMzAgMCAzMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
        mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMzBMMzAgMEMzMCAxNi41Njc1IDE2LjU2NzUgMzAgMCAzMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
        background: var(--cta-arrow-bg);
    }

    .cta-arrow::after {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        top: -30px;
        right: 0;
        -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMyOF82NikiPgo8cGF0aCBkPSJNMy41Nzc0NmUtMDcgMEwwIDMwTDMwIDMwQzEzLjQzMjUgMzAgMS42MDE4MWUtMDcgMTYuNTY3NSAzLjU3NzQ2ZS0wNyAwWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMjhfNjYiPgo8cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMwKSByb3RhdGUoLTkwKSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=");
        mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMyOF82NikiPgo8cGF0aCBkPSJNMy41Nzc0NmUtMDcgMEwwIDMwTDMwIDMwQzEzLjQzMjUgMzAgMS42MDE4MWUtMDcgMTYuNTY3NSAzLjU3NzQ2ZS0wNyAwWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMjhfNjYiPgo8cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMwKSByb3RhdGUoLTkwKSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=");
        background: var(--cta-arrow-bg);
        transform: scaleX(-1);
    }

    .cta-btn {
        width: 2.75rem;
        height: 2.75rem;
        background: var(--color-accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 300ms ease;
    }

    .cta-banner:hover .cta-btn {
        transform: rotate(45deg);
        background-color: white;
    }

    .cta-banner:hover .cta-btn svg {
        color: var(--color-accent);
    }

    /* Bottom-positioned image styles - image overflows at top, sits at bottom */
    .image-bottom {
        position: absolute;
        right: 6rem;
        bottom: 0;
        z-index: 5;
    }

    .img-bottom {
        width: auto;
        height: auto;
        object-fit: contain;
    }
</style>
