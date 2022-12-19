import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useHttp from '../hooks/useHttp';
import { addQuote } from '../lib/api';
import QuoteForm from '../components/quotes/QuoteForm';

const NewQuote = () => {
  // pass one of request functions (-> look at lib/api.js) as arg;
  // nice approach to split up your code: outsource request fns into proper file
  const { sendRequest, status, error } = useHttp(addQuote);
  // programmatic navigation: redirection action triggered by code, NOT by a click of user;
  // use useNavigate hook that allows to change browser history (of pages user visited);
  // returns obj
  const navigate = useNavigate();

  // triggered when returned status of useHttp hook changes;
  // history as dependency won't never change
  useEffect(() => {
    if (status === 'completed' && !error) {
      // with { replace: true } as second parameter is like redirect and replacing current page (back btn is NOT working);
      // without replace it's like push() in v5: pushes new page on the stack of pages (back btn is possible)
      navigate('/quotes');
    }
  }, [status, error, navigate]);

  const addQuoteHandler = (quoteData) => {
    // use sendRequest fn of useHttp hook and pass data as arg to make POST request to database
    sendRequest(quoteData);
  };

  return <QuoteForm isLoading={status === 'pending'} onAddQuote={addQuoteHandler} />;
};

export default NewQuote;
