<script lang="ts">
    import MiniStatsCard from "$lib/components/shared/MiniStatsCard.svelte";
</script>

<!-- About Stats Section - 3 column layout -->
<section class="py-16 bg-theme-primary w-full">
    <div class="max-w-[1400px] mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <!-- Stat 1: Insured -->
            <div class="text-center md:text-left">
                <span class="text-5xl md:text-6xl font-bold text-alternate">
                    2M
                </span>
                <h3 class="text-xl font-semibold text-theme-primary mt-2">
                    Insured up to $2M
                </h3>
                <p class="text-theme-secondary mt-2">
                    Your home&office are safe with us
                </p>
            </div>

            <!-- Stat 2: Satisfaction Rate -->
            <div class="text-center md:text-left">
                <span class="text-5xl md:text-6xl font-bold text-alternate">
                    96%
                </span>
                <h3 class="text-xl font-semibold text-theme-primary mt-2">
                    Satisfaction Rate
                </h3>
                <p class="text-theme-secondary mt-2">
                    Based on 356 reviews on Google
                </p>
            </div>

            <!-- Stat 3: Pink MiniStatsCard with curved arrow on right -->
            <div class="w-full">
                <MiniStatsCard
                    stat="80%"
                    title="Clients Rebook Monthly"
                    href="/booking"
                    buttonText="Book Now"
                    bgColor="bg-accent"
                />
            </div>
        </div>
    </div>
</section>
