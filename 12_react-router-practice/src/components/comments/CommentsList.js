import CommentItem from './CommentItem';
import classes from './CommentsList.module.css';

const CommentsList = ({ comments }) => {
  return (
    <ul className={classes.comments}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} text={comment.text} />
      ))}
    </ul>
  );
};

export default CommentsList;
