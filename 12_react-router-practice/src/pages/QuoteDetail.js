import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import useHttp from '../hooks/useHttp';
import { getSingleQuote } from '../lib/api';
import HighlightedQuote from '../components/quotes/HighlightedQuote';
import LoadingSpinner from '../components/UI/LoadingSpinner';

// const DUMMY_QUOTES = [
//   { id: 'q1', author: 'Matchu', text: 'Learning React is fine.' },
//   { id: 'q2', author: 'Pitchu', text: 'Do it and learn it.' },
// ];

const QuoteDetail = () => {
  const { quoteId } = useParams();

  // second arg is true to start in loading state when fetching data;
  const { sendRequest, status, error, data: loadedQuote } = useHttp(getSingleQuote, true);

  useEffect(() => {
    // pass quoteId to select right quote to fetch in the database
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  // approach with dummy data
  // const quote = DUMMY_QUOTES.find((quote) => quote.id === quoteId);

  if (status === 'pending') {
    return (
      <div className='centered'>
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'error') return <p className='centered'>{error}</p>;

  // handle error case if user types in URL path manually without existing :quoteId
  if (!loadedQuote.text) return <p className='centered'>No quote found</p>;

  return (
    <>
      <HighlightedQuote text={loadedQuote.text} author={loadedQuote.author} />
      {/* Outlet component to insert in root component defined nested routes */}
      <Outlet />
    </>
  );
};

export default QuoteDetail;
