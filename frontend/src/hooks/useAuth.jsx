// frontend/hooks/useAuth.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { 
    registerApi, 
    loginApi, 
    logoutApi, 
    getProfileApi, 
    updateProfileApi 
} from "../service/api"; 

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fungsi untuk memuat data user/profil
    const loadUser = useCallback(async () => {
        try {
            const response = await getProfileApi(); 
            if (response.status === 200) {
                const userData = response.data.data;
                delete userData.Password; 
                setUser(userData);
            }
        } catch (error) {
            console.log("No active session found or profile fetch failed.", error);
            setUser(null); 
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load user/session saat pertama kali dimuat
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Function untuk register user baru
    const registerUser = async (userData) => {
        try {
            const response = await registerApi(userData);

            if (response.status === 201) {
                return { success: true, message: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Registration failed!";
            return { success: false, message: errorMessage };
        }
    };

    // Function untuk login
    const login = async (credentials) => {
        try {
            // Panggil API login
            const response = await loginApi(credentials);

            if (response.status === 200) {
                const userData = response.data.user;
                delete userData.Password; 
                setUser(userData); 
                return { success: true, message: response.data.message, user: userData };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.Message || "Invalid credentials!";
            return { success: false, message: errorMessage };
        }
    };

    // Function untuk logout
    const logout = async () => {
        try {
            await logoutApi(); 
            setUser(null);
            navigate('/'); 
        } catch (error) {
            setUser(null); 
            navigate('/');
        }
    };

    // Function untuk update profile
    const updateProfile = async (profileData) => {
        try {
            const response = await updateProfileApi(profileData);

            if (response.status === 200) {
                const updatedUser = response.data.data;
                delete updatedUser.Password;
                setUser(updatedUser);
                return { success: true, message: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Profile update failed!";
            return { success: false, message: errorMessage };
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        registerUser,
        login,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};