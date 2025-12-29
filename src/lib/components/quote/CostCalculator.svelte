<script lang="ts">
    /**
     * CostCalculator Component
     * A multi-section form for estimating cleaning costs
     * - Service Type (dropdowns)
     * - Space Size (sliders)
     * - Add-On Services (toggles)
     * - Additional Info (dropdowns)
     * - Total and Contact Form
     */
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { cart } from "$lib/stores/cart";
    import { getCalculatorSettingsMap } from "$lib/services/admin";

    let currentStep = $state(1); // 1 = Calculator, 2 = Contact Form
    let isPricingLoaded = $state(false);

    // Pricing configuration (loaded from PocketBase)
    let pricing = $state<Record<string, number>>({
        // Default fallback values
        base_standard: 50,
        base_deep: 80,
        base_moveinout: 100,
        base_construction: 120,
        rate_per_room: 15,
        rate_per_bathroom: 20,
        rate_per_sqft: 0.5,
        addon_fridge: 10,
        addon_oven: 10,
        addon_windows: 10,
        addon_carpet: 10,
        addon_balcony: 10,
        addon_laundry: 10,
        addon_bedlinen: 10,
        addon_furniture: 10,
        discount_weekly: 15,
        discount_biweekly: 10,
        discount_monthly: 5,
    });

    // Form state
    let cleaningType = $state("Standard Cleaning");
    let frequency = $state("One-time");
    let packageType = $state("Basic");

    let squareFootage = $state(50);
    let roomNumber = $state(2);
    let bathroomNumber = $state(1);

    // Add-ons
    let addOns = $state({
        fridge: false,
        oven: false,
        windows: false,
        carpet: false,
        balcony: false,
        laundry: false,
        bedLinen: false,
        furniture: false,
    });

    // Additional info
    let preferredTime = $state("Morning (8am - 12pm)");
    let hasPets = $state("No");
    let homeType = $state("Apartment");

    // Contact form
    let contactName = $state("");
    let contactEmail = $state("");
    let contactPhone = $state("");
    let contactAddress = $state("");
    let preferredDate = $state("");
    let contactMessage = $state("");
    let emailQuote = $state(false);

    // Load pricing from PocketBase
    async function loadPricing() {
        try {
            const settingsMap = await getCalculatorSettingsMap();
            if (Object.keys(settingsMap).length > 0) {
                pricing = { ...pricing, ...settingsMap };
            }
        } catch (error) {
            console.error("Error loading pricing:", error);
            // Keep using default values
        } finally {
            isPricingLoaded = true;
        }
    }

    onMount(() => {
        loadPricing();
    });

    // Calculate total using dynamic pricing
    const basePrice = $derived(() => {
        // Get base price based on cleaning type
        let base = pricing.base_standard;
        if (cleaningType === "Deep Cleaning") base = pricing.base_deep;
        if (cleaningType === "Move In/Out") base = pricing.base_moveinout;
        if (cleaningType === "Post-Construction")
            base = pricing.base_construction;

        // Add room costs
        base += roomNumber * pricing.rate_per_room;
        base += bathroomNumber * pricing.rate_per_bathroom;
        base += squareFootage * pricing.rate_per_sqft;

        // Add-ons with individual pricing
        if (addOns.fridge) base += pricing.addon_fridge;
        if (addOns.oven) base += pricing.addon_oven;
        if (addOns.windows) base += pricing.addon_windows;
        if (addOns.carpet) base += pricing.addon_carpet;
        if (addOns.balcony) base += pricing.addon_balcony;
        if (addOns.laundry) base += pricing.addon_laundry;
        if (addOns.bedLinen) base += pricing.addon_bedlinen;
        if (addOns.furniture) base += pricing.addon_furniture;

        // Frequency discount
        if (frequency === "Weekly") base *= 1 - pricing.discount_weekly / 100;
        if (frequency === "Bi-weekly")
            base *= 1 - pricing.discount_biweekly / 100;
        if (frequency === "Monthly") base *= 1 - pricing.discount_monthly / 100;

        return Math.round(base);
    });

    function nextStep() {
        currentStep = 2;
    }

    function prevStep() {
        currentStep = 1;
    }

    function handleSubmit() {
        // Add quote to cart
        cart.setQuote({
            cleaningType,
            packageType,
            homeType,
            squareFootage,
            roomNumber,
            bathroomNumber,
            addons: {
                windowCleaning: addOns.windows,
                carpetCleaning: addOns.carpet,
                appliances: addOns.oven,
                laundry: addOns.laundry,
                organization: addOns.furniture,
                fridgeCleaning: addOns.fridge,
            },
            preferredDate,
            preferredTime,
            hasPets,
            specialInstructions: contactMessage,
            address: contactAddress,
            estimatedPrice: basePrice(),
        });

        // Add to cart and go to checkout
        cart.addToCart();
        goto("/checkout");
    }

    // Dropdown options
    const cleaningTypes = [
        "Standard Cleaning",
        "Deep Cleaning",
        "Move In/Out",
        "Post-Construction",
    ];
    const frequencies = ["One-time", "Weekly", "Bi-weekly", "Monthly"];
    const packages = ["Basic", "Standard", "Premium"];
    const timeSlots = [
        "Morning (8am - 12pm)",
        "Afternoon (12pm - 5pm)",
        "Evening (5pm - 8pm)",
    ];
    const petOptions = ["No", "Yes - Dog", "Yes - Cat", "Yes - Other"];
    const homeTypes = ["Apartment", "House", "Condo", "Townhouse", "Office"];
