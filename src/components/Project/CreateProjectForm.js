import React, { useState } from 'react';
import { createProject } from '../../api/api';
import { useNavigate } from 'react-router-dom';

function CreateProjectForm() {
    const [project, setProject] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        projectManager: '',
        assignedEmployees: [],
        notes: [],
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject({ ...project, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createProject(project);
            alert('Project created successfully!');
            navigate('/projects'); // Перенаправляем на страницу со всеми проектами
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error creating project: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Create Project</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    value={project.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={project.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="date"
                    name="startDate"
                    placeholder="Start Date"
                    value={project.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="date"
                    name="endDate"
                    placeholder="End Date"
                    value={project.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="text"
                    name="projectManager"
                    placeholder="Project Manager"
                    value={project.projectManager}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Create Project
                </button>
            </form>
        </div>
    );
}

export default CreateProjectForm;