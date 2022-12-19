import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useHttp from '../../hooks/useHttp';
import { getAllComments } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import classes from './Comments.module.css';
import NewCommentForm from './NewCommentForm';
import CommentsList from './CommentsList';

const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const { quoteId } = useParams();
  const { sendRequest, status, error, data: loadedComments } = useHttp(getAllComments);

  // fetch all comments for specific quote
  useEffect(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  // whenever new comment was added, then comments list should be updated;
  // avoid infinite loop: use useCallback since this fn is used as a dependency
  // in useEffect of child component <NewCommentForm>
  const addedCommentHandler = useCallback(() => {
    sendRequest(quoteId);
    setIsAddingComment(false);
  }, [sendRequest, quoteId]);

  let comments;

  if (status === 'pending') {
    comments = (
      <div className='centered'>
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'completed' && loadedComments.length > 0) {
    comments = <CommentsList comments={loadedComments} />;
  }

  if (status === 'completed' && loadedComments.length === 0) {
    comments = <p className='centered'>No comments were added yet!</p>;
  }

  if (status === 'error' && loadedComments.length === 0) {
    comments = <p className='centered'>{error}</p>;
  }

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className='btn' onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && <NewCommentForm quoteId={quoteId} onAddedComment={addedCommentHandler} />}
      {comments}
    </section>
  );
};

export default Comments;
