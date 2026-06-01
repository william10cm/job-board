import { Link } from 'react-router-dom';
import type { Job } from '../types';
import '../styles/jobcard.css';

interface Props {
  job: Job;
}

const JobCard = ({ job }: Props) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <Link to={`/jobs/${job.id}`} className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <span className={`job-type-badge ${job.job_type.replace('-', '')}`}>
          {job.job_type}
        </span>
      </div>
      <p className="job-company">{job.company_name}</p>
      <p className="job-location">{job.location || 'Location not specified'}</p>
      <p className="job-date">Posted {formatDate(job.created_at)}</p>
    </Link>
  );
};

export default JobCard;