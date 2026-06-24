import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, createTask, deleteTask } from '../features/tasks/tasksSlice';
import { logout } from '../features/auth/authSlice';
import api from '../api/axios';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.auth);
  const [points, setPoints] = useState(0);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // Pomodoro state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomMode, setPomMode] = useState('work');
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTasks());
    api.get('/auth/me').then(r => setPoints(r.data.points || 0));
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handlePomEnd();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handlePomEnd = async () => {
    setIsRunning(false);
    if (pomMode === 'work') {
      setSessions(s => s + 1);
      const res = await api.post('/auth/add-points', { points: 15 });
      setPoints(res.data.points);
      alert('🍅 Pomodoro done! +15 pts earned!');
      setPomMode('break');
      setTimeLeft(5 * 60);
    } else {
      setPomMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const handleComplete = async (task) => {
    if (task.status === 'completed') return;
    const res = await dispatch(updateTask({ id: task._id, status: 'completed' }));
    const pointRes = await api.get('/auth/me');
    setPoints(pointRes.data.points);
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total tasks', value: tasks.length, color: 'white' },
          { label: 'Completed', value: completed, color: '#4ade80' },
          { label: 'In progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#fbbf24' },
          { label: 'Pomodoros', value: sessions, color: '#c084fc' },
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
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>My Tasks</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'todo', 'in-progress', 'completed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? '#e94560' : 'transparent',
                  border: '1px solid ' + (filter === f ? '#e94560' : '#333'),
                  color: 'white', padding: '4px 10px', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '11px'
                }}>{f}</button>
              ))}
              <button onClick={() => setShowModal(true)} style={{ background: '#e94560', border: 'none', color: 'white', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>+ Add</button>
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
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Pomodoro */}
          <div style={{ background: '#1a1a2e', border: '2px solid #e94560', borderRadius: '12px', padding: '20px', textAlign: 'center', fontFamily: "'Press Start 2P', monospace" }}>
            <p style={{ fontSize: '9px', color: pomMode === 'work' ? '#a8dadc' : '#4ade80', margin: '0 0 8px' }}>
              {pomMode === 'work' ? '🍅 FOCUS' : '☕ BREAK'} · {sessions} done
            </p>
            <p style={{ fontSize: '32px', color: pomMode === 'work' ? '#e94560' : '#4ade80', margin: '0 0 16px' }}>
              {mins}:{secs}
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={() => setIsRunning(r => !r)} style={{
                background: '#e94560', border: 'none', color: 'white',
                padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '8px', borderRadius: '4px'
              }}>{isRunning ? '⏸ PAUSE' : '▶ START'}</button>
              <button onClick={() => { clearInterval(timerRef.current); setIsRunning(false); setTimeLeft(pomMode === 'work' ? 25*60 : 5*60); }} style={{
                background: 'transparent', border: '2px solid #e94560', color: 'white',
                padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '8px', borderRadius: '4px'
              }}>↺</button>
            </div>
            <p style={{ fontSize: '8px', color: '#ffd700', margin: '12px 0 0' }}>finish = +15 pts</p>
          </div>

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
    </div>
  );
}