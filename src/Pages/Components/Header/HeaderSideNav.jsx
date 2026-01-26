import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// UI Icons
import { 
    LogOut, 
    User as UserIcon, 
    ChevronDown, 
    Menu, 
    LayoutDashboard, 
    FileText, 
    Users, 
    ClipboardList, 
    Settings 
} from 'lucide-react';

/**
 * Helper to get a specific cookie by name
 */
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

/**
 * Helper to delete a cookie by name
 */
const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Helper to decode the JWT payload on the client side
 */
const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};

function HeaderSideNav(props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [adminData, setAdminData] = useState({ username: 'Admin', role: '' });
    
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Fetch the session from cookies on mount
    useEffect(() => {
        const token = getCookie('admin_token');
        
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded) {
                setAdminData({
                    // Backend encodes 'admin_id' and 'role'
                    username: decoded.admin_id || 'Admin',
                    role: decoded.role || ''
                });
            }
        } else {
            // Optional: Redirect to login if no cookie is found and we aren't already on login
            if (location.pathname !== '/login') {
                navigate('/login');
            }
        }
    }, [location.pathname, navigate]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Handle Logout by clearing cookies
    const handleLogout = () => {
        deleteCookie('admin_token');
        deleteCookie('admin_role'); // Clear any other stored identity cookies
        
        navigate('/login');
        window.location.reload(); // Ensure all app states are reset
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/attendance', label: 'Attendance Reports', icon: FileText },
        { path: '/employees', label: 'Employees', icon: Users },
        { path: '/leave', label: 'Leave Requests', icon: ClipboardList },
        { path: '/settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900"> 
            {/* Header */}
            <header className="flex items-center justify-between bg-[#5E5CDB] w-full h-20 text-white px-0 md:px-0 shadow-lg relative z-20"> 
                <div className='flex items-center text-xl md:text-2xl lg:text-3xl font-semibold h-full w-48 md:w-64 lg:w-72 flex-shrink-0'> 
                    <button onClick={toggleSidebar} className='flex items-center justify-center cursor-pointer bg-[#3048AC] h-full px-5 hover:bg-[#283d91] transition-colors'>
                        <Menu size={24} />
                    </button>
                    <div className='bg-[#3048AC] flex items-center h-full flex-1 px-4'>
                        <p className='truncate'>Presence360</p>
                    </div>
                </div>

                {/* Dynamic Admin Profile with Dropdown */}
                <div className='flex items-center h-full px-4 relative' ref={dropdownRef}> 
                    <button 
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className={`flex items-center gap-3 cursor-pointer h-full px-4 transition-all duration-200 ${isProfileMenuOpen ? 'bg-[#3048AC]' : 'hover:bg-[#3048AC]/50'}`}
                    > 
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold leading-none">{adminData.username}</p>
                            <p className="text-[10px] uppercase tracking-tighter opacity-70 mt-1">
                                {adminData.role?.replace('_', ' ') || 'Administrator'}
                            </p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center text-white">
                             <UserIcon size={20} />
                        </div>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileMenuOpen && (
                        <div className="absolute top-full right-4 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-slate-700">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 text-left">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                <p className="text-sm font-bold text-slate-900 truncate">{adminData.username}</p>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{adminData.role}</p>
                            </div>
                            <div className="p-1">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                                >
                                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className='flex flex-1 w-full overflow-hidden'> 
                {/* Sidebar */}
                <nav className={`${isSidebarOpen ? 'w-48 md:w-64 lg:w-72' : 'w-20'} bg-[#F5F8FF] flex-shrink-0 border-r border-blue-100 shadow-[2px_0_4px_-1px_rgba(94,92,219,0.15)] relative z-10 transition-all duration-300`}>
                    <ul className='w-full py-4'>
                        {menuItems.map((item) => (
                            <li key={item.path} className="group relative">
                                <Link 
                                    to={item.path} 
                                    className={`flex items-center h-14 transition-all duration-200 ${isSidebarOpen ? 'px-6' : 'justify-center'} ${isActive(item.path) ? 'bg-[#DDE7FF] text-[#5E5CDB] border-l-4 border-[#5E5CDB]' : 'text-slate-600 hover:bg-[#DDE7FF]/50 hover:text-[#5E5CDB]'}`}
                                >
                                    <item.icon 
                                        size={22}
                                        className={`${isSidebarOpen ? 'mr-4' : ''} ${isActive(item.path) ? 'text-[#5E5CDB]' : 'text-slate-400 group-hover:text-[#5E5CDB]'} transition-colors`} 
                                    />
                                    {isSidebarOpen && <span className="font-bold text-sm md:text-base tracking-tight">{item.label}</span>}
                                </Link>
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                        {item.label}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Main Content */}
                <main className="bg-[#F5F4FA] flex-1 overflow-auto p-4 md:p-8"> 
                    {props.children}
                </main>
            </div>
        </div>
    );
}

export default HeaderSideNav;