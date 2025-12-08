<script lang="ts">
    import { onMount } from "svelte";

    // Props for reusable hero
    interface FloatingImage {
        src: string;
        alt?: string;
        position: {
            top?: string;
            bottom?: string;
            left?: string;
            right?: string;
        };
        size?: string; // Tailwind width class like 'w-40'
        animationDuration?: string;
    }

    interface Testimonial {
        imageSrc?: string;
        imageAlt?: string;
        text: string;
        highlight: string;
    }

    let {
        title = "page title",
        heroImage = "",
        heroImageAlt = "Hero image",
        floatingImages = [] as FloatingImage[],
        testimonial = null as Testimonial | null,
        showFloatingBubbles = true,
        bgColor = "bg-accent",
        textColor = "text-white/50",
        height = "h-[70vh]",
        backgroundImage = "", // New: background image URL
        overlayColor = "rgba(19, 132, 226, 0.85)", // New: overlay color (default dark blue)
    }: {
        title?: string;
        heroImage?: string;
        heroImageAlt?: string;
        floatingImages?: FloatingImage[];
        testimonial?: Testimonial | null;
        showFloatingBubbles?: boolean;
        bgColor?: string;
        textColor?: string;
        height?: string;
        backgroundImage?: string;
        overlayColor?: string;
    } = $props();

    // Default floating bubbles if none provided and showFloatingBubbles is true
    const defaultFloatingImages: FloatingImage[] = [
        {
            src: "/images/floating_image_02.png",
            alt: "Decorative bubble",
            position: { top: "12%", right: "10em" },
            size: "w-40",
            animationDuration: "3s",
        },
        {
            src: "/images/floating_image_03.png",
            alt: "Decorative bubble",
            position: { bottom: "25%", left: "2%" },
            size: "w-24",
            animationDuration: "4s",
        },
        {
            src: "/images/floating_image_about.png",
            alt: "Decorative cleaning element",
            position: { top: "32%", left: "3%" },
            size: "w-32",
            animationDuration: "5s",
        },
    ];

    // Use provided images or defaults
    $effect(() => {
        if (floatingImages.length === 0 && showFloatingBubbles) {
            floatingImages = defaultFloatingImages;
        }
    });

    const displayFloatingImages =
        floatingImages.length > 0
            ? floatingImages
            : showFloatingBubbles
              ? defaultFloatingImages
              : [];

    // Parallax effect for floating images
    onMount(() => {
        const floatingImgs = document.querySelectorAll(".floating-image");

        const handleScroll = () => {
            const scrollY = window.scrollY;
            floatingImgs.forEach((img, index) => {
                const speed = 0.5 + index * 0.2;
                const yPos = scrollY * speed * 0.1;
                (img as HTMLElement).style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    // Helper to generate position styles
    function getPositionStyle(pos: FloatingImage["position"]): string {
        const styles = [];
        if (pos.top) styles.push(`top: ${pos.top}`);
        if (pos.bottom) styles.push(`bottom: ${pos.bottom}`);
        if (pos.left) styles.push(`left: ${pos.left}`);
        if (pos.right) styles.push(`right: ${pos.right}`);
        return styles.join("; ");
    }
</script>

<!-- Reusable Page Hero Section -->
<section
    class="hero-section relative mt-6 mx-auto w-full {height} max-h-[70vh] overflow-hidden flex flex-col {backgroundImage
        ? ''
        : bgColor} rounded-[40px]"
>
    <!-- Background Image with Overlay -->
    {#if backgroundImage}
        <div class="absolute inset-0 z-0">
            <img
                src={backgroundImage}
                alt="Background"
                class="w-full h-full object-cover"
                loading="eager"
            />
            <div
                class="absolute inset-0"
                style="background-color: {overlayColor};"
            ></div>
        </div>
    {/if}

    <!-- Floating Decorative Images -->
    {#each displayFloatingImages as img, i}
        <img
            src={img.src}
            alt={img.alt || "Decorative element"}
            class="floating-image absolute hidden lg:block z-30 {img.size ||
                'w-32'} animate-bounce"
            style="{getPositionStyle(
                img.position,
            )}; animation-duration: {img.animationDuration || '4s'};"
            loading="eager"
        />
    {/each}

    <!-- Large Heading - absolutely centered in the section -->
    <h1
        class="absolute inset-0 flex items-center justify-center text-[16vw] md:text-[18vw] lg:text-[21vw] font-semibold {textColor} text-center lowercase leading-[0.85] z-10 pointer-events-none"
        style="font-family: var(--font-heading, 'Inter Tight', sans-serif);"
    >
        {title}
    </h1>

    <!-- Hero Image - positioned at bottom -->
    {#if heroImage}
        <div class="mt-auto flex justify-center items-end w-full z-20">
            <img
                src={heroImage}
                alt={heroImageAlt}
                class="max-w-[75%] lg:max-w-[85%] w-auto h-auto object-contain object-bottom"
                loading="eager"
            />
        </div>
    {/if}

    <!-- Testimonial Card - positioned at bottom right -->
    {#if testimonial}
        <div
            class="testimonial-wrapper absolute bottom-0 right-0 z-10 hidden md:flex"
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
