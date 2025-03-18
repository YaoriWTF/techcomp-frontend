import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById, getTasksByProjectId, createTask, addProjectNote, updateTaskStatus } from '../../api/api';
import { Chart } from 'chart.js/auto';
import { motion } from 'framer-motion';

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояние для новой задачи
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'TODO',
        projectId: id,
    });

    // Состояние для новой заметки
    const [newNote, setNewNote] = useState('');

    // Ссылка на экземпляр графика
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProjectById(id);
                setProject(response.data);
                setNotes(response.data.notes || []); // Загружаем записки, если они есть
            } catch (error) {
                console.error('Error fetching project:', error);
                setError('Failed to load project details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const fetchTasks = async () => {
            try {
                const response = await getTasksByProjectId(id);
                console.log('Response from server:', response); // Логируем ответ
        
                // Проверяем, является ли ответ массивом
                if (Array.isArray(response)) {
                    setTasks(response); // Если ответ — массив, используем его напрямую
                } else if (Array.isArray(response.data)) {
                    setTasks(response.data); // Если ответ содержит ключ data, используем его
                } else if (response.data === undefined) {
                    console.error('Tasks data is undefined');
                    setTasks([]);
                } else {
                    console.error('Invalid tasks data:', response.data);
                    setTasks([]);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchProject();
        fetchTasks();
    }, [id]);

    useEffect(() => {
        if (project) {
            // Уничтожаем предыдущий график, если он существует
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            const ctx = document.getElementById('completionChart').getContext('2d');
            chartRef.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Remaining'],
                    datasets: [{
                        data: [project.completionPercentage || 0, 100 - (project.completionPercentage || 0)],
                        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Project Completion'
                        }
                    }
                }
            });
        }
    }, [project]);

    // Обработчик изменения полей для новой задачи
    const handleTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    // Обработчик отправки формы для создания задачи
    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createTask(newTask);
            if (response.data) { // Проверяем, что данные существуют
                setTasks([...tasks, response.data]); // Добавляем новую задачу в список
                setNewTask({ ...newTask, title: '', description: '' }); // Очищаем форму
            } else {
                console.error('Invalid response from server:', response);
            }
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Error creating task: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    // Обработчик изменения полей для новой заметки
    const handleNoteChange = (e) => {
        setNewNote(e.target.value);
    };

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addProjectNote(id, newNote); // Отправляем строку заметки
            setNotes([...notes, newNote]); // Добавляем новую заметку в список
            setNewNote(''); // Очищаем форму
        } catch (error) {
            console.error('Error adding note:', error);
            alert('Error adding note: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleTaskComplete = async (taskId) => {
        try {
            const cleanedStatus = 'DONE'; // Убираем кавычки
            const response = await updateTaskStatus(taskId, cleanedStatus); // Передаем строку без кавычек
            if (response.data) {
                // Обновляем список задач
                setTasks(tasks.map(task => task.id === taskId ? response.data : task));

                // Обновляем проект (если сервер возвращает обновленный проект)
                if (response.data.project) {
                    setProject(response.data.project);
                }
            }
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Error updating task status: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    if (!project) {
        return <div className="text-center mt-8">Project not found</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto p-4"
        >
            <h2 className="text-3xl font-bold mb-4">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>
            <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
            <p>Status: {project.status}</p>
            <p>Completion: {project.completionPercentage}%</p>

            {/* Круговая диаграмма */}
            <canvas id="completionChart" width="400" height="400"></canvas>

            {/* Форма создания задачи */}
            <form onSubmit={handleTaskSubmit} className="mt-8">
                <h3 className="text-xl font-bold mb-4">Create Task</h3>
                <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={handleTaskChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={handleTaskChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Create Task
                </button>
            </form>

            {/* Список задач */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Tasks</h3>
                {tasks && tasks.length > 0 ? (
                    <ul className="space-y-4">
                        {tasks.map((task) => (
                            <li key={task.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h4 className="text-lg font-bold">{task.title || 'No title'}</h4>
                                <p className="text-gray-600">{task.description || 'No description'}</p>
                                <p>Status: {task.status || 'Unknown'}</p>
                                {/* Кнопка "Выполнено" */}
                                {task.status !== 'DONE' && (
                                    <button
                                        onClick={() => handleTaskComplete(task.id)}
                                        className="mt-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"
                                    >
                                        Mark as Done
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tasks available.</p>
                )}
            </div>

            {/* Форма добавления заметки */}
            <form onSubmit={handleNoteSubmit} className="mt-8">
                <h3 className="text-xl font-bold mb-4">Add Note</h3>
                <input
                    type="text"
                    placeholder="Enter note"
                    value={newNote}
                    onChange={handleNoteChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Add Note
                </button>
            </form>

            {/* Список заметок */}
            <div className="mt-8 min-h-[200px]">
                <h3 className="text-xl font-bold mb-4">Notes</h3>
                {notes && notes.length > 0 ? (
                    <ul className="space-y-4">
                        {notes.map((note, index) => (
                            <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                {note}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notes available.</p>
                )}
            </div>
        </motion.div>
    );
}

export default ProjectDetails;