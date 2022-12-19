import React, { useMemo } from 'react';
import classes from './DemoList.module.css';

const DemoList = ({ items, title }) => {
  // Example should stand for a very performance intensive task: sorting received items array
  // useMemo: memoizes data to avoid re-calculation of performance intensive tasks
  // first argument is cb function that returns what you want to store/memoizes;
  // second argument is array of dependencies to ensure that stored value is updated
  // if value in array changes;
  // important like for React.memo(): NOT use it everywhere because it costs also performance and
  // it needs space to store data
  const sortedList = useMemo(() => {
    console.log('Items sorted');
    return items.sort((a, b) => a - b);
  }, [items]);

  console.log('DEMOLIST running');

  return (
    <div className={classes.list}>
      <h2>{title}</h2>
      <ul>
        {sortedList.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(DemoList); // use memo() to avoid unnecessary re-rendering of component
