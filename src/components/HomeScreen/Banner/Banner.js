import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';
import requests from '../../../services/movies-api';

function Banner(props) {

    const [movie, setMovie] = useState([]);
    const [imageUrl, setImageUrl] = useState(``);
    const [error, setError] = useState('');

    async function getRandomMovie(url) {
        try {
            const request = await fetch(url);
            const movies = await request.json();
            const movie = movies.results[Math.floor(Math.random() * movies.results.length - 1)];
            setMovie(movie);
            setImageUrl(`${requests.imageBaseUrl}${movie.backdrop_path}`);
            return movie;
        } catch (error) {
            setError(error);
            console.log(error);
        }
    }

    useEffect(() => {
        getRandomMovie(props.url);
    }, [props.url]);

    function trim(string, n) {
        if (string.length > n) {
            return string.substring(0, n - 1).concat('...');
        }
        return string;
    }

    return (
        <>
            {error ?
                <div className="banner">
                    <p className="error-message">An error occured while displaying the movie</p>
                </div> :
                <div className="banner" style={imageUrl ? { backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(255,255,255,0) 65%), url(${imageUrl})` } : null}>
                    <div className="banner-content">
                        <h1 className="banner-content-title">{movie?.title || movie?.name || movie?.original_name}</h1>
                        <Link to={`/details/${movie?.id}`} className="banner-content-btn">Details</Link>
                        <p className="banner-content-description">{trim(`${movie?.overview}`, 150)}</p>
                    </div>
                </div>
            }
        </>
    )
}

export default Banner