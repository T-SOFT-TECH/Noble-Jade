<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onMount } from "svelte";
	import { onNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import { theme } from "$lib/stores/theme";
	import { auth } from "$lib/stores/auth";
	import { setCompanyInfo } from "$lib/config/company";
	import Header from "$lib/components/shared/Header.svelte";
	import Footer from "$lib/components/shared/Footer.svelte";
	import Toast from "$lib/components/shared/Toast.svelte";

	let { children, data } = $props();

	// Set company info from server data
	$effect(() => {
		if (data?.companyInfo) {
			setCompanyInfo(data.companyInfo);
		}
	});

	// Check if current route is dashboard, staff portal, or admin (hide header/footer)
	let isPortal = $derived(
		$page.url.pathname.startsWith("/dashboard") ||
			$page.url.pathname.startsWith("/staff") ||
			$page.url.pathname.startsWith("/admin"),
	);

	onMount(() => {
		theme.initialize();
		auth.init();
	});

	// View Transitions for route changes (only affects main content)
	onNavigate((navigation) => {
		// Check if View Transitions API is supported
		if (!document.startViewTransition) return;

		// Skip transition if navigating to the same route
		if (navigation.from?.url.pathname === navigation.to?.url.pathname)
			return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&display=swap"
		rel="stylesheet"
	/>
	<title>Jade's Cleaning Services - Professional Cleaning You Can Trust</title
	>
	<meta
		name="description"
		content="Professional cleaning services for homes and offices. Trusted by 200+ clients. Book your cleaning appointment today!"
	/>
</svelte:head>

<div class="font-sans antialiased">
	{#if !isPortal}
		<Header />
	{/if}
	<main
		class="flex flex-col gap-16 mx-auto main-content"
		class:max-w-[1800px]={!isPortal}
	>
		{@render children()}
	</main>
	{#if !isPortal}
		<Footer />
	{/if}
</div>

<!-- Global Toast Notifications -->
<Toast />
