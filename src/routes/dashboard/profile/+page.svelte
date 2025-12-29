<script lang="ts">
    import { auth, currentUser } from "$lib/stores/auth";
    import { pb } from "$lib/pocketbase";

    let name = $state($currentUser?.name || "");
    let email = $state($currentUser?.email || "");
    let phone = $state($currentUser?.phone || "");
    let isLoading = $state(false);
    let success = $state("");
    let error = $state("");

    // Password change
    let currentPassword = $state("");
    let newPassword = $state("");
    let confirmPassword = $state("");
    let passwordLoading = $state(false);
    let passwordSuccess = $state("");
    let passwordError = $state("");

    // Initialize values when currentUser changes
    $effect(() => {
        if ($currentUser) {
            name = $currentUser.name || "";
            email = $currentUser.email || "";
            phone = $currentUser.phone || "";
        }
    });

    async function handleUpdateProfile(e: Event) {
        e.preventDefault();
        error = "";
        success = "";
        isLoading = true;

        try {
            const result = await auth.updateProfile({ name, phone });
            if (result.success) {
                success = "Profile updated successfully!";
            } else {
                error = result.error || "Failed to update profile";
            }
        } catch (err: any) {
            error = err.message || "An error occurred";
        }
        isLoading = false;
    }

    async function handleChangePassword(e: Event) {
        e.preventDefault();
        passwordError = "";
        passwordSuccess = "";

        if (newPassword !== confirmPassword) {
            passwordError = "Passwords do not match";
            return;
        }

        if (newPassword.length < 8) {
            passwordError = "Password must be at least 8 characters";
            return;
        }

        passwordLoading = true;

        try {
            await pb.collection("users").update($currentUser?.id, {
                oldPassword: currentPassword,
                password: newPassword,
                passwordConfirm: confirmPassword,
            });
            passwordSuccess = "Password changed successfully!";
            currentPassword = "";
            newPassword = "";
            confirmPassword = "";
        } catch (err: any) {
            passwordError = err.message || "Failed to change password";
        }
        passwordLoading = false;
    }
</script>

<svelte:head>
    <title>Profile Settings - Noble Jade</title>
</svelte:head>

<div class="profile-page">
    <h1 class="page-title">Profile Settings</h1>

    <div class="settings-grid">
        <!-- Profile Information -->
        <section class="settings-card">
            <div class="card-header">
                <h2>Personal Information</h2>
                <p>Update your profile details</p>
            </div>

            {#if success}
                <div class="alert success">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {success}
                </div>
            {/if}

            {#if error}
                <div class="alert error">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {error}
                </div>
            {/if}

            <form onsubmit={handleUpdateProfile}>
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={name}
                        placeholder="John Doe"
                    />
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={email}
                        disabled
                        class="disabled"
                    />
                    <small>Email cannot be changed</small>
                </div>

                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        bind:value={phone}
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                <button type="submit" class="btn-primary" disabled={isLoading}>
                    {#if isLoading}
                        <span class="spinner"></span>
                        Saving...
                    {:else}
                        Save Changes
                    {/if}
                </button>
            </form>
        </section>

        <!-- Change Password -->
        <section class="settings-card">
            <div class="card-header">
                <h2>Change Password</h2>
                <p>Update your account password</p>
            </div>

            {#if passwordSuccess}
                <div class="alert success">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {passwordSuccess}
                </div>
            {/if}

            {#if passwordError}
                <div class="alert error">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {passwordError}
                </div>
            {/if}

            <form onsubmit={handleChangePassword}>
                <div class="form-group">
                    <label for="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        bind:value={currentPassword}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        bind:value={newPassword}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        bind:value={confirmPassword}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    class="btn-secondary"
                    disabled={passwordLoading}
                >
                    {#if passwordLoading}
                        <span class="spinner"></span>
                        Changing...
                    {:else}
                        Change Password
                    {/if}
                </button>
            </form>
        </section>

        <!-- Account Actions -->
        <section class="settings-card danger-zone">
            <div class="card-header">
                <h2>Danger Zone</h2>
                <p>Irreversible account actions</p>
            </div>

            <div class="danger-actions">
                <div class="danger-item">
                    <div>
                        <h3>Delete Account</h3>
                        <p>Permanently delete your account and all data</p>
                    </div>
                    <button class="btn-danger" disabled>Delete Account</button>
                </div>
            </div>
        </section>
    </div>
</div>

<style>
    .profile-page {
        max-width: 800px;
    }

    .page-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 2rem 0;
    }

    .settings-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .settings-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 1.5rem;
    }

    .card-header {
        margin-bottom: 1.5rem;
    }

    .card-header h2 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .card-header p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .alert {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
    }

    .alert.success {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #22c55e;
    }

    .alert.error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .form-group input {
        padding: 0.875rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        font-size: 1rem;
        transition: border-color 0.2s ease;
    }

    .form-group input:focus {
        outline: none;
        border-color: #e82374;
    }

    .form-group input.disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .form-group small {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .btn-primary,
    .btn-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        align-self: flex-start;
    }

    .btn-primary {
        background: #e82374;
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: #d11d68;
    }

    .btn-secondary {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }

    .btn-secondary:hover:not(:disabled) {
        background: var(--bg-elevated);
    }

    .btn-primary:disabled,
    .btn-secondary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Danger Zone */
    .danger-zone {
        border-color: rgba(239, 68, 68, 0.3);
    }

    .danger-zone .card-header h2 {
        color: #ef4444;
    }

    .danger-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .danger-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .danger-item h3 {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
        margin: 0;
    }

    .danger-item p {
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .btn-danger {
        padding: 0.5rem 1rem;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .btn-danger:hover:not(:disabled) {
        background: #ef4444;
        color: white;
    }

    .btn-danger:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
