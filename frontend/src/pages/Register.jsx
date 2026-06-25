import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../features/auth/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerUser(form));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  const inputStyle = {
    width: '100%', background: '#0f0f1a',
    border: '2px solid #1e2a4a', color: 'white',
    padding: '10px', fontSize: '9px',
    fontFamily: "'Press Start 2P', monospace",
    outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Press Start 2P', monospace",
      padding: '20px'
    }}>

      {/* Pixel grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, #1a1a2e 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        opacity: 0.6
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '380px',
        background: '#16213e',
        border: '3px solid #e94560',
        padding: '40px 32px',
        boxShadow: '8px 8px 0px #e94560'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>📋</div>
          <h1 style={{
            fontSize: '18px', color: '#e94560',
            margin: '0 0 8px', letterSpacing: '2px'
          }}>PLANIFY</h1>
          <p style={{ fontSize: '7px', color: '#a8dadc', margin: 0 }}>
            CREATE YOUR ACCOUNT
          </p>
        </div>

        {/* Points reminder */}
        <div style={{
          background: '#0f0f1a', border: '1px solid #ffd700',
          padding: '8px', textAlign: 'center',
          marginBottom: '24px', fontSize: '7px', color: '#ffd700'
        }}>
          ⭐ COMPLETE TASKS → EARN POINTS → BUILD YOUR ROOM
        </div>

        {error && (
          <div style={{
            background: '#2d0a0a', border: '2px solid #e94560',
            color: '#e94560', fontSize: '8px',
            padding: '10px', marginBottom: '16px', textAlign: 'center'
          }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '8px', color: '#a8dadc', marginBottom: '8px' }}>
            NAME
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#e94560'}
            onBlur={e => e.target.style.borderColor = '#1e2a4a'}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '8px', color: '#a8dadc', marginBottom: '8px' }}>
            EMAIL
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#e94560'}
            onBlur={e => e.target.style.borderColor = '#1e2a4a'}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '8px', color: '#a8dadc', marginBottom: '8px' }}>
            PASSWORD
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#e94560'}
            onBlur={e => e.target.style.borderColor = '#1e2a4a'}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: '100%', background: '#e94560',
            border: 'none', color: 'white',
            padding: '14px', fontSize: '10px',
            fontFamily: "'Press Start 2P', monospace",
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            letterSpacing: '1px',
            boxShadow: '4px 4px 0px #a01535',
            transition: 'all 0.1s'
          }}
          onMouseDown={e => e.target.style.boxShadow = '2px 2px 0px #a01535'}
          onMouseUp={e => e.target.style.boxShadow = '4px 4px 0px #a01535'}
        >
          {isLoading ? 'CREATING...' : '▶ SIGN UP'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '7px', color: '#a8dadc', marginTop: '24px' }}>
          HAVE AN ACCOUNT?{' '}
          <Link to="/login" style={{ color: '#ffd700', textDecoration: 'none' }}>
            LOG IN →
          </Link>
        </p>

      </div>
    </div>
  );
}