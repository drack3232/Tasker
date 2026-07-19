import { API_BASE_URL } from '../config';

// Every function here maps 1:1 to a backend endpoint.
// Add new task-related requests here, not inside components.

async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  // DELETE returns 204 No Content — nothing to parse.
  if (response.status === 204) return null;
  return response.json();
}

export function fetchTasks(userId) {
  return fetch(`${API_BASE_URL}?userId=${userId}`)
    .then((res) => handleResponse(res, 'Could not load tasks'));
}

export function createTask(task) {
  return fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  }).then((res) => handleResponse(res, 'Could not create task'));
}

export function updateTask(id, task) {
  return fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  }).then((res) => handleResponse(res, 'Could not update task'));
}

export function deleteTask(id) {
  return fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' })
    .then((res) => handleResponse(res, 'Could not delete task'));
}