import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../api/api';

function ProjectList() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                alert('Error fetching projects: ' + (error.response?.data?.message || 'Unknown error'));
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="container">
            <h2 className="text-3xl font-bold mb-4">Projects</h2>
            <ul className="space-y-4">
                {projects.map((project) => (
                    <li key={project.id} className="card">
                        <Link to={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                            <h3 className="text-xl font-bold">{project.name}</h3>
                        </Link>
                        <p className="text-gray-600">{project.description}</p>
                        <p>Status: {project.status}</p>
                        <p>Completion: {project.completionPercentage}%</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProjectList;