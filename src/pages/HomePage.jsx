import React from 'react';
import { useUser } from '../contexts/UserContext.jsx';

function HomePage() {
  const { currentUser } = useUser();

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f9f9f9', 
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        margin: '0 0 1rem 0', 
        color: '#333', 
        fontSize: '2.5rem',
        fontWeight: 'bold' 
      }}>
        📖 Benvenuto nella App di Apprendimento del Sanscrito
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#666', 
        marginBottom: '2rem',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        Ciao <strong style={{ color: '#007bff' }}>{currentUser?.name}</strong>! 
        Inizia il tuo viaggio nell'apprendimento del sanscrito con i nostri strumenti interattivi.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem', 
        width: '100%',
        maxWidth: '800px',
        marginTop: '2rem'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#007bff', marginTop: 0 }}>🔤 Alfabeto</h3>
          <p style={{ color: '#666' }}>Impara le lettere dell'alfabeto sanscrito con audio e caratteri.</p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#28a745', marginTop: 0 }}>📝 Esercizi</h3>
          <p style={{ color: '#666' }}>Metti alla prova le tue conoscenze con esercizi interattivi.</p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#ffc107', marginTop: 0 }}>🔗 Sandhi</h3>
          <p style={{ color: '#666' }}>Studia le regole di combinazione dei suoni nel sanscrito.</p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#dc3545', marginTop: 0 }}>🧪 Laboratorio</h3>
          <p style={{ color: '#666' }}>Esplora strumenti avanzati e funzionalità sperimentali.</p>
        </div>
      </div>

      <div style={{ 
        marginTop: '3rem', 
        padding: '1.5rem', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px', 
        border: '1px solid #bbdefb',
        maxWidth: '600px'
      }}>
        <p style={{ 
          margin: 0, 
          color: '#1565c0', 
          fontSize: '0.9rem' 
        }}>
          💡 <strong>Suggerimento:</strong> Inizia dall'alfabeto per familiarizzare con i caratteri e i suoni del sanscrito.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
