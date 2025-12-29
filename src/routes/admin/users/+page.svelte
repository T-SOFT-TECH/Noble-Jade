<script lang="ts">
    // Users Management Page - Real Data
    import { onMount } from "svelte";
    import {
        getAllUsers,
        updateUser,
        deleteUser,
        type AdminUser,
    } from "$lib/services/admin";

    let users = $state<AdminUser[]>([]);
    let isLoading = $state(true);
    let searchQuery = $state("");
    let roleFilter = $state("all");
    let showModal = $state(false);
    let editingUser = $state<Partial<AdminUser>>({
        name: "",
        email: "",
        phone: "",
        role: "customer",
    });
    let isNewUser = $state(false);
    let isSaving = $state(false);
    let errorMessage = $state("");

    // Load users from PocketBase
    async function loadUsers() {
        isLoading = true;
        try {
            const result = await getAllUsers(1, 100, {
                role: roleFilter !== "all" ? roleFilter : undefined,
                search: searchQuery || undefined,
            });
            users = result.items;
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        loadUsers();
    });

    // Reload when filters change
    $effect(() => {
        const _r = roleFilter;
        loadUsers();
    });

    // Debounced search
    let searchTimeout: ReturnType<typeof setTimeout>;
    function handleSearch() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadUsers();
        }, 300);
    }

    const filteredUsers = $derived(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    });

    function openEditModal(user: AdminUser) {
        editingUser = { ...user };
        isNewUser = false;
        showModal = true;
        errorMessage = "";
    }

    function openNewUserModal() {
        editingUser = { name: "", email: "", phone: "", role: "customer" };
        isNewUser = true;
        showModal = true;
        errorMessage = "";
    }

    function closeModal() {
        showModal = false;
        editingUser = { name: "", email: "", phone: "", role: "customer" };
        isNewUser = false;
        errorMessage = "";
    }

    async function handleSaveUser() {
        if (!editingUser) return;
        isSaving = true;
        errorMessage = "";

        try {
            if (!isNewUser && editingUser.id) {
                // Update existing user
                const result = await updateUser(editingUser.id, {
                    name: editingUser.name,
                    phone: editingUser.phone,
                    role: editingUser.role,
                });
                if (result) {
                    await loadUsers();
                    closeModal();
                } else {
                    errorMessage = "Failed to update user";
                }
            } else {
                // Create new user would require password - show message
                errorMessage = "Please use the Register page to add new users";
            }
        } catch (error: any) {
            errorMessage = error.message || "Failed to save user";
        } finally {
            isSaving = false;
        }
    }

    async function handleDeleteUser(userId: string) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const success = await deleteUser(userId);
            if (success) {
                await loadUsers();
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user");
        }
    }

    function formatDate(dateStr: string): string {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    const roleColors: Record<string, string> = {
        admin: "var(--color-accent)",
        staff: "#3b82f6",
        customer: "#22c55e",
    };
</script>

<div class="users-page">
    <div class="page-header">
        <div class="header-left">
            <h1>Users</h1>
            <p>Manage customer and staff accounts</p>
        </div>
        <button class="add-btn" onclick={openNewUserModal}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Add User
        </button>
    </div>

    <!-- Filters -->
    <div class="filters">
        <div class="search-box">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
                type="text"
                placeholder="Search users..."
                bind:value={searchQuery}
            />
        </div>
        <div class="role-filters">
            <button
                class="filter-btn"
                class:active={roleFilter === "all"}
                onclick={() => (roleFilter = "all")}>All</button
            >
            <button
                class="filter-btn"
                class:active={roleFilter === "customer"}
                onclick={() => (roleFilter = "customer")}>Customers</button
            >
            <button
                class="filter-btn"
                class:active={roleFilter === "staff"}
                onclick={() => (roleFilter = "staff")}>Staff</button
            >
            <button
                class="filter-btn"
                class:active={roleFilter === "admin"}
                onclick={() => (roleFilter = "admin")}>Admins</button
            >
        </div>
    </div>

    <!-- Users Table -->
    <div class="table-card">
        {#if isLoading}
            <div class="loading">Loading...</div>
        {:else}
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredUsers() as user}
                        <tr>
                            <td>
                                <div class="user-cell">
                                    <div
                                        class="user-avatar"
                                        style="background: {roleColors[
                                            user.role
                                        ]}20; color: {roleColors[user.role]}"
                                    >
                                        {user.name
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </div>
                                    <span class="user-name">{user.name}</span>
                                </div>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                                <span
                                    class="role-badge"
                                    style="background: {roleColors[
                                        user.role
                                    ]}20; color: {roleColors[user.role]}"
                                >
                                    {user.role}
                                </span>
                            </td>
                            <td>
                                <span class="status-dot active"></span>
                                active
                            </td>
                            <td>{formatDate(user.created)}</td>
                            <td>
                                <div class="action-btns">
                                    <button
                                        class="icon-btn"
                                        onclick={() => openEditModal(user)}
                                        title="Edit"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                            />
                                            <path
                                                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        class="icon-btn danger"
                                        title="Delete"
                                        onclick={() =>
                                            handleDeleteUser(user.id)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <polyline points="3 6 5 6 21 6" />
                                            <path
                                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</div>

<!-- Edit/Add User Modal -->
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
                <h2>{isNewUser ? "Add User" : "Edit User"}</h2>
                <button class="close-btn" onclick={closeModal}>×</button>
            </div>
            <form
                class="modal-form"
                onsubmit={(e) => {
                    e.preventDefault();
                    handleSaveUser();
                }}
            >
                {#if errorMessage}
                    <div class="error-message">{errorMessage}</div>
                {/if}
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={editingUser.name}
                        placeholder="John Doe"
                    />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={editingUser.email}
                        placeholder="john@example.com"
                        disabled={!!editingUser?.id}
                    />
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        bind:value={editingUser.phone}
                        placeholder="416-555-0000"
                    />
                </div>
                <div class="form-group">
                    <label for="role">Role</label>
                    <select id="role" bind:value={editingUser.role}>
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>
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
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .users-page {
        color: var(--text-primary);
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
    }

    .header-left h1 {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
    }

    .header-left p {
        color: var(--text-secondary);
        margin: 0;
    }

    .add-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: var(--color-accent);
        color: var(--text-primary);
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .add-btn:hover {
        background: var(--color-accent-hover);
        transform: translateY(-1px);
    }

    .filters {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        gap: 1rem;
    }

    .search-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.4);
        flex: 1;
        max-width: 350px;
    }

    .search-box input {
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 0.875rem;
        width: 100%;
        outline: none;
    }

    .role-filters {
        display: flex;
        gap: 0.5rem;
    }

    .filter-btn {
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .filter-btn:hover {
        background: var(--glass-bg);
    }
    .filter-btn.active {
        background: var(--color-accent);
        border-color: var(--color-accent);
        color: var(--text-primary);
    }

    .table-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        border: 1px solid var(--glass-bg);
        overflow: hidden;
    }

    .loading {
        padding: 3rem;
        text-align: center;
        color: var(--text-muted);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 1rem 1.25rem;
        text-align: left;
        font-size: 0.875rem;
    }

    th {
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        background: rgba(0, 0, 0, 0.2);
    }

    td {
        border-bottom: 1px solid var(--border-color);
    }
    tr:hover td {
        background: var(--glass-bg);
    }

    .user-cell {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .user-name {
        font-weight: 500;
    }

    .role-badge {
        padding: 0.25rem 0.625rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .status-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 0.5rem;
    }

    .status-dot.active {
        background: #22c55e;
    }
    .status-dot.inactive {
        background: #6b7280;
    }

    .action-btns {
        display: flex;
        gap: 0.5rem;
    }

    .icon-btn {
        padding: 0.375rem;
        background: var(--glass-bg);
        border: none;
        color: var(--text-secondary);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .icon-btn:hover {
        background: var(--border-color);
        color: var(--text-primary);
    }
    .icon-btn.danger:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }

    /* Modal */
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

    .form-group input,
    .form-group select {
        width: 100%;
        padding: 0.75rem 1rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 0.875rem;
    }

    .form-group input:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--color-accent);
    }

    .form-group select option {
        background: var(--bg-secondary, #1e1e1e);
        color: var(--text-primary, #fff);
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
        color: rgba(255, 255, 255, 0.7);
    }

    .btn-primary {
        background: var(--color-accent);
        border: none;
        color: var(--text-primary);
    }

    @media (max-width: 768px) {
        .filters {
            flex-direction: column;
            align-items: stretch;
        }
        .search-box {
            max-width: none;
        }
        .role-filters {
            flex-wrap: wrap;
        }
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
