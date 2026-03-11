import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ===============================
   GLOBAL AXIOS CONFIG
================================*/
axios.defaults.withCredentials = true;

/* ===============================
   FETCH ALL PRODUCTS
================================*/
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/products");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error While Fetching the products"
      );
    }
  }
);

/* ===============================
   CREATE PRODUCT
================================*/
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await axios.post(
        "/api/v1/admin/product/create",
        productData,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Product Creation Failed"
      );
    }
  }
);

/* ===============================
   UPDATE PRODUCT
================================*/
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await axios.put(
        `/api/v1/admin/product/${id}`,
        formData,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Product Update Failed"
      );
    }
  }
);

/* ===============================
   DELETE PRODUCT
================================*/
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/admin/product/${productId}`);
      return { productId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Product Deletion Failed"
      );
    }
  }
);

/* ===============================
   FETCH USERS
================================*/
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/users");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch users"
      );
    }
  }
);

/* ===============================
   GET SINGLE USER
================================*/
export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch Single user"
      );
    }
  }
);

/* ===============================
   UPDATE USER ROLE
================================*/
export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/user/${userId}`, {
        role,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update user role"
      );
    }
  }
);

/* ===============================
   DELETE USER
================================*/
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to Delete User"
      );
    }
  }
);

/* ===============================
   FETCH ALL ORDERS
================================*/
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/orders");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to Fetch Orders"
      );
    }
  }
);

/* ===============================
   DELETE ORDER
================================*/
export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to Delete Order"
      );
    }
  }
);

/* ===============================
   UPDATE ORDER STATUS
================================*/
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.put(
        `/api/v1/admin/order/${orderId}`,
        { status },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to Update Order status"
      );
    }
  }
);

/* ===============================
   FETCH PRODUCT REVIEWS
================================*/
export const fetchProductReviews = createAsyncThunk(
  "admin/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/v1/admin/reviews?id=${productId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to Fetch Product Reviews"
      );
    }
  }
);

/* ===============================
   DELETE REVIEW
================================*/
export const deleteReview = createAsyncThunk(
  "admin/deleteReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/admin/reviews?productId=${productId}&id=${reviewId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to Delete Product Review"
      );
    }
  }
);

/* ===============================
   ADMIN SLICE
================================*/
const adminSlice = createSlice({
  name: "admin",

  initialState: {
    products: [],
    success: false,
    loading: false,
    error: null,
    product: {},
    deleting: {},
    users: [],
    user: {},
    message: null,
    orders: [],
    totalAmount: 0,
    order: {},
    reviews: [],
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH PRODUCTS */
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      /* CREATE PRODUCT */
      .addCase(createProduct.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.products.push(action.payload.product);
      })

      /* UPDATE PRODUCT */
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.product = action.payload.product;
      })

      /* DELETE PRODUCT */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        state.products = state.products.filter(
          (product) => product._id !== productId
        );
      })

      /* FETCH USERS */
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
      })

      /* GET SINGLE USER */
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })

      /* FETCH ORDERS */
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })

      /* FETCH REVIEWS */
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews;
      });
  },
});

export const { removeErrors, removeSuccess, clearMessage } =
  adminSlice.actions;

export default adminSlice.reducer;
