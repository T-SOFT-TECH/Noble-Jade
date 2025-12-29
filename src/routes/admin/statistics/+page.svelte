<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "$lib/stores/toast";
    import { getStatistics, type Statistic } from "$lib/services/content";
    import { pb } from "$lib/pocketbase";

    let stats = $state<Statistic[]>([]);
    let isLoading = $state(true);
    let showModal = $state(false);
    let editingStat = $state<Statistic | null>(null);

    // Form fields
    let formKey = $state("");
    let formValue = $state("");
    let formLabel = $state("");
    let formIcon = $state("");

    const iconOptions = [
        "shield",
        "star",
        "repeat",
        "users",
        "review",
        "check",
        "clock",
        "heart",
    ];

    onMount(async () => {
        await loadStats();
    });

    async function loadStats() {
        isLoading = true;
        try {
            stats = await pb.collection("statistics").getFullList<Statistic>({
                sort: "sortOrder",
            });
        } catch (error) {
            console.error("[Admin Statistics] Error loading:", error);
            toast.error("Failed to load statistics");
        } finally {
            isLoading = false;
        }
    }

    function openModal(stat?: Statistic) {
        if (stat) {
            editingStat = stat;
            formKey = stat.key;
            formValue = stat.value;
            formLabel = stat.label;
            formIcon = stat.icon || "";
        } else {
            editingStat = null;
            formKey = "";
            formValue = "";
            formLabel = "";
            formIcon = "";
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        editingStat = null;
    }

    async function saveStat() {
        if (!formKey.trim() || !formValue.trim() || !formLabel.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const data = {
                key: formKey,
                value: formValue,
                label: formLabel,
                icon: formIcon,
                sortOrder: editingStat?.sortOrder || stats.length + 1,
            };

            if (editingStat?.id) {
                await pb.collection("statistics").update(editingStat.id, data);
                toast.success("Statistic updated!");
            } else {
                await pb.collection("statistics").create(data);
                toast.success("Statistic created!");
            }

            closeModal();
            await loadStats();
        } catch (error: any) {
            console.error("[Admin Statistics] Save error:", error);
            toast.error(error.message || "Failed to save statistic");
        }
    }

    async function deleteStat(id: string) {
        if (!confirm("Are you sure you want to delete this statistic?")) return;

        try {
            await pb.collection("statistics").delete(id);
            toast.success("Statistic deleted!");
            await loadStats();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete statistic");
        }
    }
</script>

<div class="statistics-page">
    <div class="page-header">
        <div>
            <h1>Statistics</h1>
            <p>Manage site statistics displayed on the About page</p>
        </div>
        <button class="add-btn" onclick={() => openModal()}
            >+ Add Statistic</button
        >
    </div>

    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading statistics...</p>
        </div>
    {:else}
        <div class="stats-grid">
            {#each stats as stat}
                <div class="stat-card">
                    <div class="stat-icon">
                        {#if stat.icon === "shield"}🛡️
                        {:else if stat.icon === "star"}⭐
                        {:else if stat.icon === "repeat"}🔄
                        {:else if stat.icon === "users"}👥
                        {:else if stat.icon === "review"}📝
                        {:else if stat.icon === "check"}✅
                        {:else if stat.icon === "clock"}⏰
                        {:else if stat.icon === "heart"}❤️
                        {:else}📊{/if}
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{stat.value}</span>
                        <span class="stat-label">{stat.label}</span>
                        <span class="stat-key">Key: {stat.key}</span>
                    </div>
                    <div class="stat-actions">
                        <button class="edit-btn" onclick={() => openModal(stat)}
                            >Edit</button
                        >
                        <button
                            class="delete-btn"
                            onclick={() => deleteStat(stat.id)}>Delete</button
                        >
                    </div>
                </div>
            {/each}
        </div>

        {#if stats.length === 0}
            <div class="empty-state">
                <p>No statistics yet. Click "Add Statistic" to create one.</p>
            </div>
        {/if}
    {/if}
</div>

<!-- Modal -->
{#if showModal}
    <div class="modal-overlay" onclick={closeModal}>
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>{editingStat ? "Edit Statistic" : "Add Statistic"}</h2>
                <button class="close-btn" onclick={closeModal}>&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group">
                        <label for="key">Key (unique identifier)</label>
                        <input
                            type="text"
                            id="key"
                            bind:value={formKey}
                            placeholder="satisfaction"
                        />
                    </div>
                    <div class="form-group">
                        <label for="value">Value</label>
                        <input
                            type="text"
                            id="value"
                            bind:value={formValue}
                            placeholder="96%"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="label">Label</label>
                    <input
                        type="text"
                        id="label"
                        bind:value={formLabel}
                        placeholder="Satisfaction Rate"
                    />
                </div>
                <div class="form-group">
                    <label for="icon">Icon</label>
                    <select id="icon" bind:value={formIcon}>
                        <option value="">None</option>
                        {#each iconOptions as icon}
                            <option value={icon}>{icon}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick={closeModal}>Cancel</button>
                <button class="save-btn" onclick={saveStat}>
                    {editingStat ? "Update" : "Create"} Statistic
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .statistics-page {
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
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }
    .stat-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid var(--glass-bg);
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }
    .stat-icon {
        font-size: 2rem;
    }
    .stat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--color-accent);
    }
    .stat-label {
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    .stat-key {
        font-size: 0.7rem;
        color: var(--text-muted);
        font-family: monospace;
        margin-top: 0.5rem;
    }
    .stat-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .edit-btn {
        padding: 0.4rem 0.75rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
    }
    .delete-btn {
        padding: 0.4rem 0.75rem;
        background: transparent;
        border: 1px solid #ef4444;
        color: #ef4444;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
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
    .form-group input,
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
    .form-group select:focus {
        outline: none;
        border-color: var(--color-accent);
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
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
