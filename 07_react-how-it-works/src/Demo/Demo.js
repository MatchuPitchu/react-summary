import React from 'react';
import Paragraph from './Paragraph';

const Demo = ({ show }) => {
  // to see how often component fn is re-executed
  console.log('DEMO Component');

  return <Paragraph>{show ? 'New line!' : ''}</Paragraph>;
};

// export default Demo;
// For 4) in App.js
export default React.memo(Demo);
