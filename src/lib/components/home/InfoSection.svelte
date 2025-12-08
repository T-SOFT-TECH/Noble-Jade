<script>
    // InfoSection component - Dark theme version for NJJS
</script>

<section class="py-20 bg-theme-secondary w-full mx-auto rounded-[40px]">
    <div class="max-w-[1200px] mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <!-- FAQ Section -->
            <div>
                <div class="mb-10">
                    <p
                        class="text-accent font-medium uppercase tracking-wider mb-2"
                    >
                        FAQ
                    </p>
                    <h2 class="text-4xl font-bold text-theme-primary mb-4">
                        Questions? Look here.
                    </h2>
                    <p class="text-theme-secondary">
                        Can't find an answer? Call us at <span
                            class="font-bold text-theme-primary"
                            >(555) 123-4567</span
                        >
                        or email
                        <span class="font-bold text-theme-primary"
                            >info@njjs.com</span
                        >
                    </p>
                </div>

                <div class="mb-8">
                    <a href="/contact" class="btn-accent inline-block"
                        >Contact Us</a
                    >
                </div>

                <div class="space-y-4">
                    <details class="glass p-6 rounded-xl group">
                        <summary
                            class="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-theme-primary"
                        >
                            What services do you offer?
                            <span
                                class="transition-transform group-open:rotate-180 text-accent"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </span>
                        </summary>
                        <p class="mt-4 text-theme-secondary">
                            We offer residential cleaning, office cleaning, move
                            in/out cleaning, deep cleaning, and recurring
                            maintenance services.
                        </p>
                    </details>
                    <details class="glass p-6 rounded-xl group">
                        <summary
                            class="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-theme-primary"
                        >
                            How long will cleaning take?
                            <span
                                class="transition-transform group-open:rotate-180 text-accent"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </span>
                        </summary>
                        <p class="mt-4 text-theme-secondary">
                            Depending on the size of your space and the type of
                            cleaning, most jobs take 2-4 hours. We'll give you
                            an accurate estimate during booking.
                        </p>
                    </details>
                    <details class="glass p-6 rounded-xl group">
                        <summary
                            class="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-theme-primary"
                        >
                            Are your cleaners background checked?
                            <span
                                class="transition-transform group-open:rotate-180 text-accent"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </span>
                        </summary>
                        <p class="mt-4 text-theme-secondary">
                            Yes! All our team members undergo thorough
                            background checks and are fully trained in our
                            cleaning standards.
                        </p>
                    </details>
                </div>
            </div>

            <!-- Testimonials Section -->
            <div>
                <div class="mb-10">
                    <p
                        class="text-accent font-medium uppercase tracking-wider mb-2"
                    >
                        Satisfaction survey
                    </p>
                    <h2 class="text-4xl font-bold text-theme-primary mb-4">
                        What Our Clients Think
                    </h2>
                </div>

                <!-- Rating Widget -->
                <div class="glass p-6 rounded-xl mb-8 flex items-center gap-4">
                    <div class="flex text-yellow-400 gap-1">
                        {#each Array(5) as _}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="none"
                            >
                                <polygon
                                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                />
                            </svg>
                        {/each}
                    </div>
                    <span class="font-bold text-xl text-theme-primary">4.9</span
                    >
                    <span class="text-theme-secondary">Google Rating</span>
                </div>

                <!-- Stats -->
                <div class="space-y-6 mb-10">
                    <div>
                        <div
                            class="flex justify-between mb-2 font-bold text-theme-primary"
                        >
                            <span>Punctuality of cleaners</span>
                            <span>98%</span>
                        </div>
                        <div
                            class="h-2 bg-theme-tertiary rounded-full overflow-hidden"
                        >
                            <div class="h-full bg-alternate w-[98%]"></div>
                        </div>
                    </div>
                    <div>
                        <div
                            class="flex justify-between mb-2 font-bold text-theme-primary"
                        >
                            <span>Quality of cleaning</span>
                            <span>96%</span>
                        </div>
                        <div
                            class="h-2 bg-theme-tertiary rounded-full overflow-hidden"
                        >
                            <div class="h-full bg-alternate w-[96%]"></div>
                        </div>
                    </div>
                    <div>
                        <div
                            class="flex justify-between mb-2 font-bold text-theme-primary"
                        >
                            <span>Respect for your home</span>
                            <span>100%</span>
                        </div>
                        <div
                            class="h-2 bg-theme-tertiary rounded-full overflow-hidden"
                        >
                            <div class="h-full bg-alternate w-full"></div>
                        </div>
                    </div>
                </div>

                <a href="/testimonials" class="btn-accent inline-block"
                    >View All Reviews</a
                >
            </div>
        </div>
    </div>
</section>
