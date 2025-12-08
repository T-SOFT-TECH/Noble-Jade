<script lang="ts">
    // AboutWhyChooseUs - "What Makes Us Different" section
    // Displays key differentiators with pink checkmark icons
</script>

<section
    class="about-why-choose-us w-full px-4 md:px-8 lg:px-12 py-16 md:py-24"
>
    <div class="max-w-[1200px] mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
            <span
                class="superheadline text-accent uppercase tracking-wider text-sm font-medium"
            >
                WHY CHOOSE US
            </span>
            <h2
                class="text-3xl md:text-4xl lg:text-5xl font-semibold mt-3 text-theme-primary"
            >
                What Makes Us Different
            </h2>
        </div>

        <!-- Features Grid - 3 columns on large screens -->
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
        >
            <!-- Safety First -->
            <div class="feature-item flex items-start gap-4">
                <div class="icon-wrapper shrink-0">
                    <svg
                        class="w-5 h-5 text-accent"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                        />
                    </svg>
                </div>
                <div class="content">
                    <h3 class="text-2xl font-semibold text-theme-primary mb-2">
                        Safety First
                    </h3>
                    <p
                        class="text-theme-secondary opacity-70 text-base leading-relaxed"
                    >
                        We're insured and bonded so you're always safe!
                        Insurance covers up to $1M. At Qleen safety comes first.
                    </p>
                </div>
            </div>

            <!-- Satisfaction Guarantee -->
            <div class="feature-item flex items-start gap-4">
                <div class="icon-wrapper shrink-0">
                    <svg
                        class="w-5 h-5 text-accent"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                        />
                    </svg>
                </div>
                <div class="content">
                    <h3 class="text-2xl font-semibold text-theme-primary mb-2">
                        Satisfaction Guarantee
                    </h3>
                    <p
                        class="text-theme-secondary opacity-70 text-base leading-relaxed"
                    >
                        If you're not happy, contact us within 24 hours and
                        we'll come back and fix it. Still not happy? We'll
                        refund you completely.
                    </p>
                </div>
            </div>

            <!-- Customer Care -->
            <div class="feature-item flex items-start gap-4">
                <div class="icon-wrapper shrink-0">
                    <svg
                        class="w-5 h-5 text-accent"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                        />
                    </svg>
                </div>
                <div class="content">
                    <h3 class="text-2xl font-semibold text-theme-primary mb-2">
                        Customer Care
                    </h3>
                    <p
                        class="text-theme-secondary opacity-70 text-base leading-relaxed"
                    >
                        You can reach us by phone, through contact form or via
                        social media almost anytime and get a response super
                        fast.
                    </p>
                </div>
            </div>

            <!-- Trusted Cleaners -->
            <div class="feature-item flex items-start gap-4">
                <div class="icon-wrapper shrink-0">
                    <svg
                        class="w-5 h-5 text-accent"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                        />
                    </svg>
                </div>
                <div class="content">
                    <h3 class="text-2xl font-semibold text-theme-primary mb-2">
                        Trusted Cleaners
                    </h3>
                    <p
                        class="text-theme-secondary opacity-70 text-base leading-relaxed"
                    >
                        Trust is our paramount value. All of our employees go
                        through work authorization check.
                    </p>
                </div>
            </div>

            <!-- Fair Prices -->
            <div class="feature-item flex items-start gap-4">
                <div class="icon-wrapper shrink-0">
                    <svg
                        class="w-5 h-5 text-accent"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                        />
                    </svg>
                </div>
                <div class="content">
                    <h3 class="text-2xl font-semibold text-theme-primary mb-2">
                        Fair Prices
                    </h3>
                    <p
                        class="text-theme-secondary opacity-70 text-base leading-relaxed"
                    >
                        From a light refresh to a deep clean, we tailor every
                        service to your needs and budget. You'll never pay for
                        more than you need.
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .about-why-choose-us {
        background: var(--color-bg-secondary);
    }

    .superheadline {
        color: var(--color-accent);
    }

    .icon-wrapper {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
    }
</style>
