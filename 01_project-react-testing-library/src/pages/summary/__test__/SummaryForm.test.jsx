import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryForm from '../SummaryForm';

describe('SummaryForm component', () => {
  test('should render initially unchecked checkbox and disabled button', () => {
    render(<SummaryForm setOrderPhase={jest.fn()} />);
    const checkbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
    expect(checkbox).not.toBeChecked();

    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    expect(confirmBtn).toBeDisabled();
  });

  test('checkbox enables button on first click and disables it on second click', () => {
    render(<SummaryForm setOrderPhase={jest.fn()} />);
    const checkbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
    const confirmBtn = screen.getByRole('button', { name: /confirm/i });

    userEvent.click(checkbox);
    expect(confirmBtn).toBeEnabled();
    userEvent.click(checkbox);
    expect(confirmBtn).toBeDisabled();
  });

  test('popover appears on hovering', async () => {
    render(<SummaryForm setOrderPhase={jest.fn()} />);
    // popover is hidden
    const nullPopover = screen.queryByText(/no ice cream/i);
    expect(nullPopover).not.toBeInTheDocument();

    // popover appears
    const termsAndCondition = screen.getByText(/terms and conditions/i);
    userEvent.hover(termsAndCondition);
    const popover = screen.getByText(/no ice cream/i);
    // even though getByText throws error if element is not found and expect statement
    // would not be reached, it's more readable and good practice to write direct assertion
    expect(popover).toBeInTheDocument();

    // popover disappears
    userEvent.unhover(termsAndCondition);
    // popover disappears asynchronously: use waitForElementToBeRemoved fn
    // which is at the same time the assertion
    await waitForElementToBeRemoved(() => screen.queryByText(/no ice cream/i));
  });
});
