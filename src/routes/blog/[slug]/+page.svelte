<script lang="ts">
    import { page } from "$app/stores";
    import FAQSection from "$lib/components/home/FAQSection.svelte";

    // Blog posts data (would come from CMS/API in production)
    const posts: Record<string, any> = {
        "5-signs-its-time-to-hire-a-professional-cleaning-service": {
            title: "5 Signs It's Time to Hire a Professional Cleaning Service",
            author: "Noble Jade Team",
            authorAvatar: "/images/credentials_home_01.png",
            date: "July 20, 2025",
            categories: ["DIY", "Guides"],
            image: "/wp-content/uploads/sites/3/2018/09/post_01.jpg",
            content: `
                <p>Life gets busy, and sometimes your home cleaning routine takes a backseat. But how do you know when it's time to call in the professionals? Here are five telltale signs that you could benefit from a professional cleaning service.</p>
                
                <h3>1. You're Constantly Playing Catch-Up</h3>
                <p>If you find yourself perpetually behind on household chores, spending weekends scrubbing instead of relaxing, it might be time to reconsider your approach. Professional cleaners can help you reclaim your free time while ensuring your home stays spotless.</p>
                
                <h3>2. Allergies Are Getting Worse</h3>
                <p>Dust, pet dander, and other allergens can accumulate quickly in a home. If you or family members are experiencing increased allergy symptoms, a deep professional cleaning can make a significant difference in air quality and overall health.</p>
                
                <h3>3. You're Hosting an Event</h3>
                <p>Whether it's a holiday gathering, birthday party, or dinner with the boss, special occasions call for a special level of clean. Professional cleaners can ensure your home is guest-ready and impressive.</p>
                
                <h3>4. Stains and Odors Won't Budge</h3>
                <p>Some messes require professional-grade equipment and expertise. If you've tried everything to remove that carpet stain or eliminate that mysterious odor, professionals have the tools and knowledge to tackle stubborn problems.</p>
                
                <h3>5. You Simply Don't Have Time</h3>
                <p>Between work, family, and personal commitments, finding time to clean thoroughly can feel impossible. Investing in professional cleaning services gives you back precious hours each week.</p>
                
                <blockquote>
                    <p>"A clean home is a happy home. Don't let the stress of cleaning diminish your quality of life."</p>
                </blockquote>
                
                <h3>Ready to Make the Switch?</h3>
                <p>If any of these signs resonate with you, it might be time to consider professional help. At Noble Jade Cleaning Services, we offer flexible scheduling, eco-friendly products, and a satisfaction guarantee. Contact us today for a free estimate!</p>
            `,
        },
        "the-ultimate-guide-to-a-spotless-home-room-by-room-tips": {
            title: "The Ultimate Guide to a Spotless Home: Room-by-Room Tips",
            author: "Noble Jade Team",
            authorAvatar: "/images/credentials_home_01.png",
            date: "July 10, 2025",
            categories: ["Cleaning", "Services"],
            image: "/wp-content/uploads/sites/3/2022/03/post_12.jpg",
            content: `
                <p>Keeping your entire home clean can feel overwhelming. That's why we've created this comprehensive room-by-room guide to help you tackle each space efficiently and effectively.</p>
                
                <h3>The Kitchen</h3>
                <p>The heart of the home requires special attention. Start by decluttering countertops, then work from top to bottom—cabinets, appliances, counters, and finally floors. Don't forget to clean inside the microwave and wipe down cabinet fronts regularly.</p>
                
                <h3>The Bathroom</h3>
                <p>Bathrooms need frequent attention due to moisture and frequent use. Focus on disinfecting high-touch surfaces, scrubbing the toilet, and keeping grout clean. A squeegee after showers can prevent water spots and mildew.</p>
                
                <h3>The Living Room</h3>
                <p>Dust all surfaces including electronics, vacuum upholstery, and don't forget about window treatments. Fluff pillows and fold throws for an instantly tidier appearance.</p>
                
                <h3>Bedrooms</h3>
                <p>Focus on making beds daily, keeping nightstands clear, and washing bedding weekly. Under-bed storage should be organized and dust-free.</p>
                
                <h3>Pro Tips</h3>
                <ul>
                    <li>Clean one room completely before moving to the next</li>
                    <li>Keep cleaning supplies in a caddy for easy transport</li>
                    <li>Set a timer to stay focused and efficient</li>
                    <li>Don't forget baseboards and light fixtures</li>
                </ul>
            `,
        },
        "how-to-maintain-a-clean-office-that-boosts-productivity": {
            title: "How to Maintain a Clean Office That Boosts Productivity",
            author: "Noble Jade Team",
            authorAvatar: "/images/credentials_home_01.png",
            date: "June 30, 2025",
            categories: ["Guides", "Organising"],
            image: "/wp-content/uploads/sites/3/2022/03/post_11.jpg",
            content: `
                <p>A clean workspace isn't just about appearances—it directly impacts productivity, employee health, and company image. Here's how to maintain an office environment that promotes success.</p>
                
                <h3>The Connection Between Cleanliness and Productivity</h3>
                <p>Studies show that employees in clean environments are up to 15% more productive. Clutter causes stress, while clean spaces promote focus and creativity.</p>
                
                <h3>Daily Maintenance Tips</h3>
                <p>Encourage desk organization, provide adequate trash receptacles, and ensure common areas are tidied throughout the day. A clean break room and restrooms are essential for employee morale.</p>
                
                <h3>Weekly Deep Cleaning</h3>
                <p>Schedule regular professional cleaning for carpets, windows, and hard-to-reach areas. This prevents buildup and maintains a consistently fresh environment.</p>
                
                <h3>Creating a Clean Culture</h3>
                <p>Implement clear desk policies, provide organizational tools, and lead by example. When cleanliness is part of your company culture, everyone benefits.</p>
            `,
        },
        "deep-cleaning-vs-regular-cleaning-whats-the-difference": {
            title: "Deep Cleaning vs. Regular Cleaning: What's the Difference?",
            author: "Noble Jade Team",
            authorAvatar: "/images/credentials_home_01.png",
            date: "June 20, 2025",
            categories: ["Guides", "Tips & Tricks"],
            image: "/wp-content/uploads/sites/3/2018/09/post_02.jpg",
            content: `
                <p>When booking cleaning services, you'll often see options for "regular cleaning" and "deep cleaning." But what's the difference, and which one do you need?</p>
                
                <h3>Regular Cleaning</h3>
                <p>Regular cleaning covers the basics: dusting, vacuuming, mopping, bathroom sanitization, and kitchen cleanup. It's designed to maintain cleanliness on a weekly or bi-weekly basis.</p>
                
                <h3>Deep Cleaning</h3>
                <p>Deep cleaning goes beyond the surface. It includes cleaning behind appliances, inside cabinets, detailed baseboard cleaning, window washing, and addressing areas that don't get attention during regular cleaning.</p>
                
                <h3>When to Choose Each</h3>
                <ul>
                    <li><strong>Regular Cleaning:</strong> For ongoing maintenance when your home is already relatively clean</li>
                    <li><strong>Deep Cleaning:</strong> For first-time clients, seasonal cleaning, post-renovation, or before/after moving</li>
                </ul>
                
                <h3>Our Recommendation</h3>
                <p>We suggest starting with a deep clean, then transitioning to regular maintenance cleaning. This approach ensures every corner of your home gets the attention it deserves.</p>
            `,
        },
        "what-to-expect-during-your-first-cleaning-appointment": {
            title: "What to Expect During Your First Cleaning Appointment",
            author: "Noble Jade Team",
            authorAvatar: "/images/credentials_home_01.png",
            date: "June 1, 2025",
            categories: ["Cleaning", "Services"],
            image: "/wp-content/uploads/sites/3/2018/09/post_03.jpg",
            content: `
                <p>Booking your first professional cleaning can feel daunting. Here's what you can expect from start to finish to help ease any concerns.</p>
                
                <h3>Before the Appointment</h3>
                <p>We'll confirm your appointment time, discuss any special requests or areas of focus, and provide an estimated duration. Light decluttering before our arrival helps us maximize cleaning time.</p>
                
                <h3>During the Cleaning</h3>
                <p>Our team arrives with all necessary supplies and equipment. We work systematically through your home, paying attention to details while respecting your space and belongings.</p>
                
                <h3>After the Cleaning</h3>
                <p>We'll do a walkthrough to ensure your satisfaction. Any concerns are addressed immediately. You'll receive a summary of what was done and recommendations for future visits.</p>
                
                <h3>Tips for First-Timers</h3>
                <ul>
                    <li>Secure pets in a safe area</li>
                    <li>Point out any fragile items</li>
                    <li>Share any product allergies or preferences</li>
                    <li>Provide feedback—we want to exceed your expectations</li>
                </ul>
            `,
        },
        "top-5-cleaning-mistakes-you-might-be-making": {
            title: "Top 5 Cleaning Mistakes You Might Be Making",
            author: "Noble Jade Team",
            authorAvatar: "/images/credentials_home_01.png",
            date: "May 25, 2025",
            categories: ["Business", "Organising"],
            image: "/wp-content/uploads/sites/3/2018/09/post_04.jpg",
            content: `
                <p>Even the most diligent cleaners can fall into bad habits. Here are five common cleaning mistakes and how to avoid them.</p>
                
                <h3>1. Using Too Much Product</h3>
                <p>More isn't always better. Excess cleaning product leaves residue that attracts more dirt. Follow product instructions and use sparingly.</p>
                
                <h3>2. Cleaning Windows in Direct Sunlight</h3>
                <p>The sun causes cleaning solution to dry too quickly, leaving streaks. Clean windows on cloudy days or when they're in shade.</p>
                
                <h3>3. Not Letting Products Sit</h3>
                <p>Disinfectants need contact time to work effectively. Spray surfaces and let them sit for the recommended time before wiping.</p>
                
                <h3>4. Using the Same Cloth Everywhere</h3>
                <p>This spreads germs from room to room. Use separate cloths for different areas, especially bathrooms and kitchens.</p>
                
                <h3>5. Forgetting to Clean Your Cleaning Tools</h3>
                <p>Dirty mops, sponges, and vacuum filters reduce effectiveness and spread bacteria. Clean and replace tools regularly.</p>
            `,
        },
    };

    // Get current post
    $: slug = $page.params.slug;
    $: post = posts[slug] || null;

    // Related posts (exclude current)
    $: relatedPosts = Object.entries(posts)
        .filter(([key]) => key !== slug)
        .slice(0, 3)
        .map(([key, value]) => ({ slug: key, ...value }));
