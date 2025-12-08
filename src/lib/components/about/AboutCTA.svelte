<script lang="ts">
    import IconCard from "$lib/components/shared/IconCard.svelte";
</script>

{#snippet residentialIcon()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
{/snippet}

{#snippet commercialIcon()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
    </svg>
{/snippet}

<section class="py-20 bg-theme-primary">
    <div class="max-w-[1200px] mx-auto px-4">
        <!-- Centered Quote -->
        <div class="text-center mb-16 max-w-3xl mx-auto">
            <h3
                class="text-2xl md:text-3xl font-semibold text-theme-primary leading-relaxed"
            >
                From routine home cleanings to deep office cleans and
                move-in/move-out services, we tailor every job to your needs.
            </h3>
        </div>

        <!-- Service Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <!-- Residential Cleaning Card -->
            <IconCard
                title="Residential Cleaning"
                description="Complete home cleaning tailored to your lifestyle. Regular maintenance or deep cleaning, we've got you covered."
                href="/services#residential"
                bgColor="accent"
                buttonText="Book Now"
                icon={residentialIcon}
            />

            <!-- Commercial Cleaning Card -->
            <IconCard
                title="Commercial Cleaning"
                description="Professional office and commercial space cleaning. Keep your workspace spotless and productive."
                href="/services#commercial"
                bgColor="alternate"
                buttonText="Book Now"
                icon={commercialIcon}
            />
        </div>

        <!-- What Makes Us Different Section -->
        <div class="bg-theme-secondary rounded-[40px] p-8 md:p-12">
            <div class="text-center mb-12">
                <p
                    class="text-accent font-medium uppercase tracking-wider mb-2"
                >
                    GUARANTEE
                </p>
                <h2 class="text-3xl md:text-4xl font-bold text-theme-primary">
                    What Makes Us Different
                </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Feature 1 -->
                <div class="flex items-start gap-4">
                    <div
                        class="shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-accent"
                        >
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-theme-primary mb-1">
                            Same Day Service
                        </h4>
                        <p class="text-theme-secondary text-sm">
                            Available 7 days a week
                        </p>
                    </div>
                </div>

                <!-- Feature 2 -->
                <div class="flex items-start gap-4">
                    <div
                        class="shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-accent"
                        >
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-theme-primary mb-1">
                            Satisfaction Guaranteed
                        </h4>
                        <p class="text-theme-secondary text-sm">
                            100% money back guarantee
                        </p>
                    </div>
                </div>

                <!-- Feature 3 -->
                <div class="flex items-start gap-4">
                    <div
                        class="shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-accent"
                        >
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-theme-primary mb-1">
                            Licensed & Bonded
                        </h4>
                        <p class="text-theme-secondary text-sm">
                            Fully insured professionals
                        </p>
                    </div>
                </div>

                <!-- Feature 4 -->
                <div class="flex items-start gap-4">
                    <div
                        class="shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-accent"
                        >
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-theme-primary mb-1">
                            Vetted Cleaners
                        </h4>
                        <p class="text-theme-secondary text-sm">
                            Background checked staff
                        </p>
                    </div>
                </div>

                <!-- Feature 5 -->
                <div class="flex items-start gap-4">
                    <div
                        class="shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-accent"
                        >
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-theme-primary mb-1">
                            Flat Pricing
                        </h4>
                        <p class="text-theme-secondary text-sm">
                            No hidden fees ever
                        </p>
                    </div>
                </div>

                <!-- Feature 6 -->
                <div class="flex items-start gap-4">
                    <div
                        class="shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-accent"
                        >
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-theme-primary mb-1">
                            Eco Products
                        </h4>
                        <p class="text-theme-secondary text-sm">
                            Safe for family & pets
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
