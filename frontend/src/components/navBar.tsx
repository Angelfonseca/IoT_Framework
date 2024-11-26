import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../assets/css/componentsCss/navBar.css';

const NavBar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <nav className="navbar">
            <img src="/tecnm.png" alt="Logo" className="navbar-logo" />
            <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                &#9776; {/* Icono de hamburguesa */}
            </button>
            <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                <li className="navbar-item">
                    <Link to="/monitorizacion" className="navbar-link">Monitorización</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/modelos" className="navbar-link">Modelos</Link>
                </li>
                <li className='navbar-item'>
                    <Link to="/alertas" className="navbar-link">Filtros</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/login" className="navbar-link" onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }}>Cierre de sesión</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
