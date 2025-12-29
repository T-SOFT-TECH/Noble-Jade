<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "$lib/stores/toast";
    import { pb } from "$lib/pocketbase";

    interface ServiceArea {
        id: string;
        name: string;
        region: string;
        cities: string[];
        isActive: boolean;
        sortOrder: number;
    }

    let areas = $state<ServiceArea[]>([]);
    let isLoading = $state(true);
    let showModal = $state(false);
    let editingArea = $state<ServiceArea | null>(null);

    // Form fields
    let formName = $state("");
    let formRegion = $state("");
    let formCities = $state("");
    let formIsActive = $state(true);

    const regions = [
        "Ontario",
        "Quebec",
        "British Columbia",
        "Alberta",
        "Manitoba",
        "Saskatchewan",
    ];

    onMount(async () => {
        await loadAreas();
    });

    async function loadAreas() {
        isLoading = true;
        try {
            areas = await pb
                .collection("service_areas")
                .getFullList<ServiceArea>({
                    sort: "sortOrder",
                });
        } catch (error) {
            console.error("[Admin Service Areas] Error loading:", error);
            toast.error("Failed to load service areas");
        } finally {
            isLoading = false;
        }
    }

    function openModal(area?: ServiceArea) {
        if (area) {
            editingArea = area;
            formName = area.name;
            formRegion = area.region;
            formCities = area.cities?.join("\n") || "";
            formIsActive = area.isActive;
        } else {
            editingArea = null;
            formName = "";
            formRegion = "Ontario";
            formCities = "";
            formIsActive = true;
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        editingArea = null;
    }

    async function saveArea() {
        if (!formName.trim() || !formRegion.trim()) {
            toast.error("Please fill in name and region");
            return;
        }

        try {
            const data = {
                name: formName,
                region: formRegion,
                cities: formCities
                    .split("\n")
                    .map((c) => c.trim())
                    .filter((c) => c),
                isActive: formIsActive,
                sortOrder: editingArea?.sortOrder || areas.length + 1,
            };

            if (editingArea?.id) {
                await pb
                    .collection("service_areas")
                    .update(editingArea.id, data);
                toast.success("Service area updated!");
            } else {
                await pb.collection("service_areas").create(data);
                toast.success("Service area created!");
            }

            closeModal();
            await loadAreas();
        } catch (error: any) {
            console.error("[Admin Service Areas] Save error:", error);
            toast.error(error.message || "Failed to save service area");
        }
    }

    async function deleteArea(id: string) {
        if (!confirm("Are you sure you want to delete this service area?"))
            return;

        try {
            await pb.collection("service_areas").delete(id);
            toast.success("Service area deleted!");
            await loadAreas();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete service area");
        }
    }

    async function toggleActive(area: ServiceArea) {
        try {
            await pb.collection("service_areas").update(area.id, {
                isActive: !area.isActive,
            });
            await loadAreas();
        } catch (error: any) {
            toast.error(error.message || "Failed to update service area");
        }
    }
</script>

<div class="service-areas-page">
    <div class="page-header">
        <div>
            <h1>Service Areas</h1>
            <p>Manage geographic regions where cleaning services are offered</p>
        </div>
        <button class="add-btn" onclick={() => openModal()}>+ Add Area</button>
    </div>

    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading service areas...</p>
        </div>
    {:else}
        <div class="areas-grid">
            {#each areas as area}
                <div class="area-card" class:inactive={!area.isActive}>
                    <div class="area-header">
                        <div class="area-info">
                            <h3>{area.name}</h3>
                            <span class="region-badge">{area.region}</span>
                        </div>
                        <label class="toggle">
                            <input
                                type="checkbox"
                                checked={area.isActive}
                                onchange={() => toggleActive(area)}
                            />
                            <span class="slider"></span>
                        </label>
                    </div>
                    {#if area.cities && area.cities.length > 0}
                        <div class="cities-list">
                            <span class="cities-label"
                                >Cities ({area.cities.length}):</span
                            >
                            <p class="cities">{area.cities.join(", ")}</p>
                        </div>
                    {:else}
                        <p class="no-cities">No cities specified</p>
                    {/if}
                    <div class="area-actions">
                        <button class="edit-btn" onclick={() => openModal(area)}
                            >Edit</button
                        >
                        <button
                            class="delete-btn"
                            onclick={() => deleteArea(area.id)}>Delete</button
                        >
                    </div>
                </div>
            {/each}
        </div>

        {#if areas.length === 0}
            <div class="empty-state">
                <p>No service areas defined. Click "Add Area" to create one.</p>
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
                    {editingArea ? "Edit Service Area" : "Add Service Area"}
                </h2>
                <button class="close-btn" onclick={closeModal}>&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Area Name</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={formName}
                            placeholder="Greater Toronto Area"
                        />
                    </div>
                    <div class="form-group">
                        <label for="region">Province/Region</label>
                        <select id="region" bind:value={formRegion}>
                            {#each regions as region}
                                <option value={region}>{region}</option>
                            {/each}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="cities">Cities (one per line)</label>
                    <textarea
                        id="cities"
                        bind:value={formCities}
                        rows="6"
                        placeholder="Toronto&#10;Mississauga&#10;Brampton&#10;Markham"
                    ></textarea>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" bind:checked={formIsActive} />
                        Active (show on website)
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick={closeModal}>Cancel</button>
                <button class="save-btn" onclick={saveArea}>
                    {editingArea ? "Update" : "Create"} Area
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .service-areas-page {
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
    .areas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1rem;
    }
    .area-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid var(--glass-bg);
    }
    .area-card.inactive {
        opacity: 0.6;
    }
    .area-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }
    .area-info h3 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
    }
    .region-badge {
        padding: 0.25rem 0.5rem;
        background: var(--color-accent) 20;
        color: var(--color-accent);
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
    }
    .cities-list {
        margin-bottom: 1rem;
    }
    .cities-label {
        font-size: 0.75rem;
        color: var(--text-muted);
    }
    .cities {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0.25rem 0 0;
        line-height: 1.5;
    }
    .no-cities {
        font-size: 0.875rem;
        color: var(--text-muted);
        font-style: italic;
        margin-bottom: 1rem;
    }
    .area-actions {
        display: flex;
        gap: 0.5rem;
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
        max-width: 550px;
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
    .checkbox-label {
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
