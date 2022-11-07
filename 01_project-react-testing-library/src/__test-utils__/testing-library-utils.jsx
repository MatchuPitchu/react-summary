import { render } from '@testing-library/react';
import { OrderContextProvider } from '../store/OrderContext';

// define a custom render method that could include global Context Provider, a Router, a Theme Provider
// https://testing-library.com/docs/react-testing-library/setup/
// ui: standard name to refer to JSX
// options: obj like the default render method has
const renderWithContext = (ui, options) =>
  render(ui, { wrapper: OrderContextProvider, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { renderWithContext as render };

// finally in test file I can import render an ALL other methods (screen, waitFor etc.)
// from testing-library-utils.jsx OR from @testing-library/react if I want to have default setup
