import React, { useContext, useEffect, useState } from 'react'
import { themeContext } from '../../context/theme/ThemeContext';

const ChangeTheme = () => {
    const { theme, setTheme } = useContext(themeContext);
    const [selectTheme, setSelectTheme] = useState("")
    useEffect(() => {
        if (!selectTheme) {
            setSelectTheme(theme)
        }
    }, [])
    return (
        <div className="w-full justify-start items-start flex flex-col">
            <h1 className={`text-3xl ${theme==="dark"?"text-white":"text-black"}`}>Change Theme</h1>
            <div className="flex items-center justify-start gap-3 mt-10">
                <span className={`${theme==="dark"?"text-white":"text-black"}`}>Dark</span>
                <label htmlFor="Dark" className={`relative w-20 h-7 rounded-3xl ${theme==="dark"?"bg-white":"bg-[#FB2C36]"}`}>
                    <input
                        type="checkbox"
                        onKeyDown={() => setSelectTheme("")}
                        onChange={(e) => setTheme("dark")}
                        id="Dark" 
                        checked={theme==="dark"}
                        className="hidden"
                        />
                    <div className={`w-5 h-5 absolute top-1/2 -translate-1/2 translate-x-2 rounded-full ${theme==="dark"?"bg-[#FB2C36] translate-x-13":"bg-white"} transition-all duration-300`}></div>
                </label>
            </div>
            <div className="flex items-center justify-start gap-3 mt-10">
                <span className={`${theme==="dark"?"text-white":"text-black"}`}>Light</span>
                <label htmlFor="Light" className={`relative w-20 h-7 rounded-3xl ${theme==="light"?"bg-[#FB2C36]":"bg-white"}`}>
                    <input
                        type="checkbox"
                        onKeyDown={() => setSelectTheme("")}
                        onChange={(e) => setTheme("light")}
                        id="Light" 
                        checked={theme==="light"}
                        className="hidden"
                        />
                    <div className={`w-5 h-5 absolute top-1/2 -translate-1/2 rounded-full ${theme==="dark"?"bg-[#FB2C36] translate-x-2":"translate-x-13 bg-white"} transition-all duration-300`}></div>
                </label>
            </div>
        </div>
    )
}

export default ChangeTheme