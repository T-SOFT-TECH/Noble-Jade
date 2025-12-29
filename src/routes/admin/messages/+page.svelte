<script lang="ts">
    import { onMount } from "svelte";
    import { pb } from "$lib/pocketbase";
    import { toast } from "$lib/stores/toast";

    interface ContactMessage {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        serviceType: string;
        bedrooms: string;
        bathrooms: string;
        message: string;
        status: "new" | "read" | "replied" | "archived";
        notes: string;
        created: string;
    }

    let messages = $state<ContactMessage[]>([]);
    let isLoading = $state(true);
    let filterStatus = $state("all");
    let selectedMessage = $state<ContactMessage | null>(null);
    let showModal = $state(false);
    let noteText = $state("");

    onMount(() => loadMessages());

    async function loadMessages() {
        isLoading = true;
        try {
            let filter = "";
            if (filterStatus !== "all") {
                filter = `status = "${filterStatus}"`;
            }

            const records = await pb
                .collection("contact_messages")
                .getFullList({
                    filter: filter || undefined,
                    sort: "-created",
                });
            messages = records as unknown as ContactMessage[];
        } catch (error) {
            console.error("[Admin Messages] Error loading:", error);
            toast.error("Failed to load messages");
        } finally {
            isLoading = false;
        }
    }

    async function updateStatus(id: string, status: string) {
        try {
            await pb.collection("contact_messages").update(id, { status });
            await loadMessages();
            toast.success(`Message marked as ${status}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    }

    async function deleteMessage(id: string) {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await pb.collection("contact_messages").delete(id);
            await loadMessages();
            toast.success("Message deleted");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    }

    function openMessage(msg: ContactMessage) {
        selectedMessage = msg;
        noteText = msg.notes || "";
        showModal = true;
        if (msg.status === "new") {
            updateStatus(msg.id, "read");
        }
    }

    async function saveNotes() {
        if (!selectedMessage) return;
        try {
            await pb
                .collection("contact_messages")
                .update(selectedMessage.id, { notes: noteText });
            await loadMessages();
            toast.success("Notes saved");
            showModal = false;
        } catch (error) {
            toast.error("Failed to save notes");
        }
    }

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    const statusColors: Record<string, string> = {
        new: "status-new",
        read: "status-read",
        replied: "status-replied",
        archived: "status-archived",
    };
</script>

<div class="messages-page">
    <div class="page-header">
        <div>
            <h1>Contact Messages</h1>
            <p>View and manage customer inquiries</p>
        </div>
        <div class="header-stats">
            <span class="stat new"
                >{messages.filter((m) => m.status === "new").length} New</span
            >
            <span class="stat">{messages.length} Total</span>
        </div>
    </div>

    <!-- Filters -->
    <div class="filters">
        <select bind:value={filterStatus} onchange={() => loadMessages()}>
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
        </select>
    </div>

    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading messages...</p>
        </div>
    {:else if messages.length === 0}
        <div class="empty-state">
            <p>No messages found</p>
        </div>
    {:else}
        <div class="messages-list">
            {#each messages as msg}
                <div class="message-card" class:unread={msg.status === "new"}>
                    <div class="message-header">
                        <div class="sender-info">
                            <span class="avatar"
                                >{msg.firstName.charAt(0)}{msg.lastName.charAt(
                                    0,
                                )}</span
                            >
                            <div>
                                <h4>{msg.firstName} {msg.lastName}</h4>
                                <span class="email">{msg.email}</span>
                            </div>
                        </div>
                        <span class="status-badge {statusColors[msg.status]}"
                            >{msg.status}</span
                        >
                    </div>

                    {#if msg.serviceType}
                        <div class="service-info">
                            <span class="tag">{msg.serviceType}</span>
                            <span class="tag">{msg.bedrooms}</span>
                            <span class="tag">{msg.bathrooms}</span>
                        </div>
                    {/if}

                    <p class="preview">{msg.message || "(No message)"}</p>

                    <div class="message-footer">
                        <span class="date">{formatDate(msg.created)}</span>
                        <div class="actions">
                            <button
                                class="action-btn view"
                                onclick={() => openMessage(msg)}>View</button
                            >
                            <button
                                class="action-btn"
                                onclick={() => updateStatus(msg.id, "replied")}
                                >Mark Replied</button
                            >
                            <button
                                class="action-btn archive"
                                onclick={() => updateStatus(msg.id, "archived")}
                                >Archive</button
                            >
                            <button
                                class="action-btn delete"
                                onclick={() => deleteMessage(msg.id)}
                                >Delete</button
                            >
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Message Detail Modal -->
{#if showModal && selectedMessage}
    <div class="modal-overlay" onclick={() => (showModal = false)}>
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>
                    Message from {selectedMessage.firstName}
                    {selectedMessage.lastName}
                </h2>
                <button class="close-btn" onclick={() => (showModal = false)}
                    >&times;</button
                >
            </div>
            <div class="modal-body">
                <div class="detail-row">
                    <label>Email:</label>
                    <a href="mailto:{selectedMessage.email}"
                        >{selectedMessage.email}</a
                    >
                </div>
                {#if selectedMessage.phone}
                    <div class="detail-row">
                        <label>Phone:</label>
                        <a href="tel:{selectedMessage.phone}"
                            >{selectedMessage.phone}</a
                        >
                    </div>
                {/if}
                {#if selectedMessage.serviceType}
                    <div class="detail-row">
                        <label>Service:</label>
                        <span
                            >{selectedMessage.serviceType} • {selectedMessage.bedrooms}
                            • {selectedMessage.bathrooms}</span
                        >
                    </div>
                {/if}
                <div class="message-content">
                    <label>Message:</label>
                    <p>{selectedMessage.message || "(No message provided)"}</p>
                </div>
                <div class="notes-section">
                    <label for="notes">Notes:</label>
                    <textarea
                        bind:value={noteText}
                        rows="3"
                        placeholder="Add internal notes..."
                    ></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <a href="mailto:{selectedMessage.email}" class="reply-btn"
                    >Reply via Email</a
                >
                <button class="save-btn" onclick={saveNotes}>Save Notes</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .messages-page {
        color: var(--text-primary);
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
    }

    .page-header h1 {
        font-size: 1.75rem;
        margin: 0;
    }

    .page-header p {
        color: var(--text-secondary);
        margin: 0;
    }

    .header-stats {
        display: flex;
        gap: 1rem;
    }

    .stat {
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border-radius: 8px;
        font-weight: 500;
    }

    .stat.new {
        background: #ef444420;
        color: #ef4444;
    }

    .filters {
        margin-bottom: 1.5rem;
    }

    .filters select {
        padding: 0.75rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
    }

    .loading,
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--glass-bg);
        border-top-color: var(--color-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .messages-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .message-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.25rem;
        border: 1px solid var(--border-color);
    }

    .message-card.unread {
        border-left: 4px solid var(--color-accent);
        background: var(--bg-primary);
    }

    .message-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.75rem;
    }

    .sender-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .avatar {
        width: 40px;
        height: 40px;
        background: var(--color-accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .sender-info h4 {
        margin: 0;
        font-size: 1rem;
    }

    .email {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .status-new {
        background: #ef444420;
        color: #ef4444;
    }
    .status-read {
        background: #3b82f620;
        color: #3b82f6;
    }
    .status-replied {
        background: #22c55e20;
        color: #22c55e;
    }
    .status-archived {
        background: #64748b20;
        color: #64748b;
    }

    .service-info {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
    }

    .tag {
        padding: 0.25rem 0.5rem;
        background: var(--glass-bg);
        border-radius: 4px;
        font-size: 0.75rem;
    }

    .preview {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0 0 0.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .message-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .date {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .action-btn {
        padding: 0.4rem 0.75rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-primary);
        font-size: 0.75rem;
        cursor: pointer;
    }

    .action-btn.view {
        background: var(--color-accent);
        color: white;
        border-color: var(--color-accent);
    }

    .action-btn.delete {
        color: #ef4444;
        border-color: #ef4444;
    }

    .action-btn.delete:hover {
        background: #ef4444;
        color: white;
    }

    /* Modal */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: var(--bg-primary);
        border-radius: 16px;
        width: 100%;
        max-width: 600px;
        max-height: 90vh;
        overflow: auto;
        border: 1px solid var(--glass-bg);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--glass-bg);
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
    }

    .modal-body {
        padding: 1.5rem;
    }

    .detail-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.75rem;
    }

    .detail-row label {
        font-weight: 600;
        min-width: 80px;
        color: var(--text-secondary);
    }

    .detail-row a {
        color: var(--color-accent);
    }

    .message-content {
        margin: 1rem 0;
    }

    .message-content label {
        display: block;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
    }

    .message-content p {
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: 8px;
        line-height: 1.6;
    }

    .notes-section label {
        display: block;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
    }

    .notes-section textarea {
        width: 100%;
        padding: 0.75rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        resize: vertical;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid var(--glass-bg);
    }

    .reply-btn {
        padding: 0.75rem 1.5rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        text-decoration: none;
    }

    .save-btn {
        padding: 0.75rem 1.5rem;
        background: var(--color-accent);
        border: none;
        color: white;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
</style>
