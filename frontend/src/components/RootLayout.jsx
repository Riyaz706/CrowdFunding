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

    const navLinkClass = "text-gray-600 hover:text-gray-900 font-medium transition-colors px-1 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full";
    const navLinkActiveClass = "text-gray-900 font-bold after:w-full";

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <NavLink to={currentUser?.role === 'ADMIN' ? "/admin-approval" : "/home"} className="flex items-center gap-2 no-underline group">
                        <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                            C
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">CrowdFunding</h1>
                    </NavLink>

                    <div className="hidden lg:flex items-center gap-8">
                        {currentUser?.role !== 'ADMIN' && (
                            <NavLink to="/home" className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>Home</NavLink>
                        )}
                        <NavLink to="/campaigns" className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>Campaigns</NavLink>
                        {currentUser?.role === 'ADMIN' && (
                            <NavLink to="/admin-approval" className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>Moderation</NavLink>
                        )}
                        
                        <div className="w-px h-6 bg-gray-200 mx-2"></div>
                        
                        {isAuthenticated ? (
                            <div className="flex items-center gap-6">
                                <NavLink to="/donor-tracking" className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>Track</NavLink>
                                <span className="text-gray-900 font-bold">Hi, {currentUser?.firstName}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="px-6 py-2.5 border-2 border-gray-900 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <NavLink to="/login" className="text-gray-600 hover:text-gray-900 font-bold">Login</NavLink>
                                <NavLink 
                                    to="/register" 
                                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                                >
                                    Get Started
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Placeholder (Simplified) */}
                    <button className="lg:hidden text-gray-900">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
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