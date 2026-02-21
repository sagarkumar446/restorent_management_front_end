import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [], // Array of { ...foodItem, quantity }
    totalAmount: 0,
    totalQuantity: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.menuItemId === newItem.menuItemId);
            state.totalQuantity++;

            if (!existingItem) {
                state.items.push({
                    ...newItem,
                    quantity: 1,
                    totalPrice: newItem.price,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = Number(existingItem.totalPrice) + Number(newItem.price);
            }

            state.totalAmount = state.items.reduce(
                (total, item) => total + Number(item.price) * item.quantity,
                0
            );
        },
        removeFromCart(state, action) {
            const menuItemId = action.payload;
            const existingItem = state.items.find((item) => item.menuItemId === menuItemId);
            state.totalQuantity--;

            if (existingItem.quantity === 1) {
                state.items = state.items.filter((item) => item.menuItemId !== menuItemId);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            }

            state.totalAmount = state.items.reduce(
                (total, item) => total + Number(item.price) * item.quantity,
                0
            );
        },
        clearCart(state) {
            state.items = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
        },
    },
});

export const cartActions = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
