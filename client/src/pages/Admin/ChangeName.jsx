import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../../context/auth/AuthContext';
import { themeContext } from '../../context/theme/ThemeContext';

const ChangeName = () => {
    const { user } = useContext(authContext)
    const { theme } = useContext(themeContext)
    const [name, setName] = useState("")
    const handleChangeName = async (e) => {
        e.preventDefault();
    }
    const [nameSave, setNameSave] = useState(true)
    useEffect(() => {
        if (!name) {
            setName(user.user.name);
            setNameSave(true)
        }
    }, [user]);
    return (
        <form className="w-full flex justify-start items-start gap-3 flex-col" onSubmit={handleChangeName}>
            <h1 className={`text-3xl ${theme==="dark"?"text-white":"text-black"}`}>Change Name</h1>
            <input onKeyDown={(e) => {
                if (e.code === "Backspace") {
                    setName("")
                }
            }}
                type="text" className={`border rounded-lg mt-5 p-[8px_15px] ${theme === "dark" ? "border-[#ffffffae] text-white text-2xl" : ""}`} value={name} onChange={(e) => {setName(e.target.value);setNameSave(false)}} />
            <button type="submit" className="bg-[#FB2C36] text-white p-[8px_15px] text-2xl rounded-lg disabled:bg-[#9e2127] disabled:cursor-default" disabled={nameSave}>Save</button>
        </form>
    )
}

export default ChangeName