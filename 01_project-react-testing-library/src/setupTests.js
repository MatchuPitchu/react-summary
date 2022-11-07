// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// configure mock service worker
// https://mswjs.io/docs/getting-started/integrate/node
import { server } from './mocks/server';
// establish API mocking before all tests
beforeAll(() => server.listen());
// reset any request handlers that are maybe added during tests, that they don't affect other tests
afterAll(() => server.resetHandlers());
// clean up after tests are finished
afterAll(() => server.close());
