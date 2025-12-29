<script lang="ts">
    import { onMount } from "svelte";
    import {
        getAllStaff,
        createStaffMember,
        type StaffMember,
    } from "$lib/services/admin";

    let searchQuery = $state("");
    let statusFilter = $state("all");
    let isLoading = $state(true);
    let staff = $state<StaffMember[]>([]);

    // Modal state
    let showModal = $state(false);
    let isSaving = $state(false);
    let errorMessage = $state("");
    let newStaff = $state({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    async function loadStaff() {
        isLoading = true;
        try {
            staff = await getAllStaff();
        } catch (error) {
            console.error("Error loading staff:", error);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        loadStaff();
    });

    const filteredStaff = $derived(() =>
        staff.filter(
            (s) =>
                (s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.email
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())) &&
                (statusFilter === "all" || s.status === statusFilter),
        ),
    );

    // Get initials from name
    function getInitials(name: string): string {
        if (!name) return "??";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    const statusColors: Record<string, string> = {
        active: "#22c55e",
        "on-leave": "#eab308",
        inactive: "#6b7280",
    };

    // Open add staff modal
    function openAddModal() {
        newStaff = { name: "", email: "", phone: "", password: "" };
        errorMessage = "";
        showModal = true;
    }

    // Close modal
    function closeModal() {
        showModal = false;
        newStaff = { name: "", email: "", phone: "", password: "" };
        errorMessage = "";
    }

    // Handle add staff
    async function handleAddStaff() {
        if (!newStaff.name || !newStaff.email || !newStaff.password) {
            errorMessage = "Name, email, and password are required";
            return;
        }

        isSaving = true;
        errorMessage = "";

        try {
            const result = await createStaffMember({
                name: newStaff.name,
                email: newStaff.email,
                phone: newStaff.phone,
                password: newStaff.password,
            });

            if (result) {
                await loadStaff();
                closeModal();
            } else {
                errorMessage = "Failed to create staff member";
            }
        } catch (error: any) {
            errorMessage = error.message || "Failed to create staff member";
        } finally {
            isSaving = false;
        }
    }
</script>

<div class="staff-page">
    <div class="page-header">
        <div>
            <h1>Staff</h1>
            <p>Manage cleaning staff members</p>
        </div>
        <button class="add-btn" onclick={openAddModal}>+ Add Staff</button>
    </div>

    <div class="filters">
        <input
            type="text"
            placeholder="Search staff..."
            bind:value={searchQuery}
            class="search-input"
        />
        <div class="status-filters">
            {#each ["all", "active", "on-leave", "inactive"] as status}
                <button
                    class="filter-btn"
                    class:active={statusFilter === status}
                    onclick={() => (statusFilter = status)}>{status}</button
                >
            {/each}
        </div>
    </div>

    {#if isLoading}
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading staff...</p>
        </div>
    {:else}
        <div class="staff-grid">
            {#each filteredStaff() as staffMember}
                <div class="staff-card">
                    <div class="card-top">
                        <div class="avatar">
                            {getInitials(staffMember.name)}
                        </div>
                        <span
                            class="badge"
                            style="background: {statusColors[
                                staffMember.status
                            ]}20; color: {statusColors[staffMember.status]}"
                            >{staffMember.status}</span
                        >
                    </div>
                    <h3>{staffMember.name}</h3>
                    <p>{staffMember.email}</p>
                    <div class="stats">
                        <span>★ {staffMember.averageRating}</span>
                        <span>{staffMember.jobsCompleted} jobs</span>
                    </div>
                    <button class="view-btn">View Profile</button>
                </div>
            {:else}
                <div class="empty-state">No staff members found</div>
            {/each}
        </div>
    {/if}
</div>

<!-- Add Staff Modal -->
{#if showModal}
    <div
        class="modal-overlay"
        onclick={closeModal}
        onkeydown={(e) => e.key === "Escape" && closeModal()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div class="modal" role="document" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>Add Staff Member</h2>
                <button class="close-btn" onclick={closeModal}>×</button>
            </div>
            <form
                class="modal-form"
                onsubmit={(e) => {
                    e.preventDefault();
                    handleAddStaff();
                }}
            >
                {#if errorMessage}
                    <div class="error-message">{errorMessage}</div>
                {/if}
                <div class="form-group">
                    <label for="name">Full Name *</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={newStaff.name}
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={newStaff.email}
                        placeholder="john@example.com"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        bind:value={newStaff.phone}
                        placeholder="416-555-0000"
                    />
                </div>
                <div class="form-group">
                    <label for="password">Password *</label>
                    <input
                        type="password"
                        id="password"
                        bind:value={newStaff.password}
                        placeholder="Minimum 8 characters"
                        required
                        minlength="8"
                    />
                </div>
                <div class="modal-actions">
                    <button
                        type="button"
                        class="btn-secondary"
                        onclick={closeModal}>Cancel</button
                    >
                    <button
                        type="submit"
                        class="btn-primary"
                        disabled={isSaving}
                    >
                        {isSaving ? "Adding..." : "Add Staff"}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .staff-page {
        color: var(--text-primary);
    }
    .page-header {
        display: flex;
        justify-content: space-between;
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
        color: var(--text-primary);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .add-btn:hover {
        background: #9333ea;
    }
    .filters {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .search-input {
        flex: 1;
        max-width: 350px;
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
    }
    .status-filters {
        display: flex;
        gap: 0.5rem;
    }
    .filter-btn {
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: 6px;
        cursor: pointer;
        text-transform: capitalize;
    }
    .filter-btn.active {
        background: var(--color-accent);
        border-color: var(--color-accent);
        color: var(--text-primary);
    }
    .staff-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1rem;
    }
    .staff-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.25rem;
        border: 1px solid var(--glass-bg);
    }
    .card-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    .avatar {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: linear-gradient(135deg, var(--color-accent), #6366f1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }
    .badge {
        padding: 0.25rem 0.5rem;
        border-radius: 50px;
        font-size: 0.7rem;
        font-weight: 500;
        text-transform: capitalize;
    }
    .staff-card h3 {
        margin: 0 0 0.25rem;
        font-size: 1rem;
    }
    .staff-card p {
        margin: 0 0 0.75rem;
        font-size: 0.8rem;
        color: var(--text-muted);
    }
    .stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.85rem;
        color: var(--color-accent);
    }
    .view-btn {
        width: 100%;
        padding: 0.6rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
    }

    /* Loading State */
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }

    .loading-container .spinner {
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
        padding: 2rem;
        color: var(--text-muted);
        grid-column: 1 / -1;
    }

    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }

    .modal {
        background: var(--bg-secondary);
        border-radius: 16px;
        width: 100%;
        max-width: 480px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem;
        border-bottom: 1px solid var(--glass-bg);
    }

    .modal-header h2 {
        font-size: 1.125rem;
        margin: 0;
    }

    .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
    }

    .modal-form {
        padding: 1.25rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.7);
    }

    .form-group input {
        width: 100%;
        padding: 0.75rem 1rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 0.875rem;
    }

    .form-group input:focus {
        outline: none;
        border-color: var(--color-accent);
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1.5rem;
    }

    .btn-secondary,
    .btn-primary {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .btn-secondary {
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
    }

    .btn-primary {
        background: var(--color-accent);
        border: none;
        color: var(--text-primary);
    }

    .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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
</style>
