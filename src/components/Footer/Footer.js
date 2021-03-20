import { Component } from 'react';
import './Footer.css';

class Footer extends Component {

    render() {
        return (
            <div className="footer-logo-wrapper">
                <img className="footer-logo" src='/tmdb-logo.svg' alt="tmdb logo" />
            </div>
        )
    }
    
}

export default Footer