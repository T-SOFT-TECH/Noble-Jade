<script lang="ts">
    import { onMount } from "svelte";
    import { pb } from "$lib/pocketbase";

    interface Job {
        id: string;
        customer: string;
        address: string;
        date: string;
        time: string;
        status: string;
        type: string;
    }

    let jobs = $state<Job[]>([]);
    let isLoading = $state(true);

    onMount(async () => {
        await loadJobs();
    });

    async function loadJobs() {
        isLoading = true;
        try {
            const user = pb.authStore.model;
            if (!user) {
                console.error("User not logged in");
                isLoading = false;
                return;
            }

            // Fetch bookings (for admin: all in relevant status; for staff: assigned to them)
            // Using simpler filter syntax to avoid encoding issues
            let filter = "";

            if (user.role === "admin") {
                // Admin sees all jobs in relevant statuses
                filter = `status = "assigned" || status = "in_progress" || status = "completed"`;
            } else {
                // Staff sees only their assigned jobs - use ?~ for relation array contains
                filter = `assignedStaff ?~ "${user.id}"`;
            }

            const records = await pb.collection("bookings").getFullList({
                filter: filter || undefined,
                sort: "-created",
            });

            jobs = records.map((r: any) => ({
                id: r.id,
                customer: r.customerName || r.expand?.user?.name || "Unknown",
                address: `${r.address || ""}, ${r.city || ""}`,
                date: r.scheduledDate
                    ? new Date(r.scheduledDate).toLocaleDateString()
                    : "TBD",
                time: r.timeSlot || "TBD",
                status: r.status,
                type: r.serviceType || "Cleaning",
            }));
        } catch (error) {
            console.error("Error loading jobs:", error);
        } finally {
            isLoading = false;
        }
    }

    let activeFilter = $state("all");

    const filters = [
        { id: "all", label: "All Jobs" },
        { id: "assigned", label: "Assigned" },
        { id: "in_progress", label: "In Progress" },
        { id: "completed", label: "Completed" },
    ];

    const filteredJobs = $derived(
        activeFilter === "all"
            ? jobs
            : jobs.filter((job) => job.status === activeFilter),
    );

    const statusColors: Record<string, string> = {
        assigned: "gray",
        en_route: "blue",
        arrived: "purple",
        in_progress: "yellow",
        completed: "green",
    };

    const statusLabels: Record<string, string> = {
        assigned: "Assigned",
        en_route: "En Route",
        arrived: "Arrived",
        in_progress: "In Progress",
        completed: "Completed",
    };
</script>

<svelte:head>
    <title>My Jobs - Staff Portal</title>
</svelte:head>

<div class="jobs-page">
    <div class="page-header">
        <h1>My Jobs</h1>
        {#if !isLoading}
            <p class="job-count">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
            </p>
        {/if}
    </div>

    <!-- Filters -->
    <div class="filters">
        {#each filters as filter}
            <button
                class="filter-btn"
                class:active={activeFilter === filter.id}
                onclick={() => (activeFilter = filter.id)}
            >
                {filter.label}
            </button>
        {/each}
    </div>

    <!-- Jobs List -->
    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading jobs...</p>
        </div>
    {:else}
        <div class="jobs-list">
            {#each filteredJobs as job}
                <a href="/staff/jobs/{job.id}" class="job-card">
                    <div class="job-left">
                        <div class="job-header">
                            <span class="job-id">#{job.id.slice(0, 8)}</span>
                            <span class="job-status {statusColors[job.status]}"
                                >{statusLabels[job.status] || job.status}</span
                            >
                        </div>
                        <h3 class="job-customer">{job.customer}</h3>
                        <p class="job-address">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {job.address}
                        </p>
                    </div>
                    <div class="job-right">
                        <div class="job-type">{job.type}</div>
                        <div class="job-datetime">
                            <div class="job-date">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                    />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {job.date}
                            </div>
                            <div class="job-time">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {job.time}
                            </div>
                        </div>
                    </div>
                    <div class="job-arrow">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </a>
            {:else}
                <div class="empty-state">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <rect
                            x="2"
                            y="7"
                            width="20"
                            height="14"
                            rx="2"
                            ry="2"
                        />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <h3>No jobs found</h3>
                    <p>No jobs match the selected filter</p>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .jobs-page {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .loading {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--glass-bg);
        border-top-color: #22c55e;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .page-header {
        display: flex;
        align-items: baseline;
        gap: 1rem;
    }

    .page-header h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .job-count {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    /* Filters */
    .filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .filter-btn {
        padding: 0.625rem 1.25rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 50px;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .filter-btn:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }

    .filter-btn.active {
        background: #22c55e;
        border-color: #22c55e;
        color: white;
    }

    /* Jobs List */
    .jobs-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .job-card {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 1.5rem;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .job-card:hover {
        border-color: #22c55e;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
    }

    .job-left {
        flex: 1;
    }

    .job-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
    }

    .job-id {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary);
    }

    .job-status {
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .job-status.gray {
        background: rgba(156, 163, 175, 0.1);
        color: #9ca3af;
    }
    .job-status.blue {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
    }
    .job-status.purple {
        background: rgba(168, 85, 247, 0.1);
        color: #a855f7;
    }
    .job-status.yellow {
        background: rgba(234, 179, 8, 0.1);
        color: #eab308;
    }
    .job-status.green {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
    }

    .job-customer {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .job-address {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .job-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.75rem;
    }

    .job-type {
        padding: 0.375rem 1rem;
        background: var(--bg-tertiary);
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .job-datetime {
        display: flex;
        gap: 1rem;
    }

    .job-date,
    .job-time {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .job-arrow {
        color: var(--text-muted);
        transition: all 0.2s ease;
    }

    .job-card:hover .job-arrow {
        transform: translateX(4px);
        color: #22c55e;
    }

    /* Empty State */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }

    .empty-state svg {
        opacity: 0.4;
        margin-bottom: 1rem;
    }

    .empty-state h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .empty-state p {
        margin: 0;
    }

    @media (max-width: 768px) {
        .job-card {
            flex-direction: column;
            align-items: flex-start;
        }

        .job-right {
            align-items: flex-start;
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
        }

        .job-arrow {
            display: none;
        }
    }
</style>
