import { Link, NavLink, Outlet } from 'react-router';
import { useSession } from '../session/useSession';
import './Layout.css';

const navLinks = [
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/profile', label: 'Profile' },
];

export function Layout() {
  const { user, logout } = useSession();

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <Link to="/catalogue" className="header__brand">
            Vandelay Industries
          </Link>
          {user && (
            <nav className="header__nav">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} className="header__link">
                  {label}
                </NavLink>
              ))}
              <span className="header__user">
                <img className="header__avatar" src={user.avatar} alt="" />
                {user.name.split(' ')[0]}
              </span>
              <button type="button" className="header__logout" onClick={logout}>
                Log out
              </button>
            </nav>
          )}
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}
