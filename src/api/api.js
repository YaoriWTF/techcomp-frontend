import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем токен в заголовок перед каждым запросом
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Аутентификация
export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data; // Возвращаем данные ответа
    } catch (error) {
        throw error.response ? error.response.data : error.message; // Возвращаем ошибку
    }
};

export const register = (username, password) =>
    api.post('/auth/register', { username, password });

// Создание нового проекта
export const createProject = async (project) => {
    try {
        const response = await api.post('/projects', project);
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const archiveProject = async (projectId) => {
    try {
        const response = await api.put(`/projects/${projectId}/archive`);
        return response.data;
    } catch (error) {
        console.error('Error archiving project:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const addProjectNote = async (projectId, note) => {
    try {
        const response = await api.post(`/projects/${projectId}/notes`, { note }); // Отправляем объект с полем "note"
        return response.data;
    } catch (error) {
        console.error('Error adding note:', error);
        throw error.response ? error.response.data : error.message;
    }
};

// Проекты
export const getProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const updateProject = (id, project) => api.put(`/projects/${id}`, project);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Задачи
export const getTasks = () => api.get('/tasks');
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const createTask = async (task) => {
    try {
        const response = await api.post('/tasks', task); // Исправлено: используем api.post
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Получение задач по ID проекта
export const getTasksByProjectId = async (projectId) => {
    try {
        const response = await api.get(`/projects/${projectId}/tasks`);

        // Проверяем, является ли ответ массивом
        if (Array.isArray(response.data)) {
            return response.data; // Возвращаем данные из ключа data
        } else {
            return response; // Возвращаем ответ напрямую (если это массив)
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error.response ? error.response.data : error.message;
    }
};

// Получение проектов, назначенных пользователю
export const getProjectsAssignedToUser = async () => {
    const response = await axios.get('/api/projects/assigned-to-me');
    return response.data;
};

// Получение архивированных проектов
export const getArchivedProjects = async () => {
    const response = await axios.get('/api/projects/archived');
    return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
    try {
        // Убираем кавычки из строки статуса
        const cleanedStatus = status.replace(/"/g, '');
        const response = await api.put(`/tasks/${taskId}/status`, cleanedStatus); // Передаем строку без кавычек
        return response.data;
    } catch (error) {
        console.error('Error updating task status:', error);
        throw error.response ? error.response.data : error.message;
    }
};

// Получение всех пользователей
export const getUsers = async () => {
    try {
        const response = await api.get('/admin/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error.response ? error.response.data : error.message;
    }
};

// Обновление роли пользователя
export const updateUserRole = async (userId, role) => {
    try {
        const response = await api.put(`/admin/users/${userId}/role`, role); // Передаем строку
        return response.data;
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error.response ? error.response.data : error.message;
    }
};

// Обновление имени пользователя
export const updateUsername = async (userId, username) => {
    try {
        const response = await api.put(`/admin/users/${userId}/username`, { username }); // Отправляем объект
        return response.data;
    } catch (error) {
        console.error('Error updating username:', error);
        throw error.response ? error.response.data : error.message;
    }
};

// Удаление пользователя
export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error.response ? error.response.data : error.message;
    }
};