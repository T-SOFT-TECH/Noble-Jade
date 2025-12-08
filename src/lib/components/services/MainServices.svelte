<script lang="ts">
    import ServiceCard from "$lib/components/shared/ServiceCard.svelte";
    import ServiceCardLeft from "$lib/components/shared/ServiceCardLeft.svelte";
</script>

{#snippet moveInOutIcon()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 72 72"
        fill="none"
        class="w-16 h-16"
    >
        <!-- Truck/moving icon -->
        <rect
            x="8"
            y="28"
            width="40"
            height="26"
            rx="3"
            stroke="white"
            stroke-width="2"
            fill="none"
        />
        <path
            d="M48 38H60L66 48V54H48V38Z"
            stroke="white"
            stroke-width="2"
            fill="none"
        />
        <circle
            cx="20"
            cy="54"
            r="6"
            stroke="white"
            stroke-width="2"
            fill="none"
        />
        <circle
            cx="56"
            cy="54"
            r="6"
            stroke="white"
            stroke-width="2"
            fill="none"
        />
        <path d="M16 28V20H36V28" stroke="white" stroke-width="2" fill="none" />
        <path d="M22 20V14H30V20" stroke="white" stroke-width="2" fill="none" />
    </svg>
{/snippet}

{#snippet homeCleaningIcon()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 72 72"
        fill="none"
        class="w-16 h-16"
    >
        <!-- House with sparkles icon -->
        <path
            d="M36 12L8 36H16V58H56V36H64L36 12Z"
            stroke="white"
            stroke-width="2"
            fill="none"
        />
        <rect
            x="28"
            y="40"
            width="16"
            height="18"
            stroke="white"
            stroke-width="2"
            fill="none"
        />
        <path
            d="M50 18L52 22L56 24L52 26L50 30L48 26L44 24L48 22L50 18Z"
            fill="white"
        />
        <path
            d="M58 8L59 11L62 12L59 13L58 16L57 13L54 12L57 11L58 8Z"
            fill="white"
        />
    </svg>
{/snippet}

{#snippet officeCleaningIcon()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 72 72"
        fill="none"
        class="w-16 h-16"
    >
        <!-- Desk/office icon -->
        <rect
            x="12"
            y="24"
            width="48"
            height="4"
            stroke="white"
            stroke-width="2"
            fill="none"
        />
        <path d="M16 28V56" stroke="white" stroke-width="2" />
        <path d="M56 28V56" stroke="white" stroke-width="2" />
        <rect
            x="20"
            y="14"
            width="32"
            height="10"
            rx="2"
            stroke="white"
            stroke-width="2"
            fill="none"
        />
        <rect
            x="26"
            y="32"
            width="20"
            height="12"
            stroke="white"
            stroke-width="2"
            fill="none"
        />
        <path d="M36 32V44" stroke="white" stroke-width="2" />
    </svg>
{/snippet}

<!-- Services Main Section - Intro text, checkmarks, and service cards -->
<section class="py-16 px-4 bg-theme-background">
    <div class="max-w-[1200px] mx-auto">
        <!-- Intro Text -->
        <div class="text-center mb-8 max-w-3xl mx-auto">
            <h2
                class="text-2xl md:text-3xl lg:text-4xl font-heading italic text-theme-primary leading-relaxed"
            >
                From routine home cleanings to deep office cleans and
                move-in/move-out services, we tailor every job to your needs.
            </h2>
        </div>

        <!-- Checkmarks Row -->
        <div
            class="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-12"
        >
            <div class="flex items-center gap-2">
                <svg
                    class="w-5 h-5 text-accent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    />
                </svg>
                <span class="text-theme-primary font-medium"
                    >Background checked cleaners</span
                >
            </div>
            <div class="flex items-center gap-2">
                <svg
                    class="w-5 h-5 text-accent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    />
                </svg>
                <span class="text-theme-primary font-medium"
                    >Insurance coverage up to $1M</span
                >
            </div>
            <div class="flex items-center gap-2">
                <svg
                    class="w-5 h-5 text-accent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    />
                </svg>
                <span class="text-theme-primary font-medium"
                    >No Contracts or Commitments</span
                >
            </div>
        </div>

        <!-- Service Cards Grid - Bento style (matching PopularServices) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Column 1: Tall Image + ServiceCardLeft -->
            <div class="flex flex-col gap-5">
                <img
                    src="/wp-content/uploads/sites/3/2025/07/image_01_home_01.jpg"
                    alt="Move In/Out Cleaning"
                    class="w-full h-[500px] object-cover rounded-3xl"
                />
                <div class="shrink-0">
                    <ServiceCardLeft
                        title="Move In/Out Cleaning"
                        description="Thorough cleaning to ensure your space is ready for its next chapter."
                        href="/services/move-in-out"
                        bgColor="bg-alternate"
                        icon={moveInOutIcon}
                    />
                </div>
            </div>

            <!-- Column 2: ServiceCard + Tall Image -->
            <div class="flex flex-col gap-5">
                <div class="shrink-0">
                    <ServiceCard
                        title="Home Cleaning"
                        description="Customized solutions, from deep cleaning to routine maintenance."
                        href="/services/home"
                        bgColor="bg-alternate"
                        icon={homeCleaningIcon}
                    />
                </div>
                <img
                    src="/wp-content/uploads/sites/3/2025/07/image_05_home_01.jpg"
                    alt="Home Cleaning"
                    class="w-full h-[500px] object-cover rounded-3xl"
                />
            </div>

            <!-- Column 3: Tall Image + ServiceCard -->
            <div class="flex flex-col gap-5">
                <img
                    src="/wp-content/uploads/sites/3/2025/07/image_04_home_01.jpg"
                    alt="Office Cleaning"
                    class="w-full h-[500px] object-cover rounded-3xl"
                />
                <div class="shrink-0">
                    <ServiceCard
                        title="Office Cleaning"
                        description="Expert services to keep your workspace clean and productive."
                        href="/services/office"
                        bgColor="bg-alternate"
                        icon={officeCleaningIcon}
                    />
                </div>
            </div>
        </div>
    </div>
</section>
