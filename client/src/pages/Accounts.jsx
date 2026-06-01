import React, {
    useContext,
    useEffect,
    useState,
} from "react";

import {
    dummyAccountsData,
    PLATFORMS,
} from "../assets/assets";

import { PlusIcon } from "lucide-react";

import AccountList from "../components/AccountList";

import PlatformPickerModel from "../components/PlatformPickerModel";

import { themeContext } from "../context/theme/ThemeContext";

const Accounts = () => {

    const { theme } =
        useContext(themeContext);

    const [accounts, setAccounts] =
        useState([]);

    const [connecting, setConnecting] =
        useState(null);

    const [
        showPlatformPicker,
        setShowPlatformPicker,
    ] = useState(false);

    const fetchAccounts = async (
        isSync = false,
        platform,
        successMessage
    ) => {

        setAccounts(dummyAccountsData);

        console.log(
            isSync,
            platform,
            successMessage
        );
    };

    useEffect(() => {

        fetchAccounts();

    }, []);

    const handleConnect = async (
        platformId
    ) => {

        setConnecting(platformId);

        setTimeout(() => {

            setConnecting(null);

            setAccounts((prev) => [
                ...prev,
                dummyAccountsData[0],
            ]);

            setShowPlatformPicker(false);

        }, 1000);
    };

    const handleDisconnect =
        async (accountId) => {

            setAccounts(
                accounts.filter(
                    (account) =>
                        account._id !== accountId
                )
            );
        };

    const connectedIds =
        accounts.map(
            (account) => account.platform
        );

    return (

        <div
            className="
                space-y-8
                max-w-4xl
            "
        >

            {/* HEADER */}

            <div
                className="
                    flex flex-col
                    sm:flex-row

                    items-start sm:items-center
                    justify-between

                    gap-4
                "
            >

                <div>

                    <h2
                        className={`
                            text-xl

                            ${
                                theme === "light"
                                    ? "text-slate-900"
                                    : "text-white"
                            }
                        `}
                    >
                        Connected Accounts
                    </h2>

                    <p
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
                        {accounts.length} of{" "}
                        {PLATFORMS.length}
                    </p>
                </div>

                {/* CONNECT BUTTON */}

                <button
                    onClick={() =>
                        setShowPlatformPicker(true)
                    }
                    className="
                        flex items-center
                        gap-2

                        px-5 py-2.5

                        bg-red-500
                        hover:bg-red-600

                        text-white
                        font-medium

                        rounded-full

                        transition-all duration-300

                        w-full sm:w-auto
                        justify-center
                    "
                >

                    <PlusIcon className="size-4" />

                    <span>
                        Connect Account
                    </span>
                </button>
            </div>

            {/* PLATFORM PICKER */}

            {
                showPlatformPicker && (
                    <PlatformPickerModel
                        connectedIds={connectedIds}
                        connecting={connecting}
                        onClose={() =>
                            setShowPlatformPicker(false)
                        }
                        onConnect={handleConnect}
                    />
                )
            }

            {/* ACCOUNTS LIST */}

            <AccountList
                accounts={accounts}
                onDisconnect={
                    handleDisconnect
                }
            />
        </div>
    );
};

export default Accounts;