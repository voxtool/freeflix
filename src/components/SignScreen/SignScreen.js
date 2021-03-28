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
        setError('');
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
            errors.password = 'Must contain atleast 1 uppercase letter and 1 number'
        }

        return errors;
    };


    const formik = useFormik({
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

    const formik2 = useFormik({
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
                        <form className="user-form" onSubmit={formik.handleSubmit}>
                            {error ? <div className="form-error">{error}</div> : null}
                            <h2 className="user-form-title">Sign Up</h2>
                            <input className="user-form-field" type="email" name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} placeholder="Email" />
                            {formik.touched.email && formik.errors.email ? (<div className="form-error">{formik.errors.email}</div>) : null}
                            <input className="user-form-field" type="password" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} placeholder="Password" />
                            {formik.touched.password && formik.errors.password ? (<div className="form-error">{formik.errors.password}</div>) : null}
                            <input className="user-form-field" type="password" name="repassword" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.repassword} placeholder="Repeat password" />
                            <button className="signin-btn" name="button" type="submit">Sign Up</button>
                        </form>
                        <p className="user-form-description">Already have an account? <Link className="user-form-link" to="/sign-in">Sign in now</Link>.</p>
                    </div>
                </Header> :
                <Header>
                    <div className="user-form-wrapper">
                        <form className="user-form" onSubmit={formik2.handleSubmit}>
                            {error ? <div className="form-error">{error}</div> : null}
                            <h2 className="user-form-title">Sign In</h2>
                            <input className="user-form-field" type="email" name="email" onChange={formik2.handleChange} onBlur={formik2.handleBlur} value={formik2.values.email} placeholder="Email" />
                            {formik2.touched.email && formik2.errors.email ? (<div className="form-error">{formik2.errors.email}</div>) : null}
                            <input className="user-form-field" type="password" name="password" onChange={formik2.handleChange} onBlur={formik2.handleBlur} value={formik2.values.password} placeholder="Password" />
                            {formik2.touched.password && formik2.errors.password ? (<div className="form-error">{formik2.errors.password}</div>) : null}
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