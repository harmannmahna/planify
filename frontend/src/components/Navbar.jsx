import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-indigo-600">TaskFlow</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          {user?.name} <span className="text-xs text-slate-400">({user?.role})</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
