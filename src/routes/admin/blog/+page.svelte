<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "$lib/stores/toast";
    import {
        getBlogPosts,
        getBlogCategories,
        getBlogImageUrl,
        type BlogPost,
        type BlogCategory,
    } from "$lib/services/content";
    import { pb } from "$lib/pocketbase";
    import RichTextEditor from "$lib/components/admin/RichTextEditor.svelte";

    let posts = $state<BlogPost[]>([]);
    let categories = $state<BlogCategory[]>([]);
    let isLoading = $state(true);
    let showModal = $state(false);
    let editingPost = $state<BlogPost | null>(null);
    let activeFilter = $state("all");

    // Form fields
    let formTitle = $state("");
    let formSlug = $state("");
    let formExcerpt = $state("");
    let formContent = $state("");
    let formAuthor = $state("Noble Jade Team");
    let formTags = $state("");
    let formIsPublished = $state(true);
    let formIsFeatured = $state(false);

    onMount(async () => {
        await loadData();
    });

    async function loadData() {
        isLoading = true;
        try {
            const result = await pb
                .collection("blog_posts")
                .getFullList<BlogPost>({
                    sort: "-publishedAt",
                });
            posts = result;
            categories = await getBlogCategories();
        } catch (error) {
            console.error("[Admin Blog] Error loading:", error);
            toast.error("Failed to load blog posts");
        } finally {
            isLoading = false;
        }
    }

    function openModal(post?: BlogPost) {
        if (post) {
            editingPost = post;
            formTitle = post.title;
            formSlug = post.slug;
            formExcerpt = post.excerpt || "";
            formContent = post.content || "";
            formAuthor = post.author || post.authorName || "Noble Jade Team";
            formTags = post.tags?.join(", ") || "";
            formIsPublished = post.isPublished;
            formIsFeatured = post.isFeatured;
        } else {
            editingPost = null;
            formTitle = "";
            formSlug = "";
            formExcerpt = "";
            formContent = "";
            formAuthor = "Noble Jade Team";
            formTags = "";
            formIsPublished = true;
            formIsFeatured = false;
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        editingPost = null;
    }

    function generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    }

    async function savePost() {
        if (!formTitle.trim()) {
            toast.error("Please enter a title");
            return;
        }

        try {
            const data = {
                title: formTitle,
                slug: formSlug || generateSlug(formTitle),
                excerpt: formExcerpt,
                content: formContent,
                authorName: formAuthor,
                tags: formTags
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t),
                isPublished: formIsPublished,
                isFeatured: formIsFeatured,
                publishedAt: formIsPublished ? new Date().toISOString() : null,
            };

            if (editingPost?.id) {
                await pb.collection("blog_posts").update(editingPost.id, data);
                toast.success("Post updated!");
            } else {
                await pb.collection("blog_posts").create(data);
                toast.success("Post created!");
            }

            closeModal();
            await loadData();
        } catch (error: any) {
            console.error("[Admin Blog] Save error:", error);
            toast.error(error.message || "Failed to save post");
        }
    }

    async function deletePost(id: string) {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await pb.collection("blog_posts").delete(id);
            toast.success("Post deleted!");
            await loadData();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete post");
        }
    }

    async function togglePublished(post: BlogPost) {
        try {
            await pb.collection("blog_posts").update(post.id, {
                isPublished: !post.isPublished,
                publishedAt: !post.isPublished
                    ? new Date().toISOString()
                    : post.publishedAt,
            });
            await loadData();
        } catch (error: any) {
            toast.error(error.message || "Failed to update post");
        }
    }

    async function toggleFeatured(post: BlogPost) {
        try {
            await pb.collection("blog_posts").update(post.id, {
                isFeatured: !post.isFeatured,
            });
            await loadData();
        } catch (error: any) {
            toast.error(error.message || "Failed to update post");
        }
    }

    function formatDate(dateStr?: string): string {
        if (!dateStr) return "Not published";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function filteredPosts(): BlogPost[] {
        if (activeFilter === "all") return posts;
        if (activeFilter === "published")
            return posts.filter((p) => p.isPublished);
        if (activeFilter === "draft")
            return posts.filter((p) => !p.isPublished);
        if (activeFilter === "featured")
            return posts.filter((p) => p.isFeatured);
        return posts;
    }
</script>

<div class="blog-admin">
    <div class="page-header">
        <div>
            <h1>Blog Posts</h1>
            <p>Manage articles and content</p>
        </div>
        <button class="add-btn" onclick={() => openModal()}>+ New Post</button>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
        <div class="stat-card">
            <span class="stat-value">{posts.length}</span>
            <span class="stat-label">Total Posts</span>
        </div>
        <div class="stat-card">
            <span class="stat-value"
                >{posts.filter((p) => p.isPublished).length}</span
            >
            <span class="stat-label">Published</span>
        </div>
        <div class="stat-card">
            <span class="stat-value"
                >{posts.filter((p) => !p.isPublished).length}</span
            >
            <span class="stat-label">Drafts</span>
        </div>
        <div class="stat-card">
            <span class="stat-value"
                >{posts.reduce((sum, p) => sum + (p.views || 0), 0)}</span
            >
            <span class="stat-label">Total Views</span>
        </div>
    </div>

    <!-- Filters -->
    <div class="filters">
        <button
            class="filter-btn"
            class:active={activeFilter === "all"}
            onclick={() => (activeFilter = "all")}
        >
            All ({posts.length})
        </button>
        <button
            class="filter-btn"
            class:active={activeFilter === "published"}
            onclick={() => (activeFilter = "published")}
        >
            Published ({posts.filter((p) => p.isPublished).length})
        </button>
        <button
            class="filter-btn"
            class:active={activeFilter === "draft"}
            onclick={() => (activeFilter = "draft")}
        >
            Drafts ({posts.filter((p) => !p.isPublished).length})
        </button>
        <button
            class="filter-btn"
            class:active={activeFilter === "featured"}
            onclick={() => (activeFilter = "featured")}
        >
            Featured ({posts.filter((p) => p.isFeatured).length})
        </button>
    </div>

    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading posts...</p>
        </div>
    {:else}
        <div class="posts-table">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Views</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredPosts() as post}
                        <tr class:draft={!post.isPublished}>
                            <td>
                                <div class="post-title">
                                    <span class="title">{post.title}</span>
                                    {#if post.isFeatured}
                                        <span class="featured-badge"
                                            >Featured</span
                                        >
                                    {/if}
                                </div>
                                <span class="slug">/{post.slug}</span>
                            </td>
                            <td
                                >{post.author ||
                                    post.authorName ||
                                    "Unknown"}</td
                            >
                            <td>{formatDate(post.publishedAt)}</td>
                            <td>{post.views || 0}</td>
                            <td>
                                <span
                                    class="status"
                                    class:published={post.isPublished}
                                >
                                    {post.isPublished ? "Published" : "Draft"}
                                </span>
                            </td>
                            <td>
                                <div class="actions">
                                    <button
                                        class="action-btn"
                                        onclick={() => togglePublished(post)}
                                        title={post.isPublished
                                            ? "Unpublish"
                                            : "Publish"}
                                    >
                                        {post.isPublished ? "📤" : "📥"}
                                    </button>
                                    <button
                                        class="action-btn"
                                        onclick={() => toggleFeatured(post)}
                                        title={post.isFeatured
                                            ? "Unfeature"
                                            : "Feature"}
                                    >
                                        {post.isFeatured ? "⭐" : "☆"}
                                    </button>
                                    <button
                                        class="action-btn"
                                        onclick={() => openModal(post)}
                                        >✏️</button
                                    >
                                    <button
                                        class="action-btn delete"
                                        onclick={() => deletePost(post.id)}
                                        >🗑️</button
                                    >
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        {#if filteredPosts().length === 0}
            <div class="empty-state">
                <p>No posts found. Click "New Post" to create one.</p>
            </div>
        {/if}
    {/if}
</div>

<!-- Modal -->
{#if showModal}
    <div class="modal-overlay" onclick={closeModal}>
        <div class="modal large" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>{editingPost ? "Edit Post" : "New Post"}</h2>
                <button class="close-btn" onclick={closeModal}>&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group flex-grow">
                        <label for="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            bind:value={formTitle}
                            placeholder="5 Signs It's Time to Hire..."
                            oninput={() => {
                                if (!editingPost)
                                    formSlug = generateSlug(formTitle);
                            }}
                        />
                    </div>
                    <div class="form-group">
                        <label for="slug">Slug</label>
                        <input
                            type="text"
                            id="slug"
                            bind:value={formSlug}
                            placeholder="auto-generated-slug"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="excerpt">Excerpt</label>
                    <textarea
                        id="excerpt"
                        bind:value={formExcerpt}
                        rows="2"
                        placeholder="Brief summary for previews..."
                    ></textarea>
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <RichTextEditor
                        value={formContent}
                        minHeight="250px"
                        onUpdate={(html) => (formContent = html)}
                    />
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="author">Author</label>
                        <input
                            type="text"
                            id="author"
                            bind:value={formAuthor}
                            placeholder="Noble Jade Team"
                        />
                    </div>
                    <div class="form-group">
                        <label for="tags">Tags (comma separated)</label>
                        <input
                            type="text"
                            id="tags"
                            bind:value={formTags}
                            placeholder="cleaning, tips, guide"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label>Options</label>
                    <div class="checkbox-group">
                        <label
                            ><input
                                type="checkbox"
                                bind:checked={formIsPublished}
                            /> Published</label
                        >
                        <label
                            ><input
                                type="checkbox"
                                bind:checked={formIsFeatured}
                            /> Featured</label
                        >
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick={closeModal}>Cancel</button>
                <button class="save-btn" onclick={savePost}>
                    {editingPost ? "Update" : "Create"} Post
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .blog-admin {
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
    .add-btn {
        padding: 0.75rem 1.25rem;
        background: var(--color-accent);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
    .stats-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .stat-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1rem 1.5rem;
        border: 1px solid var(--glass-bg);
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
    }
    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
    }
    .stat-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
    .filters {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }
    .filter-btn {
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 0.875rem;
    }
    .filter-btn.active {
        background: var(--color-accent);
        color: white;
        border-color: var(--color-accent);
    }
    .loading {
        text-align: center;
        padding: 3rem;
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
    .posts-table {
        background: var(--bg-secondary);
        border-radius: 12px;
        overflow: hidden;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th,
    td {
        padding: 1rem;
        text-align: left;
    }
    th {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        background: rgba(0, 0, 0, 0.2);
    }
    tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
    tr.draft {
        opacity: 0.7;
    }
    .post-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .title {
        font-weight: 500;
    }
    .featured-badge {
        padding: 0.15rem 0.4rem;
        background: #f59e0b;
        color: white;
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 600;
    }
    .slug {
        display: block;
        font-size: 0.75rem;
        color: var(--text-muted);
        font-family: monospace;
    }
    .status {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        background: var(--glass-bg);
        color: var(--text-muted);
    }
    .status.published {
        background: #22c55e20;
        color: #22c55e;
    }
    .actions {
        display: flex;
        gap: 0.25rem;
    }
    .action-btn {
        padding: 0.4rem;
        background: transparent;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        font-size: 1rem;
    }
    .action-btn:hover {
        background: var(--glass-bg);
    }
    .action-btn.delete:hover {
        background: #ef444420;
    }
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
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
    .modal.large {
        max-width: 800px;
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
    .form-group {
        margin-bottom: 1rem;
    }
    .form-group.flex-grow {
        flex: 1;
    }
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 1rem;
        font-family: inherit;
    }
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--color-accent);
    }
    .form-row {
        display: flex;
        gap: 1rem;
    }
    .form-row .form-group {
        flex: 1;
    }
    .checkbox-group {
        display: flex;
        gap: 1.5rem;
    }
    .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }
    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid var(--glass-bg);
    }
    .cancel-btn {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
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
