<script lang="ts">
    import { goto } from "$app/navigation";
    import { currentUser } from "$lib/stores/auth";
    import { cart } from "$lib/stores/cart";

    // Multi-step wizard
    let currentStep = $state(1);
    const totalSteps = 6;

    // Step 1: Service Type
    const serviceTypes = [
        {
            id: "standard",
            name: "Standard Cleaning",
            description: "Regular maintenance cleaning for your home",
            basePrice: 80,
            icon: "home",
            popular: false,
        },
        {
            id: "deep",
            name: "Deep Cleaning",
            description: "Thorough cleaning including hard-to-reach areas",
            basePrice: 150,
            icon: "sparkle",
            popular: true,
        },
        {
            id: "moveinout",
            name: "Move In/Out",
            description: "Complete cleaning for property transitions",
            basePrice: 200,
            icon: "truck",
            popular: false,
        },
        {
            id: "post-construction",
            name: "Post-Construction",
            description: "Heavy-duty cleaning after renovations",
            basePrice: 250,
            icon: "hammer",
            popular: false,
        },
        {
            id: "office",
            name: "Office Cleaning",
            description: "Professional cleaning for workspaces",
            basePrice: 120,
            icon: "briefcase",
            popular: false,
        },
        {
            id: "airbnb",
            name: "Airbnb/Short-term",
            description: "Quick turnaround for rental properties",
            basePrice: 100,
            icon: "key",
            popular: false,
        },
    ];
    let selectedService = $state("deep");

    // Step 2: Property Details
    const propertyTypes = [
        "Apartment",
        "House",
        "Condo",
        "Townhouse",
        "Studio",
        "Loft",
        "Office",
    ];
    let propertyType = $state("Apartment");
    let squareFootage = $state(1000);
    let bedrooms = $state(2);
    let bathrooms = $state(1);
    let floors = $state(1);
    let hasBasement = $state(false);
    let hasGarage = $state(false);

    // Step 3: Add-ons
    const addons = [
        { id: "fridge", name: "Inside Fridge Cleaning", price: 25, icon: "❄️" },
        { id: "oven", name: "Inside Oven Cleaning", price: 30, icon: "🔥" },
        { id: "windows", name: "Interior Windows", price: 35, icon: "🪟" },
        { id: "carpet", name: "Carpet Shampooing", price: 50, icon: "🧹" },
        { id: "balcony", name: "Balcony/Patio", price: 25, icon: "🌿" },
        { id: "laundry", name: "Laundry Wash & Fold", price: 30, icon: "👕" },
        { id: "bedlinen", name: "Bed Linen Change", price: 15, icon: "🛏️" },
        { id: "organize", name: "Closet Organization", price: 40, icon: "📦" },
        {
            id: "dishes",
            name: "Dishes & Kitchen Cleanup",
            price: 20,
            icon: "🍽️",
        },
        { id: "pet", name: "Pet Hair Removal", price: 25, icon: "🐕" },
        { id: "green", name: "Eco-Friendly Products", price: 15, icon: "🌱" },
        { id: "sanitize", name: "Deep Sanitization", price: 35, icon: "🧴" },
    ];
    let selectedAddons = $state<string[]>([]);

    // Step 4: Date & Time
    const timeSlots = [
        {
            id: "morning-early",
            time: "8:00 AM - 10:00 AM",
            label: "Early Morning",
        },
        {
            id: "morning-late",
            time: "10:00 AM - 12:00 PM",
            label: "Late Morning",
        },
        {
            id: "afternoon-early",
            time: "12:00 PM - 2:00 PM",
            label: "Early Afternoon",
        },
        {
            id: "afternoon-late",
            time: "2:00 PM - 4:00 PM",
            label: "Late Afternoon",
        },
        { id: "evening", time: "4:00 PM - 6:00 PM", label: "Evening" },
    ];
    let selectedDate = $state("");
    let selectedTimeSlot = $state("");
    let frequency = $state("one-time");
    const frequencies = [
        { id: "one-time", name: "One-time", discount: 0 },
        { id: "weekly", name: "Weekly", discount: 20 },
        { id: "biweekly", name: "Bi-weekly", discount: 15 },
        { id: "monthly", name: "Monthly", discount: 10 },
    ];

    // Step 5: Address
    let addressLine1 = $state("");
    let addressLine2 = $state("");
    let city = $state("");
    let province = $state("Ontario");
    let postalCode = $state("");
    let specialInstructions = $state("");
    let parkingInfo = $state("");
    let accessCode = $state("");

    // Step 6: Summary (calculated)

    // Calculate pricing
    const basePrice = $derived(() => {
        const service = serviceTypes.find((s) => s.id === selectedService);
        return service?.basePrice || 0;
    });

    const sizeMultiplier = $derived(() => {
        // Base is 1000 sq ft
        if (squareFootage <= 500) return 0.7;
        if (squareFootage <= 1000) return 1.0;
        if (squareFootage <= 1500) return 1.3;
        if (squareFootage <= 2000) return 1.5;
        if (squareFootage <= 2500) return 1.7;
        return 2.0;
    });

    const roomCharge = $derived(() => {
        return (
            bedrooms * 15 +
            bathrooms * 20 +
            (floors > 1 ? (floors - 1) * 25 : 0)
        );
    });

    const addonsTotal = $derived(() => {
        return selectedAddons.reduce((sum, id) => {
            const addon = addons.find((a) => a.id === id);
            return sum + (addon?.price || 0);
        }, 0);
    });

    const extraCharges = $derived(() => {
        let extra = 0;
        if (hasBasement) extra += 40;
        if (hasGarage) extra += 30;
        return extra;
    });

    const subtotal = $derived(() => {
        return Math.round(
            basePrice() * sizeMultiplier() +
                roomCharge() +
                addonsTotal() +
                extraCharges(),
        );
    });

    const discount = $derived(() => {
        const freq = frequencies.find((f) => f.id === frequency);
        return Math.round(subtotal() * ((freq?.discount || 0) / 100));
    });

    const total = $derived(() => {
        return subtotal() - discount();
    });

    // Navigation
    function nextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    function goToStep(step: number) {
        if (step <= currentStep) {
            currentStep = step;
        }
    }

    function toggleAddon(id: string) {
        if (selectedAddons.includes(id)) {
            selectedAddons = selectedAddons.filter((a) => a !== id);
        } else {
            selectedAddons = [...selectedAddons, id];
        }
    }

    function isStepValid(step: number): boolean {
        switch (step) {
            case 1:
                return !!selectedService;
            case 2:
                return squareFootage > 0 && bedrooms > 0 && bathrooms > 0;
            case 3:
                return true; // Addons are optional
            case 4:
                return !!selectedDate && !!selectedTimeSlot;
            case 5:
                return !!addressLine1 && !!city && !!postalCode;
            case 6:
                return true;
            default:
                return false;
        }
    }

    async function submitBooking() {
        const service = serviceTypes.find((s) => s.id === selectedService);

        // Add to cart with proper field mapping for PocketBase
        cart.setQuote({
            // Service details
            serviceType: selectedService, // e.g., "deep", "standard"
            serviceName: service?.name || "",
            frequency: frequency,

            // Property details
            propertyType: propertyType,
            squareFootage: squareFootage,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            floors: floors,
            hasBasement: hasBasement,
            hasGarage: hasGarage,

            // Add-ons
            addons: {
                windowCleaning: selectedAddons.includes("windows"),
                carpetCleaning: selectedAddons.includes("carpet"),
                appliances: selectedAddons.includes("oven"),
                laundry: selectedAddons.includes("laundry"),
                organization: selectedAddons.includes("organize"),
                fridgeCleaning: selectedAddons.includes("fridge"),
                petHairRemoval: selectedAddons.includes("pet"),
                sanitization: selectedAddons.includes("sanitize"),
                ecoFriendly: selectedAddons.includes("green"),
            },

            // Schedule
            scheduledDate: selectedDate,
            timeSlot:
                timeSlots.find((t) => t.id === selectedTimeSlot)?.time ||
                selectedTimeSlot,

            // Address (split into components for database)
            address: addressLine1 + (addressLine2 ? ", " + addressLine2 : ""),
            city: city,
            province: province,
            postalCode: postalCode,
            accessCode: accessCode,
            parkingInfo: parkingInfo,
            specialInstructions: specialInstructions,

            // Pricing
            subtotal: subtotal(),
            discount: discount(),
            total: total(),
        });

        cart.addToCart();
        goto("/checkout");
    }

    // Generate next 30 days for date picker
    function getAvailableDates(): {
        date: string;
        display: string;
        dayName: string;
    }[] {
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                date: date.toISOString().split("T")[0],
                display: date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
            });
        }
        return dates;
    }

    const availableDates = getAvailableDates();
