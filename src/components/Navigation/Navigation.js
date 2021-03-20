import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation(props) {
    return (
        <nav>
            <div className="header-logo">
                <Link to="/"><img src='/freeflix-logo.png' alt="logo" /></Link>
            </div>
            {props.user ? (
                <div className="control-wrapper">
                    <Link to="/search" className="nav-btn"><i className="fas fa-search fa-2x"></i></Link>
                    <Link to="/my-list" className="nav-btn">My List</Link>
                    <Link to="/profile" className="nav-btn"><i className="fas fa-user-circle fa-2x"></i></Link>
                </div>
            ) : (
                <div>
                    <Link to="/sign-in" className="signin-btn">Sign In</Link>
                </div>
            )}
        </nav>
    )
}

export default Navigation