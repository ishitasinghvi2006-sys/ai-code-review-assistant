import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../api/axios';

function severityStyles(severity) {
  switch (severity) {
    case 'high':
      return { badge: 'bg-red-50 text-red-700 border-red-200', bar: 'bg-red-500', label: 'High' };
    case 'medium':
      return { badge: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-400', label: 'Medium' };
    default:
      return { badge: 'bg-blue-50 text-blue-700 border-blue-200', bar: 'bg-blue-400', label: 'Low' };
  }
}

function languageStyles(language) {
  switch (language) {
    case 'javascript': return { dot: 'bg-amber-400', text: 'text-amber-800', bg: 'bg-amber-50' };
    case 'typescript': return { dot: 'bg-blue-400', text: 'text-blue-800', bg: 'bg-blue-50' };
    case 'python': return { dot: 'bg-emerald-400', text: 'text-emerald-800', bg: 'bg-emerald-50' };
    case 'java': return { dot: 'bg-orange-400', text: 'text-orange-800', bg: 'bg-orange-50' };
    default: return { dot: 'bg-gray-400', text: 'text-gray-700', bg: 'bg-gray-50' };
  }
}

function Section({ title, badge, children }) {
  return (
    <div className="bg-white border border-[#E5E3DC] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-medium text-[#1C1E26]">{title}</h2>
        {badge}
      </div>
      {children}
    </div>
  );
}

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

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-10 text-gray-400 font-mono-ui text-sm">Loading…</div>;
  if (error) return <div className="max-w-4xl mx-auto px-6 py-10 text-red-600 text-sm">{error}</div>;
  if (!review) return null;

  const lang = languageStyles(review.language);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/dashboard" className="font-mono-ui text-xs text-gray-400 hover:text-[#1C1E26] mb-4 inline-block">
        ← back to dashboard
      </Link>

      <h1 className="font-display text-3xl font-semibold text-[#1C1E26] mb-2">{review.title}</h1>
      <div className="flex items-center gap-2 mb-6 font-mono-ui text-xs text-gray-500">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${lang.bg} ${lang.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${lang.dot}`} />
          {review.language}
        </span>
        <span>·</span>
        <span>{review.sourceType}</span>
        <span>·</span>
        <span>{new Date(review.createdAt).toLocaleString()}</span>
      </div>

      <div className="bg-[#1C1E26] text-gray-100 rounded-xl p-5 overflow-x-auto mb-6">
        <pre className="text-sm font-mono-ui whitespace-pre-wrap leading-relaxed">{review.code}</pre>
      </div>

      <div className="grid gap-4">
        <Section
          title="Static Analysis"
          badge={
            review.staticIssues?.length > 0 && (
              <div className="flex gap-1.5 text-xs">
                {['high', 'medium', 'low'].map((sev) => {
                  const count = review.staticIssues.filter((i) => i.severity === sev).length;
                  if (count === 0) return null;
                  const s = severityStyles(sev);
                  return (
                    <span key={sev} className={`px-2 py-0.5 rounded-full border font-mono-ui ${s.badge}`}>
                      {count} {s.label}
                    </span>
                  );
                })}
              </div>
            )
          }
        >
          {review.staticIssues?.length > 0 ? (
            <ul className="space-y-2">
              {[...review.staticIssues]
                .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]))
                .map((issue) => {
                  const s = severityStyles(issue.severity);
                  return (
                    <li key={issue.id} className="flex items-start gap-3 text-sm">
                      <span className={`w-1 self-stretch rounded-full shrink-0 ${s.bar}`} />
                      <div className="flex-1">
                        <span className="font-medium font-mono-ui text-[13px]">{issue.type}</span>: {issue.message}
                        {issue.line && <span className="text-gray-400"> (line {issue.line})</span>}
                      </div>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm">
              ✓ No issues found — clean code!
            </div>
          )}
        </Section>

        <Section title="AI Review">
          {review.aiIssues?.length > 0 ? (
            <ul className="space-y-3">
              {review.aiIssues.map((issue) => (
                <li key={issue.id} className="flex items-start gap-3 text-sm">
                  <span className="w-1 self-stretch rounded-full shrink-0 bg-indigo-400" />
                  <div>
                    <span className="font-medium font-mono-ui text-[13px]">{issue.category}</span>: {issue.message}
                    <p className="text-gray-500 mt-1">{issue.suggestion}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No AI review run yet.</p>
          )}
        </Section>

        <Section title="Complexity Metrics">
          {review.metrics ? (
            <div className="grid grid-cols-4 gap-4">
              {[
                ['Cyclomatic', review.metrics.cyclomaticComplexity],
                ['Functions', review.metrics.functionCount],
                ['Classes', review.metrics.classCount],
                ['Lines', review.metrics.linesOfCode],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 font-mono-ui">{label}</p>
                  <p className="font-display text-xl font-semibold text-[#1C1E26]">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No metrics calculated yet.</p>
          )}
        </Section>

        <Section title="Documentation">
          {review.documentation ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{review.documentation}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No documentation generated yet.</p>
          )}
        </Section>
      </div>
    </div>
  );
}

export default ReviewDetail;