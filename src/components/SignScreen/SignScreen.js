import { useContext, useState } from 'react';
import './SignScreen.css';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useFormik } from 'formik';

function SignScreen() {

    const location = useLocation();
    const { setUser } = useContext(AuthContext);
    const [error, setError] = useState('');

    async function userHandler(data, endpoint) {
        try {
            const response = await fetch(`/api/users/${endpoint.toLowerCase()}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(data)
            })
            if (response.ok === false) {
                const error = await response.json();
                setError(error.message);
                return
            }
            const userData = await response.json();
            return userData.message ? setUser(null) : setUser(userData)
        } catch (error) {
            console.log(error.message);
        }
    }

    const validate = values => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
            errors.email = 'Invalid email';
        }

        if (!values.password) {
            errors.password = 'Required';
        } else if (values.password.length < 6) {
            errors.password = 'Must be 6 characters or more';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/g.test(values.password)) {
            errors.password = 'Must have 1 uppercase letter and 1 digit'
        }

        return errors;
    };


    const registerFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
            repassword: '',
        },
        validate,
        onSubmit: values => {
            userHandler({ email: values.email, password: values.password }, 'register');
        },
    })

    const loginFormik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate,
        onSubmit: values => {
            userHandler({ email: values.email, password: values.password }, 'login');
        },
    })

    return (
        <>
            {location.pathname === '/sign-up' ?
                <Header>
                    <div className="user-form-wrapper">
                        <form className="user-form" onSubmit={registerFormik.handleSubmit}>
                            {error ? <div className="form-error">{error}</div> : null}
                            <h2 className="user-form-title">Sign Up</h2>
                            <input className="user-form-field" type="email" name="email" onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} value={registerFormik.values.email} placeholder="Email" />
                            {registerFormik.touched.email && registerFormik.errors.email ? (<div className="form-error">{registerFormik.errors.email}</div>) : null}
                            <input className="user-form-field" type="password" name="password" onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} value={registerFormik.values.password} placeholder="Password" />
                            {registerFormik.touched.password && registerFormik.errors.password ? (<div className="form-error">{registerFormik.errors.password}</div>) : null}
                            <input className="user-form-field" type="password" name="repassword" onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} value={registerFormik.values.repassword} placeholder="Repeat password" />
                            <button className="signin-btn" name="button" type="submit">Sign Up</button>
                        </form>
                        <p className="user-form-description">Already have an account? <Link className="user-form-link" to="/sign-in">Sign in now</Link>.</p>
                    </div>
                </Header> :
                <Header>
                    <div className="user-form-wrapper">
                        <form className="user-form" onSubmit={loginFormik.handleSubmit}>
                            {error ? <div className="form-error">{error}</div> : null}
                            <h2 className="user-form-title">Sign In</h2>
                            <input className="user-form-field" type="email" name="email" onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} value={loginFormik.values.email} placeholder="Email" />
                            {loginFormik.touched.email && loginFormik.errors.email ? (<div className="form-error">{loginFormik.errors.email}</div>) : null}
                            <input className="user-form-field" type="password" name="password" onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} value={loginFormik.values.password} placeholder="Password" />
                            {loginFormik.touched.password && loginFormik.errors.password ? (<div className="form-error">{loginFormik.errors.password}</div>) : null}
                            <button className="signin-btn" type="submit" name="button">Sign In</button>
                        </form>
                        <p className="user-form-description">Don't have an account? <Link className="user-form-link" to="/sign-up">Sign up now</Link>.</p>
                    </div>
                </Header>
            }
        </>
    )
}

export default SignScreen