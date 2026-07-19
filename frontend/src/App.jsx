import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TaskToolbar } from './components/TaskToolbar';
import { TaskList } from './components/TaskList';
import { TaskFormModal } from './components/TaskFormModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { useTasks } from './hooks/useTasks';
import { useTaskFilters } from './hooks/useTasksFilters';
import { useTheme } from './hooks/useTheme';
import './App.css';

export default function App() {
  const { tasks, status, errorMessage, reloadTasks, saveTask, removeTask } = useTasks();
  const {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    filterCounts,
  } = useTaskFilters(tasks);
  const { isDark, toggleTheme } = useTheme();

  // null = closed, {} = creating, {...task} = editing
  const [editingTask, setEditingTask] = useState(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);

  async function handleSave(formData) {
    await saveTask(formData, editingTask?.id);
    setEditingTask(null);
  }

  async function handleConfirmDelete() {
    await removeTask(taskPendingDelete.id);
    setTaskPendingDelete(null);
  }

  return (
    <div className="page">
      <Header
        onNewTask={() => setEditingTask({})}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="page__content">
        <TaskToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filterCounts={filterCounts}
        />

        <TaskList
          status={status}
          errorMessage={errorMessage}
          tasks={filteredTasks}
          hasAnyTasks={tasks.length > 0}
          isSearching={searchQuery.trim().length > 0}
          onRetry={reloadTasks}
          onEdit={setEditingTask}
          onDelete={setTaskPendingDelete}
          onCreateFirst={() => setEditingTask({})}
        />
      </main>

      <Footer />

      {editingTask !== null && (
        <TaskFormModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSave}
        />
      )}

      {taskPendingDelete && (
        <ConfirmDialog
          title="Delete task?"
          message={`"${taskPendingDelete.title}" will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setTaskPendingDelete(null)}
        />
      )}
    </div>
  );
}