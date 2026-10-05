import { CodeXml, Globe, Heart } from 'lucide-react';

export default function Footer() {
    return (
        // Added mt-auto to keep it at the very bottom, and backdrop-blur for the glass effect
        <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/50 backdrop-blur-md text-zinc-400 py-6 mt-auto">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Brand Section */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        ExpenseTracker
                    </span>
                    <span className="text-zinc-500 text-sm">&copy; {new Date().getFullYear()}</span>
                </div>

                {/* Made with Love Section */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-300">
                    Built with 
                    <Heart size={16} className="text-red-500 fill-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" /> 
                    for better finances
                </div>

                {/* Social/Links Section */}
                <div className="flex gap-5">
                    <a 
                        href="#" 
                        className="p-2 rounded-full bg-zinc-800/50 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 border border-zinc-700/50 hover:border-emerald-500/50 transition-all duration-300"
                        aria-label="View Source Code"
                    >
                        <CodeXml size={18} />
                    </a>
                    <a 
                        href="#" 
                        // FIXED: Removed the hardcoded red color so the hover effect works beautifully
                        className="p-2 rounded-full bg-zinc-800/50 hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400 border border-zinc-700/50 hover:border-blue-500/50 transition-all duration-300"
                        aria-label="Visit Website"
                    >
                        <Globe size={18} />
                    </a>
                </div>
                
            </div>
        </footer>
    );
}