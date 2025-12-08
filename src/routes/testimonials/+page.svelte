<script lang="ts">
    import PageHero from "$lib/components/shared/PageHero.svelte";
    import TestimonialsCarousel from "$lib/components/home/TestimonialsCarousel.svelte";

    const featuredTestimonials = [
        {
            quote: "Qleen transformed our office. Clean, fresh, and organized every time. Their team is professional, punctual, and a pleasure to work with.",
            name: "Daniel R",
            role: "Office Manager, Brooklyn",
            image: "/wp-content/uploads/sites/3/2025/07/testimonial_06.png",
            rating: 5,
        },
        {
            quote: "Qleen did such an awesome job! They were even mindful of using natural cleaning products for my kiddos room, which I was so appreciative of.",
            name: "Annie Bennedict",
            role: "Client",
            image: "/wp-content/uploads/sites/3/2019/02/testimonials_02.jpg",
            rating: 5,
        },
        {
            quote: "Great response time, staff was on time and got the job done pretty quickly. House looked great when they finished. If anyone needs a clean home contact Qleen.",
            name: "Rebecca Hawland",
            role: "Client",
            image: "/wp-content/uploads/sites/3/2019/02/testimonials_01.jpg",
            rating: 5,
        },
    ];

    const surveyStats = [
        { label: "Punctuality of cleaners", value: 96 },
        { label: "Quality of cleaning", value: 94 },
        { label: "Respect for your home & belongings", value: 100 },
        { label: "Rebooking rate", value: 80 },
    ];
</script>

<svelte:head>
    <title>Testimonials - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="Read what our satisfied customers have to say about Noble Jade Cleaning Services. Real reviews from real clients."
    />
</svelte:head>

