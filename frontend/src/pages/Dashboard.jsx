import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

function languageStyles(language) {
  switch (language) {
    case 'javascript':
      return { dot: 'bg-amber-400', text: 'text-amber-800', bg: 'bg-amber-50' };
    case 'typescript':
      return { dot: 'bg-blue-400', text: 'text-blue-800', bg: 'bg-blue-50' };
    case 'python':
      return { dot: 'bg-emerald-400', text: 'text-emerald-800', bg: 'bg-emerald-50' };
    case 'java':
      return { dot: 'bg-orange-400', text: 'text-orange-800', bg: 'bg-orange-50' };
    default:
      return { dot: 'bg-gray-400', text: 'text-gray-700', bg: 'bg-gray-50' };
  }
}

function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [sourceType, setSourceType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchReviews();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, language, sourceType]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (language) params.language = language;
      if (sourceType) params.sourceType = sourceType;

      const res = await api.get('/reviews', { params });
      setReviews(res.data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    e.preventDefault();

    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm">Delete this review?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/reviews/${id}`);
                setReviews((prev) => prev.filter((r) => r.id !== id));
                toast.success('Review deleted');
              } catch (err) {
                toast.error('Failed to delete review');
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const clearFilters = () => {
    setSearch('');
    setLanguage('');
    setSourceType('');
  };

  const hasActiveFilters = search || language || sourceType;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#1C1E26]">Your Reviews</h1>
          <p className="font-mono-ui text-xs text-gray-500 mt-1">
            {loading ? 'loading…' : `${reviews.length} review${reviews.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button
          onClick={() => navigate('/new-review')}
          className="bg-[#1C1E26] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2d303e] transition"
        >
          + New Review
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white border border-[#E5E3DC] rounded-xl p-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title…"
          className="flex-1 min-w-[180px] px-3 py-2 text-sm bg-transparent focus:outline-none"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border-l border-[#E5E3DC] px-3 py-2 text-sm bg-transparent focus:outline-none text-gray-700"
        >
          <option value="">All Languages</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="other">Other</option>
        </select>
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="border-l border-[#E5E3DC] px-3 py-2 text-sm bg-transparent focus:outline-none text-gray-700"
        >
          <option value="">All Sources</option>
          <option value="paste">Pasted</option>
          <option value="upload">Uploaded</option>
        </select>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-gray-700 px-3 font-mono-ui"
          >
            clear ×
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[72px] bg-white border border-[#E5E3DC] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-[#E5E3DC] rounded-xl">
          <p className="font-display text-lg text-gray-700 mb-1">
            {hasActiveFilters ? 'Nothing matches' : 'No reviews yet'}
          </p>
          <p className="text-sm text-gray-400">
            {hasActiveFilters
              ? 'Try a different search or filter combination.'
              : 'Submit your first snippet to see AI feedback here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {reviews.map((review) => {
            const lang = languageStyles(review.language);
            const isUpload = review.sourceType === 'upload';
            return (
              <Link
                key={review.id}
                to={`/review/${review.id}`}
                className="group flex items-center gap-4 bg-white border border-[#E5E3DC] rounded-xl pl-0 pr-4 py-3.5 hover:border-[#1C1E26]/20 hover:shadow-sm transition overflow-hidden"
              >
                <span
                  className={`self-stretch w-1 rounded-r-full shrink-0 ${isUpload ? 'bg-indigo-400' : 'bg-amber-400'}`}
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-display font-medium text-[#1C1E26] truncate">{review.title}</h2>
                  <div className="flex items-center gap-2 mt-1 font-mono-ui text-xs text-gray-500">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${lang.bg} ${lang.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${lang.dot}`} />
                      {review.language}
                    </span>
                    <span>·</span>
                    <span>{isUpload ? 'uploaded' : 'pasted'}</span>
                    <span>·</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(review.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-red-600 transition px-2"
                >
                  Delete
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;