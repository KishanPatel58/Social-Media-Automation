import { useContext, useEffect, useRef, useState } from 'react'
import { authContext } from '../../context/auth/AuthContext';
import { Pencil } from 'lucide-react';
import { themeContext } from '../../context/theme/ThemeContext';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const ProfileLayout = () => {
    const location = useLocation()

    const adminoption = [
        { name: "Change Name", to: "/profile/changename", no: 1 },
        { name: "Change Theme", to: "/profile/changetheme", no: 2 },
        { name: "Show Scheduled Post", to: "/profile/scheduledpost", no: 3 },
        { name: "Show Upcomming Post", to: "/profile/upcomminigpost", no: 4 }
    ]
    const navigate = useNavigate()
    const [selectedOption, setSelectedOption] = useState("");
    const { user } = useContext(authContext);
    const { theme } = useContext(themeContext);
    const username = user.user.name;
    const logo = username.charAt(0) + username.split(" ")[1].charAt(0)
    const [showEditProfileImage, setShowEditProfileImage] = useState(false)

    return (
        <div className="flex flex-col justify-start items-center w-full h-full">
            <div className="w-full flex flex-col items-center justify-center">
                <div className="profile-and-name flex justify-center items-center w-full flex-col gap-2">
                    <div onMouseEnter={() => setShowEditProfileImage(true)} onMouseLeave={() => setShowEditProfileImage(false)} className="w-36 h-36 bg-[#FB2C36] text-white text-6xl rounded-full flex items-center justify-center relative cursor-pointer">
                        {logo}
                        {/* pencil icon for update */}
                        <label htmlFor="profile" className={`cursor-pointer absolute bottom-4 p-2 right-0 bg-white text-black rounded-full ${showEditProfileImage ? "opacity-100" : "opacity-0"} transition-all duration-200`}><Pencil /></label>
                        <input type="file" className="hidden" id="profile" />
                    </div>
                    <h1 className={`text-3xl ${theme === "dark" ? "text-white" : "text-black"}`}>{username}</h1>
                </div>
                <div className="option-pane flex justify-center items-center gap-3 mt-16 flex-wrap">
                    {adminoption.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() =>{setSelectedOption(option.no);navigate(option.to)}}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${location.pathname === option.to
                                    ? "bg-[#FB2C36] text-white"
                                    : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-20 w-full">
                <Outlet />
            </div>
        </div>
    )
}

export default ProfileLayout