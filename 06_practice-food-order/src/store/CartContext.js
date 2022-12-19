import { createContext, useReducer } from 'react';

// initialize context with default data obj to have better autocompletion in VSC;
// later import this named export with { CartContext } in all components where you need context data
export const CartContext = createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

// useReducer state management
// initial state
const defaultCartState = {
  items: [],
  totalAmount: 0,
};

// reducer function
const cartReducer = (prevState, action) => {
  if (action.type === 'ADD') {
    const updatedTotal = prevState.totalAmount + action.item.price * action.item.amount;

    // logic to manipulate only amount number and NOT add some times the same item in arr of items
    // returns item index if new item already exists in arr
    const findItemIndex = prevState.items.findIndex((item) => item.id === action.item.id);
    const foundItem = prevState.items[findItemIndex];

    let updatedItems;

    if (foundItem) {
      const updatedItem = {
        ...foundItem,
        amount: foundItem.amount + action.item.amount, // update with amount of new added item
      };
      updatedItems = [...prevState.items]; // copy existing items arr
      updatedItems[findItemIndex] = updatedItem; // update foundItem in existing arr
    } else {
      // a) concat method doesn't mutate initial array, only returns new arr
      // updatedItems = prevState.items.concat(action.item);
      // b) use spread operator
      updatedItems = [...prevState.items, action.item];
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotal,
    };
  }

  if (action.type === 'REMOVE') {
    const findItemIndex = prevState.items.findIndex((item) => item.id === action.id);
    const foundItem = prevState.items[findItemIndex];
    // update total amount
    const updatedTotal = prevState.totalAmount - foundItem.price;

    let updatedItems;
    // if item amount is 1 then remove item entirely from items arr, else reduce amount by one
    if (foundItem.amount === 1) {
      // filter method: all items that don't match action.id will be kept, because then condition evaluates to true
      updatedItems = prevState.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...foundItem, amount: foundItem.amount - 1 };
      updatedItems = [...prevState.items];
      updatedItems[findItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotal,
    };
  }

  if (action.type === 'CLEAR') return defaultCartState;

  // default fallback
  return defaultCartState;
};

// create context provider component that wraps later all needed components of the app
const CartStateProvider = ({ children }) => {
  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

  const addItem = (item) => {
    dispatchCartAction({
      type: 'ADD',
      item,
    });
  };
  const removeItem = (id) => {
    dispatchCartAction({ type: 'REMOVE', id });
  };

  const clearCart = () => {
    dispatchCartAction({ type: 'CLEAR' });
  };

  // instead of having all values in JSX code below, put it outside of JSX in a variable
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>;
};

export default CartStateProvider;
