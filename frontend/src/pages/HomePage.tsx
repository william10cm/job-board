import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import type { Job } from '../types';
import api from '../api/axios';
import '../styles/home.css';

const HomePage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [jobType, setJobType] = useState(searchParams.get('job_type') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const fetchJobs = (q: string, job_type: string, location: string) => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (job_type) params.job_type = job_type;
    if (location) params.location = location;

    const hasFilters = Object.keys(params).length > 0;
    const endpoint = hasFilters
      ? `/api/jobs/search?${new URLSearchParams(params)}`
      : '/api/jobs';

    api.get(endpoint)
      .then(res => setJobs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs(query, jobType, location);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (jobType) params.job_type = jobType;
    if (location) params.location = location;
    setSearchParams(params);
    fetchJobs(query, jobType, location);
  };

  const handleClear = () => {
    setQuery('');
    setJobType('');
    setLocation('');
    setSearchParams({});
    fetchJobs('', '', '');
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Find Your Next Job</h1>
        <p>Browse the latest openings from top companies</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title, skill, keyword..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="search-input search-input-sm"
        />
        <select
          value={jobType}
          onChange={e => setJobType(e.target.value)}
          className="search-select"
        >
          <option value="">All types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="remote">Remote</option>
        </select>
        <button type="submit" className="btn-search">Search</button>
        {(query || jobType || location) && (
          <button type="button" className="btn-clear" onClick={handleClear}>
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <p className="status-msg">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="status-msg">No jobs found. Try a different search.</p>
      ) : (
        <>
          <p className="results-count">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
          <div className="jobs-grid">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;