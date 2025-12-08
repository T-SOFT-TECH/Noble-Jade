<script>
    import PageHero from "$lib/components/shared/PageHero.svelte";
    import CostCalculator from "$lib/components/quote/CostCalculator.svelte";
    import TestimonialsCarousel from "$lib/components/home/TestimonialsCarousel.svelte";
    import FAQSection from "$lib/components/home/FAQSection.svelte";
    import QuoteCTA from "$lib/components/quote/QuoteCTA.svelte";
</script>

<svelte:head>
    <title>Get A Quote - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="Get a detailed estimate for your cleaning needs. Use our cost calculator to estimate your home or office cleaning service."
    />
</svelte:head>

<div class="quote-page">
    <PageHero
        title="get quote"
        textColor="text-white/20"
        heroImage="/wp-content/uploads/sites/3/2025/07/image_01_quote.png"
        heroImageAlt="Cleaning bucket"
        backgroundImage="/images/get-quote-hero.webp"
        overlayColor="rgba(10, 60, 120, 0.7)"
        testimonial={{
            imageSrc: "/images/credentials_home_01.png",
            text: "Trusted by",
            highlight: "200+ clients",
        }}
    />

    <!-- Cost Calculator Section -->
    <CostCalculator />

    <!-- Testimonials Section -->
    <TestimonialsCarousel />

    <!-- FAQ Section -->
    <FAQSection />

    <!-- Contact CTA Section -->
    <QuoteCTA />
</div>

<style>
    .quote-page {
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }
</style>
