import classes from './HighlightedQuote.module.css';

const HighlightedQuote = ({ text, author }) => {
  return (
    <figure className={classes.quote}>
      <p>{text}</p>
      <figcaption>{author}</figcaption>
    </figure>
  );
};

export default HighlightedQuote;
