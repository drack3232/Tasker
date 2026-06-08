import { useState, useEffect } from 'react';

export default function TaskModal({ task, onClose, onSave }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        deadline: '',
    });

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                deadline: task.deadline ? task.deadline.slice(0, 16) : '',
            });
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...form,
            deadline: form.deadline ? `${form.deadline}:00` : null,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{task?.id ? 'Edit task' : 'New task'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="field">
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="E.g. Lab #3 — Algorithms"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="field">
                        <label>Description</label>
                        <textarea
                            placeholder="What needs to be done?"
                            value={form.description}
                            rows={3}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="field">
                        <label>Deadline</label>
                        <input
                            type="datetime-local"
                            value={form.deadline}
                            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">
                            {task?.id ? 'Save changes' : 'Create task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}