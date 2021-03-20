import './HomeScreen.css';
import Banner from './Banner/Banner';
import Row from './Row/Row';
import requests from '../../services/movies-api';

function HomeScreen() {
    return (
        <div>
            <Banner url={requests.trending} />
            <Row title="TRENDING NOW" url={requests.trending} isBig="true" />
            <Row title="Top Rated" url={requests.topRated} />
            <Row title="Action Movies" url={requests.action} seeMore="true" />
            <Row title="Drama Movies" url={requests.drama} seeMore="true" />
            <Row title="Thriller Movies" url={requests.thriller} seeMore="true" />
            <Row title="Comedy Movies" url={requests.comedy} seeMore="true" />
            <Row title="Horror Movies" url={requests.horror} seeMore="true" />
            <Row title="Romance Movies" url={requests.romance} seeMore="true" />
            <Row title="Documentary Movies" url={requests.documentary} seeMore="true" />
        </div>
    )
}

export default HomeScreen