import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        // FIXED: Added back the premium dark mode background and text colors
        <div className="flex flex-col min-h-screen bg-zinc-900 text-gray-100">
            <Navbar />
            
            {/* FIXED: Removed 'flex' which distorts child pages. Added padding for breathing room. */}
            <main className="grow w-full pt-8 pb-16">
                <Outlet />
            </main>
            
            <Footer />
        </div>
    );
}