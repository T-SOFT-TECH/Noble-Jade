<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "$lib/stores/toast";
    import {
        getPricingPackages,
        type PricingPackage,
    } from "$lib/services/content";
    import { pb } from "$lib/pocketbase";

    let packages = $state<PricingPackage[]>([]);
    let isLoading = $state(true);
    let showModal = $state(false);
    let editingPackage = $state<PricingPackage | null>(null);

    // Form fields
    let formName = $state("");
    let formLabel = $state("");
    let formDescription = $state("");
    let formPrice = $state(0);
    let formPriceNote = $state("");
    let formFeatures = $state("");
    let formIsActive = $state(true);
    let formIsPopular = $state(false);

    onMount(async () => {
        await loadPackages();
    });

    async function loadPackages() {
        isLoading = true;
        try {
            packages = await pb
                .collection("pricing_packages")
                .getFullList<PricingPackage>({
                    sort: "sortOrder",
                });
        } catch (error) {
            console.error("[Admin Pricing] Error loading:", error);
            toast.error("Failed to load pricing packages");
        } finally {
            isLoading = false;
        }
    }

    function openModal(pkg?: PricingPackage) {
        if (pkg) {
            editingPackage = pkg;
            formName = pkg.name;
            formLabel = pkg.label || "";
            formDescription = pkg.description || "";
            formPrice = pkg.price;
            formPriceNote = pkg.priceNote || "";
            formFeatures = pkg.features?.join("\n") || "";
            formIsActive = pkg.isActive;
            formIsPopular = pkg.isPopular;
        } else {
            editingPackage = null;
            formName = "";
            formLabel = "";
            formDescription = "";
            formPrice = 0;
            formPriceNote = "";
            formFeatures = "";
            formIsActive = true;
            formIsPopular = false;
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        editingPackage = null;
    }

    async function savePackage() {
        if (!formName.trim()) {
            toast.error("Please enter a package name");
            return;
        }

        try {
            const data = {
                name: formName,
                label: formLabel,
                description: formDescription,
                price: formPrice,
                priceNote: formPriceNote,
                features: formFeatures.split("\n").filter((f) => f.trim()),
                isActive: formIsActive,
                isPopular: formIsPopular,
                sortOrder: editingPackage?.sortOrder || packages.length + 1,
            };

            if (editingPackage?.id) {
                await pb
                    .collection("pricing_packages")
                    .update(editingPackage.id, data);
                toast.success("Package updated!");
            } else {
                await pb.collection("pricing_packages").create(data);
                toast.success("Package created!");
            }

            closeModal();
            await loadPackages();
        } catch (error: any) {
            console.error("[Admin Pricing] Save error:", error);
            toast.error(error.message || "Failed to save package");
        }
    }

    async function deletePackage(id: string) {
        if (!confirm("Are you sure you want to delete this package?")) return;

        try {
            await pb.collection("pricing_packages").delete(id);
            toast.success("Package deleted!");
            await loadPackages();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete package");
        }
    }

    async function toggleActive(pkg: PricingPackage) {
        try {
            await pb.collection("pricing_packages").update(pkg.id, {
                isActive: !pkg.isActive,
            });
            await loadPackages();
        } catch (error: any) {
            toast.error(error.message || "Failed to update package");
        }
    }

    async function togglePopular(pkg: PricingPackage) {
        try {
            await pb.collection("pricing_packages").update(pkg.id, {
                isPopular: !pkg.isPopular,
            });
            await loadPackages();
        } catch (error: any) {
            toast.error(error.message || "Failed to update package");
        }
    }
</script>

<div class="pricing-page">
    <div class="page-header">
        <div>
            <h1>Pricing Packages</h1>
            <p>Manage cleaning service packages and pricing</p>
        </div>
        <button class="add-btn" onclick={() => openModal()}
            >+ Add Package</button
        >
    </div>

    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading packages...</p>
        </div>
    {:else}
        <div class="packages-grid">
            {#each packages as pkg}
                <div
                    class="package-card"
                    class:inactive={!pkg.isActive}
                    class:popular={pkg.isPopular}
                >
                    {#if pkg.isPopular}
                        <div class="popular-badge">Most Popular</div>
                    {/if}
                    <div class="card-header">
                        <span class="label">{pkg.label || "Package"}</span>
                        <h3 class="name">{pkg.name}</h3>
                        <p class="description">
                            {pkg.description || "No description"}
                        </p>
                    </div>
                    <div class="price-section">
                        <span class="price">${pkg.price}</span>
                        <span class="price-note"
                            >{pkg.priceNote || "/visit"}</span
                        >
                    </div>
                    {#if pkg.features && pkg.features.length > 0}
                        <ul class="features">
                            {#each pkg.features.slice(0, 4) as feature}
                                <li>✓ {feature}</li>
                            {/each}
                            {#if pkg.features.length > 4}
                                <li class="more">
                                    +{pkg.features.length - 4} more
                                </li>
                            {/if}
                        </ul>
                    {/if}
                    <div class="card-actions">
                        <div class="toggles">
                            <button
                                class="toggle-btn"
                                class:active={pkg.isActive}
                                onclick={() => toggleActive(pkg)}
                            >
                                {pkg.isActive ? "Active" : "Inactive"}
                            </button>
                            <button
                                class="toggle-btn popular"
                                class:active={pkg.isPopular}
                                onclick={() => togglePopular(pkg)}
                            >
                                {pkg.isPopular ? "Popular" : "Normal"}
                            </button>
                        </div>
                        <div class="btn-group">
                            <button
                                class="edit-btn"
                                onclick={() => openModal(pkg)}>Edit</button
                            >
                            <button
                                class="delete-btn"
                                onclick={() => deletePackage(pkg.id)}
                                >Delete</button
                            >
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        {#if packages.length === 0}
            <div class="empty-state">
                <p>
                    No pricing packages yet. Click "Add Package" to create one.
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
                <h2>{editingPackage ? "Edit Package" : "Add Package"}</h2>
                <button class="close-btn" onclick={closeModal}>&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Package Name</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={formName}
                            placeholder="Fresh Start"
                        />
                    </div>
                    <div class="form-group">
                        <label for="label">Label</label>
                        <input
                            type="text"
                            id="label"
                            bind:value={formLabel}
                            placeholder="BASIC PACKAGE"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea
                        id="description"
                        bind:value={formDescription}
                        rows="2"
                        placeholder="Light maintenance, small apartments..."
                    ></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="price">Price ($)</label>
                        <input
                            type="number"
                            id="price"
                            bind:value={formPrice}
                            min="0"
                            step="5"
                        />
                    </div>
                    <div class="form-group">
                        <label for="priceNote">Price Note</label>
                        <input
                            type="text"
                            id="priceNote"
                            bind:value={formPriceNote}
                            placeholder="(up to 2 bed / 1 bath)"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="features">Features (one per line)</label>
                    <textarea
                        id="features"
                        bind:value={formFeatures}
                        rows="5"
                        placeholder="Dusting all surfaces&#10;Vacuuming & mopping&#10;Kitchen wipe-down"
                    ></textarea>
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
                                bind:checked={formIsPopular}
                            /> Most Popular</label
                        >
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick={closeModal}>Cancel</button>
                <button class="save-btn" onclick={savePackage}>
                    {editingPackage ? "Update" : "Create"} Package
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .pricing-page {
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
    .packages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    .package-card {
        background: var(--bg-secondary);
        border-radius: 16px;
        padding: 1.5rem;
        border: 1px solid var(--glass-bg);
        position: relative;
    }
    .package-card.inactive {
        opacity: 0.6;
    }
    .package-card.popular {
        border-color: var(--color-accent);
        box-shadow: 0 4px 20px rgba(232, 35, 116, 0.15);
    }
    .popular-badge {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-accent);
        color: white;
        padding: 0.25rem 1rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .card-header {
        margin-bottom: 1rem;
    }
    .label {
        font-size: 0.7rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }
    .name {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0.25rem 0;
    }
    .description {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }
    .price-section {
        margin: 1rem 0;
    }
    .price {
        font-size: 2rem;
        font-weight: 700;
    }
    .price-note {
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-left: 0.25rem;
    }
    .features {
        list-style: none;
        padding: 0;
        margin: 0 0 1rem;
    }
    .features li {
        padding: 0.25rem 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
    .features .more {
        color: var(--color-accent);
        font-style: italic;
    }
    .card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--glass-bg);
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
    .toggle-btn.popular.active {
        background: var(--color-accent) 20;
        color: var(--color-accent);
        border-color: var(--color-accent);
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
    .form-group input:not([type="checkbox"]),
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
