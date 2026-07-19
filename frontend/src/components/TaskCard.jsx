import { getDeadlineState, formatDeadline } from '../utils/deadline';
import { EditIcon, TrashIcon, ClockIcon } from './icons';

export function TaskCard({ task, onEdit, onDelete }) {
  const deadlineState = getDeadlineState(task.deadline);

  return (
    <article className={`task-card task-card--${deadlineState.key}`}>
      <div className="task-card__row">
        <span className={`pill pill--${deadlineState.key}`}>{deadlineState.label}</span>

        <div className="task-card__actions">
          <button
            className="icon-btn"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            title="Edit task"
          >
            <EditIcon width={15} height={15} />
          </button>
          <button
            className="icon-btn icon-btn--danger"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
            title="Delete task"
          >
            <TrashIcon width={15} height={15} />
          </button>
        </div>
      </div>

      <h3 className="task-card__title">{task.title}</h3>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {task.deadline && (
        <div className="task-card__deadline">
          <ClockIcon width={13} height={13} />
          <span>{formatDeadline(task.deadline)}</span>
        </div>
      )}
    </article>
  );
}