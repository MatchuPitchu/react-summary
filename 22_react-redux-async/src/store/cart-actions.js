import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

import { createAsyncThunk } from '@reduxjs/toolkit';

// VERSION 1: with Action Creator Thunk
// create own action creator (default action creators are like cartActions.addItemToCart({...}))
export const sendCartData = (cart) => {
  // Redux Toolkit gives automatically "dispatch" parameter, so that you can dispatch actions in returned fn
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data',
      })
    );

    const sendRequest = async () => {
      const options = {
        method: 'PUT', // overwriting existing data
        body: JSON.stringify({ items: cart.items, totalQuantity: cart.totalQuantity }),
      };
      // firebase test backend: 'cart.json' creates new cart node in database and store data there
      const res = await fetch(
        'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/cart.json',
        options
      );

      if (!res.ok) throw new Error('Sending data failed.');
    };

    // catch all kinds of errors that could occur in this sendRequest fn
    // and dispatch your wished succes or error action
    try {
      // sendRequest is async fn, that means it returns a Promise obj, so have to use await
      await sendRequest();

      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success',
          message: 'Sent cart data successfully',
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error',
          message: 'Sending data failed',
        })
      );
    }
  };
};

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const res = await fetch(
        'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/cart.json'
      );
      if (!res.ok) throw new Error('Error while fetching data');

      const data = await res.json();
      return data;
    };

    try {
      const { items, totalQuantity } = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: items || [], // Firebase does NOT store empty data, so items is undefined when app is opened with empty cart
          totalQuantity,
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error',
          message: 'Fetching data failed',
        })
      );
    }
  };
};

// VERSION 2: with createAsyncThunk
export const sendCartDataV2 = createAsyncThunk('cart/sendData', async (cart) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({ items: cart.items, totalQuantity: cart.totalQuantity }),
  };
  const res = await fetch(
    'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/cart.json',
    options
  );
  if (!res.ok) throw new Error('Sending data failed.');
});

export const fetchCartDataV2 = createAsyncThunk('cart/fetchData', async () => {
  const res = await fetch(
    'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/cart.json'
  );
  if (!res.ok) throw new Error('Error while fetching data');

  const data = await res.json();
  return {
    items: data.items || [], // Firebase does NOT store empty data, so items is undefined when app is opened with empty cart
    totalQuantity: data.totalQuantity,
  };
});
