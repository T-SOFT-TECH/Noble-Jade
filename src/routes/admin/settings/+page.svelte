<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "$lib/stores/toast";
    import {
        getSettings,
        updateSettings,
        clearSettingsCache,
        getAllLocations,
        createLocation,
        updateLocation,
        deleteLocation,
        type Location,
    } from "$lib/services/settings";

    // Company Info
    let companyName = $state("");
    let shortName = $state("");
    let tagline = $state("");
    let email = $state("");
    let phone = $state("");
    let tollFree = $state("");
    let website = $state("");

    // Social Links
    let facebook = $state("");
    let instagram = $state("");
    let twitter = $state("");
    let linkedin = $state("");

    // Business Hours
    let weekdayHours = $state("");
    let saturdayHours = $state("");
    let sundayHours = $state("");

    // Booking Settings
    let bufferTime = $state(30);
    let advanceBooking = $state(24);
    let maxBookingsPerDay = $state(20);

    // Notification Settings
    let emailNotifications = $state(true);
    let smsNotifications = $state(false);
    let pushNotifications = $state(true);

    // Locations
    let locations = $state<Location[]>([]);

    let activeTab = $state("company");
    let isLoading = $state(true);
    let isSaving = $state(false);

    onMount(async () => {
        await loadAllSettings();
    });

    async function loadAllSettings() {
        isLoading = true;
        try {
            // Load settings
            const settings = await getSettings([
                "company_name",
                "company_short_name",
                "company_tagline",
                "website_url",
                "contact_email",
                "contact_phone",
                "toll_free",
                "social_facebook",
                "social_instagram",
                "social_twitter",
                "social_linkedin",
                "hours_weekdays",
                "hours_saturday",
                "hours_sunday",
                "booking_buffer_minutes",
                "booking_advance_hours",
                "booking_max_per_day",
                "notification_email",
                "notification_sms",
                "notification_push",
            ]);

            // Company
            companyName = settings.company_name || "";
            shortName = settings.company_short_name || "";
            tagline = settings.company_tagline || "";
            website = settings.website_url || "";

            // Contact
            email = settings.contact_email || "";
            phone = settings.contact_phone || "";
            tollFree = settings.toll_free || "";

            // Social
            facebook = settings.social_facebook || "";
            instagram = settings.social_instagram || "";
            twitter = settings.social_twitter || "";
            linkedin = settings.social_linkedin || "";

            // Hours
            weekdayHours = settings.hours_weekdays || "";
            saturdayHours = settings.hours_saturday || "";
            sundayHours = settings.hours_sunday || "";

            // Booking
            bufferTime = settings.booking_buffer_minutes || 30;
            advanceBooking = settings.booking_advance_hours || 24;
            maxBookingsPerDay = settings.booking_max_per_day || 20;

            // Notifications
            emailNotifications = settings.notification_email ?? true;
            smsNotifications = settings.notification_sms ?? false;
            pushNotifications = settings.notification_push ?? true;

            // Load locations
            locations = await getAllLocations();
        } catch (error: any) {
            console.error("Error loading settings:", error);
            toast.error(
                error.message ||
                    "Failed to load settings. Please check database connection.",
            );
        } finally {
            isLoading = false;
        }
    }

    async function saveSettings() {
        isSaving = true;

        try {
            const updates: Record<string, any> = {};

            if (activeTab === "company") {
                updates.company_name = companyName;
                updates.company_short_name = shortName;
                updates.company_tagline = tagline;
                updates.website_url = website;
                updates.contact_email = email;
                updates.contact_phone = phone;
                updates.toll_free = tollFree;
                updates.social_facebook = facebook;
                updates.social_instagram = instagram;
                updates.social_twitter = twitter;
                updates.social_linkedin = linkedin;
                updates.hours_weekdays = weekdayHours;
                updates.hours_saturday = saturdayHours;
                updates.hours_sunday = sundayHours;
            } else if (activeTab === "booking") {
                updates.booking_buffer_minutes = bufferTime;
                updates.booking_advance_hours = advanceBooking;
                updates.booking_max_per_day = maxBookingsPerDay;
            } else if (activeTab === "notifications") {
                updates.notification_email = emailNotifications;
                updates.notification_sms = smsNotifications;
                updates.notification_push = pushNotifications;
            }

            await updateSettings(updates);
            clearSettingsCache();
            toast.success("Settings saved successfully!");
        } catch (error: any) {
            console.error("Error saving settings:", error);
            toast.error(
                error.message || "Failed to save settings. Please try again.",
            );
        } finally {
            isSaving = false;
        }
    }

    async function saveLocations() {
        isSaving = true;
        let savedCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        try {
            for (const location of locations) {
                try {
                    if (location.id) {
                        await updateLocation(location.id, location);
                    } else {
                        const created = await createLocation(location);
                        location.id = created.id;
                    }
                    savedCount++;
                } catch (error: any) {
                    errorCount++;
                    errors.push(
                        `${location.name || "New location"}: ${error.message}`,
                    );
                }
            }

            if (errorCount === 0) {
                toast.success(`${savedCount} location(s) saved successfully!`);
            } else if (savedCount > 0) {
                toast.warning(
                    `${savedCount} saved, ${errorCount} failed. Errors:\n${errors.join("\n")}`,
                );
            } else {
                toast.error(`Failed to save locations:\n${errors.join("\n")}`);
            }
        } catch (error: any) {
            console.error("Error saving locations:", error);
            toast.error(
                error.message || "Failed to save locations. Please try again.",
            );
        } finally {
            isSaving = false;
        }
    }

    function addLocation() {
        locations = [
            ...locations,
            {
                id: "",
                name: "",
                city: "",
                province: "",
                address: "",
                postalCode: "",
                country: "Canada",
                phone: "",
                email: "",
                isPrimary: false,
                sortOrder: locations.length + 1,
                isActive: true,
            },
        ];
        toast.info("New location added. Fill in the details and save.");
    }

    async function removeLocation(index: number) {
        const location = locations[index];

        try {
            if (location.id) {
                await deleteLocation(location.id);
                toast.success(`"${location.name}" deleted successfully.`);
            }
            locations = locations.filter((_, i) => i !== index);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete location.");
        }
    }

    function setPrimaryLocation(index: number) {
        locations = locations.map((l, i) => ({ ...l, isPrimary: i === index }));
    }
