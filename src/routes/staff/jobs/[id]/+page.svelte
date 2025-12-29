<script lang="ts">
    import { page } from "$app/stores";
    import { onMount, onDestroy } from "svelte";
    import { pb } from "$lib/pocketbase";
    import { bookings, jobProgress } from "$lib/services/bookings";
    import {
        createRealtimeBookingStore,
        createRealtimeProgressStore,
    } from "$lib/services/realtime";

    const jobId = $page.params.id;

    let booking = $state<any>(null);
    let progressUpdates = $state<any[]>([]);
    let isLoading = $state(true);
    let isUpdating = $state(false);

    // Photo upload
    let photoFiles = $state<File[]>([]);
    let progressTitle = $state("");
    let progressDescription = $state("");
    let showPostModal = $state(false);
    let fileInput: HTMLInputElement;

    // Realtime stores
    let bookingStore: any;
    let progressStore: any;

    const stages = [
        { id: 1, name: "Started", stage: "started" },
        { id: 2, name: "Bedroom", stage: "cleaning_bedroom" },
        { id: 3, name: "Bathroom", stage: "cleaning_bathroom" },
        { id: 4, name: "Kitchen", stage: "cleaning_kitchen" },
        { id: 5, name: "Living Area", stage: "cleaning_living" },
        { id: 6, name: "Finishing", stage: "finishing" },
        { id: 7, name: "Photos", stage: "photos" },
        { id: 8, name: "Completed", stage: "completed" },
    ];

    onMount(async () => {
        bookingStore = createRealtimeBookingStore(jobId);
        progressStore = createRealtimeProgressStore(jobId);

        await bookingStore.init();
        await progressStore.init();

        bookingStore.subscribe((value: any) => {
            booking = value;
            isLoading = !value;
        });

        progressStore.subscribe((value: any[]) => {
            progressUpdates = value;
        });
    });

    onDestroy(() => {
        bookingStore?.destroy();
        progressStore?.destroy();
    });

    async function startJob() {
        isUpdating = true;
        await bookings.startJob(jobId);
        isUpdating = false;
    }

    async function completeJob() {
        isUpdating = true;
        await bookings.completeJob(jobId);
        isUpdating = false;
    }

    async function postProgress() {
        if (!progressTitle) return;
        isUpdating = true;

        const currentStage = booking?.currentStage || 1;
        const stageInfo = stages[currentStage] || stages[0];

        await jobProgress.addProgress({
            booking: jobId,
            stage: stageInfo.stage,
            stageNumber: currentStage,
            title: progressTitle,
            description: progressDescription,
            photos: photoFiles,
        });

        // Reset form
        progressTitle = "";
        progressDescription = "";
        photoFiles = [];
        showPostModal = false;
        isUpdating = false;
    }

    function handleFileSelect(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files) {
            photoFiles = [...photoFiles, ...Array.from(target.files)];
        }
    }

    function removePhoto(index: number) {
        photoFiles = photoFiles.filter((_, i) => i !== index);
    }

    function getPhotoUrl(update: any, photo: string) {
        return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/job_progress/${update.id}/${photo}`;
    }
</script>

<svelte:head>
    <title>Job #{jobId?.slice(0, 8)} - Staff Portal</title>
</svelte:head>

<div class="job-detail">
    {#if isLoading}
        <div class="loading">Loading job details...</div>
    {:else if booking}
        <div class="job-header">
            <a href="/staff/jobs" class="back-link">← Back to Jobs</a>
            <div class="job-title">
                <h1>Job #{jobId?.slice(0, 8)}</h1>
                <span class="status-badge {booking.status}"
                    >{booking.status.replace("_", " ")}</span
                >
            </div>
        </div>

        <div class="job-grid">
            <!-- Main Content -->
            <div class="job-main">
                <!-- Start/Complete Job -->
                {#if booking.status === "assigned"}
                    <button
                        class="action-btn start"
                        onclick={startJob}
                        disabled={isUpdating}
                    >
                        🚀 Start This Job
                    </button>
                {:else if booking.status === "in_progress"}
                    <!-- Post Progress Update -->
                    <section class="card">
                        <div class="card-header">
                            <h2>📍 Post Progress Update</h2>
                        </div>
                        <button
                            class="post-btn"
                            onclick={() => (showPostModal = true)}
                        >
                            + Add Update with Photos
                        </button>
                    </section>

                    <!-- Progress Timeline -->
                    <section class="card">
                        <h2>Progress Timeline</h2>
                        <div class="timeline">
                            {#each progressUpdates as update}
                                <div class="timeline-item">
                                    <div class="timeline-time">
                                        {new Date(
                                            update.created,
                                        ).toLocaleTimeString()}
                                    </div>
                                    <div class="timeline-content">
                                        <h4>{update.title}</h4>
                                        {#if update.description}
                                            <p>{update.description}</p>
                                        {/if}
                                        {#if update.photos?.length}
                                            <div class="timeline-photos">
                                                {#each update.photos as photo}
                                                    <img
                                                        src={getPhotoUrl(
                                                            update,
                                                            photo,
                                                        )}
                                                        alt="Progress"
                                                    />
                                                {/each}
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {:else}
                                <p class="no-updates">
                                    No updates yet. Post your first progress
                                    update!
                                </p>
                            {/each}
                        </div>
                    </section>

                    <!-- Complete Job Button -->
                    <button
                        class="action-btn complete"
                        onclick={completeJob}
                        disabled={isUpdating}
                    >
                        ✅ Mark Job Complete
                    </button>
                {:else if booking.status === "completed"}
                    <div class="completed-banner">
                        ✅ This job has been completed!
                    </div>
                {/if}

                <!-- Special Instructions -->
                {#if booking.specialInstructions}
                    <section class="card">
                        <h2>Special Instructions</h2>
                        <p class="notes">{booking.specialInstructions}</p>
                    </section>
                {/if}
            </div>

            <!-- Sidebar -->
            <div class="job-sidebar">
                <section class="card">
                    <h3>Customer</h3>
                    <p class="customer-name">{booking.customerName}</p>
                    <a href="tel:{booking.customerPhone}" class="contact-link"
                        >📞 {booking.customerPhone}</a
                    >
                    <a
                        href="mailto:{booking.customerEmail}"
                        class="contact-link">✉️ {booking.customerEmail}</a
                    >
                </section>

                <section class="card">
                    <h3>Location</h3>
                    <p class="address">{booking.address}</p>
                    <p class="city">{booking.city}, {booking.province}</p>
                    <a
                        href="https://maps.google.com/?q={booking.address}, {booking.city}"
                        target="_blank"
                        class="directions-btn"
                    >
                        🧭 Get Directions
                    </a>
                </section>

                <section class="card">
                    <h3>Schedule</h3>
                    <p>
                        📅 {new Date(
                            booking.scheduledDate,
                        ).toLocaleDateString()}
                    </p>
                    <p>🕐 {booking.timeSlot}</p>
                </section>

                <section class="card">
                    <h3>Service</h3>
                    <p><strong>{booking.serviceType}</strong></p>
                    <p>
                        {booking.propertyType} • {booking.squareFootage} sq ft
                    </p>
                    <p>{booking.bedrooms} bed, {booking.bathrooms} bath</p>
                </section>
            </div>
        </div>
    {:else}
        <p>Job not found.</p>
    {/if}
</div>

<!-- Post Progress Modal -->
{#if showPostModal}
    <div
        class="modal-overlay"
        onclick={() => (showPostModal = false)}
        role="dialog"
        aria-modal="true"
    >
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h3>Post Progress Update</h3>
                <button
                    class="close-btn"
                    onclick={() => (showPostModal = false)}>×</button
                >
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        bind:value={progressTitle}
                        placeholder="e.g., Finished cleaning bedroom"
                    />
                </div>
                <div class="form-group">
                    <label for="desc">Description</label>
                    <textarea
                        id="desc"
                        bind:value={progressDescription}
                        placeholder="Optional details..."
                    ></textarea>
                </div>
                <div class="form-group">
                    <label>Photos</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        bind:this={fileInput}
                        onchange={handleFileSelect}
                        style="display:none"
                    />
                    <button class="upload-btn" onclick={() => fileInput.click()}
                        >📷 Add Photos</button
                    >
                    {#if photoFiles.length}
                        <div class="photo-previews">
                            {#each photoFiles as file, i}
                                <div class="preview">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                    />
                                    <button onclick={() => removePhoto(i)}
                                        >×</button
                                    >
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
            <div class="modal-footer">
                <button
                    class="btn-secondary"
                    onclick={() => (showPostModal = false)}>Cancel</button
                >
                <button
                    class="btn-primary"
                    onclick={postProgress}
                    disabled={!progressTitle || isUpdating}
                >
                    {isUpdating ? "Posting..." : "Post Update"}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .job-detail {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    .loading {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
    .back-link {
        color: var(--text-secondary);
        text-decoration: none;
    }
    .back-link:hover {
        color: #22c55e;
    }
    .job-header {
        margin-bottom: 1rem;
    }
    .job-title {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    .job-title h1 {
        font-size: 1.5rem;
        margin: 0;
    }
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
        background: rgba(34, 197, 94, 0.15);
        color: #22c55e;
    }
    .status-badge.in_progress {
        background: rgba(168, 85, 247, 0.15);
        color: #a855f7;
    }
    .status-badge.completed {
        background: rgba(34, 197, 94, 0.15);
        color: #22c55e;
    }

    .job-grid {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 1.5rem;
    }
    .job-main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .job-sidebar {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.25rem;
    }
    .card h2 {
        font-size: 1rem;
        margin: 0 0 1rem;
    }
    .card h3 {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        margin: 0 0 0.75rem;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .action-btn {
        width: 100%;
        padding: 1rem;
        border: none;
        border-radius: 12px;
        font-size: 1.125rem;
        font-weight: 600;
        cursor: pointer;
    }
    .action-btn.start {
        background: #22c55e;
        color: white;
    }
    .action-btn.complete {
        background: #a855f7;
        color: white;
    }
    .action-btn:disabled {
        opacity: 0.7;
    }

    .post-btn {
        width: 100%;
        padding: 1rem;
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border: 1px dashed #22c55e;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
    }

    .completed-banner {
        padding: 1.5rem;
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border-radius: 12px;
        text-align: center;
        font-weight: 600;
        font-size: 1.125rem;
    }

    .timeline {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .timeline-item {
        display: flex;
        gap: 1rem;
        padding-left: 1rem;
        border-left: 2px solid #22c55e;
    }
    .timeline-time {
        font-size: 0.75rem;
        color: var(--text-secondary);
        min-width: 60px;
    }
    .timeline-content h4 {
        margin: 0 0 0.25rem;
        font-size: 0.9375rem;
    }
    .timeline-content p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
    .timeline-photos {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
    }
    .timeline-photos img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
    }
    .no-updates {
        color: var(--text-secondary);
        font-style: italic;
        text-align: center;
        padding: 1rem;
    }

    .notes {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
    }
    .customer-name {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
    }
    .contact-link {
        display: block;
        color: var(--text-secondary);
        font-size: 0.875rem;
        text-decoration: none;
        margin-bottom: 0.25rem;
    }
    .address {
        font-weight: 500;
        margin: 0 0 0.25rem;
    }
    .city {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin: 0 0 0.75rem;
    }
    .directions-btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border-radius: 6px;
        text-decoration: none;
        font-size: 0.875rem;
    }

    /* Modal */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }
    .modal {
        background: var(--bg-secondary);
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--border-color);
    }
    .modal-header h3 {
        margin: 0;
    }
    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
    }
    .modal-body {
        padding: 1.25rem;
    }
    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        border-top: 1px solid var(--border-color);
    }

    .form-group {
        margin-bottom: 1rem;
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
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
    }
    .form-group textarea {
        min-height: 80px;
        resize: none;
    }
    .upload-btn {
        padding: 0.75rem 1rem;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
    }
    .photo-previews {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
        flex-wrap: wrap;
    }
    .preview {
        position: relative;
    }
    .preview img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
    }
    .preview button {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 20px;
        height: 20px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 0.75rem;
        cursor: pointer;
    }

    .btn-primary {
        padding: 0.75rem 1.5rem;
        background: #22c55e;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
    .btn-secondary {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
    }
    .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .job-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
