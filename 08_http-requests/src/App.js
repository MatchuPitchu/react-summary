import { Fragment, useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // async/await GET request with built-in Fetch API;
  // use useCallback to avoid that fn is re-created unnecessary on every re-evaluation of component;
  // list all external dependencies in the dependency array (here: nothing)
  const fetchMoviesHandler = useCallback(async () => {
    setLoading(true);
    // reset error to null in case that there was a former error
    setError(null);
    // error handling with try catch blocks;
    // whenever some error is thrown in try block, it is catched in catch block;
    // problem: error status codes are NOT treated as JS errors by Fetch API
    // notice: Axios would generate and throw a real error for error codes
    // with Fetch API use 'ok' property
    try {
      // fetch returns a promise;
      // 'movies.json' -> have to add .json when using firebase; database was disabled after test
      const res = await fetch(
        'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/movies.json'
      );
      // if error status code is received then throw error and stop execution of try block
      if (!res.ok) {
        throw new Error('Something went wrong');
      }
      // response is obj with bunch of data sended in json format;
      // translate json obj to real JS obj with json method and
      // return transformed data to next then();
      const data = await res.json();

      // transform firebase data (which is bunch of objects in an obj) into an array
      const loadedMovies = [];
      // loop through all keys in data obj (every key contains one movie obj)
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      // first approach with Star Wars API https://swapi.dev/
      // transform received data obj with map() into my wished format
      // const transformedMovies = data.results.map(movie => {
      //   return {
      //     id: movie.episode_id,
      //     title: movie.title,
      //     openingText: movie.opening_crawl,
      //     releaseDate: movie.release_date,
      //   };
      // });

      setMovies(loadedMovies);
    } catch (e) {
      // message is string passed inside Error above
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // execute fetch fn when component loads the first time AND
    // when fetchMoviesHandler fn is changed (e.g. if in this fn would be used an external state)
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = async movie => {
    setLoading(true);
    setError(null);

    const options = {
      method: 'POST',
      body: JSON.stringify(movie), // body data has to be in json format
      headers: { 'Content-Type': 'application/json' },
    };

    try {
      const res = await fetch(
        'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
        options
      );
      const data = await res.json();
      console.log(data);
      fetchMoviesHandler(); // automatically fetch new movies
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </Fragment>
  );
};

export default App;
