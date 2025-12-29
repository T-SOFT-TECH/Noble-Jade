<script lang="ts">
    import { onMount } from "svelte";
    import {
        getCalculatorSettings,
        updateCalculatorSetting,
        type CalculatorSetting,
    } from "$lib/services/admin";

    let isLoading = $state(true);
    let isSaving = $state<string | null>(null);
    let settings = $state<CalculatorSetting[]>([]);
    let error = $state("");
    let successMessage = $state("");

    // Group settings by category
    const groupedSettings = $derived(() => {
        const groups: Record<string, CalculatorSetting[]> = {
            base_prices: [],
            space_rates: [],
            addons: [],
            discounts: [],
        };
        for (const setting of settings) {
            if (groups[setting.category]) {
                groups[setting.category].push(setting);
            }
        }
        return groups;
    });

    const categoryLabels: Record<
        string,
        { title: string; description: string }
    > = {
        base_prices: {
            title: "Base Prices",
            description: "Starting prices for each cleaning type",
        },
        space_rates: {
            title: "Space Rates",
            description: "Additional charges based on space size",
        },
        addons: {
            title: "Add-on Services",
            description: "Prices for optional extra services",
        },
        discounts: {
            title: "Frequency Discounts",
            description: "Discount percentages for recurring services",
        },
    };

    async function loadSettings() {
        isLoading = true;
        error = "";
        try {
            settings = await getCalculatorSettings();
        } catch (e: any) {
            error = e.message || "Failed to load settings";
        } finally {
            isLoading = false;
        }
    }

    async function handleSave(setting: CalculatorSetting, newValue: number) {
        if (setting.value === newValue) return;

        isSaving = setting.id;
        error = "";
        successMessage = "";

        try {
            await updateCalculatorSetting(setting.id, newValue);
            setting.value = newValue;
            successMessage = `Updated "${setting.label}" successfully`;
            setTimeout(() => (successMessage = ""), 3000);
        } catch (e: any) {
            error = e.message || "Failed to update setting";
        } finally {
            isSaving = null;
        }
    }

    onMount(() => {
        loadSettings();
    });
</script>

<div class="calculator-settings-page">
    <div class="page-header">
        <div>
            <h1>Calculator Settings</h1>
            <p>Configure pricing for the quote calculator</p>
        </div>
        <button class="refresh-btn" onclick={loadSettings} disabled={isLoading}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
            </svg>
            Refresh
        </button>
    </div>

    {#if successMessage}
        <div class="success-message">{successMessage}</div>
    {/if}

    {#if error}
        <div class="error-message">{error}</div>
    {/if}

    {#if isLoading}
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading settings...</p>
        </div>
    {:else if settings.length === 0}
        <div class="empty-state">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
            >
                <path
                    d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"
                />
            </svg>
            <h3>No Settings Found</h3>
            <p>Run the PocketBase migration to create calculator settings.</p>
        </div>
    {:else}
        <div class="settings-grid">
            {#each Object.entries(groupedSettings()) as [category, categorySettings]}
                {#if categorySettings.length > 0}
                    <div class="settings-card">
                        <div class="card-header">
                            <h3>{categoryLabels[category].title}</h3>
                            <p>{categoryLabels[category].description}</p>
                        </div>
                        <div class="settings-list">
                            {#each categorySettings as setting (setting.id)}
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <span class="setting-label"
                                            >{setting.label}</span
                                        >
                                        <span class="setting-key"
                                            >{setting.key}</span
                                        >
                                    </div>
                                    <div class="setting-input">
                                        {#if category === "discounts"}
                                            <input
                                                type="number"
                                                value={setting.value}
                                                min="0"
                                                max="100"
                                                step="1"
                                                onchange={(e) =>
                                                    handleSave(
                                                        setting,
                                                        parseFloat(
                                                            e.currentTarget
                                                                .value,
                                                        ),
                                                    )}
                                                disabled={isSaving ===
                                                    setting.id}
                                            />
                                            <span class="unit">%</span>
                                        {:else if category === "space_rates" && setting.key === "rate_per_sqft"}
                                            <span class="prefix">$</span>
                                            <input
                                                type="number"
                                                value={setting.value}
                                                min="0"
                                                step="0.01"
                                                onchange={(e) =>
                                                    handleSave(
                                                        setting,
                                                        parseFloat(
                                                            e.currentTarget
                                                                .value,
                                                        ),
                                                    )}
                                                disabled={isSaving ===
                                                    setting.id}
                                            />
                                        {:else}
                                            <span class="prefix">$</span>
                                            <input
                                                type="number"
                                                value={setting.value}
                                                min="0"
                                                step="1"
                                                onchange={(e) =>
                                                    handleSave(
                                                        setting,
                                                        parseFloat(
                                                            e.currentTarget
                                                                .value,
                                                        ),
                                                    )}
                                                disabled={isSaving ===
                                                    setting.id}
                                            />
                                        {/if}
                                        {#if isSaving === setting.id}
                                            <span class="saving-indicator"
                                                >Saving...</span
                                            >
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .calculator-settings-page {
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
        margin: 0.25rem 0 0;
    }

    .refresh-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .refresh-btn:hover {
        background: var(--glass-bg);
        color: var(--text-primary);
    }

    .refresh-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .success-message {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #22c55e;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }

    .error-message {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border-color);
        border-top-color: var(--color-accent);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: var(--bg-secondary);
        border-radius: 16px;
        color: var(--text-muted);
    }

    .empty-state svg {
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .empty-state h3 {
        margin: 0 0 0.5rem;
        color: var(--text-primary);
    }

    .settings-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }

    @media (max-width: 900px) {
        .settings-grid {
            grid-template-columns: 1fr;
        }
    }

    .settings-card {
        background: var(--bg-secondary);
        border-radius: 16px;
        border: 1px solid var(--glass-bg);
        overflow: hidden;
    }

    .card-header {
        padding: 1.25rem;
        background: linear-gradient(
            135deg,
            rgba(168, 85, 247, 0.1),
            rgba(99, 102, 241, 0.1)
        );
        border-bottom: 1px solid var(--glass-bg);
    }

    .card-header h3 {
        margin: 0 0 0.25rem;
        font-size: 1.125rem;
        color: var(--color-accent);
    }

    .card-header p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    .settings-list {
        padding: 0.5rem;
    }

    .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        transition: background 0.2s;
    }

    .setting-item:hover {
        background: var(--glass-bg);
    }

    .setting-info {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
    }

    .setting-label {
        font-weight: 500;
        color: var(--text-primary);
    }

    .setting-key {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-family: monospace;
    }

    .setting-input {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .setting-input input {
        width: 100px;
        padding: 0.5rem 0.75rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-primary);
        font-size: 1rem;
        text-align: right;
    }

    .setting-input input:focus {
        outline: none;
        border-color: var(--color-accent);
    }

    .setting-input input:disabled {
        opacity: 0.5;
    }

    .prefix {
        color: var(--text-muted);
        font-weight: 500;
    }

    .unit {
        color: var(--text-muted);
        font-weight: 500;
        margin-left: 0.25rem;
    }

    .saving-indicator {
        font-size: 0.75rem;
        color: var(--color-accent);
        margin-left: 0.5rem;
    }
</style>
