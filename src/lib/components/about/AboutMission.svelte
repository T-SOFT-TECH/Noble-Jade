<script lang="ts">
    import ImageCard from "$lib/components/shared/ImageCard.svelte";
</script>

<!-- About Mission Section -->
<section class="py-20 bg-theme-primary w-full">
    <div class="max-w-[1200px] mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center mb-16">
            <p class="text-accent font-medium uppercase tracking-wider mb-4">
                ABOUT US
            </p>
            <h2 class="text-4xl md:text-5xl font-bold text-theme-primary">
                We Make More Time For Your<br class="hidden md:block" />
                Favorite Activities
            </h2>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <!-- Left: ImageCard with Cleaner Photo -->
            <div class="flex justify-center lg:justify-start">
                <ImageCard
                    imageSrc="/images/image_02_about.jpg"
                    imageAlt="Professional cleaner with cleaning supplies"
                    badge={{
                        icon: "check",
                        number: "25+",
                        label: "Certified Cleaners",
                    }}
                    width="580px"
                    height="645px"
                />
            </div>

            <!-- Right: Quote and Text Content -->
            <div class="space-y-6">
                <!-- Quote Block -->
                <div class="flex gap-4">
                    <div
                        class="text-accent text-5xl font-serif leading-none shrink-0"
                    >
                        "
                    </div>
                    <p
                        class="text-xl md:text-2xl text-theme-primary leading-relaxed font-medium"
                    >
                        At Noble Jade, we believe a clean space is more than
                        just appearance, it's about comfort, clarity, and care.
                        Founded with a mission to bring a higher standard of
                        cleaning to homes, Noble Jade combines expert service
                        with a personal touch.
                    </p>
                </div>

                <!-- Description Paragraphs -->
                <p class="text-theme-secondary leading-relaxed">
                    Our team is made up of trained professionals who take pride
                    in what they do. We pay attention to the small details that
                    others overlook, using safe, eco-friendly products and
                    proven techniques to ensure your space isn't just clean, but
                    spotless.
                </p>

                <p class="text-theme-secondary leading-relaxed">
                    Whether you need regular house cleaning, detailed office
                    upkeep, or a one-time deep clean, we tailor our services to
                    meet your specific needs. We know that inviting someone into
                    your home or workplace is personal, so we go the extra mile
                    to earn your trust.
                </p>

                <p class="text-theme-secondary leading-relaxed">
                    With Noble Jade, it's not just about cleaning. It's about
                    delivering peace of mind—one sparkling room at a time.
                </p>

                <!-- CTA Button -->
                <div class="pt-4">
                    <a href="/booking" class="btn-accent text-base px-8 py-4">
                        Book Now
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
