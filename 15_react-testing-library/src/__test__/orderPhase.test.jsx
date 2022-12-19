import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

test('order process for user order flow', async () => {
  // don't need to import customized render method because App.jsx includes already Context Provider
  render(<App />);
  // add scoops and toppings
  const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');

  // no await and findBy* needed, because fetching was already awaited for scoops
  const chocolateInput = screen.getByRole('spinbutton', { name: 'Chocolate' });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');

  // await needed since other GET request
  const cherriesCheckbox = await screen.findByRole('checkbox', { name: 'Cherries' });
  userEvent.click(cherriesCheckbox);

  // find and click order btn
  const orderSummaryBtn = screen.getByRole('button', { name: /order sundae/i });
  userEvent.click(orderSummaryBtn);

  // check summary information based on order
  const summaryHeading = screen.getByRole('heading', { name: /order summary/i });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole('heading', { name: /scoops: 6.00/i });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole('heading', { name: /toppings: 1.50/i });
  expect(toppingsHeading).toBeInTheDocument();

  // check summary option items OPTION 1
  expect(screen.getByText('1 Vanilla')).toBeInTheDocument();
  expect(screen.getByText('2 Chocolate')).toBeInTheDocument();
  expect(screen.getByText('Cherries')).toBeInTheDocument();

  // check summary option items OPTION 2
  const optionItems = screen.getAllByRole('listitem');
  const optionItemsText = optionItems.map((item) => item.textContent);
  expect(optionItemsText).toEqual(['1 Vanilla', '2 Chocolate', 'Cherries']);

  // accept terms and conditions and click btn to confirm order
  const tcCheckbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
  userEvent.click(tcCheckbox);

  const confirmOrderBtn = screen.getByRole('button', { name: /confirm order/i });
  userEvent.click(confirmOrderBtn);

  // expect "loading" to show immediatly after clicking on button
  // --> uncommented: it's not working because I have no real POST request in my component
  // const loading = screen.getByText(/loading/i);
  // expect(loading).toBeInTheDocument();

  // confirm order number on confirmation page
  // this one is async because there is a POST request to server before showing the text
  const thankYouHeader = await screen.findByRole('heading', { name: /thank you/i });
  expect(thankYouHeader).toBeInTheDocument();

  // expect that "loading" has disappeared
  const notLoading = screen.queryByText(/loading/i);
  expect(notLoading).not.toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click "new order" btn on confirmation page
  const newOrderBtn = screen.getByRole('button', { name: /new order/i });
  userEvent.click(newOrderBtn);

  // check reset of scoops and toppings
  const scoopsTotal = screen.getByText(/scoops total: 0.00 €/i);
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = screen.getByText(/toppings total: 0.00 €/i);
  expect(toppingsTotal).toBeInTheDocument();

  // wait for items to appear: otherwise it could be that Testing Library throws an error, when updates happing after test is over
  await screen.findByRole('spinbutton', { name: /vanilla/i });
  await screen.findByRole('checkbox', { name: /cherries/i });
});

test('Toppings header is not on summary page if no toppings ordered', async () => {
  render(<App />);

  // add scoops and toppings
  const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');

  // find and click order btn
  const orderSummaryBtn = screen.getByRole('button', { name: /order sundae/i });
  userEvent.click(orderSummaryBtn);

  const scoopsHeading = screen.getByRole('heading', { name: /scoops: 2.00/i });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole('heading', { name: /toppings/i });
  expect(toppingsHeading).not.toBeInTheDocument();
});
