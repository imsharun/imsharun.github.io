import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-container">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-description">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found-link">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
