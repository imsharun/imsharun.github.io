import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim() !== '' && password.trim() !== '' && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <h1>Log in</h1>
      <p className="helper">Access your account to manage your cart and checkout securely.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-actions-row">
          <button className="auth-submit" type="submit" disabled={!canSubmit}>
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </div>

        <div className="auth-link-row">
          Don’t have an account?
          <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </section>
  );
}
