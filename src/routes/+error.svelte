<script lang="ts">
    // 404 Error Page
</script>

<svelte:head>
    <title>Page Not Found - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="The page you're looking for doesn't exist. Let us help you find what you need."
    />
</svelte:head>

<div class="error-page">
    <div class="error-content">
        <!-- Decorative Elements -->
        <div class="floating-bubbles">
            <div class="bubble bubble-1"></div>
            <div class="bubble bubble-2"></div>
            <div class="bubble bubble-3"></div>
            <div class="bubble bubble-4"></div>
        </div>

        <!-- Error Number -->
        <div class="error-number">
            <span class="digit">4</span>
            <div class="cleaning-icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                >
                    <circle cx="50" cy="50" r="35" />
                    <path
                        d="M50 30 L50 50 L65 55"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path d="M30 70 L25 85" stroke-linecap="round" />
                    <path d="M70 70 L75 85" stroke-linecap="round" />
                    <ellipse cx="50" cy="88" rx="20" ry="5" />
                </svg>
            </div>
            <span class="digit">4</span>
        </div>

        <!-- Message -->
        <h1>Oops! Page Not Found</h1>
        <p>
            The page you're looking for seems to have been swept away. Don't
            worry, we'll help you get back on track!
        </p>

        <!-- Actions -->
        <div class="actions">
            <a href="/" class="btn-primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Go Home</span>
            </a>
            <a href="/contact" class="btn-secondary">
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
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    />
                </svg>
                <span>Contact Us</span>
            </a>
        </div>

        <!-- Quick Links -->
        <div class="quick-links">
            <span>Or try these pages:</span>
            <div class="links">
                <a href="/services">Services</a>
                <a href="/get-quote">Get Quote</a>
                <a href="/about">About Us</a>
                <a href="/blog">Blog</a>
            </div>
        </div>
    </div>
</div>

<style>
    .error-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: linear-gradient(
            135deg,
            var(--alternate-color, #1384e2) 0%,
            #0a5a9e 100%
        );
        position: relative;
        overflow: hidden;
    }

    .error-content {
        text-align: center;
        color: white;
        position: relative;
        z-index: 1;
        max-width: 600px;
    }

    /* Floating Bubbles */
    .floating-bubbles {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
    }

    .bubble {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: float 6s ease-in-out infinite;
    }

    .bubble-1 {
        width: 80px;
        height: 80px;
        top: 20%;
        left: 10%;
        animation-delay: 0s;
    }

    .bubble-2 {
        width: 120px;
        height: 120px;
        top: 60%;
        right: 10%;
        animation-delay: 1s;
    }

    .bubble-3 {
        width: 60px;
        height: 60px;
        bottom: 20%;
        left: 20%;
        animation-delay: 2s;
    }

    .bubble-4 {
        width: 100px;
        height: 100px;
        top: 10%;
        right: 20%;
        animation-delay: 3s;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(10deg);
        }
    }

    /* Error Number */
    .error-number {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .digit {
        font-size: 8rem;
        font-weight: 700;
        line-height: 1;
        text-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .cleaning-icon {
        width: 100px;
        height: 100px;
        background: var(--accent-color, #e82374);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px rgba(232, 35, 116, 0.3);
        animation: spin 10s linear infinite;
    }

    .cleaning-icon svg {
        width: 60px;
        height: 60px;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Text */
    h1 {
        font-size: 2rem;
        font-weight: 500;
        margin: 0 0 1rem;
    }

    p {
        font-size: 1.125rem;
        opacity: 0.9;
        margin: 0 0 2rem;
        line-height: 1.6;
    }

    /* Actions */
    .actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 3rem;
    }

    .btn-primary,
    .btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: white;
        color: var(--alternate-color, #1384e2);
    }

    .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
    }

    .btn-secondary {
        background: var(--accent-color, #e82374);
        color: white;
    }

    .btn-secondary:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(232, 35, 116, 0.4);
    }

    /* Quick Links */
    .quick-links {
        opacity: 0.8;
    }

    .quick-links span {
        font-size: 0.875rem;
        display: block;
        margin-bottom: 0.75rem;
    }

    .links {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .links a {
        color: white;
        text-decoration: none;
        font-size: 0.875rem;
        transition: opacity 0.3s ease;
    }

    .links a:hover {
        opacity: 0.7;
        text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .digit {
            font-size: 5rem;
        }

        .cleaning-icon {
            width: 70px;
            height: 70px;
        }

        .cleaning-icon svg {
            width: 40px;
            height: 40px;
        }

        h1 {
            font-size: 1.5rem;
        }

        p {
            font-size: 1rem;
        }
    }
</style>
