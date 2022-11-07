import { render, screen, waitFor } from '../../../__test-utils__/testing-library-utils';
import userEvent from '@testing-library/user-event';
import OrderEntry from '../OrderEntry';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

describe('OrderEntry component', () => {
  // skip this test because I had to comment out fetching in the component
  test.skip('handles error for scoops and toppings routes', async () => {
    // Error Server Response:
    // - use imported server to overwrite its handlers
    // - create new handlers that returns an error (-> status code 500)
    server.resetHandlers(
      rest.get('http://localhost:3030/scoops', (req, res, ctx) => res(ctx.status(500))),
      rest.get('http://localhost:3030/toppings', (req, res, ctx) => res(ctx.status(500)))
    );

    // use Jest mock function that does nothing and is not needed for assertion in test,
    // but prop is needed for this component
    render(<OrderEntry setOrderPhase={jest.fn()} />);

    // waitFor: if you need to wait until all of your mock server promises are resolved;
    // without waitFor alerts array would only have length 1
    await waitFor(async () => {
      const alerts = await screen.findAllByRole('alert');
      expect(alerts).toHaveLength(2);
    });
  });

  test('disable order button if there are no scoops ordered', async () => {
    render(<OrderEntry setOrderPhase={jest.fn()} />);

    // order btn is disabled first
    let orderBtn = screen.getByRole('button', { name: /order sundae/i });
    expect(orderBtn).toBeDisabled();

    // expect btn to be enabled after adding scoop
    const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '1');
    expect(orderBtn).toBeEnabled();

    // expect btn to be disabled again after removing scoop
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '0');
    expect(orderBtn).toBeDisabled();
  });
});
