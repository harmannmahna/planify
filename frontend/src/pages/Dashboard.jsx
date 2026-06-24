import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, createTask, deleteTask } from '../features/tasks/tasksSlice';
import { logout } from '../features/auth/authSlice';
import Pomodoro from '../components/Pomodoro';
import TaskFormModal from '../components/TaskFormModal';
import api from '../api/axios';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.auth);
  const [points, setPoints] = useState(0);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchTasks());
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const res = await api.get('/room');
      setPoints(res.data.points || 0);
    } catch (err) {
      // non-fatal
    }
  };

  const handlePointsEarned = (earned) => {
    setPoints(prev => prev + earned);
  };

  const handleComplete = async (task) => {
    if (task.status === 'completed') return;
    await dispatch(updateTask({ id: task._id, updates: { status: 'completed' } }));
    fetchPoints();
  };

  const handleCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleSubmit = async (formData) => {
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask._id, updates: formData }));
    } else {
      await dispatch(createTask(formData));
    }
    setShowModal(false);
  };

  const completed = tasks.filter(t => t.status === 'completed').length;
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: 'white', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ margin: 0, color: '#a8dadc', fontSize: '13px' }}>Good morning,</p>
          <h1 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: '500' }}>{user?.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid #ffd700', borderRadius: '8px', padding: '8px 16px', color: '#ffd700', fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}>
            ⭐ {points} pts
          </div>
          <button onClick={() => window.location.href = '/room'} style={{ background: '#e94560', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            🏠 Room
          </button>
          <button onClick={() => dispatch(logout())} style={{ background: 'transparent', border: '1px solid #444', color: '#aaa', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total tasks', value: tasks.length, color: 'white' },
          { label: 'Completed', value: completed, color: '#4ade80' },
          { label: 'In progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} style={{ background: '#16213e', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a4a' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#a8dadc' }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '500', color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>

        {/* Tasks */}
        <div style={{ background: '#16213e', borderRadius: '12px', padding: '20px', border: '1px solid #1e2a4a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{isAdmin ? 'All Tasks' : 'My Tasks'}</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'pending', 'in-progress', 'completed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? '#e94560' : 'transparent',
                  border: '1px solid ' + (filter === f ? '#e94560' : '#333'),
                  color: 'white', padding: '4px 10px', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '11px'
                }}>{f}</button>
              ))}
              {isAdmin && (
                <button onClick={handleCreate} style={{ background: '#e94560', border: 'none', color: 'white', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>+ Add</button>
              )}
            </div>
          </div>

          {filtered.length === 0 && <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>No tasks found.</p>}

          {filtered.map(task => (
            <div key={task._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #1e2a4a' }}>
              <input type="checkbox" checked={task.status === 'completed'} onChange={() => handleComplete(task)}
                style={{ width: '18px', height: '18px', accentColor: '#4ade80', cursor: 'pointer' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? '#666' : 'white' }}>
                  {task.title}
                </p>
                {task.description && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#666' }}>{task.description}</p>}
              </div>
              <span style={{
                fontSize: '11px', padding: '3px 8px', borderRadius: '6px',
                background: task.status === 'completed' ? '#14532d' : task.status === 'in-progress' ? '#451a03' : '#1e1b4b',
                color: task.status === 'completed' ? '#4ade80' : task.status === 'in-progress' ? '#fbbf24' : '#a78bfa'
              }}>{task.status}</span>
              {task.status !== 'completed' && (
                <span style={{ fontSize: '10px', color: '#ffd700' }}>+10 pts</span>
              )}
              {isAdmin && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleEdit(task)} style={{ background: 'transparent', border: '1px solid #444', color: '#a8dadc', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>Edit</button>
                  <button onClick={() => handleDelete(task._id)} style={{ background: 'transparent', border: '1px solid #e94560', color: '#e94560', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>Del</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <Pomodoro onPointsEarned={handlePointsEarned} />

          {/* Room preview */}
          <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '9px', color: '#a8dadc', margin: '0 0 12px' }}>MY ROOM</p>
            <div style={{ background: 'linear-gradient(180deg, #16213e 60%, #8B6914 60%)', borderRadius: '8px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>
              🖥️ 🌵 💡
            </div>
            <button onClick={() => window.location.href = '/room'} style={{
              width: '100%', background: '#e94560', border: 'none', color: 'white',
              padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
            }}>Decorate room →</button>
          </div>

        </div>
      </div>

      <TaskFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        initialData={editingTask}
        users={[]}
      />
    </div>
  );
}