import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, LogOut, UserCog, Search } from 'lucide-react';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4 flex-wrap">
                <Link to="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <Shield size={28} />
                    <span className="text-lg sm:text-xl font-bold">הלוחם</span>
                </Link>

                <form onSubmit={handleSearch} className="relative flex-grow max-w-lg order-3 sm:order-2 w-full sm:w-auto">
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="חיפוש מוצרים..."
                        className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <Search size={20} />
                    </button>
                </form>

                <nav className="flex items-center gap-4 order-2 sm:order-3">
                    {isAuthenticated ? (
                        <>
                            <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                                <UserCog size={16} />
                                <span className="hidden sm:inline">ניהול</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                                <LogOut size={16} />
                                <span className="hidden sm:inline">התנתק</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/admin" className="text-sm font-medium hover:text-blue-400 transition-colors">
                            כניסת מנהל
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;