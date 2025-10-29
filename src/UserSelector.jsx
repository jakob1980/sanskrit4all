// src/UserSelector.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext.jsx';

function UserSelector() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const { setCurrentUser } = useUser();

  // Carica la lista di utenti all'avvio
  useEffect(() => {
    const loadUsers = async () => {
      if (window.electronAPI) {
        const userList = await window.electronAPI.getUsers();
        setUsers(userList);
      }
    };
    loadUsers();
  }, []);

  const handleSelectUser = (user) => {
    setCurrentUser(user);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (newUserName.trim() && window.electronAPI) {
      const newUser = await window.electronAPI.createUser(newUserName.trim());
      setUsers([...users, newUser]);
      setNewUserName('');
      handleSelectUser(newUser); // Seleziona automaticamente il nuovo utente
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>👋 Benvenuto!</h1>
      <p>Seleziona il tuo profilo o creane uno nuovo per iniziare.</p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Profili Esistenti:</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user)}
              style={{
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                border: '2px solid #007bff',
                borderRadius: '8px',
                backgroundColor: '#f0f8ff',
              }}
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleCreateUser} style={{ marginTop: '2rem' }}>
        <h3>Crea Nuovo Profilo:</h3>
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Inserisci il tuo nome"
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Crea</button>
      </form>
    </div>
  );
}

export default UserSelector;
