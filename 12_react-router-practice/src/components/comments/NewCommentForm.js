import { useRef, useEffect } from 'react';
import useHttp from '../../hooks/useHttp';
import { addComment } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import classes from './NewCommentForm.module.css';

const NewCommentForm = ({ onAddedComment, quoteId }) => {
  const commentTextRef = useRef();
  // a) pay attention that this component is only used in a place where URL path contains needed id;
  // b) USED here: if you wanna be more flexible then pass quoteId instead into component via props
  // const { quoteId } = useParams();
  const { sendRequest, status, error } = useHttp(addComment);

  useEffect(() => {
    // when POST finished successfully then re-fetch comment data
    if (status === 'completed' && !error) onAddedComment();
  }, [status, error, onAddedComment]);

  const submitFormHandler = (e) => {
    e.preventDefault();
    const enteredText = commentTextRef.current.value;

    // optional: Could validate here

    // pass new comment data + quoteId (to attach comment to certain quote) as args
    sendRequest({
      commentData: {
        text: enteredText,
      },
      quoteId,
    });
  };

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      {/* as defined in useHttp, status is 'pending' after invoking sendRequest fn in submitFormHandler here */}
      {status === 'pending' && (
        <div className='centered'>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.control} onSubmit={submitFormHandler}>
        <label htmlFor='comment'>Your Comment</label>
        <textarea id='comment' rows='5' ref={commentTextRef}></textarea>
      </div>
      <div className={classes.actions}>
        <button className='btn'>Add Comment</button>
      </div>
    </form>
  );
};

export default NewCommentForm;
