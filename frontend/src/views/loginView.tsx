import logo from '/logo.png';
import { useEffect, useState } from 'react';
import apiService from '../services/api.service';
import { useNavigate } from 'react-router-dom';
import '../assets/css/viewsCss/loginView.css';
import { Toaster, toast } from 'sonner';

export default function LoginView() {
    const [usuario, setUsuario] = useState('');
    const [pass, setPassword] = useState('');
    const navigate = useNavigate();

    function isLogged() {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }

    useEffect(() => {
        isLogged();
    }, []);

    function login() {
        apiService.post<{ token: string }>('/users/auth/login', { username, password })
            .then((response) => {
                console.log('Respuesta de la autenticación:', response);
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/');
            })
            .catch((error) => {
                console.error('Error en la autenticación:', error);
                toast.error('Error en la autenticación');
            });
    }

    const handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login();
    }

    const username = usuario.valueOf();
    const password = pass.valueOf();

    return (
        <div className="login-container">
            <Toaster />
            <div className="login">
                <img className="logo" src={logo} alt="Logo" />
                <form onSubmit={handleSumbit}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn-login" type="submit">Iniciar sesión</button>
                </form>
            </div>
        </div>
    );
}
