import useInput from '../hooks/useInput';

const SimpleInput = () => {
  // 4) use custom hook useInput to bunch logic together and use it for both inputs here
  // destructuring and define aliases to variables
  const {
    value: name,
    valueValid: nameValid,
    hasError: nameInvalid,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName,
  } = useInput((name) => !!name.trim()); // pass anonymous arrow fn as param into custom hook -> there const value of hook is passed inside

  const {
    value: email,
    valueValid: emailValid,
    hasError: emailInvalid,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(
    (email) =>
      !!email.trim().match(
        // RFC 2822 standard email validation
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
  );

  // const nameRef = useRef();
  // const [name, setName] = useState('');
  // const [nameTouched, setNameTouched] = useState(false); // controls if user touched already input field
  // const [email, setEmail] = useState('');
  // const [emailTouched, setEmailTouched] = useState(false);

  // 3) Change nameValid state to const since component is re-evaluated whenever new value is entered;
  // validation logic in 2 steps is then always re-done
  // const [nameValid, setNameValid] = useState(false);
  // const nameValid = !!name.trim(); // !! converts variable to boolean
  // const nameInvalid = !nameValid && nameTouched; // nameInvalid + emailInvalid only relevant for visual feedback

  // const emailValid = !!email.trim().match(
  //   // RFC 2822 standard email validation
  //   /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  // );
  // const emailInvalid = !emailValid && emailTouched;

  // 4) setting overall form validity state; use variable to enable or disable submit btn
  // if multiple inputs (-> e.g. ageValid, emailValid ... here only nameValid in my case)
  // then form only valid if all inputs valid
  let formValid = false;
  if (nameValid && emailValid) formValid = true;

  // const nameChangeHandler = ({ target }) => {
  //   // 1) if you need data after every keystroke AND
  //   // wanna reset value after submission then use useState
  //   setName(target.value);

  //   // 3a) REMOVED because setName leads to re-evaluation of component and so const nameValid above is recreated;
  //   // input validation: reset possible err msg;
  //   // use event.target.value for if check, because name state update above
  //   // is only scheduled for next re-evaluation of component;
  //   // if (target.value.trim()) setNameValid(true);
  // };
  // const emailChangeHandler = ({ target }) => setEmail(target.value);

  // input validation if field loses focus
  // const nameBlurHandler = (e) => setNameTouched(true);
  // const emailBlurHandler = (e) => setEmailTouched(true);

  const submitHandler = (e) => {
    // avoid default behaviour that HTTP request is send to server which is serving the website;
    // would reload page and restart React App
    e.preventDefault();

    // form validation
    if (!formValid) return;

    console.log(`Name & Email (useState): ${name} ${email}`);

    // reset input fields + field touched states
    resetName();
    resetEmail();
    // setName('');
    // setNameTouched(false);
    // setEmail('');
    // setEmailTouched(false);

    // 2) if you need data only once when form is submitted then use useRef;
    // DON'T reset value with useRef because don't manipulate real DOM
    // const enteredName = nameRef.current.value;
    // console.log('Name (useRef): ' + enteredName);
  };

  const nameInputClasses = `form-control ${nameInvalid ? 'invalid' : ''}`;
  const emailInputClasses = `form-control ${emailInvalid ? 'invalid' : ''}`;

  return (
    <form onSubmit={submitHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input
          // ref={nameRef}
          type='text'
          id='name'
          value={name}
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
        />
        {nameInvalid && <p className='error-text'>Name field is empty</p>}
      </div>
      <div className={emailInputClasses}>
        <label htmlFor='email'>Your E-Mail</label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        {emailInvalid && <p className='error-text'>E-Mail is invalid</p>}
      </div>
      <div className='form-actions'>
        <button disabled={!formValid}>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
