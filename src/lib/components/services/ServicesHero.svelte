<script lang="ts">
    import { onMount } from "svelte";

    // Props
    interface Testimonial {
        imageSrc?: string;
        imageAlt?: string;
        text: string;
        highlight: string;
    }

    let {
        titleText = "What Can We Clean For You Today?",
        backgroundImage = "/images/hero_services.webp",
        backgroundText = "services",
        testimonial = null as Testimonial | null,
        buttonText = "Book Online",
        buttonLink = "/contact",
        phoneNumber = "(844) 242-9464",
        height = "h-[70vh]",
    }: {
        titleText?: string;
        backgroundImage?: string;
        backgroundText?: string;
        testimonial?: Testimonial | null;
        buttonText?: string;
        buttonLink?: string;
        phoneNumber?: string;
        height?: string;
    } = $props();
</script>

<!-- Services Page Hero with Background Image and Left-aligned Content -->
<section
    class="hero-section relative mt-6 mx-auto w-full {height} max-h-[70vh] overflow-hidden flex flex-col rounded-[40px]"
>
    <!-- Background Image -->
    <div
        class="absolute inset-0 w-full bg-cover bg-center bg-no-repeat z-0"
        style="background-image: url('{backgroundImage}');"
    ></div>

    <!-- Blue Gradient Overlay on Left Side -->
    <div
        class="absolute inset-0 z-5"
        style="background: linear-gradient(90deg, rgba(1, 1, 65, 0.95) 0%, rgba(1, 1, 65, 0.7) 35%, rgba(1, 1, 65, 0.3) 60%, transparent 75%);"
    ></div>

    <!-- Large Transparent Title - centered behind content -->
    <h2
        class="absolute inset-0 flex items-center justify-center text-[16vw] md:text-[18vw] lg:text-[21vw] font-semibold text-center lowercase leading-[0.85] z-10 pointer-events-none"
        style="font-family: var(--font-heading, 'Inter Tight', sans-serif); color: rgba(255, 255, 255, 0.2);"
    >
        {backgroundText}
    </h2>

    <!-- Content Container -->
    <div
        class="grid lg:grid-cols-[3fr_2fr] h-full max-w-[1400px] content-center mx-auto px-4"
    >
        <div
            class="relative z-10 flex flex-col justify-center items-start h-full px-8 lg:px-16 max-w-[700px]"
        >
            <!-- Heading -->
            <h1
                class="text-4xl md:text-5xl lg:text-6xl font-heading font-medium text-white leading-tight mb-8"
            >
                {titleText}
            </h1>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap items-center gap-4">
                <!-- Book Online Button -->
                <a
                    href={buttonLink}
                    class="inline-flex items-center px-8 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent/90 transition-colors"
                >
                    {buttonText}
                </a>

                <!-- Phone Number -->
                <a
                    href="tel:{phoneNumber.replace(/[^0-9]/g, '')}"
                    class="inline-flex items-center gap-3 text-white hover:text-white/80 transition-colors"
                >
                    <!-- Phone Icon with Circle Background -->
                    <span
                        class="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/30"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-5 h-5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                            />
                        </svg>
                    </span>
                    <span class="text-lg font-medium">{phoneNumber}</span>
                </a>
            </div>
        </div>

        <div>This is the second div</div>
    </div>

    <!-- Testimonial Card - positioned at bottom right -->
    {#if testimonial}
        <div
            class="testimonial-wrapper absolute bottom-0 right-0 z-40 hidden md:flex"
        >
            <div
                class="testimonial-card relative max-w-[310px] px-8 py-6 rounded-tl-[40px]"
                style="background-color: var(--bg-primary, #252525); color: var(--text-primary, #ffffff);"
            >
                <div class="flex items-center gap-4">
                    {#if testimonial.imageSrc}
                        <img
                            src={testimonial.imageSrc}
                            alt={testimonial.imageAlt || "Credentials"}
                            class="max-w-[121px] h-auto"
                            loading="eager"
                        />
                    {/if}
                    <div class="text-sm leading-snug">
                        <span
                            >{testimonial.text}<br /><strong
                                class="font-medium block"
                                >{testimonial.highlight}</strong
                            ></span
                        >
                    </div>
                </div>
            </div>
        </div>
    {/if}
</section>

<style>
    /* Component-scoped CSS Variables for curved corners */
    .hero-section {
        --testimonial-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M30,30 L30,0 C30,16.57 16.57,30 0,30 L30,30 Z' fill='%23000'/%3E%3C/svg%3E");
        --testimonial-mask-02: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M0,30 L30,30 C13.43,30 0,16.57 0,0 L0,30 Z' fill='%23000'/%3E%3C/svg%3E");
    }

    /* Curved corner effect - left side */
    .testimonial-card::before {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        bottom: 0;
        left: -30px;
        -webkit-mask-image: var(--testimonial-mask-02);
        mask-image: var(--testimonial-mask-02);
        background-color: var(--bg-primary, #252525);
        transform: rotate(-90deg);
        transition: all 300ms ease;
    }

    /* Curved corner effect - top side */
    .testimonial-card::after {
        content: "";
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        top: -30px;
        right: 0;
        -webkit-mask-image: var(--testimonial-mask);
        mask-image: var(--testimonial-mask);
        background-color: var(--bg-primary, #252525);
        transition: all 300ms ease;
    }

    /* Light theme adjustments for curved corners */
    :global(:root.light) .testimonial-card::before,
    :global(:root.light) .testimonial-card::after {
        background-color: var(--bg-primary, #ffffff);
    }
</style>
