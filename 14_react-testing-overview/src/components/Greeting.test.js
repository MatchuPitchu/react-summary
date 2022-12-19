import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // package to simulate user events
import Greeting from './Greeting';

// use globally available fn describe() to create testing suite to group tests
// 2 args: a) description string, b) anonymous fn that contains all test fns in the fn body
// good practice: test suite description and test fn description form nice sentences to understand the aim of a test
describe('Greeting component', () => {
  test('renders Hello World as a text', () => {
    // Arrange
    render(<Greeting />);

    // Act
    // ...nothing

    // Assert
    // exact: false -> casing doesn't matter and match occurs also for substrings
    // example: without exact: false, 'Hello World' wouldn't match  'Hello World!'
    const element = screen.getByText('Hello World', { exact: false });
    // expect is globally available
    expect(element).toBeInTheDocument();
  });

  test('renders "good to see you" if button was NOT clicked', () => {
    // Arrange
    render(<Greeting />);
    // Assert
    const paragraph = screen.getByText('good to see you', { exact: false });
    expect(paragraph).toBeInTheDocument();
  });

  test('renders "changed" if button was clicked', () => {
    render(<Greeting />);
    // Act
    // button is a role that elements can have on screen, and I have only 1 btn in this component, so the right one is selected
    const btn = screen.getByRole('button');
    userEvent.click(btn);
    // Assert
    const outputElement = screen.getByText(/changed/i);
    expect(outputElement).toBeInTheDocument();
  });

  test('does not render "good to see you" if button was clicked', () => {
    render(<Greeting />);
    // Act
    const btn = screen.getByRole('button');
    userEvent.click(btn);
    // Assert
    const outputElement = screen.queryByText('good to see you', { exact: false }); // returns null if element is not found on screen
    expect(outputElement).toBeNull();
  });
});