<div class="testimonials-page">
    <!-- Hero Section -->
    <PageHero
        title="testimonials"
        bgColor="bg-alternate"
        textColor="text-white/50"
        heroImage="/wp-content/uploads/sites/3/2025/07/hero_testimonials.html"
        heroImageAlt="Testimonials hero"
        testimonial={{
            imageSrc: "/images/credentials_home_01.png",
            text: "Trusted by",
            highlight: "200+ clients",
        }}
    >
        <div class="hero-badges">
            <span class="badge badge-accent">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Fast & Reliable
            </span>
            <span class="badge badge-blue">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                    />
                    <path d="M7 12l3 3 7-7" />
                </svg>
                Safe & Eco Friendly
            </span>
        </div>
    </PageHero>

    <!-- Featured Testimonials Section -->
    <section class="featured-testimonials">
        <div class="container">
            <div class="section-header">
                <h2>Words from Our Satisfied Customers</h2>
                <div class="header-actions">
                    <a href="/contact" class="btn-primary">Book Online</a>
                    <a href="tel:8442429464" class="phone-link">
                        <span class="phone-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                                />
                            </svg>
                        </span>
                        (844) 242-9464
                    </a>
                </div>
            </div>

            <div class="testimonials-list">
                {#each featuredTestimonials as testimonial, index}
                    <div
                        class="testimonial-card"
                        class:offset={index % 2 === 1}
                    >
                        <span class="superheadline">Client Testimonials</span>
                        <div class="quote-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M11 7v4H7v6h6v-6h-2V7h4v10H5V7h6zm8 0v4h-4v6h6v-6h-2V7h4v10h-8V7h4z"
                                />
                            </svg>
                        </div>
                        <p class="quote">"{testimonial.quote}"</p>
                        <div class="rating">
                            {#each Array(testimonial.rating) as _}
                                <span class="star">★</span>
                            {/each}
                        </div>
                        <div class="author">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                class="author-image"
                            />
                            <div class="author-info">
                                <span class="name">{testimonial.name}</span>
                                <span class="role">{testimonial.role}</span>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Satisfaction Survey Section -->
    <section class="satisfaction-section">
        <div class="container">
            <div class="satisfaction-grid">
                <div class="satisfaction-image">
                    <img
                        src="/wp-content/uploads/sites/3/2025/07/image_10_home_01.png"
                        alt="Happy cleaner"
                    />
                    <div class="satisfaction-badge">
                        <span class="badge-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                                />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </span>
                        <div class="badge-content">
                            <span class="badge-number">96%</span>
                            <span class="badge-text">Satisfaction Rate</span>
                        </div>
                    </div>
                </div>

                <div class="satisfaction-content">
                    <span class="superheadline">Numbers Talking</span>
                    <h2>Satisfaction Survey</h2>

                    <div class="progress-bars">
                        {#each surveyStats as stat}
                            <div class="progress-item">
                                <div class="progress-header">
                                    <span class="progress-label"
                                        >{stat.label}</span
                                    >
                                    <span class="progress-value"
                                        >{stat.value}%</span
                                    >
                                </div>
                                <div class="progress-bar">
                                    <div
                                        class="progress-fill"
                                        style="width: {stat.value}%"
                                    ></div>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <p class="survey-note">
                        *Clients satisfaction survey based on 298 responses
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Carousel Section -->
    <section class="carousel-section">
        <div class="container">
            <h2 class="section-title">Our Shining Reviews</h2>
            <TestimonialsCarousel />
        </div>
    </section>

    <!-- Why Choose Us CTA -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-grid">
                <div class="cta-content">
                    <span class="superheadline">Why Choose Us</span>
                    <h2>Cleaning You Can Count On, Without the Fuss.</h2>
                    <p>
                        Providing a reliable and trustworthy service since 2010.
                    </p>
                    <div class="cta-buttons">
                        <a href="/services" class="btn-primary">
                            View All Services
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                />
                            </svg>
                        </a>
                        <a href="/get-quote" class="btn-secondary"
                            >Get a Quote</a
                        >
                    </div>
                </div>
                <div class="cta-image">
                    <img
                        src="/wp-content/uploads/sites/3/2025/07/image_13_services.png"
                        alt="Cleaning service"
                    />
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    .testimonials-page {
        display: flex;
        flex-direction: column;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .superheadline {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        color: var(--text-secondary, #666);
        display: block;
        margin-bottom: 0.5rem;
    }

    :global(.dark) .superheadline {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    /* Hero Badges */
    .hero-badges {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        border-radius: 50px;
        font-weight: 500;
        font-size: 0.875rem;
        backdrop-filter: blur(10px);
    }

    .badge-accent {
        background-color: rgba(232, 35, 116, 0.2);
        color: white;
    }

    .badge-blue {
        background-color: rgba(19, 132, 226, 0.2);
        color: white;
    }

    /* Featured Testimonials Section */
    .featured-testimonials {
        padding: 5rem 1rem;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
        flex-wrap: wrap;
        gap: 1.5rem;
    }

    .section-header h2 {
        font-size: 2rem;
        font-weight: 500;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .section-header h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        background-color: var(--accent-color, #e82374);
        color: white;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .btn-primary:hover {
        transform: scale(1.02);
    }

    .btn-primary svg {
        transition: transform 0.3s ease;
    }

    .btn-primary:hover svg {
        transform: rotate(45deg);
    }

    .btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        background-color: var(--light-blue, #ecf4fd);
        color: var(--text-primary, #252525);
        border-radius: 50px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    :global(.dark) .btn-secondary {
        background-color: var(--bg-secondary-dark, #252525);
        color: var(--text-primary-dark, #f5f5f5);
    }

    .btn-secondary:hover {
        transform: scale(1.02);
    }

    .phone-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-primary, #252525);
        text-decoration: none;
        font-weight: 600;
    }

    :global(.dark) .phone-link {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .phone-icon {
        width: 36px;
        height: 36px;
        background-color: var(--accent-color, #e82374);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        animation: shake 2s ease-in-out infinite;
    }

    @keyframes shake {
        0%,
        100% {
            transform: rotate(0deg);
        }
        10%,
        30% {
            transform: rotate(-10deg);
        }
        20%,
        40% {
            transform: rotate(10deg);
        }
        50%,
        100% {
            transform: rotate(0deg);
        }
    }

    .testimonials-list {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .testimonial-card {
        background: var(--light-blue, #ecf4fd);
        border-radius: var(--border-radius-xl, 2rem);
        padding: 2.5rem;
        max-width: 75%;
    }

    :global(.dark) .testimonial-card {
        background: var(--bg-secondary-dark, #252525);
    }

    .testimonial-card.offset {
        margin-left: auto;
    }

    .quote-icon {
        color: var(--alternate-color, #1384e2);
        margin-bottom: 1rem;
    }

    .quote {
        font-size: 1.125rem;
        line-height: 1.6;
        color: var(--text-primary, #252525);
        margin: 0 0 1.5rem;
    }

    :global(.dark) .quote {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .rating {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 1.5rem;
    }

    .star {
        color: #f5c518;
        font-size: 1.25rem;
    }

    .author {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .author-image {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
    }

    .author-info {
        display: flex;
        flex-direction: column;
    }

    .name {
        font-weight: 600;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .name {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .role {
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .role {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    /* Satisfaction Section */
    .satisfaction-section {
        padding: 5rem 1rem;
        background: var(--bg-primary, #f8f8f8);
    }

    :global(.dark) .satisfaction-section {
        background: var(--bg-primary-dark, #1a1a1a);
    }

    .satisfaction-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }

    .satisfaction-image {
        position: relative;
    }

    .satisfaction-image img {
        width: 100%;
        height: auto;
        border-radius: var(--border-radius-xl, 2rem);
    }

    .satisfaction-badge {
        position: absolute;
        bottom: 2rem;
        right: 0;
        background: var(--bg-primary, #f8f8f8);
        border-radius: var(--border-radius-lg, 1.5rem);
        padding: 1.5rem;
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    :global(.dark) .satisfaction-badge {
        background: var(--bg-secondary-dark, #252525);
    }

    .badge-icon {
        width: 48px;
        height: 48px;
        background-color: var(--alternate-color, #1384e2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .badge-content {
        display: flex;
        flex-direction: column;
    }

    .badge-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--alternate-color, #1384e2);
    }

    .badge-text {
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .badge-text {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .satisfaction-content h2 {
        font-size: 2rem;
        font-weight: 500;
        margin: 0 0 2rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .satisfaction-content h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .progress-bars {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .progress-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .progress-header {
        display: flex;
        justify-content: space-between;
    }

    .progress-label {
        color: var(--text-primary, #252525);
        font-weight: 500;
    }

    :global(.dark) .progress-label {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .progress-value {
        color: var(--alternate-color, #1384e2);
        font-weight: 600;
    }

    .progress-bar {
        height: 8px;
        background: rgba(19, 132, 226, 0.2);
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: var(--alternate-color, #1384e2);
        border-radius: 4px;
        transition: width 1s ease-out;
    }

    .survey-note {
        margin-top: 1.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
        opacity: 0.7;
    }

    :global(.dark) .survey-note {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    /* Carousel Section */
    .carousel-section {
        padding: 5rem 1rem;
        background: var(--light-blue, #ecf4fd);
    }

    :global(.dark) .carousel-section {
        background: var(--bg-secondary-dark, #252525);
    }

    .section-title {
        text-align: center;
        font-size: 2rem;
        font-weight: 500;
        margin-bottom: 3rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .section-title {
        color: var(--text-primary-dark, #f5f5f5);
    }

    /* CTA Section */
    .cta-section {
        padding: 5rem 1rem;
    }

    .cta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }

    .cta-content h2 {
        font-size: 2.5rem;
        font-weight: 500;
        margin: 0 0 1rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .cta-content h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .cta-content p {
        color: var(--text-secondary, #666);
        margin-bottom: 2rem;
    }

    :global(.dark) .cta-content p {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .cta-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .cta-image img {
        width: 100%;
        height: auto;
        border-radius: var(--border-radius-xl, 2rem);
    }

    /* Responsive */
    @media (max-width: 992px) {
        .satisfaction-grid,
        .cta-grid {
            grid-template-columns: 1fr;
        }

        .testimonial-card {
            max-width: 100%;
        }

        .testimonial-card.offset {
            margin-left: 0;
        }

        .section-header {
            flex-direction: column;
            align-items: flex-start;
        }
    }

    @media (max-width: 768px) {
        .hero-badges {
            flex-direction: column;
        }

        .section-header h2,
        .satisfaction-content h2,
        .cta-content h2 {
            font-size: 1.5rem;
        }

        .header-actions {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
