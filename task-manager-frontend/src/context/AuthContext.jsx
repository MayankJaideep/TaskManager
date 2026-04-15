import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Upon application start, we can check if we have a refresh token by hitting /refresh
        const initializeAuth = async () => {
            try {
                const response = await api.post('/auth/refresh');
                const { token: accessToken, id, username, email, roles } = response.data;
                setToken(accessToken);
                setUser({ id, username, email, roles });
            } catch (error) {
                // If it fails, not logged in
                console.log("Not initially authenticated");
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = (data) => {
        setToken(data.token);
        setUser({
            id: data.id,
            username: data.username,
            email: data.email,
            roles: data.roles
        });
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, setToken, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
