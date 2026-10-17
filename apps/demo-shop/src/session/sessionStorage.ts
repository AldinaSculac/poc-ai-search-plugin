const SESSION_KEY = 'demo-shop.userId';

export function saveSessionUserId(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

export function loadSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
