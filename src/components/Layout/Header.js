import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function Header() {
    const { isAuthenticated, logout, userRole } = useAuth();

    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="flex justify-between items-center container">
                <div>
                    <Link to="/" className="text-xl font-bold">TechComp</Link>
                </div>
                <div>
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="mr-4 hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </>
                    ) : (
                        <>
                            {userRole === 'USER' && (
                                <>
                                    <Link to="/projects" className="mr-4 hover:underline">All Projects</Link>
                                    <Link to="/projects/create" className="mr-4 hover:underline">Create Project</Link>
                                </>
                            )}
                            {userRole === 'ADMIN' && (
                                <>
                                    <Link to="/admin/projects" className="mr-4 hover:underline">Admin Projects</Link>
                                    <Link to="/admin" className="mr-4 hover:underline">Admin Panel</Link>
                                </>
                            )}
                            <button onClick={logout} className="hover:underline">Logout</button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;