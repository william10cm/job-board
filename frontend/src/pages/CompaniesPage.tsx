import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Company } from '../types';
import api from '../api/axios';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/companies')
      .then(res => setCompanies(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-msg">Loading companies...</p>;

  return (
    <div>
      <h1 className="page-title">Companies</h1>
      {companies.length === 0 ? (
        <p className="status-msg">No companies listed yet.</p>
      ) : (
        <div className="jobs-grid">
          {companies.map(c => (
            <Link to={`/companies/${c.id}`} key={c.id} className="job-card">
              <h3 className="job-title">{c.name}</h3>
              <p className="job-location">{c.location}</p>
              <p className="job-date">{c.website}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;