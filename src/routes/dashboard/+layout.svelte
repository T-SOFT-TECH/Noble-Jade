<script context="module">
    import { page } from "$app/stores";
</script>

<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { auth, isAuthenticated, currentUser } from "$lib/stores/auth";

    let { children } = $props();
    let isLoading = $state(true);
    let isDarkMode = $state(true);
    let isSidebarOpen = $state(false);

    // Route protection - redirect to login if not authenticated
    onMount(() => {
        auth.init();
        const unsubscribe = auth.subscribe((state) => {
            isLoading = state.isLoading;
            if (!state.isLoading && !state.isAuthenticated) {
                goto("/login");
            }
        });
        initTheme();
        return unsubscribe;
    });

    function handleLogout() {
        auth.logout();
        goto("/");
    }

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    function closeSidebar() {
        isSidebarOpen = false;
    }

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        const html = document.documentElement;
        if (isDarkMode) {
            html.classList.remove("light");
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            html.classList.remove("dark");
            html.classList.add("light");
            localStorage.setItem("theme", "light");
        }
    }

    function initTheme() {
        const savedTheme = localStorage.getItem("theme");
        const html = document.documentElement;
        if (savedTheme === "light") {
            isDarkMode = false;
            html.classList.remove("dark");
            html.classList.add("light");
        } else {
            isDarkMode = true;
            html.classList.add("dark");
            html.classList.remove("light");
        }
    }

    function getInitials(name: string | undefined): string {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    const sidebarLinks = [
        { name: "Dashboard", href: "/dashboard", icon: "home" },
        { name: "Book a Cleaning", href: "/dashboard/book", icon: "plus" },
        { name: "My Bookings", href: "/dashboard/bookings", icon: "calendar" },
        { name: "Reviews", href: "/dashboard/reviews", icon: "star" },
        { name: "Refer & Earn", href: "/dashboard/referrals", icon: "gift" },
        { name: "Wallet", href: "/dashboard/wallet", icon: "wallet" },
        { name: "Profile", href: "/dashboard/profile", icon: "user" },
    ];
</script>

<svelte:head>
    <title>Dashboard - Noble Jade Cleaning Services</title>
</svelte:head>

{#if isLoading}
    <div class="loading-screen">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>
{:else if $isAuthenticated && $currentUser}
    <div class="dashboard-layout">
        <!-- Mobile Sidebar Overlay -->
        {#if isSidebarOpen}
            <div
                class="sidebar-overlay"
                onclick={closeSidebar}
                onkeydown={(e) => e.key === 'Escape' && closeSidebar()}
                role="button"
                tabindex="0"
                aria-label="Close sidebar"
            ></div>
        {/if}

        <!-- Sidebar -->
        <aside class="sidebar" class:open={isSidebarOpen}>
            <div class="sidebar-header">
                <a href="/" class="logo" onclick={closeSidebar}>
                    <img
                        src="/images/noble-jade-logo-2.webp"
                        alt="Noble Jade"
                        class="h-10"
                    />
                </a>
                <button class="close-sidebar-btn lg:hidden" onclick={closeSidebar} aria-label="Close menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <nav class="sidebar-nav">
                {#each sidebarLinks as link}
                    <a
                        href={link.href}
                        class="sidebar-link"
                        class:active={$page?.url?.pathname === link.href}
                        onclick={closeSidebar}
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
                        {:else if link.icon === "plus"}
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
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                        {:else if link.icon === "wallet"}
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
                                    x="1"
                                    y="4"
                                    width="22"
                                    height="16"
                                    rx="2"
                                    ry="2"
                                />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                        {:else if link.icon === "star"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polygon
                                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                />
                            </svg>
                        {:else if link.icon === "gift"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polyline points="20 12 20 22 4 22 4 12" />
                                <rect x="2" y="7" width="20" height="5" />
                                <line x1="12" y1="22" x2="12" y2="7" />
                                <path
                                    d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"
                                />
                                <path
                                    d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
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

        <!-- Main Content -->
        <main class="dashboard-main">
            <!-- Top Bar -->
            <header class="dashboard-header">
                <div class="header-left">
                    <button class="menu-toggle-btn lg:hidden" onclick={toggleSidebar} aria-label="Toggle menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <h1 class="page-title">
                        Welcome back, {$currentUser.name?.split(" ")[0] ||
                            "User"}!
                    </h1>
                </div>
                <div class="header-right">
                    <!-- Theme Toggle -->
                    <button
                        class="theme-toggle-btn"
                        onclick={toggleTheme}
                        aria-label={isDarkMode
                            ? "Switch to light mode"
                            : "Switch to dark mode"}
                    >
                        {#if isDarkMode}
                            <!-- Sun icon for switching to light -->
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line
                                    x1="18.36"
                                    y1="18.36"
                                    x2="19.78"
                                    y2="19.78"
                                />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line
                                    x1="4.22"
                                    y1="19.78"
                                    x2="5.64"
                                    y2="18.36"
                                />
                                <line
                                    x1="18.36"
                                    y1="5.64"
                                    x2="19.78"
                                    y2="4.22"
                                />
                            </svg>
                        {:else}
                            <!-- Moon icon for switching to dark -->
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
                                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                                />
                            </svg>
                        {/if}
                    </button>

                    <a href="/" class="back-to-site">
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
                                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                            />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Back to Site
                    </a>
                    <div class="user-info">
                        <div class="user-avatar">
                            {getInitials($currentUser.name)}
                        </div>
                        <div class="user-details">
                            <span class="user-name">{$currentUser.name}</span>
                            <span class="user-email">{$currentUser.email}</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <div class="dashboard-content">
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
        border-top-color: #e82374;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .dashboard-layout {
        display: grid;
        grid-template-columns: 260px 1fr;
        min-height: 100vh;
        background: var(--bg-primary);
    }

    /* Sidebar */
    .sidebar {
        background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        position: sticky;
        top: 0;
        height: 100vh;
    }

    .sidebar-header {
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .close-sidebar-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        padding: 0.5rem;
    }

    .sidebar-header .logo img {
        filter: brightness(0) invert(1);
    }

    /* Overlay */
    .sidebar-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 90;
        animation: fade-in 0.2s ease-out;
    }

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .menu-toggle-btn {
        background: none;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        padding: 0.5rem;
        display: none;
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
        .menu-toggle-btn {
            display: flex;
        }
        
        .dashboard-layout {
            grid-template-columns: 1fr;
        }

        .sidebar {
            position: fixed;
            left: -100%;
            width: 260px;
            z-index: 100;
            transition: left 0.3s ease;
        }

        .sidebar.open {
            left: 0;
        }

        .dashboard-header {
            padding: 1rem;
        }

        .page-title {
            font-size: 1.25rem;
        }

        .user-details {
            display: none;
        }
    }
</style>
