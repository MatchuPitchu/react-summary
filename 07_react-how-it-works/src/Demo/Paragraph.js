const Demo = ({ children }) => {
  // to see how often component fn is re-executed
  console.log('PARAGRAPH Component');

  return <p>{children}</p>;
};

export default Demo;
