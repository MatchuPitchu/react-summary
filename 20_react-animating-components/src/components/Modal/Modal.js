import CSSTransition from 'react-transition-group/CSSTransition';
import './Modal.css';

// define different timeouts for 'enter' (-> adding element)
// and 'exit' (-> removing) transition -> it's adding and removing from DOM
// if mountOnEnter and unmountOnExit is defined, otherwise only switch
// of states depending on css styles
const animationTiming = {
  enter: 400,
  exit: 1000,
};

const Modal = ({ show, closed }) => {
  return (
    // 1) Transition component:
    // <Transition mountOnEnter unmountOnExit in={show} timeout={animationTiming}>
    //   {(state) => {
    //     // use passed transition states to define when specific classes
    //     // with animations start execution of animations
    //     const classes = `Modal ${
    //       state === 'entering' ? 'ModalOpen' : state === 'exiting' ? 'ModalClosed' : null
    //     }`;

    //     return (
    //       <div className={classes}>
    //         <h1>A Modal</h1>
    //         <button className='Button' onClick={closed}>
    //           Dismiss
    //         </button>
    //       </div>
    //     );
    //   }}
    // </Transition>
    //
    // 2) CSSTransition component: handles automatically css changes based on transition states;
    // does NOT use anonymous fn between tags, just enter JSX code;
    // add classNames prop to define which classes are added to wrapped element
    // (-> here div) depending on transition state;
    // option a) define trunk css class of your choice as a string (e.g. 'fade-slide')
    // and fill following classes with your wished styles/animations in a css file;
    // 'trunk'-enter (before entering mode, remains only 1 for frame);
    // 'trunk'-enter-active (entering mode);
    // 'trunk'-exit (before exit mode);
    // 'trunk'-exit-active (exiting mode, remains only 1 for frame);
    // option b) define own titled css classes in an obj instead of using 'trunk' way
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={show}
      timeout={animationTiming}
      // classNames='fade-slide'
      classNames={{
        enter: '',
        enterActive: 'ModalOpen',
        exit: '',
        exitActive: 'ModalClosed',
        // appear: // used for first time an element is mounted to the DOM (-> e.g. when App is loaded first time)
        // appearActive:
      }}
    >
      <div className='Modal'>
        <h1>A Modal</h1>
        <button className='Button' onClick={closed}>
          Dismiss
        </button>
      </div>
    </CSSTransition>
  );
};

export default Modal;
