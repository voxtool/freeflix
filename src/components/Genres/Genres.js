import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import requests from '../../services/movies-api';
import './Genres.css';

function Genres() {
    const { genre } = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, sethasMore] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        setPage(1);
        setMovies([]);
        sethasMore(false);
    }, [genre]);

    useEffect(() => {
        async function getMovies(genre) {
            try {
                const request = await fetch(`${requests[`${genre.toLowerCase()}`]}&page=${page}`);
                const movies = await request.json();
                if (movies.success === false) {
                    throw new Error('Could not fetch');
                } else {
                    movies.page < movies.total_pages ? sethasMore(true) : sethasMore(false);
                    setMovies((prevState) => [...new Set([...prevState, ...movies.results])]);
                    return movies
                }
            } catch (error) {
                setError(error);
            }
        }
        getMovies(genre);
    }, [genre, page])

    return (
        <div>
            <h2 className="title">{`${genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()} Movies`}</h2>
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

export default Genres