import { Navigate } from 'react-router';
import { users } from '../data/users';
import { useSession } from '../session/useSession';
import './LoginPage.css';

export function LoginPage() {
  const { user: currentUser, login } = useSession();

  // Also handles the redirect right after login, since login() updates the session.
  if (currentUser) {
    return <Navigate to="/catalogue" replace />;
  }

  return (
    <section className="login">
      <h1 className="login__title">Who's shopping today?</h1>
      <p className="login__subtitle">Pick a profile to sign in. No password needed.</p>
      <ul className="login__grid">
        {users.map((user) => (
          <li key={user.id}>
            <button type="button" className="profile-card" onClick={() => login(user.id)}>
              <img className="profile-card__avatar" src={user.avatar} alt="" />
              <span className="profile-card__name">{user.name}</span>
              <span className="profile-card__style">{user.preferredStyle}</span>
              <span className="profile-card__details">
                {user.heightCm} cm · {user.weightKg} kg · EU {user.shoeSizeEu}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
