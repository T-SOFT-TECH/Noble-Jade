<script lang="ts">
    /**
     * QuoteCTA Component
     * Bottom CTA section with phone contact and discount card
     */
</script>

<section class="quote-cta">
    <div class="container">
        <!-- Contact Card -->
        <div class="contact-card">
            <div class="contact-content">
                <h4>Contact Us For More Detailed Plan</h4>
                <a href="tel:8442429464" class="phone-link">
                    <span class="phone-icon">
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
                                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                            />
                        </svg>
                    </span>
                    <span class="phone-number">(844) 242-9464</span>
                </a>
            </div>
            <div class="contact-image">
                <img
                    src="/wp-content/uploads/sites/3/2025/07/image_03_single_service.png"
                    alt="Contact us"
                />
                <a href="/contact" class="cta-arrow-btn">
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
        </div>

        <!-- Discount Card -->
        <div class="discount-card">
            <span class="discount-value">15%</span>
            <h5>Off Weekly Visits</h5>
            <p class="discount-note">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M20 6L9 17l-5-5" />
                </svg>
                Recurring clients discount
            </p>
        </div>
    </div>
</section>

<style>
    .quote-cta {
        padding: 0 1rem 5rem;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.25rem;
    }

    /* Contact Card */
    .contact-card {
        background: linear-gradient(
            135deg,
            var(--alternate-color, #1384e2),
            #0a5fb0
        );
        border-radius: var(--border-radius-xl, 2rem);
        padding: 2rem;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
        min-height: 200px;
    }

    .contact-content {
        color: white;
        z-index: 1;
    }

    .contact-content h4 {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0 0 1.5rem 0;
        max-width: 200px;
    }

    .phone-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: white;
        text-decoration: none;
        transition: opacity 0.3s ease;
    }

    .phone-link:hover {
        opacity: 0.9;
    }

    .phone-icon {
        width: 48px;
        height: 48px;
        background-color: var(--accent-color, #e82374);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: shake 2s ease-in-out infinite;
    }

    @keyframes shake {
        0%,
        100% {
            transform: rotate(0deg);
        }
        10% {
            transform: rotate(-10deg);
        }
        20% {
            transform: rotate(10deg);
        }
        30% {
            transform: rotate(-10deg);
        }
        40% {
            transform: rotate(10deg);
        }
        50%,
        100% {
            transform: rotate(0deg);
        }
    }

    .phone-number {
        font-size: 1.5rem;
        font-weight: 600;
    }

    .contact-image {
        position: relative;
    }

    .contact-image img {
        height: 280px;
        width: auto;
        object-fit: contain;
        margin-bottom: -2rem;
    }

    .cta-arrow-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 48px;
        height: 48px;
        background-color: var(--accent-color, #e82374);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .cta-arrow-btn:hover {
        transform: rotate(45deg);
        background-color: white;
        color: var(--accent-color, #e82374);
    }

    /* Discount Card */
    .discount-card {
        background-color: var(--accent-color, #e82374);
        border-radius: var(--border-radius-xl, 2rem);
        padding: 2rem;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .discount-value {
        font-size: 4rem;
        font-weight: 300;
        line-height: 1;
        margin-bottom: 0.5rem;
    }

    .discount-card h5 {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0 0 1rem 0;
    }

    .discount-note {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        opacity: 0.9;
        margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .container {
            grid-template-columns: 1fr;
        }

        .contact-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding-bottom: 0;
        }

        .contact-content {
            order: 2;
            padding-bottom: 2rem;
        }

        .contact-content h4 {
            max-width: 100%;
        }

        .contact-image {
            order: 1;
        }

        .contact-image img {
            height: 200px;
            margin-bottom: 1rem;
        }

        .discount-value {
            font-size: 3rem;
        }
    }
</style>
