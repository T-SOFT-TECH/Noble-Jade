<script lang="ts">
    import PageHero from "$lib/components/shared/PageHero.svelte";
</script>

<!-- About Page Hero - uses reusable PageHero component with background image -->
<PageHero
    title="about us"
    heroImage="/images/hero_about.png"
    heroImageAlt="Professional cleaning team"
    backgroundImage="/images/about-hero.webp"
    overlayColor="rgba(10, 60, 120, 0.8)"
    testimonial={{
        imageSrc: "/images/credentials_home_01.png",
        imageAlt: "Client credentials",
        text: "Trusted by",
        highlight: "200+ clients",
    }}
/>
