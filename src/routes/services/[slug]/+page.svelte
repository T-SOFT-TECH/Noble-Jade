<script lang="ts">
    import { page } from "$app/stores";
    import PageHero from "$lib/components/shared/PageHero.svelte";
    import FAQSection from "$lib/components/home/FAQSection.svelte";

    // Service data (would typically come from a CMS or API)
    const services: Record<
        string,
        {
            title: string;
            heroImage: string;
            description: string;
            features: string[];
            steps: Array<{ title: string; description: string; icon: string }>;
        }
    > = {
        "office-cleaning": {
            title: "office clean",
            heroImage:
                "/wp-content/uploads/sites/3/2025/07/image_01_single_service.png",
            description:
                "Expert office cleaning services to keep your workspace clean, professional, and productivity-ready.",
            features: [
                "Background checked cleaners",
                "Easy last minute bookings",
                "Insured up to $2M",
                "No contracts or commitments",
            ],
            steps: [
                {
                    title: "Initial Consultation",
                    description:
                        "We begin with a free consultation to understand your office layout, cleaning needs, schedule preferences, and any specific requests.",
                    icon: "chat",
                },
                {
                    title: "Customized Cleaning Plan",
                    description:
                        "We create a tailored cleaning plan which includes areas to be cleaned, frequency, and any add-on services like carpet care or disinfection.",
                    icon: "clipboard",
                },
                {
                    title: "Scheduling and Onboarding",
                    description:
                        "We schedule cleanings at times that minimize disruption to your team. You'll be introduced to your cleaning crew and receive a point of contact for all communication.",
                    icon: "calendar",
                },
                {
                    title: "Professional Cleaning Begins",
                    description:
                        "Our trained, uniformed team arrives on time with all necessary equipment and supplies. We follow the agreed checklist and protocols, focusing on thoroughness, safety, and consistency.",
                    icon: "sparkles",
                },
                {
                    title: "Quality Assurance",
                    description:
                        "After each visit or at regular intervals, we conduct quality checks to ensure high standards are maintained. Feedback is welcomed and adjustments are made quickly if needed.",
                    icon: "check-circle",
                },
                {
                    title: "Communication & Support",
                    description:
                        "You can reach us easily for schedule changes, extra services, or special instructions. We value transparency, responsiveness, and long-term relationships.",
                    icon: "phone",
                },
            ],
        },
        "home-cleaning": {
            title: "home clean",
            heroImage:
                "/wp-content/uploads/sites/3/2025/07/image_10_home_01.png",
            description:
                "Professional home cleaning services that transform your living space into a spotless sanctuary.",
            features: [
                "Vetted & trained cleaners",
                "Flexible scheduling",
                "Eco-friendly products available",
                "Satisfaction guaranteed",
            ],
            steps: [
                {
                    title: "Book Your Clean",
                    description:
                        "Choose your service type, date, and time that works best for your schedule through our easy online booking system.",
                    icon: "calendar",
                },
                {
                    title: "Meet Your Cleaner",
                    description:
                        "We match you with a vetted, background-checked professional cleaner who will get to know your home and preferences.",
                    icon: "user",
                },
                {
                    title: "Detailed Cleaning",
                    description:
                        "Your cleaner arrives with all supplies needed and follows a comprehensive checklist covering every room and surface.",
                    icon: "sparkles",
                },
                {
                    title: "Final Walkthrough",
                    description:
                        "We ensure everything meets our high standards before leaving your home sparkling clean.",
                    icon: "check-circle",
                },
                {
                    title: "Feedback & Follow-up",
                    description:
                        "Rate your experience and let us know if anything needs attention. We're committed to your complete satisfaction.",
                    icon: "chat",
                },
                {
                    title: "Schedule Recurring",
                    description:
                        "Keep your home consistently clean with weekly, bi-weekly, or monthly recurring service with discounts up to 15%.",
                    icon: "repeat",
                },
            ],
        },
        "deep-cleaning": {
            title: "deep clean",
            heroImage:
                "/wp-content/uploads/sites/3/2025/07/image_03_single_service.png",
            description:
                "Intensive deep cleaning service that reaches every corner, removing built-up grime and restoring freshness to your space.",
            features: [
                "Extended cleaning time",
                "Behind furniture & appliances",
                "Inside cabinets & closets",
                "All surfaces sanitized",
            ],
            steps: [
                {
                    title: "Assessment",
                    description:
                        "We evaluate your space to identify areas needing extra attention and create a customized deep cleaning plan.",
                    icon: "search",
                },
                {
                    title: "Declutter & Prep",
                    description:
                        "Our team clears surfaces and moves furniture as needed to access every hidden corner and crevice.",
                    icon: "box",
                },
                {
                    title: "Deep Scrub",
                    description:
                        "Using professional-grade equipment and solutions, we tackle stubborn stains, grease, and buildup throughout your space.",
                    icon: "sparkles",
                },
                {
                    title: "Sanitization",
                    description:
                        "All high-touch surfaces are thoroughly sanitized to eliminate germs and create a healthier environment.",
                    icon: "shield",
                },
                {
                    title: "Detail Work",
                    description:
                        "We focus on often-overlooked areas: baseboards, light fixtures, vents, window tracks, and more.",
                    icon: "zoom",
                },
                {
                    title: "Final Inspection",
                    description:
                        "A thorough walkthrough ensures every area meets our deep cleaning standards before we consider the job complete.",
                    icon: "check-circle",
                },
            ],
        },
    };

    // Get current service based on URL slug
    $: slug = $page.params.slug;
    $: service = services[slug] || services["office-cleaning"];
