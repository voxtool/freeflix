import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import requests from '../../services/movies-api';
import './Search.css';

function Search() {

    const [query, setQuery] = useState('');
    const [search, setSearch] = useState('');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, sethasMore] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const timeId = setTimeout(() => setSearch(query), 500);
        return () => clearTimeout(timeId);
    }, [query]);


    useEffect(() => {
        setPage(1);
        setMovies([]);
        sethasMore(false);
    }, [search]);

    useEffect(() => {
        async function getMovies(search) {
            if (search) {
                try {
                    const request = await fetch(`${requests.searchByWord}&query=${search}&page=${page}`);
                    const movies = await request.json();
                    if (movies.success === false) {
                        throw new Error('Could not fetch');
                    } else {
                        movies.page < movies.total_pages ? sethasMore(true) : sethasMore(false);
                        setMovies((prevState) => [...new Set([...prevState, ...movies.results])]);
                        return movies;
                    }
                } catch (error) {
                    setError(error);
                }
            }
        }
        getMovies(search);
    }, [search, page]);

    return (
        <div>
            <div className="search-wrapper">
                <h2 className="title">Search:</h2>
                <input type="text" placeholder="Search for movies..." className="search-bar" value={query} onChange={(e) => setQuery(e.target.value)} />
                {query && <i className="far fa-times-circle fa-2x" onClick={() => setQuery('')}></i>}
            </div>
            {error ?
                <div className="banner">
                    <p className="error-message">An error occured while displaying the movies</p>
                </div> :
                <>
                    <div className="movie-results">
                        {movies.map((m, index) => (
                            m.poster_path &&
                            <Link to={`/details/${m.id}`} className="movie-poster-wrapper" key={`${m.id} + ${index}`}>
                                <img className="movie-poster" src={`${requests.imageBaseUrlSmall}${m.poster_path}`} alt={m.name} />
                                <span>{m.title || m.name || m.original_name}</span>
                            </Link>
                        ))}
                    </div>
                    {hasMore && <div className="see-more-btn-wrapper"><button className="see-more-btn" onClick={() => setPage(prevState => prevState + 1)}>Load More</button></div>}
                </>
            }
        </div>
    )
}

export default Search