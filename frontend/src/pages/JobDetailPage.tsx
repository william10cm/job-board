import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles/jobdetail.css';

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/api/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(() => setMessage('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      await api.post(`/api/applications/jobs/${id}/apply`, { cover_letter: coverLetter });
      setApplied(true);
      setMessage('Application submitted successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="status-msg">Loading job...</p>;
  if (!job) return <p className="status-msg error">{message}</p>;

  return (
    <div className="job-detail-page">
      <div className="job-detail-card">
        <div className="job-detail-header">
          <div>
            <h1>{job.title}</h1>
            <p className="job-detail-company">{job.company_name}</p>
            <p className="job-detail-meta">{job.location} · {job.job_type}</p>
          </div>
          <span className={`job-type-badge ${job.job_type.replace('-', '')}`}>
            {job.job_type}
          </span>
        </div>

        <div className="job-detail-description">
          <h2>About the role</h2>
          <p>{job.description}</p>
        </div>

        {message && (
          <p className={`apply-message ${applied ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        {!applied && (
          <div className="apply-section">
            <h2>Apply for this position</h2>
            <textarea
              className="cover-letter-input"
              placeholder="Write a short cover letter (optional)..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              rows={5}
            />
            <button
              className="btn-primary"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;
