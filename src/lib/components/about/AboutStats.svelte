<script lang="ts">
    import { onMount } from "svelte";
    import MiniStatsCard from "$lib/components/shared/MiniStatsCard.svelte";
    import { getStatistics, type Statistic } from "$lib/services/content";

    let stats = $state<Statistic[]>([]);
    let isLoading = $state(true);

    // Default stats as fallback
    const defaultStats: Statistic[] = [
        {
            id: "1",
            key: "insured",
            value: "2M",
            label: "Insured up to $2M",
            icon: "shield",
            sortOrder: 1,
        },
        {
            id: "2",
            key: "satisfaction",
            value: "96%",
            label: "Satisfaction Rate",
            icon: "star",
            sortOrder: 2,
        },
        {
            id: "3",
            key: "rebook",
            value: "80%",
            label: "Clients Rebook Monthly",
            icon: "repeat",
            sortOrder: 3,
        },
    ];

    onMount(async () => {
        try {
            const data = await getStatistics();
            stats = data.length > 0 ? data : defaultStats;
            console.log(
                "[AboutStats] Loaded",
                stats.length,
                "statistics from database",
            );
        } catch (error) {
            console.error("[AboutStats] Error loading statistics:", error);
            stats = defaultStats;
        } finally {
            isLoading = false;
        }
    });
</script>

<!-- About Stats Section - 3 column layout -->
<section class="py-16 bg-theme-primary w-full">
    <div class="max-w-[1400px] mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {#each stats as stat, index}
                {#if index < 2}
                    <!-- Regular stat cards -->
                    <div class="text-center md:text-left">
                        <span
                            class="text-5xl md:text-6xl font-bold text-alternate"
                        >
                            {stat.value}
                        </span>
                        <h3
                            class="text-xl font-semibold text-theme-primary mt-2"
                        >
                            {stat.label}
                        </h3>
                        <p class="text-theme-secondary mt-2">
                            {#if stat.key === "insured"}
                                Your home&office are safe with us
                            {:else if stat.key === "satisfaction"}
                                Based on 356 reviews on Google
                            {:else}
                                Trusted by our clients
                            {/if}
                        </p>
                    </div>
                {:else}
                    <!-- Pink MiniStatsCard for last stat -->
                    <div class="w-full">
                        <MiniStatsCard
                            stat={stat.value}
                            title={stat.label}
                            href="/booking"
                            buttonText="Book Now"
                            bgColor="bg-accent"
                        />
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</section>
