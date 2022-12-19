// file that contains testing code for App.js
import { render, screen } from '@testing-library/react';
import App from './App';

// the 3 "A"s of writing tests:
// - Arrange: set up test test data, test conditions and test environment
// - Act: run logic that should be tested (e.g. execute fn)
// - Assert the results: have a look inside the browser and compare execution results with expected results

// test fn is globally available, receives 2 args:
// 1) description of test to identifie test in output
// 2) anonymous fn containing testing code
test('renders learn react link', () => {
  // Arrange
  // renders the entire component tree
  render(<App />);

  // Act
  // ...nothing

  // Assert
  // screen: simulated browser; identifie element by a text (-> Regex case insensitive with learn react);
  // types of methods:
  // - get fns throw error if element is not found,
  // - query fns return null if element is not found (don't throw error),
  // - find fns return a promise (-> for asyncronous tasks if element is eventually on the screen)
  const linkElement = screen.getByText(/learn react/i);
  // test succeeds if element is found and else fails
  expect(linkElement).toBeInTheDocument();
});

// notice: when starting script 'npm test', tests are executed and file changes are watches, so tests are always re-executed immediately
