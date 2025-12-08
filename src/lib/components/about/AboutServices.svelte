<script lang="ts">
    import ImageServiceCard from "$lib/components/shared/ImageServiceCard.svelte";
</script>

<!-- About Services Section -->
<section class="py-16 bg-theme-primary w-full">
    <div class="max-w-[1200px] mx-auto px-4">
        <!-- Header Text -->
        <div class="text-center mb-8">
            <p
                class="text-2xl md:text-3xl font-medium text-theme-primary leading-relaxed max-w-3xl mx-auto italic"
            >
                From routine home cleanings to deep office cleans and
                move-in/move-out services, we tailor every job to your needs.
            </p>
        </div>

        <!-- Checkmarks Row -->
        <div class="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
            <div class="flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-accent"
                >
                    <path d="M20 6 9 17l-5-5" />
                </svg>
                <span class="text-theme-secondary"
                    >Background checked cleaners</span
                >
            </div>
            <div class="flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-accent"
                >
                    <path d="M20 6 9 17l-5-5" />
                </svg>
                <span class="text-theme-secondary"
                    >Insurance coverage up to $1M</span
                >
            </div>
            <div class="flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-accent"
                >
                    <path d="M20 6 9 17l-5-5" />
                </svg>
                <span class="text-theme-secondary"
                    >No Contracts or Commitments</span
                >
            </div>
        </div>

        <!-- Two Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Residential Cleaning Card (Pink) -->
            <ImageServiceCard
                title="Residential Cleaning"
                href="/services/residential"
                buttonText="Learn More"
                bgColor="bg-accent"
                imageSrc="/images/residential-building.webp"
                imageAlt="Residential cleaning service"
            />

            <!-- Commercial Cleaning Card (Blue) -->
            <ImageServiceCard
                title="Commercial Cleaning"
                href="/services/commercial"
                buttonText="Learn More"
                bgColor="bg-alternate"
                imageSrc="/images/commercial-building.webp"
                imageAlt="Commercial cleaning service"
            />
        </div>
    </div>
</section>
