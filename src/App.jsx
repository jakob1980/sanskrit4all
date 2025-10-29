// src/App.jsx
import React, { useState, useEffect } from 'react';
import UserSelector from './UserSelector.jsx';
import LetterList from './LetterList.jsx';
import { UserProvider, useUser } from './UserContext.jsx';

// Componente interno che accede al contesto
function AppContent() {
  const [letters, setLetters] = useState([]);
  const { currentUser } = useUser();

  // Carica le lettere solo quando un utente è stato selezionato
  useEffect(() => {
    if (currentUser && window.electronAPI) {
      const loadLetters = async () => {
        const lettersData = await window.electronAPI.getLetters(currentUser.id);
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
      <h1 style={{ textAlign: 'center' }}>📖 Sanskrit Learning App</h1>
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
