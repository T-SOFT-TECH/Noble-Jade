<script lang="ts">
    import { onMount } from "svelte";
    import {
        referrals,
        pendingReferrals,
        completedReferrals,
    } from "$lib/stores/referrals";
    import { currentUser } from "$lib/stores/auth";

    // Mock data for demonstration
    const mockReferrals = [
        {
            id: "1",
            referredName: "John Doe",
            referredEmail: "john@email.com",
            status: "rewarded",
            reward: 25,
            createdAt: "2024-11-15",
        },
        {
            id: "2",
            referredName: "Jane Smith",
            referredEmail: "jane@email.com",
            status: "completed",
            reward: 25,
            createdAt: "2024-11-28",
        },
        {
            id: "3",
            referredName: "Bob Johnson",
            referredEmail: "bob@email.com",
            status: "registered",
            reward: 25,
            createdAt: "2024-12-02",
        },
        {
            id: "4",
            referredName: "Alice Brown",
            referredEmail: "alice@email.com",
            status: "pending",
            reward: 25,
            createdAt: "2024-12-08",
        },
    ];

    const referralCode = $derived(
        $currentUser
            ? `JADE${$currentUser.id.substring(0, 6).toUpperCase()}`
            : "JADE000000",
    );

    const referralLink = $derived(
        typeof window !== "undefined"
            ? `${window.location.origin}/register?ref=${referralCode}`
            : "",
    );

    const totalEarned = mockReferrals
        .filter((r) => r.status === "rewarded")
        .reduce((sum, r) => sum + r.reward, 0);
    const pendingCount = mockReferrals.filter(
        (r) => r.status === "pending" || r.status === "registered",
    ).length;
    const completedCount = mockReferrals.filter(
        (r) => r.status === "rewarded",
    ).length;

    let showInviteModal = $state(false);
    let inviteName = $state("");
    let inviteEmail = $state("");
    let isSubmitting = $state(false);
    let copied = $state(false);

    function copyLink() {
        navigator.clipboard.writeText(referralLink);
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }

    async function sendInvite(e: Event) {
        e.preventDefault();
        if (!inviteName || !inviteEmail) return;

        isSubmitting = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        isSubmitting = false;
        showInviteModal = false;
        inviteName = "";
        inviteEmail = "";
    }

    const statusColors: Record<string, string> = {
        pending: "gray",
        registered: "blue",
        completed: "yellow",
        rewarded: "green",
    };

    const statusLabels: Record<string, string> = {
        pending: "Invite Sent",
        registered: "Signed Up",
        completed: "First Booking",
        rewarded: "Reward Earned!",
    };
</script>

<svelte:head>
    <title>Refer & Earn - Dashboard</title>
</svelte:head>

