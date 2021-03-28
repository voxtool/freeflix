import { useContext } from 'react';
import Header from '../Header/Header';
import { AuthContext } from '../../context/AuthContext';
import './Profile.css';

function Profile() {

    const { user, setUser } = useContext(AuthContext);

    async function userHandler(data, endpoint) {
        try {
            const response = await fetch(`/api/users/${endpoint.toLowerCase()}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                credentials: 'include',
                body: null
            })
            const userData = await response.json();
            return setUser(null)
        } catch (error) {
            console.log(error);
        }
    }

    function logoutHandler() {
        userHandler({}, 'logout')
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
                        <p>Currently you have {user.movies.length} movies in your watchlist.</p>
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