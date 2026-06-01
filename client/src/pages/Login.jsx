import {
    useContext,
    useState,
    useMemo
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    Loader2Icon,
    LockIcon,
    MailIcon,
    Moon,
    Sun,
    User2Icon,
} from "lucide-react";

import { themeContext } from "../context/theme/ThemeContext";

export default function Auth() {

    const { theme, setTheme } =
        useContext(themeContext);

    const [loginState, setLoginState] =
        useState(true);

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const navigate = useNavigate();

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            setLoading(true);

            setTimeout(() => {

                setLoading(false);

                navigate("/dashboard");

            }, 1500);
        };

    const themeHandle = () => {

        const newTheme =
            theme === "light"
                ? "dark"
                : "light";

        setTheme(newTheme);

        localStorage.setItem(
            "theme",
            newTheme
        );
    };
    const stars = useMemo(() => {

        return [...Array(60)].map((_, i) => ({

            id: i,

            width:
                Math.random() * 4 + 1,

            height:
                Math.random() * 4 + 1,

            top:
                Math.random() * 100,

            left:
                Math.random() * 100,

            opacity:
                Math.random(),

            duration:
                Math.random() * 4 + 2,
        }));

    }, []);
    return (

        <div
            className={`
                relative

                min-h-screen

                overflow-hidden

                flex items-center
                justify-center

                px-4
                py-10

                transition-all duration-500

                ${theme === "light"

                    ? "bg-slate-100"

                    : "bg-[#030303]"
                }
            `}
        >

            {/* BACKGROUND GLOW */}

            <div
                className="
                    absolute
                    inset-0
                    overflow-hidden
                    pointer-events-none
                "
            >

                <div
                    className="
                        absolute
                        top-0
                        left-1/2
                        -translate-x-1/2

                        w-[650px]
                        h-[650px]

                        rounded-full

                        bg-red-500/10

                        blur-3xl
                    "
                />

                {
                    theme === "dark" && (
                        <>
                            {
                                stars.map((star) => (
                                    <div
                                        key={star.id}
                                        className="
                            absolute
                            rounded-full
                            bg-white
                            animate-pulse
                        "
                                        style={{

                                            width:
                                                star.width + "px",

                                            height:
                                                star.height + "px",

                                            top:
                                                star.top + "%",

                                            left:
                                                star.left + "%",

                                            opacity:
                                                star.opacity,

                                            animationDuration:
                                                `${star.duration}s`,
                                        }}
                                    />
                                ))
                            }
                        </>
                    )
                }
            </div>

            {/* THEME BUTTON */}

            <button
                onClick={themeHandle}
                className={`
                    absolute
                    top-5
                    right-5

                    z-50

                    p-3

                    rounded-full

                    border

                    transition-all duration-300

                    ${theme === "light"

                        ? "bg-white border-slate-200 text-black hover:bg-slate-100"

                        : "bg-[#111111] border-[#ffffff10] text-white hover:bg-[#1a1a1a]"
                    }
                `}
            >

                {
                    theme === "light"

                        ? (
                            <Moon
                                className="size-5"
                            />
                        )

                        : (
                            <Sun
                                className="size-5"
                            />
                        )
                }
            </button>

            {/* CARD */}

            <div
                className="
                    relative
                    z-10

                    w-full
                    max-w-md
                "
            >



                {/* MAIN BOX */}

                <div
                    className={`
                        rounded-3xl

                        border

                        backdrop-blur-xl

                        p-8

                        shadow-2xl

                        transition-all duration-500

                        ${theme === "light"

                            ? "bg-white border-slate-200 shadow-slate-200/40"

                            : "bg-[#111111]/95 border-[#ffffff10] shadow-black/40"
                        }
                    `}
                >

                    {/* LOGO */}

                    <div
                        className="
                            flex flex-col
                            items-center

                            mb-8
                        "
                    >

                        <Link
                            to="/"
                            className="
                                flex items-center
                                gap-2
                            "
                        >

                            <img
                                src="/logo.svg"
                                alt="logo"
                                className="size-7"
                            />

                            <h1
                                className={`
                                    text-3xl

                                    ${theme === "light"
                                        ? "text-slate-900"
                                        : "text-white"
                                    }
                                `}
                            >
                                Scheduler
                            </h1>
                        </Link>

                        <p
                            className={`
                                text-sm
                                mt-2

                                ${theme === "light"
                                    ? "text-slate-500"
                                    : "text-slate-400"
                                }
                            `}
                        >
                            {
                                loginState

                                    ? "Sign in to your account"

                                    : "Create your new account"
                            }
                        </p>
                    </div>

                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* NAME */}

                        {
                            !loginState && (

                                <div>

                                    <label
                                        className={`
                                            block
                                            mb-2
                                            text-sm

                                            ${theme === "light"
                                                ? "text-slate-700"
                                                : "text-slate-300"
                                            }
                                        `}
                                    >
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <User2Icon
                                            className={`
                                                absolute
                                                left-4
                                                top-1/2
                                                -translate-y-1/2

                                                size-4

                                                ${theme === "light"
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                                }
                                            `}
                                        />

                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(
                                                    e.target.value
                                                )
                                            }
                                            className={`
                                                w-full

                                                pl-11
                                                pr-4
                                                py-3

                                                rounded-full

                                                border

                                                outline-none

                                                transition-all duration-300

                                                ${theme === "light"

                                                    ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300"

                                                    : "bg-[#1a1a1a] border-[#ffffff10] text-white placeholder-slate-500 focus:border-[#ffffff20]"
                                                }
                                            `}
                                        />
                                    </div>
                                </div>
                            )
                        }

                        {/* EMAIL */}

                        <div>

                            <label
                                className={`
                                    block
                                    mb-2
                                    text-sm

                                    ${theme === "light"
                                        ? "text-slate-700"
                                        : "text-slate-300"
                                    }
                                `}
                            >
                                Email Address
                            </label>

                            <div className="relative">

                                <MailIcon
                                    className={`
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2

                                        size-4

                                        ${theme === "light"
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                        }
                                    `}
                                />

                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    className={`
                                        w-full

                                        pl-11
                                        pr-4
                                        py-3

                                        rounded-full

                                        border

                                        outline-none

                                        transition-all duration-300

                                        ${theme === "light"

                                            ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300"

                                            : "bg-[#1a1a1a] border-[#ffffff10] text-white placeholder-slate-500 focus:border-[#ffffff20]"
                                        }
                                    `}
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}

                        <div>

                            <label
                                className={`
                                    block
                                    mb-2
                                    text-sm

                                    ${theme === "light"
                                        ? "text-slate-700"
                                        : "text-slate-300"
                                    }
                                `}
                            >
                                Password
                            </label>

                            <div className="relative">

                                <LockIcon
                                    className={`
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2

                                        size-4

                                        ${theme === "light"
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                        }
                                    `}
                                />

                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    className={`
                                        w-full

                                        pl-11
                                        pr-4
                                        py-3

                                        rounded-full

                                        border

                                        outline-none

                                        transition-all duration-300

                                        ${theme === "light"

                                            ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300"

                                            : "bg-[#1a1a1a] border-[#ffffff10] text-white placeholder-slate-500 focus:border-[#ffffff20]"
                                        }
                                    `}
                                />
                            </div>
                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full

                                py-3

                                rounded-full

                                bg-gradient-to-r
                                from-red-600
                                to-red-500

                                hover:from-red-500
                                hover:to-red-400

                                text-white

                                transition-all duration-300

                                flex items-center
                                justify-center
                                gap-2

                                disabled:opacity-60
                            "
                        >

                            {
                                loading

                                    ? (
                                        <>
                                            <Loader2Icon
                                                className="
                                                    size-4
                                                    animate-spin
                                                "
                                            />

                                            Processing...
                                        </>
                                    )

                                    : (
                                        <>
                                            {
                                                loginState
                                                    ? "Sign In"
                                                    : "Create Account"
                                            }

                                            <ArrowRightIcon
                                                className="size-4"
                                            />
                                        </>
                                    )
                            }
                        </button>
                    </form>

                    {/* SWITCH */}

                    <div
                        className={`
                            mt-6
                            text-center
                            text-sm

                            ${theme === "light"
                                ? "text-slate-500"
                                : "text-slate-400"
                            }
                        `}
                    >

                        {
                            loginState

                                ? (
                                    <>
                                        Don’t have an account?{" "}

                                        <button
                                            onClick={() =>
                                                setLoginState(
                                                    false
                                                )
                                            }
                                            className="
                                                text-red-500
                                                hover:text-red-400
                                            "
                                        >
                                            Create one
                                        </button>
                                    </>
                                )

                                : (
                                    <>
                                        Already have an account?{" "}

                                        <button
                                            onClick={() =>
                                                setLoginState(
                                                    true
                                                )
                                            }
                                            className="
                                                text-red-500
                                                hover:text-red-400
                                            "
                                        >
                                            Sign In
                                        </button>
                                    </>
                                )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}