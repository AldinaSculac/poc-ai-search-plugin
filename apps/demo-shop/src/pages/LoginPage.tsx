import { useNavigate } from 'react-router';
import { users } from '../data/users';
import { saveSessionUserId } from '../session/sessionStorage';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();

  function login(userId: string) {
    saveSessionUserId(userId);
    navigate('/catalogue');
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
