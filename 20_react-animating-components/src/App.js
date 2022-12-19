import { useState } from 'react';
import './App.css';
import Modal from './components/Modal/Modal';
import Backdrop from './components/Backdrop/Backdrop';
import List from './components/List/List';
// import default Component of React Transition Group Package
import Transition from 'react-transition-group/Transition';

const App = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showBlock, setShowBlock] = useState(false);

  const showModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const toggleBlock = () => setShowBlock((prev) => !prev);

  return (
    <div className='App'>
      <h1>React Animations</h1>
      <button className='Button' onClick={toggleBlock}>
        Toggle
      </button>
      {/* 4) Transition component: 
          Docu: https://reactcommunity.org/react-transition-group/ 
          Wrap Transition around elements to control the animation of elements inside;
          Transition only tracks 'enter' (-> from 'entering' to 'entered') and 
          'exit' (-> from 'exiting' to 'exited') states for components;
          'in' determines if elements visible;
          'timeout' -> duration of how long transition state (-> from 'entering' to 'entered') or same with 'exit'
          is held to execute e.g. animation between 'entering'/'entered' or 'exiting'/'exited' states;
          -> notice: if timeout is shorter than animation time defined in css, then not entire animation is played;
          mountOnEnter and unmountOnExit adds or removes elements from DOM based on switch of 'in' prop;
          transition events: cb functions that occur when certain events happen -> use it to time animations based on these events
      */}
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
        {/* returns a function with arg of transition state;
        now, I can manipulate component based on state */}
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
      {/* 3) Conditional rendering for animations; 
      advantage: add/remove elements from DOM, not only hide them with css properties;
      problem: removing from DOM immediately -> can't see close animation anymore 
      {modalIsOpen && <Modal show={modalIsOpen} closed={closeModal} />}
      {modalIsOpen && <Backdrop show={modalIsOpen} closed={closeModal} />}
      solution: use Transition component in child component OR 
      wrap it around here and pass state prop into Modal component */}
      {/* <Transition mountOnEnter unmountOnExit in={modalIsOpen} timeout={300}>
        {(state) => <Modal show={state} closed={closeModal} />}
      </Transition> */}
      <Modal show={modalIsOpen} closed={closeModal} />
      {modalIsOpen && <Backdrop show={modalIsOpen} closed={closeModal} />}
      <button className='Button' onClick={showModal}>
        Open Modal
      </button>
      <h3>Animating Lists</h3>
      <List />
    </div>
  );
};

export default App;
