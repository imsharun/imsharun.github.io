import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, confirmEmail, resendEmailCode } from '../../services/authService';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [code, setCode] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const canSubmit = email.trim() && password.trim() && fullName.trim() && phone.trim() && address.trim() && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signup(email, password, fullName, phone, address);
      setNeedsConfirmation(true);
      setSuccess('Signup successful. Enter the verification code sent to your email.');
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!code.trim()) return;
    setError(null);
    setSuccess(null);
    setConfirmLoading(true);
    try {
      await confirmEmail(email, code.trim());
      setSuccess('Email verified! You can now log in.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setConfirmLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setSuccess(null);
    setResendLoading(true);
    try {
      await resendEmailCode(email);
      setSuccess('Verification code resent. Check your email.');
    } catch (err: any) {
      setError(err?.message || 'Could not resend code');
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <h1>Sign up</h1>
      <p className="helper">Create your account to start shopping and checkout securely.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Phone
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label>
          Address
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {needsConfirmation && (
          <>
            <label>
              Verification code
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
            </label>
            <div className="auth-actions-row">
              <button className="auth-submit" type="button" onClick={handleConfirm} disabled={!code.trim() || confirmLoading}>
                {confirmLoading ? 'Verifying…' : 'Confirm code'}
              </button>
              <button className="auth-secondary" type="button" onClick={handleResend} disabled={resendLoading}>
                {resendLoading ? 'Resending…' : 'Resend code'}
              </button>
            </div>
          </>
        )}

        <div className="auth-actions-row">
          <button className="auth-submit" type="submit" disabled={!canSubmit}>
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </div>

        <div className="auth-link-row">
          Already have an account?
          <Link to="/login">Log in</Link>
        </div>
      </form>
    </section>
  );
}
