// Tipo para el payload del JWT
interface JWTPayload {
    exp: number;
    [key: string]: string | number | boolean;
}

interface User {
    token: string;
    user: {
        isAdmin: boolean;
        [key: string]: string | number | boolean; 
    };
}

export function parseJWT(token: string): JWTPayload | null {
    try {
        const base64Url = token.split('.')[1];  // Parte del payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload) as JWTPayload;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
}

export function validateJWT(): boolean {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        window.location.href = '/';
        return false;
    }

    const user: User = JSON.parse(storedUser);
    const token = user.token;

    if (!token) {
        window.location.href = '/';
        return false;
    }

    const decoded = parseJWT(token);

    if (!decoded) {
        window.location.href = '/';
        return false;
    }

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        localStorage.removeItem('user');
        window.location.href = '/';
        return false;
    }

    return true; 
}

export function validateAdmin(): boolean {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        window.location.href = '/unauthorized'; 
        return false;
    }

    const user: User = JSON.parse(storedUser);

    if (!user.user.isAdmin) {
        window.location.href = '/unauthorized'; 
        return false;
    }

    return true; 
}
