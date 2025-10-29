// src/LetterCard.jsx
import React, { useState } from 'react';

function LetterCard({ character, romanization, audioPath, isViewed, letterId, userId }) {
  // Utilizziamo lo stato locale per gestire il viewed
  const [viewed, setViewed] = useState(isViewed);

  const handleClick = async () => {
    // Se non è già stata vista, la segnaliamo nel database
    if (!viewed) {
      // Usiamo markAsViewedByUser che accetta sia letterId che userId
      const wasMarked = await window.electronAPI.markAsViewedByUser(letterId, userId);
      if (wasMarked) {
        setViewed(true);
      }
    }

    // Riproduci l'audio
    if (window.electronAPI && window.electronAPI.playAudio) {
      window.electronAPI.playAudio(audioPath);
    }
  };

  // Stile dinamico basato sullo stato 'visto'
  const cardStyle = {
    border: `2px solid ${viewed ? '#4CAF50' : '#ccc'}`,
    borderRadius: '8px',
    padding: '2rem',
    margin: '1rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    backgroundColor: viewed ? '#f0f8f0' : '#fff',
  };

  return (
    <div
      onClick={handleClick}
      style={cardStyle}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: '4rem' }}>{character}</div>
      <div style={{ fontSize: '1.2rem', color: viewed ? '#2E7D32' : '#555' }}>
        {romanization}
      </div>
    </div>
  );
}

export default LetterCard;
