import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, confirmEmail, resendEmailCode } from '../../services/authService';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [code, setCode] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const canSubmit = email.trim() !== '' && password.trim() !== '' && !loading;
  const canConfirm = code.trim() !== '' && !confirmLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const result = await login(email, password);

      if (result?.isSignedIn) {
        navigate('/');
        return;
      }

      const step = result?.nextStep?.signInStep;
      if (step === 'CONFIRM_SIGN_UP') {
        setNeedsConfirm(true);
        setError('Account not verified. Enter the code sent to your email or resend it.');
      } else if (step) {
        setError(`Login requires step: ${step}`);
      } else {
        setError('Login requires an additional step.');
      }
    } catch (err: any) {
      const name = err?.name as string | undefined;
      const msg = err?.message || 'Login failed';
      if (name === 'UserNotConfirmedException') {
        setNeedsConfirm(true);
        setError('Account not verified. Enter the code sent to your email or resend it.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!canConfirm) return;
    setError(null);
    setConfirmLoading(true);
    try {
      await confirmEmail(email, code.trim());
      setNeedsConfirm(false);
      setCode('');
      setError(null);
      const result = await login(email, password);
      if (result?.isSignedIn) {
        navigate('/');
        return;
      }
      const step = result?.nextStep?.signInStep;
      setError(step ? `Login requires step: ${step}` : 'Login requires an additional step.');
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setConfirmLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setResendLoading(true);
    try {
      await resendEmailCode(email);
      setError('Verification code resent. Check your email.');
    } catch (err: any) {
      setError(err?.message || 'Could not resend code');
    } finally {
      setResendLoading(false);
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

        {needsConfirm && (
          <>
            <label>
              Verification code
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
            </label>
            <div className="auth-actions-row">
              <button className="auth-submit" type="button" onClick={handleConfirm} disabled={!canConfirm}>
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
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </div>

        <div className="auth-link-row">
          Don’t have an account?
          <Link to="/signup">Sign up</Link>
          {' '}|{' '}
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </section>
  );
}
