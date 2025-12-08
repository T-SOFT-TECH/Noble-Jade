<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        title: string;
        description: string;
        href?: string;
        bgColor?: "accent" | "alternate" | "secondary";
        buttonText?: string;
        icon?: Snippet;
    }

    let {
        title,
        description,
        href = "#",
        bgColor = "accent",
        buttonText = "Learn More",
        icon,
    }: Props = $props();

    const bgClasses = {
        accent: "bg-accent",
        alternate: "bg-alternate",
        secondary: "bg-theme-secondary",
    };
</script>

<div class="icon-card group {bgClasses[bgColor]}">
    <div class="icon-card-inner">
        <a {href} class="icon-card-link" aria-label={title}></a>

        <!-- Icon Section -->
        <div class="icon-card-icon">
            {#if icon}
                {@render icon()}
            {:else}
                <!-- Default icon -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            {/if}
        </div>

        <!-- Content Section -->
        <div class="icon-card-content">
            <h4 class="icon-card-title">{title}</h4>
            <p class="icon-card-text">{description}</p>
        </div>
    </div>

    <!-- Arrow Section - Curved corner with button -->
    <div class="icon-card-arrow">
        <div class="arrow-button">
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

    <!-- Button Text -->
    <div class="icon-card-arrow-text">
        <p>{buttonText}</p>
    </div>
</div>

<style>
    .icon-card {
        display: inline-block;
        width: 100%;
        position: relative;
        overflow: visible;
        transition: all 450ms ease;
        min-height: 320px;
        border-radius: 1.5rem;
    }

    .icon-card:hover {
        transform: translateY(-0.25em);
    }

    .icon-card-inner {
        position: relative;
        z-index: 2;
        padding: 2.125em;
        min-height: 320px;
    }

    .icon-card-link {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .icon-card-icon {
        display: flex;
        z-index: 1;
        position: relative;
        padding-bottom: 1em;
    }

    .icon-card-icon :global(svg) {
        width: 4rem;
        height: 4rem;
        color: white;
    }

    .icon-card-content {
        padding-top: 1em;
    }

    .icon-card-title {
        color: white;
        font-size: 1.5rem;
        line-height: 1.3;
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 500;
    }

    .icon-card-text {
        color: white;
        line-height: 1.5;
        margin: 0;
        opacity: 0.9;
        padding-top: 0.9em;
    }

    /* Arrow section - curved corner effect */
    .icon-card-arrow {
        display: flex;
        width: 4.7em;
        height: 100%;
        align-items: end;
        justify-content: flex-end;
        position: relative;
        margin-left: auto;
        padding: 0.5rem 1rem 0 0;
        border-top-left-radius: 34px;
        background: var(--bg-primary);
        margin-top: -50px;
        z-index: 2;
    }

    /* Curved corner - left side */
    .icon-card-arrow::before {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        bottom: 0;
        left: -30px;
        mask-image: var(--shape-mask);
        -webkit-mask-image: var(--shape-mask);
        background: var(--bg-primary);
        transform: rotate(90deg);
        transition: all 300ms ease;
    }

    /* Curved corner - top */
    .icon-card-arrow::after {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        top: -30px;
        right: 0;
        mask-image: var(--shape-mask);
        -webkit-mask-image: var(--shape-mask);
        background: var(--bg-primary);
        transform: rotate(-90deg);
        transition: all 300ms ease;
    }

    /* Arrow button */
    .arrow-button {
        width: 3rem;
        height: 3rem;
        background: var(--color-accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 300ms ease;
        box-shadow: 0 0 0 1px transparent inset;
    }

    .icon-card:hover .arrow-button {
        transform: rotate(45deg);
        background-color: white;
        box-shadow: 0 0 0 2px var(--color-accent) inset;
    }

    .arrow-button svg {
        width: 1.25rem;
        height: 1.25rem;
        color: white;
        transition: all 300ms ease;
    }

    .icon-card:hover .arrow-button svg {
        color: var(--color-accent);
    }

    /* Button text */
    .icon-card-arrow-text {
        position: absolute;
        bottom: 1.4em;
        right: 6em;
        z-index: 3;
    }

    .icon-card-arrow-text p {
        font-weight: 500;
        font-size: 1rem;
        color: white;
        margin: 0;
        cursor: pointer;
    }

    /* Light theme adjustments */
    :global(:root.light) .icon-card-arrow {
        background: var(--bg-primary);
    }
    :global(:root.light) .icon-card-arrow::before,
    :global(:root.light) .icon-card-arrow::after {
        background: var(--bg-primary);
    }
</style>
