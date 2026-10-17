import { LogOut, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useSession } from '../session/useSession';
import './UserMenu.css';

export function UserMenu() {
  const { user, logout } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="user-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
      >
        <img className="user-menu__avatar" src={user.avatar} alt="" />
      </button>

      {open && (
        <div className="user-menu__dropdown" role="menu">
          <div className="user-menu__header">
            <img className="user-menu__avatar user-menu__avatar--large" src={user.avatar} alt="" />
            <div>
              <div className="user-menu__name">{user.name}</div>
              <div className="user-menu__style">{user.preferredStyle} style</div>
            </div>
          </div>
          <Link
            to="/profile"
            className="user-menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <User size={18} />
            My profile
          </Link>
          <button type="button" className="user-menu__item" role="menuitem" onClick={logout}>
            <LogOut size={18} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
