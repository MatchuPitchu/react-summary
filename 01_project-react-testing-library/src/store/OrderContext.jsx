import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { pricePerItem } from '../constants/index';
import { formatCurrency } from '../utilities/index';

const OrderContext = createContext();

// custom hook to check whether you are inside a provider AND it returns context data object
// advantage: avoid importing the Context in every other component file where you're using it
export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrderContext must be used within an OrderContextProvider');
  return context;
};

// helper fn to calculate subtotals
const calculateSubtotal = (optionType, optionCounts) => {
  let optionCount = 0; // running count
  // map.values() returns an iterable for values
  for (const count of optionCounts[optionType].values()) {
    optionCount += count;
  }

  return optionCount * pricePerItem[optionType];
};

export const OrderContextProvider = ({ children }) => {
  const [optionCounts, setOptionCounts] = useState({
    // Map is like obj with key value pairs, but easier to iterate over just the values
    scoops: new Map(),
    toppings: new Map(),
  });

  const [totals, setTotals] = useState({
    scoops: formatCurrency(0),
    toppings: formatCurrency(0),
    grandTotal: formatCurrency(0),
  });

  // update totals whenever optionCounts changes
  useEffect(() => {
    const scoopsSubtotal = calculateSubtotal('scoops', optionCounts);
    const toppingsSubtotal = calculateSubtotal('toppings', optionCounts);
    const grandTotal = scoopsSubtotal + toppingsSubtotal;

    setTotals({
      scoops: formatCurrency(scoopsSubtotal),
      toppings: formatCurrency(toppingsSubtotal),
      grandTotal: formatCurrency(grandTotal),
    });
  }, [optionCounts]);

  const updateItemCount = useCallback((itemName, newItemCount, optionType) => {
    setOptionCounts((prev) => {
      // get option Map and make a shallow copy
      // computed property keys are an object literal feature that also works for destructuring;
      // specify key of obj via an expression, if you put it in square brackets:
      const { [optionType]: optionMap } = prev;
      const newOptionMap = new Map(optionMap);

      // update option count for this item with new value
      // Map methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
      newOptionMap.set(itemName, +newItemCount);

      // return new obj with old optionCounts plus new map
      return { ...prev, [optionType]: newOptionMap };
    });
  }, []);

  const resetOrder = useCallback(() => {
    setOptionCounts({
      scoops: new Map(),
      toppings: new Map(),
    });
  }, []);

  // avoid recalculating value with useMemo hook
  const value = useMemo(() => {
    // getter: option counts for scoops and toppings AND totals (subtotals and total)
    // setter: updateOptionCount, resetOrder
    return { optionCounts, totals, updateItemCount, resetOrder };
  }, [optionCounts, totals, updateItemCount, resetOrder]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
