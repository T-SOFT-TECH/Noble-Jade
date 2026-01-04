<script lang="ts">
    import { onMount } from "svelte";
    import {
        getTestimonials,
        getTestimonialImageUrl,
        type Testimonial,
    } from "$lib/services/content";

    // Testimonials data - will be loaded from database
    let testimonials = $state<Testimonial[]>([]);
    let isLoading = $state(true);

    // Default testimonials as fallback
    const defaultTestimonials: Testimonial[] = [
        {
            id: "1",
            quote: "Great response time, staff was on time and got the job done pretty quickly. House looked great when they finished.",
            name: "Rebecca Hawland",
            role: "Client",
            image: "",
            rating: 5,
            isFeatured: true,
            isActive: true,
            sortOrder: 1,
        },
        {
            id: "2",
            quote: "Exceptional service from start to finish. The team was professional, thorough, and left my home sparkling.",
            name: "Andy Toy",
            role: "Client",
            image: "",
            rating: 5,
            isFeatured: true,
            isActive: true,
            sortOrder: 2,
        },
    ];

    onMount(async () => {
        try {
            const data = await getTestimonials();
            testimonials = data.length > 0 ? data : defaultTestimonials;
            console.log(
                "[TestimonialsCarousel] Loaded",
                testimonials.length,
                "testimonials from database",
            );
        } catch (error) {
            console.error(
                "[TestimonialsCarousel] Error loading testimonials:",
                error,
            );
            testimonials = defaultTestimonials;
        } finally {
            isLoading = false;
        }
    });

    // Get image URL - use database URL or fallback
    function getImageUrl(testimonial: Testimonial, index: number): string {
        if (testimonial.image) {
            return getTestimonialImageUrl(testimonial);
        }
        // Fallback to local images
        return `/images/testimonials_0${(index % 4) + 1}.jpg`;
    }

    let carouselRef: HTMLDivElement;
    let currentIndex = $state(0);
    let isDragging = $state(false);
    let startX = 0;
    let scrollLeft = 0;

    // Drag handlers
    function handleMouseDown(e: MouseEvent) {
        isDragging = true;
        startX = e.pageX - carouselRef.offsetLeft;
        scrollLeft = carouselRef.scrollLeft;
        carouselRef.style.cursor = "grabbing";
    }

    function handleMouseMove(e: MouseEvent) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        carouselRef.scrollLeft = scrollLeft - walk;
    }

    function handleMouseUp() {
        isDragging = false;
        carouselRef.style.cursor = "grab";
        updateCurrentIndex();
    }

    function handleMouseLeave() {
        if (isDragging) {
            isDragging = false;
            carouselRef.style.cursor = "grab";
            updateCurrentIndex();
        }
    }

    // Touch handlers
    function handleTouchStart(e: TouchEvent) {
        startX = e.touches[0].pageX - carouselRef.offsetLeft;
        scrollLeft = carouselRef.scrollLeft;
    }

    function handleTouchMove(e: TouchEvent) {
        const x = e.touches[0].pageX - carouselRef.offsetLeft;
        const walk = (x - startX) * 1.5;
        carouselRef.scrollLeft = scrollLeft - walk;
    }

    function handleTouchEnd() {
        updateCurrentIndex();
    }

    // Update current index based on scroll position
    function updateCurrentIndex() {
        if (!carouselRef) return;
        const cardWidth = carouselRef.scrollWidth / testimonials.length;
        const newIndex = Math.round(carouselRef.scrollLeft / cardWidth);
        currentIndex = Math.max(0, Math.min(newIndex, testimonials.length - 1));
    }

    // Scroll to specific index
    function scrollToIndex(index: number) {
        if (!carouselRef) return;
        const cardWidth = carouselRef.scrollWidth / testimonials.length;
        carouselRef.scrollTo({
            left: cardWidth * index,
            behavior: "smooth",
        });
        currentIndex = index;
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        scrollToIndex(nextIndex);
    }

    function prevSlide() {
        const prevIndex =
            (currentIndex - 1 + testimonials.length) % testimonials.length;
        scrollToIndex(prevIndex);
    }

    function goToSlide(index: number) {
        scrollToIndex(index);
    }

    // Handle scroll event to update dots
    function handleScroll() {
        if (!isDragging) {
            updateCurrentIndex();
        }
    }

    onMount(() => {
        carouselRef.style.cursor = "grab";
    });
</script>

