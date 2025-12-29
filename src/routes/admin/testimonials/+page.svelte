<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "$lib/stores/toast";
    import {
        getTestimonials,
        getTestimonialImageUrl,
        type Testimonial,
    } from "$lib/services/content";
    import { pb } from "$lib/pocketbase";

    let testimonials = $state<Testimonial[]>([]);
    let isLoading = $state(true);
    let showModal = $state(false);
    let editingTestimonial = $state<Testimonial | null>(null);

    // Form fields
    let formName = $state("");
    let formRole = $state("");
    let formQuote = $state("");
    let formRating = $state(5);
    let formIsActive = $state(true);
    let formIsFeatured = $state(false);

    onMount(async () => {
        await loadTestimonials();
    });

    async function loadTestimonials() {
        isLoading = true;
        try {
            testimonials = await pb
                .collection("testimonials")
                .getFullList<Testimonial>({
                    sort: "-created",
                });
        } catch (error) {
            console.error("[Admin Testimonials] Error loading:", error);
            toast.error("Failed to load testimonials");
        } finally {
            isLoading = false;
        }
    }

    function openModal(testimonial?: Testimonial) {
        if (testimonial) {
            editingTestimonial = testimonial;
            formName = testimonial.name;
            formRole = testimonial.role || "";
            formQuote = testimonial.quote;
            formRating = testimonial.rating;
            formIsActive = testimonial.isActive;
            formIsFeatured = testimonial.isFeatured;
        } else {
            editingTestimonial = null;
            formName = "";
            formRole = "";
            formQuote = "";
            formRating = 5;
            formIsActive = true;
            formIsFeatured = false;
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        editingTestimonial = null;
    }

    async function saveTestimonial() {
        if (!formName.trim() || !formQuote.trim()) {
            toast.error("Please fill in name and quote");
            return;
        }

        try {
            const data = {
                name: formName,
                role: formRole,
                quote: formQuote,
                rating: formRating,
                isActive: formIsActive,
                isFeatured: formIsFeatured,
                sortOrder:
                    editingTestimonial?.sortOrder || testimonials.length + 1,
            };

            if (editingTestimonial?.id) {
                await pb
                    .collection("testimonials")
                    .update(editingTestimonial.id, data);
                toast.success("Testimonial updated!");
            } else {
                await pb.collection("testimonials").create(data);
                toast.success("Testimonial created!");
            }

            closeModal();
            await loadTestimonials();
        } catch (error: any) {
            console.error("[Admin Testimonials] Save error:", error);
            toast.error(error.message || "Failed to save testimonial");
        }
    }

    async function deleteTestimonial(id: string) {
        if (!confirm("Are you sure you want to delete this testimonial?"))
            return;

        try {
            await pb.collection("testimonials").delete(id);
            toast.success("Testimonial deleted!");
            await loadTestimonials();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete testimonial");
        }
    }

    async function toggleActive(testimonial: Testimonial) {
        try {
            await pb.collection("testimonials").update(testimonial.id, {
                isActive: !testimonial.isActive,
            });
            await loadTestimonials();
        } catch (error: any) {
            toast.error(error.message || "Failed to update testimonial");
        }
    }

    async function toggleFeatured(testimonial: Testimonial) {
        try {
            await pb.collection("testimonials").update(testimonial.id, {
                isFeatured: !testimonial.isFeatured,
            });
            await loadTestimonials();
        } catch (error: any) {
            toast.error(error.message || "Failed to update testimonial");
        }
    }

    function renderStars(rating: number): string {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }
</script>

<div class="testimonials-page">
    <div class="page-header">
        <div>
            <h1>Testimonials</h1>
            <p>Manage customer reviews and testimonials</p>
        </div>
        <button class="add-btn" onclick={() => openModal()}
            >+ Add Testimonial</button
        >
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
        <div class="stat-card">
            <span class="stat-value">{testimonials.length}</span>
            <span class="stat-label">Total</span>
        </div>
        <div class="stat-card">
            <span class="stat-value"
                >{testimonials.filter((t) => t.isActive).length}</span
            >
            <span class="stat-label">Active</span>
        </div>
        <div class="stat-card">
            <span class="stat-value"
                >{testimonials.filter((t) => t.isFeatured).length}</span
            >
            <span class="stat-label">Featured</span>
        </div>
    </div>

    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading testimonials...</p>
        </div>
    {:else}
        <div class="testimonials-grid">
            {#each testimonials as testimonial}
                <div
                    class="testimonial-card"
                    class:inactive={!testimonial.isActive}
                >
                    <div class="card-header">
                        <div class="author">
                            <div class="avatar">
                                {testimonial.name.charAt(0)}
                            </div>
                            <div class="author-info">
                                <span class="name">{testimonial.name}</span>
                                <span class="role"
                                    >{testimonial.role || "Customer"}</span
                                >
                            </div>
                        </div>
                        {#if testimonial.isFeatured}
                            <span class="featured-badge">Featured</span>
                        {/if}
                    </div>
                    <div class="rating">{renderStars(testimonial.rating)}</div>
                    <p class="quote">"{testimonial.quote}"</p>
                    <div class="card-actions">
                        <div class="toggles">
                            <button
                                class="toggle-btn"
                                class:active={testimonial.isActive}
                                onclick={() => toggleActive(testimonial)}
                            >
                                {testimonial.isActive ? "Active" : "Inactive"}
                            </button>
                            <button
                                class="toggle-btn featured"
                                class:active={testimonial.isFeatured}
                                onclick={() => toggleFeatured(testimonial)}
                            >
                                {testimonial.isFeatured
                                    ? "Featured"
                                    : "Not Featured"}
                            </button>
                        </div>
                        <div class="btn-group">
                            <button
                                class="edit-btn"
                                onclick={() => openModal(testimonial)}
                                >Edit</button
                            >
                            <button
                                class="delete-btn"
                                onclick={() =>
                                    deleteTestimonial(testimonial.id)}
                                >Delete</button
                            >
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        {#if testimonials.length === 0}
            <div class="empty-state">
                <p>
                    No testimonials yet. Click "Add Testimonial" to create one.
                </p>
            </div>
        {/if}
    {/if}
</div>

<!-- Modal -->
{#if showModal}
    <div class="modal-overlay" onclick={closeModal}>
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>
                    {editingTestimonial
                        ? "Edit Testimonial"
                        : "Add Testimonial"}
                </h2>
                <button class="close-btn" onclick={closeModal}>&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Customer Name</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={formName}
                            placeholder="John Doe"
                        />
                    </div>
                    <div class="form-group">
                        <label for="role">Role/Title</label>
                        <input
                            type="text"
                            id="role"
                            bind:value={formRole}
                            placeholder="Homeowner, Office Manager..."
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="quote">Testimonial Quote</label>
                    <textarea
                        id="quote"
                        bind:value={formQuote}
                        rows="4"
                        placeholder="Their testimonial..."
                    ></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="rating">Rating</label>
                        <select id="rating" bind:value={formRating}>
                            <option value={5}>5 Stars</option>
                            <option value={4}>4 Stars</option>
                            <option value={3}>3 Stars</option>
                            <option value={2}>2 Stars</option>
                            <option value={1}>1 Star</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Options</label>
                        <div class="checkbox-group">
                            <label
                                ><input
                                    type="checkbox"
                                    bind:checked={formIsActive}
                                /> Active</label
                            >
                            <label
                                ><input
                                    type="checkbox"
                                    bind:checked={formIsFeatured}
                                /> Featured</label
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick={closeModal}>Cancel</button>
                <button class="save-btn" onclick={saveTestimonial}>
                    {editingTestimonial ? "Update" : "Create"} Testimonial
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .testimonials-page {
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
    .stats-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .stat-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1rem 1.5rem;
        border: 1px solid var(--glass-bg);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
    }
    .stat-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
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
    .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1rem;
    }
    .testimonial-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid var(--glass-bg);
    }
    .testimonial-card.inactive {
        opacity: 0.6;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.75rem;
    }
    .author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    .avatar {
        width: 44px;
        height: 44px;
        background: var(--color-accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: 600;
        color: white;
    }
    .author-info {
        display: flex;
        flex-direction: column;
    }
    .name {
        font-weight: 600;
    }
    .role {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
    .featured-badge {
        padding: 0.25rem 0.5rem;
        background: #f59e0b;
        color: white;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    .rating {
        color: #f59e0b;
        font-size: 1rem;
        margin-bottom: 0.75rem;
    }
    .quote {
        color: var(--text-secondary);
        font-style: italic;
        line-height: 1.6;
        margin: 0 0 1rem;
    }
    .card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    .toggles {
        display: flex;
        gap: 0.5rem;
    }
    .toggle-btn {
        padding: 0.25rem 0.5rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        color: var(--text-secondary);
        font-size: 0.7rem;
        cursor: pointer;
    }
    .toggle-btn.active {
        background: #22c55e20;
        color: #22c55e;
        border-color: #22c55e;
    }
    .toggle-btn.featured.active {
        background: #f59e0b20;
        color: #f59e0b;
        border-color: #f59e0b;
    }
    .btn-group {
        display: flex;
        gap: 0.5rem;
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
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
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
