// src/App.jsx
import React, { useState, useEffect } from 'react';
import LetterCard from './LetterCard';

function App() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica le lettere dal database quando il componente viene montato
  const loadLetters = async () => {
    try {
      const result = await window.electronAPI.getLettersWithProgress();
      if (result && Array.isArray(result)) {
        setLetters(result);
      } else {
        console.error('Invalid response from getLettersWithProgress:', result);
      }
    } catch (error) {
      console.error('Failed to load letters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLetters();
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>📖 Sanskrit Learning App</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Clicca su una lettera per sentirne la pronuncia. Quelle già viste avranno un colore diverso.
      </p>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading Sanskrit letters...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {letters.map((letter) => (
            <LetterCard
              key={letter.id}
              letterId={letter.id}
              character={letter.character}
              romanization={letter.romanization}
              audioPath={letter.audio_path}
              isViewed={letter.is_viewed}
              onViewedChange={loadLetters} // Callback per ricaricare i dati
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
