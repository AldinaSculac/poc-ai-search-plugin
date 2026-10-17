import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { users } from '../data/users';
import { SessionContext } from './SessionContext';
import { clearSession, loadSessionUserId, saveSessionUserId } from './sessionStorage';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(loadSessionUserId);
  const user = users.find((candidate) => candidate.id === userId) ?? null;

  const login = useCallback((id: string) => {
    saveSessionUserId(id);
    setUserId(id);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUserId(null);
  }, []);

  const session = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <SessionContext value={session}>{children}</SessionContext>;
}
