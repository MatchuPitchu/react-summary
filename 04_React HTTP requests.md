# Sending HTTP Requests (e.g. Connecting to a Database)

- browser-side apps don't directly talk to databases: database credentials would be exposed in the browser, performance issues ...
- apps talk via their backend app (NodeJS App, PHP App ...) to databases: credentials are in the backend
- `API` (Application Programming Interface)
  - means that in the code you're dealing with something which has a cleary defined interface / rules on how you can achieve certain results and do certain tasks
  - in context of HTTP requests `REST API` & `GraphQL API` are two different standards for how a server should expose its data
- [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

## Tools

- JavaScript built-in [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [`Axios` library](https://axios-http.com/): is a simple promise based HTTP client for the browser and node.js
- [`Firebase`]('https://firebase.google.com') is a service provided by Google to have a backend (with REST API and a database) without writing any code

```JavaScript
// Example for GET and POST request
const App = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // async/await GET request with built-in Fetch API;
  // use useCallback to avoid that fn is re-created unnecessary on every re-evaluation of component;
  // list all external dependencies in the dependency array (here: nothing)
  const fetchHandler = useCallback(async () => {
    setLoading(true);
    setError(null); // reset error to null in case that there was a former error
    // error handling with try catch blocks;
    // whenever some error is thrown in try block, it is catched in catch block;
    // problem: error status codes are NOT treated as JS errors by Fetch API
    // solution: use 'ok' prop with Fetch API or Axios would generate and throw a real error for error codes
    try {
      // fetch returns a promise;
      const res = await fetch('https://swapi.dev/api/films/');
      // if error status code is received then throw error and stop execution of try block
      if (!res.ok) throw new Error('Something went wrong');
      // response is obj with bunch of data sended in json format;
      // translate json obj to real JS obj with json method and
      // return transformed data to next then();
      const data = await res.json();

      // transform received data obj with map() into my wished format
      const transformedMovies = data.results.map(movie => {
        return {
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (e) {
      // message is a string passed inside Error above
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // execute fetch fn when component loads the first time AND
    // when fetchHandler fn is changed (e.g. if in this fn would be used an external state)
    fetchHandler();
  }, [fetchHandler]);

  const addHandler = async movie => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(movie), // body data has to be in json format
        headers: { 'Content-Type': 'application/json' },
      };
      const res = await fetch(
        'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
        options
      );
      const data = await res.json();
      console.log(data);
      fetchHandler(); // automatically fetch movies after new movie was added
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  // conditional content definition;
  // better than conditions in JSX
  //   {!loading && movies.length > 0 && <MoviesList movies={movies} />}
  //   {!loading && movies.length === 0 && !error && <p>Found no movies</p>}
  //   {!loading && error && <p>{error}</p>}
  //   {loading && <p>Loading ...</p>}
  let content = <p>Found no movies</p>;
  if (movies.length > 0) content = <MoviesList movies={movies} />;
  if (error) content = <p>{error}</p>;
  if (loading) content = <p>Loading ...</p>;

  return (
    <Fragment>
      <section>
        <AddMovie onAddMovie={addHandler} />
      </section>
      <section>
        <button onClick={fetchHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </Fragment>
  );
};
```

## Avoiding Race Conditions

<https://beta.reactjs.org/learn/you-might-not-need-an-effect?utm_campaign=This%20Week%20In%20React&utm_medium=email&utm_source=Revue%20newsletter#fetching-data>

- when you have a searchbar and every onChange event triggers a separate fetch, there is no guarantee about which order the responses will arrive in. For example, a `hell` response may arrive after `hello` response. Since it will call setResults() last, you will be displaying the wrong search results. This is called a `race condition`: two different requests `raced` against each other and came in a different order than you expected.
- to fix the race condition, you need to add a cleanup function in `useEffect`:

  - OPTION 1: `ignore` stale responses

    ```JavaScript
    const SearchResults = ({ query }) => {
      const [page, setPage] = useState(1);
      const params = new URLSearchParams({ query, page });
      const results = useData(`/api/search?${params}`);

      const handleNextPageClick = () => {
        setPage(page + 1);
      }
      // ...
    }

    const useData = (url) => {
      const [result, setResult] = useState(null);

      useEffect(() => {
        let ignore = false;
        fetchData = async () => {
          try {
            const response = await fetch(url);
            const data = response.json();
            if (!ignore) {
              setResult(data);
            }
          } catch (err) {
            console.log(err.message)
          }
        }
        fetchData();

        return () => ignore = true;
      }, [url]);

      return result;
    }
    ```

  - OPTION 2: abort an ongoing fetch request with `AbortController` <https://developer.mozilla.org/en-US/docs/Web/API/AbortController>

    ```JavaScript
    const SearchResults = ({ query }) => {
      const [page, setPage] = useState(1);
      const params = new URLSearchParams({ query, page });
      const results = useData(`/api/search?${params}`);

      const handleNextPageClick = () => {
        setPage(page + 1);
      }
      // ...
    }

    const useData = (url) => {
      const [result, setResult] = useState(null);

      useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
          try {
            const response = await fetch(url, { signal });
            const data = response.json();
            setResult(data);
          } catch (err) {
            console.log(err.message)
          }
        }
        fetchData();

        return () => controller.abort();
      }, [url]);

      return result;
    }
    ```
