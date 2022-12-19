import type { NextPage } from 'next';
import classes from './Card.module.css';

const Card: NextPage = (props) => {
  return <div className={classes.card}>{props.children}</div>;
};

export default Card;
