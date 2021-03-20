import './SignScreen.css';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function SignScreen() {

    const location = useLocation();

    return (
        <>
            {location.pathname === '/sign-up' ?
                <Header>
                    <div className="user-form-wrapper">
                        <form className="user-form">
                            <h2 className="user-form-title">Sign Up</h2>
                            <input className="user-form-field" type="email" placeholder="Email" />
                            <input className="user-form-field" type="text" placeholder="Password" />
                            <input className="user-form-field" type="text" placeholder="Repeat password" />
                            <button className="signin-btn" type="submit">Sign Up</button>
                        </form>
                        <p className="user-form-description">Already have an account? <Link className="user-form-link" to="/sign-in">Sign in now</Link>.</p>
                    </div>
                </Header> :
                <Header>
                    <div className="user-form-wrapper">
                        <form className="user-form">
                            <h2 className="user-form-title">Sign In</h2>
                            <input className="user-form-field" type="email" placeholder="Email" />
                            <input className="user-form-field" type="text" placeholder="Password" />
                            <button className="signin-btn" type="submit">Sign In</button>
                        </form>
                        <p className="user-form-description">Don't have an account? <Link className="user-form-link" to="/sign-up">Sign up now</Link>.</p>
                    </div>
                </Header>
            }
        </>
    )
}

export default SignScreen