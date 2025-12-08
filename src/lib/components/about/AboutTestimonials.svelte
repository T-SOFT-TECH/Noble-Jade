<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    // Testimonials data
    const testimonials = [
        {
            quote: "It vinyl distillery trade raw. Asymmetrical lyft shaman vaporware street affogato. Mi marfa vibecession pug offal.",
            name: "Pete Goldner",
            role: "Client",
            image: "/images/testimonials_04.jpg",
        },
        {
            quote: "They were even mindful of using natural cleaning products for my kiddos room, which I was so appreciative of.",
            name: "Rebecca Hawland",
            role: "Client",
            image: "/images/testimonials_01.jpg",
            badge: { views: "1,920", comments: "433" },
        },
        {
            quote: "Great response time, staff was on time and got the job done pretty quickly. House looked great when they finished.",
            name: "Annie Bennedict",
            role: "Client",
            image: "/images/testimonials_02.jpg",
        },
        {
            quote: "Exceptional service from start to finish. The team was professional, thorough, and left my home sparkling clean.",
            name: "Andy Toy",
            role: "Client",
            image: "/images/testimonials_03.jpg",
        },
        {
            quote: "I've tried many cleaning services over the years, but this one truly stands out. Reliable, affordable, and outstanding results.",
            name: "Sarah Mitchell",
            role: "Client",
            image: "/images/testimonials_01.jpg",
        },
    ];

    // Create a very long array by repeating testimonials many times
    // This ensures we never visually hit the end
    const repeatCount = 20; // Repeat 20 times = 100 slides total
    const allSlides: typeof testimonials = [];
    for (let i = 0; i < repeatCount; i++) {
        allSlides.push(...testimonials);
    }

    // Start in the middle of the array
    const startOffset = Math.floor(repeatCount / 2) * testimonials.length;

    let trackIndex = $state(startOffset);
    let isTransitioning = $state(false);
    let trackRef: HTMLDivElement;

    // Drag state
    let isDragging = $state(false);
    let startX = 0;
    let dragOffset = $state(0);
    let lastDragTime = 0;
    let lastDragX = 0;
    let velocity = 0;

    // Calculate visible slides based on screen width
    let slidesToShow = $state(3);

    function updateSlidesToShow() {
        if (typeof window !== "undefined") {
            if (window.innerWidth <= 480) {
                slidesToShow = 1;
            } else if (window.innerWidth <= 768) {
                slidesToShow = 2;
            } else {
                slidesToShow = 3;
            }
        }
    }

    // Get the real index (0-4) for displaying active dot
    function getRealIndex(): number {
        return (
            ((trackIndex % testimonials.length) + testimonials.length) %
            testimonials.length
        );
    }

    // Get the transform offset for current position
    function getTransformOffset(): string {
        const slideWidth = 100 / slidesToShow;
        const offset = -(trackIndex * slideWidth) + dragOffset;
        return `translateX(${offset}%)`;
    }

    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        trackIndex++;
        setTimeout(() => (isTransitioning = false), 650);
    }

    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        trackIndex--;
        setTimeout(() => (isTransitioning = false), 650);
    }

    function goToSlide(targetRealIndex: number) {
        if (isTransitioning) return;
        const currentRealIndex = getRealIndex();
        if (targetRealIndex === currentRealIndex) return;

        isTransitioning = true;
        // Calculate the difference and move that many slides
        let diff = targetRealIndex - currentRealIndex;
        // Take the shorter path
        if (diff > testimonials.length / 2) {
            diff -= testimonials.length;
        } else if (diff < -testimonials.length / 2) {
            diff += testimonials.length;
        }
        trackIndex += diff;
        setTimeout(() => (isTransitioning = false), 650);
    }

    // Touch/Mouse drag handlers
    function handleDragStart(e: MouseEvent | TouchEvent) {
        if (isTransitioning) return;
        isDragging = true;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        startX = clientX;
        lastDragX = clientX;
        lastDragTime = Date.now();
        velocity = 0;

        if (trackRef) {
            trackRef.style.transition = "none";
        }
    }

    function handleDragMove(e: MouseEvent | TouchEvent) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const containerWidth = trackRef?.parentElement?.offsetWidth || 1;
        const diff = clientX - startX;

        // Calculate velocity
        const now = Date.now();
        const dt = now - lastDragTime;
        if (dt > 0) {
            velocity = (clientX - lastDragX) / dt;
        }
        lastDragX = clientX;
        lastDragTime = now;

        // Convert pixel offset to percentage
        dragOffset = (diff / containerWidth) * 100;
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;

        if (trackRef) {
            trackRef.style.transition = "";
        }

        const slideWidth = 100 / slidesToShow;
        const threshold = slideWidth * 0.15;
        const velocityThreshold = 0.3;

        if (dragOffset < -threshold || velocity < -velocityThreshold) {
            nextSlide();
        } else if (dragOffset > threshold || velocity > velocityThreshold) {
            prevSlide();
        }

        dragOffset = 0;
    }

    onMount(() => {
        updateSlidesToShow();

        if (typeof window !== "undefined") {
            window.addEventListener("resize", updateSlidesToShow);
        }
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", updateSlidesToShow);
        }
    });