</script>

<div class="settings-page">
    <div class="page-header">
        <h1>Settings</h1>
        <p>Configure company information and system settings</p>
    </div>

    {#if isLoading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading settings...</p>
        </div>
    {:else}
        <!-- Tabs -->
        <div class="tabs">
            <button
                class="tab"
                class:active={activeTab === "company"}
                onclick={() => (activeTab = "company")}>Company Info</button
            >
            <button
                class="tab"
                class:active={activeTab === "locations"}
                onclick={() => (activeTab = "locations")}>Locations</button
            >
            <button
                class="tab"
                class:active={activeTab === "booking"}
                onclick={() => (activeTab = "booking")}>Booking Settings</button
            >
            <button
                class="tab"
                class:active={activeTab === "notifications"}
                onclick={() => (activeTab = "notifications")}
                >Notifications</button
            >
        </div>

        <!-- Company Info Tab -->
        {#if activeTab === "company"}
            <div class="settings-grid">
                <section class="settings-card">
                    <h2>Basic Information</h2>
                    <div class="form-group">
                        <label for="companyName">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            bind:value={companyName}
                        />
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="shortName">Short Name</label>
                            <input
                                type="text"
                                id="shortName"
                                bind:value={shortName}
                            />
                        </div>
                        <div class="form-group">
                            <label for="website">Website</label>
                            <input
                                type="url"
                                id="website"
                                bind:value={website}
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="tagline">Tagline</label>
                        <input type="text" id="tagline" bind:value={tagline} />
                    </div>
                </section>

                <section class="settings-card">
                    <h2>Contact Information</h2>
                    <div class="form-group">
                        <label for="email">Main Email</label>
                        <input type="email" id="email" bind:value={email} />
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="tel" id="phone" bind:value={phone} />
                        </div>
                        <div class="form-group">
                            <label for="tollFree">Toll-Free</label>
                            <input
                                type="tel"
                                id="tollFree"
                                bind:value={tollFree}
                            />
                        </div>
                    </div>
                </section>

                <section class="settings-card">
                    <h2>Social Media</h2>
                    <div class="form-group">
                        <label for="facebook">Facebook URL</label>
                        <input type="url" id="facebook" bind:value={facebook} />
                    </div>
                    <div class="form-group">
                        <label for="instagram">Instagram URL</label>
                        <input
                            type="url"
                            id="instagram"
                            bind:value={instagram}
                        />
                    </div>
                    <div class="form-group">
                        <label for="twitter">Twitter URL</label>
                        <input type="url" id="twitter" bind:value={twitter} />
                    </div>
                    <div class="form-group">
                        <label for="linkedin">LinkedIn URL</label>
                        <input type="url" id="linkedin" bind:value={linkedin} />
                    </div>
                </section>

                <section class="settings-card">
                    <h2>Business Hours</h2>
                    <div class="form-group">
                        <label for="weekdays">Weekdays (Mon-Fri)</label>
                        <input
                            type="text"
                            id="weekdays"
                            bind:value={weekdayHours}
                        />
                    </div>
                    <div class="form-group">
                        <label for="saturday">Saturday</label>
                        <input
                            type="text"
                            id="saturday"
                            bind:value={saturdayHours}
                        />
                    </div>
                    <div class="form-group">
                        <label for="sunday">Sunday</label>
                        <input
                            type="text"
                            id="sunday"
                            bind:value={sundayHours}
                        />
                    </div>
                </section>
            </div>
        {/if}

        <!-- Locations Tab -->
        {#if activeTab === "locations"}
            <div class="locations-section">
                <div class="section-header">
                    <h2>Office Locations</h2>
                    <button class="add-btn" onclick={addLocation}
                        >+ Add Location</button
                    >
                </div>

                {#each locations as location, i}
                    <div class="location-card">
                        <div class="location-header">
                            <input
                                type="text"
                                class="location-name"
                                bind:value={location.name}
                                placeholder="Location Name"
                            />
                            <label class="primary-toggle">
                                <input
                                    type="radio"
                                    name="primary"
                                    checked={location.isPrimary}
                                    onchange={() => setPrimaryLocation(i)}
                                />
                                Primary
                            </label>
                            <button
                                class="remove-btn"
                                onclick={() => removeLocation(i)}
                                title="Delete location">×</button
                            >
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    bind:value={location.address}
                                />
                            </div>
                            <div class="form-group">
                                <label>City</label>
                                <input type="text" bind:value={location.city} />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Province</label>
                                <input
                                    type="text"
                                    bind:value={location.province}
                                />
                            </div>
                            <div class="form-group">
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    bind:value={location.postalCode}
                                />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="tel" bind:value={location.phone} />
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    bind:value={location.email}
                                />
                            </div>
                        </div>
                    </div>
                {/each}

                {#if locations.length === 0}
                    <div class="empty-state">
                        <p>
                            No locations added yet. Click "Add Location" to
                            create your first office location.
                        </p>
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Booking Settings Tab -->
        {#if activeTab === "booking"}
            <div class="settings-grid single">
                <section class="settings-card">
                    <h2>Scheduling</h2>
                    <div class="form-group">
                        <label for="buffer"
                            >Buffer time between bookings (minutes)</label
                        >
                        <input
                            type="number"
                            id="buffer"
                            bind:value={bufferTime}
                            min="0"
                            max="120"
                        />
                    </div>
                    <div class="form-group">
                        <label for="advance"
                            >Minimum advance booking (hours)</label
                        >
                        <input
                            type="number"
                            id="advance"
                            bind:value={advanceBooking}
                            min="1"
                            max="168"
                        />
                    </div>
                    <div class="form-group">
                        <label for="maxBookings">Max bookings per day</label>
                        <input
                            type="number"
                            id="maxBookings"
                            bind:value={maxBookingsPerDay}
                            min="1"
                            max="100"
                        />
                    </div>
                </section>
            </div>
        {/if}

        <!-- Notifications Tab -->
        {#if activeTab === "notifications"}
            <div class="settings-grid single">
                <section class="settings-card">
                    <h2>Notification Preferences</h2>
                    <div class="toggle-row">
                        <div>
                            <span>Email notifications</span>
                            <p class="toggle-desc">
                                Receive booking updates via email
                            </p>
                        </div>
                        <label class="toggle">
                            <input
                                type="checkbox"
                                bind:checked={emailNotifications}
                            />
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="toggle-row">
                        <div>
                            <span>SMS notifications</span>
                            <p class="toggle-desc">
                                Receive text message alerts
                            </p>
                        </div>
                        <label class="toggle">
                            <input
                                type="checkbox"
                                bind:checked={smsNotifications}
                            />
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="toggle-row">
                        <div>
                            <span>Push notifications</span>
                            <p class="toggle-desc">
                                Browser push notifications
                            </p>
                        </div>
                        <label class="toggle">
                            <input
                                type="checkbox"
                                bind:checked={pushNotifications}
                            />
                            <span class="slider"></span>
                        </label>
                    </div>
                </section>
            </div>
        {/if}

        <!-- Save Button -->
        <div class="save-bar">
            <button
                class="save-btn"
                onclick={activeTab === "locations"
                    ? saveLocations
                    : saveSettings}
                disabled={isSaving}
            >
                {#if isSaving}
                    <span class="btn-spinner"></span>
                    Saving...
                {:else}
                    Save Changes
                {/if}
            </button>
        </div>
    {/if}
</div>

<style>
    .settings-page {
        color: var(--text-primary);
    }
    .page-header {
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

    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem;
        gap: 1rem;
        color: var(--text-secondary);
    }
    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border-color);
        border-top-color: var(--color-accent);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 1rem;
    }
    .tab {
        padding: 0.75rem 1.25rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9375rem;
        transition: all 0.2s;
    }
    .tab:hover {
        color: var(--text-primary);
        background: var(--glass-bg);
    }
    .tab.active {
        background: var(--color-accent);
        color: white;
    }

    .settings-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
    .settings-grid.single {
        grid-template-columns: 1fr;
        max-width: 600px;
    }
    .settings-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid var(--border-color);
    }
    .settings-card h2 {
        font-size: 1rem;
        margin: 0 0 1.25rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-primary);
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
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--color-accent);
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    .toggle-row:last-child {
        border-bottom: none;
    }
    .toggle-desc {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin: 0.25rem 0 0;
    }
    .toggle {
        position: relative;
        width: 48px;
        height: 26px;
        flex-shrink: 0;
    }
    .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        inset: 0;
        background: var(--border-color);
        border-radius: 26px;
        cursor: pointer;
        transition: 0.2s;
    }
    .slider::before {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        left: 3px;
        bottom: 3px;
        background: white;
        border-radius: 50%;
        transition: 0.2s;
    }
    .toggle input:checked + .slider {
        background: var(--color-accent);
    }
    .toggle input:checked + .slider::before {
        transform: translateX(22px);
    }

    .locations-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    .section-header h2 {
        margin: 0;
        font-size: 1.125rem;
    }
    .add-btn {
        padding: 0.5rem 1rem;
        background: var(--color-accent);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }
    .location-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.25rem;
        border: 1px solid var(--border-color);
    }
    .location-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    .location-name {
        flex: 1;
        font-size: 1rem;
        font-weight: 600;
        padding: 0.5rem;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-primary);
    }
    .primary-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
    .remove-btn {
        width: 32px;
        height: 32px;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1.25rem;
    }
    .remove-btn:hover {
        background: rgba(239, 68, 68, 0.2);
    }
    .empty-state {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        color: var(--text-muted);
        border: 1px dashed var(--border-color);
    }

    .save-bar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color);
    }
    .save-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.875rem 2rem;
        min-width: 160px;
        background: var(--color-accent);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        font-size: 1rem;
        transition: opacity 0.2s;
    }
    .save-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    .btn-spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @media (max-width: 768px) {
        .settings-grid {
            grid-template-columns: 1fr;
        }
        .form-row {
            grid-template-columns: 1fr;
        }
        .tabs {
            flex-wrap: wrap;
        }
    }
</style>
