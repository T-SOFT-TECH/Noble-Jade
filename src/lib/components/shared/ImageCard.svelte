<script lang="ts">
    // ImageCard - A card with an image and optional curved corner badge
    interface Badge {
        icon?: "check" | "star" | "users" | "award";
        number: string;
        label: string;
    }

    let {
        imageSrc = "",
        imageAlt = "Image",
        badge = null as Badge | null,
        rounded = "rounded-3xl",
        width = "580px",
        height = "645px",
    }: {
        imageSrc?: string;
        imageAlt?: string;
        badge?: Badge | null;
        rounded?: string;
        width?: string;
        height?: string;
    } = $props();
</script>

<!-- Image Card with optional curved corner badge - responsive -->
<div
    class="image-card relative {rounded} overflow-hidden w-full"
    style="max-width: {width}; aspect-ratio: 580 / 645;"
>
    <!-- Main Image -->
    <img
        src={imageSrc}
        alt={imageAlt}
        class="w-full h-full object-cover"
        loading="lazy"
    />

    <!-- Badge with curved corner - half width of card -->
    {#if badge}
        <div class="badge-wrapper absolute bottom-0 right-0 z-10 w-1/2">
            <div
                class="badge-content relative flex items-center justify-center gap-4 px-6 py-6 rounded-tl-[30px] w-full h-[135px]"
                style="background-color: var(--bg-primary, #ffffff);"
            >
                <!-- Icon -->
                <div
                    class="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0"
                >
                    {#if badge.icon === "check"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="text-white"
                        >
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                    {:else if badge.icon === "star"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="text-white"
                        >
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                            />
                        </svg>
                    {:else if badge.icon === "users"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="text-white"
                        >
                            <path
                                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                            />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    {:else if badge.icon === "award"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="text-white"
                        >
                            <circle cx="12" cy="8" r="6" />
                            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="text-white"
                        >
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                    {/if}
                </div>
                <!-- Text -->
                <div class="leading-tight">
                    <span class="text-6xl text-accent block"
                        >{badge.number}</span
                    >
                    <span class="text-sm text-theme-secondary"
                        >{badge.label}</span
                    >
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* CSS Variables for curved corners */
    .image-card {
        --badge-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M30,30 L30,0 C30,16.57 16.57,30 0,30 L30,30 Z' fill='%23000'/%3E%3C/svg%3E");
        --badge-mask-02: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M0,30 L30,30 C13.43,30 0,16.57 0,0 L0,30 Z' fill='%23000'/%3E%3C/svg%3E");
    }

    /* Curved corner effect - left side */
    .badge-content::before {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        bottom: 0;
        left: -30px;
        -webkit-mask-image: var(--badge-mask-02);
        mask-image: var(--badge-mask-02);
        background-color: var(--bg-primary, #ffffff);
        transform: rotate(-90deg);
        transition: all 300ms ease;
    }

    /* Curved corner effect - top side */
    .badge-content::after {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        top: -30px;
        right: 0;
        -webkit-mask-image: var(--badge-mask);
        mask-image: var(--badge-mask);
        background-color: var(--bg-primary, #ffffff);
        transition: all 300ms ease;
    }

    /* Dark theme adjustments */
    :global(:root:not(.light)) .badge-content::before,
    :global(:root:not(.light)) .badge-content::after {
        background-color: var(--bg-primary, #0f0f0f);
    }
</style>
