import { useState, useEffect } from 'react';

export default function TaskFormModal({ isOpen, onClose, onSubmit, initialData, users }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
      });
    } else {
      setForm({ title: '', description: '', status: 'pending', priority: 'medium', assignedTo: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {initialData ? 'Edit Task' : 'Create Task'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {users && users.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Assign To</label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {initialData ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