</script>

<svelte:head>
    <title>{service.title} - Noble Jade Cleaning Services</title>
    <meta name="description" content={service.description} />
</svelte:head>

<div class="single-service-page">
    <!-- Hero Section -->
    <PageHero
        title={service.title}
        bgColor="bg-alternate"
        textColor="text-white/50"
        heroImage={service.heroImage}
        heroImageAlt={service.title}
        testimonial={{
            imageSrc: "/images/credentials_home_01.png",
            text: "Trusted by",
            highlight: "200+ clients",
        }}
    />

    <!-- Service Description Section -->
    <section class="service-intro">
        <div class="container">
            <div class="intro-content">
                <span class="superheadline">Step by step</span>
                <h2>
                    {service.title
                        .split(" ")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")} Service
                </h2>
                <p class="description">{service.description}</p>

                <div class="features-list">
                    {#each service.features as feature}
                        <div class="feature-item">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>{feature}</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <!-- Process Steps Section -->
    <section class="process-section">
        <div class="container">
            <div class="steps-grid">
                {#each service.steps as step, index}
                    <div class="step-card">
                        <div class="step-icon">
                            {#if step.icon === "chat"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                                    />
                                </svg>
                            {:else if step.icon === "clipboard"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                                    />
                                    <rect
                                        x="8"
                                        y="2"
                                        width="8"
                                        height="4"
                                        rx="1"
                                        ry="1"
                                    />
                                </svg>
                            {:else if step.icon === "calendar"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                    />
                                    <line x1="16" y1="2" x2="16" y2="6" /><line
                                        x1="8"
                                        y1="2"
                                        x2="8"
                                        y2="6"
                                    />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            {:else if step.icon === "sparkles"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
                                    />
                                    <path
                                        d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z"
                                    />
                                </svg>
                            {:else if step.icon === "check-circle"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                                    />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            {:else if step.icon === "phone"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                                    />
                                </svg>
                            {:else if step.icon === "user"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                    />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            {:else if step.icon === "repeat"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <polyline points="17 1 21 5 17 9" />
                                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                    <polyline points="7 23 3 19 7 15" />
                                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                                </svg>
                            {:else if step.icon === "search"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <circle cx="11" cy="11" r="8" /><line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                    />
                                </svg>
                            {:else if step.icon === "box"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                                    />
                                    <polyline
                                        points="3.27 6.96 12 12.01 20.73 6.96"
                                    /><line
                                        x1="12"
                                        y1="22.08"
                                        x2="12"
                                        y2="12"
                                    />
                                </svg>
                            {:else if step.icon === "shield"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                                    />
                                </svg>
                            {:else if step.icon === "zoom"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                    />
                                    <line x1="11" y1="8" x2="11" y2="14" /><line
                                        x1="8"
                                        y1="11"
                                        x2="14"
                                        y2="11"
                                    />
                                </svg>
                            {:else}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                            {/if}
                        </div>
                        <span class="step-number">Step {index + 1}</span>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="cta-wrapper">
            <div class="cta-content">
                <div class="cta-text">
                    <h2>Enjoy a Sparkling Clean<br />Space Today</h2>
                    <p>
                        Contact Us Online or via Social Media For More Detailed
                        Plan
                    </p>
                    <div class="social-icons">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener"
                            class="social-icon"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                                />
                            </svg>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener"
                            class="social-icon"
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
                                <rect
                                    x="2"
                                    y="2"
                                    width="20"
                                    height="20"
                                    rx="5"
                                    ry="5"
                                />
                                <path
                                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                                />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener"
                            class="social-icon"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="cta-image">
                    <img
                        src="/wp-content/uploads/sites/3/2025/07/image_02_single_service.png"
                        alt="Cleaning professional"
                    />
                    <a href="/get-quote" class="cta-button">
                        <span>Book Online</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
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
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <FAQSection />
</div>

<style>
    .single-service-page {
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

    /* Service Intro Section */
    .service-intro {
        padding: 5rem 1rem;
        text-align: center;
    }

    .intro-content {
        max-width: 700px;
        margin: 0 auto;
    }

    .intro-content h2 {
        font-size: 2.5rem;
        font-weight: 500;
        margin: 0 0 1rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .intro-content h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .description {
        font-size: 1.125rem;
        color: var(--text-secondary, #666);
        margin-bottom: 2rem;
    }

    :global(.dark) .description {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .features-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }

    .feature-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent-color, #e82374);
        font-weight: 500;
    }

    .feature-item svg {
        flex-shrink: 0;
    }

    /* Process Steps Section */
    .process-section {
        padding: 3rem 1rem 5rem;
    }

    .steps-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .step-card {
        background: var(--light-blue, #ecf4fd);
        border-radius: var(--border-radius-lg, 1.5rem);
        padding: 2rem;
        text-align: center;
    }

    :global(.dark) .step-card {
        background: var(--bg-secondary-dark, #252525);
    }

    .step-icon {
        width: 64px;
        height: 64px;
        background-color: var(--alternate-color, #1384e2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        color: white;
    }

    .step-number {
        display: block;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-secondary, #666);
        margin-bottom: 0.5rem;
    }

    :global(.dark) .step-number {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .step-card h3 {
        font-size: 1.125rem;
        font-weight: 500;
        margin: 0 0 0.75rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .step-card h3 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .step-card p {
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
        line-height: 1.6;
        margin: 0;
    }

    :global(.dark) .step-card p {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    /* CTA Section */
    .cta-section {
        padding: 2rem 1rem;
    }

    .cta-wrapper {
        max-width: 1800px;
        margin: 0 auto;
        background: linear-gradient(
            135deg,
            var(--alternate-color, #1384e2),
            #0a5a9e
        );
        border-radius: var(--border-radius-xl, 2rem);
        overflow: hidden;
    }

    .cta-content {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
    }

    .cta-text {
        padding: 4rem;
        color: white;
    }

    .cta-text h2 {
        font-size: 2.5rem;
        font-weight: 500;
        margin: 0 0 1rem;
    }

    .cta-text p {
        font-size: 1.25rem;
        opacity: 0.9;
        margin-bottom: 2rem;
    }

    .social-icons {
        display: flex;
        gap: 1rem;
    }

    .social-icon {
        width: 44px;
        height: 44px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transition: all 0.3s ease;
    }

    .social-icon:hover {
        background: white;
        color: var(--alternate-color, #1384e2);
        border-color: white;
    }

    .cta-image {
        position: relative;
        padding-right: 4rem;
    }

    .cta-image img {
        max-height: 350px;
        margin-top: -2rem;
    }

    .cta-button {
        position: absolute;
        bottom: 2rem;
        right: 4rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        color: var(--alternate-color, #1384e2);
        padding: 1rem 1.5rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .cta-button:hover {
        transform: scale(1.05);
    }

    .cta-button svg {
        transition: transform 0.3s ease;
    }

    .cta-button:hover svg {
        transform: rotate(45deg);
    }

    /* Responsive */
    @media (max-width: 992px) {
        .steps-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .cta-content {
            grid-template-columns: 1fr;
        }

        .cta-image {
            display: none;
        }

        .cta-text {
            text-align: center;
        }

        .social-icons {
            justify-content: center;
        }
    }

    @media (max-width: 768px) {
        .intro-content h2,
        .cta-text h2 {
            font-size: 1.75rem;
        }

        .steps-grid {
            grid-template-columns: 1fr;
        }

        .features-list {
            flex-direction: column;
            align-items: center;
        }
    }
</style>
