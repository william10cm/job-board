import { useEffect, useState } from 'react';
import type { Application } from '../types';
import api from '../api/axios';
import '../styles/applications.css';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/applications/mine')
      .then(res => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status: string) => {
    if (status === 'accepted') return 'status-accepted';
    if (status === 'rejected') return 'status-rejected';
    return 'status-pending';
  };

  if (loading) return <p className="status-msg">Loading applications...</p>;

  return (
    <div>
      <h1 className="page-title">My Applications</h1>
      {applications.length === 0 ? (
        <p className="status-msg">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map(app => (
            <div key={app.id} className="application-card">
              <div className="application-info">
                <h3>{app.job_title}</h3>
                <p className="application-company">{app.company_name}</p>
                <p className="application-date">
                  Applied {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`application-status ${statusColor(app.status)}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;