import Movie from './Movie';
import classes from './MoviesList.module.css';

const MovieList = ({ movies }) => {
  return (
    <ul className={classes['movies-list']}>
      {movies.map(movie => (
        <Movie
          key={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          openingText={movie.openingText}
        />
      ))}
    </ul>
  );
};

export default MovieList;
