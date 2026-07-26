import {
    ActivityIcon,
    CircleCheckIcon,
    ClockIcon,
    SendIcon,
    Share2Icon,
    TrendingUpIcon,
} from "lucide-react";

import {
    useContext,
    useEffect,
    useState,
} from "react";

import { themeContext } from "../context/theme/ThemeContext";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const { theme } =
        useContext(themeContext);
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        scheduled: 0,
        published: 0,
        connectedAccounts: 0,
    });

    const [activities, setActivities] =
        useState([]);
    useEffect(()=>{
        if(!localStorage.getItem("user")){
            navigate("/login")
        }
    },[])
    useEffect(() => {

        const fetchDashboardData =
            async () => {

                try {

                    const [
                        postsRes,
                        accountsRes,
                        activityRes,
                    ] = await Promise.all([api.get("/api/posts"),api.get("/api/accounts"),api.get("/api/activity")])

                    const posts = postsRes.data;

                    setStats({
                        scheduled:
                            posts.filter(
                                (p) =>
                                    p.status ===
                                    "scheduled"
                            ).length,

                        published:
                            posts.filter(
                                (p) =>
                                    p.status ===
                                    "published"
                            ).length,

                        connectedAccounts:
                            accountsRes.data.filter(
                                (a) =>
                                    a.status ===
                                    "connected"
                            ).length,
                    });

                    setActivities(
                        activityRes.data
                    );

                } catch (error) {

                    toast.error(
                        `Error fetching dashboard data: ${error}`
                    );
                }
            };

        fetchDashboardData();

    }, []);

    const statCards = [
        {
            label: "Scheduled Posts",
            value: stats.scheduled,
            icon: ClockIcon,
            trend: "+2 today",
        },
        {
            label: "Published Posts",
            value: stats.published,
            icon: CircleCheckIcon,
            trend: "All time",
        },
        {
            label: "Connected Accounts",
            value: stats.connectedAccounts,
            icon: Share2Icon,
            trend: "Active",
        },
    ];

    return (

        <div className="space-y-8">

            {/* WELCOME */}

            <div>

                <h2
                    className={`
                        text-2xl

                        ${theme === "light"
                            ? "text-slate-900"
                            : "text-white"
                        }
                    `}
                >
                    Good Morning! 👋
                </h2>

                <p
                    className={`
                        text-sm
                        mt-0.5

                        ${theme === "light"
                            ? "text-slate-500"
                            : "text-slate-400"
                        }
                    `}
                >
                    Here's what's happening with your social accounts today.
                </p>
            </div>

            {/* STATS */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-5
                "
            >

                {
                    statCards.map((card, idx) => {

                        return (

                            <div
                                key={idx}
                                className={`
                                    relative

                                    border
                                    rounded-2xl

                                    p-5

                                    transition-all duration-300

                                    ${theme === "light"

                                        ? "bg-white border-slate-200 hover:bg-red-50 hover:border-red-200"

                                        : "bg-[#111111] border-[#ffffff10] hover:border-red-500/30 hover:bg-[#171717]"
                                    }
                                `}
                            >

                                <div
                                    className="
                                        flex items-center
                                        justify-between
                                        mb-4
                                    "
                                >

                                    <div
                                        className={`
                                            text-3xl
                                            font-medium
                                            tabular-nums

                                            ${theme === "light"
                                                ? "text-slate-800"
                                                : "text-white"
                                            }
                                        `}
                                    >
                                        {card.value}
                                    </div>

                                    <div
                                        className="
                                            text-xs
                                            absolute
                                            right-4 top-4

                                            text-red-500

                                            flex items-center gap-1
                                        "
                                    >

                                        <TrendingUpIcon
                                            className="size-3"
                                        />

                                        {card.trend}
                                    </div>
                                </div>

                                <p
                                    className={`
                                        text-sm
                                        mt-1

                                        ${theme === "light"
                                            ? "text-slate-500"
                                            : "text-slate-400"
                                        }
                                    `}
                                >
                                    {card.label}
                                </p>
                            </div>
                        );
                    })
                }
            </div>

            {/* ACTIVITY */}

            <div
                className={`
                    rounded-2xl
                    border
                    overflow-hidden

                    ${theme === "light"

                        ? "bg-white border-slate-200"

                        : "bg-[#111111] border-[#ffffff10]"
                    }
                `}
            >

                {/* HEADER */}

                <div
                    className={`
                        flex items-center
                        justify-between

                        px-6 py-4

                        border-b

                        ${theme === "light"
                            ? "border-slate-100"
                            : "border-[#ffffff10]"
                        }
                    `}
                >

                    <h2
                        className={`
                            ${theme === "light"
                                ? "text-slate-900"
                                : "text-white"
                            }
                        `}
                    >
                        Recent Activity
                    </h2>

                    <span
                        className={`
                            text-sm

                            ${theme === "light"
                                ? "text-slate-400"
                                : "text-slate-500"
                            }
                        `}
                    >
                        {activities.length} events
                    </span>
                </div>

                {/* EMPTY */}

                {
                    activities.length === 0 ? (

                        <div
                            className="
                                flex flex-col
                                items-center justify-center

                                py-16 px-6
                            "
                        >

                            <div
                                className={`
                                    size-12
                                    rounded-xl

                                    flex items-center justify-center

                                    mb-3

                                    ${theme === "light"
                                        ? "bg-slate-100"
                                        : "bg-[#1a1a1a]"
                                    }
                                `}
                            >

                                <ActivityIcon
                                    className={`
                                        size-6

                                        ${theme === "light"
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                        }
                                    `}
                                />
                            </div>

                            <p
                                className={`
                                    ${theme === "light"
                                        ? "text-slate-500"
                                        : "text-slate-400"
                                    }
                                `}
                            >
                                No activity yet
                            </p>

                            <p
                                className={`
                                    text-sm
                                    mt-1

                                    ${theme === "light"
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    }
                                `}
                            >
                                Connect accounts and schedule posts to see events here.
                            </p>
                        </div>

                    ) : (

                        <div
                            className={`
                                divide-y

                                ${theme === "light"
                                    ? "divide-slate-50"
                                    : "divide-[#ffffff08]"
                                }
                            `}
                        >

                            {
                                activities.map(
                                    (activity) => {

                                        return (

                                            <div
                                                key={activity._id}
                                                className={`
                                                    flex items-start gap-4

                                                    px-6 py-4

                                                    transition-colors

                                                    ${theme === "light"

                                                        ? "hover:bg-slate-50/50"

                                                        : "hover:bg-[#171717]"
                                                    }
                                                `}
                                            >

                                                <div
                                                    className={`
                                                        size-9
                                                        rounded-xl

                                                        flex items-center justify-center

                                                        shrink-0
                                                        mt-0.5

                                                        ${theme === "light"

                                                            ? "bg-zinc-100 text-zinc-600"

                                                            : "bg-[#1a1a1a] text-zinc-400"
                                                        }
                                                    `}
                                                >

                                                    <SendIcon
                                                        className="size-4"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">

                                                    <div
                                                        className="
                                                            flex items-center
                                                            justify-between
                                                            gap-2
                                                            mb-1
                                                        "
                                                    >

                                                        <span
                                                            className={`
                                                                text-xs

                                                                px-2 py-0.5

                                                                rounded-full

                                                                ${theme === "light"

                                                                    ? "bg-zinc-100 text-zinc-600"

                                                                    : "bg-[#1a1a1a] text-zinc-300"
                                                                }
                                                            `}
                                                        >
                                                            Published
                                                        </span>

                                                        <span
                                                            className={`
                                                                text-xs
                                                                shrink-0

                                                                ${theme === "light"
                                                                    ? "text-slate-400"
                                                                    : "text-slate-500"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                new Date(
                                                                    activity.createdAt
                                                                ).toLocaleString()
                                                            }
                                                        </span>
                                                    </div>

                                                    <p className={`text-sm ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Dashboard;