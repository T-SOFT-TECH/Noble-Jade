<script lang="ts">
    // Footer component - Dark theme version for NJJS
    import { onMount } from "svelte";
    import { pb } from "$lib/pocketbase";
    import {
        defaultCompanyInfo,
        formatPhoneForLink,
        type CompanyInfo,
        type Location,
    } from "$lib/config/company";

    // Company data - will be loaded from database
    let company = $state<CompanyInfo>(defaultCompanyInfo);
    let primaryLocation = $state<Location>(defaultCompanyInfo.locations[0]);

    // Load company data from PocketBase
    onMount(async () => {
        try {
            // Fetch settings
            const settingsRecords = await pb
                .collection("settings")
                .getFullList();
            const settings: Record<string, any> = {};
            for (const record of settingsRecords) {
                settings[record.key] = record.value;
            }

            // Fetch locations
            const locationsRecords = await pb
                .collection("locations")
                .getFullList({
                    filter: "isActive = true",
                    sort: "sortOrder",
                });

            const locations: Location[] = locationsRecords.map((loc: any) => ({
                id: loc.id,
                name: loc.name,
                city: loc.city,
                province: loc.province,
                address: loc.address,
                postalCode: loc.postalCode,
                country: loc.country || "Canada",
                phone: loc.phone,
                email: loc.email,
                isPrimary: loc.isPrimary,
                sortOrder: loc.sortOrder,
                isActive: loc.isActive,
            }));

            company = {
                name: settings.company_name || defaultCompanyInfo.name,
                shortName:
                    settings.company_short_name || defaultCompanyInfo.shortName,
                tagline: settings.company_tagline || defaultCompanyInfo.tagline,
                email: settings.contact_email || defaultCompanyInfo.email,
                phone: settings.contact_phone || defaultCompanyInfo.phone,
                tollFree: settings.toll_free || defaultCompanyInfo.tollFree,
                website: settings.website_url || defaultCompanyInfo.website,
                socialLinks: {
                    facebook:
                        settings.social_facebook ||
                        defaultCompanyInfo.socialLinks.facebook,
                    instagram:
                        settings.social_instagram ||
                        defaultCompanyInfo.socialLinks.instagram,
                    twitter:
                        settings.social_twitter ||
                        defaultCompanyInfo.socialLinks.twitter,
                    linkedin:
                        settings.social_linkedin ||
                        defaultCompanyInfo.socialLinks.linkedin,
                },
                businessHours: {
                    weekdays:
                        settings.hours_weekdays ||
                        defaultCompanyInfo.businessHours.weekdays,
                    saturday:
                        settings.hours_saturday ||
                        defaultCompanyInfo.businessHours.saturday,
                    sunday:
                        settings.hours_sunday ||
                        defaultCompanyInfo.businessHours.sunday,
                },
                locations:
                    locations.length > 0
                        ? locations
                        : defaultCompanyInfo.locations,
            };

            primaryLocation =
                company.locations.find((loc) => loc.isPrimary) ||
                company.locations[0];

            console.log(
                "[Footer] Loaded company data from database:",
                company.phone,
            );
        } catch (error) {
            console.error("[Footer] Error loading company data:", error);
        }
    });
</script>

<footer
    class="relative bg-theme-tertiary text-theme-primary pt-16 pb-8 max-w-[1800px] mx-auto mb-6 rounded-[40px] overflow-hidden"
