// Global toast notification store
import { writable } from 'svelte/store';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

// Toast store
export const toasts = writable<Toast[]>([]);

// Add toast
function addToast(type: Toast['type'], message: string, duration = 4000): string {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, message, duration };

    toasts.update(t => [...t, toast]);

    if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
    }

    return id;
}

// Remove toast
export function removeToast(id: string) {
    toasts.update(t => t.filter(toast => toast.id !== id));
}

// Clear all toasts
export function clearToasts() {
    toasts.set([]);
}

// Convenience object for showing toasts
export const toast = {
    success: (message: string, duration?: number) => addToast('success', message, duration),
    error: (message: string, duration?: number) => addToast('error', message, duration ?? 6000),
    warning: (message: string, duration?: number) => addToast('warning', message, duration ?? 5000),
    info: (message: string, duration?: number) => addToast('info', message, duration),
};
