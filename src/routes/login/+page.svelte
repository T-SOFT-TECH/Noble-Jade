<script lang="ts">
    import { auth, getDashboardUrl } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import PageHero from "$lib/components/shared/PageHero.svelte";

    let email = $state("");
    let password = $state("");
    let error = $state("");
    let isLoading = $state(false);

    // Redirect if already logged in
    onMount(() => {
        auth.init();
        const unsubscribe = auth.subscribe((state) => {
            if (state.isAuthenticated && state.user) {
                // Redirect based on user role
                goto(getDashboardUrl(state.user.role));
            }
        });
        return unsubscribe;
    });

    async function handleLogin(e: Event) {
        e.preventDefault();
        error = "";
        isLoading = true;

        const result = await auth.login(email, password);

        if (result.success) {
            // Small delay to ensure auth state is updated, then redirect
            setTimeout(() => {
                let currentState: any;
                const unsub = auth.subscribe((state) => {
                    currentState = state;
                });
                unsub();

                if (currentState?.user) {
                    goto(getDashboardUrl(currentState.user.role));
                } else {
                    goto("/dashboard");
                }
            }, 100);
        } else {
            error = result.error || "Login failed";
        }
        isLoading = false;
    }
</script>

<svelte:head>
    <title>Login - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="Login to your Noble Jade account to manage bookings and view your service history."
    />
</svelte:head>

<!-- Page Hero -->
<PageHero
    title="login"
    backgroundImage="/images/about-hero.webp"
    overlayColor="rgba(232, 35, 116, 0.85)"
    height="h-[50vh]"
    testimonial={{
        imageSrc: "/images/credentials_home_01.png",
        text: "Customer Satisfaction",
        highlight: "98%",
    }}
/>

<!-- Login Form Section -->
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

        <form onsubmit={handleLogin} class="auth-form">
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
                    autocomplete="current-password"
                />
            </div>

            <div class="form-row checkbox-row">
                <label class="checkbox-label">
                    <input type="checkbox" name="rememberme" />
                    <span>Remember me</span>
                </label>
            </div>

            <div class="form-row">
                <button type="submit" class="submit-btn" disabled={isLoading}>
                    {#if isLoading}
                        <span class="spinner"></span>
                        Signing in...
                    {:else}
                        Log in
                    {/if}
                </button>
            </div>

            <p class="lost-password">
                <a href="/forgot-password">Lost your password?</a>
            </p>
        </form>

        <p class="register-link">
            Don't have an account? <a href="/register">Create one</a>
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
        color: #e82374;
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
        border-color: #e82374;
        box-shadow: 0 0 0 3px rgba(232, 35, 116, 0.1);
    }

    .checkbox-row {
        flex-direction: row;
        align-items: center;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
        cursor: pointer;
    }

    .checkbox-label input {
        accent-color: #e82374;
        width: 16px;
        height: 16px;
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

    .lost-password {
        text-align: left;
        margin-top: 0.5rem;
    }

    .lost-password a {
        color: #e82374;
        text-decoration: none;
        font-size: 0.875rem;
    }

    .lost-password a:hover {
        text-decoration: underline;
    }

    .register-link {
        margin-top: 2rem;
        text-align: center;
        color: var(--text-secondary);
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    .register-link a {
        color: #e82374;
        font-weight: 500;
        text-decoration: none;
    }

    .register-link a:hover {
        text-decoration: underline;
    }
</style>
