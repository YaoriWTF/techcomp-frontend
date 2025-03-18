import React, { useState } from 'react';
import { createTask } from '../api/api';

function CreateTaskForm() {
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: 'TODO',
        projectId: '',
        assigneeId: '',
        hours: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTask(task);
            alert('Task created successfully!');
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Error creating task: ' + error.response?.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Task</h2>
            <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={task.title}
                onChange={handleChange}
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={task.description}
                onChange={handleChange}
            />
            <input
                type="text"
                name="status"
                placeholder="Status"
                value={task.status}
                onChange={handleChange}
            />
            <input
                type="number"
                name="projectId"
                placeholder="Project ID"
                value={task.projectId}
                onChange={handleChange}
            />
            <input
                type="number"
                name="assigneeId"
                placeholder="Assignee ID"
                value={task.assigneeId}
                onChange={handleChange}
            />
            <input
                type="number"
                name="hours"
                placeholder="Hours"
                value={task.hours}
                onChange={handleChange}
            />
            <button type="submit">Create Task</button>
        </form>
    );
}

export default CreateTaskForm;