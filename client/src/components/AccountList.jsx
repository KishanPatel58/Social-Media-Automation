import {
    AlertCircleIcon,
    CheckCircleIcon,
    PlusIcon,
    UnplugIcon,
} from "lucide-react";

import { useContext } from "react";

import { PLATFORMS } from "../assets/assets";

import { themeContext } from "../context/theme/ThemeContext";

const AccountList = ({
    accounts = [],
    onDisconnect = () => {},
}) => {

    const { theme } =
        useContext(themeContext);

    const handleDisconnect =
        async (accountId) => {

            const confirm =
                window.confirm(
                    "Are you sure you want to disconnect this account ?"
                );

            if (!confirm) return;

            await onDisconnect(accountId);
        };

    /* EMPTY STATE */

    if (accounts.length === 0) {

        return (

            <div
                className={`
                    rounded-2xl

                    border-2 border-dashed

                    flex flex-col
                    items-center justify-center

                    py-20 px-6

                    transition-all duration-300

                    ${
                        theme === "light"

                            ? "bg-white border-slate-200"

                            : "bg-[#111111] border-[#ffffff12]"
                    }
                `}
            >

                <div
                    className={`
                        size-14
                        rounded-2xl

                        flex items-center justify-center

                        mb-4
                        border

                        ${
                            theme === "light"

                                ? "bg-slate-50 border-slate-100"

                                : "bg-[#1a1a1a] border-[#ffffff10]"
                        }
                    `}
                >

                    <PlusIcon
                        className={`
                            size-6
                            opacity-50

                            ${
                                theme === "light"
                                    ? "text-slate-500"
                                    : "text-slate-400"
                            }
                        `}
                    />
                </div>

                <p
                    className={`
                        text-lg

                        ${
                            theme === "light"
                                ? "text-slate-700"
                                : "text-white"
                        }
                    `}
                >
                    No accounts connected
                </p>

                <p
                    className={`
                        text-sm
                        mt-1

                        max-w-xs
                        text-center

                        ${
                            theme === "light"
                                ? "text-slate-400"
                                : "text-slate-500"
                        }
                    `}
                >
                    Connect your first social platform to start scheduling and automating your content.
                </p>
            </div>
        );
    }

    return (

        <div
            className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
            "
        >

            {
                accounts.map(
                    (account, idx) => {

                        const meta =
                            PLATFORMS.find(
                                (p) =>
                                    p.id ===
                                    account.platform
                            );

                        if (!meta)
                            return null;

                        return (

                            <div
                                key={idx}
                                className={`
                                    group

                                    border
                                    rounded-2xl

                                    p-5

                                    flex items-center
                                    gap-4

                                    transition-all duration-300

                                    ${
                                        theme === "light"

                                            ? "bg-white border-slate-200 hover:border-slate-300"

                                            : "bg-[#111111] border-[#ffffff10] hover:border-[#ffffff20]"
                                    }
                                `}
                            >

                                {/* PLATFORM ICON */}

                                <div
                                    className={`
                                        size-12
                                        rounded-xl

                                        flex items-center justify-center

                                        shrink-0

                                        ${
                                            theme === "light"

                                                ? "bg-slate-50"

                                                : "bg-[#1a1a1a]"
                                        }
                                    `}
                                >

                                    <meta.icon
                                        className={`
                                            size-6

                                            ${
                                                theme === "light"

                                                    ? "text-slate-500"

                                                    : "text-slate-300"
                                            }
                                        `}
                                    />
                                </div>

                                {/* ACCOUNT INFO */}

                                <div className="flex-1 min-w-0">

                                    <div
                                        className={`
                                            truncate

                                            ${
                                                theme === "light"

                                                    ? "text-slate-900"

                                                    : "text-white"
                                            }
                                        `}
                                    >
                                        {account.handle}
                                    </div>

                                    <div
                                        className={`
                                            text-sm
                                            mt-0.5

                                            ${
                                                theme === "light"

                                                    ? "text-slate-500"

                                                    : "text-slate-400"
                                            }
                                        `}
                                    >
                                        {meta.name}
                                    </div>
                                </div>

                                {/* STATUS */}

                                <div
                                    className="
                                        flex items-center
                                        gap-1.5
                                        shrink-0
                                    "
                                >

                                    {
                                        account.status ===
                                        "connected"

                                            ? (
                                                <>
                                                    <CheckCircleIcon
                                                        className="
                                                            size-4
                                                            text-emerald-500
                                                        "
                                                    />

                                                    <span
                                                        className="
                                                            text-xs
                                                            text-emerald-500
                                                        "
                                                    >
                                                        Connected
                                                    </span>
                                                </>
                                            )

                                            : (
                                                <>
                                                    <AlertCircleIcon
                                                        className="
                                                            size-4
                                                            text-amber-500
                                                        "
                                                    />

                                                    <span
                                                        className="
                                                            text-xs
                                                            text-amber-500
                                                        "
                                                    >
                                                        Disconnected
                                                    </span>
                                                </>
                                            )
                                    }
                                </div>

                                {/* DISCONNECT */}

                                <button
                                    onClick={() =>
                                        handleDisconnect(
                                            account._id
                                        )
                                    }
                                    title="Disconnect account"
                                    className={`
                                        ml-2
                                        p-1.5
                                        rounded-lg

                                        transition-all duration-300

                                        ${
                                            theme === "light"

                                                ? "text-slate-300 hover:text-red-500"

                                                : "text-slate-600 hover:text-red-400"
                                        }
                                    `}
                                >

                                    <UnplugIcon
                                        className="size-4"
                                    />
                                </button>
                            </div>
                        );
                    }
                )
            }
        </div>
    );
};

export default AccountList;