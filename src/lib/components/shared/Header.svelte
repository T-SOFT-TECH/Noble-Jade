<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import ThemeToggle from "./ThemeToggle.svelte";
    import { pb } from "$lib/pocketbase";
    import {
        auth,
        isAuthenticated,
        currentUser,
        getDashboardUrl,
    } from "$lib/stores/auth";
    import { defaultCompanyInfo, type CompanyInfo } from "$lib/config/company";

    let scrollY = $state(0);
    let mobileMenuOpen = $state(false);
    let userMenuOpen = $state(false);

    // Company data - will be loaded from database
    let company = $state<CompanyInfo>(defaultCompanyInfo);

    // Load company data from PocketBase
    onMount(async () => {
        try {
            const settingsRecords = await pb
                .collection("settings")
                .getFullList();
            const settings: Record<string, any> = {};
            for (const record of settingsRecords) {
                settings[record.key] = record.value;
            }

            company = {
                ...defaultCompanyInfo,
                socialLinks: {
                    facebook:
                        settings.social_facebook ||
                        defaultCompanyInfo.socialLinks.facebook,
                    instagram:
                        settings.social_instagram ||
                        defaultCompanyInfo.socialLinks.instagram,
                    twitter:
                        settings.social_twitter ||
                        defaultCompanyInfo.socialLinks.twitter,
                    linkedin:
                        settings.social_linkedin ||
                        defaultCompanyInfo.socialLinks.linkedin,
                },
            };
            console.log("[Header] Loaded social links from database");
        } catch (error) {
            console.error("[Header] Error loading company data:", error);
        }
    });

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/services" },
        { name: "About", href: "/about" },
        { name: "Pricing", href: "/pricing" },
        { name: "Blog", href: "/blog" },
        { name: "Get Quote", href: "/get-quote" },
        { name: "Contact", href: "/contact" },
    ];

    function handleLogout() {
        auth.logout();
        userMenuOpen = false;
        goto("/");
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

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }
</script>

<svelte:window bind:scrollY />

