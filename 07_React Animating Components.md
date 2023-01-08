# Animating React Apps & Components

## CSS Animations & why they are sometimes not enough

- normal CSS animated elements stays on the DOM, you can only hide them, move them outside viewport or change opacity
- solution could be `conditional rendering` for animations:

  - advantage: add/remove elements from DOM, not only hide them with css properties
  - problem: removing from DOM happens immediately -> user can't see close animation anymore

    ```javascript
    {
      modalIsOpen && <Modal show={modalIsOpen} closed={closeModal} />;
    }
    {
      modalIsOpen && <Backdrop show={modalIsOpen} closed={closeModal} />;
    }
    ```

  - solution: use third pary library `React Transition Group`

## Animating React Components with third party libraries

- [React Transition Group](https://reactcommunity.org/react-transition-group/):

  - exposes simple components useful for defining entering and exiting transitions with your own css classes -> in other words, it gives JS layer to orchestrate css animations
  - How to use?

    - Wrap `<Transition></Transition>` around elements to control the animation of elements inside;
    - Transition component tracks `enter` (-> from `entering` to `entered`) and `exit` (-> from `exiting` to `exited`) states for components;
    - `in`: determines if element(s) is visible
    - `timeout`: duration of how long transition state (from `entering` to `entered` or from `exiting` to `exited`) is held to execute e.g. animation between `entering` and `entered`
      - if timeout is shorter than animation time defined in css, then NOT entire animation is played;
    - `mountOnEnter` and `unmountOnExit` adds or removes element(s) from DOM based on the switch of `in` prop;
    - `transition events`: cb functions that occur when certain events happen -> use it to time animations based on these events
    - between Transition tags is returned an anonymous fn with parameter of transition state; now, component can be manipulated based on state

    ```javascript
    // Example 1
    // import default Component of React Transition Group Package
    import Transition from 'react-transition-group/Transition';

    const App = () => {
      const [showBlock, setShowBlock] = useState(false);
      const toggleBlock = () => setShowBlock((prev) => !prev);

      return (
        <>
          <button onClick={toggleBlock}>Toggle</button>
          <Transition
            in={showBlock}
            timeout={500}
            mountOnEnter
            unmountOnExit
            onEnter={() => console.log('onEnter')} // right before starting onEntering mode, remains only for 1 frame
            onEntering={() => console.log('onEntering')}
            onEntered={() => console.log('onEntered')}
            onExit={() => console.log('onExit')} // right before starting onExiting mode, remains only for 1 frame
            onExiting={() => console.log('onExiting')}
            onExited={() => console.log('onExited')}
          >
            {(state) => (
              <div
                style={{
                  backgroundColor: 'red',
                  width: 100,
                  height: 100,
                  margin: '1rem auto',
                  transition: 'opacity 1s ease-out',
                  // instead of 'exited' (which is state after finish exit),
                  // use 'exiting' to display opacity change before element is removed from DOM
                  opacity: state === 'exiting' ? 0 : 1,
                }}
              >
                {state}
              </div>
            )}
          </Transition>
        </>
      );
    };
    ```

    - define `different timeouts` for `enter` (-> adding element) and `exit` (-> removing) transition -> it's adding and removing from DOM if `mountOnEnter` and `unmountOnExit` is defined, otherwise only switch of states depending on css styles

    ```javascript
    // Example 2
    const animationTiming = {
      enter: 400,
      exit: 1000,
    };

    const Modal = ({ show, closed }) => (
      <Transition mountOnEnter unmountOnExit in={show} timeout={animationTiming}>
        {(state) => {
          // use passed transition states to define when specific classes
          // with animations start execution of animations
          const classes = `Modal ${state === 'entering' ? 'ModalOpen' : state === 'exiting' ? 'ModalClosed' : null}`;

          return (
            <div className={classes}>
              <button onClick={closed}>Dismiss</button>
            </div>
          );
        }}
      </Transition>
    );
    ```

    - `CSSTransition` component: handles automatically css changes based on transition states;
      - does NOT use anonymous fn between tags, just enter JSX code
      - add `classNames` prop to define which classes ard added to wrapped element (-> here `div`) depending on transition state
      - `OPTION A`
        - define `"trunk" css class` of your choice as a string (e.g. `fade-slide`) and fill the following classes with your wished styles/animations in a css file:
        - `trunk`-enter (before entering mode, remains only 1 for frame);
        - `trunk`-enter-active (entering mode);
        - `trunk`-exit (before exit mode);
        - `trunk`-exit-active (exiting mode, remains only 1 for frame);
      - `OPTION B`
        - define own titled css classes in an obj instead of using `trunk` way

    ```javascript
    // Example 3
    import CSSTransition from 'react-transition-group/CSSTransition';

    const animationTiming = {
      enter: 400,
      exit: 1000,
    };

    const Modal = ({ show, closed }) => (
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
          <button onClick={closed}>Dismiss</button>
        </div>
      </CSSTransition>
    );
    ```

    - `TransitionGroup` component to animate lists (-> groups of dynamic elements)
      1. is able to handle multiple items
      1. determines when one element in list changes
      1. sets automatically `in` prop on e.g. CSSTransition
    - by default it renders `div`, but you can define element with `component` prop (-> like `ul`)
    - has to wrap `Transition` or `CSSTransition` component;

    ```javascript
    // Example 4
    import TransitionGroup from 'react-transition-group/TransitionGroup';
    // ...

    const List = () => {
      const [items, setItems] = useState([1, 2, 3]);

      const addItemHandler = () => setItems((prev) => [...prev, prev.length + 1]);

      const removeItemHandler = (selectedIndex) => {
        setItems((prev) => prev.filter((_, index) => index !== selectedIndex));
      };

      const listItems = items.map((item, i) => (
        <CSSTransition key={i} classNames='fade' timeout={300}>
          <li className='ListItem' onClick={() => removeItemHandler(i)}>
            {item}
          </li>
        </CSSTransition>
      ));

      return (
        <div>
          <button onClick={addItemHandler}>Add Item</button>
          <TransitionGroup component='ul' className='List'>
            {listItems}
          </TransitionGroup>
        </div>
      );
    };
    ```

    ```css
    /* CSS example for Example 4 */
    .fade-enter {
      opacity: 0;
    }

    .fade-enter-active {
      opacity: 1;
      transition: opacity 0.3s ease-out;
    }

    .fade-exit {
      opacity: 1;
    }

    .fade-exit-active {
      opacity: 0;
      transition: opacity 0.3s ease-out;
    }
    ```

- [React Framer Motion](https://www.framer.com/motion/)
- [React Motion - Animation Library](https://github.com/chenglou/react-motion): tries to emulate real world physics when executing animations
  - e.g. perhaps look if newer library available
- [React Move](https://react-move.js.org): nice complex animations like charts
- [React Router Transition](https://github.com/maisano/react-router-transition): set animations when routes are changing
