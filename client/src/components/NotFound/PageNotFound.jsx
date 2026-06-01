import { useContext } from "react";
import { themeContext } from "../../context/theme/ThemeContext";
import { useNavigate } from "react-router-dom";
import { SquareArrowRight } from "lucide-react";

function PageNotFound() {

    const { theme } =
        useContext(themeContext);

    const navigate = useNavigate();

    return (

        <div
            className={`
                relative
                w-full
                h-screen
                overflow-hidden

                flex items-center justify-center

                ${theme === "light"
                    ? "bg-slate-200"
                    : "bg-[#010101]"
                }
            `}
        >

            {/* STARS */}



            <div className="absolute inset-0 z-0">

                {
                    [...Array(120)].map((_, i) => (

                        <span
                            key={i}
                            className={` absolute rounded-full ${theme === "light" ? "bg-black" : "bg-white"} animate-pulse`}
                            style={{
                                width: `${Math.random() * 3 + 2}px`,
                                height: `${Math.random() * 3 + 2}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random(),
                                animationDuration: `${Math.random() * 3 + 2}s`,
                            }}
                        />
                    ))
                }
            </div>


            {/* MAIN CONTENT */}

            <div
                className="
                    relative
                    z-10

                    flex items-center justify-center
                    flex-col
                    gap-2
                "
            >

                <img
                    src="/light-moon.png"
                    alt="moon image"
                    className="
                        object-cover
                        w-[80%]
                        md:w-[80vh]
                    "
                />

                <h1
                    style={
                        theme === "light"

                            ? {
                                WebkitTextStroke:
                                    "3px black",

                                fontFamily:
                                    "sans-serif",
                            }

                            : {
                                WebkitTextStroke:
                                    "2px white",

                                fontFamily:
                                    "sans-serif",
                            }
                    }
                    className={`
                        text-6xl
                        md:text-8xl
                        ${theme === "light"
                            ? "text-white"
                            : "text-black"
                        }
                    `}
                >
                    404
                </h1>

                <h1
                    style={{
                        fontFamily:
                            "'Outfit', sans-serif",
                    }}
                    className={`
                        text-[10vw]
                        text-center
                        sm:text-5xl
                        te
                        ${theme === "light"
                            ? "text-black"
                            : "text-white"
                        }
                    `}
                >
                    Page Not Found
                </h1>

                <button
                    onClick={() => navigate("/")}
                    className={`
                        border

                        flex items-center justify-center
                        gap-2

                        p-[8px_15px]
                        mt-3

                        rounded-lg

                        transition-all duration-300

                        ${theme === "light"

                            ? "bg-black text-white border-black"

                            : "bg-white text-black border-white hover:bg-slate-200"
                        }
                    `}
                >

                    Go to Home

                    <SquareArrowRight />

                </button>
            </div>
        </div>
    );
}

export default PageNotFound;