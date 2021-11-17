# Working with Forms & User Input in React

## Forms & Inputs are complexe since they can assume different states

1. One or more inputs are invalid
   - Output input-specific error messages & highlight problematic inputs
   - ensure form can't be submitted or saved
2. All inputs are valid
   - allow form to be submitted or saved

## Different ways to validate form input

1. when form is submitted
   - let user the time to enter valid value before warning him
   - avoid unnessecary warnings but maybe present feedback "too late"
2. when an input is losing focus
   - allows user to enter a valid value before warning him
   - useful for untouched forms with no input yet
3. on every keystroke
   - provide direct feedback to user
   - but warns user before user had chance of entering valid values
   - if applied only on invalid inputs, has the potential of providing more direct feedback

- good practice: check if input field was touched AND if input loses focus then check if it's valid
