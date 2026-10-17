import { Link } from 'react-router';
import './Logo.css';

export function Logo() {
  return (
    <Link to="/catalogue" className="logo" aria-label="Vandelay Industries home">
      <svg className="logo__mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="currentColor" />
        <path d="M7.5 8h4.6l3.9 11.2L19.9 8h4.6l-6.4 16h-4.2z" fill="var(--surface)" />
      </svg>
      <span className="logo__text">
        <span className="logo__name">Vandelay</span>
        <span className="logo__tagline">Industries</span>
      </span>
    </Link>
  );
}
