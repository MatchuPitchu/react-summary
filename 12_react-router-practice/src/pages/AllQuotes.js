import { useEffect } from 'react';
import useHttp from '../hooks/useHttp';
import { getAllQuotes } from '../lib/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import QuoteList from '../components/quotes/QuoteList';
import NoQuotesFound from '../components/quotes/NoQuotesFound';

// const DUMMY_QUOTES = [
//   { id: 'q1', author: 'Matchu', text: 'Learning React is fine.' },
//   { id: 'q2', author: 'Pitchu', text: 'Do it and learn it.' },
// ];

const AllQuotes = () => {
  // second arg is true to start in loading state when fetching data;
  // destructured data array is named with alias loadedQuotes
  const { sendRequest, status, error, data: loadedQuotes } = useHttp(getAllQuotes, true);

  useEffect(() => {
    sendRequest();
    // add sendRequest fn as dependency, BUT will never change
    // because of useCallback used in hook
  }, [sendRequest]);

  if (status === 'pending') {
    return (
      <div className='centered'>
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'error') return <p className='centered focused'>{error}</p>;

  if (status === 'complete' && loadedQuotes.length === 0) return <NoQuotesFound />;

  return <QuoteList quotes={loadedQuotes} />;
};

export default AllQuotes;
