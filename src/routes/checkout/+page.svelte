<script lang="ts">
    import { goto } from "$app/navigation";
    import { cart, cartTotal, cartItemCount } from "$lib/stores/cart";
    import { isAuthenticated, currentUser } from "$lib/stores/auth";
    import PageHero from "$lib/components/shared/PageHero.svelte";

    // Contact form
    let name = $state($currentUser?.name || "");
    let email = $state($currentUser?.email || "");
    let phone = $state($currentUser?.phone || "");
    let agreeToTerms = $state(false);

    let isSubmitting = $state(false);
    let error = $state("");

    // Populate from user if authenticated
    $effect(() => {
        if ($currentUser) {
            name = $currentUser.name || "";
            email = $currentUser.email || "";
            phone = $currentUser.phone || "";
        }
    });

    function formatPrice(price: number): string {
        return `$${price.toFixed(2)}`;
    }

    function getAddonsList(addons: Record<string, boolean>): string[] {
        const addonNames: Record<string, string> = {
            windowCleaning: "Window Cleaning",
            carpetCleaning: "Carpet Cleaning",
            appliances: "Appliance Cleaning",
            laundry: "Laundry Service",
            organization: "Organization",
            fridgeCleaning: "Fridge Cleaning",
            petHairRemoval: "Pet Hair Removal",
            sanitization: "Deep Sanitization",
            ecoFriendly: "Eco-Friendly Products",
        };
        return Object.entries(addons)
            .filter(([_, enabled]) => enabled)
            .map(([key, _]) => addonNames[key] || key);
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        error = "";

        if (!agreeToTerms) {
            error = "Please agree to the terms and conditions";
            return;
        }

        if ($cart.items.length === 0) {
            error = "Your cart is empty";
            return;
        }

        isSubmitting = true;

        const result = await cart.submitBooking({ name, email, phone });

        if (result.success) {
            goto("/checkout/success");
        } else {
            error = result.error || "Failed to submit booking";
        }

        isSubmitting = false;
    }

    function removeItem(id: string) {
        cart.removeItem(id);
    }
</script>

<svelte:head>
    <title>Checkout - Noble Jade Cleaning Services</title>
</svelte:head>

<PageHero
    title="checkout"
    backgroundImage="/images/hero_services.webp"
    overlayColor="rgba(232, 35, 116, 0.85)"
    height="h-[40vh]"
/>

