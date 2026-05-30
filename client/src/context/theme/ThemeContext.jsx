import { createContext, useState } from "react"
export const themeContext = createContext();
const ThemeContext = (props) => {
    const [theme, setTheme] = useState("light")
    return (
        <themeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </themeContext.Provider>
    )
}
export default ThemeContext;