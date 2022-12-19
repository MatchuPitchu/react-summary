import { Link } from 'react-router-dom';
import classes from './QuoteItem.module.css';

const QuoteItem = ({ text, author, id }) => {
  return (
    <li className={classes.item}>
      <figure>
        <blockquote>
          <p>{text}</p>
        </blockquote>
        <figcaption>{author}</figcaption>
      </figure>
      <Link className='btn' to={`/quotes/${id}`}>
        View Fullscreen
      </Link>
    </li>
  );
};

export default QuoteItem;
