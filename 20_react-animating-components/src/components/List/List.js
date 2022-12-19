import { useState } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from 'react-transition-group/CSSTransition';
import './List.css';

const List = () => {
  const [items, setItems] = useState([1, 2, 3]);

  const addItemHandler = () => setItems((prev) => [...prev, prev.length + 1]);

  const removeItemHandler = (selectedIndex) =>
    setItems((prev) => prev.filter((_, index) => index !== selectedIndex));

  const listItems = items.map((item, i) => (
    <CSSTransition key={i} classNames='fade' timeout={300}>
      <li className='ListItem' onClick={() => removeItemHandler(i)}>
        {item}
      </li>
    </CSSTransition>
  ));

  return (
    <div>
      <button className='Button' onClick={addItemHandler}>
        Add Item
      </button>
      <p>Click Item to Remove.</p>
      {/* component to animate lists (-> groups of dynamic elements);
      by default it renders a div, but you can define element with component prop;
      has to wrap Transition or CSSTransition component;
      a) TransitionGroup is able to handle multiple items, 
      b) determines when one element in list changes and
      c) it sets automatically 'in' prop on e.g. CSSTransition */}
      <TransitionGroup component='ul' className='List'>
        {listItems}
      </TransitionGroup>
    </div>
  );
};

export default List;
