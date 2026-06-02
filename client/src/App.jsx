import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Scheduler from "./pages/Scheduler";
import AIComposer from "./pages/AIComposer";
import PageNotFound from "./components/NotFound/PageNotFound";
import ServiceNotAvailable from "./components/ServiceNotAvailable";
import {Toaster} from "react-hot-toast"
const { VITE_AI_COMPOSER_FEATURE_ENABLED } = import.meta.env;

export default function App() {
    const condetion = VITE_AI_COMPOSER_FEATURE_ENABLED === "true"
    
    return (
        <> 
            <Toaster position="top-center"/>
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
                        element={condetion ? <AIComposer /> : <ServiceNotAvailable />}
                    />

                    

                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    );
}