</script>

<!-- Testimonials Carousel Section -->
<section class="about-testimonials">
    <div class="testimonials-container">
        <!-- Carousel wrapper -->
        <div
            class="carousel-wrapper"
            onmousedown={handleDragStart}
            onmousemove={handleDragMove}
            onmouseup={handleDragEnd}
            onmouseleave={handleDragEnd}
            ontouchstart={handleDragStart}
            ontouchmove={handleDragMove}
            ontouchend={handleDragEnd}
            role="region"
            aria-label="Testimonials carousel"
        >
            <div
                class="testimonials-track"
                class:no-transition={isDragging}
                bind:this={trackRef}
                style="transform: {getTransformOffset()}; --slides-to-show: {slidesToShow};"
            >
                {#each allSlides as testimonial, index}
                    <div class="testimonial-card">
                        <!-- Quote Icon -->
                        <div class="quote-icon">
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="#e82374"
                            >
                                <path
                                    d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"
                                />
                            </svg>
                        </div>

                        <!-- Quote Text -->
                        <p class="testimonial-quote">{testimonial.quote}</p>

                        <!-- Badge (if exists) -->
                        {#if testimonial.badge}
                            <div class="testimonial-badge">
                                <span
                                    >{testimonial.badge.views} • {testimonial
                                        .badge.comments}</span
                                >
                            </div>
                        {/if}

                        <!-- Author -->
                        <div class="testimonial-author">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                class="author-image"
                                draggable="false"
                            />
                            <div class="author-info">
                                <span class="author-name"
                                    >{testimonial.name}</span
                                >
                                <span class="author-role"
                                    >{testimonial.role}</span
                                >
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Navigation -->
        <div class="carousel-nav">
            <!-- Dots -->
            <div class="carousel-dots">
                {#each testimonials as _, index}
                    <button
                        type="button"
                        class="dot"
                        class:active={index === getRealIndex()}
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
    .about-testimonials {
        padding: 4rem 1rem;
        background: var(--bg-primary, #f8f8f8);
        overflow: hidden;
    }

    .testimonials-container {
        max-width: 1400px;
        margin: 0 auto;
    }

    .carousel-wrapper {
        overflow: hidden;
        padding: 1rem 0;
        cursor: grab;
        user-select: none;
    }

    .carousel-wrapper:active {
        cursor: grabbing;
    }

    .testimonials-track {
        display: flex;
        gap: 1.5rem;
        transition: transform 600ms ease-out;
        will-change: transform;
    }

    .testimonials-track.no-transition {
        transition: none;
    }

    .testimonial-card {
        flex: 0 0 calc((100% - 3rem) / var(--slides-to-show));
        min-width: 0;
        background: white;
        border-radius: 20px;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: box-shadow 0.3s ease;
    }

    .testimonial-card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .quote-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .quote-icon svg {
        opacity: 0.9;
    }

    .testimonial-quote {
        font-size: 1rem;
        color: #555;
        line-height: 1.7;
        margin: 0;
        flex-grow: 1;
    }

    .testimonial-badge {
        display: inline-flex;
        align-items: center;
        background: #252525;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        width: fit-content;
    }

    .testimonial-author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: auto;
        padding-top: 0.5rem;
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
        color: #e82374;
        font-size: 0.8rem;
    }

    /* Navigation */
    .carousel-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0 0;
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
        transition: all 0.3s ease;
        padding: 0;
    }

    .dot.active {
        background: #252525;
        transform: scale(1.2);
    }

    .carousel-arrows {
        display: flex;
        gap: 0.5rem;
    }

    .arrow {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #252525;
        transition: all 0.3s ease;
    }

    .arrow:hover {
        border-color: #e82374;
        color: #e82374;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .testimonial-card {
            flex: 0 0 calc((100% - 1.5rem) / var(--slides-to-show));
        }

        .carousel-nav {
            flex-direction: column;
            gap: 1rem;
        }
    }

    @media (max-width: 480px) {
        .testimonial-card {
            flex: 0 0 100%;
        }
    }
</style>