<header class="fixed top-0 left-0 w-full z-50 py-4 lg:py-6">
    <div class="max-w-[1800px] mx-auto flex items-start gap-4">
        <!-- Logo Bubble - White/Dark with curved bottom-right corner -->
        <div
            class="logo-bubble bg-primary relative z-20 flex items-center shrink-0"
        >
            <a href="/" class="block">
                <img
                    src="/images/noble-jade-logo-2.webp"
                    alt="Noble Jade Janitorial Services"
                    class="h-16 w-auto"
                />
            </a>
        </div>

        <!-- Navigation Container - Frosted glass effect (dark in both modes) -->
        <div
            class="nav-container flex-1 flex items-center justify-between px-6 lg:px-8 py-3 rounded-full transition-all duration-300"
            class:scrolled={scrollY > 50}
        >
            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center gap-8 font-medium text-sm">
                {#each navItems as item}
                    {@const isActive =
                        $page.url.pathname === item.href ||
                        (item.href !== "/" &&
                            $page.url.pathname.startsWith(item.href))}
                    <a
                        href={item.href}
                        class="nav-link relative py-2 transition-colors group {isActive
                            ? 'active'
                            : ''}"
                    >
                        {item.name}
                        <span
                            class="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transition-transform duration-300 origin-left {isActive
                                ? 'scale-x-100'
                                : 'scale-x-0 group-hover:scale-x-100'}"
                        ></span>
                    </a>
                {/each}
            </nav>

            <!-- Right side actions -->
            <div class="hidden lg:flex items-center gap-4 ml-auto">
                <!-- Social Icons -->
                <div class="flex items-center gap-3">
                    {#if company.socialLinks.instagram}
                        <a
                            href={company.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="nav-icon"
                            aria-label="Instagram"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect
                                    width="20"
                                    height="20"
                                    x="2"
                                    y="2"
                                    rx="5"
                                    ry="5"
                                />
                                <path
                                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                                />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                        </a>
                    {/if}
                    {#if company.socialLinks.facebook}
                        <a
                            href={company.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="nav-icon"
                            aria-label="Facebook"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                                />
                            </svg>
                        </a>
                    {/if}
                    {#if company.socialLinks.twitter}
                        <a
                            href={company.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="nav-icon"
                            aria-label="Twitter"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                                />
                            </svg>
                        </a>
                    {/if}
                    {#if company.socialLinks.linkedin}
                        <a
                            href={company.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="nav-icon"
                            aria-label="LinkedIn"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                                />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </a>
                    {/if}
                </div>

                <!-- Theme Toggle -->
                <ThemeToggle />

                <!-- Auth Buttons / User Menu -->
                {#if $isAuthenticated && $currentUser}
                    <div class="user-menu-container relative">
                        <button
                            class="user-avatar-btn flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                            onclick={() => (userMenuOpen = !userMenuOpen)}
                        >
                            <div
                                class="user-avatar w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold text-sm"
                            >
                                {getInitials($currentUser.name)}
                            </div>
                        </button>

                        {#if userMenuOpen}
                            <div
                                class="user-dropdown absolute right-0 top-full mt-2 w-56 rounded-xl bg-theme-primary border border-theme shadow-lg overflow-hidden z-50"
                            >
                                <div class="p-4 border-b border-theme">
                                    <p
                                        class="font-medium text-theme-primary text-sm"
                                    >
                                        {$currentUser.name}
                                    </p>
                                    <p
                                        class="text-xs text-theme-secondary truncate"
                                    >
                                        {$currentUser.email}
                                    </p>
                                </div>
                                <div class="p-2">
                                    <a
                                        href="/dashboard"
                                        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-theme-primary hover:bg-accent/10 transition-colors"
                                        onclick={() => (userMenuOpen = false)}
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
                                            <rect
                                                x="3"
                                                y="3"
                                                width="7"
                                                height="7"
                                            />
                                            <rect
                                                x="14"
                                                y="3"
                                                width="7"
                                                height="7"
                                            />
                                            <rect
                                                x="14"
                                                y="14"
                                                width="7"
                                                height="7"
                                            />
                                            <rect
                                                x="3"
                                                y="14"
                                                width="7"
                                                height="7"
                                            />
                                        </svg>
                                        Dashboard
                                    </a>
                                    <a
                                        href="/dashboard/bookings"
                                        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-theme-primary hover:bg-accent/10 transition-colors"
                                        onclick={() => (userMenuOpen = false)}
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
                                            <rect
                                                x="3"
                                                y="4"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                ry="2"
                                            />
                                            <line
                                                x1="16"
                                                y1="2"
                                                x2="16"
                                                y2="6"
                                            />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line
                                                x1="3"
                                                y1="10"
                                                x2="21"
                                                y2="10"
                                            />
                                        </svg>
                                        My Bookings
                                    </a>
                                    <a
                                        href="/dashboard/profile"
                                        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-theme-primary hover:bg-accent/10 transition-colors"
                                        onclick={() => (userMenuOpen = false)}
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
                                                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                            />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        Profile
                                    </a>
                                </div>
                                <div class="p-2 border-t border-theme">
                                    <button
                                        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                        onclick={handleLogout}
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
                                                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                            />
                                            <polyline
                                                points="16 17 21 12 16 7"
                                            />
                                            <line
                                                x1="21"
                                                y1="12"
                                                x2="9"
                                                y2="12"
                                            />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </div>
                {:else}
                    <a href="/login" class="nav-link font-medium text-sm">
                        Login
                    </a>
                    <a href="/get-quote" class="btn-accent text-sm">
                        Get Quote
                    </a>
                {/if}
            </div>

            <!-- Mobile Menu Button -->
            <button
                class="lg:hidden ml-auto p-2 text-white"
                onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
            </button>
        </div>
    </div>
</header>

<!-- Full Screen Mobile Menu -->
<div class="mobile-menu-overlay lg:hidden" class:open={mobileMenuOpen}>
    <div class="mobile-menu-content">
        <!-- Close Button -->
        <button
            class="mobile-close-btn"
            onclick={closeMobileMenu}
            aria-label="Close menu"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>

        <!-- Logo -->
        <div class="mobile-logo">
            <img
                src="/images/noble-jade-logo-2.webp"
                alt="Noble Jade"
                class="h-12 brightness-0 invert"
            />
        </div>

        <!-- Navigation Links with Stagger Animation -->
        <nav class="mobile-nav">
            {#each navItems as item, index}
                {@const isActive =
                    $page.url.pathname === item.href ||
                    (item.href !== "/" &&
                        $page.url.pathname.startsWith(item.href))}
                <a
                    href={item.href}
                    class="mobile-nav-item {isActive ? 'active' : ''}"
                    style="--delay: {index * 0.05}s"
                    onclick={closeMobileMenu}
                >
                    {item.name}
                </a>
            {/each}
        </nav>

        <!-- Bottom Section -->
        <div class="mobile-bottom">
            <div class="mobile-actions">
                <ThemeToggle />
                {#if $isAuthenticated && $currentUser}
                    <a
                        href="/dashboard"
                        class="mobile-cta"
                        onclick={closeMobileMenu}
                    >
                        Dashboard
                    </a>
                {:else}
                    <a
                        href="/login"
                        class="mobile-login"
                        onclick={closeMobileMenu}
                    >
                        Login
                    </a>
                    <a
                        href="/get-quote"
                        class="mobile-cta"
                        onclick={closeMobileMenu}
                    >
                        Get Quote
                    </a>
                {/if}
            </div>

            <!-- Social Links -->
            <div class="mobile-social">
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
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
                        <rect
                            width="20"
                            height="20"
                            x="2"
                            y="2"
                            rx="5"
                            ry="5"
                        />
                        <path
                            d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                        />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                </a>
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
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
                        <path
                            d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                        />
                    </svg>
                </a>
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
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
                        <path
                            d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
                        />
                    </svg>
                </a>
            </div>
        </div>
    </div>
</div>

<style>
    .logo-bubble {
        background: var(--bg-primary);
        padding: 0.5rem 1.2rem;
        border-bottom-right-radius: 40px;
    }

    /* Curved pseudo-elements for logo bubble */
    .logo-bubble::before {
        content: "";
        position: absolute;
        width: 30px;
        height: 30px;
        background: var(--bg-primary);
        bottom: -30px;
        left: 0;
        -webkit-mask-image: var(--shape-mask);
        mask-image: var(--shape-mask);
        transform: rotate(90deg);
    }

    .logo-bubble::after {
        content: "";
        position: absolute;
        width: 30px;
        height: 30px;
        background: var(--bg-primary);
        top: 0;
        right: -30px;
        -webkit-mask-image: var(--shape-mask);
        mask-image: var(--shape-mask);
        transform: rotate(90deg);
    }

    /* Nav container with fixed dark styling */
    .nav-container {
        background: rgba(20, 20, 30, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-container.scrolled {
        background: rgba(10, 10, 20, 0.95);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    }

    /* Nav links - always light on dark bg */
    .nav-link {
        color: rgba(255, 255, 255, 0.85);
        transition: color 0.2s ease;
    }

    .nav-link:hover {
        color: #e82374;
    }

    .nav-link.active {
        color: #e82374;
        font-weight: 600;
    }

    .nav-icon {
        color: rgba(255, 255, 255, 0.7);
        transition: color 0.2s ease;
    }

    .nav-icon:hover {
        color: #e82374;
    }

    /* Full Screen Mobile Menu */
    .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(
            135deg,
            #1a1a2e 0%,
            #16213e 50%,
            #0f3460 100%
        );
        z-index: 100;
        transform: translateX(-100%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-y: auto;
    }

    .mobile-menu-overlay.open {
        transform: translateX(0);
    }

    .mobile-menu-content {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 2rem;
    }

    .mobile-close-btn {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        color: white;
        opacity: 0.8;
        transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
    }

    .mobile-close-btn:hover {
        opacity: 1;
        transform: rotate(90deg);
    }

    .mobile-logo {
        margin-bottom: 3rem;
    }

    .mobile-nav {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .mobile-nav-item {
        font-size: 1.75rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        padding: 0.75rem 0;
        text-decoration: none;
        transition:
            color 0.2s ease,
            transform 0.2s ease;
        opacity: 0;
        transform: translateX(-30px);
    }

    .mobile-menu-overlay.open .mobile-nav-item {
        animation: slideInStagger 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        animation-delay: var(--delay);
    }

    .mobile-nav-item:hover {
        color: #e82374;
        transform: translateX(10px);
    }

    .mobile-nav-item.active {
        color: #e82374;
        font-weight: 600;
    }

    @keyframes slideInStagger {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .mobile-bottom {
        margin-top: auto;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .mobile-login {
        color: white;
        font-weight: 500;
        text-decoration: none;
        padding: 0.75rem 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 50px;
        transition: all 0.2s ease;
    }

    .mobile-login:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .mobile-cta {
        background: #e82374;
        color: white;
        font-weight: 600;
        text-decoration: none;
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        transition: all 0.2s ease;
    }

    .mobile-cta:hover {
        background: #d11d68;
        transform: translateY(-2px);
    }

    .mobile-social {
        display: flex;
        gap: 1.5rem;
    }

    .mobile-social a {
        color: rgba(255, 255, 255, 0.6);
        transition:
            color 0.2s ease,
            transform 0.2s ease;
    }

    .mobile-social a:hover {
        color: #e82374;
        transform: translateY(-3px);
    }
</style>