>
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
        <img
            src="/images/footer-image.webp"
            alt=""
            class="w-full h-full object-cover"
            loading="lazy"
        />
        <div class="absolute inset-0 bg-[rgba(14,94,206,0.5)]"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
        <!-- Top Section -->
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
            <!-- Column 1: Logo & Social -->
            <div>
                <div class="mb-6">
                    <img
                        src="/images/noble-jade-logo-2.webp"
                        alt="Noble Jade Janitorial Services"
                        class="h-16 w-auto"
                    />
                </div>
                <p class="text-white/80 text-base leading-relaxed mb-6">
                    At Noble Jade Janitorial Services, we treat every space with
                    care. Professional cleaning for homes and businesses.
                </p>
                <div class="flex gap-4">
                    {#if company.socialLinks.facebook}
                        <a
                            href={company.socialLinks.facebook}
                            target="_blank"
                            class="text-white/80 hover:text-accent transition-colors"
                            aria-label="Facebook"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                                />
                            </svg>
                        </a>
                    {/if}
                    {#if company.socialLinks.instagram}
                        <a
                            href={company.socialLinks.instagram}
                            target="_blank"
                            class="text-white/80 hover:text-accent transition-colors"
                            aria-label="Instagram"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect
                                    width="20"
                                    height="20"
                                    x="2"
                                    y="2"
                                    rx="5"
                                    ry="5"
                                />
                                <path
                                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                                />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                        </a>
                    {/if}
                    {#if company.socialLinks.twitter}
                        <a
                            href={company.socialLinks.twitter}
                            target="_blank"
                            class="text-white/80 hover:text-accent transition-colors"
                            aria-label="Twitter"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                                />
                            </svg>
                        </a>
                    {/if}
                    {#if company.socialLinks.linkedin}
                        <a
                            href={company.socialLinks.linkedin}
                            target="_blank"
                            class="text-white/80 hover:text-accent transition-colors"
                            aria-label="LinkedIn"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                                />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </a>
                    {/if}
                </div>
            </div>

            <!-- Column 2: Services -->
            <div>
                <h4 class="text-xl font-bold mb-6 text-white">Services</h4>
                <ul class="space-y-3 text-base text-white/80">
                    <li>
                        <a
                            href="/services/home-cleaning"
                            class="hover:text-accent transition-colors"
                            >Home Cleaning</a
                        >
                    </li>
                    <li>
                        <a
                            href="/services/office-cleaning"
                            class="hover:text-accent transition-colors"
                            >Office Cleaning</a
                        >
                    </li>
                    <li>
                        <a
                            href="/services/deep-cleaning"
                            class="hover:text-accent transition-colors"
                            >Deep Cleaning</a
                        >
                    </li>
                    <li>
                        <a
                            href="/services/prices"
                            class="hover:text-accent transition-colors"
                            >View Pricing</a
                        >
                    </li>
                </ul>
            </div>

            <!-- Column 3: Info -->
            <div>
                <h4 class="text-xl font-bold mb-6 text-white">Quick Links</h4>
                <ul class="space-y-3 text-base text-white/80">
                    <li>
                        <a
                            href="/about"
                            class="hover:text-accent transition-colors"
                            >About Us</a
                        >
                    </li>
                    <li>
                        <a
                            href="/testimonials"
                            class="hover:text-accent transition-colors"
                            >Testimonials</a
                        >
                    </li>
                    <li>
                        <a
                            href="/blog"
                            class="hover:text-accent transition-colors">Blog</a
                        >
                    </li>
                    <li>
                        <a
                            href="/get-quote"
                            class="hover:text-accent transition-colors"
                            >Get a Quote</a
                        >
                    </li>
                </ul>
            </div>

            <!-- Column 4: Contact -->
            <div>
                <h4 class="text-xl font-bold mb-6 text-white">Contact</h4>
                <ul class="space-y-4 text-base text-white/80">
                    <li class="flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-accent shrink-0"
                        >
                            <path
                                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                            />
                        </svg>
                        <a
                            href="tel:{formatPhoneForLink(company.phone)}"
                            class="hover:text-accent transition-colors"
                            >{company.phone}</a
                        >
                    </li>
                    <li class="flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-accent shrink-0"
                        >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path
                                d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                            />
                        </svg>
                        <a
                            href="mailto:{company.email}"
                            class="hover:text-accent transition-colors"
                            >{company.email}</a
                        >
                    </li>
                    <li class="flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-accent shrink-0"
                        >
                            <path
                                d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
                            />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span
                            >{primaryLocation.city}, {primaryLocation.province}</span
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Large CTA Text -->
        <div class="text-center mb-12">
            <h2
                class="text-[10vw] lg:text-[12vw] font-black leading-none tracking-tight text-white/5 uppercase"
            >
                Contact Us
            </h2>
        </div>

        <!-- Bottom Bar -->
        <div
            class="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70"
        >
            <p>© 2025 Noble Jade Janitorial Services. All rights reserved.</p>
            <div class="flex gap-6">
                <a href="/privacy" class="hover:text-accent transition-colors"
                    >Privacy Policy</a
                >
                <a href="/terms" class="hover:text-accent transition-colors"
                    >Terms of Service</a
                >
            </div>
        </div>
    </div>
</footer>
