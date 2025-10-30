import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext.jsx';
import { register, login } from '../services/userService.js';

function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setCurrentUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await login(email, password);
      } else {
        user = await register(name, email, password);
      }
      setCurrentUser(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h1>{isLogin ? 'Accedi' : 'Registrati'}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min. 8 caratteri)"
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '0.75rem' }}>
          {isLoading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
        </button>
      </form>
      
      <p style={{ marginTop: '1rem' }}>
        {isLogin ? "Non hai un account?" : "Hai già un account?"}
        <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
          {isLogin ? 'Registrati' : 'Accedi'}
        </button>
      </p>
    </div>
  );
}

export default LoginScreen;
