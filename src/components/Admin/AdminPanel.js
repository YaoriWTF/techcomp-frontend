import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole, updateUsername, deleteUser } from '../../api/api';

function AdminPanel() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error fetching users: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            await updateUserRole(userId, { role });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Error updating user role: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleUsernameChange = async (userId, username) => {
        try {
            await updateUsername(userId, username);
            fetchUsers();
        } catch (error) {
            console.error('Error updating username:', error);
            alert('Error updating username: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="container">
            <h2 className="text-3xl font-bold mb-4">Admin Panel</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                                <input
                                    type="text"
                                    value={user.username}
                                    onChange={(e) => handleUsernameChange(user.id, e.target.value)}
                                />
                            </td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="button button-danger"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPanel;