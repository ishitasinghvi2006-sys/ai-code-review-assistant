import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { name, email });
      const token = localStorage.getItem('token');
      login(res.data, token);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = (name || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-[#1C1E26] mb-1">Profile</h1>
      <p className="font-mono-ui text-xs text-gray-500 mb-8">manage your account details</p>

      <div className="bg-white border border-[#E5E3DC] rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E3DC]">
          <div className="w-14 h-14 rounded-full bg-[#1C1E26] text-white flex items-center justify-center font-display text-lg">
            {initials}
          </div>
          <div>
            <p className="font-display font-medium text-[#1C1E26]">{user?.name}</p>
            <p className="font-mono-ui text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8A33D] focus:border-transparent"
            required
          />

          <label className="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8A33D] focus:border-transparent"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1C1E26] text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2d303e] disabled:opacity-50 transition"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;