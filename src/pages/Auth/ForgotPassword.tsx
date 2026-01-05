import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { startPasswordReset, confirmPasswordReset } from '../../services/authService';
import './Auth.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canRequest = email.trim() !== '' && !loading;
  const canConfirm = code.trim() !== '' && newPassword.trim() !== '' && !loading;

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!canRequest) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await startPasswordReset(email);
      setSuccess('Code sent. Check your email.');
      setStage('confirm');
    } catch (err: any) {
      setError(err?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!canConfirm) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await confirmPasswordReset(email, code, newPassword);
      setSuccess('Password reset successful. Redirecting to login…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <h1>Forgot password</h1>
      <p className="helper">Enter your email to get a verification code, then set a new password.</p>

      {stage === 'request' && (
        <form className="auth-form" onSubmit={handleRequest}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <div className="auth-actions-row">
            <button className="auth-submit" type="submit" disabled={!canRequest}>
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </div>

          <div className="auth-link-row">
            Remembered it? <Link to="/login">Log in</Link>
          </div>
        </form>
      )}

      {stage === 'confirm' && (
        <form className="auth-form" onSubmit={handleConfirm}>
          <label>
            Verification code
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
          </label>
          <label>
            New password
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </label>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <div className="auth-actions-row">
            <button className="auth-submit" type="submit" disabled={!canConfirm}>
              {loading ? 'Updating…' : 'Reset password'}
            </button>
            <button className="auth-secondary" type="button" onClick={handleRequest} disabled={loading}>
              Resend code
            </button>
          </div>

          <div className="auth-link-row">
            Back to <Link to="/login">Log in</Link>
          </div>
        </form>
      )}
    </section>
  );
}
