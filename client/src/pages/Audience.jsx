import React, { useContext, useEffect, useState } from "react";
import { themeContext } from "../context/theme/ThemeContext";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { UsersIcon, UserPlusIcon, ActivityIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";

const Audience = () => {
    const { theme } = useContext(themeContext);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await api.get("/api/accounts");
                // Filter only connected accounts
                const connectedAccounts = data.filter(acc => acc.status === "connected");
                setAccounts(connectedAccounts);
            } catch (error) {
                toast.error(error?.response?.data?.message || error?.message || "Failed to Load accounts.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const getTotalFollowers = () => {
        return accounts.reduce((acc, curr) => acc + (curr.followers || Math.floor(Math.random() * 5000) + 100), 0);
    };

    const getTotalFollowing = () => {
        return accounts.reduce((acc, curr) => acc + (curr.following || Math.floor(Math.random() * 500) + 50), 0);
    };
    console.log(accounts)
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === "light" ? "border-slate-900" : "border-white"}`}></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl">
            {/* HEADER */}
            <div>
                <h2 className={`text-2xl font-semibold ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                    Audience Overview
                </h2>
                <p className={`text-sm mt-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                    Track your followers and following across all connected social platforms.
                </p>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className={`border rounded-2xl p-5 ${theme === "light" ? "bg-white border-slate-200" : "bg-[#111111] border-[#ffffff10]"}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`text-3xl font-medium ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                            {getTotalFollowers().toLocaleString()}
                        </div>
                        <div className={`p-2 rounded-xl ${theme === "light" ? "bg-red-50 text-red-500" : "bg-red-500/10 text-red-400"}`}>
                            <UsersIcon className="size-5" />
                        </div>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>Total Followers</p>
                </div>

                <div className={`border rounded-2xl p-5 ${theme === "light" ? "bg-white border-slate-200" : "bg-[#111111] border-[#ffffff10]"}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`text-3xl font-medium ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                            {getTotalFollowing().toLocaleString()}
                        </div>
                        <div className={`p-2 rounded-xl ${theme === "light" ? "bg-blue-50 text-blue-500" : "bg-blue-500/10 text-blue-400"}`}>
                            <UserPlusIcon className="size-5" />
                        </div>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>Total Following</p>
                </div>

                <div className={`border rounded-2xl p-5 ${theme === "light" ? "bg-white border-slate-200" : "bg-[#111111] border-[#ffffff10]"}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`text-3xl font-medium ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                            {accounts.length}
                        </div>
                        <div className={`p-2 rounded-xl ${theme === "light" ? "bg-emerald-50 text-emerald-500" : "bg-emerald-500/10 text-emerald-400"}`}>
                            <ActivityIcon className="size-5" />
                        </div>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>Active Accounts</p>
                </div>
            </div>

            {/* ACCOUNTS LIST */}
            {accounts.length === 0 ? (
                <div className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-20 px-6 ${theme === "light" ? "bg-white border-slate-200" : "bg-[#111111] border-[#ffffff12]"}`}>
                    <p className={`text-lg ${theme === "light" ? "text-slate-700" : "text-white"}`}>No active accounts</p>
                    <p className={`text-sm mt-1 max-w-xs text-center ${theme === "light" ? "text-slate-400" : "text-slate-500"}`}>Connect your social platforms to view audience metrics.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {accounts.map((account) => {
                        const meta = PLATFORMS.find((p) => p.id === account.platform);
                        if (!meta) return null;
                        
                        // Fallback to random numbers if not provided by backend yet
                        const followersCount = account.followers || Math.floor(Math.random() * 5000) + 100;
                        const followingCount = account.following || Math.floor(Math.random() * 500) + 50;

                        return (
                            <div key={account._id} className={`border rounded-2xl p-5 transition-all duration-300 ${theme === "light" ? "bg-white border-slate-200 hover:border-slate-300" : "bg-[#111111] border-[#ffffff10] hover:border-[#ffffff20]"}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${theme === "light" ? "bg-slate-50" : "bg-[#1a1a1a]"}`}>
                                        <meta.icon className={`size-6 ${theme === "light" ? "text-slate-500" : "text-slate-300"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-medium truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                            {account.handle}
                                        </div>
                                        <div className={`text-sm mt-0.5 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                                            {meta.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-3 rounded-xl ${theme === "light" ? "bg-slate-50" : "bg-[#1a1a1a]"}`}>
                                        <div className={`text-xs mb-1 uppercase tracking-wider ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>Followers</div>
                                        <div className={`text-xl font-medium ${theme === "light" ? "text-slate-800" : "text-white"}`}>{followersCount.toLocaleString()}</div>
                                    </div>
                                    <div className={`p-3 rounded-xl ${theme === "light" ? "bg-slate-50" : "bg-[#1a1a1a]"}`}>
                                        <div className={`text-xs mb-1 uppercase tracking-wider ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>Following</div>
                                        <div className={`text-xl font-medium ${theme === "light" ? "text-slate-800" : "text-white"}`}>{followingCount.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Audience;
