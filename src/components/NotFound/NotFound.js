import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return (
        <Header>
            <div className="not-found-wrapper">
            <h2 className="not-found-heading">404</h2>
            <p className="not-found-text">NOT FOUND</p>
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <Link to="/" className="signin-btn">Go Back Home</Link>
            </div>
        </Header>
    )
}

export default NotFound