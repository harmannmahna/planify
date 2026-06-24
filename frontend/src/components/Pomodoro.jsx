import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export default function Pomodoro({ onPointsEarned }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // work | break
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            handleSessionEnd();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const handleSessionEnd = async () => {
    setIsRunning(false);
    if (mode === 'work') {
      setSessions(s => s + 1);
      // Award 15 points for completing a pomodoro
      try {
        await api.post('/room/add-points', { points: 15 });
        onPointsEarned?.(15);
      } catch (e) {}
      setMode('break');
      setTimeLeft(5 * 60);
      alert('🍅 Pomodoro done! +15 points. Take a 5 min break!');
    } else {
      setMode('work');
      setTimeLeft(25 * 60);
      alert('Break over! Back to work 💪');
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <div style={{
      fontFamily: "'Press Start 2P', monospace",
      background: '#16213e', border: '3px solid #e94560',
      padding: '20px', textAlign: 'center', color: 'white'
    }}>
      <div style={{ fontSize: '10px', color: '#a8dadc', marginBottom: '10px' }}>
        {mode === 'work' ? '🍅 FOCUS' : '☕ BREAK'} | Sessions: {sessions}
      </div>
      <div style={{ fontSize: '32px', color: mode === 'work' ? '#e94560' : '#4ade80', marginBottom: '15px' }}>
        {mins}:{secs}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => setIsRunning(r => !r)} style={{
          background: '#e94560', border: 'none', color: 'white',
          padding: '8px 16px', cursor: 'pointer', fontSize: '8px',
          fontFamily: 'inherit'
        }}>
          {isRunning ? '⏸ PAUSE' : '▶ START'}
        </button>
        <button onClick={reset} style={{
          background: '#0f3460', border: '2px solid #e94560', color: 'white',
          padding: '8px 16px', cursor: 'pointer', fontSize: '8px',
          fontFamily: 'inherit'
        }}>
          ↺ RESET
        </button>
      </div>
    </div>
  );
}