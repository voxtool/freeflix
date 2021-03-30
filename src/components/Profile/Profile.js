import { useContext } from 'react';
import Header from '../Header/Header';
import { AuthContext } from '../../context/AuthContext';
import './Profile.css';

function Profile() {

    const { user, setUser } = useContext(AuthContext);

    async function logoutHandler() {
        try {
            const response = await fetch('/api/users/logout', {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                credentials: 'include',
                body: null
            })
            const userData = await response.json();
            setUser(null);
            return userData
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Header>
            <div className="user-profile-wrapper">
                <i className="fas fa-user-circle fa-5x"></i>
                <div className="user-profile-info">
                    <div className="user-profile-email">
                        <p>{user.email}</p>
                    </div>
                    <div className="user-profile-movies">
                        <p>Your subscription: <strong>Freemium</strong></p>
                    </div>
                    <div className="user-profile-movies">
                        <p>Currently you have {user.movies.length} {user.movies.length !== 1 ? 'movies' : 'movie'} in your watchlist.</p>
                    </div>
                    <div className="user-profile-signout">
                        <button className="signin-btn" onClick={logoutHandler}>Sign Out</button>
                    </div>
                </div>
            </div>
        </Header>
    )
}

export default Profile