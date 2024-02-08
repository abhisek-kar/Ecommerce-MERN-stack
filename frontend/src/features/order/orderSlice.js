import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrder, fetchAllOrders, updateOrder } from "./orderAPI";

const initialState = {
  orders: [],
  status: "idle",
  currentOrder: null,
  totalOrders: 0,
};

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const data = await createOrder(order);
      console.log(data, "jhhhh");
      return data;
    } catch (error) {
      rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);
export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async (order, { rejectWithValue }) => {
    try {
      const data = await updateOrder(order);
      console.log(data);
      return data;
    } catch (error) {
      rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const fetchAllOrdersAsync = createAsyncThunk(
  "order/fetchAllOrders",
  async ({ sort, pagination }, { rejectWithValue }) => {
    try {
      const data = await fetchAllOrders(sort, pagination);
      console.log(data);
      return data;
    } catch (error) {
      rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrderAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.orders.push(payload?.newOrder);
        state.currentOrder = payload?.newOrder;
      })
      .addCase(createOrderAsync.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.orders = payload.orders;
        state.totalOrders = payload.totalOrders;
      })
      .addCase(fetchAllOrdersAsync.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        const index = state.orders.findIndex(
          (order) => order.id === payload.order.id
        );
        state.orders[index] = payload.order;
      })
      .addCase(updateOrderAsync.rejected, (state) => {
        state.status = "idle";
      });
  },
});

export const { resetOrder } = orderSlice.actions;

export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrders = (state) => state.order.orders;
export const selectTotalOrders = (state) => state.order.totalOrders;
export const selectStatus = (state) => state.order.status;

export default orderSlice.reducer;
