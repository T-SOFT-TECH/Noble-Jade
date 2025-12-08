<script lang="ts">
    import { theme } from '$lib/stores/theme';
    import { onMount } from 'svelte';

    let mounted = $state(false);
    let currentTheme = $state<'dark' | 'light'>('dark');

    onMount(() => {
        mounted = true;
        theme.initialize();
    });

    // Subscribe to theme changes
    $effect(() => {
        const unsubscribe = theme.subscribe(value => {
            currentTheme = value;
        });
        return unsubscribe;
    });
</script>

<button
    onclick={() => theme.toggle()}
    class="relative p-2.5 rounded-full glass transition-all duration-300 hover:scale-105"
    aria-label="Toggle theme"
    title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
    {#if mounted}
        {#if currentTheme === 'dark'}
            <!-- Sun icon for switching to light -->
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                class="text-yellow-400"
            >
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
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
                stroke-linecap="round" 
                stroke-linejoin="round"
                class="text-slate-700"
            >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
        {/if}
    {:else}
        <!-- Placeholder while loading -->
        <div class="w-5 h-5"></div>
    {/if}
</button>
