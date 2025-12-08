import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

// Get initial theme from localStorage or default to 'dark'
function getInitialTheme(): Theme {
    if (browser) {
        const stored = localStorage.getItem('theme') as Theme;
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
    }
    return 'dark';
}

// Create the theme store
function createThemeStore() {
    const { subscribe, set, update } = writable<Theme>(getInitialTheme());

    return {
        subscribe,
        toggle: () => {
            update(current => {
                const newTheme = current === 'dark' ? 'light' : 'dark';
                if (browser) {
                    localStorage.setItem('theme', newTheme);
                    // Update the root class - add both for Tailwind dark: variant support
                    document.documentElement.classList.remove('dark', 'light');
                    document.documentElement.classList.add(newTheme);
                }
                return newTheme;
            });
        },
        setTheme: (newTheme: Theme) => {
            set(newTheme);
            if (browser) {
                localStorage.setItem('theme', newTheme);
                document.documentElement.classList.remove('dark', 'light');
                document.documentElement.classList.add(newTheme);
            }
        },
        initialize: () => {
            if (browser) {
                const currentTheme = getInitialTheme();
                document.documentElement.classList.remove('dark', 'light');
                document.documentElement.classList.add(currentTheme);
                set(currentTheme);
            }
        }
    };
}

export const theme = createThemeStore();
