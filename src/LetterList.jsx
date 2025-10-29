// src/LetterList.jsx
import React from 'react';
import LetterCard from './LetterCard.jsx';
import { useUser } from './UserContext.jsx';

function LetterList({ letters }) {
  const { currentUser } = useUser();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      {letters.map((letter) => (
        <LetterCard
          key={letter.id}
          letterId={letter.id}
          character={letter.character}
          romanization={letter.romanization}
          audioPath={letter.audio_path}
          isViewed={letter.is_viewed}
          userId={currentUser.id} // Passiamo l'ID dell'utente attivo
        />
      ))}
    </div>
  );
}

export default LetterList;
