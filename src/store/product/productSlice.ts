import { Product } from '@/@types/product';
import { apiGetProductList } from '@/services/ProductService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const SLICE_NAME = 'product';

export type UserState = {
    productList?: Product[];
    cartItems: any;
    loading?: boolean;
};

const initialState: UserState = {
    productList: [],
    cartItems: [],
    loading: false,
};

// Async action to fetch product list
export const getProductList = createAsyncThunk(
    `${SLICE_NAME}/getProductList`,
    async () => {
        try {
            const response = await apiGetProductList();
            return {
                status: 'success',
                data: response?.data,
            };
        } catch (error: any) {
            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            };
        }
    }
);

const productSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        // Add or increment item count in the cart
        setCartItem: (state, action: PayloadAction<Product>) => {
            const { id, title, price, thumbnail } = action.payload;
            const existingProduct = state.cartItems.find((item: any) => item.id === id);
            if (existingProduct) {
                existingProduct.count += 1;
            } else {
                state.cartItems.push({ id, title, price, thumbnail, count: 1 });
            }
        },
        // Decrease item count, remove if count is 0
        decreaseItemCount: (state, action: PayloadAction<Product>) => {
            const { id, title, price, thumbnail } = action.payload;
            const existingProduct = state.cartItems.find((item: any) => item.id === id);
            if (existingProduct) {
                existingProduct.count -= 1;
            } else {
                state.cartItems.push({ id, title, price, thumbnail, count: 1 });
            }
        },
        // Remove item from the cart
        removeItemFromCart: (state, action: PayloadAction<string>) => {
            state.cartItems = state.cartItems.filter((item: any) => item.id !== action.payload);
        },
        // Load cart items from persisted state (localStorage or session)
        loadCartItems: (state, action: PayloadAction<any>) => {
            state.cartItems = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProductList.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getProductList.fulfilled, (state, action: any) => {
            state.loading = false;
            state.productList = action.payload.data.products;
        });
        builder.addCase(getProductList.rejected, (state) => {
            state.loading = false;
        });
    },
});

// Export the actions
export const { setCartItem, decreaseItemCount, removeItemFromCart, loadCartItems } = productSlice.actions;

// Export the reducer
export default productSlice.reducer;
