import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  createUser,
  signOut,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
} from "./authAPI";
import { updateUser } from "../user/userAPI";

const initialState = {
  loggedInUserToken: null, // this should only contain user identity => 'id'/'role'
  status: "idle",
  error: null,
  userChecked: false,
  mailSent: false,
  passwordReset: false,
};

export const createUserAsync = createAsyncThunk(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await createUser(userData);
      // console.log(data);
      // The value we return becomes the `fulfilled` action payload
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  "user/loginUser",
  async (loginInfo, { rejectWithValue }) => {
    try {
      const data = await loginUser(loginInfo);
      console.log(data);
      // toast.success(data.message);
      return data;
    } catch (error) {
      // toast.error(error?.response?.data?.message || error?.message);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const checkAuthAsync = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const data = await checkAuth();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);
export const resetPasswordRequestAsync = createAsyncThunk(
  "user/resetPasswordRequest",
  async (email, { rejectWithValue }) => {
    try {
      const response = await resetPasswordRequest(email);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  "user/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await resetPassword(data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const signOutAsync = createAsyncThunk(
  "user/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const data = await signOut();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.loggedInUserToken = payload.user || payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUserAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.loggedInUserToken = payload.user || payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = null;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.loggedInUserToken = payload.user || payload;
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.status = "idle";
        state.userChecked = true;
      })
      .addCase(resetPasswordRequestAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordRequestAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.mailSent = true;
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.passwordReset = true;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
});

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;
export const selectError = (state) => state.auth.error;
export const selectUserChecked = (state) => state.auth.userChecked;
export const selectMailSent = (state) => state.auth.mailSent;
export const selectPasswordReset = (state) => state.auth.passwordReset;

// export const { } = authSlice.actions;

export default authSlice.reducer;
