<script lang="ts">
    import { toasts, removeToast, type Toast } from "$lib/stores/toast";

    let toastList: Toast[] = [];
    toasts.subscribe((v) => (toastList = v));
</script>

{#if toastList.length > 0}
    <div class="toast-container">
        {#each toastList as t (t.id)}
            <div class="toast toast-{t.type}" role="alert">
                <div class="toast-icon">
                    {#if t.type === "success"}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    {:else if t.type === "error"}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    {:else if t.type === "warning"}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                            />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    {:else}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    {/if}
                </div>
                <span class="toast-message">{t.message}</span>
                <button
                    class="toast-close"
                    onclick={() => removeToast(t.id)}
                    aria-label="Close"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        {/each}
    </div>
{/if}

<style>
    .toast-container {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 400px;
    }

    .toast {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
        backdrop-filter: blur(10px);
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .toast-success {
        background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.95),
            rgba(22, 163, 74, 0.95)
        );
        color: white;
    }

    .toast-error {
        background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.95),
            rgba(220, 38, 38, 0.95)
        );
        color: white;
    }

    .toast-warning {
        background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.95),
            rgba(217, 119, 6, 0.95)
        );
        color: white;
    }

    .toast-info {
        background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.95),
            rgba(37, 99, 235, 0.95)
        );
        color: white;
    }

    .toast-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toast-message {
        flex: 1;
        font-size: 0.9375rem;
        line-height: 1.4;
    }

    .toast-close {
        flex-shrink: 0;
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
    }

    .toast-close:hover {
        color: white;
    }

    @media (max-width: 480px) {
        .toast-container {
            left: 1rem;
            right: 1rem;
            max-width: none;
        }
    }
</style>
