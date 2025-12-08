<script lang="ts">
    // Footer component - Dark theme version for NJJS
    import {
        companyInfo,
        getPrimaryLocation,
        formatPhoneForLink,
    } from "$lib/config/company";

    const primaryLocation = getPrimaryLocation();
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
                    <a
                        href={companyInfo.socialLinks.facebook}
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
                    <a
                        href={companyInfo.socialLinks.instagram}
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
                            href="tel:{formatPhoneForLink(companyInfo.phone)}"
                            class="hover:text-accent transition-colors"
                            >{companyInfo.phone}</a
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
                            href="mailto:{companyInfo.email}"
                            class="hover:text-accent transition-colors"
                            >{companyInfo.email}</a
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
