import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Row.css';
import requests from '../../../services/movies-api';

function Row(props) {

    const [movies, setMovies] = useState([]);

    async function getMovies(url) {
        try {
            const request = await fetch(url);
            const movies = await request.json();
            setMovies(movies.results);
            return movies;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMovies(props.url)
    }, [props.url])

    return (
        <div className="row">
            <h2 className="genre-title">{props.title}</h2>
            {props.seeMore && <Link to={`/movies/${props.title.split(' ')[0].toLowerCase()}`}><h2 className="genre-title see-all-btn">See More</h2></Link>}
            <div className="posters">
                {movies && movies.map((m, index) => (
                    m.poster_path && m.backdrop_path &&
                    <Link key={`${m.id} + ${index}`} to={`/details/${m.id}`}>
                        <img className={`poster ${props.isBig && "big"}`} src={`${requests.imageBaseUrlSmall}${props.isBig ? m.poster_path : m.backdrop_path}`} alt={m.name} />
                        <span>{m.title || m.name || m.original_name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Row