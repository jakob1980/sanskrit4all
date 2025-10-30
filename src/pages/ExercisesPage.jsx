import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext.jsx';

function ExercisesPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [exercises] = useState([
    {
      question: 'Qual è la vocale breve "a" in sanscrito?',
      options: ['अ', 'आ', 'इ', 'ई'],
      correct: 0,
      explanation: 'अ (a) è la vocale breve più fondamentale dell\'alfabeto sanscrito.'
    },
    {
      question: 'Quale di queste è una consonante retroflessa?',
      options: ['क', 'ख', 'ग', 'घ'],
      correct: 2,
      explanation: 'ग (ga) è una consonante retroflessa. Le retroflesse sono importanti nel sanscrito.'
    },
    {
      question: 'Come si pronuncia la vocale lunga "आ"?',
      options: ['a', 'aa', 'i', 'ii'],
      correct: 1,
      explanation: 'आ (aa) si pronuncia con un suono lungo "a" come in "padre" ma allungato.'
    }
  ]);

  const { currentUser } = useUser();

  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === exercises[currentExercise].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setShowResult(false);
      setUserAnswer('');
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setScore(0);
    setShowResult(false);
    setUserAnswer('');
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          margin: '0 0 1rem 0', 
          color: '#333', 
          fontSize: '2.2rem',
          fontWeight: 'bold' 
        }}>
          📝 Esercizi di Apprendimento
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#666', 
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Ciao <strong style={{ color: '#28a745' }}>{currentUser?.name}</strong>! 
          Metti alla prova le tue conoscenze del sanscrito.
        </p>
      </div>

      {currentExercise < exercises.length ? (
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Progress bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem' 
            }}>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                Esercizio {currentExercise + 1} di {exercises.length}
              </span>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                Punteggio: {score}/{exercises.length}
              </span>
            </div>
            <div style={{ 
              backgroundColor: '#e0e0e0', 
              height: '8px', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                backgroundColor: '#28a745', 
                height: '100%', 
                width: `${((currentExercise + 1) / exercises.length) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Question */}
          <h2 style={{ 
            color: '#333', 
            marginBottom: '2rem',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            {exercises[currentExercise].question}
          </h2>

          {/* Options */}
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            {exercises[currentExercise].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                style={{
                  padding: '1rem',
                  fontSize: '1.1rem',
                  border: showResult 
                    ? (index === exercises[currentExercise].correct ? '2px solid #28a745' : '2px solid #dc3545')
                    : '2px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: showResult
                    ? (index === exercises[currentExercise].correct ? '#d4edda' : '#f8d7da')
                    : 'white',
                  color: '#333',
                  cursor: showResult ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Result */}
          {showResult && (
            <div style={{ 
              backgroundColor: '#e3f2fd', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              border: '1px solid #bbdefb',
              marginBottom: '2rem'
            }}>
              <p style={{ 
                margin: '0 0 1rem 0', 
                color: '#1565c0', 
                fontWeight: 'bold' 
              }}>
                {userAnswer === exercises[currentExercise].correct ? '✅ Corretto!' : '❌ Sbagliato!'}
              </p>
              <p style={{ 
                margin: 0, 
                color: '#1565c0', 
                lineHeight: '1.5' 
              }}>
                {exercises[currentExercise].explanation}
              </p>
              
              {currentExercise < exercises.length - 1 ? (
                <button
                  onClick={nextExercise}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Prossimo Esercizio →
                </button>
              ) : (
                <div>
                  <p style={{ 
                    margin: '1rem 0', 
                    color: '#1565c0', 
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    🎉 Completato! Punteggio finale: {score}/{exercises.length}
                  </p>
                  <button
                    onClick={resetExercises}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Ricomincia
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          backgroundColor: 'white', 
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Caricamento esercizi...
          </p>
        </div>
      )}
    </div>
  );
}

export default ExercisesPage;
