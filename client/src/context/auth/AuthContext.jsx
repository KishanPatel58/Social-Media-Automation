import { createContext, useContext, useEffect, useState } from 'react'
import api from '../../api/axios';
export const authContext = createContext();
const AuthContext = (props) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
        setIsLoading(false)
    }, [])

    // Login Function
    const login = (userData,newToken) => {
        setUser(userData);
        setToken(newToken);
        localStorage.setItem("user",JSON.stringify(userData));
        localStorage.setItem("token",newToken)
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }

    // Logout Function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
    }
    return (
        <authContext.Provider value={{ user, token, isLoading, login, logout, isAuthenticated: !!token, setUser }}>
            {props.children}
        </authContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(authContext);
    if(context === undefined){
        throw new Error("useAuth must be used within an Authprovider.")
    }
    return context;
}

export default AuthContext