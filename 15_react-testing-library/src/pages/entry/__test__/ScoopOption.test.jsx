import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScoopOption from '../ScoopOption';

test('indicate if scoop count is non-int or out of range', async () => {
  // don't need updateItemCount fn for this test, so I use Jest Mock Fn
  render(<ScoopOption name='' imagePath='' updateItemCount={jest.fn()} />);

  // expect input to be invalid with negative number
  const input = screen.getByRole('spinbutton');
  userEvent.clear(input);
  userEvent.type(input, '-1');
  expect(input).toHaveClass('is-invalid');

  // replace with decimal input
  userEvent.clear(input);
  userEvent.type(input, '1.2');
  expect(input).toHaveClass('is-invalid');

  // replace with input that's too high
  userEvent.clear(input);
  userEvent.type(input, '11');
  expect(input).toHaveClass('is-invalid');

  // replace with valid input
  userEvent.clear(input);
  userEvent.type(input, '2');
  expect(input).not.toHaveClass('is-invalid');
});
