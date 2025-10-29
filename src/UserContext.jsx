// src/UserContext.jsx
import React, { createContext, useState, useContext } from 'react';

// 1. Creiamo il contesto
const UserContext = createContext(null);

// 2. Creiamo un "provider" che avvolgerà la nostra app
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Creiamo un hook personalizzato per usare facilmente il contesto
export function useUser() {
  return useContext(UserContext);
}
