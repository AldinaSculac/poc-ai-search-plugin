import { createContext } from 'react';
import type { UserProfile } from '../types';

export interface Session {
  user: UserProfile | null;
  login: (userId: string) => void;
  logout: () => void;
}

export const SessionContext = createContext<Session | null>(null);