</script>

<svelte:head>
    {#if post}
        <title>{post.title} - Noble Jade Blog</title>
        <meta
            name="description"
            content={post.content.replace(/<[^>]*>/g, "").substring(0, 160)}
        />
    {:else}
        <title>Post Not Found - Noble Jade Blog</title>
    {/if}
</svelte:head>

<div class="blog-post-page">
    {#if post}
        <!-- Hero Image -->
        <section class="post-hero">
            <div class="hero-image">
                <img src={post.image} alt={post.title} />
                <div class="hero-overlay"></div>
            </div>
            <div class="hero-content">
                <div class="container">
                    <div class="meta-top">
                        {#each post.categories as cat}
                            <a
                                href="/blog/category/{cat
                                    .toLowerCase()
                                    .replace(' & ', '-')
                                    .replace(' ', '-')}"
                                class="category-tag">{cat}</a
                            >
                        {/each}
                    </div>
                    <h1>{post.title}</h1>
                    <div class="meta-bottom">
                        <div class="author">
                            <img src={post.authorAvatar} alt={post.author} />
                            <span>{post.author}</span>
                        </div>
                        <span class="date">{post.date}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Post Content -->
        <section class="post-content">
            <div class="container">
                <article class="content-article">
                    {@html post.content}
                </article>

                <!-- Share Section -->
                <div class="share-section">
                    <span class="share-label">Share this article</span>
                    <div class="share-icons">
                        <a href="#" class="share-icon" aria-label="Copy link">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
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
                                width="18"
                                height="18"
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
                                width="18"
                                height="18"
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
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                                />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            class="share-icon"
                            aria-label="Share on WhatsApp"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Author Box -->
                <div class="author-box">
                    <img
                        src={post.authorAvatar}
                        alt={post.author}
                        class="author-avatar"
                    />
                    <div class="author-info">
                        <h4>{post.author}</h4>
                        <p>
                            The Noble Jade team is dedicated to providing
                            exceptional cleaning services and helpful tips for
                            maintaining a pristine home or office environment.
                        </p>
                    </div>
                </div>

                <!-- Navigation -->
                <div class="post-navigation">
                    <a href="/blog" class="nav-link">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <span>Back to Blog</span>
                    </a>
                </div>
            </div>
        </section>

        <!-- Related Posts -->
        <section class="related-posts">
            <div class="container">
                <h2>Related Articles</h2>
                <div class="related-grid">
                    {#each relatedPosts as related}
                        <a href="/blog/{related.slug}" class="related-card">
                            <div class="card-image">
                                <img src={related.image} alt={related.title} />
                            </div>
                            <div class="card-content">
                                <span class="date">{related.date}</span>
                                <h3>{related.title}</h3>
                            </div>
                        </a>
                    {/each}
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <FAQSection />
    {:else}
        <!-- 404 State -->
        <section class="not-found">
            <div class="container">
                <h1>Post Not Found</h1>
                <p>The blog post you're looking for doesn't exist.</p>
                <a href="/blog" class="back-btn">Back to Blog</a>
            </div>
        </section>
    {/if}
</div>

<style>
    .blog-post-page {
        display: flex;
        flex-direction: column;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    /* Hero */
    .post-hero {
        position: relative;
        min-height: 500px;
        display: flex;
        align-items: flex-end;
        padding: 3rem 1rem;
    }

    .hero-image {
        position: absolute;
        inset: 0;
        z-index: 0;
    }

    .hero-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    }

    .hero-content {
        position: relative;
        z-index: 1;
        width: 100%;
        color: white;
    }

    .meta-top {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .category-tag {
        background: var(--accent-color, #e82374);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.75rem;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .hero-content h1 {
        font-size: 2.5rem;
        font-weight: 500;
        margin: 0 0 1.5rem;
        line-height: 1.2;
        max-width: 700px;
    }

    .meta-bottom {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .author {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .author img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }

    .date {
        opacity: 0.8;
    }

    /* Content */
    .post-content {
        padding: 4rem 1rem;
    }

    .content-article {
        font-size: 1.125rem;
        line-height: 1.8;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .content-article {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .content-article :global(h3) {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 2rem 0 1rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .content-article :global(h3) {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .content-article :global(p) {
        margin: 0 0 1.5rem;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .content-article :global(p) {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .content-article :global(ul) {
        margin: 0 0 1.5rem;
        padding-left: 1.5rem;
    }

    .content-article :global(li) {
        margin-bottom: 0.5rem;
        color: var(--text-secondary, #666);
    }

    :global(.dark) .content-article :global(li) {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .content-article :global(blockquote) {
        margin: 2rem 0;
        padding: 1.5rem 2rem;
        background: var(--light-blue, #ecf4fd);
        border-left: 4px solid var(--accent-color, #e82374);
        border-radius: 0 1rem 1rem 0;
        font-style: italic;
    }

    :global(.dark) .content-article :global(blockquote) {
        background: var(--bg-secondary-dark, #252525);
    }

    .content-article :global(blockquote p) {
        margin: 0;
        font-size: 1.25rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .content-article :global(blockquote p) {
        color: var(--text-primary-dark, #f5f5f5);
    }

    /* Share Section */
    .share-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 2rem 0;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        margin: 2rem 0;
    }

    :global(.dark) .share-section {
        border-color: rgba(255, 255, 255, 0.1);
    }

    .share-label {
        font-weight: 500;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .share-label {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .share-icons {
        display: flex;
        gap: 0.5rem;
    }

    .share-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--accent-color, #e82374);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    .share-icon:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(232, 35, 116, 0.3);
    }

    /* Author Box */
    .author-box {
        display: flex;
        gap: 1.5rem;
        padding: 2rem;
        background: var(--light-blue, #ecf4fd);
        border-radius: var(--border-radius-lg, 1.5rem);
        margin-bottom: 2rem;
    }

    :global(.dark) .author-box {
        background: var(--bg-secondary-dark, #252525);
    }

    .author-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }

    .author-info h4 {
        font-size: 1.125rem;
        font-weight: 500;
        margin: 0 0 0.5rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .author-info h4 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .author-info p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
        line-height: 1.6;
    }

    :global(.dark) .author-info p {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    /* Navigation */
    .post-navigation {
        display: flex;
        justify-content: flex-start;
    }

    .nav-link {
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

    .nav-link:hover {
        background: var(--accent-hover, #c51d63);
        transform: translateX(-4px);
    }

    /* Related Posts */
    .related-posts {
        padding: 4rem 1rem;
        background: var(--light-blue, #ecf4fd);
    }

    :global(.dark) .related-posts {
        background: var(--bg-secondary-dark, #252525);
    }

    .related-posts .container {
        max-width: 1200px;
    }

    .related-posts h2 {
        font-size: 1.75rem;
        font-weight: 500;
        margin: 0 0 2rem;
        text-align: center;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .related-posts h2 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .related-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
    }

    .related-card {
        background: white;
        border-radius: var(--border-radius-lg, 1.5rem);
        overflow: hidden;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    :global(.dark) .related-card {
        background: var(--bg-primary-dark, #1a1a1a);
    }

    .related-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .related-card .card-image {
        aspect-ratio: 16 / 10;
        overflow: hidden;
    }

    .related-card .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .related-card:hover .card-image img {
        transform: scale(1.05);
    }

    .related-card .card-content {
        padding: 1.25rem;
    }

    .related-card .date {
        font-size: 0.75rem;
        color: var(--text-secondary, #666);
        display: block;
        margin-bottom: 0.5rem;
    }

    :global(.dark) .related-card .date {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .related-card h3 {
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
        color: var(--text-primary, #252525);
        line-height: 1.4;
        transition: color 0.3s ease;
    }

    :global(.dark) .related-card h3 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .related-card:hover h3 {
        color: var(--accent-color, #e82374);
    }

    /* Not Found */
    .not-found {
        padding: 8rem 1rem;
        text-align: center;
    }

    .not-found h1 {
        font-size: 2.5rem;
        margin: 0 0 1rem;
        color: var(--text-primary, #252525);
    }

    :global(.dark) .not-found h1 {
        color: var(--text-primary-dark, #f5f5f5);
    }

    .not-found p {
        color: var(--text-secondary, #666);
        margin-bottom: 2rem;
    }

    :global(.dark) .not-found p {
        color: var(--text-secondary-dark, #a0a0a0);
    }

    .back-btn {
        display: inline-block;
        padding: 0.875rem 2rem;
        background: var(--accent-color, #e82374);
        color: white;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .back-btn:hover {
        background: var(--accent-hover, #c51d63);
    }

    /* Responsive */
    @media (max-width: 992px) {
        .related-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .post-hero {
            min-height: 400px;
        }

        .hero-content h1 {
            font-size: 1.75rem;
        }

        .related-grid {
            grid-template-columns: 1fr;
        }

        .author-box {
            flex-direction: column;
            text-align: center;
            align-items: center;
        }
    }
</style>
