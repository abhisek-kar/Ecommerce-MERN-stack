import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProducts,
  fetchProductsByFilters,
  fetchBrands,
  fetchCategories,
  fetchProductById,
  createProduct,
  updateProduct,
} from "./productAPI";

const initialState = {
  products: [],
  brands: [],
  categories: [],
  status: "idle",
  totalItems: 0,
  selectedProduct: null,
};

export const fetchProductByIdAsync = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchProductById(id);
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const fetchProductsByFiltersAsync = createAsyncThunk(
  "product/fetchProductsByFilters",
  async ({ filter, sort, pagination, admin }, { rejectWithValue }) => {
    try {
      const data = await await fetchProductsByFilters(
        filter,
        sort,
        pagination,
        admin
      );
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const fetchBrandsAsync = createAsyncThunk(
  "product/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBrands();
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);
export const fetchCategoriesAsync = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCategories();
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const createProductAsync = createAsyncThunk(
  "product/create",
  async (product, { rejectWithValue }) => {
    try {
      const data = await createProduct(product);
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const updateProductAsync = createAsyncThunk(
  "product/update",
  async (update, { rejectWithValue }) => {
    try {
      const data = await updateProduct(update);
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.products = payload.products;
        state.totalItems = payload.totalProducts;
      })
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.brands = payload.brands;
      })
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.categories = payload.categories;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.selectedProduct = payload.product;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.products.push(payload.product);
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        const index = state.products.findIndex(
          (product) => product.id === payload?.product?.id
        );
        state.products[index] = payload.product;
        state.selectedProduct = payload.product;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;

export const selectAllProducts = (state) => state.product.products;
export const selectBrands = (state) => state.product.brands;
export const selectCategories = (state) => state.product.categories;
export const selectProductById = (state) => state.product.selectedProduct;
export const selectProductListStatus = (state) => state.product.status;

export const selectTotalItems = (state) => state.product.totalItems;

export default productSlice.reducer;
