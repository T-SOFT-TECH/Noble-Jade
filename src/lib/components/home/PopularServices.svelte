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

<!-- Popular Services Section -->
<section class="py-20 bg-theme-background">
    <div class="container mx-auto px-4 max-w-6xl">
        <!-- Header -->
        <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-theme-dark">
                Popular Services
            </h2>
        </div>

        <!-- Service Cards Grid - Bento style -->
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
