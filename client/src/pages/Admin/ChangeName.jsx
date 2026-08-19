import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../../context/auth/AuthContext';
import { themeContext } from '../../context/theme/ThemeContext';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const ChangeName = () => {
    const { user, setUser } = useContext(authContext)
    const { theme } = useContext(themeContext)
    const [name, setName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    
    const handleChangeName = async (e) => {
        e.preventDefault();
        const Toasts = toast.loading("Changing...")
        try {
            const response = await api.post("/api/auth/changeusername", {
                uname: name,
            });

            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setName(response.data.user.name);
            setIsEditing(false);
            setNameSave(true);
            toast.dismiss(Toasts)
            toast.success(response.data.message)
        } catch (error) {
            toast.dismiss(Toasts)
            toast.error(error.message || "Something Went Wrong.")
        } finally {
            toast.dismiss(Toasts)
        }
    }
    const [nameSave, setNameSave] = useState(true)

    useEffect(() => {
        if (user?.name || user?.user?.name) {
            setName(user.name || user.user.name);
        }
    }, [user]);

    return (
        <form className="w-full flex justify-start items-start gap-3 flex-col" onSubmit={handleChangeName}>
            <h1 className={`text-3xl ${theme === "dark" ? "text-white" : "text-black"}`}>Change Name</h1>
            <input
                type="text"
                value={name}
                className={`border rounded-lg mt-5 p-[8px_15px] ${theme === "dark"
                    ? "border-[#ffffffae] text-white text-2xl"
                    : ""
                    }`}
                onFocus={() => {
                    if (!isEditing) {
                        setName("");
                        setIsEditing(true);
                    }
                }}
                onChange={(e) => {
                    setName(e.target.value);
                    setNameSave(e.target.value === user.name);
                }}
            />
            <button type="submit" className="bg-[#FB2C36] text-white p-[8px_15px] text-2xl rounded-lg disabled:bg-[#9e2127] disabled:cursor-default" disabled={nameSave}>Save</button>
        </form>
    )
}

export default ChangeName