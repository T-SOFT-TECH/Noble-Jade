<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onMount } from "svelte";
	import { onNavigate } from "$app/navigation";
	import { theme } from "$lib/stores/theme";
	import { auth } from "$lib/stores/auth";
	import Header from "$lib/components/shared/Header.svelte";
	import Footer from "$lib/components/shared/Footer.svelte";

	let { children } = $props();

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
	<Header />
	<main class="flex flex-col gap-16 max-w-[1800px] mx-auto main-content">
		{@render children()}
	</main>
	<Footer />
</div>
