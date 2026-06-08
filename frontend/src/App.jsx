import { useState, useEffect, useCallback } from 'react';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';
import './App.css';

const USER_ID = 1;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks(USER_ID);
      setTasks(data);
    } catch {
      setError('Cannot connect to backend. Is it running on localhost:8080?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (formData) => {
    try {
      if (modal?.id) {
        await updateTask(modal.id, { ...formData, userId: USER_ID });
      } else {
        await createTask({ ...formData, userId: USER_ID });
      }
      setModal(null);
      load();
    } catch {
      alert('Failed to save task. Check backend connection.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      load();
    } catch {
      alert('Failed to delete task.');
    }
  };

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (filter === 'all') return true;

    const now = new Date();
    const dl = t.deadline ? new Date(t.deadline) : null;

    if (filter === 'overdue') return dl && dl < now;
    if (filter === 'today') {
      if (!dl) return false;
      const diff = dl - now;
      return diff > 0 && diff < 24 * 60 * 60 * 1000;
    }
    if (filter === 'upcoming') return !dl || (dl - now) >= 24 * 60 * 60 * 1000;
    return true;
  });

  const counts = {
    all: tasks.length,
    overdue: tasks.filter(t => t.deadline && new Date(t.deadline) < new Date()).length,
    today: tasks.filter(t => {
      if (!t.deadline) return false;
      const diff = new Date(t.deadline) - new Date();
      return diff > 0 && diff < 86400000;
    }).length,
    upcoming: tasks.filter(t => !t.deadline || (new Date(t.deadline) - new Date()) >= 86400000).length,
  };

  return (
      <div className="app">
        <header className="header">
          <div className="header-left">
            <div className="logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">Tasker</span>
            </div>
            <p className="header-sub">Student task manager</p>
          </div>
          <button className="btn-primary btn-new" onClick={() => setModal({})}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Task
          </button>
        </header>

        <main className="main">
          <div className="toolbar">
            <div className="search-wrap">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                  className="search-input"
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                  <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            <div className="filters">
              {['all', 'overdue', 'today', 'upcoming'].map((f) => (
                  <button
                      key={f}
                      className={`filter-btn ${filter === f ? 'active' : ''}`}
                      onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    {counts[f] > 0 && <span className="filter-count">{counts[f]}</span>}
                  </button>
              ))}
            </div>
          </div>

          {loading && (
              <div className="state-screen">
                <div className="spinner" />
                <p>Loading tasks...</p>
              </div>
          )}

          {error && (
              <div className="state-screen error-state">
                <span className="state-icon">⚠️</span>
                <p>{error}</p>
                <button className="btn-primary" onClick={load}>Retry</button>
              </div>
          )}

          {!loading && !error && filtered.length === 0 && (
              <div className="state-screen empty-state">
            <span className="state-icon">
              {search ? '🔍' : tasks.length === 0 ? '📋' : '✅'}
            </span>
                <h3>
                  {search ? 'No results found' : tasks.length === 0 ? 'No tasks yet' : 'Nothing here'}
                </h3>
                <p>
                  {search
                      ? `Nothing matches "${search}"`
                      : tasks.length === 0
                          ? 'Create your first task to get started'
                          : 'Try a different filter'}
                </p>
                {tasks.length === 0 && !search && (
                    <button className="btn-primary" onClick={() => setModal({})}>
                      Create first task
                    </button>
                )}
              </div>
          )}

          {!loading && !error && filtered.length > 0 && (
              <div className="task-grid">
                {filtered.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={setModal}
                        onDelete={handleDelete}
                    />
                ))}
              </div>
          )}
        </main>

        {modal !== null && (
            <TaskModal
                task={modal}
                onClose={() => setModal(null)}
                onSave={handleSave}
            />
        )}
      </div>
  );
}