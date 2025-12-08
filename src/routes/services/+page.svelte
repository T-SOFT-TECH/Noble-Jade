<script>
    import ServicesHero from "$lib/components/services/ServicesHero.svelte";
    import MainServices from "$lib/components/services/MainServices.svelte";
    import ServicesExtras from "$lib/components/services/ServicesExtras.svelte";
    import ServicesPackages from "$lib/components/services/ServicesPackages.svelte";
    import DiscountCards from "$lib/components/services/DiscountCards.svelte";
    import RecurringServices from "$lib/components/services/RecurringServices.svelte";
    import CTABanner from "$lib/components/home/CTABanner.svelte";
</script>

<svelte:head>
    <title>Services - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="Explore our professional cleaning services. From routine home cleanings to deep office cleans and move-in/move-out services, we tailor every job to your needs."
    />
</svelte:head>

<div class="services-page">
    <ServicesHero
        backgroundImage="/images/hero_services.webp"
        testimonial={{
            imageSrc: "/images/credentials_home_01.png",
            text: "Trusted by",
            highlight: "200+ clients",
        }}
    />

    <MainServices />

    <ServicesExtras />

    <ServicesPackages />

    <RecurringServices />

    <div class="cta-wrapper">
        <CTABanner />
    </div>
</div>
<DiscountCards />

<style>
    .services-page {
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    .cta-wrapper {
        margin-bottom: 4rem;
    }
</style>
