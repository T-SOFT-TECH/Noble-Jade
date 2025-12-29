<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "$lib/stores/toast";
    import {
        getServices,
        getServiceImageUrl,
        type Service,
    } from "$lib/services/content";
    import { pb } from "$lib/pocketbase";

    let services = $state<Service[]>([]);
    let isLoading = $state(true);
    let showModal = $state(false);
    let editingService = $state<Service | null>(null);

    // Form fields
    let formName = $state("");
    let formSlug = $state("");
    let formDescription = $state("");
    let formBasePrice = $state(0);
    let formIsActive = $state(true);
    let formIsPopular = $state(false);
    let formFeatures = $state("");

    onMount(async () => {
        await loadServices();
    });

    async function loadServices() {
        isLoading = true;
        try {
            // Get all services (including inactive for admin)
            services = await pb.collection("services").getFullList<Service>({
                sort: "sortOrder",
            });
        } catch (error) {
            console.error("[Admin Services] Error loading:", error);
            toast.error("Failed to load services");
        } finally {
            isLoading = false;
        }
    }

    function openModal(service?: Service) {
        if (service) {
            editingService = service;
            formName = service.name;
            formSlug = service.slug;
            formDescription = service.description || "";
            formBasePrice = service.basePrice;
            formIsActive = service.isActive;
            formIsPopular = service.isPopular;
            formFeatures = service.features?.join("\n") || "";
        } else {
            editingService = null;
            formName = "";
            formSlug = "";
            formDescription = "";
            formBasePrice = 0;
            formIsActive = true;
            formIsPopular = false;
            formFeatures = "";
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        editingService = null;
    }

    async function saveService() {
        try {
            const data = {
                name: formName,
                slug: formSlug || formName.toLowerCase().replace(/\s+/g, "-"),
                description: formDescription,
                basePrice: formBasePrice,
                isActive: formIsActive,
                isPopular: formIsPopular,
                features: formFeatures.split("\n").filter((f) => f.trim()),
                sortOrder: editingService?.sortOrder || services.length + 1,
            };

            if (editingService?.id) {
                await pb.collection("services").update(editingService.id, data);
                toast.success("Service updated!");
            } else {
                await pb.collection("services").create(data);
                toast.success("Service created!");
            }

            closeModal();
            await loadServices();
        } catch (error: any) {
            console.error("[Admin Services] Save error:", error);
            toast.error(error.message || "Failed to save service");
        }
    }

    async function deleteService(id: string) {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            await pb.collection("services").delete(id);
            toast.success("Service deleted!");
            await loadServices();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete service");
        }
    }

    async function toggleActive(service: Service) {
        try {
            await pb.collection("services").update(service.id, {
                isActive: !service.isActive,
            });
            await loadServices();
        } catch (error: any) {
            toast.error(error.message || "Failed to update service");
        }
    }
</script>

<div class="services-page">
    <div class="page-header">
        <div>
            <h1>Services</h1>
            <p>Configure cleaning services and pricing</p>
        </div>
        <button class="add-btn" onclick={() => openModal()}
            >+ Add Service</button
        >
    </div>

    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading services...</p>
        </div>
    {:else}
        <section class="section">
            <h2>All Services ({services.length})</h2>
            <div class="services-grid">
                {#each services as service}
                    <div
                        class="service-card"
                        class:inactive={!service.isActive}
                    >
                        <div class="card-top">
                            <span class="service-name">{service.name}</span>
                            {#if service.isPopular}<span class="popular"
                                    >Popular</span
                                >{/if}
                        </div>
                        <p class="slug">/{service.slug}</p>
                        <p class="description">
                            {service.description || "No description"}
                        </p>
                        <p class="price">
                            ${service.basePrice} <span>base</span>
                        </p>
                        <div class="card-actions">
                            <label class="toggle">
                                <input
                                    type="checkbox"
                                    checked={service.isActive}
                                    onchange={() => toggleActive(service)}
                                />
                                <span class="slider"></span>
                            </label>
                            <div class="btn-group">
                                <button
                                    class="edit-btn"
                                    onclick={() => openModal(service)}
                                    >Edit</button
                                >
                                <button
                                    class="delete-btn"
                                    onclick={() => deleteService(service.id)}
                                    >Delete</button
                                >
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </section>
    {/if}
</div>

<!-- Modal -->
{#if showModal}
    <div class="modal-overlay" onclick={closeModal}>
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>{editingService ? "Edit Service" : "Add Service"}</h2>
                <button class="close-btn" onclick={closeModal}>&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={formName}
                        placeholder="Standard Cleaning"
                    />
                </div>
                <div class="form-group">
                    <label for="slug">Slug</label>
                    <input
                        type="text"
                        id="slug"
                        bind:value={formSlug}
                        placeholder="standard-cleaning"
                    />
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea
                        id="description"
                        bind:value={formDescription}
                        rows="3"
                        placeholder="Service description..."
                    ></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="price">Base Price ($)</label>
                        <input
                            type="number"
                            id="price"
                            bind:value={formBasePrice}
                            min="0"
                            step="5"
                        />
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
                            <label
                                ><input
                                    type="checkbox"
                                    bind:checked={formIsPopular}
                                /> Popular</label
                            >
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="features">Features (one per line)</label>
                    <textarea
                        id="features"
                        bind:value={formFeatures}
                        rows="4"
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    ></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick={closeModal}>Cancel</button>
                <button class="save-btn" onclick={saveService}>
                    {editingService ? "Update" : "Create"} Service
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .services-page {
        color: var(--text-primary);
    }
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
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
    .section {
        margin-bottom: 2rem;
    }
    .section h2 {
        font-size: 1.125rem;
        margin: 0 0 1rem;
    }
    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }
    .service-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.25rem;
        border: 1px solid var(--glass-bg);
        transition: opacity 0.2s;
    }
    .service-card.inactive {
        opacity: 0.6;
    }
    .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    .service-name {
        font-weight: 600;
        font-size: 1.1rem;
    }
    .popular {
        padding: 0.2rem 0.5rem;
        background: var(--color-accent);
        color: white;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    .slug {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.4);
        font-family: monospace;
        margin: 0 0 0.5rem;
    }
    .description {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0 0 0.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .price {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0.5rem 0 1rem;
    }
    .price span {
        font-size: 0.75rem;
        font-weight: 400;
        color: var(--text-muted);
    }
    .card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .btn-group {
        display: flex;
        gap: 0.5rem;
    }
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
        max-width: 500px;
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
    .form-group input:not([type="checkbox"]),
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 1rem;
    }
    .form-group input:focus,
    .form-group textarea:focus {
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
        gap: 1.5rem;
        padding: 0.75rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
    }
    .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        color: var(--text-primary);
        font-size: 0.9rem;
    }
    .checkbox-group input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--color-accent);
        cursor: pointer;
        appearance: auto;
        -webkit-appearance: auto;
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
