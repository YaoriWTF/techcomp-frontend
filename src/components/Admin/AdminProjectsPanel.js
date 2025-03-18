import React, { useEffect, useState } from 'react';
import { getProjects, getTasksByProjectId, updateProject, deleteProject, deleteTask, updateTask } from '../../api/api';

function AdminProjectsPanel() {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [editingTaskDescription, setEditingTaskDescription] = useState(null);
    const [editingProjectDescription, setEditingProjectDescription] = useState(null);
    const [editingProjectStartDate, setEditingProjectStartDate] = useState(null);
    const [editingProjectEndDate, setEditingProjectEndDate] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await getProjects();
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            alert('Error fetching projects: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const fetchTasks = async (projectId) => {
        try {
            const response = await getTasksByProjectId(projectId);
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === projectId ? { ...project, tasks: response.data } : project
                )
            );
        } catch (error) {
            console.error('Error fetching tasks:', error);
            alert('Error fetching tasks: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleProjectUpdate = async (project) => {
        try {
            await updateProject(project.id, project);
            fetchProjects();
            setEditingProject(null);
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Error updating project: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleProjectDelete = async (projectId) => {
        try {
            await deleteProject(projectId);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleTaskUpdate = async (task) => {
        try {
            await updateTask(task.id, task);
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === task.projectId
                        ? {
                              ...project,
                              tasks: project.tasks.map((t) => (t.id === task.id ? task : t)),
                          }
                        : project
                )
            );
            setEditingTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleTaskDelete = async (taskId, projectId) => {
        try {
            await deleteTask(taskId);
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === projectId
                        ? {
                              ...project,
                              tasks: project.tasks.filter((t) => t.id !== taskId),
                          }
                        : project
                )
            );
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error deleting task: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleTaskDescriptionUpdate = async (taskId, projectId, description) => {
        try {
            const task = projects.find((p) => p.id === projectId).tasks.find((t) => t.id === taskId);
            const updatedTask = { ...task, description };
            await updateTask(taskId, updatedTask);
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === projectId
                        ? {
                              ...project,
                              tasks: project.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
                          }
                        : project
                )
            );
            setEditingTaskDescription(null);
        } catch (error) {
            console.error('Error updating task description:', error);
            alert('Error updating task description: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleProjectDescriptionUpdate = async (projectId, description) => {
        try {
            const project = projects.find((p) => p.id === projectId);
            const updatedProject = { ...project, description };
            await updateProject(projectId, updatedProject);
            setProjects((prevProjects) =>
                prevProjects.map((p) => (p.id === projectId ? updatedProject : p))
            );
            setEditingProjectDescription(null);
        } catch (error) {
            console.error('Error updating project description:', error);
            alert('Error updating project description: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleProjectStartDateUpdate = async (projectId, startDate) => {
        try {
            const project = projects.find((p) => p.id === projectId);
            const updatedProject = { ...project, startDate };
            await updateProject(projectId, updatedProject);
            setProjects((prevProjects) =>
                prevProjects.map((p) => (p.id === projectId ? updatedProject : p))
            );
            setEditingProjectStartDate(null);
        } catch (error) {
            console.error('Error updating project start date:', error);
            alert('Error updating project start date: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleProjectEndDateUpdate = async (projectId, endDate) => {
        try {
            const project = projects.find((p) => p.id === projectId);
            const updatedProject = { ...project, endDate };
            await updateProject(projectId, updatedProject);
            setProjects((prevProjects) =>
                prevProjects.map((p) => (p.id === projectId ? updatedProject : p))
            );
            setEditingProjectEndDate(null);
        } catch (error) {
            console.error('Error updating project end date:', error);
            alert('Error updating project end date: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="container">
            <h2 className="text-3xl font-bold mb-4">Admin Projects Panel</h2>
            <div>
                {projects.map((project) => (
                    <div key={project.id} className="card mb-4">
                        {editingProject?.id === project.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingProject.name}
                                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                                <button
                                    onClick={() => handleProjectUpdate(editingProject)}
                                    className="button button-success mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingProject(null)}
                                    className="button button-danger"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl font-bold">{project.name}</h3>
                                {editingProjectDescription === project.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={project.description || ''}
                                            onChange={(e) => {
                                                const updatedProject = { ...project, description: e.target.value };
                                                setProjects((prevProjects) =>
                                                    prevProjects.map((p) => (p.id === project.id ? updatedProject : p))
                                                );
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded mb-2"
                                        />
                                        <button
                                            onClick={() => handleProjectDescriptionUpdate(project.id, project.description)}
                                            className="button button-success mr-2"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingProjectDescription(null)}
                                            className="button button-danger"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-600">{project.description || 'No description'}</p>
                                        <button
                                            onClick={() => setEditingProjectDescription(project.id)}
                                            className="button button-warning mr-2"
                                        >
                                            Edit Description
                                        </button>
                                    </div>
                                )}

                                {/* Дата старта проекта */}
                                {editingProjectStartDate === project.id ? (
                                    <div>
                                        <input
                                            type="date"
                                            value={project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                const updatedProject = { ...project, startDate: new Date(e.target.value) };
                                                setProjects((prevProjects) =>
                                                    prevProjects.map((p) => (p.id === project.id ? updatedProject : p))
                                                );
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded mb-2"
                                        />
                                        <button
                                            onClick={() => handleProjectStartDateUpdate(project.id, project.startDate)}
                                            className="button button-success mr-2"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingProjectStartDate(null)}
                                            className="button button-danger"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-600">Start Date: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</p>
                                        <button
                                            onClick={() => setEditingProjectStartDate(project.id)}
                                            className="button button-warning mr-2"
                                        >
                                            Edit Start Date
                                        </button>
                                    </div>
                                )}

                                {/* Дата окончания проекта */}
                                {editingProjectEndDate === project.id ? (
                                    <div>
                                        <input
                                            type="date"
                                            value={project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                const updatedProject = { ...project, endDate: new Date(e.target.value) };
                                                setProjects((prevProjects) =>
                                                    prevProjects.map((p) => (p.id === project.id ? updatedProject : p))
                                                );
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded mb-2"
                                        />
                                        <button
                                            onClick={() => handleProjectEndDateUpdate(project.id, project.endDate)}
                                            className="button button-success mr-2"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingProjectEndDate(null)}
                                            className="button button-danger"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-600">End Date: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</p>
                                        <button
                                            onClick={() => setEditingProjectEndDate(project.id)}
                                            className="button button-warning mr-2"
                                        >
                                            Edit End Date
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => setEditingProject(project)}
                                    className="button button-warning mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleProjectDelete(project.id)}
                                    className="button button-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        )}

                        {/* Список задач */}
                        <div className="mt-4">
                            <h4 className="text-lg font-bold">Tasks</h4>
                            {project.tasks ? (
                                <ul className="space-y-2">
                                    {project.tasks.map((task) => (
                                        <li key={task.id} className="bg-white p-2 rounded-lg shadow-md">
                                            {editingTask?.id === task.id ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editingTask.title}
                                                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                                    />
                                                    <button
                                                        onClick={() => handleTaskUpdate(editingTask)}
                                                        className="button button-success mr-2"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingTask(null)}
                                                        className="button button-danger"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <span className="font-bold">{task.title}</span>
                                                    {editingTaskDescription === task.id ? (
                                                        <div>
                                                            <input
                                                                type="text"
                                                                value={task.description || ''}
                                                                onChange={(e) => {
                                                                    const updatedTask = { ...task, description: e.target.value };
                                                                    setProjects((prevProjects) =>
                                                                        prevProjects.map((p) =>
                                                                            p.id === project.id
                                                                                ? { ...p, tasks: p.tasks.map((t) => (t.id === task.id ? updatedTask : t)) }
                                                                                : p
                                                                        )
                                                                    );
                                                                }}
                                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                                            />
                                                            <button
                                                                onClick={() => handleTaskDescriptionUpdate(task.id, project.id, task.description)}
                                                                className="button button-success mr-2"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingTaskDescription(null)}
                                                                className="button button-danger"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="text-gray-600">{task.description || 'No description'}</p>
                                                            <button
                                                                onClick={() => setEditingTaskDescription(task.id)}
                                                                className="button button-warning mr-2"
                                                            >
                                                                Edit Description
                                                            </button>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => setEditingTask(task)}
                                                        className="button button-warning mr-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleTaskDelete(task.id, project.id)}
                                                        className="button button-danger"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No tasks available.</p>
                            )}
                        </div>

                        {/* Кнопка для загрузки задач */}
                        <button
                            onClick={() => fetchTasks(project.id)}
                            className="button button-success mt-2"
                        >
                            Load Tasks
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminProjectsPanel;