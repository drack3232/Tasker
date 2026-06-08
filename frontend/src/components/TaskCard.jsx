function getDeadlineStatus(deadline) {
    if (!deadline) return { label: 'No deadline', cls: 'status-none' };
    const now = new Date();
    const dl = new Date(deadline);
    const diff = dl - now;
    const hours = diff / (1000 * 60 * 60);

    if (diff < 0) return { label: 'Overdue', cls: 'status-overdue' };
    if (hours < 24) return { label: 'Due today', cls: 'status-urgent' };
    if (hours < 72) return { label: 'Due soon', cls: 'status-soon' };
    return { label: 'On track', cls: 'status-ok' };
}

function formatDeadline(deadline) {
    if (!deadline) return null;
    return new Date(deadline).toLocaleString('uk-UA', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function TaskCard({ task, onEdit, onDelete }) {
    const { label, cls } = getDeadlineStatus(task.deadline);

    return (
        <div className={`task-card ${cls}`}>
            <div className="task-card-top">
                <span className={`badge ${cls}`}>{label}</span>
                <div className="task-actions">
                    <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => onDelete(task.id)} title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                        </svg>
                    </button>
                </div>
            </div>

            <h3 className="task-title">{task.title}</h3>
            {task.description && <p className="task-desc">{task.description}</p>}

            {task.deadline && (
                <div className="task-deadline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {formatDeadline(task.deadline)}
                </div>
            )}
        </div>
    );
}