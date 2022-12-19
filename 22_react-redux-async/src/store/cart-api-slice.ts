// RTK Query: Create an API Slice
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Item {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface Cart {
  totalQuantity: number;
  items: Item[];
}

// Define a service using a base URL and expected endpoints
export const cartApi = createApi({
  reducerPath: 'cartApi',
  // built-in fetch wrapper
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app',
  }),
  tagTypes: ['Cart'], // define tag(s) which can trigger an action
  endpoints: (builder) => {
    return {
      // in angle brackets, define return type generics a) for API response and
      // b) for arguments that are passed into fn
      getCart: builder.query<Cart, string | void>({
        query: (WISHED_QUERY_PARAM_TO_ADD) => '/cart.json',
        providesTags: ['Cart'],
      }),
      // mutation method is for updating data
      updateCart: builder.mutation<Cart, Partial<Cart>>({
        query: (cart) => ({
          url: '/cart.json',
          method: 'PUT',
          body: JSON.stringify({ items: cart.items, totalQuantity: cart.totalQuantity }),
        }),
        invalidatesTags: ['Cart'], // this triggers re-fetching of getCart
      }),
    };
  },
});

// automatically generated query hook
export const { useGetCartQuery, useUpdateCartMutation } = cartApi;
