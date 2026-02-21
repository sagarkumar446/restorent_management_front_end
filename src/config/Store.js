import { configureStore } from "@reduxjs/toolkit";
import { getAllMenuItemSlice } from "../feature/getMenuItemSlice";
import { SendMailSlice } from "../feature/SendEmailSlice";
import { addMenuItemSlice } from "../feature/addMenuItemSlice";
import { cartReducer } from "../feature/cartSlice";
import { adminAuthReducer } from "../feature/adminAuthSlice";
import categoryReducer from "../feature/categorySlice";

export const store = configureStore({
  reducer: {
    getAllMenuItemSlice: getAllMenuItemSlice.reducer,
    SendMailSlice: SendMailSlice.reducer,
    addMenuItemSlice: addMenuItemSlice.reducer,
    cart: cartReducer,
    adminAuth: adminAuthReducer,
    categories: categoryReducer,
  }
});

