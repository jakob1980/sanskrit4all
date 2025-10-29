// src/LetterCard.jsx
import React from 'react';

function LetterCard({ character, romanization, audioPath, isViewed, letterId }) {
  const handleClick = async () => {
    // Chiameremo la nostra API Electron qui
    console.log(`Playing audio for: ${character} (${audioPath})`);
    
    if (window.electronAPI && window.electronAPI.playAudio) {
      window.electronAPI.playAudio(audioPath);
    } else {
      console.error('electronAPI.playAudio is not available!');
    }
    
    // Segna la lettera come vista nel database (solo se non è già stata vista)
    if (!isViewed && letterId && window.electronAPI && window.electronAPI.markAsViewed) {
      try {
        await window.electronAPI.markAsViewed(letterId);
      } catch (error) {
        console.error('Failed to mark as viewed:', error);
      }
    }
  };

  // Stile dinamico basato sullo stato 'visto'
  const cardStyle = {
    border: `2px solid ${isViewed ? '#4CAF50' : '#ccc'}`,
    borderRadius: '8px',
    padding: '2rem',
    margin: '1rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    backgroundColor: isViewed ? '#f0f8f0' : '#fff',
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
      <div style={{ fontSize: '1.2rem', color: isViewed ? '#2E7D32' : '#555' }}>
        {romanization}
      </div>
    </div>
  );
}

export default LetterCard;
