<script lang="ts">
    /**
     * RecurringServices Section
     * Displays two RecurringServiceCard components for Office and Home Cleaning
     */
    import RecurringServiceCard from "./RecurringServiceCard.svelte";
</script>

<section class="recurring-services">
    <div class="container">
        <!-- Recurring Office Cleaning -->
        <RecurringServiceCard
            title="Recurring Office Cleaning"
            description="Our office cleaning service provides a clean, healthy, and professional workspace tailored to your needs. We offer flexible scheduling, eco-friendly products, and detailed cleaning of workspaces, common areas, restrooms, and kitchens."
            imageSrc="/wp-content/uploads/sites/3/2025/07/image_02_services.jpg"
            imageAlt="Office cleaning professional"
            price="$119"
            priceLabel="/per hour"
            features={[
                "Areas to clean (offices, lobbies, kitchens, restrooms, etc.)",
                "Frequency (daily, weekly, biweekly)",
                "Add-ons (carpet care, window cleaning, disinfection, etc.)",
            ]}
        />

        <!-- Recurring Home Cleaning -->
        <RecurringServiceCard
            title="Recurring Home Cleaning"
            description="No more spending weekends scrubbing floors. We've got a perfect solution for you: sign up for our recurring cleaning service – a worry-free, stress-free way to keep your home tidy and healthy."
            imageSrc="/wp-content/uploads/sites/3/2025/07/image_01_services.jpg"
            imageAlt="Home cleaning professional"
            price="$89"
            priceLabel="/per visit"
            features={[
                "Bathroom cleaning",
                "Vacuum and mop floors",
                "Dust and wipe down surfaces",
            ]}
        />
    </div>
</section>

<style>
    .recurring-services {
        padding: 2rem 1rem;
    }

    .container {
        max-width: 1300px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
</style>
