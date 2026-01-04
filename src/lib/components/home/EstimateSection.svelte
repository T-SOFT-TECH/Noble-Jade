<script lang="ts">
    // Quick Estimate Calculator

    // Form state
    let cleaningType = $state(0);
    let complexity = $state(200);
    let squareFootage = $state(40);
    let cleaningSupplies = $state(false);

    // Calculate total
    let total = $derived(() => {
        let sum = cleaningType + complexity + squareFootage;
        if (cleaningSupplies) sum += 100;
        return sum;
    });

    // Slider percentage for positioning value bubble (accounts for thumb width)
    // Range sliders have the thumb center move from 0% + half_thumb to 100% - half_thumb
    // For a 40px thumb on a track, we need to interpolate properly
    let sliderPercentage = $derived(() => {
        const percent = squareFootage / 200;
        // The thumb moves from 20px to calc(100% - 20px), so we need to account for that
        return percent;
    });
</script>

<!-- Estimate Section -->
<section class="estimate-section px-4 w-full">
    <div class="background-row">
        <!-- CSS curved corners applied via pseudo-elements -->

        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-0 items-end">
            <!-- Left Column - Cleaning Supplies Image -->
            <div class="hidden xl:flex justify-end items-end relative">
                <img
                    src="/images/image_08_home_01.png"
                    alt="Cleaning supplies"
                    class="max-w-[280px]"
                    loading="lazy"
                />

                <!-- Floating Bubble 1 -->
                <div class="floating-image floating-bubble-1 hidden 2xl:block">
                    <img
                        src="/images/floating_image_02.png"
                        alt=""
                        width="160"
                        height="160"
                    />
                </div>

                <!-- Floating Bubble 2 -->
                <div class="floating-image floating-bubble-2 hidden 2xl:block">
                    <img
                        src="/images/floating_image_03.png"
                        alt=""
                        width="90"
                        height="90"
                    />
                </div>
            </div>

            <!-- Center Column - Form Card -->
            <div class="pt-16 xl:pt-32 pb-16 px-4 xl:px-0">
                <div class="form-card max-w-lg mx-auto">
                    <!-- Title -->
                    <div class="text-center mb-6">
                        <h3
                            class="text-4xl font-medium text-gray-900 mb-2 font-heading"
                        >
                            Get a Quick Estimate
                        </h3>
                        <p class="text-gray-500 text-sm">
                            *For a detailed quote, use <a
                                href="/contact"
                                class="extended-link">extended version</a
                            >
                        </p>
                    </div>

                    <!-- Type of Cleaning -->
                    <div class="form-group">
                        <label class="form-label">Type of Cleaning</label>
                        <select class="form-select" bind:value={cleaningType}>
                            <option value={0}>Select...</option>
                            <option value={500}>Home Cleaning</option>
                            <option value={650}>Move in/out Cleaning</option>
                            <option value={800}>Office Cleaning</option>
                        </select>
                    </div>

                    <!-- Complexity -->
                    <div class="form-group">
                        <label class="form-label">Complexity</label>
                        <select class="form-select" bind:value={complexity}>
                            <option value={0}>Select...</option>
                            <option value={200}>Deep cleaning</option>
                            <option value={150}>Small Maintenance</option>
                            <option value={220}>Window Cleaning</option>
                        </select>
                    </div>

                    <!-- Square Footage Slider -->
                    <div class="form-group">
                        <label class="form-label">Square Footage</label>
                        <div class="slider-container">
                            <div class="slider-wrapper">
                                <input
                                    type="range"
                                    class="slider"
                                    bind:value={squareFootage}
                                    min="0"
                                    max="200"
                                    step="1"
                                />
                                <span
                                    class="slider-value"
                                    style="left: calc({sliderPercentage() *
                                        100}% + {20 -
                                        sliderPercentage() * 40}px);"
                                    >{squareFootage}</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Cleaning Supplies Toggle -->
                    <div class="form-group">
                        <label class="form-label">Cleaning Supplies</label>
                        <div class="toggle-container">
                            <label class="toggle-switch">
                                <input
                                    type="checkbox"
                                    bind:checked={cleaningSupplies}
                                />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Total -->
                    <div class="total-section">
                        <span class="total-label">TOTAL</span>
                        <div>
                            <span class="total-currency">$</span>
                            <span class="total-amount"
                                >{total().toFixed(2)}</span
                            >
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column - Cleaning Lady Image -->
            <div
                class="hidden xl:flex justify-start items-end relative -ml-24 -mt-10"
            >
                <img
                    src="/images/image_06_home_01.png"
                    alt="Professional cleaner"
                    class="max-w-[369px] relative z-10"
                    loading="lazy"
                />

                <!-- Floating Bubble 3 -->
                <div class="floating-image floating-bubble-3 hidden 2xl:block">
                    <img
                        src="/images/floating_image_02.png"
                        alt=""
                        width="160"
                        height="160"
                    />
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    /* Main Section */
    .estimate-section {
        max-width: 1800px;
        margin: 0 auto;
        position: relative;
    }

    /* Background Row with Image */
    .background-row {
        background-image: url("/images/bg-5.webp");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 40px;
        position: relative;
        overflow: visible;
    }

    /* Floating Images */
    .floating-image {
        position: absolute;
        z-index: 5;
        transition: transform 0.3s ease-out;
    }

    .floating-bubble-1 {
        top: 65%;
        left: 4em;
    }

    .floating-bubble-2 {
        top: 40%;
        left: 20em;
    }

    .floating-bubble-3 {
        right: 6em;
        top: 37%;
    }

    /* Form Card */
    .form-card {
        background-color: #ffffff;
        border-radius: 60px;
        padding: 40px;
        position: relative;
    }

    /* Form Elements */
    .form-label {
        font-size: 0.7rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #252525;
        margin-bottom: 0.5rem;
        display: block;
    }

    .form-select {
        width: 100%;
        padding: 0.875rem 0;
        border: none;
        border-bottom: 1px solid #e5e7eb;
        border-radius: 0;
        font-family: "Inter", sans-serif;
        font-size: 1rem;
        color: #252525;
        background-color: transparent;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0 center;
        background-size: 1.25rem;
        cursor: pointer;
        transition: border-color 0.2s ease;
    }

    .form-select:focus {
        outline: none;
        border-bottom-color: var(--color-alternate, #1384e2);
    }

    .form-group {
        margin-bottom: 1.75rem;
    }

    /* Slider */
    .slider-container {
        padding: 1rem 0 0.5rem 0;
        position: relative;
    }

    .slider-wrapper {
        position: relative;
        width: 100%;
    }

    .slider {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background: #e5e7eb;
        outline: none;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--color-accent, #e82374);
        cursor: pointer;
        position: relative;
        z-index: 2;
    }

    .slider::-moz-range-thumb {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--color-accent, #e82374);
        cursor: pointer;
        border: none;
    }

    .slider-value {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        background: transparent;
        color: white;
        margin-top: 4.5px;
        font-size: 0.75rem;
        font-weight: 600;
        white-space: nowrap;
        pointer-events: none;
        z-index: 10;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Toggle Switch */
    .toggle-container {
        display: flex;
        align-items: center;
    }

    .toggle-switch {
        position: relative;
        width: 60px;
        height: 32px;
        display: inline-block;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #e5e7eb;
        transition: 0.3s;
        border-radius: 32px;
    }

    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 24px;
        width: 24px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch input:checked + .toggle-slider {
        background-color: var(--color-alternate, #1384e2);
    }

    .toggle-switch input:checked + .toggle-slider:before {
        transform: translateX(28px);
    }

    /* Total Section */
    .total-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1.5rem;
        padding: 1rem 1.5rem;
        background-color: var(--color-accent, #e82374);
        border-radius: 50px;
    }

    .total-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: white;
    }

    .total-amount {
        font-size: 1.5rem;
        font-weight: 600;
        color: white;
    }

    .total-currency {
        font-size: 1.5rem;
        font-weight: 500;
        color: white;
        margin-right: 0.25rem;
    }

    /* Extended link */
    .extended-link {
        color: var(--color-alternate, #1384e2);
        text-decoration: none;
        font-weight: 500;
    }

    .extended-link:hover {
        text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 1200px) {
        .form-card {
            padding: 40px;
        }
    }

    @media (max-width: 992px) {
        .form-card {
            padding: 20px;
        }

        .floating-image {
            display: none;
        }
    }
</style>
