<script>
    import AboutHero from "$lib/components/about/AboutHero.svelte";
    import AboutMission from "$lib/components/about/AboutMission.svelte";
    import AboutStats from "$lib/components/about/AboutStats.svelte";
    import AboutFeatures from "$lib/components/about/AboutFeatures.svelte";
    import AboutServices from "$lib/components/about/AboutServices.svelte";
    import AboutWhyChooseUs from "$lib/components/about/AboutWhyChooseUs.svelte";
    import ReviewSection from "$lib/components/home/ReviewSection.svelte";
    import AboutTestimonials from "$lib/components/about/AboutTestimonials.svelte";
    import CTABanner from "$lib/components/home/CTABanner.svelte";
</script>

<svelte:head>
    <title>About Us - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="Learn about Noble Jade Cleaning Services. Our trusted team of certified cleaners delivers premium cleaning with eco-friendly products and 96% satisfaction rate."
    />
</svelte:head>

<AboutHero />

<AboutMission />
<AboutStats />
<AboutFeatures />
<AboutServices />
<AboutWhyChooseUs />
<ReviewSection />
<AboutTestimonials />
<div class="mr-12 mb-16">
    <CTABanner
        imageSrc="/images/spray-bottle.webp"
        imageAlt="Hand holding cleaning spray bottle"
        imagePosition="bottom"
    />
</div>
