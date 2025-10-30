// src/pages/AlphabetPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext.jsx';
import { generateQuizQuestion } from '../services/quizService.js';
import { playAudio } from '../services/audioService.js';

function AlphabetPage() {
  const { currentUser } = useUser();
  const [isPracticing, setIsPracticing] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const startPractice = async () => {
    setIsLoading(true);
    setIsPracticing(true);
    setShowFeedback(false);
    setSelectedOption(null);
    try {
      const newQuiz = await generateQuizQuestion(currentUser.id);
      setQuiz(newQuiz);
    } catch (error) {
      console.error(error);
      alert("Impossibile generare una domanda.");
      setIsPracticing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerClick = (option) => {
    if (showFeedback) return; // Impedisce di cliccare dopo aver risposto
    setSelectedOption(option);
    setShowFeedback(true);
  };

  const handleNext = () => {
    startPractice(); // Carica una nuova domanda
  };

  const handleBackToIndex = () => {
    setIsPracticing(false);
    setQuiz(null);
  };

  const handleAudioClick = async (audioPath) => {
    setIsPlayingAudio(true);
    try {
      await playAudio(audioPath);
    } catch (error) {
      console.error('Failed to play audio:', error);
      alert('Impossibile riprodurre il file audio.');
    } finally {
      setIsPlayingAudio(false);
    }
  };

  // Vista 1: L'indice delle categorie
  if (!isPracticing) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Alfabeto Devanagari</h1>
        <p>Scegli una categoria per iniziare a familiarizzare con le lettere.</p>
        
        <div style={{ margin: '2rem 0' }}>
          <h3>Vocali</h3>
          <div style={{ fontSize: '2rem', color: '#888' }}>अ आ इ ई ...</div>
        </div>
        
        <div style={{ margin: '2rem 0' }}>
          <h3>Semivocali</h3>
          <div style={{ fontSize: '2rem', color: '#888' }}>य र ल ...</div>
        </div>
        
        <div style={{ margin: '2rem 0' }}>
          <h3>Consonanti</h3>
          <div style={{ fontSize: '2rem', color: '#888' }}>क ख ग ...</div>
        </div>

        <button onClick={startPractice} style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer' }}>
          Esercitati
        </button>
      </div>
    );
  }

  // Vista 2: La schermata di quiz
  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Caricamento...</div>;
  }

  if (!quiz) {
    return null; // Non dovrebbe succedere
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={handleBackToIndex} style={{ marginBottom: '2rem' }}>
        ← Torna all'Indice
      </button>

      <h2>Quale è la pronuncia corretta?</h2>

      <div style={{ margin: '3rem 0', fontSize: '6rem' }}>
        {quiz.question.character}
        <button 
          onClick={() => handleAudioClick(quiz.question.audio_path)}
          disabled={isPlayingAudio}
          style={{ 
            marginLeft: '1rem', 
            fontSize: '2rem', 
            background: 'none', 
            border: 'none', 
            cursor: isPlayingAudio ? 'not-allowed' : 'pointer',
            opacity: isPlayingAudio ? 0.5 : 1
          }}
        >
          {isPlayingAudio ? '🔄' : '🔊'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '400px', margin: 'auto' }}>
        {quiz.options.map((option) => {
          let buttonStyle = { padding: '1rem', fontSize: '1.2rem', cursor: 'pointer' };
          if (showFeedback) {
            if (option.isCorrect) {
              buttonStyle.backgroundColor = '#28a745';
              buttonStyle.color = 'white';
            } else if (selectedOption?.id === option.id && !option.isCorrect) {
              buttonStyle.backgroundColor = '#dc3545';
              buttonStyle.color = 'white';
            }
          }
          return (
            <button
              key={option.id}
              onClick={() => handleAnswerClick(option)}
              style={buttonStyle}
              disabled={showFeedback}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <button onClick={handleNext} style={{ marginTop: '2rem', padding: '1rem 2rem' }}>
          Prossima →
        </button>
      )}
    </div>
  );
}

export default AlphabetPage;
