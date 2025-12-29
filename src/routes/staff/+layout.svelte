<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { auth, isAuthenticated, currentUser } from "$lib/stores/auth";

    let { children } = $props();
    let isLoading = $state(true);
    let sidebarOpen = $state(false);

    // Job stages for reference
    const jobStages = [
        { id: 1, name: "Assigned", color: "gray" },
        { id: 2, name: "En Route", color: "blue" },
        { id: 3, name: "Arrived", color: "purple" },
        { id: 4, name: "In Progress", color: "yellow" },
        { id: 5, name: "Photo Upload", color: "orange" },
        { id: 6, name: "Completed", color: "green" },
    ];

    // Route protection - redirect to login if not authenticated
    // In production, also check for staff role
    onMount(() => {
        auth.init();
        const unsubscribe = auth.subscribe((state) => {
            isLoading = state.isLoading;
            if (!state.isLoading && !state.isAuthenticated) {
                goto("/login");
            }
        });
        return unsubscribe;
    });

    function handleLogout() {
        auth.logout();
        goto("/");
    }

    function getInitials(name: string | undefined): string {
        if (!name) return "S";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    const sidebarLinks = [
        { name: "Dashboard", href: "/staff", icon: "home" },
        { name: "My Jobs", href: "/staff/jobs", icon: "briefcase" },
        { name: "Schedule", href: "/staff/schedule", icon: "calendar" },
        { name: "Messages", href: "/staff/messages", icon: "message" },
        { name: "Profile", href: "/staff/profile", icon: "user" },
    ];
</script>

<svelte:head>
    <title>Staff Portal - Noble Jade Cleaning Services</title>
</svelte:head>

{#if isLoading}
    <div class="loading-screen">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>
{:else if $isAuthenticated && $currentUser}
    <div class="staff-layout">
        <!-- Sidebar -->
        <aside class="sidebar" class:open={sidebarOpen}>
            <div class="sidebar-header">
                <a href="/" class="logo">
                    <img
                        src="/images/noble-jade-logo-2.webp"
                        alt="Noble Jade"
                        class="h-10"
                    />
                </a>
                <span class="portal-badge">Staff Portal</span>
            </div>

            <nav class="sidebar-nav">
                {#each sidebarLinks as link}
                    <a
                        href={link.href}
                        class="sidebar-link"
                        class:active={$page.url.pathname === link.href}
                        onclick={() => (sidebarOpen = false)}
                    >
                        {#if link.icon === "home"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                                />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        {:else if link.icon === "briefcase"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <rect
                                    x="2"
                                    y="7"
                                    width="20"
                                    height="14"
                                    rx="2"
                                    ry="2"
                                />
                                <path
                                    d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                                />
                            </svg>
                        {:else if link.icon === "calendar"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        {:else if link.icon === "message"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                                />
                            </svg>
                        {:else if link.icon === "user"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        {/if}
                        <span>{link.name}</span>
                    </a>
                {/each}
            </nav>

            <div class="sidebar-footer">
                <a href="/dashboard" class="switch-portal">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M17 1l4 4-4 4" />
                        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                        <path d="M7 23l-4-4 4-4" />
                        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    <span>Customer Portal</span>
                </a>
                <button class="logout-btn" onclick={handleLogout}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </aside>

        <!-- Mobile Header -->
        <div class="mobile-header lg:hidden">
            <button
                class="menu-btn"
                onclick={() => (sidebarOpen = !sidebarOpen)}
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
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
            </button>
            <span class="mobile-title">Staff Portal</span>
            <div class="mobile-avatar">
                {getInitials($currentUser.name)}
            </div>
        </div>

        <!-- Mobile Overlay -->
        {#if sidebarOpen}
            <div
                class="sidebar-overlay"
                onclick={() => (sidebarOpen = false)}
            ></div>
        {/if}

        <!-- Main Content -->
        <main class="staff-main">
            <header class="staff-header hidden lg:flex">
                <div class="header-left">
                    <h1>
                        Welcome, {$currentUser.name?.split(" ")[0] || "Staff"}!
                    </h1>
                </div>
                <div class="header-right">
                    <div class="user-info">
                        <div class="user-avatar">
                            {getInitials($currentUser.name)}
                        </div>
                        <div class="user-details">
                            <span class="user-name">{$currentUser.name}</span>
                            <span class="user-role">Staff Member</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="staff-content">
                {@render children()}
            </div>
        </main>
    </div>
{/if}

<style>
    .loading-screen {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        background: var(--bg-primary);
        color: var(--text-primary);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border-color);
        border-top-color: #22c55e;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .staff-layout {
        display: grid;
        grid-template-columns: 260px 1fr;
        min-height: 100vh;
        background: var(--bg-primary);
    }

    /* Sidebar */
    .sidebar {
        background: linear-gradient(
            180deg,
            #064e3b 0%,
            #065f46 50%,
            #047857 100%
        );
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        position: sticky;
        top: 0;
        height: 100vh;
    }

    .sidebar-header {
        margin-bottom: 2rem;
    }

    .sidebar-header .logo img {
        filter: brightness(0) invert(1);
    }

    .portal-badge {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.25rem 0.75rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
        letter-spacing: 0.02em;
    }

    .sidebar-nav {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .sidebar-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-radius: 12px;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .sidebar-link:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .sidebar-link.active {
        background: #22c55e;
        color: white;
    }

    .sidebar-footer {
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .switch-portal {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .switch-portal:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .logout-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-radius: 12px;
        color: rgba(255, 255, 255, 0.7);
        background: none;
        border: none;
        width: 100%;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .logout-btn:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
    }

    /* Mobile Header */
    .mobile-header {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(90deg, #064e3b, #047857);
        padding: 0 1rem;
        align-items: center;
        justify-content: space-between;
        z-index: 40;
    }

    .menu-btn {
        padding: 0.5rem;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
    }

    .mobile-title {
        font-weight: 600;
        color: white;
    }

    .mobile-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #22c55e;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .sidebar-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 45;
    }

    /* Main Content */
    .staff-main {
        display: flex;
        flex-direction: column;
    }

    .staff-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 2rem;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
    }

    .staff-header h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #22c55e;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .user-details {
        display: flex;
        flex-direction: column;
    }

    .user-name {
        font-weight: 500;
        color: var(--text-primary);
        font-size: 0.875rem;
    }

    .user-role {
        font-size: 0.75rem;
        color: #22c55e;
        font-weight: 500;
    }

    .staff-content {
        flex: 1;
        padding: 2rem;
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
        .staff-layout {
            grid-template-columns: 1fr;
        }

        .sidebar {
            position: fixed;
            left: -100%;
            width: 260px;
            z-index: 50;
            transition: left 0.3s ease;
        }

        .sidebar.open {
            left: 0;
        }

        .sidebar-overlay {
            display: block;
        }

        .mobile-header {
            display: flex;
        }

        .staff-main {
            padding-top: 60px;
        }

        .staff-content {
            padding: 1rem;
        }
    }
</style>
