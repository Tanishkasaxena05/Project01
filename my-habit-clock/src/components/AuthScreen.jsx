import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell" style={{ paddingTop: '80px' }}>
      <div className="brand" style={{ justifyContent: 'center', marginBottom: '32px' }}>
        <div className="brand-mark">HC</div>
        <div className="brand-name" style={{ fontSize: '1.15rem' }}>Habit Clock</div>
      </div>
      <div className="panel">
        <div className="panel-header"><span className="bar" /><h3 className="panel-title">{isSignUp ? 'Create account' : 'Welcome back'}</h3></div>
        <form onSubmit={handleSubmit}>
          <div className="auth-input-row">
            <label>Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-row">
            <label>Password</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <p style={{ color: 'var(--work)', fontSize: '0.8rem', marginTop: '-6px' }}>{error}</p>}
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Log in'}
          </button>
        </form>
        <p
          style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}