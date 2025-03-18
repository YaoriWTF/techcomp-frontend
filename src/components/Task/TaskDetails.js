import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskById } from '../../api/api';

function TaskDetails() {
    const { id } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            const response = await getTaskById(id);
            setTask(response.data);
        };
        fetchTask();
    }, [id]);

    if (!task) return <div>Loading...</div>;

    return (
        <div>
            <h2>{task.title}</h2>
            <p>Description: {task.description}</p>
            <p>Status: {task.status}</p>
            <p>Project ID: {task.projectId}</p>
            <p>Assignee ID: {task.assigneeId}</p>
            <p>Hours: {task.hours}</p>
        </div>
    );
}

export default TaskDetails;