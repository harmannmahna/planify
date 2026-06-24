import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../features/tasks/tasksSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, error } = useSelector((state) => state.tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateTask({ id, updates: { status } }));
  };

  const handleSubmit = async (formData) => {
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask._id, updates: formData }));
    } else {
      await dispatch(createTask(formData));
    }
    setModalOpen(false);
  };

  const filteredTasks =
    statusFilter === 'all' ? tasks : tasks.filter((t) => t.status === statusFilter);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {isAdmin ? 'All Tasks' : 'My Tasks'}
            </h2>
            <p className="text-sm text-slate-500">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {isAdmin && (
              <button
                onClick={handleCreate}
                className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                + New Task
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-slate-400 text-sm">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>No tasks found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingTask}
        users={[]}
      />
    </div>
  );
}
