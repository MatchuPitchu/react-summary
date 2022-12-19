import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// VARIANT 2: with createAsyncThunk
import { fetchCartDataV2 } from './cart-actions';

interface Item {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface ReplaceCartAction {
  totalQuantity: number;
  items: Item[];
}

interface AddItemAction {
  id: string;
  title: string;
  price: number;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [{ id: '', title: '', price: 0, quantity: 0 }],
    totalQuantity: 0,
    // helper variable to avoid that - when opening app - fetched cart data is immediately sended back to server
    changedLocally: false,
  },
  reducers: {
    replaceCart: (
      state,
      { payload: { totalQuantity, items } }: PayloadAction<ReplaceCartAction>
    ) => {
      state.items = items;
      state.totalQuantity = totalQuantity;
    },
    addItemToCart: (state, { payload: { id, title, price } }: PayloadAction<AddItemAction>) => {
      state.totalQuantity++;
      state.changedLocally = true;

      const existingItem = state.items.find((item) => item.id === id);
      // NEVER DO following manipulating of existing state without Redux Toolkit
      if (!existingItem) {
        state.items.push({
          id,
          title,
          price,
          quantity: 1,
        });
      } else {
        existingItem.quantity++;
      }
    },
    removeItemFromCart: (state, { payload: id }: PayloadAction<string>) => {
      state.totalQuantity--;
      state.changedLocally = true;

      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
      }
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;

// VARIANT 2: with createAsyncThunk
const cartSliceV2 = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    changedLocally: false,
  },
  reducers: {
    // remove replaceCart action of code V1
    addItemToCart: (state, action) => {
      /* look at code V1 */
    },
    removeItemFromCart: (state, action) => {
      /* look at code V1 */
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartDataV2.fulfilled, (state, { payload: { totalQuantity, items } }) => {
      state.items = items;
      state.totalQuantity = totalQuantity;
    });
  },
});
