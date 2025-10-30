import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext.jsx';

function SandhiPage() {
  const [currentExample, setCurrentExample] = useState(0);
  const { currentUser } = useUser();

  const sandhiExamples = [
    {
      title: 'Visarga Sandhi',
      original: 'पुरा + हि → पुराहि',
      explanation: 'La Visarga (ः) si assimila con alcune consonanti che seguono, specialmente स e ह.',
      pronunciation: 'pura + hi → purahi'
    },
    {
      title: 'R Sandhi',
      original: 'पितर् + आम → पितराम्',
      explanation: 'La र् (r) con la vocale lunga आ si combina formando una struttura speciale.',
      pronunciation: 'pitar + ām → pitārām'
    },
    {
      title: 'Sibilant Assimilation',
      original: 'तत् + सः → तत्तसः',
      explanation: 'La dentale त् si adatta alla sibilante che segue, creando una geminata.',
      pronunciation: 'tat + saḥ → tattasaḥ'
    },
    {
      title: 'Nasal Assimilation',
      original: 'गङ्गा + नदी → गङ्गानदी',
      explanation: 'La nasale न si assimila al luogo di articolazione della consonante successiva.',
      pronunciation: 'gaṅgā + nadī → gaṅgānadī'
    }
  ];

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % sandhiExamples.length);
  };

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + sandhiExamples.length) % sandhiExamples.length);
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
          🔗 Sandhi - Regole di Combinazione
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#666', 
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Ciao <strong style={{ color: '#ffc107' }}>{currentUser?.name}</strong>! 
          Il Sandhi è la regola fondamentale che governa come i suoni si combinano nel sanscrito.
        </p>
      </div>

      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <button
            onClick={prevExample}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Precedente
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <span style={{ 
              color: '#666', 
              fontSize: '0.9rem' 
            }}>
              Esempio {currentExample + 1} di {sandhiExamples.length}
            </span>
          </div>
          
          <button
            onClick={nextExample}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Successivo →
          </button>
        </div>

        <div style={{ 
          backgroundColor: '#fff8e1', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #ffc107',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            color: '#f57f17', 
            margin: '0 0 1rem 0',
            fontSize: '1.8rem'
          }}>
            {sandhiExamples[currentExample].title}
          </h2>
          
          <div style={{ 
            fontSize: '2rem', 
            margin: '1.5rem 0',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {sandhiExamples[currentExample].original}
          </div>
          
          <div style={{ 
            fontSize: '1.1rem', 
            color: '#666',
            fontStyle: 'italic',
            marginBottom: '1rem'
          }}>
            {sandhiExamples[currentExample].pronunciation}
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          border: '1px solid #c3e6c3'
        }}>
          <h3 style={{ 
            color: '#2e7d32', 
            margin: '0 0 1rem 0',
            fontSize: '1.3rem'
          }}>
            📖 Spiegazione
          </h3>
          <p style={{ 
            margin: 0, 
            color: '#2e7d32', 
            lineHeight: '1.6',
            fontSize: '1.1rem'
          }}>
            {sandhiExamples[currentExample].explanation}
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem',
          marginTop: '2rem'
        }}>
          {sandhiExamples.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentExample(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentExample ? '#ffc107' : '#ddd',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px', 
        border: '1px solid #bbdefb',
        maxWidth: '900px',
        margin: '2rem auto 0'
      }}>
        <h3 style={{ 
          color: '#1565c0', 
          margin: '0 0 1rem 0',
          fontSize: '1.2rem'
        }}>
          💡 Cosa è il Sandhi?
        </h3>
        <p style={{ 
          margin: 0, 
          color: '#1565c0', 
          lineHeight: '1.6' 
        }}>
          Il Sandhi è l'insieme di regole fonetiche che governano come i suoni si modificano e si combinano 
          quando le parole si incontrano. È fondamentale per la corretta lettura e recitazione dei testi sanscriti. 
          Questi cambiamenti rendono il sanscrito più fluido e melodico nella sua pronuncia.
        </p>
      </div>
    </div>
  );
}

export default SandhiPage;
