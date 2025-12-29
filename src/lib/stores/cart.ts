import { writable, derived, get } from "svelte/store";
import { pb } from "$lib/pocketbase";
import { auth } from "./auth";

export interface CartItem {
    id: string;
    // Service details
    serviceType: string; // e.g., "deep", "standard"
    serviceName: string; // e.g., "Deep Cleaning"
    frequency: string; // e.g., "one-time", "weekly"

    // Property details
    propertyType: string; // e.g., "Apartment", "House"
    squareFootage: number;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    hasBasement: boolean;
    hasGarage: boolean;

    // Add-ons
    addons: {
        windowCleaning: boolean;
        carpetCleaning: boolean;
        appliances: boolean;
        laundry: boolean;
        organization: boolean;
        fridgeCleaning: boolean;
        petHairRemoval: boolean;
        sanitization: boolean;
        ecoFriendly: boolean;
    };

    // Schedule
    scheduledDate: string;
    timeSlot: string;

    // Address
    address: string;
    city: string;
    province: string;
    postalCode: string;
    accessCode: string;
    parkingInfo: string;
    specialInstructions: string;

    // Pricing
    subtotal: number;
    discount: number;
    total: number;
}

export interface CartState {
    items: CartItem[];
    currentQuote: CartItem | null;
    isLoading: boolean;
    error: string | null;
}

function createCartStore() {
    const { subscribe, set, update } = writable<CartState>({
        items: [],
        currentQuote: null,
        isLoading: false,
        error: null,
    });

    return {
        subscribe,

        // Set current quote from calculator
        setQuote: (quote: Omit<CartItem, "id">) => {
            update((state) => ({
                ...state,
                currentQuote: {
                    ...quote,
                    id: crypto.randomUUID(),
                },
            }));
        },

        // Add current quote to cart
        addToCart: () => {
            update((state) => {
                if (!state.currentQuote) return state;
                return {
                    ...state,
                    items: [...state.items, state.currentQuote],
                    currentQuote: null,
                };
            });
        },

        // Remove item from cart
        removeItem: (id: string) => {
            update((state) => ({
                ...state,
                items: state.items.filter((item) => item.id !== id),
            }));
        },

        // Clear cart
        clear: () => {
            update((state) => ({
                ...state,
                items: [],
                currentQuote: null,
            }));
        },

        // Get cart total
        getTotal: () => {
            const state = get({ subscribe });
            return state.items.reduce((sum, item) => sum + item.total, 0);
        },

        // Submit booking to PocketBase
        submitBooking: async (contactInfo: {
            name: string;
            email: string;
            phone: string;
        }) => {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                const authState = get(auth);
                const state = get({ subscribe });

                const createdBookings = [];

                // Create a booking for each cart item
                for (const item of state.items) {
                    const bookingData = {
                        // Customer reference
                        user: authState.user?.id || null,
                        customerName: contactInfo.name,
                        customerEmail: contactInfo.email,
                        customerPhone: contactInfo.phone,

                        // Service details
                        serviceType: item.serviceType,
                        propertyType: item.propertyType,
                        squareFootage: item.squareFootage,
                        bedrooms: item.bedrooms,
                        bathrooms: item.bathrooms,
                        floors: item.floors || 1,
                        hasBasement: item.hasBasement || false,
                        hasGarage: item.hasGarage || false,
                        addons: item.addons,

                        // Schedule
                        frequency: item.frequency,
                        scheduledDate: item.scheduledDate,
                        timeSlot: item.timeSlot,

                        // Address
                        address: item.address,
                        city: item.city,
                        province: item.province,
                        postalCode: item.postalCode,
                        accessCode: item.accessCode || "",
                        parkingInfo: item.parkingInfo || "",
                        specialInstructions: item.specialInstructions || "",

                        // Pricing
                        originalSubtotal: item.subtotal,
                        originalDiscount: item.discount,
                        originalTotal: item.total,
                        subtotal: item.subtotal,
                        discount: item.discount,
                        total: item.total,

                        // Status
                        status: "pending_review",
                    };

                    const booking = await pb.collection("bookings").create(bookingData);
                    createdBookings.push(booking);
                }

                // Clear cart after successful booking
                update((state) => ({
                    ...state,
                    items: [],
                    currentQuote: null,
                    isLoading: false,
                }));

                return { success: true, bookings: createdBookings };
            } catch (error: any) {
                console.error("Booking submission error:", error);
                // Log detailed PocketBase error
                if (error.response?.data) {
                    console.error("PocketBase validation errors:", JSON.stringify(error.response.data, null, 2));
                }
                if (error.data) {
                    console.error("PocketBase error data:", JSON.stringify(error.data, null, 2));
                }
                update((state) => ({
                    ...state,
                    isLoading: false,
                    error: error.message || "Failed to submit booking",
                }));
                return { success: false, error: error.message };
            }
        },
    };
}

export const cart = createCartStore();

// Derived stores
export const cartTotal = derived(cart, ($cart) =>
    $cart.items.reduce((sum, item) => sum + item.total, 0)
);

export const cartItemCount = derived(cart, ($cart) => $cart.items.length);
