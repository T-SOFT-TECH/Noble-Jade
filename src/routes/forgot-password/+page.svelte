<script lang="ts">
    import { pb } from "$lib/pocketbase";
    import PageHero from "$lib/components/shared/PageHero.svelte";

    let email = $state("");
    let error = $state("");
    let success = $state("");
    let isLoading = $state(false);

    async function handleForgotPassword(e: Event) {
        e.preventDefault();
        error = "";
        success = "";
        isLoading = true;

        try {
            await pb.collection("users").requestPasswordReset(email);
            success = "Password reset email sent! Check your inbox.";
            email = "";
        } catch (err: any) {
            // PocketBase returns success even if email doesn't exist (for security)
            // So we show success message regardless
            success =
                "If an account exists with this email, you will receive a password reset link.";
        }
        isLoading = false;
    }
</script>

<svelte:head>
    <title>Forgot Password - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="Reset your Noble Jade account password. Enter your email to receive a password reset link."
    />
</svelte:head>

<!-- Page Hero -->
<PageHero
    title="forgot password"
    backgroundImage="/images/about-hero.webp"
    overlayColor="rgba(232, 35, 116, 0.85)"
    height="h-[50vh]"
    showFloatingBubbles={false}
/>

<!-- Forgot Password Form Section -->
<section class="form-section">
    <div class="form-wrapper">
        <div class="form-intro">
            <p>
                Enter your email address below and we'll send you a link to
                reset your password.
            </p>
        </div>

        {#if error}
            <div class="error-message">
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
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{error}</span>
            </div>
        {/if}

        {#if success}
            <div class="success-message">
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
                <span>{success}</span>
            </div>
        {/if}

        <form onsubmit={handleForgotPassword} class="auth-form">
            <div class="form-row">
                <label for="email"
                    >Email Address <span class="required">*</span></label
                >
                <input
                    type="email"
                    id="email"
                    bind:value={email}
                    required
                    autocomplete="email"
                    placeholder="you@example.com"
                />
            </div>

            <div class="form-row">
                <button type="submit" class="submit-btn" disabled={isLoading}>
                    {#if isLoading}
                        <span class="spinner"></span>
                        Sending...
                    {:else}
                        Reset Password
                    {/if}
                </button>
            </div>
        </form>

        <p class="back-link">
            <a href="/login">← Back to Login</a>
        </p>
    </div>
</section>

<style>
    .form-section {
        padding: 4rem 1rem;
        background: var(--bg-primary);
    }

    @media (max-width: 640px) {
        .form-section {
            padding: 2rem 1rem;
        }
    }

    .form-wrapper {
        max-width: 500px;
        margin: 0 auto;
    }

    .form-intro {
        margin-bottom: 2rem;
        text-align: center;
    }

    .form-intro p {
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .error-message {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 8px;
        color: #ef4444;
        margin-bottom: 1.5rem;
    }

    .success-message {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 8px;
        color: #22c55e;
        margin-bottom: 1.5rem;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-row {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-row label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .required {
        color: #e82374;
    }

    .form-row input[type="email"] {
        width: 100%;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 1rem;
        transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
    }

    .form-row input::placeholder {
        color: var(--text-muted);
    }

    .form-row input:focus {
        outline: none;
        border-color: #e82374;
        box-shadow: 0 0 0 3px rgba(232, 35, 116, 0.1);
    }

    .submit-btn {
        width: 100%;
        padding: 1rem 2rem;
        background: #e82374;
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .submit-btn:hover:not(:disabled) {
        background: #d11d68;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(232, 35, 116, 0.3);
    }

    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .back-link {
        margin-top: 2rem;
        text-align: center;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    .back-link a {
        color: #e82374;
        font-weight: 500;
        text-decoration: none;
    }

    .back-link a:hover {
        text-decoration: underline;
    }
</style>
