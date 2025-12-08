<script lang="ts">
    import { auth } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import PageHero from "$lib/components/shared/PageHero.svelte";

    let name = $state("");
    let email = $state("");
    let password = $state("");
    let passwordConfirm = $state("");
    let error = $state("");
    let isLoading = $state(false);

    // Redirect if already logged in
    onMount(() => {
        auth.init();
        const unsubscribe = auth.subscribe((state) => {
            if (state.isAuthenticated) {
                goto("/dashboard");
            }
        });
        return unsubscribe;
    });

    async function handleRegister(e: Event) {
        e.preventDefault();
        error = "";

        // Validate passwords match
        if (password !== passwordConfirm) {
            error = "Passwords do not match";
            return;
        }

        // Validate password length
        if (password.length < 8) {
            error = "Password must be at least 8 characters";
            return;
        }

        isLoading = true;

        const result = await auth.register({
            name,
            email,
            password,
            passwordConfirm,
        });

        if (result.success) {
            goto("/dashboard");
        } else {
            error = result.error || "Registration failed";
        }
        isLoading = false;
    }
</script>

<svelte:head>
    <title>Create Account - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="Create your Noble Jade account to book cleaning services, track jobs, and manage your appointments."
    />
</svelte:head>

<!-- Page Hero -->
<PageHero
    title="register"
    backgroundImage="/images/hero_services.webp"
    overlayColor="rgba(19, 132, 226, 0.85)"
    height="h-[50vh]"
    testimonial={{
        imageSrc: "/images/credentials_home_01.png",
        text: "Happy Customers",
        highlight: "200+",
    }}
/>

<!-- Register Form Section -->
<section class="form-section">
    <div class="form-wrapper">
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

        <form onsubmit={handleRegister} class="auth-form">
            <div class="form-row">
                <label for="name"
                    >Full Name <span class="required">*</span></label
                >
                <input
                    type="text"
                    id="name"
                    bind:value={name}
                    required
                    autocomplete="name"
                />
            </div>

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
                />
            </div>

            <div class="form-row">
                <label for="password"
                    >Password <span class="required">*</span></label
                >
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    required
                    autocomplete="new-password"
                />
            </div>

            <div class="form-row">
                <label for="passwordConfirm"
                    >Confirm Password <span class="required">*</span></label
                >
                <input
                    type="password"
                    id="passwordConfirm"
                    bind:value={passwordConfirm}
                    required
                    autocomplete="new-password"
                />
            </div>

            <div class="form-row checkbox-row">
                <label class="checkbox-label">
                    <input type="checkbox" required />
                    <span
                        >I agree to the <a href="/terms">Terms of Service</a>
                        and <a href="/privacy">Privacy Policy</a></span
                    >
                </label>
            </div>

            <div class="form-row">
                <button type="submit" class="submit-btn" disabled={isLoading}>
                    {#if isLoading}
                        <span class="spinner"></span>
                        Creating account...
                    {:else}
                        Create Account
                    {/if}
                </button>
            </div>
        </form>

        <p class="login-link">
            Already have an account? <a href="/login">Sign in</a>
        </p>
    </div>
</section>

<style>
    .form-section {
        padding: 4rem 1rem;
        background: var(--bg-primary);
    }

    .form-wrapper {
        max-width: 600px;
        margin: 0 auto;
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
        color: #1384e2;
    }

    .form-row input[type="email"],
    .form-row input[type="password"],
    .form-row input[type="text"] {
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

    .form-row input:focus {
        outline: none;
        border-color: #1384e2;
        box-shadow: 0 0 0 3px rgba(19, 132, 226, 0.1);
    }

    .checkbox-row {
        flex-direction: row;
        align-items: flex-start;
    }

    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
        cursor: pointer;
        line-height: 1.5;
    }

    .checkbox-label input {
        accent-color: #1384e2;
        width: 16px;
        height: 16px;
        margin-top: 3px;
    }

    .checkbox-label a {
        color: #1384e2;
        text-decoration: none;
    }

    .checkbox-label a:hover {
        text-decoration: underline;
    }

    .submit-btn {
        width: 100%;
        padding: 1rem 2rem;
        background: #1384e2;
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
        background: #0d6fc7;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(19, 132, 226, 0.3);
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

    .login-link {
        margin-top: 2rem;
        text-align: center;
        color: var(--text-secondary);
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    .login-link a {
        color: #1384e2;
        font-weight: 500;
        text-decoration: none;
    }

    .login-link a:hover {
        text-decoration: underline;
    }
</style>
