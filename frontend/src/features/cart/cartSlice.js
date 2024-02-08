import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  deleteItemFromCart,
  fetchItemsByUserId,
  resetCart,
  updateCart,
} from "./cartAPI";
import toast from "react-hot-toast";

const initialState = {
  status: "idle",
  items: [], //to store cart items
  cartLoaded: false,
};

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ item }, { rejectWithValue }) => {
    try {
      const data = await addToCart(item);
      toast.success("Item Added to Cart");
      console.log(data);
      return data;
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const fetchItemsByUserIdAsync = createAsyncThunk(
  "cart/fetchItemsByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchItemsByUserId();
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const updateCartAsync = createAsyncThunk(
  "cart/updateCart",
  async (update, { rejectWithValue }) => {
    try {
      const data = await updateCart(update);
      toast.success("cart updated succesfully");
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const deleteItemFromCartAsync = createAsyncThunk(
  "cart/deleteItemFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const data = await deleteItemFromCart(itemId);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const resetCartAsync = createAsyncThunk(
  "cart/resetCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await resetCart();
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.status = "loading";
      })

      .addCase(addToCartAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.items.push(payload.item);
      })
      .addCase(addToCartAsync.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(fetchItemsByUserIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItemsByUserIdAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.items = payload.cartItems;
        state.cartLoaded = true;
      })
      .addCase(fetchItemsByUserIdAsync.rejected, (state, { payload }) => {
        state.status = "idle";
        state.cartLoaded = true;
      })
      .addCase(updateCartAsync.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateCartAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        const index = state.items.findIndex(
          (item) => item.id === payload?.cartItem?.id
        );
        state.items[index] = payload.cartItem;
      })
      .addCase(updateCartAsync.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(deleteItemFromCartAsync.pending, (state) => {
        state.status = "loading";
      })

      .addCase(deleteItemFromCartAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items.splice(index, 1);
      })
      .addCase(deleteItemFromCartAsync.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(resetCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetCartAsync.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(resetCartAsync.fulfilled, (state) => {
        state.status = "idle";
        state.items = [];
      });
  },
});

// export const { increment } = cartSlice.actions;

export const selectItems = (state) => state.cart.items;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartLoaded = (state) => state.cart.cartLoaded;

export default cartSlice.reducer;
