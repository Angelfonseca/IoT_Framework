import { Outlet } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import '../assets/css/viewsCss/layout.css'; // Importa el archivo CSS

export default function Layout() {
    return (
        <div className="layout-container">
            <NavBar />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}