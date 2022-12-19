import { render, screen } from '../../../__test-utils__/testing-library-utils';
import { server } from '../../../mocks/server';
import { rest } from 'msw';
import OrderConfirmation from '../OrderConfirmation';

test.skip('error response from server for submitting order', async () => {
  // override default Mock Service Worker response for options endpoint with error response
  server.resetHandlers(
    rest.post('http://localhost:3030/order', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  render(<OrderConfirmation setOrderPhase={jest.fn()} />);
  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent(/error occurred/i);
});