<section class="checkout-section">
    <div class="container">
        {#if $cart.items.length === 0}
            <!-- Empty Cart -->
            <div class="empty-cart">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path
                        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                    />
                </svg>
                <h2>Your cart is empty</h2>
                <p>Get a quote to add services to your cart</p>
                <a href="/get-quote" class="btn-primary">Get a Quote</a>
            </div>
        {:else}
            <div class="checkout-grid">
                <!-- Order Summary -->
                <div class="order-summary">
                    <h2>Order Summary</h2>
                    <p class="item-count">
                        {$cartItemCount} service{$cartItemCount !== 1
                            ? "s"
                            : ""}
                    </p>

                    <div class="cart-items">
                        {#each $cart.items as item (item.id)}
                            <div class="cart-item">
                                <div class="item-header">
                                    <div class="item-title">
                                        <h3>{item.serviceName}</h3>
                                        <span class="package-badge"
                                            >{item.frequency}</span
                                        >
                                    </div>
                                    <button
                                        class="remove-btn"
                                        onclick={() => removeItem(item.id)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <line
                                                x1="18"
                                                y1="6"
                                                x2="6"
                                                y2="18"
                                            />
                                            <line
                                                x1="6"
                                                y1="6"
                                                x2="18"
                                                y2="18"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div class="item-details">
                                    <div class="detail-row">
                                        <span class="label">Property Type</span>
                                        <span class="value"
                                            >{item.propertyType}</span
                                        >
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Size</span>
                                        <span class="value"
                                            >{item.squareFootage} sq ft</span
                                        >
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Rooms</span>
                                        <span class="value"
                                            >{item.bedrooms} bedrooms, {item.bathrooms}
                                            bathrooms</span
                                        >
                                    </div>
                                    {#if item.scheduledDate}
                                        <div class="detail-row">
                                            <span class="label">Date</span>
                                            <span class="value"
                                                >{item.scheduledDate}</span
                                            >
                                        </div>
                                    {/if}
                                    {#if item.timeSlot}
                                        <div class="detail-row">
                                            <span class="label">Time</span>
                                            <span class="value"
                                                >{item.timeSlot}</span
                                            >
                                        </div>
                                    {/if}
                                    {#if getAddonsList(item.addons).length > 0}
                                        <div class="detail-row">
                                            <span class="label">Add-ons</span>
                                            <span class="value"
                                                >{getAddonsList(
                                                    item.addons,
                                                ).join(", ")}</span
                                            >
                                        </div>
                                    {/if}
                                </div>

                                <div class="item-price">
                                    <span class="label">Estimated Price</span>
                                    <span class="price"
                                        >{formatPrice(item.total)}</span
                                    >
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class="total-section">
                        <div class="total-row">
                            <span>Subtotal</span>
                            <span>{formatPrice($cartTotal)}</span>
                        </div>
                        <div class="total-row total">
                            <span>Total</span>
                            <span>{formatPrice($cartTotal)}</span>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="contact-form-card">
                    <h2>Contact Information</h2>
                    <p>We'll use this to confirm your booking</p>

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

                    <form onsubmit={handleSubmit}>
                        <div class="form-group">
                            <label for="name"
                                >Full Name <span class="required">*</span
                                ></label
                            >
                            <input
                                type="text"
                                id="name"
                                bind:value={name}
                                required
                                placeholder="John Doe"
                            />
                        </div>

                        <div class="form-group">
                            <label for="email"
                                >Email Address <span class="required">*</span
                                ></label
                            >
                            <input
                                type="email"
                                id="email"
                                bind:value={email}
                                required
                                placeholder="you@example.com"
                            />
                        </div>

                        <div class="form-group">
                            <label for="phone"
                                >Phone Number <span class="required">*</span
                                ></label
                            >
                            <input
                                type="tel"
                                id="phone"
                                bind:value={phone}
                                required
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div class="form-group checkbox-group">
                            <label class="checkbox-label">
                                <input
                                    type="checkbox"
                                    bind:checked={agreeToTerms}
                                />
                                <span
                                    >I agree to the <a href="/terms"
                                        >Terms of Service</a
                                    >
                                    and
                                    <a href="/privacy">Privacy Policy</a></span
                                >
                            </label>
                        </div>

                        <button
                            type="submit"
                            class="submit-btn"
                            disabled={isSubmitting}
                        >
                            {#if isSubmitting}
                                <span class="spinner"></span>
                                Processing...
                            {:else}
                                Confirm Booking
                            {/if}
                        </button>

                        {#if !$isAuthenticated}
                            <p class="login-hint">
                                <a href="/login">Login</a> to save your booking to
                                your account
                            </p>
                        {/if}
                    </form>
                </div>
            </div>
        {/if}
    </div>
</section>

<style>
    .checkout-section {
        padding: 4rem 1rem;
        background: var(--bg-primary);
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    /* Empty Cart */
    .empty-cart {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }

    .empty-cart svg {
        opacity: 0.4;
        margin-bottom: 1.5rem;
    }

    .empty-cart h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
    }

    .empty-cart p {
        margin: 0 0 1.5rem 0;
    }

    .btn-primary {
        display: inline-flex;
        padding: 0.875rem 2rem;
        background: #e82374;
        color: white;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    .btn-primary:hover {
        background: #d11d68;
        transform: translateY(-2px);
    }

    /* Checkout Grid */
    .checkout-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        align-items: start;
    }

    /* Order Summary */
    .order-summary {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 1.5rem;
    }

    .order-summary h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .item-count {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin: 0.25rem 0 1.5rem 0;
    }

    .cart-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .cart-item {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.25rem;
    }

    .item-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 1rem;
    }

    .item-title h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .package-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: rgba(232, 35, 116, 0.1);
        color: #e82374;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .remove-btn {
        padding: 0.25rem;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        transition: color 0.2s ease;
    }

    .remove-btn:hover {
        color: #ef4444;
    }

    .item-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .detail-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
    }

    .detail-row .label {
        color: var(--text-secondary);
    }

    .detail-row .value {
        color: var(--text-primary);
        font-weight: 500;
    }

    .item-price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .item-price .label {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .item-price .price {
        font-size: 1.25rem;
        font-weight: 700;
        color: #e82374;
    }

    .total-section {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color);
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
    }

    .total-row.total {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-top: 0.5rem;
    }

    /* Contact Form */
    .contact-form-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 1.5rem;
        position: sticky;
        top: 2rem;
    }

    .contact-form-card h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .contact-form-card > p {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin: 0 0 1.5rem 0;
    }

    .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 8px;
        color: #ef4444;
        font-size: 0.875rem;
        margin-bottom: 1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .required {
        color: #e82374;
    }

    .form-group input[type="text"],
    .form-group input[type="email"],
    .form-group input[type="tel"] {
        padding: 0.875rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        font-size: 1rem;
    }

    .form-group input:focus {
        outline: none;
        border-color: #e82374;
    }

    .checkbox-group {
        margin-top: 0.5rem;
    }

    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
        cursor: pointer;
    }

    .checkbox-label input {
        margin-top: 3px;
        accent-color: #e82374;
    }

    .checkbox-label a {
        color: #e82374;
        text-decoration: none;
    }

    .checkbox-label a:hover {
        text-decoration: underline;
    }

    .submit-btn {
        width: 100%;
        padding: 1rem;
        background: #e82374;
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
        margin-top: 0.5rem;
    }

    .submit-btn:hover:not(:disabled) {
        background: #d11d68;
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

    .login-hint {
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 1rem 0 0 0;
    }

    .login-hint a {
        color: #e82374;
        text-decoration: none;
        font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 900px) {
        .checkout-grid {
            grid-template-columns: 1fr;
        }

        .contact-form-card {
            position: static;
        }
    }
</style>
