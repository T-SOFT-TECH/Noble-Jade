<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "$lib/stores/toast";
    import { getFaqs, type FAQ } from "$lib/services/content";
    import { pb } from "$lib/pocketbase";

    let faqs = $state<FAQ[]>([]);
    let isLoading = $state(true);
    let showModal = $state(false);
    let editingFaq = $state<FAQ | null>(null);
    let activeCategory = $state("all");

    // Form fields
    let formQuestion = $state("");
    let formAnswer = $state("");
    let formCategory = $state("General");
    let formIsActive = $state(true);

    const categories = [
        "General",
        "Booking",
        "Pricing",
        "Services",
        "Payment",
        "Other",
    ];

    onMount(async () => {
        await loadFaqs();
    });

    async function loadFaqs() {
        isLoading = true;
        try {
            faqs = await pb.collection("faqs").getFullList<FAQ>({
                sort: "sortOrder",
            });
        } catch (error) {
            console.error("[Admin FAQs] Error loading:", error);
            toast.error("Failed to load FAQs");
        } finally {
            isLoading = false;
        }
    }

    function openModal(faq?: FAQ) {
        if (faq) {
            editingFaq = faq;
            formQuestion = faq.question;
            formAnswer = faq.answer;
            formCategory = faq.category || "General";
            formIsActive = faq.isActive;
        } else {
            editingFaq = null;
            formQuestion = "";
            formAnswer = "";
            formCategory = "General";
            formIsActive = true;
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        editingFaq = null;
    }

    async function saveFaq() {
        if (!formQuestion.trim() || !formAnswer.trim()) {
            toast.error("Please fill in both question and answer");
            return;
        }

        try {
            const data = {
                question: formQuestion,
                answer: formAnswer,
                category: formCategory,
                isActive: formIsActive,
                sortOrder: editingFaq?.sortOrder || faqs.length + 1,
            };

            if (editingFaq?.id) {
                await pb.collection("faqs").update(editingFaq.id, data);
                toast.success("FAQ updated!");
            } else {
                await pb.collection("faqs").create(data);
                toast.success("FAQ created!");
            }

            closeModal();
            await loadFaqs();
        } catch (error: any) {
            console.error("[Admin FAQs] Save error:", error);
            toast.error(error.message || "Failed to save FAQ");
        }
    }

    async function deleteFaq(id: string) {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;

        try {
            await pb.collection("faqs").delete(id);
            toast.success("FAQ deleted!");
            await loadFaqs();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete FAQ");
        }
    }

    async function toggleActive(faq: FAQ) {
        try {
            await pb.collection("faqs").update(faq.id, {
                isActive: !faq.isActive,
            });
            await loadFaqs();
        } catch (error: any) {
            toast.error(error.message || "Failed to update FAQ");
        }
    }

    $effect(() => {
        // Filtered FAQs based on category
    });

    function filteredFaqs(): FAQ[] {
        if (activeCategory === "all") return faqs;
        return faqs.filter((f) => f.category === activeCategory);
    }
</script>

<div class="faqs-page">
    <div class="page-header">
        <div>
            <h1>FAQs</h1>
            <p>Manage frequently asked questions</p>
        </div>
        <button class="add-btn" onclick={() => openModal()}>+ Add FAQ</button>
    </div>

    <!-- Category Tabs -->
    <div class="tabs">
        <button
            class="tab"
            class:active={activeCategory === "all"}
            onclick={() => (activeCategory = "all")}
        >
            All ({faqs.length})
        </button>
        {#each categories as cat}
            <button
                class="tab"
                class:active={activeCategory === cat}
                onclick={() => (activeCategory = cat)}
            >
                {cat} ({faqs.filter((f) => f.category === cat).length})
            </button>
        {/each}
    </div>

    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading FAQs...</p>
        </div>
    {:else}
        <div class="faqs-list">
            {#each filteredFaqs() as faq, index}
                <div class="faq-card" class:inactive={!faq.isActive}>
                    <div class="faq-header">
                        <span class="faq-number">{index + 1}</span>
                        <span class="faq-category">{faq.category}</span>
                        <div class="faq-actions">
                            <label class="toggle">
                                <input
                                    type="checkbox"
                                    checked={faq.isActive}
                                    onchange={() => toggleActive(faq)}
                                />
                                <span class="slider"></span>
                            </label>
                            <button
                                class="edit-btn"
                                onclick={() => openModal(faq)}>Edit</button
                            >
                            <button
                                class="delete-btn"
                                onclick={() => deleteFaq(faq.id)}>Delete</button
                            >
                        </div>
                    </div>
                    <h3 class="faq-question">{faq.question}</h3>
                    <p class="faq-answer">{faq.answer}</p>
                </div>
            {/each}
        </div>

        {#if filteredFaqs().length === 0}
            <div class="empty-state">
                <p>No FAQs found. Click "Add FAQ" to create one.</p>
            </div>
        {/if}
    {/if}
</div>

<!-- Modal -->
{#if showModal}
    <div class="modal-overlay" onclick={closeModal}>
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>{editingFaq ? "Edit FAQ" : "Add FAQ"}</h2>
                <button class="close-btn" onclick={closeModal}>&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="question">Question</label>
                    <input
                        type="text"
                        id="question"
                        bind:value={formQuestion}
                        placeholder="How do I book a cleaning?"
                    />
                </div>
                <div class="form-group">
                    <label for="answer">Answer</label>
                    <textarea
                        id="answer"
                        bind:value={formAnswer}
                        rows="5"
                        placeholder="You can book online through our website..."
                    ></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select id="category" bind:value={formCategory}>
                            {#each categories as cat}
                                <option value={cat}>{cat}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <div class="checkbox-group">
                            <label
                                ><input
                                    type="checkbox"
                                    bind:checked={formIsActive}
                                /> Active</label
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick={closeModal}>Cancel</button>
                <button class="save-btn" onclick={saveFaq}>
                    {editingFaq ? "Update" : "Create"} FAQ
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .faqs-page {
        color: var(--text-primary);
    }
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
    }
    .page-header h1 {
        font-size: 1.75rem;
        margin: 0;
    }
    .page-header p {
        color: var(--text-secondary);
        margin: 0;
    }
    .add-btn {
        padding: 0.75rem 1.25rem;
        background: var(--color-accent);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
    .tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }
    .tab {
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 0.875rem;
    }
    .tab.active {
        background: var(--color-accent);
        color: white;
        border-color: var(--color-accent);
    }
    .loading {
        text-align: center;
        padding: 3rem;
    }
    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--glass-bg);
        border-top-color: var(--color-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    .faqs-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .faq-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid var(--glass-bg);
    }
    .faq-card.inactive {
        opacity: 0.6;
    }
    .faq-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    .faq-number {
        width: 28px;
        height: 28px;
        background: var(--color-accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        font-weight: 600;
        color: white;
    }
    .faq-category {
        padding: 0.25rem 0.75rem;
        background: var(--glass-bg);
        border-radius: 4px;
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
    .faq-actions {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    .faq-question {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
    }
    .faq-answer {
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.6;
    }
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }

    /* Toggle */
    .toggle {
        position: relative;
        width: 44px;
        height: 24px;
    }
    .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        inset: 0;
        background: var(--border-color);
        border-radius: 24px;
        cursor: pointer;
        transition: 0.2s;
    }
    .slider::before {
        content: "";
        position: absolute;
        width: 18px;
        height: 18px;
        left: 3px;
        bottom: 3px;
        background: white;
        border-radius: 50%;
        transition: 0.2s;
    }
    .toggle input:checked + .slider {
        background: #22c55e;
    }
    .toggle input:checked + .slider::before {
        transform: translateX(20px);
    }
    .edit-btn {
        padding: 0.5rem 1rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 6px;
        cursor: pointer;
    }
    .delete-btn {
        padding: 0.5rem 1rem;
        background: transparent;
        border: 1px solid #ef4444;
        color: #ef4444;
        border-radius: 6px;
        cursor: pointer;
    }
    .delete-btn:hover {
        background: #ef4444;
        color: white;
    }

    /* Modal */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .modal {
        background: var(--bg-primary);
        border-radius: 16px;
        width: 100%;
        max-width: 600px;
        max-height: 90vh;
        overflow: auto;
        border: 1px solid var(--glass-bg);
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--glass-bg);
    }
    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
    }
    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
    }
    .modal-body {
        padding: 1.5rem;
    }
    .form-group {
        margin-bottom: 1rem;
    }
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 0.75rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 1rem;
    }
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--color-accent);
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .checkbox-group {
        display: flex;
        gap: 1rem;
        padding-top: 0.5rem;
    }
    .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }
    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid var(--glass-bg);
    }
    .cancel-btn {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
    }
    .save-btn {
        padding: 0.75rem 1.5rem;
        background: var(--color-accent);
        border: none;
        color: white;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
</style>
