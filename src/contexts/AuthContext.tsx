'use client';

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';
import { User, Login } from '../types';
import authService from '../services/auth.service';
import { authEvents } from '@/services/authEvents';
import api from '@/services/api'; // Axios instance

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: Login) => Promise<void>;
    logout: () => Promise<void>;
    reloadUser: () => Promise<void>;
    authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);

    // Load current user on app start
    const loadUser = useCallback(async () => {
        setAuthLoading(true);
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setIsAuthenticated(true);
        } catch {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
            setAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Logout function (single source of truth)
    const logout = useCallback(async () => {
        if (isLoggingOut) return; // guard against loops
        setIsLoggingOut(true);
        api.setLoggingOut(true); // tell Axios to ignore further 401s

        try {
            await authService.logout();
        } catch {
            // ignore API failures
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoggingOut(false);
            api.setLoggingOut(false); // re-enable 401 handling
        }
    }, [isLoggingOut]);

    // Listen to 401 events safely
    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
        };
        authEvents.on('unauthorized', handleUnauthorized);
        return () => {
            authEvents.off('unauthorized', handleUnauthorized);
        };
    }, [logout]);

    // Login
    const login = async (credentials: Login) => {
        setAuthLoading(true);
        try {
            await authService.login(credentials);
            await loadUser(); // 🔥 ensures cookie is now readable
        } finally {
            setAuthLoading(false);
        }
    };


    return (
        <AuthContext.Provider
            value={{ user, isLoading, isAuthenticated, login, logout, reloadUser: loadUser, authLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
