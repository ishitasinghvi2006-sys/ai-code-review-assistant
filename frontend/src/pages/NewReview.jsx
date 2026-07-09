import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function NewReview() {
  const [mode, setMode] = useState('paste'); // 'paste' or 'upload'
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
        res = await api.post('/reviews', {
          title,
          language,
          sourceType: 'paste',
          code,
        });
      }
      navigate(`/review/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">New Code Review</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('paste')}
          className={`px-4 py-2 rounded ${mode === 'paste' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Paste Code
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`px-4 py-2 rounded ${mode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Upload File
        </button>
      </div>

      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="e.g. Login form validation"
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="other">Other</option>
        </select>

        {mode === 'paste' ? (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-6 font-mono text-sm h-64"
              placeholder="Paste your code here..."
              required
            />
          </>
        ) : (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded px-3 py-2 mb-6"
              required
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}

export default NewReview;