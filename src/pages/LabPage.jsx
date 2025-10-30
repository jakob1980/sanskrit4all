import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext.jsx';

function LabPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [analysisType, setAnalysisType] = useState('reverse');
  const { currentUser } = useUser();

  const analyzeText = () => {
    if (!inputText.trim()) return;

    switch (analysisType) {
      case 'reverse':
        setOutputText(inputText.split('').reverse().join(''));
        break;
      case 'transliterate':
        // Semplice "traslitterazione" (simulazione)
        const transliterationMap = {
          'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii',
          'उ': 'u', 'ऊ': 'uu', 'ए': 'e', 'ओ': 'o',
          'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh'
        };
        let result = '';
        for (const char of inputText) {
          result += transliterationMap[char] || char;
        }
        setOutputText(result);
        break;
      case 'count':
        setOutputText(`Caratteri: ${inputText.length}, Parole: ${inputText.split(' ').length}`);
        break;
      default:
        setOutputText(inputText);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
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
          🧪 Laboratorio Sperimentale
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#666', 
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Ciao <strong style={{ color: '#dc3545' }}>{currentUser?.name}</strong>! 
          Esplora strumenti avanzati per l'analisi del testo sanscrito.
        </p>
      </div>

      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          color: '#333', 
          margin: '0 0 1.5rem 0',
          fontSize: '1.5rem'
        }}>
          📊 Analizzatore di Testo
        </h2>

        {/* Controlli */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>
            Tipo di analisi:
          </label>
          <select 
            value={analysisType} 
            onChange={(e) => setAnalysisType(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              minWidth: '150px'
            }}
          >
            <option value="reverse">Testo Invertito</option>
            <option value="transliterate">Traslitterazione</option>
            <option value="count">Conteggio</option>
          </select>
          
          <button
            onClick={analyzeText}
            disabled={!inputText.trim()}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: inputText.trim() ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
              fontSize: '1rem'
            }}
          >
            Analizza
          </button>
          
          <button
            onClick={clearAll}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Pulisci
          </button>
        </div>

        {/* Input e Output */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Testo di Input:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Inserisci qui il testo da analizzare..."
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'system-ui'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Risultato:
            </label>
            <div style={{
              width: '100%',
              minHeight: '200px',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: '#f8f9fa',
              fontSize: '1rem',
              fontFamily: 'system-ui',
              whiteSpace: 'pre-wrap'
            }}>
              {outputText || 'I risultati appariranno qui...'}
            </div>
          </div>
        </div>

        {/* Statistiche */}
        {inputText && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            border: '1px solid #bbdefb'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#1565c0' 
            }}>
              📈 Statistiche
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem',
              color: '#1565c0'
            }}>
              <div>Caratteri: {inputText.length}</div>
              <div>Parole: {inputText.split(/\s+/).filter(word => word.length > 0).length}</div>
              <div>Paragrafi: {inputText.split(/\n\s*\n/).filter(para => para.trim().length > 0).length}</div>
              <div>Linee: {inputText.split('\n').length}</div>
            </div>
          </div>
        )}
      </div>

      {/* Strumenti Sperimentali */}
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#333', 
          margin: '0 0 1.5rem 0',
          fontSize: '1.5rem'
        }}>
          🔬 Strumenti Sperimentali
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem'
        }}>
          <div style={{ 
            padding: '1.5rem', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#dc3545', marginTop: 0 }}>🎵 Audio Synth</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Genera suoni per le lettere sanscrite
            </p>
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              disabled
            >
              In Sviluppo
            </button>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#28a745', marginTop: 0 }}>📝 Block Editor</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Editor avanzato per testi in Devanagari
            </p>
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              disabled
            >
              In Sviluppo
            </button>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ffc107', marginTop: 0 }}>🔍 Text Analyzer</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Analisi grammaticale avanzata
            </p>
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              disabled
            >
              In Sviluppo
            </button>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px', 
          border: '1px solid #ffeaa7',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0, 
            color: '#856404', 
            fontSize: '0.9rem' 
          }}>
            ⚠️ <strong>Nota:</strong> Questi strumenti sono in fase di sviluppo sperimentale. 
            Le funzionalità complete saranno disponibili nelle prossime versioni.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LabPage;
