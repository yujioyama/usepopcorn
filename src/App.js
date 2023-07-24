import Main from "./Main";
import NavBar from "./NavBar";
import { useState } from "react";
import Logo from "./Logo";
import NumResults from "./NumResults";
import Search from "./Search";
import Box from "./Box";
import WatchedSummary from "./WatchedSummary";
import MovieList from "./MovieList";
import WatchedMoviesList from "./WatchedMoviesList";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useMovies } from "./useMovies";
import MovieDetails from "./MovieDetails";
import { useLocalStorageState } from "./useLocalStorageState";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) =>
      watched.filter((watchedMovie) => watchedMovie.imdbID !== id)
    );
  }

  return (
    <>
      <NavBar>
        <Logo />

        <Search query={query} setQuery={setQuery} />

        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              onCloseMovie={handleCloseMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
