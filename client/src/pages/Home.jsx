import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import HowItWorks from "../components/Home/HowItWorks";
import Testimonials from "../components/Home/Testimonials";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";
import Lenis from "lenis";
import { useEffect } from "react";

export default function Landing() {
    useEffect(() => {

        const lenisInstance = new Lenis({
            autoRaf: true,
        });

        return () => {
            lenisInstance.destroy();
        };

    }, []);
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
}
