<script lang="ts">
    import { onMount } from "svelte";
    import { getFaqs, type FAQ } from "$lib/services/content";
    import { pb } from "$lib/pocketbase";
    import { defaultCompanyInfo } from "$lib/config/company";

    // FAQ accordion state - track which item is open (only one at a time)
    let openIndex = $state(0); // First item open by default
    let faqItems = $state<FAQ[]>([]);
    let isLoading = $state(true);
    let phone = $state(defaultCompanyInfo.phone);
    let email = $state(defaultCompanyInfo.email);

    // Default FAQs as fallback
    const defaultFaqs: FAQ[] = [
        {
            id: "1",
            question: "What services do you offer?",
            answer: "We offer a comprehensive range of cleaning services including regular home cleaning, deep cleaning, move-in/move-out cleaning, office cleaning, carpet and upholstery cleaning, window cleaning, and specialized services like post-construction cleanup.",
            category: "General",
            sortOrder: 1,
            isActive: true,
        },
        {
            id: "2",
            question: "How do I book a cleaning service?",
            answer: "Booking is easy! Simply click the 'Book Now' button, fill in your details and we'll confirm your appointment within the same business day. You can also call us directly or use our live chat.",
            category: "General",
            sortOrder: 2,
            isActive: true,
        },
    ];

    onMount(async () => {
        try {
            // Fetch FAQs
            const faqs = await getFaqs();
            faqItems = faqs.length > 0 ? faqs : defaultFaqs;

            // Fetch contact settings
            const settings = await pb.collection("settings").getFullList();
            for (const s of settings) {
                if (s.key === "contact_phone") phone = s.value;
                if (s.key === "contact_email") email = s.value;
            }
            console.log(
                "[FAQSection] Loaded",
                faqItems.length,
                "FAQs from database",
            );
        } catch (error) {
            console.error("[FAQSection] Error loading FAQs:", error);
            faqItems = defaultFaqs;
        } finally {
            isLoading = false;
        }
    });

    function toggleItem(index: number) {
        openIndex = openIndex === index ? -1 : index;
    }
</script>

<!-- FAQ Section -->
<section class="faq-section">
    <div class="faq-container">
        <!-- Header Row -->
        <div class="faq-header">
            <div class="faq-header-left">
                <span class="faq-label">FAQ</span>
                <h2 class="faq-title">Questions? Look here.</h2>
                <p class="faq-subtitle">
                    Can't find an answer? Call us at <a
                        href="tel:{phone.replace(/[\s\-\(\)]/g, '')}"
                        class="faq-phone">{phone}</a
                    >
                    or email {email}
                </p>
            </div>
            <div class="faq-header-right">
                <a href="/faq" class="btn-accent">FAQ Page</a>
            </div>
        </div>

        <!-- Accordion Items -->
        <div class="accordion">
            {#each faqItems as item, index}
                <div class="accordion-item" class:is-open={openIndex === index}>
                    <button
                        type="button"
                        class="accordion-header"
                        onclick={() => toggleItem(index)}
                    >
                        <span class="accordion-question">{item.question}</span>
                        <span
                            class="accordion-toggle"
                            class:is-open={openIndex === index}
                        >
                            +
                        </span>
                    </button>
                    <div
                        class="accordion-body"
                        class:is-open={openIndex === index}
                    >
                        <p>{item.answer}</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .faq-section {
        padding: 5rem 1rem;
        background: var(--bg-primary, #f8f8f8);
    }

    .faq-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    /* Header */
    .faq-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1.5rem;
    }

    .faq-header-left {
        flex: 1;
    }

    .faq-label {
        display: block;
        color: var(--color-alternate, #1384e2);
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
    }

    .faq-title {
        font-size: 3rem;

        color: var(--text-primary, #252525);
        margin: 0 0 0.75rem 0;
        line-height: 1.2;
    }

    .faq-subtitle {
        color: var(--text-secondary, #555);
        font-size: 0.95rem;
        margin: 0;
    }

    .faq-phone {
        color: var(--text-primary, #252525);
        text-decoration: underline;
    }

    .faq-header-right {
        padding-top: 2rem;
    }

    /* Accordion */
    .accordion {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .accordion-item {
        border: 1px solid #1384e2;
        border-radius: 20px;
        background: transparent;
        overflow: hidden;
    }

    .accordion-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 1.75rem;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.7rem;
        font-weight: 600;
        color: var(--text-primary, #252525);
        text-align: left;
    }

    .accordion-question {
        flex: 1;
        padding-right: 1rem;
    }

    .accordion-toggle {
        font-size: 2rem;
        font-weight: 300;
        color: #1384e2;
        line-height: 1;
        width: 32px;
        height: 32px;
        text-align: center;
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .accordion-toggle.is-open {
        transform: rotate(45deg);
    }

    .accordion-body {
        max-height: 0;
        overflow: hidden;
        transition:
            max-height 0.3s ease,
            padding 0.3s ease;
        padding: 0 1.75rem;
    }

    .accordion-body.is-open {
        max-height: 300px;
        padding: 0 1.75rem 1.25rem 1.75rem;
    }

    .accordion-body p {
        margin: 0;
        color: var(--text-secondary, #555);
        font-size: 1.2rem;
        line-height: 1.6;
    }

    /* Responsive */
    @media (max-width: 640px) {
        .faq-header {
            flex-direction: column;
        }

        .faq-header-right {
            padding-top: 0;
        }

        .faq-title {
            font-size: 1.75rem;
        }

        .accordion-header {
            padding: 1rem 1.25rem;
        }

        .accordion-body {
            padding: 0 1.25rem 1rem 1.25rem;
        }
    }
</style>
