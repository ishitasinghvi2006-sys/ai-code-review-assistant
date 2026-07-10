import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      const res = await api.get(`/reviews/${id}`);
      setReview(res.data);
    } catch (err) {
      setError('Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!review) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link to="/dashboard" className="text-blue-600 text-sm mb-4 inline-block">
        &larr; Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">{review.title}</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {review.language} &middot; {review.sourceType} &middot;{' '}
        {new Date(review.createdAt).toLocaleString()}
      </p>

      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-8">
        <pre className="text-sm font-mono whitespace-pre-wrap">{review.code}</pre>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">Static Analysis</h2>
          {review.staticIssues && review.staticIssues.length > 0 ? (
            <ul className="space-y-2">
              {review.staticIssues.map((issue) => (
                <li key={issue.id} className="text-sm border-l-4 border-yellow-400 pl-3">
                  <span className="font-medium">{issue.type}</span>: {issue.message}
                  {issue.line && <span className="text-gray-400"> (line {issue.line})</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No static analysis run yet.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">AI Review</h2>
          {review.aiIssues && review.aiIssues.length > 0 ? (
            <ul className="space-y-2">
              {review.aiIssues.map((issue) => (
                <li key={issue.id} className="text-sm border-l-4 border-blue-400 pl-3">
                  <span className="font-medium">{issue.category}</span>: {issue.message}
                  <p className="text-gray-500 mt-1">{issue.suggestion}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No AI review run yet.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">Complexity Metrics</h2>
          {review.metrics ? (
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Cyclomatic</p>
                <p className="font-semibold">{review.metrics.cyclomaticComplexity}</p>
              </div>
              <div>
                <p className="text-gray-500">Functions</p>
                <p className="font-semibold">{review.metrics.functionCount}</p>
              </div>
              <div>
                <p className="text-gray-500">Classes</p>
                <p className="font-semibold">{review.metrics.classCount}</p>
              </div>
              <div>
                <p className="text-gray-500">Lines of Code</p>
                <p className="font-semibold">{review.metrics.linesOfCode}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No metrics calculated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewDetail;