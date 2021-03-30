import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Favourites.css';

function Favourites() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, sethasMore] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function getMovies() {
            try {
                const request = await fetch(`/api/movies/20/${page}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
                });
                const movies = await request.json();
                page < movies.pages ? sethasMore(true) : sethasMore(false);
                setMovies((prevState) => [...new Set([...prevState, ...movies.movies])]);
                return movies
            } catch (error) {
                setError(error);
            }
        }
        getMovies();
    }, [page])

    return (
        <div>
            <h2 className="title">My Movies</h2>
            {error ?
                <div className="banner">
                    <p className="error-message">An error occured while displaying the movies</p>
                </div> :
                <>
                    <div className="movie-results">
                        {movies.map((m, index) => (
                            <Link to={`/details/${m.externalId}`} className="movie-poster-wrapper" key={m._id}>
                                <img className="movie-poster" src={`${m.imageUrl}`} alt={m.title} />
                                <span>{m.title}</span>
                            </Link>
                        ))}
                    </div>
                    {hasMore && <div className="see-more-btn-wrapper"><button className="see-more-btn" onClick={() => setPage(prevState => prevState + 1)}>Load More</button></div>}
                </>
            }
        </div>
    )
}

export default Favourites