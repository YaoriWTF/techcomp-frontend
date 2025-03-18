import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArchivedProjects } from '../../api/api';

function ArchivedProjectsList() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await getArchivedProjects();
            setProjects(response.data);
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h2>Archived Projects</h2>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        <Link to={`/projects/${project.id}`}>
                            <h3>{project.name}</h3>
                        </Link>
                        <p>Description: {project.description}</p>
                        <p>Status: {project.status}</p>
                        <p>Completion: {project.completionPercentage}%</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ArchivedProjectsList;