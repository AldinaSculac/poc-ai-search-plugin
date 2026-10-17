import { Search, ShoppingBag } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';
import { useSession } from '../session/useSession';
import { Footer } from './Footer';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import './Layout.css';

export function Layout() {
  const { user } = useSession();

  return (
    <>
      <div className="announcement">Free shipping over €75 · 30-day returns</div>
      <header className="header">
        <div className="header__inner">
          <Logo />
          {user && (
            <>
              <nav className="header__nav">
                <NavLink to="/catalogue" className="header__link">
                  Catalogue
                </NavLink>
              </nav>
              <div className="header__actions">
                <button type="button" className="icon-button" aria-label="Search">
                  <Search size={20} />
                </button>
                <button type="button" className="icon-button" aria-label="Shopping bag">
                  <ShoppingBag size={20} />
                  <span className="header__badge">0</span>
                </button>
                <UserMenu />
              </div>
            </>
          )}
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
