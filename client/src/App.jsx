import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Scheduler from "./pages/Scheduler";
import AIComposer from "./pages/AIComposer";
import PageNotFound from "./components/NotFound/PageNotFound";
import { Toaster } from "react-hot-toast"
import UpcomingPost from "./pages/UpcomingPost";
import PublishedPost from "./pages/PublishedPost";
import ProfileLayout from "./components/Profile/ProfileLayout";
import ChangeName from "./pages/Admin/ChangeName";
import ChangeTheme from "./pages/Admin/ChangeTheme";

export default function App() {

    return (
        <>
            <Toaster position="top-center" />
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route element={<Layout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/accounts"
                        element={<Accounts />}
                    />

                    <Route
                        path="/schedule"
                        element={<Scheduler />}
                    />

                    <Route
                        path="/ai-composer"
                        element={<AIComposer />}
                    />
                    <Route
                        path="/upcommingpost"
                        element={<UpcomingPost />}
                    />
                    <Route
                        path="/scheduledpost"
                        element={<PublishedPost />}
                    />
                    <Route
                        path="/profile"
                        element={<ProfileLayout />}
                    >
                        <Route path="changename" element={<ChangeName />} />
                        <Route path="changetheme" element={<ChangeTheme />} />
                        <Route path="scheduledpost" element={<PublishedPost />} />
                        <Route path="upcomminigpost" element={<UpcomingPost />} />
                    </Route>



                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    );
}