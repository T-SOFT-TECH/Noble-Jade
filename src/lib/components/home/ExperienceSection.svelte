<script>
    import StatsCard from "$lib/components/shared/StatsCard.svelte";

    const features = [
        {
            title: "Trust",
            description:
                "Trust is our paramount value. All of employees go through work authorization check.",
        },
        {
            title: "Quality",
            description:
                "Excellent performance, flat rates, no surprises. Five star rating on Google.",
        },
        {
            title: "Care",
            description:
                "Average response time is less than 10 minutes. You can call, e-mail, text or message us.",
        },
        {
            title: "People",
            description:
                "We pay good wages, health benefits and retirement, and abide by the laws.",
        },
    ];
</script>

<section class="py-12 md:py-24 bg-theme-background">
    <div class="container mx-auto px-4 max-w-6xl">
        <!-- Header -->
        <div class="text-center mb-10 md:mb-16">
            <h5
                class="text-accent uppercase tracking-widest font-medium text-sm mb-4 font-sans"
            >
                Your satisfaction is our priority
            </h5>
            <h2
                class="text-3xl md:text-[42px] font-medium text-theme-dark font-heading leading-tight"
            >
                Experience The Magic Of Qleen
            </h2>
        </div>

        <!-- Content: 4-column grid -->
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 items-start"
        >
            <!-- Features: Each takes 1 column (total 2 columns for 4 features in 2x2) -->
            {#each features as feature}
                <div class="flex gap-4">
                    <div class="shrink-0 mt-0.5">
                        <div
                            class="w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-3 h-3 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3
                            class="text-lg font-semibold text-theme-dark font-heading mb-2"
                        >
                            {feature.title}
                        </h3>
                        <p class="text-theme-muted leading-relaxed text-sm">
                            {feature.description}
                        </p>
                    </div>
                </div>
            {/each}

            <!-- StatsCard: Takes 2 columns, stretches full height of grid -->
            <div
                class="md:col-span-2 lg:row-span-2 lg:row-start-1 lg:col-start-3 h-full"
            >
                <StatsCard
                    stat="80%"
                    title="Clients Rebook Monthly"
                    href="/services"
                    buttonText="Book Now"
                    bgColor="bg-alternate"
                    imageSrc="/images/hand_pink_glove.png"
                    imageAlt="Hand in pink glove"
                />
            </div>
        </div>
    </div>
</section>
