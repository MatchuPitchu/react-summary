import useInput from '../hooks/useInput';

const isNotEmpty = (value) => !!value.trim();
const isEmail = (email) =>
  !!email.trim().match(
    // RFC 2822 standard email validation
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  );

const BasicForm = () => {
  const {
    value: firstName,
    valueValid: firstNameValid,
    hasError: firstNameInvalid,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFirstName,
  } = useInput(isNotEmpty);
  const {
    value: lastName,
    valueValid: lastNameValid,
    hasError: lastNameInvalid,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastName,
  } = useInput(isNotEmpty);
  const {
    value: email,
    valueValid: emailValid,
    hasError: emailInvalid,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(isEmail);

  let formValid = false;
  // if at least one is invalid then whole condition evaluates to false
  if (firstNameValid && lastNameValid && emailValid) formValid = true;

  const submitHandler = (e) => {
    e.preventDefault();

    if (!formValid) return;

    console.log(`Submitted data: ${firstName} ${lastName} ${email}`);
    resetFirstName();
    resetLastName();
    resetEmail();
  };

  const firstNameClasses = firstNameInvalid ? 'form-control invalid' : 'form-control';
  const lastNameClasses = lastNameInvalid ? 'form-control invalid' : 'form-control';
  const emailClasses = emailInvalid ? 'form-control invalid' : 'form-control';

  return (
    <form onSubmit={submitHandler}>
      <div className='control-group'>
        <div className={firstNameClasses}>
          <label htmlFor='name'>First Name</label>
          <input
            type='text'
            id='name'
            value={firstName}
            onChange={firstNameChangeHandler}
            onBlur={firstNameBlurHandler}
          />
          {firstNameInvalid && <p className='error-text'>Please enter first name</p>}
        </div>
        <div className={lastNameClasses}>
          <label htmlFor='name'>Last Name</label>
          <input
            type='text'
            id='name'
            value={lastName}
            onChange={lastNameChangeHandler}
            onBlur={lastNameBlurHandler}
          />
          {lastNameInvalid && <p className='error-text'>Please enter last name</p>}
        </div>
      </div>
      <div className={emailClasses}>
        <label htmlFor='name'>E-Mail Address</label>
        <input
          type='text'
          id='name'
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        {emailInvalid && <p className='error-text'>Please enter valid email</p>}
      </div>
      <div className='form-actions'>
        <button disabled={!formValid}>Submit</button>
      </div>
    </form>
  );
};

export default BasicForm;
