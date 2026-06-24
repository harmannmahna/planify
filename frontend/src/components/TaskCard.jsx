const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

const priorityColors = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

export default function TaskCard({ task, isAdmin, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-800">{task.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority] || priorityColors.medium}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status] || statusColors.pending}`}>
          {task.status}
        </span>
        {task.assignedTo?.name && (
          <span className="text-xs text-slate-400">
            Assigned: {task.assignedTo.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="text-xs border border-slate-200 rounded-md px-2 py-1 flex-1"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(task)}
              className="text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-xs px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
