import './Header.css';

function Header({children}) {
    return (
        <div className="header" style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/bg.jpg')` }}>
            {children}
        </div>
    )
}

export default Header