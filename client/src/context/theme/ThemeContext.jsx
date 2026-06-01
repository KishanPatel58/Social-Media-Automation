import {
    createContext,
    useEffect,
    useState,
} from "react";

export const themeContext =
    createContext();

const ThemeContext = (props) => {

    const [theme, setTheme] = useState(() => {

        return (
            localStorage.getItem("theme")
            || "light"
        );

    });

    useEffect(() => {

        localStorage.setItem(
            "theme",
            theme
        );

    }, [theme]);

    return (

        <themeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >

            {props.children}

        </themeContext.Provider>
    );
};

export default ThemeContext;