<!-- Testimonials Carousel Section -->
<section class="testimonials-section">
    <div class="testimonials-container">
        <!-- Scrollable Cards -->
        <div
            class="testimonials-track"
            bind:this={carouselRef}
            onmousedown={handleMouseDown}
            onmousemove={handleMouseMove}
            onmouseup={handleMouseUp}
            onmouseleave={handleMouseLeave}
            ontouchstart={handleTouchStart}
            ontouchmove={handleTouchMove}
            ontouchend={handleTouchEnd}
            onscroll={handleScroll}
            role="region"
            aria-label="Testimonials carousel"
        >
            {#each testimonials as testimonial, index}
                <div class="testimonial-card">
                    <span class="testimonial-label">CLIENT TESTIMONIALS</span>
                    <p class="testimonial-quote">"{testimonial.quote}"</p>

                    <!-- Star Rating -->
                    <div class="star-rating">
                        {#each Array(testimonial.rating) as _}
                            <svg
                                class="star"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="#e82374"
                            >
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                />
                            </svg>
                        {/each}
                    </div>

                    <!-- Author -->
                    <div class="testimonial-author">
                        <img
                            src={getImageUrl(testimonial, index)}
                            alt={testimonial.name}
                            class="author-image"
                            draggable="false"
                        />
                        <div class="author-info">
                            <span class="author-name">{testimonial.name}</span>
                            <span class="author-role">{testimonial.role}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Navigation -->
        <div class="carousel-nav">
            <!-- Dots -->
            <div class="carousel-dots">
                {#each testimonials as _, index}
                    <button
                        type="button"
                        class="dot"
                        class:active={index === currentIndex}
                        onclick={() => goToSlide(index)}
                        aria-label="Go to slide {index + 1}"
                    ></button>
                {/each}
            </div>

            <!-- Arrows -->
            <div class="carousel-arrows">
                <button
                    type="button"
                    class="arrow prev"
                    onclick={prevSlide}
                    aria-label="Previous"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <button
                    type="button"
                    class="arrow next"
                    onclick={nextSlide}
                    aria-label="Next"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</section>

<style>
    .testimonials-section {
        padding: 4rem 1rem;
        background: var(--bg-primary, #f8f8f8);
        overflow: hidden;
    }

    .testimonials-container {
        max-width: 1400px;
        margin: 0 auto;
    }

    .testimonials-track {
        display: flex;
        gap: 2rem;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        padding: 1rem 0;
        margin-bottom: 2rem;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
        user-select: none;
    }

    .testimonials-track::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }

    .testimonial-card {
        flex: 0 0 calc(50% - 1rem);
        min-width: 400px;
        background: #ecf4fd;
        border-radius: 24px;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        scroll-snap-align: start;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
    }

    @media (max-width: 500px) {
        .testimonial-card {
            min-width: 280px;
        }
    }

    .testimonial-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    }

    .testimonial-label {
        color: #e82374;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .testimonial-quote {
        font-size: 1.25rem;
        font-weight: 600;
        color: #252525;
        line-height: 1.5;
        margin: 0;
    }

    .star-rating {
        display: flex;
        gap: 2px;
        margin-top: 0.5rem;
    }

    .star {
        width: 16px;
        height: 16px;
    }

    .testimonial-author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: auto;
        padding-top: 1rem;
    }

    .author-image {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        pointer-events: none;
    }

    .author-info {
        display: flex;
        flex-direction: column;
    }

    .author-name {
        font-weight: 600;
        color: #252525;
        font-size: 0.95rem;
    }

    .author-role {
        color: #777;
        font-size: 0.8rem;
    }

    /* Navigation */
    .carousel-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .carousel-dots {
        display: flex;
        gap: 0.5rem;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ccc;
        border: none;
        cursor: pointer;
        transition: background 0.2s ease;
        padding: 0;
    }

    .dot.active {
        background: #252525;
    }

    .carousel-arrows {
        display: flex;
        gap: 0.5rem;
    }

    .arrow {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #252525;
        transition: all 0.2s ease;
    }

    .arrow:hover {
        border-color: #1384e2;
        color: #1384e2;
    }

    /* Responsive */
    @media (max-width: 900px) {
        .testimonial-card {
            flex: 0 0 calc(100% - 2rem);
            min-width: 300px;
        }
    }

    @media (max-width: 768px) {
        .testimonial-card {
            padding: 1.75rem;
            min-width: 280px;
        }

        .testimonial-quote {
            font-size: 1.1rem;
        }
    }
</style>
