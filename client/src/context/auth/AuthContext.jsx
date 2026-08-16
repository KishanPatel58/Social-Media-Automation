import { createContext, useEffect, useState } from 'react'
export const authContext = createContext();
const AuthContext = (props) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parseduser = JSON.parse(storedUser);
            setIsAuthenticated(true)
            setUser(parseduser);
            setIsLoading(false);
        }
    }, []);
    const handleLogout = async () => {
        const loadings = toast.loading("Processing...")
        try {
            const response = await api.get("/api/auth/logout");
            setUser(null);
            localStorage.removeItem("user");
            toast.dismiss(loadings);
            toast.success(response.data.message, { icon: '🥳' });
            navigate("/login")
        } catch (error) {
            toast.dismiss(loadings)
            toast.error(error.message || "Problem to Logout")
        }
    }
    return (
        <authContext.Provider value={{ user, isLoading, setUser, isAuthenticated, handleLogout }}>
            {props.children}
        </authContext.Provider>
    )
}

export default AuthContext