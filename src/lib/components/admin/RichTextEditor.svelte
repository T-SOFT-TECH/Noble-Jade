<script lang="ts">
    interface Props {
        value: string;
        placeholder?: string;
        minHeight?: string;
        onUpdate?: (html: string) => void;
    }

    let {
        value = "",
        placeholder = "Start writing...",
        minHeight = "200px",
        onUpdate,
    }: Props = $props();

    let editorRef: HTMLDivElement;

    function execCommand(command: string, value?: string) {
        document.execCommand(command, false, value);
        editorRef?.focus();
        updateValue();
    }

    function updateValue() {
        const html = editorRef?.innerHTML || "";
        onUpdate?.(html);
    }

    function handlePaste(e: ClipboardEvent) {
        e.preventDefault();
        const text = e.clipboardData?.getData("text/plain") || "";
        document.execCommand("insertText", false, text);
        updateValue();
    }
</script>

<div class="rich-text-editor">
    <div class="toolbar">
        <div class="toolbar-group">
            <button
                type="button"
                onclick={() => execCommand("bold")}
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                onclick={() => execCommand("italic")}
                title="Italic"
            >
                <em>I</em>
            </button>
            <button
                type="button"
                onclick={() => execCommand("underline")}
                title="Underline"
            >
                <u>U</u>
            </button>
        </div>
        <div class="toolbar-group">
            <button
                type="button"
                onclick={() => execCommand("formatBlock", "h2")}
                title="Heading 2"
            >
                H2
            </button>
            <button
                type="button"
                onclick={() => execCommand("formatBlock", "h3")}
                title="Heading 3"
            >
                H3
            </button>
            <button
                type="button"
                onclick={() => execCommand("formatBlock", "p")}
                title="Paragraph"
            >
                P
            </button>
        </div>
        <div class="toolbar-group">
            <button
                type="button"
                onclick={() => execCommand("insertUnorderedList")}
                title="Bullet List"
            >
                • List
            </button>
            <button
                type="button"
                onclick={() => execCommand("insertOrderedList")}
                title="Numbered List"
            >
                1. List
            </button>
        </div>
        <div class="toolbar-group">
            <button
                type="button"
                onclick={() => {
                    const url = prompt("Enter link URL:");
                    if (url) execCommand("createLink", url);
                }}
                title="Insert Link"
            >
                🔗
            </button>
            <button
                type="button"
                onclick={() => execCommand("removeFormat")}
                title="Clear Formatting"
            >
                ✕
            </button>
        </div>
    </div>

    <div
        class="editor-content"
        bind:this={editorRef}
        contenteditable="true"
        style="min-height: {minHeight}"
        oninput={updateValue}
        onpaste={handlePaste}
        role="textbox"
        aria-multiline="true"
    >
        {@html value}
    </div>
</div>

<style>
    .rich-text-editor {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        background: var(--bg-secondary);
    }
    .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid var(--border-color);
    }
    .toolbar-group {
        display: flex;
        gap: 2px;
    }
    .toolbar button {
        padding: 0.4rem 0.6rem;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 0.8rem;
        min-width: 32px;
    }
    .toolbar button:hover {
        background: var(--color-accent) 30;
        border-color: var(--color-accent);
    }
    .editor-content {
        padding: 1rem;
        color: var(--text-primary);
        line-height: 1.6;
        outline: none;
    }
    .editor-content:empty::before {
        content: attr(data-placeholder);
        color: var(--text-muted);
    }
    .editor-content h2 {
        font-size: 1.5rem;
        margin: 1rem 0 0.5rem;
    }
    .editor-content h3 {
        font-size: 1.25rem;
        margin: 1rem 0 0.5rem;
    }
    .editor-content p {
        margin: 0 0 1rem;
    }
    .editor-content ul,
    .editor-content ol {
        margin: 0 0 1rem;
        padding-left: 1.5rem;
    }
    .editor-content a {
        color: var(--color-accent);
        text-decoration: underline;
    }
</style>
