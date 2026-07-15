import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-medium transition ${
          active ? 'text-[#1C1E26]' : 'text-gray-400 hover:text-[#1C1E26]'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-[#FAFAF8]/90 backdrop-blur border-b border-[#E5E3DC] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <Link to={user ? '/dashboard' : '/login'} className="font-display text-lg font-semibold text-[#1C1E26] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#E8A33D]" />
        AI Code Review
      </Link>
      <div className="flex gap-7 items-center">
        {user ? (
          <>
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/new-review', 'New Review')}
            {navLink('/profile', 'Profile')}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-400 hover:text-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {navLink('/login', 'Login')}
            {navLink('/signup', 'Sign Up')}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;