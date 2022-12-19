import './Card.css';

// a) pass className as prop into wrapper component
// b) use React built-in prop "children" that every component receive;
// "children" is reserved name -> value is always content between
// opening and closing tags of my custom component (-> <Card>...</Card>);
const Card = ({ className, children }) => {
  const classes = `card ${className}`;

  return <div className={classes}>{children}</div>;
};

export default Card;
