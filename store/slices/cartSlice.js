import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../app/services/cartService';

// Helper to ensure cart data is serializable
const toSerializable = (cart) => {
  if (!cart) return null;
  const serializableCart = { ...cart };
  if (cart.createdAt && cart.createdAt.toDate) {
    serializableCart.createdAt = cart.createdAt.toDate().toISOString();
  }
  if (cart.updatedAt && cart.updatedAt.toDate) {
    serializableCart.updatedAt = cart.updatedAt.toDate().toISOString();
  }
  serializableCart.items = cart.items.map(item => {
    const serializableItem = { ...item };
    if (item.createdAt && item.createdAt.toDate) {
      serializableItem.createdAt = item.createdAt.toDate().toISOString();
    }
    if (item.updatedAt && item.updatedAt.toDate) {
      serializableItem.updatedAt = item.updatedAt.toDate().toISOString();
    }
    return serializableItem;
  });
  return serializableCart;
};

const initialState = {
  items: [],
  itemCount: 0,
  total: 0,
  loading: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async Thunks
export const loadCart = createAsyncThunk('cart/loadCart', async (userId, { rejectWithValue }) => {
  try {
    const cart = await cartService.getCart(userId);
    return toSerializable(cart);
  } catch (error) {
    return rejectWithValue(error.toString());
  }
});

export const addItemToCart = createAsyncThunk('cart/addItemToCart', async ({ userId, product }, { rejectWithValue }) => {
  try {
    const updatedCart = await cartService.addItemToCart(userId, product);
    return toSerializable(updatedCart);
  } catch (error) {
    return rejectWithValue(error.toString());
  }
});

export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async ({ userId, productId }, { rejectWithValue }) => {
  try {
    const updatedCart = await cartService.removeItemFromCart(userId, productId);
    return toSerializable(updatedCart);
  } catch (error) {
    return rejectWithValue(error.toString());
  }
});

export const updateItemQuantity = createAsyncThunk('cart/updateItemQuantity', async ({ userId, productId, quantity }, { rejectWithValue }) => {
  try {
    const updatedCart = await cartService.updateItemQuantity(userId, productId, quantity);
    return toSerializable(updatedCart);
  } catch (error) {
    return rejectWithValue(error.toString());
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (userId, { rejectWithValue }) => {
  try {
    const updatedCart = await cartService.clearCart(userId);
    return toSerializable(updatedCart);
  } catch (error) {
    return rejectWithValue(error.toString());
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Reducer for guest cart (localStorage)
    addItemToGuestCart(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.precio ?? 0) * item.quantity, 0);
    },
    removeItemFromGuestCart(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.precio ?? 0) * item.quantity, 0);
    },
    updateGuestCartQuantity(state, action) {
        const { id, quantity } = action.payload;
        const item = state.items.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
        }
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.total = state.items.reduce((sum, item) => sum + (item.precio ?? 0) * item.quantity, 0);
    },
    clearGuestCart(state) {
        state.items = [];
        state.itemCount = 0;
        state.total = 0;
    },
    loadGuestCart(state, action) {
        state.items = action.payload.items;
        state.itemCount = action.payload.itemCount;
        state.total = action.payload.total;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = 'loading';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (action.payload) {
            state.loading = 'succeeded';
            state.items = action.payload.items;
            state.itemCount = action.payload.itemCount;
            state.total = action.payload.total;
            state.error = null;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { 
    addItemToGuestCart, 
    removeItemFromGuestCart, 
    updateGuestCartQuantity, 
    clearGuestCart,
    loadGuestCart
} = cartSlice.actions;

export default cartSlice.reducer; 