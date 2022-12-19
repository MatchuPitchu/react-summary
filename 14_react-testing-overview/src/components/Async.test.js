import { render, screen } from '@testing-library/react';
import Async from './Async';

describe('Async component', () => {
  // async test
  // problem: during development, DON'T send real HTTP requests to server:
  // a) cause a lot of traffic when you have a lot of tests;
  // b) POST/PUT requests would insert or change data in database
  // solution: replace browser built-in fn with mock fn (-> dummy fn that overwrites built-in fn)
  // only test code that's written by you (-> fetch, localStorage etc. are built into browser, you rely on them);
  // you want to test code and output of my component
  test('renders posts if request succeeds', async () => {
    // Arrange
    // replace fetch fn with mock of globally available jest library
    window.fetch = jest.fn();
    // this sets value when fetch mock is resolved;
    // simulates a resolved res obj having an async json method (-> async since json() returns a new promise normally)
    // returns simply an array with one example of key value pairs needed in the component
    window.fetch.mockResolvedValueOnce({
      json: async () => [{ id: 'p1', title: 'First post' }],
    });
    render(<Async />);
    // Assert
    // overview of all possible roles of HTML elements: https://www.w3.org/TR/html-aria/#docconformance
    // use getAllByRole since getByRole fails if there are more than one item
    // get method looks instantly (-> synchronous execution) -> so test would fail with async data fetching;
    // use find method: returns promise; third arg is obj with timeout ms (-> default 1000)
    const listItemsArray = await screen.findAllByRole('listitem', {}, { timeout: 1500 });
    expect(listItemsArray).not.toHaveLength(0);
  });
});
