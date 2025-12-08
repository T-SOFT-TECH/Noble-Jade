import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

// PocketBase URL - use environment variable or default to local
const POCKETBASE_URL = browser
    ? (import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090')
    : (process.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Create and export PocketBase instance
export const pb = new PocketBase(POCKETBASE_URL);

// Disable auto-cancellation for better UX
pb.autoCancellation(false);

// Export URL for reference
export const pocketbaseUrl = POCKETBASE_URL;
