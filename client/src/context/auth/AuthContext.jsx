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
    

    return (
        <authContext.Provider value={{ user, isLoading, setUser, isAuthenticated }}>
            {props.children}
        </authContext.Provider>
    )
}

export default AuthContext