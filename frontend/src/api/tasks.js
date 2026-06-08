const BASE_URL = 'http://localhost:8080/api/task';

export const getTasks = async (userId) => {
    const res = await fetch(`${BASE_URL}?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
};

export const createTask = async (task) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
};

export const updateTask = async (id, task) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
};

export const deleteTask = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
};