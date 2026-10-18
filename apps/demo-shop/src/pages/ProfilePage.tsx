import { Cake, Footprints, Info, Ruler, Sparkles, User, Weight } from 'lucide-react';
import { ApiKeySettings } from '../components/ApiKeySettings';
import { useSession } from '../session/useSession';
import { capitalize } from '../utils/format';
import './ProfilePage.css';

const genderLabel = { women: 'Women', men: 'Men' };

export function ProfilePage() {
  const { user } = useSession();
  // The route is protected, so a user is always present here.
  if (!user) return null;

  const stats = [
    { icon: Ruler, label: 'Height', value: `${user.heightCm} cm` },
    { icon: Weight, label: 'Weight', value: `${user.weightKg} kg` },
    { icon: Footprints, label: 'Shoe size', value: `EU ${user.shoeSizeEu}` },
    { icon: Cake, label: 'Age', value: `${user.age} years` },
    { icon: User, label: 'Shops for', value: genderLabel[user.gender] },
    { icon: Sparkles, label: 'Preferred style', value: capitalize(user.preferredStyle) },
  ];

  return (
    <div className="profile">
      <section className="profile__hero">
        <img className="profile__avatar" src={user.avatar} alt="" />
        <div>
          <p className="profile__eyebrow">My account</p>
          <h1 className="profile__name">{user.name}</h1>
          <span className="profile__style">{user.preferredStyle} style</span>
        </div>
      </section>

      <section>
        <h2 className="profile__section-title">Your fit profile</h2>
        <ul className="profile__stats">
          {stats.map(({ icon: Icon, label, value }) => (
            <li key={label} className="profile__stat">
              <Icon className="profile__stat-icon" size={20} />
              <span className="profile__stat-label">{label}</span>
              <span className="profile__stat-value">{value}</span>
            </li>
          ))}
        </ul>
        <p className="profile__note">
          <Info size={16} />
          Our AI search uses your fit profile to suggest the right sizes and styles for you.
        </p>
      </section>

      <section>
        <h2 className="profile__section-title">AI search</h2>
        <ApiKeySettings />
      </section>
    </div>
  );
}