</script>

<section class="cost-calculator">
    <div class="container">
        <!-- Header -->
        <div class="section-header">
            <span class="superheadline">COST CALCULATOR</span>
            <h2>Get a Detailed Estimate for Your Cleaning Needs</h2>
            <p class="subtitle">
                Use the form below to estimate your home cleaning service. We'll
                follow up with a personalized quote and scheduling options.
            </p>
        </div>

        <!-- Calculator Form -->
        <div class="calculator-card">
            {#if currentStep === 1}
                <!-- Step 1: Calculator -->
                <div class="calculator-form">
                    <!-- Service Type -->
                    <div class="form-section">
                        <h5>Service Type</h5>
                        <div class="section-divider"></div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>TYPE OF CLEANING</label>
                                <select bind:value={cleaningType}>
                                    {#each cleaningTypes as type}
                                        <option value={type}>{type}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>CLEANING FREQUENCY</label>
                                <select bind:value={frequency}>
                                    {#each frequencies as freq}
                                        <option value={freq}>{freq}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>CLEANING PACKAGE</label>
                                <select bind:value={packageType}>
                                    {#each packages as pkg}
                                        <option value={pkg}>{pkg}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Space Size -->
                    <div class="form-section">
                        <h5>Space Size</h5>
                        <div class="section-divider"></div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>SQUARE FOOTAGE</label>
                                <div class="slider-container">
                                    <input
                                        type="range"
                                        min="20"
                                        max="200"
                                        step="10"
                                        bind:value={squareFootage}
                                    />
                                    <span class="slider-value"
                                        >{squareFootage} sq ft</span
                                    >
                                </div>
                            </div>
                            <div class="form-group">
                                <label>ROOM NUMBER</label>
                                <div class="slider-container">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        step="1"
                                        bind:value={roomNumber}
                                    />
                                    <span class="slider-value"
                                        >{roomNumber}</span
                                    >
                                </div>
                            </div>
                            <div class="form-group">
                                <label>BATHROOM NUMBER</label>
                                <div class="slider-container">
                                    <input
                                        type="range"
                                        min="1"
                                        max="7"
                                        step="1"
                                        bind:value={bathroomNumber}
                                    />
                                    <span class="slider-value"
                                        >{bathroomNumber}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Add-On Services -->
                    <div class="form-section">
                        <h5>Add-On Services (Optional)</h5>
                        <div class="section-divider"></div>
                        <div class="addons-grid">
                            <div class="addon-item">
                                <label>INSIDE FRIDGE CLEANING</label>
                                <button
                                    type="button"
                                    class="toggle-switch"
                                    class:active={addOns.fridge}
                                    onclick={() =>
                                        (addOns.fridge = !addOns.fridge)}
                                >
                                    <span class="toggle-slider"></span>
                                </button>
                            </div>
                            <div class="addon-item">
                                <label>INSIDE OVEN CLEANING</label>
                                <button
                                    type="button"
                                    class="toggle-switch"
                                    class:active={addOns.oven}
                                    onclick={() => (addOns.oven = !addOns.oven)}
                                >
                                    <span class="toggle-slider"></span>
                                </button>
                            </div>
                            <div class="addon-item">
                                <label>INTERIOR WINDOWS</label>
                                <button
                                    type="button"
                                    class="toggle-switch"
                                    class:active={addOns.windows}
                                    onclick={() =>
                                        (addOns.windows = !addOns.windows)}
                                >
                                    <span class="toggle-slider"></span>
                                </button>
                            </div>
                            <div class="addon-item">
                                <label>CARPET CLEANING</label>
                                <button
                                    type="button"
                                    class="toggle-switch"
                                    class:active={addOns.carpet}
                                    onclick={() =>
                                        (addOns.carpet = !addOns.carpet)}
                                >
                                    <span class="toggle-slider"></span>
                                </button>
                            </div>
                            <div class="addon-item">
                                <label>BALCONY OR PATIO</label>
                                <button
                                    type="button"
                                    class="toggle-switch"
                                    class:active={addOns.balcony}
                                    onclick={() =>
                                        (addOns.balcony = !addOns.balcony)}
                                >
                                    <span class="toggle-slider"></span>
                                </button>
                            </div>
                            <div class="addon-item">
                                <label>LAUNDRY WASH & FOLD</label>
                                <button
                                    type="button"
                                    class="toggle-switch"
                                    class:active={addOns.laundry}
                                    onclick={() =>
                                        (addOns.laundry = !addOns.laundry)}
                                >
                                    <span class="toggle-slider"></span>
                                </button>
                            </div>
                            <div class="addon-item">
                                <label>BED LINEN CHANGE</label>
                                <button
                                    type="button"
                                    class="toggle-switch"
                                    class:active={addOns.bedLinen}
                                    onclick={() =>
                                        (addOns.bedLinen = !addOns.bedLinen)}
                                >
                                    <span class="toggle-slider"></span>
                                </button>
                            </div>
                            <div class="addon-item">
                                <label>FURNITURE VACUUMING</label>
                                <button
                                    type="button"
                                    class="toggle-switch"
                                    class:active={addOns.furniture}
                                    onclick={() =>
                                        (addOns.furniture = !addOns.furniture)}
                                >
                                    <span class="toggle-slider"></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Additional Info -->
                    <div class="form-section">
                        <h5>Additional Info</h5>
                        <div class="section-divider"></div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>PREFERRED CLEANING TIME</label>
                                <select bind:value={preferredTime}>
                                    {#each timeSlots as time}
                                        <option value={time}>{time}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>DO YOU HAVE PETS</label>
                                <select bind:value={hasPets}>
                                    {#each petOptions as pet}
                                        <option value={pet}>{pet}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>HOME TYPE</label>
                                <select bind:value={homeType}>
                                    {#each homeTypes as home}
                                        <option value={home}>{home}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Total and Next -->
                    <div class="total-section">
                        <div class="total-display">
                            <span class="total-label">Total</span>
                            <span class="total-amount">${basePrice()}</span>
                        </div>
                        <button
                            type="button"
                            class="next-btn"
                            onclick={nextStep}
                        >
                            Next
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            {:else}
                <!-- Step 2: Contact Form -->
                <div class="contact-form">
                    <button type="button" class="back-btn" onclick={prevStep}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
                        </svg>
                        Back to Calculator
                    </button>

                    <div class="contact-grid">
                        <div class="form-group">
                            <input
                                type="text"
                                placeholder="Name"
                                bind:value={contactName}
                                required
                            />
                        </div>
                        <div class="form-group">
                            <input
                                type="email"
                                placeholder="Email"
                                bind:value={contactEmail}
                                required
                            />
                        </div>
                        <div class="form-group">
                            <input
                                type="tel"
                                placeholder="Phone"
                                bind:value={contactPhone}
                                required
                            />
                        </div>
                        <div class="form-group">
                            <input
                                type="text"
                                placeholder="Address"
                                bind:value={contactAddress}
                            />
                        </div>
                        <div class="form-group">
                            <input
                                type="date"
                                placeholder="Preferred Service Date"
                                bind:value={preferredDate}
                            />
                        </div>
                        <div class="form-group full-width">
                            <textarea
                                placeholder="Message"
                                bind:value={contactMessage}
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    <label class="email-quote-checkbox">
                        <input type="checkbox" bind:checked={emailQuote} />
                        <span>Email me quote!</span>
                    </label>

                    <div class="submit-section">
                        <div class="total-display">
                            <span class="total-label">Total</span>
                            <span class="total-amount">${basePrice()}</span>
                        </div>
                        <button
                            type="submit"
                            class="submit-btn"
                            onclick={handleSubmit}
                        >
                            Submit
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</section>

<style>
    .cost-calculator {
        padding: 5rem 1rem;
        background: linear-gradient(
            135deg,
            #e8f4fe 0%,
            #dbeafe 25%,
            #c3dafe 50%,
            #a5b4fc 75%,
            #c4b5fd 100%
        );
        position: relative;
        overflow: hidden;
    }

    .cost-calculator::before {
        content: "";
        position: absolute;
        top: -50%;
        right: -20%;
        width: 80%;
        height: 150%;
        background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 60%
        );
        pointer-events: none;
    }

    :global(.dark) .cost-calculator {
        background: linear-gradient(
            135deg,
            #1a1a2e 0%,
            #16213e 50%,
            #0f3460 100%
        );
    }

    :global(.dark) .cost-calculator::before {
        background: radial-gradient(
            circle,
            rgba(19, 132, 226, 0.1) 0%,
            transparent 60%
        );
    }

    .container {
        max-width: 900px;
        margin: 0 auto;
    }

    .section-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .superheadline {
        text-transform: uppercase;
        font-size: 0.875rem;
        letter-spacing: 0.1em;
        color: var(--text-secondary, #666);
        margin-bottom: 0.5rem;
        display: block;
    }

    :global(.dark) .superheadline {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .section-header h2 {
        font-size: 2.5rem;
        font-weight: 400;
        color: var(--text-primary, #1a1a1a);
        margin-bottom: 1rem;
    }

    :global(.dark) .section-header h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .subtitle {
        font-size: 1rem;
        color: var(--text-secondary, #666);
        max-width: 600px;
        margin: 0 auto;
    }

    :global(.dark) .subtitle {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .calculator-card {
        background-color: white;
        border-radius: var(--border-radius-xl, 2rem);
        padding: 2.5rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    }

    :global(.dark) .calculator-card {
        background-color: var(--bg-primary-dark, #252525);
    }

    .form-section {
        margin-bottom: 2rem;
    }

    .form-section h5 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary, #1a1a1a);
        margin-bottom: 0.75rem;
    }

    :global(.dark) .form-section h5 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .section-divider {
        height: 1px;
        background-color: var(--border-color, #e5e5e5);
        margin-bottom: 1.5rem;
    }

    :global(.dark) .section-divider {
        background-color: var(--border-color-dark, #333);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .form-group label {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .form-group select,
    .form-group input[type="text"],
    .form-group input[type="email"],
    .form-group input[type="tel"],
    .form-group input[type="date"],
    .form-group textarea {
        padding: 0.875rem 1rem;
        border: 1px solid var(--border-color, #e5e5e5);
        border-radius: var(--border-radius-md, 0.75rem);
        font-size: 1rem;
        background-color: white;
        color: var(--text-primary, #1a1a1a);
        transition: all 0.2s ease;
    }

    :global(.dark) .form-group select,
    :global(.dark) .form-group input,
    :global(.dark) .form-group textarea {
        background-color: var(--bg-secondary-dark, #1e1e1e);
        border-color: var(--border-color-dark, #333);
        color: var(--text-primary-dark, #f5f5f5);
    }

    .form-group select:focus,
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary-color, #1384e2);
    }

    .slider-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .slider-container input[type="range"] {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: var(--border-color, #e5e5e5);
        appearance: none;
    }

    .slider-container input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color, #1384e2);
        cursor: pointer;
    }

    .slider-value {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary-color, #1384e2);
        min-width: 60px;
    }

    .addons-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .addon-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .addon-item label {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .addon-item label {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .toggle-switch {
        position: relative;
        width: 52px;
        height: 28px;
        background-color: var(--border-color, #e5e5e5);
        border: none;
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;
    }

    .toggle-switch.active {
        background-color: var(--primary-color, #1384e2);
    }

    .toggle-slider {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 22px;
        height: 22px;
        background-color: white;
        border-radius: 50%;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch.active .toggle-slider {
        left: 27px;
    }

    .total-section,
    .submit-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--accent-color, #e82374);
        border-radius: 50px;
        padding: 0.75rem 1rem;
        margin-top: 2rem;
    }

    .total-display {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .total-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.8);
    }

    .total-amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
    }

    .next-btn,
    .submit-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background-color: white;
        color: var(--accent-color, #e82374);
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .next-btn:hover,
    .submit-btn:hover {
        transform: scale(1.05);
    }

    .back-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: transparent;
        color: var(--text-secondary, #666);
        border: 1px solid var(--border-color, #e5e5e5);
        border-radius: 50px;
        font-size: 0.875rem;
        cursor: pointer;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
    }

    :global(.dark) .back-btn {
        color: var(--text-secondary-dark, #a0a0a0);
        border-color: var(--border-color-dark, #333);
    }

    .back-btn:hover {
        border-color: var(--primary-color, #1384e2);
        color: var(--primary-color, #1384e2);
    }

    .contact-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .contact-grid .full-width {
        grid-column: 1 / -1;
    }

    .email-quote-checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        cursor: pointer;
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .email-quote-checkbox {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .email-quote-checkbox input {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color, #1384e2);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .form-grid,
        .addons-grid,
        .contact-grid {
            grid-template-columns: 1fr;
        }

        .section-header h2 {
            font-size: 1.75rem;
        }

        .calculator-card {
            padding: 1.5rem;
        }

        .total-section,
        .submit-section {
            flex-direction: column;
            gap: 1rem;
            border-radius: var(--border-radius-lg, 1.5rem);
            padding: 1.25rem;
        }
    }
</style>