<div class="referrals-page">
    <div class="page-header">
        <h1>Refer & Earn</h1>
        <p>Earn $25 for every friend who completes their first booking</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
        <div class="stat-card green">
            <div class="stat-icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path
                        d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    />
                </svg>
            </div>
            <div class="stat-content">
                <p class="stat-value">${totalEarned}</p>
                <p class="stat-label">Total Earned</p>
            </div>
        </div>
        <div class="stat-card blue">
            <div class="stat-icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            </div>
            <div class="stat-content">
                <p class="stat-value">{pendingCount}</p>
                <p class="stat-label">Pending Referrals</p>
            </div>
        </div>
        <div class="stat-card purple">
            <div class="stat-icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            </div>
            <div class="stat-content">
                <p class="stat-value">{completedCount}</p>
                <p class="stat-label">Successful Referrals</p>
            </div>
        </div>
    </div>

    <!-- Referral Link -->
    <section class="referral-link-section">
        <h2>Your Referral Link</h2>
        <div class="link-box">
            <div class="link-display">
                <span class="link-code">{referralCode}</span>
                <input
                    type="text"
                    value={referralLink}
                    readonly
                    class="link-input"
                />
            </div>
            <div class="link-actions">
                <button class="copy-btn" onclick={copyLink}>
                    {#if copied}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                            />
                            <path
                                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                            />
                        </svg>
                        Copy Link
                    {/if}
                </button>
                <button
                    class="invite-btn"
                    onclick={() => (showInviteModal = true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Send Invite
                </button>
            </div>
        </div>

        <div class="how-it-works">
            <h3>How it works</h3>
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <p>Share your link with friends</p>
                </div>
                <div class="step-arrow">→</div>
                <div class="step">
                    <div class="step-number">2</div>
                    <p>They sign up and book</p>
                </div>
                <div class="step-arrow">→</div>
                <div class="step">
                    <div class="step-number">3</div>
                    <p>You both get $25!</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Referrals List -->
    <section class="section">
        <h2>Your Referrals</h2>

        {#if mockReferrals.length > 0}
            <div class="referrals-list">
                {#each mockReferrals as referral}
                    <div class="referral-card">
                        <div class="referral-avatar">
                            {referral.referredName.charAt(0)}
                        </div>
                        <div class="referral-info">
                            <p class="referral-name">{referral.referredName}</p>
                            <p class="referral-email">
                                {referral.referredEmail}
                            </p>
                        </div>
                        <div class="referral-meta">
                            <span
                                class="referral-status {statusColors[
                                    referral.status
                                ]}"
                            >
                                {statusLabels[referral.status]}
                            </span>
                            <span class="referral-date"
                                >{referral.createdAt}</span
                            >
                        </div>
                        {#if referral.status === "rewarded"}
                            <span class="reward-badge">+${referral.reward}</span
                            >
                        {/if}
                    </div>
                {/each}
            </div>
        {:else}
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
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h3>No referrals yet</h3>
                <p>Share your link to start earning rewards</p>
            </div>
        {/if}
    </section>
</div>

<!-- Invite Modal -->
{#if showInviteModal}
    <div class="modal-overlay" onclick={() => (showInviteModal = false)}>
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <button
                class="modal-close"
                onclick={() => (showInviteModal = false)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <h2>Invite a Friend</h2>
            <p class="modal-subtitle">
                They'll get $25 off their first booking
            </p>

            <form onsubmit={sendInvite}>
                <div class="form-group">
                    <label for="name">Friend's Name</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={inviteName}
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="email">Friend's Email</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={inviteEmail}
                        placeholder="john@email.com"
                        required
                    />
                </div>

                <button
                    type="submit"
                    class="submit-btn"
                    disabled={isSubmitting}
                >
                    {#if isSubmitting}
                        <span class="spinner"></span>
                        Sending...
                    {:else}
                        Send Invite
                    {/if}
                </button>
            </form>
        </div>
    </div>
{/if}

<style>
    .referrals-page {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .page-header h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .page-header p {
        color: var(--text-secondary);
        margin: 0;
    }

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
    }

    .stat-card {
        background: var(--bg-secondary);
        border-radius: 16px;
        padding: 1.25rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid var(--border-color);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stat-card.green .stat-icon {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
    }
    .stat-card.blue .stat-icon {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
    }
    .stat-card.purple .stat-icon {
        background: rgba(168, 85, 247, 0.1);
        color: #a855f7;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
    }

    .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    /* Referral Link Section */
    .referral-link-section {
        background: linear-gradient(
            135deg,
            rgba(232, 35, 116, 0.05),
            rgba(168, 85, 247, 0.05)
        );
        border: 1px solid rgba(232, 35, 116, 0.1);
        border-radius: 20px;
        padding: 1.5rem;
    }

    .referral-link-section h2 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem 0;
    }

    .link-box {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .link-display {
        flex: 1;
        min-width: 250px;
        display: flex;
        align-items: center;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        overflow: hidden;
    }

    .link-code {
        padding: 0.875rem 1rem;
        background: #e82374;
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .link-input {
        flex: 1;
        padding: 0.875rem;
        border: none;
        background: transparent;
        color: var(--text-primary);
        font-size: 0.875rem;
    }

    .link-actions {
        display: flex;
        gap: 0.75rem;
    }

    .copy-btn,
    .invite-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        border-radius: 50px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .copy-btn {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
    }

    .copy-btn:hover {
        background: var(--bg-tertiary);
    }

    .invite-btn {
        background: #e82374;
        border: none;
        color: white;
    }

    .invite-btn:hover {
        background: #d11d68;
    }

    /* How it works */
    .how-it-works {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color);
    }

    .how-it-works h3 {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 1rem 0;
    }

    .steps {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .step {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .step-number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #e82374;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .step p {
        margin: 0;
        color: var(--text-primary);
        font-size: 0.875rem;
    }

    .step-arrow {
        color: var(--text-muted);
    }

    /* Section */
    .section h2 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem 0;
    }

    /* Referrals List */
    .referrals-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .referral-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.25rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
    }

    .referral-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #e82374, #a855f7);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }

    .referral-info {
        flex: 1;
    }

    .referral-name {
        font-weight: 500;
        color: var(--text-primary);
        margin: 0;
    }

    .referral-email {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .referral-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.25rem;
    }

    .referral-status {
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .referral-status.gray {
        background: rgba(156, 163, 175, 0.1);
        color: #9ca3af;
    }
    .referral-status.blue {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
    }
    .referral-status.yellow {
        background: rgba(234, 179, 8, 0.1);
        color: #eab308;
    }
    .referral-status.green {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
    }

    .referral-date {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .reward-badge {
        padding: 0.5rem 1rem;
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border-radius: 50px;
        font-weight: 700;
    }

    /* Empty State */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }

    .empty-state svg {
        opacity: 0.4;
        margin-bottom: 1rem;
    }

    .empty-state h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .empty-state p {
        margin: 0;
    }

    /* Modal */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: 100;
    }

    .modal {
        background: var(--bg-primary);
        border-radius: 24px;
        padding: 2rem;
        max-width: 450px;
        width: 100%;
        position: relative;
    }

    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
    }

    .modal h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .modal-subtitle {
        color: var(--text-secondary);
        margin: 0 0 1.5rem 0;
    }

    .form-group {
        margin-bottom: 1.25rem;
    }

    .form-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }

    .form-group input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 1rem;
    }

    .form-group input:focus {
        outline: none;
        border-color: #e82374;
    }

    .submit-btn {
        width: 100%;
        padding: 1rem;
        background: #e82374;
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
        background: #d11d68;
    }

    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .spinner {
        width: 18px;
        height: 18px;
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

    @media (max-width: 768px) {
        .referral-card {
            flex-wrap: wrap;
        }

        .referral-meta {
            flex-direction: row;
            align-items: center;
            width: 100%;
            margin-top: 0.5rem;
        }

        .step-arrow {
            display: none;
        }

        .steps {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
