import { Link, NavLink, Outlet } from 'react-router';
import './Layout.css';

const navLinks = [
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/profile', label: 'Profile' },
  { to: '/login', label: 'Login' },
];

export function Layout() {
  return (
    <>
      <header className="header">
        <div className="header__inner">
          <Link to="/catalogue" className="header__brand">
            Vandelay Industries
          </Link>
          <nav className="header__nav">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className="header__link">
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}
