import {useContext} from 'react'
import { useLocation } from 'react-router-dom';
import { themeContext } from '../context/theme/ThemeContext';
import { Wrench } from 'lucide-react';

const ServiceNotAvailable = () => {
    const {theme} = useContext(themeContext);
    const pagetitle = {
        "/dashboard": "Dashboard",
        "/accounts": "Social Accounts",
        "/schedule": "Post Scheduler",
        "/ai-composer": "AI Composer",
    };
    const location = useLocation();
    const title =
        pagetitle[location.pathname]
        || "Social AI";
    return (
        <div className={`flex flex-col gap-5 items-center justify-center h-full ${theme==="light"?"bg-white text-black":"bg-[#0a0a0a] text-white"}`}>
            <h1 className="text-6xl font-bold">
                {title}
            </h1>
            <div className="!p-9 border-3 border-[#FB2C36] rounded-full">
                <Wrench  strokeWidth="1px" className="size-20 text-[#FB2C36]" />
            </div>
            <p className={`text-3xl ${theme==="light"?"text-black":"text-white"}`}>
                This feature is under Development.
            </p>
        </div>
    );
}

export default ServiceNotAvailable