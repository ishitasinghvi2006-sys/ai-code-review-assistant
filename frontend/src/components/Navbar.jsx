import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/dashboard" className="text-xl font-bold text-blue-600">
        AI Code Review
      </Link>
      <div className="flex gap-6">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/new-review" className="text-gray-700 hover:text-blue-600">
          New Review
        </Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;