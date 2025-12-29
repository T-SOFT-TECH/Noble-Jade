<script lang="ts">
    import { onMount } from "svelte";
    import PageHero from "$lib/components/shared/PageHero.svelte";
    import {
        getBlogPosts,
        getBlogCategories,
        getBlogImageUrl,
        type BlogPost,
        type BlogCategory,
    } from "$lib/services/content";

    let posts = $state<BlogPost[]>([]);
    let categories = $state<BlogCategory[]>([]);
    let recentPosts = $state<BlogPost[]>([]);
    let isLoading = $state(true);
    let searchQuery = $state("");

    // Default posts as fallback
    const defaultPosts: BlogPost[] = [
        {
            id: "1",
            slug: "5-signs-its-time-to-hire-a-professional-cleaning-service",
            title: "5 Signs It's Time to Hire a Professional Cleaning Service",
            excerpt:
                "Taking seamless key performance indicators offline to maximise the long tail.",
            image: "",
            publishedAt: "2025-07-20",
            isPublished: true,
            isFeatured: false,
            views: 0,
        },
    ];

    const defaultCategories: BlogCategory[] = [
        { id: "1", name: "Cleaning", slug: "cleaning", sortOrder: 1 },
        { id: "2", name: "Guides", slug: "guides", sortOrder: 2 },
        { id: "3", name: "Tips & Tricks", slug: "tips-tricks", sortOrder: 3 },
    ];

    onMount(async () => {
        try {
            // Fetch blog posts
            const result = await getBlogPosts(1, 10);
            posts = result.items.length > 0 ? result.items : defaultPosts;
            recentPosts = posts.slice(0, 4);

            // Fetch categories
            const cats = await getBlogCategories();
            categories = cats.length > 0 ? cats : defaultCategories;

            console.log(
                "[Blog] Loaded",
                posts.length,
                "posts and",
                categories.length,
                "categories",
            );
        } catch (error) {
            console.error("[Blog] Error loading blog data:", error);
            posts = defaultPosts;
            recentPosts = posts.slice(0, 4);
            categories = defaultCategories;
        } finally {
            isLoading = false;
        }
    });

    // Format date
    function formatDate(dateStr?: string): string {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    // Get post image URL
    function getPostImage(post: BlogPost): string {
        if (post.image) {
            return getBlogImageUrl(post);
        }
        return `/wp-content/uploads/sites/3/2018/09/post_0${(posts.indexOf(post) % 4) + 1}.jpg`;
    }
</script>

<svelte:head>
    <title>Blog - Noble Jade Cleaning Services</title>
    <meta
        name="description"
        content="Read our cleaning tips, guides, and industry insights. Stay updated with the latest news from Noble Jade Cleaning Services."
    />
</svelte:head>

<div class="blog-page">
    <!-- Hero Section -->
    <PageHero
        title="Blog"
        bgColor="bg-alternate"
        textColor="text-white/20"
        heroImage=""
        heroImageAlt=""
        backgroundImage="/images/blog-hero.webp"
        overlayColor="rgba(10, 60, 120, 0.8)"
        testimonial={{
            imageSrc: "/images/credentials_home_01.png",
            text: "Blog Posts",
            highlight: "15+",
        }}
    />

    <!-- Blog Content -->
    <section class="blog-content">
        <div class="container">
            <div class="blog-layout">
                <!-- Main Content -->
                <main class="blog-main">
                    {#each posts as post}
                        <article class="blog-card">
                            <div class="card-image">
                                <a href="/blog/{post.slug}">
                                    <img
                                        src={getPostImage(post)}
                                        alt={post.title}
                                    />
                                </a>
                            </div>
                            <div class="card-content">
                                <header class="card-header">
                                    <span class="author"
                                        >{post.author ||
                                            "Noble Jade Team"}</span
                                    >
                                    <h2>
                                        <a href="/blog/{post.slug}"
                                            >{post.title}</a
                                        >
                                    </h2>
                                    <div class="meta">
                                        <span class="date"
                                            >{formatDate(
                                                post.publishedAt,
                                            )}</span
                                        >
                                        {#if post.tags && post.tags.length > 0}
                                            <span class="categories">
                                                {post.tags.join(", ")}
                                            </span>
                                        {/if}
                                    </div>
                                </header>
                                <p class="excerpt">{post.excerpt}</p>
                                <footer class="card-footer">
                                    <div class="share-options">
                                        <span class="share-label">Share</span>
                                        <div class="share-icons">
                                            <a
                                                href="#"
                                                class="share-icon"
                                                aria-label="Copy link"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                                                    />
                                                </svg>
                                            </a>
                                            <a
                                                href="#"
                                                class="share-icon"
                                                aria-label="Share on Facebook"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                                                    />
                                                </svg>
                                            </a>
                                            <a
                                                href="#"
                                                class="share-icon"
                                                aria-label="Share on Twitter"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                                                    />
                                                </svg>
                                            </a>
                                            <a
                                                href="#"
                                                class="share-icon"
                                                aria-label="Share on LinkedIn"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                                                    />
                                                    <rect
                                                        x="2"
                                                        y="9"
                                                        width="4"
                                                        height="12"
                                                    />
                                                    <circle
                                                        cx="4"
                                                        cy="4"
                                                        r="2"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    <a
                                        href="/blog/{post.slug}"
                                        class="read-more-btn"
                                    >
                                        <span>Continue reading</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <line
                                                x1="5"
                                                y1="12"
                                                x2="19"
                                                y2="12"
                                            />
                                            <polyline
                                                points="12 5 19 12 12 19"
                                            />
                                        </svg>
                                    </a>
                                </footer>
                            </div>
                        </article>
                    {/each}

                    <!-- Pagination -->
                    <div class="pagination">
                        <a href="/blog/page/2" class="pagination-link"
                            >Older Posts</a
                        >
                    </div>
                </main>

                <!-- Sidebar -->
                <aside class="blog-sidebar">
                    <!-- Search -->
                    <div class="sidebar-widget">
                        <form class="search-form">
                            <input
                                type="search"
                                placeholder="Search..."
                                bind:value={searchQuery}
                            />
                            <button type="submit" aria-label="Search">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>

                    <!-- Recent Posts -->
                    <div class="sidebar-widget">
                        <h4>Recent Posts</h4>
                        <ul class="recent-posts">
                            {#each recentPosts as post}
                                <li>
                                    <a href="/blog/{post.slug}">
                                        <img
                                            src={getPostImage(post)}
                                            alt={post.title}
                                        />
                                        <div class="post-info">
                                            <span class="post-date"
                                                >{formatDate(
                                                    post.publishedAt,
                                                )}</span
                                            >
                                            <h5>{post.title}</h5>
                                        </div>
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <!-- Categories -->
                    <div class="sidebar-widget">
                        <h4>Categories</h4>
                        <ul class="categories-list">
                            {#each categories as cat}
                                <li>
                                    <a
                                        href="/blog/category/{cat.name
                                            .toLowerCase()
                                            .replace(' & ', '-')
                                            .replace(' ', '-')}"
                                    >
                                        {cat.name}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    </section>
</div>

<style>
    .blog-page {
        display: flex;
        flex-direction: column;
    }

    .container {
        max-width: 1600px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    /* Blog Content */
    .blog-content {
        padding: 4rem 1rem;
    }

    .blog-layout {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 3rem;
    }

    /* Blog Card */
    .blog-card {
        background: white;
        border-radius: var(--border-radius-lg, 1.5rem);
        overflow: hidden;
        margin-bottom: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    :global(.dark) .blog-card {
        background: var(--bg-secondary-dark, #252525);
    }

    .card-image {
        aspect-ratio: 16 / 10;
        overflow: hidden;
    }

    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .card-image:hover img {
        transform: scale(1.05);
    }

    .card-content {
        padding: 1.5rem 2rem 2rem;
    }

    .card-header .author {
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
        display: block;
        margin-bottom: 0.5rem;
    }

    :global(.dark) .card-header .author {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .card-header h2 {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 0 0 0.75rem;
        line-height: 1.3;
    }

    .card-header h2 a {
        color: var(--text-primary, #252525);
        text-decoration: none;
        transition: color 0.3s ease;
    }

    :global(.dark) .card-header h2 a {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .card-header h2 a:hover {
        color: var(--accent-color, #e82374);
    }

    .meta {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .meta {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .categories a {
        color: var(--accent-color, #e82374);
        text-decoration: none;
    }

    .categories a:hover {
        text-decoration: underline;
    }

    .excerpt {
        color: var(--text-secondary, #666);
        line-height: 1.7;
        margin: 1rem 0 1.5rem;
    }

    :global(.dark) .excerpt {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .share-options {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .share-label {
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .share-label {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .share-icons {
        display: flex;
        gap: 0.5rem;
    }

    .share-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--accent-color, #e82374);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    .share-icon:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(232, 35, 116, 0.3);
    }

    .read-more-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: var(--accent-color, #e82374);
        color: white;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .read-more-btn:hover {
        background: var(--accent-hover, #c51d63);
        transform: translateY(-2px);
    }

    .read-more-btn svg {
        transition: transform 0.3s ease;
    }

    .read-more-btn:hover svg {
        transform: translateX(4px);
    }

    /* Pagination */
    .pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
    }

    .pagination-link {
        padding: 0.75rem 1.5rem;
        background: var(--accent-color, #e82374);
        color: white;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .pagination-link:hover {
        background: var(--accent-hover, #c51d63);
    }

    /* Sidebar */
    .blog-sidebar {
        position: sticky;
        top: 2rem;
        height: fit-content;
    }

    .sidebar-widget {
        background: var(--light-blue, #ecf4fd);
        border-radius: var(--border-radius-lg, 1.5rem);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }

    :global(.dark) .sidebar-widget {
        background: var(--bg-secondary-dark, #252525);
    }

    .sidebar-widget h4 {
        font-size: 1rem;
        font-weight: 500;
        margin: 0 0 1rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .sidebar-widget h4 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    /* Search Form */
    .search-form {
        display: flex;
        gap: 0.5rem;
    }

    .search-form input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 50px;
        background: white;
        font-size: 0.875rem;
    }

    :global(.dark) .search-form input {
        background: var(--bg-primary-dark, #1a1a1a);
        color: var(--text-primary-dark, #f5f5f5);
    }

    .search-form button {
        width: 44px;
        height: 44px;
        border: none;
        border-radius: 50%;
        background: var(--accent-color, #e82374);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    .search-form button:hover {
        background: var(--accent-hover, #c51d63);
    }

    /* Recent Posts */
    .recent-posts {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .recent-posts li {
        margin-bottom: 1rem;
    }

    .recent-posts li:last-child {
        margin-bottom: 0;
    }

    .recent-posts a {
        display: flex;
        gap: 0.75rem;
        text-decoration: none;
    }

    .recent-posts img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
        flex-shrink: 0;
    }

    .post-info {
        flex: 1;
        min-width: 0;
    }

    .post-date {
        font-size: 0.75rem;
        color: var(--text-secondary, #666);
        display: block;
        margin-bottom: 0.25rem;
    }

    :global(.dark) .post-date {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .post-info h5 {
        font-size: 0.875rem;
        font-weight: 500;
        margin: 0;
        color: var(--text-primary, #252525);
        line-height: 1.4;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        transition: color 0.3s ease;
    }

    :global(.dark) .post-info h5 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .recent-posts a:hover .post-info h5 {
        color: var(--accent-color, #e82374);
    }

    /* Categories */
    .categories-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .categories-list li {
        margin-bottom: 0.5rem;
    }

    .categories-list a {
        color: var(--text-primary, #252525);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.3s ease;
    }

    :global(.dark) .categories-list a {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .categories-list a:hover {
        color: var(--accent-color, #e82374);
    }

    /* Responsive */
    @media (max-width: 992px) {
        .blog-layout {
            grid-template-columns: 1fr;
        }

        .blog-sidebar {
            position: static;
        }
    }

    @media (max-width: 768px) {
        .card-content {
            padding: 1.25rem;
        }

        .card-header h2 {
            font-size: 1.25rem;
        }

        .card-footer {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
