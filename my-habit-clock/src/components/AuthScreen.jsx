import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="app-shell">
      <div className="app-eyebrow">Daily Rhythm</div>
      <h1 className="app-title">Habit Clock</h1>
      <div className="panel">
        <h3 className="panel-title">{isSignUp ? 'Create Account' : 'Log In'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="goal-row">
            <label>Email</label>
            <input
              type="email"
              className="goal-input"
              style={{ width: '220px', textAlign: 'left' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="goal-row">
            <label>Password</label>
            <input
              type="password"
              className="goal-input"
              style={{ width: '220px', textAlign: 'left' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <p style={{ color: 'var(--work)', fontSize: '0.8rem' }}>{error}</p>}
          <button type="submit" className="save-btn">{isSignUp ? 'Sign Up' : 'Log In'}</button>
        </form>
        <p
          style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}