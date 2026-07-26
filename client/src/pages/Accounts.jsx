import React, {
    useContext,
    useEffect,
    useState,
} from "react";

import {
    PLATFORMS
} from "../assets/assets";

import { PlusIcon } from "lucide-react";

import AccountList from "../components/AccountList";

import PlatformPickerModel from "../components/PlatformPickerModel";

import { themeContext } from "../context/theme/ThemeContext";
import { toast } from "react-hot-toast";
import api from "../api/axios";


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
        isSync = true,
        platform,
        successMessage
    ) => {
        try {
            if (isSync) {
                const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Media";
                toast.loading(`Syncing ${label} account...`, { id: "sync" });
                await api.get("/api/oauth/sync")
                toast.success(successMessage || "Account synced!", { id: "sync" });
            }
            const { data } = await api.get("/api/accounts");
            setAccounts(data)
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to Load accounts.")
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const connectedPlatform = params.get("connected");
        const connectedUsername = params.get("username");
        const syncNeeded = params.get("sync") === "true";
        const errorMsg = params.get("error");

        window.history.replaceState({}, document.title, window.location.pathname);
        if (connectedPlatform) {
            const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1);
            const handle = connectedUsername ? ` (@${connectedUsername})` : "";
            fetchAccounts(true, connectedPlatform, `${label}${handle} connected`);
        }
        else if (errorMsg) {
            toast.error(`Connection failed: ${decodeURIComponent(errorMsg)}`);
            fetchAccounts()
        }
        else if (syncNeeded) {
            fetchAccounts(true, null, "Account Synced!")
        }
        else {
            fetchAccounts();
        }

    }, []);

    const handleConnect = async (
        platformId
    ) => {

        setConnecting(platformId);
        try {
            const { data } = await api.get(`/api/oauth/${platformId}/url`);
            window.location.href = data.url;
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || `Failed to connect: ${platformId}`);
            setConnecting(null)
        }
    };

    const handleDisconnect = async (accountId) => {
        try {
            await api.delete(`/api/accounts/${accountId}`);
            toast.success("Account Disconnected!");
            await fetchAccounts()
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Failed To Disconnect Account.")
        }
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

                            ${theme === "light"
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

                            ${theme === "light"
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