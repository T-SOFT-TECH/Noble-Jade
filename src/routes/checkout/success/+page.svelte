<script lang="ts">
    import { isAuthenticated } from "$lib/stores/auth";
</script>

<svelte:head>
    <title>Booking Confirmed - Noble Jade Cleaning Services</title>
</svelte:head>

<section class="success-page">
    <div class="success-card">
        <div class="success-icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        </div>

        <h1>Booking Confirmed!</h1>
        <p class="subtitle">
            Thank you for choosing Noble Jade Cleaning Services
        </p>

        <div class="info-box">
            <h3>What's Next?</h3>
            <ul>
                <li>
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
                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"
                        />
                    </svg>
                    <span
                        >We'll call you within 24 hours to confirm your booking
                        details</span
                    >
                </li>
                <li>
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
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span
                        >A confirmation email has been sent with your booking
                        details</span
                    >
                </li>
                <li>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span
                        >Our team will arrive at your scheduled time, fully
                        equipped</span
                    >
                </li>
            </ul>
        </div>

        <div class="actions">
            {#if $isAuthenticated}
                <a href="/dashboard/bookings" class="btn-primary"
                    >View My Bookings</a
                >
            {/if}
            <a href="/" class="btn-secondary">Back to Home</a>
        </div>

        <div class="contact-note">
            <p>
                Questions? Contact us at <a href="tel:+14165551234"
                    >+1 (416) 555-1234</a
                >
            </p>
        </div>
    </div>
</section>

<style>
    .success-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .success-card {
        background: var(--bg-primary);
        border-radius: 24px;
        padding: 3rem;
        max-width: 600px;
        width: 100%;
        text-align: center;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    }

    .success-icon {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        color: white;
    }

    h1 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
    }

    .subtitle {
        color: var(--text-secondary);
        font-size: 1rem;
        margin: 0 0 2rem 0;
    }

    .info-box {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 1.5rem;
        text-align: left;
        margin-bottom: 2rem;
    }

    .info-box h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem 0;
    }

    .info-box ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .info-box li {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .info-box li svg {
        flex-shrink: 0;
        color: #22c55e;
        margin-top: 2px;
    }

    .actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn-primary,
    .btn-secondary {
        padding: 0.875rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .btn-primary {
        background: #e82374;
        color: white;
    }

    .btn-primary:hover {
        background: #d11d68;
        transform: translateY(-2px);
    }

    .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }

    .btn-secondary:hover {
        background: var(--bg-tertiary);
    }

    .contact-note {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color);
    }

    .contact-note p {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin: 0;
    }

    .contact-note a {
        color: #e82374;
        text-decoration: none;
        font-weight: 500;
    }

    .contact-note a:hover {
        text-decoration: underline;
    }

    @media (max-width: 600px) {
        .success-card {
            padding: 2rem;
        }

        h1 {
            font-size: 1.5rem;
        }

        .actions {
            flex-direction: column;
        }

        .btn-primary,
        .btn-secondary {
            width: 100%;
            text-align: center;
        }
    }
</style>
