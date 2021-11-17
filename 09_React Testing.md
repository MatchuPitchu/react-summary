# Testing

- `Manual Testing`: Developer writes code and previews and tests code manually in browser
  - important to see what users will see
  - when implementing new features, other things may break
  - error-prone: hard to test all possible combinations and scenarios
- `Automated Testing`:
  - code that tests your code
  - test the individual building blocks of your app
  - allows you to test ALL building blocks at once
- Different kinds of automated tests:
  - `Unit Tests`:
    - test the individual building blocks (-> functions, components) in isolation
    - projects typically contain lots of unit tests
    - most common and important kind of test
  - `Integration Tests`:
    - test the combination of multiple building blocks (-> how components work together)
    - projects typically contain a couple of integration tests
    - React specific: in general not so easy to differentiate between integration and unit tests
    - important, but good to focus on unit tests in most cases
  - `End-to-End (e2e) Tests`:
    - test complete scenarios in your app as the user would experience them
    - projects typically contain only a few e2e tests
    - important but can also be done manually (partially)
- What and how to test?
  - test the different building blocks
  - unit tests = the smallest building blocks that make up your app
  - test success and error cases, also test rare (but possible) results

## Required Tools & Setup

1. tool for running your tests and asserting the results: `Jest`
1. tool for "simulating" (-> rendering) the React app/components: `React Testing Library`

> Both tools are already set up when using create-react-app

## Understand Unit Tests

## Testing React Components & Building Blocks
