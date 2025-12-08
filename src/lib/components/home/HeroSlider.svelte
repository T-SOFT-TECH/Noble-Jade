<script lang="ts">
    import { onMount } from "svelte";
    import emblaCarouselSvelte from "embla-carousel-svelte";
    import Autoplay from "embla-carousel-autoplay";

    interface Slide {
        id: number;
        backgroundImage: string;
        heroImage: string;
        heroImageMobile: string;
        title: string;
        subtitle: string;
        ctaText: string;
        ctaLink: string;
    }

    const slides: Slide[] = [
        {
            id: 1,
            backgroundImage: "/images/about-hero.webp",
            heroImage:
                "/wp-content/uploads/sites/3/2025/07/image_03_home_01.png",
            heroImageMobile:
                "/wp-content/uploads/sites/3/2025/09/cleaning-_ladies_responisve.png",
            title: "Noble Jade",
            subtitle: "Premium Cleaning Services for Your Home & Business",
            ctaText: "Get Started",
            ctaLink: "/get-quote",
        },
        {
            id: 2,
            backgroundImage: "/images/hero_services.webp",
            heroImage: "/images/cleaner_lady.png",
            heroImageMobile: "/images/cleaner_lady.png",
            title: "We Clean",
            subtitle: "Fast, Reliable & Professional Service",
            ctaText: "Our Services",
            ctaLink: "/services",
        },
        {
            id: 3,
            backgroundImage: "/images/contact-hero.webp",
            heroImage: "/images/hero_about.png",
            heroImageMobile: "/images/hero_about.png",
            title: "Trust Us",
            subtitle: "200+ Satisfied Clients Across Canada",
            ctaText: "View Testimonials",
            ctaLink: "/testimonials",
        },
    ];

    // Floating decorative images
    interface FloatingImage {
        src: string;
        alt?: string;
        position: {
            top?: string;
            bottom?: string;
            left?: string;
            right?: string;
        };
        size?: string;
        animationDuration?: string;
    }

    const floatingImages: FloatingImage[] = [
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

    // Embla carousel state
    let emblaApi: any;
    let selectedIndex = $state(0);
    let scrollSnaps: number[] = $state([]);

    // Autoplay plugin configuration
    const autoplayPlugin = Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
    });

    const emblaOptions = {
        loop: true,
        duration: 30,
    };

    function onInit(event: CustomEvent) {
        emblaApi = event.detail;
        scrollSnaps = emblaApi.scrollSnapList();

        emblaApi.on("select", () => {
            selectedIndex = emblaApi.selectedScrollSnap();
        });
    }

    function scrollPrev() {
        if (emblaApi) emblaApi.scrollPrev();
    }

    function scrollNext() {
        if (emblaApi) emblaApi.scrollNext();
    }

    function scrollTo(index: number) {
        if (emblaApi) emblaApi.scrollTo(index);
    }

    // Helper to generate position styles
    function getPositionStyle(pos: FloatingImage["position"]): string {
        const styles = [];
        if (pos.top) styles.push(`top: ${pos.top}`);
        if (pos.bottom) styles.push(`bottom: ${pos.bottom}`);
        if (pos.left) styles.push(`left: ${pos.left}`);
        if (pos.right) styles.push(`right: ${pos.right}`);
        return styles.join("; ");
    }

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
</script>

<!-- Hero Slider Section -->
<section
    class="hero-slider relative mt-6 mx-auto w-full overflow-hidden rounded-[40px]"
