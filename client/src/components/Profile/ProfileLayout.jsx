import { useContext, useEffect, useRef, useState } from 'react'
import { authContext } from '../../context/auth/AuthContext';
import { Pencil } from 'lucide-react';
import { themeContext } from '../../context/theme/ThemeContext';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const ProfileLayout = () => {
    const location = useLocation()
    const { user, setUser } = useContext(authContext);
    const adminoption = [
        { name: "Change Name", to: "/profile/changename", no: 1 },
        { name: "Change Theme", to: "/profile/changetheme", no: 2 },
        { name: "Show Scheduled Post", to: "/profile/scheduledpost", no: 3 },
        { name: "Show Upcomming Post", to: "/profile/upcomminigpost", no: 4 }
    ]
    const navigate = useNavigate()
    const [selectedOption, setSelectedOption] = useState("");
    const { theme } = useContext(themeContext);
    const username = user?.name || user?.user?.name || "";
    const logo = username.charAt(0) + username.split(" ")[1].charAt(0)
    const [showEditProfileImage, setShowEditProfileImage] = useState(false)
    const handleProfileUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("media", file);

        const toastId = toast.loading("Uploading profile...");

        try {
            const response = await api.post(
                "/api/auth/changeprofile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.dismiss(toastId);
            toast.success(response.data.message);

            // Update Context
            // assuming backend returns updated user
            setUser(response.data.user);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );
        } catch (error) {
            toast.dismiss(toastId);

            toast.error(
                error.response?.data?.message ||
                "Failed to upload profile."
            );
        }
    };

    return (
        <div className="flex flex-col justify-start items-center w-full h-full">
            <div className="w-full flex flex-col items-center justify-center">
                <div
                    onMouseEnter={() => setShowEditProfileImage(true)}
                    onMouseLeave={() => setShowEditProfileImage(false)}
                    className="w-36 h-36 bg-[#FB2C36] rounded-full flex justify-center items-center text-white text-6xl relative overflow-hidden"
                >

                    {(user?.avatar || user?.user?.avatar) ? (
                        <img
                            src={user?.avatar || user?.user?.avatar}
                            className="w-full h-full object-cover"
                            alt="profile"
                        />
                    ) : (
                        logo
                    )}

                    <label
                        htmlFor="profile"
                        className={`absolute bottom-3 z-60 right-3 bg-white text-black p-2 rounded-full cursor-pointer transition-all duration-300 ${showEditProfileImage
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                    >
                        <Pencil />
                    </label>

                    <input
                        hidden
                        id="profile"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileUpload}
                    />

                </div>
                <div className="option-pane flex justify-center items-center gap-3 mt-16 flex-wrap">
                    {adminoption.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setSelectedOption(option.no); navigate(option.to) }}
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