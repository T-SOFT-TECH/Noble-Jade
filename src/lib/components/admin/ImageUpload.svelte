<script lang="ts">
    import { pb } from "$lib/pocketbase";
    import { toast } from "$lib/stores/toast";

    interface Props {
        collection: string;
        recordId?: string;
        field: string;
        currentImage?: string;
        onUpload?: (url: string) => void;
    }

    let { collection, recordId, field, currentImage, onUpload }: Props =
        $props();

    let fileInput: HTMLInputElement;
    let isUploading = $state(false);
    let previewUrl = $state(currentImage || "");
    let dragOver = $state(false);

    function triggerFileSelect() {
        fileInput?.click();
    }

    async function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            await uploadFile(file);
        }
    }

    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        dragOver = true;
    }

    function handleDragLeave() {
        dragOver = false;
    }

    async function handleDrop(event: DragEvent) {
        event.preventDefault();
        dragOver = false;
        const file = event.dataTransfer?.files[0];
        if (file && file.type.startsWith("image/")) {
            await uploadFile(file);
        }
    }

    async function uploadFile(file: File) {
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        isUploading = true;

        try {
            // Create preview immediately
            previewUrl = URL.createObjectURL(file);

            if (recordId) {
                // Update existing record
                const formData = new FormData();
                formData.append(field, file);

                const record = await pb
                    .collection(collection)
                    .update(recordId, formData);
                const imageUrl = pb.files.getURL(record, record[field]);
                previewUrl = imageUrl;
                onUpload?.(imageUrl);
                toast.success("Image uploaded!");
            } else {
                // Just set preview for new records - actual upload happens on save
                onUpload?.(previewUrl);
            }
        } catch (error: any) {
            console.error("[ImageUpload] Error:", error);
            toast.error(error.message || "Failed to upload image");
            previewUrl = currentImage || "";
        } finally {
            isUploading = false;
        }
    }

    function removeImage() {
        previewUrl = "";
        onUpload?.("");
    }
</script>

<div
    class="image-upload"
    class:has-image={previewUrl}
    class:drag-over={dragOver}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === "Enter" && triggerFileSelect()}
>
    <input
        type="file"
        accept="image/*"
        bind:this={fileInput}
        onchange={handleFileSelect}
        hidden
    />

    {#if isUploading}
        <div class="uploading">
            <div class="spinner"></div>
            <span>Uploading...</span>
        </div>
    {:else if previewUrl}
        <div class="preview">
            <img src={previewUrl} alt="Preview" />
            <div class="overlay">
                <button
                    type="button"
                    class="change-btn"
                    onclick={triggerFileSelect}>Change</button
                >
                <button type="button" class="remove-btn" onclick={removeImage}
                    >Remove</button
                >
            </div>
        </div>
    {:else}
        <button type="button" class="upload-area" onclick={triggerFileSelect}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span class="upload-text">Click or drag image here</span>
            <span class="upload-hint">Max 5MB, JPG/PNG/WebP</span>
        </button>
    {/if}
</div>

<style>
    .image-upload {
        border: 2px dashed var(--border-color);
        border-radius: 12px;
        overflow: hidden;
        transition:
            border-color 0.2s,
            background 0.2s;
    }
    .image-upload.drag-over {
        border-color: var(--color-accent);
        background: var(--color-accent) 10;
    }
    .image-upload.has-image {
        border-style: solid;
    }
    .upload-area {
        width: 100%;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
    }
    .upload-area:hover {
        color: var(--color-accent);
    }
    .upload-area svg {
        opacity: 0.5;
    }
    .upload-text {
        font-size: 0.875rem;
    }
    .upload-hint {
        font-size: 0.75rem;
        opacity: 0.6;
    }
    .uploading {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }
    .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid var(--glass-bg);
        border-top-color: var(--color-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    .preview {
        position: relative;
    }
    .preview img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        display: block;
    }
    .overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s;
    }
    .preview:hover .overlay {
        opacity: 1;
    }
    .change-btn,
    .remove-btn {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        border: none;
    }
    .change-btn {
        background: var(--color-accent);
        color: white;
    }
    .remove-btn {
        background: #ef4444;
        color: white;
    }
</style>
