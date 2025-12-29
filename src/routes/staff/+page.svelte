<script lang="ts">
    // Mock data for demonstration - will be replaced with PocketBase data
    const todayJobs = [
        {
            id: "J001",
            customer: "Sarah Johnson",
            address: "123 Oak St, Toronto",
            time: "9:00 AM",
            status: "in_progress",
            type: "Deep Cleaning",
        },
        {
            id: "J002",
            customer: "Mike Chen",
            address: "456 Maple Ave, Toronto",
            time: "1:00 PM",
            status: "assigned",
            type: "Standard Cleaning",
        },
        {
            id: "J003",
            customer: "Emily Brown",
            address: "789 Pine Rd, Toronto",
            time: "4:00 PM",
            status: "assigned",
            type: "Move In/Out",
        },
    ];

    const stats = [
        {
            label: "Today's Jobs",
            value: "3",
            icon: "briefcase",
            color: "green",
        },
        {
            label: "Completed This Week",
            value: "12",
            icon: "check",
            color: "blue",
        },
        { label: "Pending Reviews", value: "2", icon: "star", color: "yellow" },
        {
            label: "Total Earnings",
            value: "$1,250",
            icon: "dollar",
            color: "purple",
        },
    ];

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

<div class="staff-dashboard">
    <!-- Stats Grid -->
    <div class="stats-grid">
        {#each stats as stat}
            <div class="stat-card {stat.color}">
                <div class="stat-icon">
                    {#if stat.icon === "briefcase"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect
                                x="2"
                                y="7"
                                width="20"
                                height="14"
                                rx="2"
                                ry="2"
                            />
                            <path
                                d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                            />
                        </svg>
                    {:else if stat.icon === "check"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    {:else if stat.icon === "star"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                            />
                        </svg>
                    {:else if stat.icon === "dollar"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path
                                d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                            />
                        </svg>
                    {/if}
                </div>
                <div class="stat-content">
                    <p class="stat-value">{stat.value}</p>
                    <p class="stat-label">{stat.label}</p>
                </div>
            </div>
        {/each}
    </div>

    <!-- Today's Jobs -->
    <section class="section">
        <div class="section-header">
            <h2>Today's Jobs</h2>
            <a href="/staff/jobs" class="view-all">View All →</a>
        </div>

        <div class="jobs-list">
            {#each todayJobs as job}
                <a href="/staff/jobs/{job.id}" class="job-card">
                    <div class="job-main">
                        <div class="job-info">
                            <div class="job-header">
                                <span class="job-id">#{job.id}</span>
                                <span
                                    class="job-status {statusColors[
                                        job.status
                                    ]}">{statusLabels[job.status]}</span
                                >
                            </div>
                            <h3 class="job-customer">{job.customer}</h3>
                            <p class="job-address">{job.address}</p>
                        </div>
                        <div class="job-meta">
                            <div class="job-type">{job.type}</div>
                            <div class="job-time">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
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
            {/each}
        </div>
    </section>

    <!-- Quick Actions -->
    <section class="section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
            <a href="/staff/jobs" class="action-card">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span>View All Jobs</span>
            </a>
            <a href="/staff/schedule" class="action-card">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>My Schedule</span>
            </a>
            <a href="/staff/messages" class="action-card">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    />
                </svg>
                <span>Messages</span>
            </a>
        </div>
    </section>
</div>

<style>
    .staff-dashboard {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .stat-card {
        background: var(--bg-secondary);
        border-radius: 16px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid var(--border-color);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stat-card.green .stat-icon {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
    }

    .stat-card.blue .stat-icon {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
    }

    .stat-card.yellow .stat-icon {
        background: rgba(234, 179, 8, 0.1);
        color: #eab308;
    }

    .stat-card.purple .stat-icon {
        background: rgba(168, 85, 247, 0.1);
        color: #a855f7;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
    }

    .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    /* Section */
    .section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .section-header h2,
    .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .view-all {
        font-size: 0.875rem;
        color: #22c55e;
        text-decoration: none;
        font-weight: 500;
    }

    .view-all:hover {
        text-decoration: underline;
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
        justify-content: space-between;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.25rem;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .job-card:hover {
        border-color: #22c55e;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
    }

    .job-main {
        display: flex;
        align-items: center;
        gap: 2rem;
        flex: 1;
    }

    .job-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.25rem;
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
        text-transform: capitalize;
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
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
    }

    .job-address {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .job-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
    }

    .job-type {
        padding: 0.25rem 0.75rem;
        background: var(--bg-tertiary);
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .job-time {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .job-arrow {
        color: var(--text-muted);
        transition: transform 0.2s ease;
    }

    .job-card:hover .job-arrow {
        transform: translateX(4px);
        color: #22c55e;
    }

    /* Actions Grid */
    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }

    .action-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        text-decoration: none;
        color: var(--text-primary);
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .action-card:hover {
        border-color: #22c55e;
        color: #22c55e;
    }

    @media (max-width: 768px) {
        .job-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }

        .job-meta {
            align-items: flex-start;
            flex-direction: row;
            gap: 1rem;
        }
    }
</style>
