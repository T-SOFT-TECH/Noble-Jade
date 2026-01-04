<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { auth, isAuthenticated, currentUser } from "$lib/stores/auth";
    import "./admin.css";

    let { children } = $props();
    let isLoading = $state(true);
    let sidebarCollapsed = $state(false);
    let isDarkMode = $state(true);
    let isSidebarOpen = $state(false);

    // Route protection - redirect if not admin
    onMount(() => {
        auth.init();
        const unsubscribe = auth.subscribe((state) => {
            isLoading = state.isLoading;
            if (!state.isLoading) {
                if (!state.isAuthenticated) {
                    goto("/login");
                } else if (state.user?.role !== "admin") {
                    // Not an admin, redirect to appropriate dashboard
                    if (state.user?.role === "staff") {
                        goto("/staff");
                    } else {
                        goto("/dashboard");
                    }
                }
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
        if (!name) return "A";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    const sidebarLinks = [
        { name: "Dashboard", href: "/admin", icon: "dashboard" },
        { name: "Bookings", href: "/admin/bookings", icon: "calendar" },
        { name: "Messages", href: "/admin/messages", icon: "mail" },
        { name: "Users", href: "/admin/users", icon: "users" },
        { name: "Staff", href: "/admin/staff", icon: "badge" },
        { name: "Services", href: "/admin/services", icon: "sparkle" },
        { name: "Pricing", href: "/admin/pricing", icon: "dollar" },
        { name: "Calculator", href: "/admin/calculator", icon: "calculator" },
        { name: "Blog", href: "/admin/blog", icon: "article" },
        { name: "FAQs", href: "/admin/faqs", icon: "help" },
        { name: "Testimonials", href: "/admin/testimonials", icon: "quote" },
        { name: "Statistics", href: "/admin/statistics", icon: "chart" },
        { name: "Service Areas", href: "/admin/service-areas", icon: "map" },
        { name: "Reviews", href: "/admin/reviews", icon: "star" },
        { name: "Settings", href: "/admin/settings", icon: "settings" },
    ];

    function isActive(href: string): boolean {
        if (href === "/admin") {
            return $page?.url?.pathname === "/admin";
        }
        return $page?.url?.pathname?.startsWith(href) || false;
    }
</script>

<svelte:head>
    <title>Admin Dashboard - Noble Jade</title>
</svelte:head>

{#if isLoading}
    <div class="loading-screen">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>
{:else if $isAuthenticated && $currentUser?.role === "admin"}
    <div class="admin-layout" class:collapsed={sidebarCollapsed}>
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
                <a href="/admin" class="logo" onclick={closeSidebar}>
                    <img
                        src="/images/noble-jade-logo-2.webp"
                        alt="Noble Jade"
                        class="logo-img"
                    />
                </a>
                <span class="admin-badge">Admin</span>
                <button class="close-sidebar-btn lg:hidden" onclick={closeSidebar} aria-label="Close menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <nav class="sidebar-nav">
                {#each sidebarLinks as link}
                    <a
                        href={link.href}
                        class="sidebar-link"
                        class:active={isActive(link.href)}
                        onclick={closeSidebar}
                    >
                        {#if link.icon === "dashboard"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
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
                        {:else if link.icon === "mail"}
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
                                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                                />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        {:else if link.icon === "users"}
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
                                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                                />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        {:else if link.icon === "badge"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        {:else if link.icon === "sparkle"}
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
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                />
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
                        {:else if link.icon === "dollar"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
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
                        {:else if link.icon === "help"}
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
                                <path
                                    d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                                />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        {:else if link.icon === "article"}
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
                                    d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"
                                />
                                <polyline points="14 2 14 8 20 8" />
                                <path d="M2 15h10" />
                                <path d="M2 19h10" />
                                <path d="M2 11h10" />
                            </svg>
                        {:else if link.icon === "quote"}
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
                                    d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"
                                />
                                <path
                                    d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"
                                />
                            </svg>
                        {:else if link.icon === "chart"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                        {:else if link.icon === "map"}
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
                                    points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"
                                />
                                <line x1="8" y1="2" x2="8" y2="18" />
                                <line x1="16" y1="6" x2="16" y2="22" />
                            </svg>
                        {:else if link.icon === "calculator"}
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
                                    x="4"
                                    y="2"
                                    width="16"
                                    height="20"
                                    rx="2"
                                />
                                <line x1="8" y1="6" x2="16" y2="6" />
                                <line x1="8" y1="10" x2="10" y2="10" />
                                <line x1="14" y1="10" x2="16" y2="10" />
                                <line x1="8" y1="14" x2="10" y2="14" />
                                <line x1="14" y1="14" x2="16" y2="14" />
                                <line x1="8" y1="18" x2="10" y2="18" />
                                <line x1="14" y1="18" x2="16" y2="18" />
                            </svg>
                        {:else if link.icon === "settings"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <circle cx="12" cy="12" r="3" />
                                <path
                                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                                />
                            </svg>
                        {/if}
                        <span>{link.name}</span>
                    </a>
                {/each}
            </nav>

            <div class="sidebar-footer">
                <a href="/" class="portal-switch">
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
                            d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>View Site</span>
                </a>
                <button class="logout-btn" onclick={handleLogout}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
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
        <main class="main-content">
            <!-- Top Header -->
            <header class="top-header">
                <div class="header-left">
                    <button
                        class="menu-toggle desktop-toggle"
                        onclick={() => (sidebarCollapsed = !sidebarCollapsed)}
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
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <button
                        class="menu-toggle mobile-toggle"
                        onclick={toggleSidebar}
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
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
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
                        <input type="text" placeholder="Search..." />
                    </div>
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

                    <button class="notification-btn">
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
                                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                            />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span class="notification-badge">3</span>
                    </button>
                    <div class="user-info">
                        <div class="user-avatar">
                            {getInitials($currentUser?.name)}
                        </div>
                        <div class="user-details">
                            <span class="user-name"
                                >{$currentUser?.name || "Admin"}</span
                            >
                            <span class="user-role">Administrator</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <div class="page-content">
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
        border-top-color: var(--color-accent);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .admin-layout {
        display: flex;
        min-height: 100vh;
        background: var(--bg-primary);
    }

    /* Sidebar */
    .sidebar {
        width: 260px;
        background: var(--bg-secondary);
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--border-color);
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 50;
        transition: transform 0.3s ease;
    }

    .admin-layout.collapsed .sidebar {
        transform: translateX(-100%);
    }

    .sidebar-header {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .close-sidebar-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        display: none; /* Hidden on desktop */
    }

    .logo {
        display: flex;
        align-items: center;
    }

    .logo-img {
        height: 36px;
    }

    /* Overlay */
    .sidebar-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 45; /* Below sidebar (50) but above everything else */
        animation: fade-in 0.2s ease-out;
    }

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .admin-badge {
        padding: 0.25rem 0.625rem;
        background: linear-gradient(
            135deg,
            var(--color-accent),
            var(--color-alternate)
        );
        color: white;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .sidebar-nav {
        flex: 1;
        padding: 1rem 0;
        overflow-y: auto;
    }

    .sidebar-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1.5rem;
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.9375rem;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;
    }

    .sidebar-link:hover {
        color: var(--text-primary);
        background: var(--glass-bg);
    }

    .sidebar-link.active {
        color: var(--text-primary);
        background: rgba(37, 99, 235, 0.1);
        border-left-color: var(--color-accent);
    }

    .sidebar-link svg {
        flex-shrink: 0;
    }

    .sidebar-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .portal-switch,
    .logout-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 0.875rem;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
        text-decoration: none;
    }

    .portal-switch:hover,
    .logout-btn:hover {
        color: var(--text-primary);
        background: var(--glass-bg);
    }

    .logout-btn:hover {
        color: #ef4444;
    }

    /* Main Content */
    .main-content {
        flex: 1;
        margin-left: 260px;
        display: flex;
        flex-direction: column;
        transition: margin-left 0.3s ease;
        view-transition-name: admin-content;
    }

    .admin-layout.collapsed .main-content {
        margin-left: 0;
    }

    .top-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        position: sticky;
        top: 0;
        z-index: 40;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .menu-toggle {
        padding: 0.5rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .menu-toggle:hover {
        color: var(--text-primary);
        background: var(--glass-bg);
    }

    .desktop-toggle {
        display: block;
    }

    .mobile-toggle {
        display: none;
    }

    .search-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--glass-bg);
        border-radius: 8px;
        color: var(--text-muted);
    }

    .search-box input {
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 0.875rem;
        width: 200px;
        outline: none;
    }

    .search-box input::placeholder {
        color: var(--text-muted);
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .theme-toggle-btn {
        padding: 0.5rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .theme-toggle-btn:hover {
        color: var(--color-accent);
        border-color: var(--color-accent);
        background: var(--glass-bg-hover);
    }

    .notification-btn {
        position: relative;
        padding: 0.5rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .notification-btn:hover {
        color: var(--text-primary);
        background: var(--glass-bg);
    }

    .notification-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 18px;
        height: 18px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        font-size: 0.625rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(
            135deg,
            var(--color-accent),
            var(--color-alternate)
        );
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
        color: var(--text-primary);
        font-weight: 500;
        font-size: 0.875rem;
    }

    .user-role {
        color: var(--text-muted);
        font-size: 0.75rem;
    }

    .page-content {
        flex: 1;
        padding: 1.5rem;
    }

    @media (max-width: 1024px) {
        .sidebar {
            transform: translateX(-100%);
            left: 0; /* Reset position for mobile */
        }

        .sidebar.open {
            transform: translateX(0);
        }

        .admin-layout:not(.collapsed) .sidebar {
            transform: translateX(-100%); /* Default hidden on mobile unless open class is present */
        }

        .main-content {
            margin-left: 0;
        }

        .search-box {
            display: none;
        }

        .desktop-toggle {
            display: none;
        }

        .mobile-toggle {
            display: block;
        }

        .close-sidebar-btn {
            display: block;
        }
        
        .user-details {
            display: none;
        }
    }
</style>
