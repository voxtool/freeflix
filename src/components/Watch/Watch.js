import { useParams } from 'react-router-dom';
import './Watch.css';

function Watch() {
    const { id } = useParams();

    return (
        <div className="video-wrapper">
            <video className="movie" autoPlay width="1536" height="1152" src={`/api/movies/play/${id}`} controls>
            Your browser does not support HTML5 video.
            </video>
        </div>
    )
}

export default Watch