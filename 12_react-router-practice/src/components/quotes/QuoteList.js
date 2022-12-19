import { useNavigate, useLocation } from 'react-router-dom';
import QuoteItem from './QuoteItem';
import classes from './QuoteList.module.css';

// sorting helper fn:
// for ascending true or false, return means the same:
// return +1 means sort() sorts a to higher index than b;
// return -1 means sort() sorts a to lower index than b;
const sortQuotes = (quotes, ascending) => {
  return quotes.sort((a, b) => {
    if (ascending) {
      return a.id > b.id ? 1 : -1;
    } else {
      return a.id < b.id ? 1 : -1;
    }
  });
};

const QuoteList = ({ quotes }) => {
  // working with query parameters to sort quotes by ascending or descending order;
  // whereas useNavigate gives access to browser history obj,
  // useLocation gives access to currently loaded page
  const navigate = useNavigate();
  const location = useLocation();

  // default JS class URLSearchParams that returns obj
  // that contains all query params key value pairs
  const queryParams = new URLSearchParams(location.search);
  // evaluates to true or false
  const ascending = queryParams.get('sort') === 'asc';

  const sortedQuotes = sortQuotes(quotes, ascending);

  const changeSortingHandler = () => {
    // 1) pushing a page leads to re-evaluation of target component(s);
    // if quotes are currently sorted ascendingly
    // then new query param after click would be 'desc'
    // navigate(`${location.pathname}?sort=${ascending ? 'desc' : 'asc'}`);
    // 2) alternative way of creating string paths for target destination
    navigate({
      pathname: location.pathname,
      search: `sort=${ascending ? 'desc' : 'asc'}`,
    });
  };

  return (
    <>
      <div className={classes.sorting}>
        <button onClick={changeSortingHandler}>
          Sort {ascending ? 'Descending' : 'Ascending'}
        </button>
      </div>
      <ul className={classes.list}>
        {sortedQuotes.map((quote) => (
          <QuoteItem key={quote.id} id={quote.id} author={quote.author} text={quote.text} />
        ))}
      </ul>
    </>
  );
};

export default QuoteList;
