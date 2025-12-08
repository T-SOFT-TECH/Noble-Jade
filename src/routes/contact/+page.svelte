<script lang="ts">
    import PageHero from "$lib/components/shared/PageHero.svelte";
    import {
        companyInfo,
        getPrimaryLocation,
        formatPhoneForLink,
    } from "$lib/config/company";

    // Get primary and additional locations
    const primaryLocation = getPrimaryLocation();
    const additionalLocations = companyInfo.locations.filter(
        (loc) => !loc.isPrimary,
    );

    // Form state
    let firstName = $state("");
    let lastName = $state("");
    let email = $state("");
    let phone = $state("");
    let serviceType = $state("Type of service");
    let bedrooms = $state("1 Bedroom");
    let bathrooms = $state("1 Bathroom");
    let message = $state("");

    function handleSubmit() {
        alert("Message sent! We'll get back to you soon.");
    }

    const serviceTypes = [
        "Type of service",
        "Home Cleaning",
        "Office Cleaning",
        "Move in/out Cleaning",
    ];
    const bedroomOptions = [
        "1 Bedroom",
        "2 Bedrooms",
        "3 Bedrooms",
        "4+ Bedrooms",
    ];
    const bathroomOptions = [
        "1 Bathroom",
        "2 Bathrooms",
        "3 Bathrooms",
        "4+ Bathrooms",
    ];
</script>

<svelte:head>
    <title>Contact Us - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="Contact Noble Jade Cleaning Services. Book your clean today or reach out with questions."
    />
</svelte:head>

<PageHero
    title="Contact"
    bgColor="bg-alternate"
    textColor="text-white/20"
    heroImage=""
    heroImageAlt=""
    backgroundImage="/images/contact-hero.webp"
    overlayColor="rgba(10, 60, 120, 0.5)"
    testimonial={{
        imageSrc: "/images/credentials_home_01.png",
        text: "Blog Posts",
        highlight: "15+",
    }}
/>

