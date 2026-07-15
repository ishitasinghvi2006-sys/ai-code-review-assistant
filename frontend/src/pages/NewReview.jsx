import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

function NewReview() {
  const [mode, setMode] = useState('paste');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (mode === 'upload' && file) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('language', language);
        formData.append('sourceType', 'upload');
        formData.append('file', file);
        res = await api.post('/reviews', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/reviews', { title, language, sourceType: 'paste', code });
      }
      toast.success('Review submitted — analyzing your code…');
      navigate(`/review/${res.data.id}`);
    } catch (err) {
      if (!err.response) {
        toast.error('Cannot connect to server. Please try again.');
      } else {
        toast.error(err.response?.data?.error || 'Failed to submit review');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-[#1C1E26] mb-1">New Review</h1>
      <p className="font-mono-ui text-xs text-gray-500 mb-8">paste code or upload a file to get feedback</p>

      <div className="bg-white border border-[#E5E3DC] rounded-xl p-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#FAFAF8] p-1 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setMode('paste')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              mode === 'paste' ? 'bg-white shadow-sm text-[#1C1E26]' : 'text-gray-500'
            }`}
          >
            Paste Code
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              mode === 'upload' ? 'bg-white shadow-sm text-[#1C1E26]' : 'text-gray-500'
            }`}
          >
            Upload File
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8A33D] focus:border-transparent"
            placeholder="e.g. Login form validation"
            required
          />

          <label className="block mb-1.5 text-sm font-medium text-gray-700">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8A33D] focus:border-transparent"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="other">Other</option>
          </select>

          {mode === 'paste' ? (
            <>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Code</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-6 font-mono-ui text-sm h-56 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] focus:border-transparent"
                placeholder="Paste your code here..."
                required
              />
            </>
          ) : (
            <>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">File</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-8 mb-6 cursor-pointer hover:border-[#E8A33D] transition">
                <span className="font-mono-ui text-sm text-gray-500">
                  {file ? file.name : 'Click to choose a file (.js, .py, .ts, .java...)'}
                </span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  required
                />
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1E26] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#2d303e] disabled:opacity-50 transition"
          >
            {loading ? 'Submitting…' : 'Submit for Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewReview;