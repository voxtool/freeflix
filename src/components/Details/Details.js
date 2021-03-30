import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import requests from '../../services/movies-api';
import './Details.css';

function Details() {
    const { id } = useParams();
    const [movie, setMovie] = useState({});
    const [link, setLink] = useState('');
    const [imageUrl, setImageUrl] = useState(``);
    const [magnet, setMagnet] = useState([]);
    const [userMovieId, setUserMovieId] = useState();
    const { user, setUser } = useContext(AuthContext);

    async function addMovie() {
        const movieInfo = { imageUrl: `${requests.imageBaseUrlSmall}${movie.poster_path}`, title: movie?.title || movie?.name || movie?.original_name, externalId: movie.id };
        try {
            const request = await fetch('/api/movies/add', {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(movieInfo)
            });
            const user = await request.json();
            setUser(user);
        } catch (error) {
            console.log(error);
        }
    }

    async function removeMovie() {
        try {
            const request = await fetch(`/api/movies/remove/${userMovieId._id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'DELETE',
                credentials: 'include',
            });
            const user = await request.json();
            setUser(user);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function getMovie(id) {
            try {
                const request = await fetch(`${requests.detailsStart}${id}${requests.detailsEnd}`);
                const movie = await request.json();
                setMovie(movie);
                setLink(movie.videos.results[0]?.key);
                setImageUrl(`${requests.imageBaseUrl}${movie.backdrop_path}`);
                const userMovie = user.movies.find(el => Number(el.externalId) === movie.id);
                setUserMovieId(userMovie);
                const regex = /(,|'|:|\(|\)|%|\/|\\|\?|!)/gm;
                const pbay = await fetch(`/api/movies/search/${movie?.title.replace(regex, '') || movie?.name.replace(regex, '') || movie?.original_name.replace(regex, '')} ${movie.release_date?.slice(0, 4)}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include'
                });
                const magnets = await pbay.json();
                if (magnets && magnets[0] !== '0' && magnets[0] !== undefined && magnets[0] !== null) {
                    setMagnet(magnets);
                };
                return movie;
            } catch (error) {
                console.log(error);
            }
        }
        getMovie(id);
    }, [id, user.movies])

    return (
        <div>
            <div className="banner" style={movie.backdrop_path ? { backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(255,255,255,0) 65%), url(${imageUrl})` } : null}>
                <div className="banner-content">
                    <h1 className="banner-content-title">{movie?.title || movie?.name || movie?.original_name}</h1>
                    {userMovieId ? <button className="signin-btn" onClick={removeMovie}>Remove from List</button> : <button className="signin-btn" onClick={addMovie}>Add to List</button>}
                    <p className="banner-content-description">{movie?.overview}</p>
                    <span className="movie-stats">{movie?.release_date?.slice(0, 4)}</span>
                    <span className="movie-stats">{movie?.runtime}min</span>
                    <span className="movie-stats"><i className="far fa-star"></i> {movie?.vote_average}</span>
                </div>
            </div>
            <div className="trailer-wrapper">
                {link && <iframe id="ytplayer" className="trailer" title="trailer" type="text/html" width="640" height="360" allowFullScreen src={`https://www.youtube.com/embed/${link}`}></iframe>}
                <div className="watch-links">
                    {magnet && magnet.map(m => (
                        m !== 0 && <Link key={m} to={`/watch/${m}`} className="banner-content-btn red">Watch Now</Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Details