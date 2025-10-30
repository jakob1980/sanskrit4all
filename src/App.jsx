import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext.jsx';

// Importiamo le pagine
import HomePage from './pages/HomePage.jsx';
import AlphabetPage from './pages/AlphabetPage.jsx';
import ExercisesPage from './pages/ExercisesPage.jsx';
import SandhiPage from './pages/SandhiPage.jsx';
import LabPage from './pages/LabPage.jsx';
import LoginScreen from './components/LoginScreen.jsx';

// Componente per la navigazione
function NavBar() {
  const { currentUser, setCurrentUser } = useUser();

  if (!currentUser) return null; // Non mostrare la navigazione se non loggato

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem', backgroundColor: '#333', color: 'white' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/alphabet" style={{ color: 'white', textDecoration: 'none' }}>Alfabeto</Link>
      <Link to="/exercises" style={{ color: 'white', textDecoration: 'none' }}>Esercizi</Link>
      <Link to="/sandhi" style={{ color: 'white', textDecoration: 'none' }}>Sandhi</Link>
      <Link to="/lab" style={{ color: 'white', textDecoration: 'none' }}>Laboratorio</Link>
      <button onClick={() => setCurrentUser(null)} style={{ background: 'none', border: '1px solid white', color: 'white', cursor: 'pointer' }}>
        Logout
      </button>
    </nav>
  );
}

// Componente principale che gestisce le rotte
function AppContent() {
  const { currentUser } = useUser();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <Router>
      <NavBar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/alphabet" element={<AlphabetPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/sandhi" element={<SandhiPage />} />
          <Route path="/lab" element={<LabPage />} />
        </Routes>
      </main>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
