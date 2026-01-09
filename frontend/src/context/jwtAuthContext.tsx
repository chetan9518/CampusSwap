import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

interface User {
    id: string;
    uid: string;
    email: string;
    fullName: string;
    avatar?: string;
    hostel?: string;
    year?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const Context = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    login: () => {},
    logout: () => {}
});

export const JWTAuthContext = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for stored token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
            // Verify token with backend
            axios.get(`${import.meta.env.VITE_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then(response => {
                if (response.data.success) {
                    setToken(storedToken);
                    setUser(response.data.user);
                } else {
                    localStorage.removeItem('jwt_token');
                }
            })
            .catch(() => {
                localStorage.removeItem('jwt_token');
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('jwt_token', newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('jwt_token');
    };

    return (
        <Context.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </Context.Provider>
    );
};

export const useJWTAuth = () => useContext(Context);