>
    <!-- Embla Carousel Container -->
    <div
        class="embla"
        use:emblaCarouselSvelte={{
            options: emblaOptions,
            plugins: [autoplayPlugin],
        }}
        onemblaInit={onInit}
    >
        <div class="embla__container">
            {#each slides as slide, index (slide.id)}
                <div class="embla__slide">
                    <!-- Slide Background -->
                    {#key selectedIndex}
                        <div
                            class="slide-background absolute inset-0 z-0 {index ===
                            selectedIndex
                                ? 'bg-zoom-animate'
                                : ''}"
                            style="background-image: url('{slide.backgroundImage}');"
                        >
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-700/70"
                            ></div>
                        </div>
                    {/key}

                    <!-- Slide Content -->
                    <div
                        class="slide-content relative z-10 min-h-[85vh] flex flex-col"
                    >
                        <!-- Floating Decorative Images -->
                        {#if index === selectedIndex}
                            {#key selectedIndex}
                                {#each floatingImages as img, i}
                                    <img
                                        src={img.src}
                                        alt={img.alt || "Decorative element"}
                                        class="floating-image absolute hidden lg:block z-30 {img.size ||
                                            'w-32'} slide-in-float"
                                        style="{getPositionStyle(
                                            img.position,
                                        )}; animation-delay: {0.3 + i * 0.15}s;"
                                        loading="eager"
                                    />
                                {/each}
                            {/key}
                        {/if}

                        <!-- Floating Sparkle -->
                        {#key selectedIndex}
                            <div
                                class="absolute top-1/4 right-[10%] hidden lg:block z-10 {index ===
                                selectedIndex
                                    ? 'sparkle-enter'
                                    : ''}"
                            >
                                <div
                                    class="text-accent opacity-80 sparkle-rotate"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="120"
                                        height="120"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M12 0L14 8L22 10L14 12L12 20L10 12L2 10L10 8L12 0Z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        {/key}

                        <!-- Large Heading -->
                        {#key selectedIndex}
                            <h1
                                class="absolute inset-0 flex items-center justify-center text-[14vw] md:text-[16vw] lg:text-[18vw] font-semibold text-white/15 text-center leading-[0.85] z-10 pointer-events-none {index ===
                                selectedIndex
                                    ? 'title-animate'
                                    : ''}"
                                style="font-family: var(--font-heading, 'Inter Tight', sans-serif);"
                            >
                                {slide.title}
                            </h1>
                        {/key}

                        <!-- Hero Image -->
                        {#key selectedIndex}
                            <div
                                class="mt-auto flex justify-center items-end w-full z-20 pb-4"
                            >
                                <img
                                    src={slide.heroImage}
                                    alt="Professional Cleaning Team"
                                    class="max-w-[70%] lg:max-w-[75%] w-auto h-auto max-h-[55vh] object-contain object-bottom hidden md:block {index ===
                                    selectedIndex
                                        ? 'hero-image'
                                        : ''}"
                                    loading="eager"
                                />
                                <img
                                    src={slide.heroImageMobile}
                                    alt="Professional Cleaners"
                                    class="max-w-[85%] w-auto h-auto max-h-[45vh] object-contain object-bottom md:hidden {index ===
                                    selectedIndex
                                        ? 'hero-image'
                                        : ''}"
                                    loading="eager"
                                />
                            </div>
                        {/key}

                        <!-- Subtitle & CTA Overlay -->
                        {#key selectedIndex}
                            <div
                                class="absolute bottom-[28%] md:bottom-[22%] left-1/2 transform -translate-x-1/2 z-30 text-center px-4"
                            >
                                <p
                                    class="text-white/90 text-lg md:text-xl lg:text-2xl font-medium mb-6 max-w-2xl mx-auto {index ===
                                    selectedIndex
                                        ? 'subtitle-animate'
                                        : ''}"
                                >
                                    {slide.subtitle}
                                </p>
                                <a
                                    href={slide.ctaLink}
                                    class="btn-accent text-lg px-10 py-4 inline-block {index ===
                                    selectedIndex
                                        ? 'cta-animate'
                                        : ''}"
                                >
                                    {slide.ctaText}
                                </a>
                            </div>
                        {/key}

                        <!-- Feature Buttons (show only on first slide) -->
                        {#if index === 0}
                            {#key selectedIndex}
                                <div
                                    class="absolute bottom-[42%] md:bottom-[38%] left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row justify-center gap-4 z-30"
                                >
                                    <a
                                        href="/services"
                                        class="glass px-6 py-3 md:px-8 md:py-4 rounded-full flex items-center gap-3 group hover:scale-[1.02] transition-all {selectedIndex ===
                                        0
                                            ? 'feature-btn-1'
                                            : ''}"
                                    >
                                        <span
                                            class="text-base md:text-lg font-semibold text-theme-primary"
                                            >Fast & Reliable</span
                                        >
                                        <span
                                            class="bg-accent text-white p-2 rounded-full"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                            >
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                    </a>
                                    <a
                                        href="/about"
                                        class="glass px-6 py-3 md:px-8 md:py-4 rounded-full flex items-center gap-3 group hover:scale-[1.02] transition-all {selectedIndex ===
                                        0
                                            ? 'feature-btn-2'
                                            : ''}"
                                    >
                                        <span
                                            class="text-base md:text-lg font-semibold text-theme-primary"
                                            >Trusted Team</span
                                        >
                                        <span
                                            class="bg-accent text-white p-2 rounded-full"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                            >
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                            {/key}
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Navigation Arrows -->
    <button
        class="nav-arrow nav-arrow-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 arrow-left-enter"
        onclick={scrollPrev}
        aria-label="Previous slide"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <path d="M15 18l-6-6 6-6" />
        </svg>
    </button>
    <button
        class="nav-arrow nav-arrow-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 arrow-right-enter"
        onclick={scrollNext}
        aria-label="Next slide"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <path d="M9 18l6-6-6-6" />
        </svg>
    </button>

    <!-- Dot Indicators -->
    <div
        class="dot-indicators absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3 dots-enter"
    >
        {#each slides as _, index}
            <button
                class="dot {selectedIndex === index
                    ? 'dot-active'
                    : ''} dot-pop"
                style="animation-delay: {0.8 + index * 0.1}s;"
                onclick={() => scrollTo(index)}
                aria-label="Go to slide {index + 1}"
            ></button>
        {/each}
    </div>

    <!-- Testimonial Card -->
    <div
        class="testimonial-wrapper absolute bottom-0 right-0 z-40 hidden md:flex testimonial-enter"
    >
        <div
            class="testimonial-card relative max-w-[310px] px-8 py-6 rounded-tl-[40px]"
            style="background-color: var(--bg-primary, #252525); color: var(--text-primary, #ffffff);"
        >
            <div class="flex items-center gap-4">
                <img
                    src="/images/credentials_home_01.png"
                    alt="Client credentials"
                    class="max-w-[100px] h-auto testimonial-img-enter"
                    loading="eager"
                />
                <div class="text-sm leading-snug testimonial-text-enter">
                    <div class="flex text-yellow-400 mb-1 stars-enter">
                        {#each Array(5) as _, i}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                class="star-pop"
                                style="animation-delay: {1.2 + i * 0.1}s;"
                            >
                                <polygon
                                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                />
                            </svg>
                        {/each}
                    </div>
                    <span
                        >Trusted by<br /><strong class="font-medium block"
                            >200+ clients</strong
                        ></span
                    >
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    /* Embla Carousel Base Styles */
    .embla {
        overflow: hidden;
        width: 100%;
    }

    .embla__container {
        display: flex;
        touch-action: pan-y pinch-zoom;
    }

    .embla__slide {
        position: relative;
        flex: 0 0 100%;
        min-width: 0;
    }

    /* Slide Background */
    .slide-background {
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    /* Navigation Arrows */
    .nav-arrow {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .nav-arrow:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-50%) scale(1.1);
    }

    .nav-arrow-prev:hover {
        transform: translateY(-50%) scale(1.1) translateX(-2px);
    }

    .nav-arrow-next:hover {
        transform: translateY(-50%) scale(1.1) translateX(2px);
    }

    /* Dot Indicators */
    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .dot:hover {
        background: rgba(255, 255, 255, 0.7);
    }

    .dot-active {
        background: var(--accent, #1384e2);
        width: 32px;
        border-radius: 6px;
    }

    /* Hero Image Animation */
    .hero-image {
        animation: heroImageEnter 0.8s ease-out forwards;
    }

    @keyframes heroImageEnter {
        from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* Title Animation */
    .title-animate {
        animation: titleEnter 0.6s ease-out forwards;
    }

    @keyframes titleEnter {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    /* Subtitle Animation */
    .subtitle-animate {
        animation: subtitleEnter 0.7s ease-out 0.2s forwards;
        opacity: 0;
    }

    @keyframes subtitleEnter {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* CTA Animation */
    .cta-animate {
        animation: ctaEnter 0.7s ease-out 0.4s forwards;
        opacity: 0;
    }

    @keyframes ctaEnter {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Slide In Animation for floating elements */
    .slide-in-float {
        animation: slideInFloat 0.8s ease-out forwards;
        opacity: 0;
    }

    @keyframes slideInFloat {
        from {
            opacity: 0;
            transform: translateX(-40px) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Sparkle Rotation Animation */
    .sparkle-rotate {
        animation: sparkleRotate 8s linear infinite;
    }

    @keyframes sparkleRotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Background Zoom Animation */
    .bg-zoom-animate {
        animation: bgZoom 8s ease-out forwards;
    }

    @keyframes bgZoom {
        from {
            transform: scale(1.1);
        }
        to {
            transform: scale(1);
        }
    }

    /* Sparkle Enter Animation */
    .sparkle-enter {
        animation: sparkleEnter 0.8s ease-out 0.3s forwards;
        opacity: 0;
    }

    @keyframes sparkleEnter {
        from {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }

    /* Navigation Arrow Animations */
    .arrow-left-enter {
        animation: arrowLeftEnter 0.6s ease-out 0.5s forwards;
        opacity: 0;
    }

    @keyframes arrowLeftEnter {
        from {
            opacity: 0;
            transform: translateY(-50%) translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
        }
    }

    .arrow-right-enter {
        animation: arrowRightEnter 0.6s ease-out 0.5s forwards;
        opacity: 0;
    }

    @keyframes arrowRightEnter {
        from {
            opacity: 0;
            transform: translateY(-50%) translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
        }
    }

    /* Dots Pop Animation */
    .dots-enter {
        animation: dotsEnter 0.5s ease-out 0.7s forwards;
        opacity: 0;
    }

    @keyframes dotsEnter {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    .dot-pop {
        animation: dotPop 0.4s ease-out forwards;
        opacity: 0;
        transform: scale(0);
    }

    @keyframes dotPop {
        from {
            opacity: 0;
            transform: scale(0);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    /* Feature Button Animations */
    .feature-btn-1 {
        animation: featureBtnEnter 0.6s ease-out 0.6s forwards;
        opacity: 0;
    }

    .feature-btn-2 {
        animation: featureBtnEnter 0.6s ease-out 0.75s forwards;
        opacity: 0;
    }

    @keyframes featureBtnEnter {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* Testimonial Card Animations */
    .testimonial-enter {
        animation: testimonialEnter 0.8s ease-out 0.9s forwards;
        opacity: 0;
    }

    @keyframes testimonialEnter {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .testimonial-img-enter {
        animation: testimonialImgEnter 0.5s ease-out 1.1s forwards;
        opacity: 0;
    }

    @keyframes testimonialImgEnter {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .testimonial-text-enter {
        animation: testimonialTextEnter 0.5s ease-out 1.15s forwards;
        opacity: 0;
    }

    @keyframes testimonialTextEnter {
        from {
            opacity: 0;
            transform: translateX(10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .star-pop {
        animation: starPop 0.3s ease-out forwards;
        opacity: 0;
        transform: scale(0);
    }

    @keyframes starPop {
        from {
            opacity: 0;
            transform: scale(0) rotate(-90deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }

    /* Testimonial Card Curved Corners */
    .hero-slider {
        --testimonial-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M30,30 L30,0 C30,16.57 16.57,30 0,30 L30,30 Z' fill='%23000'/%3E%3C/svg%3E");
        --testimonial-mask-02: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M0,30 L30,30 C13.43,30 0,16.57 0,0 L0,30 Z' fill='%23000'/%3E%3C/svg%3E");
    }

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

    :global(:root.light) .testimonial-card::before,
    :global(:root.light) .testimonial-card::after {
        background-color: var(--bg-primary, #ffffff);
    }
</style>
