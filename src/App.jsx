// src/App.jsx
import React, { useState, useEffect } from 'react';
import UserSelector from './components/UserSelector.jsx';
import LetterList from './components/LetterList.jsx';
import { UserProvider, useUser } from './contexts/UserContext.jsx';
import { getLetters } from './services/letterService.js';

// Componente interno che accede al contesto
function AppContent() {
  const [letters, setLetters] = useState([]);
  const { currentUser, setCurrentUser } = useUser();

  // Carica le lettere solo quando un utente è stato selezionato
  useEffect(() => {
    if (currentUser && window.electronAPI) {
      const loadLetters = async () => {
        const lettersData = await getLetters(currentUser.id);
        setLetters(lettersData);
      };
      loadLetters();
    } else {
      setLetters([]); // Pulisce le lettere se nessun utente è selezionato
    }
  }, [currentUser]); // Si ri-esegue solo quando l'utente cambia

  // Se non c'è un utente, mostra il selettore
  if (!currentUser) {
    return <UserSelector />;
  }

  // Altrimenti, mostra l'app principale con le lettere
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Aggiungiamo un'intestazione con il pulsante di logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>📖 Sanskrit Learning App</h1>
        <button
          onClick={() => setCurrentUser(null)} // <-- La magia è qui!
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer',
            border: '1px solid #dc3545',
            borderRadius: '8px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
          }}
        >
          Cambia Utente
        </button>
      </div>

      <p style={{ textAlign: 'center', color: '#666' }}>
        Ciao, <strong>{currentUser.name}</strong>! Clicca su una lettera per sentirne la pronuncia.
      </p>
      
      <LetterList letters={letters} />
    </div>
  );
}

// Componente principale che fornisce il contesto
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
