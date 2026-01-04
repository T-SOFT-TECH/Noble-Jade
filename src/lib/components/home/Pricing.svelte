<script lang="ts">
    import { onMount } from "svelte";
    import {
        getPricingPackages,
        type PricingPackage,
    } from "$lib/services/content";

    // Pricing packages - will be loaded from database
    let packages = $state<PricingPackage[]>([]);
    let isLoading = $state(true);

    // Default packages as fallback
    const defaultPackages: PricingPackage[] = [
        {
            id: "1",
            name: "Fresh Start",
            label: "Basic Package",
            description: "Light maintenance, small apartments, regular upkeep",
            price: 90,
            priceNote: "(up to 2 bed / 1 bath)",
            features: [
                "Dusting all surfaces",
                "Vacuuming & mopping floors",
                "Kitchen wipe-down",
                "Bathroom cleaning",
                "Trash removal",
            ],
            isPopular: false,
            isActive: true,
            sortOrder: 1,
        },
        {
            id: "2",
            name: "Comfort Clean",
            label: "Standard Package",
            description: "Families, regular home care, busy professionals",
            price: 130,
            priceNote: "(up to 3 bed / 2 bath)",
            features: [
                "Make beds/change linens",
                "Inside microwave",
                "Baseboard wipe-down",
                "Spot wall cleaning",
                "Ceiling fan dusting",
            ],
            isPopular: true,
            isActive: true,
            sortOrder: 2,
        },
        {
            id: "3",
            name: "Deep Refresh",
            label: "Premium Package",
            description: "Seasonal deep clean, first-time clients, post-event",
            price: 180,
            priceNote: "(up to 3 bed / 2 bath)",
            features: [
                "Inside oven & fridge",
                "Inside cabinets",
                "Window interiors (up to 10)",
                "Detailed baseboards & molding",
                "Garage sweep",
            ],
            isPopular: false,
            isActive: true,
            sortOrder: 3,
        },
    ];

    onMount(async () => {
        try {
            const data = await getPricingPackages();
            packages = data.length > 0 ? data : defaultPackages;
            console.log(
                "[Pricing] Loaded",
                packages.length,
                "packages from database",
            );
        } catch (error) {
            console.error("[Pricing] Error loading packages:", error);
            packages = defaultPackages;
        } finally {
            isLoading = false;
        }
    });

    // Get included text based on package position
    function getIncludedText(index: number): string {
        if (index === 0) return "What's included:";
        if (index === 1) return "Includes Basic, plus:";
        return "Includes Standard, plus:";
    }
</script>

<section class="py-12 md:py-20 bg-theme-secondary w-full mx-auto rounded-[40px]">
    <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="text-center mb-8">
            <p class="text-accent uppercase tracking-wider mb-2">
                What we offer
            </p>
            <h2 class="text-3xl md:text-6xl text-theme-primary py-6">
                Choose One Of Our Packages
            </h2>
        </div>

        <!-- Features Row -->
        <div class="flex flex-wrap justify-center gap-4 lg:gap-8 mb-12">
            <div class="flex items-center gap-2">
                <span class="text-accent">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M5 13l4 4L19 7" />
                    </svg>
                </span>
                <span class="text-theme-primary text-xl">Reliable</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-accent">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M5 13l4 4L19 7" />
                    </svg>
                </span>
                <span class="text-theme-primary text-xl">Affordable</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-accent">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M5 13l4 4L19 7" />
                    </svg>
                </span>
                <span class="text-theme-primary text-xl">Professional</span>
            </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {#each packages as pkg, index}
                <div
                    class="glass rounded-2xl p-8 flex flex-col relative {pkg.isPopular
                        ? 'border-2 border-accent'
                        : ''}"
                >
                    {#if pkg.isPopular}
                        <div
                            class="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium"
                        >
                            Most Popular
                        </div>
                    {/if}
                    <div class="mb-4">
                        <span
                            class="text-accent text-sm font-medium uppercase tracking-wider"
                            >{pkg.label}</span
                        >
                    </div>
                    <h3 class="text-2xl font-bold text-theme-primary mb-2">
                        {pkg.name}
                    </h3>
                    <p class="text-theme-secondary mb-6">
                        {pkg.description}
                    </p>

                    <div class="mb-6">
                        <span class="text-4xl font-bold text-theme-primary"
                            >${pkg.price}</span
                        >
                        <span class="text-theme-secondary">/visit</span>
                        <p class="text-sm text-theme-secondary mt-1">
                            {pkg.priceNote}
                        </p>
                    </div>

                    <a
                        href="/pricing"
                        class="{pkg.isPopular
                            ? 'btn-accent'
                            : 'btn-outline'} w-full text-center mb-6"
                        >Continue</a
                    >

                    <div class="mt-auto">
                        <span class="text-sm font-medium text-theme-primary"
                            >{getIncludedText(index)}</span
                        >
                        <ul class="mt-3 space-y-2 text-theme-secondary text-sm">
                            {#each pkg.features as feature}
                                <li class="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        class="text-accent shrink-0"
                                    >
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
