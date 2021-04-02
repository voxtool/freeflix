import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Watch.css';

function Watch() {
    const { id } = useParams();
    const [subEn, setSubEn] = useState();

    useEffect(() => {
        async function getSubtitles() {
            try {
                const response = await fetch(`/api/movies/subtitles/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'GET',
                });
                const path = await response.json();
                setSubEn(path ? "/static/" + path : undefined);
            } catch (error) { }
        }
        getSubtitles();
    }, [subEn, id]);

    useEffect(() => {
        return async () => {
            try {
                const response = await fetch(`/api/movies/clean/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                console.log(result);
            } catch (error) { }
        }
    }, [id])

    useEffect(() => {
        return async () => {
            try {
                const response = await fetch('/api/movies/subclean', {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                console.log(result);
            } catch (error) { }
        }
    }, [])

    return (
        <div className="video-wrapper">
            <video className="movie" autoPlay width="1536" height="1152" src={`/api/movies/play/${id}`} controls>
                {subEn
                    ? <track label="English" kind="subtitles" srcLang="en" src={subEn} />
                    : null
                }
                Your browser does not support HTML5 video.
            </video>
        </div>
    )
}

export default Watch