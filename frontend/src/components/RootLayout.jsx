import { NavLink, Outlet, useNavigate } from 'react-router';
import { authStore } from '../store/authStore';
import { useEffect } from 'react';

function RootLayout() {
    const { isAuthenticated, currentUser, logout, checkAuth } = authStore();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const handleLogout = async () => {
        await logout();
        // toast.success('Logged out successfully');
        navigate('/login');
    };

    const navLinkClass = "text-gray-400 hover:text-white font-medium transition-colors px-1 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full";
    const navLinkActiveClass = "text-white font-bold after:w-full";

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Navbar */}
            <nav className=" top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-12">
                        <NavLink to={currentUser?.role === 'ADMIN' ? "/admin-approval" : "/home"} className="flex items-center gap-3 no-underline group">
                            <div className="w-10 h-10 bg-linear-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                C
                            </div>
                            <h1 className="text-xl font-black tracking-tight text-white uppercase">CrowdFunding</h1>
                        </NavLink>

                        <div className="hidden lg:flex items-center gap-8">
                            {currentUser?.role !== 'ADMIN' && (
                                <NavLink to="/home" className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>Home</NavLink>
                            )}
                            <NavLink to="/campaigns" className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>Campaigns</NavLink>
                            {currentUser?.role === 'ADMIN' && (
                                <NavLink to="/admin-approval" className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>Moderation</NavLink>
                            )}
                            {isAuthenticated && currentUser?.role !== 'ADMIN' && (
                                <NavLink to="/donor-tracking" className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>Track</NavLink>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-8 pl-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs ring-1 ring-blue-500/20">
                                        {currentUser?.firstName?.[0]}
                                    </div>
                                    <span className="text-gray-300 font-medium text-sm">Hi, {currentUser?.firstName}</span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="px-6 py-2 border border-white/10 text-white rounded-xl font-bold hover:bg-white/5 transition-all text-sm active:scale-95"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <NavLink to="/login" className="text-gray-400 hover:text-white font-bold transition-colors">Login</NavLink>
                                <NavLink 
                                    to="/register" 
                                    className="px-6 py-2.5 bg-white text-gray-950 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all shadow-xl shadow-white/5 active:scale-95"
                                >
                                    Get Started
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Placeholder (Simplified) */}
                    <button className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="grow">
                <Outlet />
            </main>
        </div>
    );
}

export default RootLayout;