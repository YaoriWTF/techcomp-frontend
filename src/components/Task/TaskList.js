import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../../api/api';

function TaskList() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await getTasks();
        setTasks(response.data);
    };

    return (
        <div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <Link to={`/tasks/${task.id}`}>
                            <h3>{task.title}</h3>
                        </Link>
                        <p>Description: {task.description}</p>
                        <p>Status: {task.status}</p>
                        <p>Project ID: {task.projectId}</p>
                        <p>Assignee ID: {task.assigneeId}</p>
                        <p>Hours: {task.hours}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;