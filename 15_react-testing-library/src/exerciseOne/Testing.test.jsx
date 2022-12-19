import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Testing from './Testing';

import { replaceCamelWithSpaces } from './Testing';

describe('TestingPartOne component', () => {
  test('button has correct inital text and color', () => {
    render(<Testing />);
    const button = screen.getByRole('button', { name: /change to midnight blue/i });
    expect(button).toHaveClass('btn--red');
  });

  test('button changes text and color when clicked', () => {
    render(<Testing />);
    const button = screen.getByRole('button', { name: /change to midnight blue/i });
    userEvent.click(button);
    expect(button).toHaveTextContent(/change to medium violet red/i);
    expect(button).toHaveClass('btn--blue');
  });

  test('button is first enabled and can be unabled and re-enabled with checkbox', () => {
    render(<Testing />);
    // check that btn starts out enabled
    const button = screen.getByRole('button', { name: /change to midnight blue/i });
    expect(button).toBeEnabled();

    // check that checkbox starts out unchecked
    const checkbox = screen.getByRole('checkbox', { name: /disable button/i });
    expect(checkbox).not.toBeChecked();

    // user actions
    userEvent.click(checkbox);
    expect(button).toBeDisabled();
    userEvent.click(checkbox);
    expect(button).toBeEnabled();
  });

  test('button changes color to gray when disabled and reverts to red', () => {
    render(<Testing />);
    const button = screen.getByRole('button', { name: /change to midnight blue/i });
    const checkbox = screen.getByRole('checkbox', { name: /disable button/i });

    // disable button
    userEvent.click(checkbox);
    expect(button).toHaveClass('btn--gray');
    // re-enable button
    userEvent.click(checkbox);
    expect(button).toHaveClass('btn--red');
  });

  test('clicked disabled button is gray and reverts to blue', () => {
    render(<Testing />);
    const button = screen.getByRole('button', { name: /change to midnight blue/i });
    const checkbox = screen.getByRole('checkbox', { name: /disable button/i });

    // chahnge button to blue
    userEvent.click(button);

    // disbale button
    userEvent.click(checkbox);
    expect(button).toHaveClass('btn--gray');
    // re-enable button
    userEvent.click(checkbox);
    expect(button).toHaveClass('btn--blue');
  });
});

// unit testing functions
// -> invoke imported function with case scenarios
// when to unit test?
// - replaceCamelWithSpaces is simple fn -> could be covered by functional tests on button
// - for more complicated fns, unit tests can
//   - cover all possible edge cases and
//   - determine what caused functional tests to fail
describe('spaces before camel-case capital letters', () => {
  test('works for no inner capital letter', () => {
    expect(replaceCamelWithSpaces('Red')).toBe('Red');
  });
  test('works for one inner capital letter', () => {
    expect(replaceCamelWithSpaces('MidnightBlue')).toBe('Midnight Blue');
  });
  test('works for multiple inner capital letters', () => {
    expect(replaceCamelWithSpaces('MediumVioletRed')).toBe('Medium Violet Red');
  });
});