<div class="contact-page">
    <!-- Hero with Contact Form -->
    <section class="hero-section rounded-[40px]">
        <div class="hero-bg">
            <img
                src="/images/cleaner-mopping.webp"
                alt="Contact us background"
            />
            <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
            <!-- Modern Contact Form Card -->
            <div class="modern-form-card">
                <div class="form-header">
                    <span class="form-badge text-xl">CONTACT US</span>
                    <h3>Book Your Clean Today</h3>
                </div>

                <form
                    onsubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    class="modern-form"
                >
                    <div class="form-row">
                        <div class="input-wrapper">
                            <input
                                type="text"
                                id="firstName"
                                placeholder=" "
                                bind:value={firstName}
                                required
                            />
                            <label for="firstName">First Name*</label>
                            <span class="input-accent"></span>
                        </div>
                        <div class="input-wrapper">
                            <input
                                type="text"
                                id="lastName"
                                placeholder=" "
                                bind:value={lastName}
                                required
                            />
                            <label for="lastName">Last Name*</label>
                            <span class="input-accent"></span>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                bind:value={email}
                                required
                            />
                            <label for="email">Your E-mail*</label>
                            <span class="input-accent"></span>
                        </div>
                        <div class="input-wrapper">
                            <input
                                type="tel"
                                id="phone"
                                placeholder=" "
                                bind:value={phone}
                                required
                            />
                            <label for="phone">Phone Number*</label>
                            <span class="input-accent"></span>
                        </div>
                    </div>

                    <div class="form-row single">
                        <div class="select-wrapper">
                            <select bind:value={serviceType}>
                                {#each serviceTypes as type}
                                    <option value={type}>{type}</option>
                                {/each}
                            </select>
                            <span class="select-arrow">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <polyline points="6 9 12 15 18 9"
                                    ></polyline>
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="select-wrapper">
                            <select bind:value={bedrooms}>
                                {#each bedroomOptions as opt}
                                    <option value={opt}>{opt}</option>
                                {/each}
                            </select>
                            <span class="select-arrow">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <polyline points="6 9 12 15 18 9"
                                    ></polyline>
                                </svg>
                            </span>
                        </div>
                        <div class="select-wrapper">
                            <select bind:value={bathrooms}>
                                {#each bathroomOptions as opt}
                                    <option value={opt}>{opt}</option>
                                {/each}
                            </select>
                            <span class="select-arrow">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <polyline points="6 9 12 15 18 9"
                                    ></polyline>
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div class="form-row single">
                        <div class="input-wrapper textarea-wrapper">
                            <textarea
                                id="message"
                                placeholder=" "
                                bind:value={message}
                                rows="4"
                            ></textarea>
                            <label for="message">Type your message</label>
                            <span class="input-accent"></span>
                        </div>
                    </div>

                    <button type="submit" class="submit-btn">
                        <span>Send Message</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M22 2L11 13"></path>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                        </svg>
                    </button>
                </form>

                <p class="required-note">
                    <span class="accent">*</span> Required fields
                </p>
            </div>
        </div>
    </section>

    <!-- Get in Touch Section -->
    <section class="get-in-touch">
        <div class="container">
            <div class="section-header">
                <span class="section-badge">Get in touch</span>
                <h2>Have Questions or Ready to Book a Cleaning?</h2>
                <p class="subtitle">
                    Whether you need a one-time deep clean or recurring service,
                    our friendly team is just a message away.
                </p>
            </div>

            <div class="info-cards">
                <!-- Business Hours -->
                <div class="info-card glass-card">
                    <div class="card-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <h4>Business Hours</h4>
                    <div class="hours-info">
                        <p>
                            Monday to Friday:<br /><strong
                                >{companyInfo.businessHours.weekdays}</strong
                            >
                        </p>
                        <p>
                            Saturday:<br /><strong
                                >{companyInfo.businessHours.saturday}</strong
                            >
                        </p>
                        <div class="divider"></div>
                        <p class="muted">
                            Sunday:<br /><strong
                                >{companyInfo.businessHours.sunday}</strong
                            >
                        </p>
                    </div>
                </div>

                <!-- Customer Service -->
                <div class="info-card glass-card">
                    <div class="card-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                            />
                        </svg>
                    </div>
                    <h4>Customer Service</h4>
                    <p>Call or text us anytime during business hours</p>
                    <a
                        href="tel:{formatPhoneForLink(companyInfo.phone)}"
                        class="phone-link"
                    >
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
                        {companyInfo.phone}
                    </a>
                </div>

                <!-- Email & Social -->
                <div class="info-card social-card">
                    <div class="email-social-content">
                        <div class="send-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                            >
                                <path d="M22 2L11 13" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                            </svg>
                        </div>
                        <h5>Contact us via e-mail or social media</h5>
                        <a href="mailto:{companyInfo.email}" class="email-link">
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
                                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                                />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            {companyInfo.email}
                        </a>
                        <div class="social-links">
                            <a
                                href={companyInfo.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
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
                                href={companyInfo.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
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
                                    <line
                                        x1="17.5"
                                        y1="6.5"
                                        x2="17.51"
                                        y2="6.5"
                                    />
                                </svg>
                            </a>
                            <a
                                href={companyInfo.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                                    />
                                </svg>
                            </a>
                            <a
                                href={companyInfo.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                                    />
                                    <rect x="2" y="9" width="4" height="12" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div class="social-image">
                        <img
                            src="/wp-content/uploads/sites/3/2025/07/image_01_contact.png"
                            alt="Contact us"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Location Section -->
    <section class="location-section">
        <div class="container">
            <div class="section-header">
                <span class="superheadline">Location</span>
                <h2>You Can Find Us Here</h2>
            </div>

            <div class="map-container">
                <div class="map-wrapper">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.9503398796587!2d-73.93369368459418!3d40.69767807933244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25c1e4a6ccf53%3A0x3a7e8fc4a2ea2e0c!2sMyrtle%20Ave%2C%20Brooklyn%2C%20NY%2011221!5e0!3m2!1sen!2sus!4v1702000000000!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        title="Noble Jade Janitorial Services Location"
                    ></iframe>
                </div>
                <div class="location-card">
                    <div class="location-icon">
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
                                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                            />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </div>
                    <h5>{primaryLocation.city}, {primaryLocation.province}</h5>
                    <p>
                        {primaryLocation.address}<br />{primaryLocation.city}, {primaryLocation.province}
                        {primaryLocation.postalCode}
                    </p>
                    <a
                        href="tel:{formatPhoneForLink(primaryLocation.phone)}"
                        class="contact-link"
                    >
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
                        {primaryLocation.phone}
                    </a>
                    <a
                        href="mailto:{primaryLocation.email}"
                        class="contact-link"
                    >
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
                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                            />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        {primaryLocation.email}
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- More Locations -->
    <section class="more-locations">
        <div class="container">
            <h3>More Locations We Serve</h3>
            <div class="locations-grid">
                {#each additionalLocations as location}
                    <div class="location-item">
                        <div class="location-icon-small">
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
                                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <div class="location-info">
                            <h4>{location.city}, {location.province}</h4>
                            <p>
                                {location.address}<br />T: {location.phone}<br
                                />E: {location.email}
                            </p>
                        </div>
                        <a
                            href="mailto:{location.email}"
                            class="arrow-btn"
                            aria-label="Contact {location.city} location"
                        >
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
                    </div>
                {/each}
            </div>
        </div>
    </section>
</div>

<style>
    .contact-page {
        display: flex;
        flex-direction: column;
    }

    /* Hero Section */
    .hero-section {
        position: relative;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 6rem 1rem;
        overflow: hidden;
    }

    .hero-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
    }

    .hero-bg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(19, 132, 226, 0.3) 0%,
            rgba(10, 60, 120, 0.5) 100%
        );
    }

    .hero-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        max-width: 1200px;
        width: 100%;
    }

    .hero-title {
        font-size: clamp(3rem, 15vw, 10rem);
        font-weight: 600;
        color: rgba(255, 255, 255, 0.15);
        text-transform: lowercase;
        text-align: center;
        margin: 0;
        line-height: 1;
        text-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    /* Modern Form Card */
    .modern-form-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 2rem;
        padding: 2.5rem 2.5rem 2rem;
        width: 100%;
        max-width: 1000px;
        box-shadow:
            0 4px 30px rgba(0, 0, 0, 0.1),
            0 1px 0 rgba(255, 255, 255, 0.2) inset;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    :global(.dark) .modern-form-card {
        background: rgba(30, 30, 30, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }

    .form-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .form-badge {
        display: inline-block;
        text-transform: uppercase;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        color: var(--alternate-color, #1384e2);
        background: rgba(19, 132, 226, 0.1);
        padding: 0.4rem 1rem;
        border-radius: 50px;
        margin-bottom: 0.75rem;
    }

    :global(.dark) .form-badge {
        background: rgba(19, 132, 226, 0.2);
    }

    .form-header h3 {
        font-size: 2.75rem;
        font-weight: 500;
        margin: 0;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .form-header h3 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    /* Modern Form */
    .modern-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .form-row.single {
        grid-template-columns: 1fr;
    }

    /* Input Wrapper with Floating Labels */
    .input-wrapper {
        position: relative;
    }

    .input-wrapper input,
    .input-wrapper textarea {
        width: 100%;
        padding: 1.25rem 1rem 0.75rem;
        font-size: 1rem;
        border: 2px solid #e8e8e8;
        border-radius: 0.875rem;
        background: #fafafa;
        color: var(--text-primary, #252525);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
    }

    :global(.dark) .input-wrapper input,
    :global(.dark) .input-wrapper textarea {
        background: rgba(40, 40, 40, 0.8);
        border-color: rgba(255, 255, 255, 0.1);
        color: var(--text-primary-dark, #f5f5f5);
    }

    .input-wrapper label {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1rem;
        color: #888;
        pointer-events: none;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .textarea-wrapper label {
        top: 1.25rem;
        transform: translateY(0);
    }

    .input-wrapper input:focus,
    .input-wrapper textarea:focus {
        border-color: var(--alternate-color, #1384e2);
        background: white;
        box-shadow: 0 0 0 4px rgba(19, 132, 226, 0.1);
    }

    :global(.dark) .input-wrapper input:focus,
    :global(.dark) .input-wrapper textarea:focus {
        background: rgba(50, 50, 50, 0.9);
        box-shadow: 0 0 0 4px rgba(19, 132, 226, 0.2);
    }

    .input-wrapper input:focus + label,
    .input-wrapper input:not(:placeholder-shown) + label,
    .input-wrapper textarea:focus + label,
    .input-wrapper textarea:not(:placeholder-shown) + label {
        top: 0.5rem;
        transform: translateY(0);
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--alternate-color, #1384e2);
        letter-spacing: 0.03em;
    }

    .input-accent {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(
            90deg,
            var(--alternate-color, #1384e2),
            var(--accent-color, #e82374)
        );
        transition: all 0.3s ease;
        border-radius: 2px;
    }

    .input-wrapper input:focus ~ .input-accent,
    .input-wrapper textarea:focus ~ .input-accent {
        width: 100%;
        left: 0;
    }

    /* Select Wrapper */
    .select-wrapper {
        position: relative;
    }

    .select-wrapper select {
        width: 100%;
        padding: 1rem 2.5rem 1rem 1rem;
        font-size: 1rem;
        border: 2px solid #e8e8e8;
        border-radius: 0.875rem;
        background: #fafafa;
        color: var(--text-primary, #252525);
        appearance: none;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
    }

    :global(.dark) .select-wrapper select {
        background: rgba(40, 40, 40, 0.8);
        border-color: rgba(255, 255, 255, 0.1);
        color: var(--text-primary-dark, #f5f5f5);
    }

    .select-wrapper select:focus {
        border-color: var(--alternate-color, #1384e2);
        background: white;
        box-shadow: 0 0 0 4px rgba(19, 132, 226, 0.1);
    }

    :global(.dark) .select-wrapper select:focus {
        background: rgba(50, 50, 50, 0.9);
        box-shadow: 0 0 0 4px rgba(19, 132, 226, 0.2);
    }

    .select-arrow {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: #888;
        transition: transform 0.3s ease;
    }

    .select-wrapper select:focus + .select-arrow {
        color: var(--alternate-color, #1384e2);
        transform: translateY(-50%) rotate(180deg);
    }

    /* Submit Button */
    .submit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        width: 100%;
        padding: 1.125rem 2rem;
        margin-top: 0.5rem;
        background: linear-gradient(
            135deg,
            var(--accent-color, #e82374) 0%,
            #c91a60 100%
        );
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 15px rgba(232, 35, 116, 0.3);
    }

    .submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(232, 35, 116, 0.4);
    }

    .submit-btn:active {
        transform: translateY(0);
    }

    .submit-btn svg {
        transition: transform 0.3s ease;
    }

    .submit-btn:hover svg {
        transform: translateX(3px) translateY(-3px);
    }

    /* Required Note */
    .required-note {
        text-align: center;
        font-size: 0.8rem;
        color: #888;
        margin-top: 1.25rem;
        margin-bottom: 0;
    }

    .required-note .accent {
        color: var(--accent-color, #e82374);
        font-weight: 600;
    }

    /* Responsive */
    @media (max-width: 600px) {
        .form-row {
            grid-template-columns: 1fr;
        }

        .modern-form-card {
            padding: 2rem 1.5rem 1.5rem;
            border-radius: 1.5rem;
        }

        .form-header h3 {
            font-size: 1.5rem;
        }
    }

    /* Get in Touch Section */
    .get-in-touch {
        padding: 6rem 1rem;
        background: linear-gradient(
            180deg,
            var(--bg-primary, #f8f8f8) 0%,
            #fff 100%
        );
    }

    :global(.dark) .get-in-touch {
        background: linear-gradient(
            180deg,
            var(--bg-primary-dark, #1a1a1a) 0%,
            #111 100%
        );
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
    }

    .section-header {
        text-align: center;
        margin-bottom: 3.5rem;
    }

    .section-badge {
        display: inline-block;
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        color: var(--alternate-color, #1384e2);
        background: rgba(19, 132, 226, 0.1);
        padding: 0.5rem 1.25rem;
        border-radius: 50px;
        margin-bottom: 1rem;
    }

    :global(.dark) .section-badge {
        background: rgba(19, 132, 226, 0.2);
    }

    .section-header h2 {
        font-size: 2.5rem;
        font-weight: 600;
        margin: 0 0 1rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .section-header h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .subtitle {
        color: var(--text-secondary, #666);
        max-width: 600px;
        margin: 0 auto;
        font-size: 1.1rem;
        line-height: 1.7;
    }

    :global(.dark) .subtitle {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .info-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
    }

    .info-card {
        background: var(--light-blue, #ecf4fd);
        border-radius: 1.5rem;
        padding: 2rem;
        min-height: 280px;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
    }

    .info-card:hover {
        transform: translateY(-4px);
    }

    .glass-card {
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .glass-card:hover {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    }

    :global(.dark) .info-card {
        background: var(--bg-secondary-dark, #252525);
    }

    :global(.dark) .glass-card {
        background: rgba(40, 40, 40, 0.8);
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .card-icon {
        width: 56px;
        height: 56px;
        background: linear-gradient(
            135deg,
            rgba(19, 132, 226, 0.15) 0%,
            rgba(19, 132, 226, 0.05) 100%
        );
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--alternate-color, #1384e2);
        margin-bottom: 1.5rem;
    }

    :global(.dark) .card-icon {
        background: linear-gradient(
            135deg,
            rgba(19, 132, 226, 0.25) 0%,
            rgba(19, 132, 226, 0.1) 100%
        );
    }

    .info-card h4 {
        font-size: 1.35rem;
        font-weight: 600;
        margin: 0 0 1.25rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .info-card h4 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .hours-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .hours-info .divider {
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 0, 0, 0.1),
            transparent
        );
        margin: 0.25rem 0;
    }

    :global(.dark) .hours-info .divider {
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
    }

    .info-card p {
        color: var(--text-secondary, #555);
        margin: 0;
        line-height: 1.7;
        font-size: 0.95rem;
    }

    .info-card p strong {
        color: var(--text-primary, #252525);
    }

    :global(.dark) .info-card p {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    :global(.dark) .info-card p strong {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .info-card .muted {
        opacity: 0.75;
    }

    .phone-link {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-primary, #252525);
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        margin-top: 0.5rem;
        transition: all 0.3s ease;
    }

    :global(.dark) .phone-link {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .phone-link:hover {
        color: var(--accent-color, #e82374);
    }

    .phone-link:hover .phone-icon {
        transform: scale(1.1);
    }

    .phone-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(
            135deg,
            var(--accent-color, #e82374),
            #c91a60
        );
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 12px rgba(232, 35, 116, 0.3);
        transition: transform 0.3s ease;
    }

    .social-card {
        display: flex;
        overflow: hidden;
        padding: 0;
        grid-column: span 1;
        background: linear-gradient(
            135deg,
            var(--alternate-color, #1384e2) 0%,
            #0a5fb0 100%
        );
        border: none;
    }

    .social-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(19, 132, 226, 0.3);
    }

    .email-social-content {
        flex: 1;
        padding: 2rem;
        color: white;
    }

    .send-icon {
        margin-bottom: 1.25rem;
        opacity: 0.9;
    }

    .social-card h5 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 1.25rem;
        line-height: 1.4;
    }

    .email-link {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        color: white;
        text-decoration: none;
        margin-bottom: 1.25rem;
        padding: 0.6rem 1.25rem;
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 50px;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .email-link:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.5);
    }

    .social-links {
        display: flex;
        gap: 0.5rem;
    }

    .social-links a {
        color: white;
        padding: 0.5rem;
        transition: opacity 0.3s ease;
    }

    .social-links a:hover {
        opacity: 0.8;
    }

    .social-image {
        flex: 0 0 40%;
        position: relative;
        overflow: hidden;
    }

    .social-image img {
        position: absolute;
        bottom: 0;
        right: 0;
        height: 120%;
        width: auto;
        object-fit: contain;
    }

    /* Location Section */
    .location-section {
        padding: 6rem 1rem;
        background: linear-gradient(
            180deg,
            #fff 0%,
            var(--bg-primary, #f8f8f8) 100%
        );
    }

    :global(.dark) .location-section {
        background: linear-gradient(
            180deg,
            #111 0%,
            var(--bg-primary-dark, #1a1a1a) 100%
        );
    }

    .map-container {
        position: relative;
        border-radius: 2rem;
        min-height: 550px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .map-wrapper {
        position: absolute;
        inset: 0;
        z-index: 0;
    }

    .map-wrapper iframe {
        width: 100%;
        height: 100%;
        border: none;
        filter: saturate(1.1) contrast(1.05);
    }

    :global(.dark) .map-wrapper iframe {
        filter: invert(0.9) hue-rotate(180deg) saturate(0.8);
    }

    .map-container .location-card {
        position: absolute;
        top: 2rem;
        left: 2rem;
        z-index: 1;
    }

    .location-card {
        background: linear-gradient(
            135deg,
            var(--alternate-color, #1384e2) 0%,
            #0a60b065 100%
        );
        border-radius: 1.5rem;
        padding: 2rem;
        color: white;
        max-width: 320px;
        position: relative;
        z-index: 1;
        box-shadow: 0 10px 40px rgba(19, 132, 226, 0.3);
    }

    .location-icon {
        width: 48px;
        height: 48px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.25rem;
    }

    .location-card h5 {
        font-size: 1.4rem;
        font-weight: 600;
        margin: 0 0 1rem;
    }

    .location-card p {
        margin: 0 0 1.5rem;
        opacity: 0.9;
        line-height: 1.7;
        font-size: 0.95rem;
    }

    .contact-link {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        color: white;
        text-decoration: none;
        font-weight: 500;
        margin-bottom: 0.75rem;
        transition: opacity 0.3s ease;
    }

    .contact-link:hover {
        opacity: 0.85;
    }

    /* More Locations */
    .more-locations {
        padding: 0 1rem 6rem;
    }

    .more-locations h3 {
        text-align: center;
        font-size: 2.25rem;
        font-weight: 600;
        margin-bottom: 2.5rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .more-locations h3 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .locations-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
    }

    .location-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        background: white;
        border-radius: 1.25rem;
        padding: 1.75rem;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
    }

    .location-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    }

    :global(.dark) .location-item {
        background: rgba(40, 40, 40, 0.8);
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .location-icon-small {
        width: 44px;
        height: 44px;
        background: linear-gradient(
            135deg,
            rgba(19, 132, 226, 0.15) 0%,
            rgba(19, 132, 226, 0.05) 100%
        );
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--alternate-color, #1384e2);
        flex-shrink: 0;
    }

    :global(.dark) .location-icon-small {
        background: linear-gradient(
            135deg,
            rgba(19, 132, 226, 0.25) 0%,
            rgba(19, 132, 226, 0.1) 100%
        );
    }

    .location-info h4 {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .location-info h4 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .location-info p {
        font-size: 0.9rem;
        color: var(--text-secondary, #555);
        margin: 0;
        line-height: 1.7;
    }

    :global(.dark) .location-info p {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .arrow-btn {
        position: absolute;
        top: 1.25rem;
        right: 1.25rem;
        width: 42px;
        height: 42px;
        background: linear-gradient(
            135deg,
            var(--accent-color, #e82374),
            #c91a60
        );
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(232, 35, 116, 0.3);
    }

    .arrow-btn:hover {
        transform: rotate(45deg) scale(1.1);
        box-shadow: 0 6px 20px rgba(232, 35, 116, 0.4);
    }

    /* Responsive */
    @media (max-width: 992px) {
        .info-cards {
            grid-template-columns: 1fr;
        }

        .social-card {
            flex-direction: column;
        }

        .social-image {
            height: 200px;
        }

        .social-image img {
            position: relative;
            height: 100%;
        }

        .locations-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }

        .hero-title {
            font-size: clamp(2.5rem, 12vw, 5rem);
        }

        .section-header h2 {
            font-size: 1.75rem;
        }
    }
</style>