</script>

<svelte:head>
    <title>Book a Cleaning - Dashboard</title>
</svelte:head>

<div class="booking-page">
    <!-- Progress Bar -->
    <div class="progress-section">
        <div class="progress-header">
            <h1>Book a Cleaning</h1>
            <span class="step-indicator"
                >Step {currentStep} of {totalSteps}</span
            >
        </div>
        <div class="progress-bar">
            <div
                class="progress-fill"
                style="width: {(currentStep / totalSteps) * 100}%"
            ></div>
        </div>
        <div class="progress-steps">
            {#each ["Service", "Property", "Add-ons", "Schedule", "Address", "Confirm"] as stepName, i}
                <button
                    class="progress-step"
                    class:active={currentStep === i + 1}
                    class:completed={currentStep > i + 1}
                    onclick={() => goToStep(i + 1)}
                    disabled={i + 1 > currentStep}
                >
                    <span class="step-number">{i + 1}</span>
                    <span class="step-name">{stepName}</span>
                </button>
            {/each}
        </div>
    </div>

    <div class="booking-content">
        <!-- Step 1: Service Type -->
        {#if currentStep === 1}
            <div class="step-content">
                <h2>What type of cleaning do you need?</h2>
                <p class="step-subtitle">
                    Choose the service that best fits your needs
                </p>

                <div class="service-grid">
                    {#each serviceTypes as service}
                        <button
                            class="service-card"
                            class:selected={selectedService === service.id}
                            onclick={() => (selectedService = service.id)}
                        >
                            {#if service.popular}
                                <span class="popular-badge">Most Popular</span>
                            {/if}
                            <div class="service-icon">
                                {#if service.icon === "home"}
                                    🏠
                                {:else if service.icon === "sparkle"}
                                    ✨
                                {:else if service.icon === "truck"}
                                    🚚
                                {:else if service.icon === "hammer"}
                                    🔨
                                {:else if service.icon === "briefcase"}
                                    💼
                                {:else if service.icon === "key"}
                                    🔑
                                {/if}
                            </div>
                            <h3>{service.name}</h3>
                            <p>{service.description}</p>
                            <span class="service-price"
                                >From ${service.basePrice}</span
                            >
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Step 2: Property Details -->
        {#if currentStep === 2}
            <div class="step-content">
                <h2>Tell us about your property</h2>
                <p class="step-subtitle">
                    This helps us provide an accurate estimate
                </p>

                <div class="form-section">
                    <label class="form-label">Property Type</label>
                    <div class="property-type-grid">
                        {#each propertyTypes as type}
                            <button
                                class="property-type-btn"
                                class:selected={propertyType === type}
                                onclick={() => (propertyType = type)}
                            >
                                {type}
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="form-section">
                    <label class="form-label"
                        >Square Footage: {squareFootage} sq ft</label
                    >
                    <input
                        type="range"
                        min="200"
                        max="5000"
                        step="100"
                        bind:value={squareFootage}
                        class="range-slider"
                    />
                    <div class="range-labels">
                        <span>200 sq ft</span>
                        <span>5,000 sq ft</span>
                    </div>
                </div>

                <div class="form-grid-3">
                    <div class="form-section">
                        <label class="form-label">Bedrooms</label>
                        <div class="counter">
                            <button
                                onclick={() =>
                                    (bedrooms = Math.max(0, bedrooms - 1))}
                                >−</button
                            >
                            <span>{bedrooms}</span>
                            <button
                                onclick={() =>
                                    (bedrooms = Math.min(10, bedrooms + 1))}
                                >+</button
                            >
                        </div>
                    </div>
                    <div class="form-section">
                        <label class="form-label">Bathrooms</label>
                        <div class="counter">
                            <button
                                onclick={() =>
                                    (bathrooms = Math.max(1, bathrooms - 1))}
                                >−</button
                            >
                            <span>{bathrooms}</span>
                            <button
                                onclick={() =>
                                    (bathrooms = Math.min(10, bathrooms + 1))}
                                >+</button
                            >
                        </div>
                    </div>
                    <div class="form-section">
                        <label class="form-label">Floors</label>
                        <div class="counter">
                            <button
                                onclick={() =>
                                    (floors = Math.max(1, floors - 1))}
                                >−</button
                            >
                            <span>{floors}</span>
                            <button
                                onclick={() =>
                                    (floors = Math.min(5, floors + 1))}
                                >+</button
                            >
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <label class="form-label">Additional Areas</label>
                    <div class="checkbox-grid">
                        <label class="checkbox-card">
                            <input type="checkbox" bind:checked={hasBasement} />
                            <span class="checkbox-content">
                                <span class="checkbox-icon">🏠</span>
                                <span class="checkbox-label"
                                    >Basement (+$40)</span
                                >
                            </span>
                        </label>
                        <label class="checkbox-card">
                            <input type="checkbox" bind:checked={hasGarage} />
                            <span class="checkbox-content">
                                <span class="checkbox-icon">🚗</span>
                                <span class="checkbox-label">Garage (+$30)</span
                                >
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Step 3: Add-ons -->
        {#if currentStep === 3}
            <div class="step-content">
                <h2>Would you like any extras?</h2>
                <p class="step-subtitle">
                    Customize your cleaning with add-on services
                </p>

                <div class="addons-grid">
                    {#each addons as addon}
                        <button
                            class="addon-card"
                            class:selected={selectedAddons.includes(addon.id)}
                            onclick={() => toggleAddon(addon.id)}
                        >
                            <span class="addon-icon">{addon.icon}</span>
                            <span class="addon-name">{addon.name}</span>
                            <span class="addon-price">+${addon.price}</span>
                            {#if selectedAddons.includes(addon.id)}
                                <span class="addon-check">✓</span>
                            {/if}
                        </button>
                    {/each}
                </div>

                {#if selectedAddons.length > 0}
                    <div class="addons-summary">
                        <span
                            >{selectedAddons.length} add-on{selectedAddons.length >
                            1
                                ? "s"
                                : ""} selected</span
                        >
                        <span>+${addonsTotal()}</span>
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Step 4: Date & Time -->
        {#if currentStep === 4}
            <div class="step-content">
                <h2>When would you like us to come?</h2>
                <p class="step-subtitle">Select your preferred date and time</p>

                <div class="form-section">
                    <label class="form-label">Cleaning Frequency</label>
                    <div class="frequency-grid">
                        {#each frequencies as freq}
                            <button
                                class="frequency-btn"
                                class:selected={frequency === freq.id}
                                onclick={() => (frequency = freq.id)}
                            >
                                <span class="freq-name">{freq.name}</span>
                                {#if freq.discount > 0}
                                    <span class="freq-discount"
                                        >Save {freq.discount}%</span
                                    >
                                {/if}
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="form-section">
                    <label class="form-label">Select Date</label>
                    <div class="date-grid">
                        {#each availableDates.slice(0, 14) as dateObj}
                            <button
                                class="date-btn"
                                class:selected={selectedDate === dateObj.date}
                                onclick={() => (selectedDate = dateObj.date)}
                            >
                                <span class="date-day">{dateObj.dayName}</span>
                                <span class="date-num">{dateObj.display}</span>
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="form-section">
                    <label class="form-label">Preferred Time Slot</label>
                    <div class="time-grid">
                        {#each timeSlots as slot}
                            <button
                                class="time-btn"
                                class:selected={selectedTimeSlot === slot.id}
                                onclick={() => (selectedTimeSlot = slot.id)}
                            >
                                <span class="time-label">{slot.label}</span>
                                <span class="time-value">{slot.time}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}

        <!-- Step 5: Address -->
        {#if currentStep === 5}
            <div class="step-content">
                <h2>Where should we clean?</h2>
                <p class="step-subtitle">Enter your service address</p>

                <div class="form-grid-2">
                    <div class="form-section full-width">
                        <label class="form-label" for="address1"
                            >Street Address *</label
                        >
                        <input
                            type="text"
                            id="address1"
                            bind:value={addressLine1}
                            placeholder="123 Main Street"
                            required
                        />
                    </div>
                    <div class="form-section full-width">
                        <label class="form-label" for="address2"
                            >Apartment, Suite, Unit (optional)</label
                        >
                        <input
                            type="text"
                            id="address2"
                            bind:value={addressLine2}
                            placeholder="Apt 4B"
                        />
                    </div>
                    <div class="form-section">
                        <label class="form-label" for="city">City *</label>
                        <input
                            type="text"
                            id="city"
                            bind:value={city}
                            placeholder="Toronto"
                            required
                        />
                    </div>
                    <div class="form-section">
                        <label class="form-label" for="province">Province</label
                        >
                        <select id="province" bind:value={province}>
                            <option>Ontario</option>
                            <option>Quebec</option>
                            <option>British Columbia</option>
                            <option>Alberta</option>
                        </select>
                    </div>
                    <div class="form-section">
                        <label class="form-label" for="postal"
                            >Postal Code *</label
                        >
                        <input
                            type="text"
                            id="postal"
                            bind:value={postalCode}
                            placeholder="M5V 2H1"
                            required
                        />
                    </div>
                    <div class="form-section">
                        <label class="form-label" for="access"
                            >Building Access Code</label
                        >
                        <input
                            type="text"
                            id="access"
                            bind:value={accessCode}
                            placeholder="e.g., #1234"
                        />
                    </div>
                </div>

                <div class="form-section">
                    <label class="form-label" for="parking"
                        >Parking Instructions</label
                    >
                    <input
                        type="text"
                        id="parking"
                        bind:value={parkingInfo}
                        placeholder="e.g., Street parking available, Visitor parking in P1"
                    />
                </div>

                <div class="form-section">
                    <label class="form-label" for="instructions"
                        >Special Instructions</label
                    >
                    <textarea
                        id="instructions"
                        bind:value={specialInstructions}
                        placeholder="Any special requests or things we should know?"
                        rows="3"
                    ></textarea>
                </div>
            </div>
        {/if}

        <!-- Step 6: Summary -->
        {#if currentStep === 6}
            <div class="step-content">
                <h2>Review Your Booking</h2>
                <p class="step-subtitle">Make sure everything looks good</p>

                <div class="summary-grid">
                    <div class="summary-card">
                        <h3>Service Details</h3>
                        <div class="summary-item">
                            <span class="label">Service Type</span>
                            <span class="value"
                                >{serviceTypes.find(
                                    (s) => s.id === selectedService,
                                )?.name}</span
                            >
                        </div>
                        <div class="summary-item">
                            <span class="label">Frequency</span>
                            <span class="value"
                                >{frequencies.find((f) => f.id === frequency)
                                    ?.name}</span
                            >
                        </div>
                    </div>

                    <div class="summary-card">
                        <h3>Property</h3>
                        <div class="summary-item">
                            <span class="label">Type</span>
                            <span class="value">{propertyType}</span>
                        </div>
                        <div class="summary-item">
                            <span class="label">Size</span>
                            <span class="value">{squareFootage} sq ft</span>
                        </div>
                        <div class="summary-item">
                            <span class="label">Rooms</span>
                            <span class="value"
                                >{bedrooms} bed, {bathrooms} bath, {floors} floor{floors >
                                1
                                    ? "s"
                                    : ""}</span
                            >
                        </div>
                    </div>

                    <div class="summary-card">
                        <h3>Schedule</h3>
                        <div class="summary-item">
                            <span class="label">Date</span>
                            <span class="value">{selectedDate}</span>
                        </div>
                        <div class="summary-item">
                            <span class="label">Time</span>
                            <span class="value"
                                >{timeSlots.find(
                                    (s) => s.id === selectedTimeSlot,
                                )?.time}</span
                            >
                        </div>
                    </div>

                    <div class="summary-card">
                        <h3>Location</h3>
                        <div class="summary-item full">
                            <span class="value"
                                >{addressLine1}{addressLine2
                                    ? ", " + addressLine2
                                    : ""}</span
                            >
                        </div>
                        <div class="summary-item full">
                            <span class="value"
                                >{city}, {province} {postalCode}</span
                            >
                        </div>
                    </div>

                    {#if selectedAddons.length > 0}
                        <div class="summary-card full-width">
                            <h3>Add-ons</h3>
                            <div class="addons-list">
                                {#each selectedAddons as addonId}
                                    {@const addon = addons.find(
                                        (a) => a.id === addonId,
                                    )}
                                    {#if addon}
                                        <span class="addon-tag"
                                            >{addon.icon} {addon.name}</span
                                        >
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Price Breakdown -->
                <div class="price-breakdown">
                    <h3>Price Breakdown</h3>
                    <div class="price-row">
                        <span
                            >Base Service ({serviceTypes.find(
                                (s) => s.id === selectedService,
                            )?.name})</span
                        >
                        <span>${basePrice()}</span>
                    </div>
                    <div class="price-row">
                        <span
                            >Size Adjustment ({squareFootage} sq ft × {sizeMultiplier().toFixed(
                                1,
                            )})</span
                        >
                        <span
                            >${Math.round(basePrice() * sizeMultiplier())}</span
                        >
                    </div>
                    <div class="price-row">
                        <span
                            >Rooms ({bedrooms} bed + {bathrooms} bath + {floors}
                            floors)</span
                        >
                        <span>+${roomCharge()}</span>
                    </div>
                    {#if addonsTotal() > 0}
                        <div class="price-row">
                            <span>Add-ons ({selectedAddons.length} items)</span>
                            <span>+${addonsTotal()}</span>
                        </div>
                    {/if}
                    {#if extraCharges() > 0}
                        <div class="price-row">
                            <span>Additional Areas</span>
                            <span>+${extraCharges()}</span>
                        </div>
                    {/if}
                    <div class="price-row subtotal">
                        <span>Subtotal</span>
                        <span>${subtotal()}</span>
                    </div>
                    {#if discount() > 0}
                        <div class="price-row discount">
                            <span
                                >{frequencies.find((f) => f.id === frequency)
                                    ?.name} Discount ({frequencies.find(
                                    (f) => f.id === frequency,
                                )?.discount}%)</span
                            >
                            <span>-${discount()}</span>
                        </div>
                    {/if}
                    <div class="price-row total">
                        <span>Total</span>
                        <span>${total()}</span>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Sticky Footer with Price & Navigation -->
        <div class="booking-footer">
            <div class="footer-price">
                <span class="price-label">Estimated Total</span>
                <span class="price-value">${total()}</span>
                {#if discount() > 0}
                    <span class="price-savings">You save ${discount()}!</span>
                {/if}
            </div>
            <div class="footer-actions">
                {#if currentStep > 1}
                    <button class="btn-secondary" onclick={prevStep}>
                        ← Back
                    </button>
                {/if}
                {#if currentStep < totalSteps}
                    <button
                        class="btn-primary"
                        onclick={nextStep}
                        disabled={!isStepValid(currentStep)}
                    >
                        Continue →
                    </button>
                {:else}
                    <button class="btn-primary submit" onclick={submitBooking}>
                        Proceed to Checkout
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .booking-page {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 200px);
    }

    /* Progress Section */
    .progress-section {
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: 16px;
        margin-bottom: 1.5rem;
        border: 1px solid var(--border-color);
    }

    .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .progress-header h1 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .step-indicator {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .progress-bar {
        height: 6px;
        background: var(--bg-tertiary);
        border-radius: 3px;
        margin-bottom: 1rem;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #e82374, #a855f7);
        border-radius: 3px;
        transition: width 0.3s ease;
    }

    .progress-steps {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        padding: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.5;
        transition: all 0.2s ease;
    }

    .progress-step:not(:disabled):hover {
        opacity: 0.8;
    }

    .progress-step.active {
        opacity: 1;
    }

    .progress-step.completed {
        opacity: 0.7;
    }

    .step-number {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--bg-tertiary);
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .progress-step.active .step-number {
        background: #e82374;
        color: white;
    }

    .progress-step.completed .step-number {
        background: #22c55e;
        color: white;
    }

    .step-name {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .progress-step.active .step-name {
        color: var(--text-primary);
        font-weight: 500;
    }

    /* Content */
    .booking-content {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .step-content {
        flex: 1;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .step-content h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
    }

    .step-subtitle {
        color: var(--text-secondary);
        margin: 0 0 2rem 0;
    }

    /* Service Cards */
    .service-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }

    .service-card {
        position: relative;
        padding: 1.5rem;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 16px;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .service-card:hover {
        border-color: #e82374;
    }

    .service-card.selected {
        border-color: #e82374;
        background: rgba(232, 35, 116, 0.05);
    }

    .popular-badge {
        position: absolute;
        top: -10px;
        right: 16px;
        padding: 0.25rem 0.75rem;
        background: linear-gradient(90deg, #e82374, #a855f7);
        color: white;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .service-icon {
        font-size: 2rem;
        margin-bottom: 0.75rem;
    }

    .service-card h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
    }

    .service-card p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0 0 1rem 0;
        line-height: 1.5;
    }

    .service-price {
        font-size: 1rem;
        font-weight: 600;
        color: #e82374;
    }

    /* Form Elements */
    .form-section {
        margin-bottom: 1.5rem;
    }

    .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }

    .form-grid-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .form-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .full-width {
        grid-column: 1 / -1;
    }

    input[type="text"],
    input[type="email"],
    select,
    textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 1rem;
    }

    input:focus,
    select:focus,
    textarea:focus {
        outline: none;
        border-color: #e82374;
    }

    /* Property Type */
    .property-type-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .property-type-btn {
        padding: 0.625rem 1.25rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 50px;
        color: var(--text-primary);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .property-type-btn:hover {
        border-color: #e82374;
    }

    .property-type-btn.selected {
        background: #e82374;
        border-color: #e82374;
        color: white;
    }

    /* Range Slider */
    .range-slider {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background: var(--bg-tertiary);
        appearance: none;
        outline: none;
    }

    .range-slider::-webkit-slider-thumb {
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #e82374;
        cursor: pointer;
    }

    .range-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-top: 0.5rem;
    }

    /* Counter */
    .counter {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 0.5rem;
    }

    .counter button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--bg-tertiary);
        border: none;
        color: var(--text-primary);
        font-size: 1.25rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .counter button:hover {
        background: #e82374;
        color: white;
    }

    .counter span {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        min-width: 2rem;
        text-align: center;
    }

    /* Checkbox Cards */
    .checkbox-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .checkbox-card {
        display: block;
        cursor: pointer;
    }

    .checkbox-card input {
        display: none;
    }

    .checkbox-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        transition: all 0.2s ease;
    }

    .checkbox-card input:checked + .checkbox-content {
        border-color: #e82374;
        background: rgba(232, 35, 116, 0.05);
    }

    .checkbox-icon {
        font-size: 1.5rem;
    }

    .checkbox-label {
        font-size: 0.875rem;
        color: var(--text-primary);
    }

    /* Addons Grid */
    .addons-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .addon-card {
        position: relative;
        padding: 1.25rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .addon-card:hover {
        border-color: #e82374;
    }

    .addon-card.selected {
        border-color: #e82374;
        background: rgba(232, 35, 116, 0.05);
    }

    .addon-icon {
        display: block;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .addon-name {
        display: block;
        font-size: 0.875rem;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
    }

    .addon-price {
        font-size: 0.875rem;
        color: #e82374;
        font-weight: 600;
    }

    .addon-check {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        background: #22c55e;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
    }

    .addons-summary {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        background: rgba(232, 35, 116, 0.1);
        border-radius: 12px;
        margin-top: 1.5rem;
        color: #e82374;
        font-weight: 600;
    }

    /* Frequency */
    .frequency-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }

    .frequency-btn {
        padding: 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .frequency-btn:hover {
        border-color: #e82374;
    }

    .frequency-btn.selected {
        border-color: #e82374;
        background: rgba(232, 35, 116, 0.05);
    }

    .freq-name {
        font-weight: 500;
        color: var(--text-primary);
    }

    .freq-discount {
        font-size: 0.75rem;
        color: #22c55e;
        font-weight: 600;
    }

    /* Date Grid */
    .date-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.5rem;
    }

    .date-btn {
        padding: 0.75rem 0.5rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .date-btn:hover {
        border-color: #e82374;
    }

    .date-btn.selected {
        border-color: #e82374;
        background: #e82374;
        color: white;
    }

    .date-day {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .date-btn.selected .date-day {
        color: rgba(255, 255, 255, 0.8);
    }

    .date-num {
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--text-primary);
    }

    .date-btn.selected .date-num {
        color: white;
    }

    /* Time Grid */
    .time-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
    }

    .time-btn {
        padding: 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .time-btn:hover {
        border-color: #e82374;
    }

    .time-btn.selected {
        border-color: #e82374;
        background: rgba(232, 35, 116, 0.05);
    }

    .time-label {
        font-weight: 500;
        color: var(--text-primary);
    }

    .time-value {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    /* Summary */
    .summary-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .summary-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.25rem;
    }

    .summary-card.full-width {
        grid-column: 1 / -1;
    }

    .summary-card h3 {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 1rem 0;
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .summary-item.full {
        justify-content: flex-start;
    }

    .summary-item .label {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .summary-item .value {
        color: var(--text-primary);
        font-weight: 500;
        font-size: 0.875rem;
    }

    .addons-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .addon-tag {
        padding: 0.375rem 0.75rem;
        background: var(--bg-tertiary);
        border-radius: 50px;
        font-size: 0.75rem;
        color: var(--text-primary);
    }

    /* Price Breakdown */
    .price-breakdown {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 1.5rem;
    }

    .price-breakdown h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem 0;
    }

    .price-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .price-row.subtotal {
        border-top: 1px solid var(--border-color);
        margin-top: 0.5rem;
        padding-top: 1rem;
        color: var(--text-primary);
        font-weight: 500;
    }

    .price-row.discount {
        color: #22c55e;
    }

    .price-row.total {
        border-top: 1px solid var(--border-color);
        margin-top: 0.5rem;
        padding-top: 1rem;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
    }

    /* Footer */
    .booking-footer {
        position: sticky;
        bottom: 0;
        background: var(--bg-primary);
        border-top: 1px solid var(--border-color);
        padding: 1rem 0;
        margin-top: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .footer-price {
        display: flex;
        flex-direction: column;
    }

    .price-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .price-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
    }

    .price-savings {
        font-size: 0.75rem;
        color: #22c55e;
        font-weight: 500;
    }

    .footer-actions {
        display: flex;
        gap: 1rem;
    }

    .btn-primary,
    .btn-secondary {
        padding: 0.875rem 2rem;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .btn-primary {
        background: #e82374;
        color: white;
        border: none;
    }

    .btn-primary:hover:not(:disabled) {
        background: #d11d68;
    }

    .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-primary.submit {
        background: linear-gradient(90deg, #e82374, #a855f7);
    }

    .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }

    .btn-secondary:hover {
        background: var(--bg-tertiary);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .progress-steps {
            overflow-x: auto;
        }

        .step-name {
            display: none;
        }

        .service-grid,
        .addons-grid {
            grid-template-columns: 1fr;
        }

        .form-grid-2,
        .form-grid-3 {
            grid-template-columns: 1fr;
        }

        .frequency-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .date-grid {
            grid-template-columns: repeat(4, 1fr);
        }

        .summary-grid {
            grid-template-columns: 1fr;
        }

        .booking-footer {
            flex-direction: column;
            gap: 1rem;
        }

        .footer-actions {
            width: 100%;
        }

        .btn-primary,
        .btn-secondary {
            flex: 1;
            text-align: center;
        }
    }
</style>
