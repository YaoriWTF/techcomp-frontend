import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProjectList from './components/Project/ProjectList';
import ProjectDetails from './components/Project/ProjectDetails';
import MyProjectsList from './components/Project/MyProjectsList';
import ArchivedProjectsList from './components/Project/ArchivedProjectsList';
import CreateProjectForm from './components/Project/CreateProjectForm';
import AdminPanel from './components/Admin/AdminPanel';
import AdminProjectsPanel from './components/Admin/AdminProjectsPanel'; // Импортируем новый компонент
import { AuthProvider, useAuth } from './AuthContext';

function ProtectedRoute({ element }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow pb-20"> {/* Добавляем отступ внизу */}
                        <div className="p-4">
                            <Routes>
                                <Route path="/login" element={<LoginForm />} />
                                <Route path="/register" element={<RegisterForm />} />
                                <Route path="/projects" element={<ProtectedRoute element={<ProjectList />} />} />
                                <Route path="/projects/assigned-to-me" element={<ProtectedRoute element={<MyProjectsList />} />} />
                                <Route path="/projects/archived" element={<ProtectedRoute element={<ArchivedProjectsList />} />} />
                                <Route path="/projects/create" element={<ProtectedRoute element={<CreateProjectForm />} />} />
                                <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectDetails />} />} />
                                <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />} />
                                <Route path="/admin/projects" element={<ProtectedRoute element={<AdminProjectsPanel />} />} />
                                <Route path="*" element={<Navigate to="/login" />} />
                            </Routes>
                        </div>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;