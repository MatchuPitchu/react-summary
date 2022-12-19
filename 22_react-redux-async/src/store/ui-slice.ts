import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// VARIANT 2: with createAsyncThunk
import { fetchCartDataV2, sendCartDataV2 } from './cart-actions';

interface Notification {
  status: string;
  title: string;
  message: string;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isCartVisible: false, notification: {} },
  reducers: {
    toggle: (state) => {
      state.isCartVisible = !state.isCartVisible;
    },
    showNotification: (
      state,
      { payload: { status, title, message } }: PayloadAction<Notification>
    ) => {
      state.notification = {
        status,
        title,
        message,
      };
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;

// VARIANT 2: with createAsyncThunk
const uiSliceV2 = createSlice({
  name: 'ui',
  initialState: { isCartVisible: false, notification: {} },
  reducers: {
    toggle: (state) => {
      /* look at code V1 */
    },
    // remove showNotifcation action of original code V1
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartDataV2.rejected, (state, action) => {
        state.notification = {
          status: 'error',
          title: 'Error',
          message: action.error.message || 'Fetching data failed',
        };
      })
      .addCase(sendCartDataV2.pending, (state) => {
        state.notification = {
          status: 'pending',
          title: 'Sending...',
          message: 'Sending cart data',
        };
      })
      .addCase(sendCartDataV2.fulfilled, (state) => {
        state.notification = {
          status: 'success',
          title: 'Success',
          message: 'Sent cart data successfully',
        };
      })
      .addCase(sendCartDataV2.rejected, (state) => {
        state.notification = {
          status: 'error',
          title: 'Error',
          message: 'Sending data failed',
        };
      });
  },
});
