import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { changePassword, getUserProfile, type UserProfile, logout } from '../../services/authService';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const data = await getUserProfile();
      if (!active) return;
      if (!data) {
        navigate('/login', { replace: true });
        return;
      }
      setProfile(data);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword.trim() || !newPassword.trim()) {
      setError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.message || 'Could not update password.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">Loading profile...</div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <header className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your account details and password.</p>
          </div>
          <button type="button" className="outline" onClick={handleLogout}>
            Log out
          </button>
        </header>

        <section className="profile-section">
          <h2>Account</h2>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{profile.email || 'Not set'}</dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>{profile.name || 'Not set'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{profile.phoneNumber || 'Not set'}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{profile.address || 'Not set'}</dd>
            </div>
          </dl>
        </section>

        <section className="profile-section">
          <h2>Update Password</h2>
          <form className="profile-form" onSubmit={handlePasswordUpdate}>
            <label>
              Current password
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
            <label>
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>

            {error && <div className="profile-error">{error}</div>}
            {success && <div className="profile-success">{success}</div>}

            <button type="submit" disabled={saving}>
              {saving ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}