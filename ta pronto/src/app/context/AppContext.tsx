import { createContext, useContext, useState, ReactNode } from 'react';
import { professionals, type Professional } from '../data/mockData';

interface AppContextType {
  location: string;
  setLocation: (loc: string) => void;
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (user: { name: string; email: string }) => void;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  selectedProfessional: Professional | null;
  setSelectedProfessional: (pro: Professional | null) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  loginIntent: string;
  setLoginIntent: (intent: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState('São Paulo, SP – Centro');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(professionals[0]);
  const [favorites, setFavorites] = useState<number[]>([2, 5]);
  const [loginIntent, setLoginIntent] = useState('');

  const login = (userData: { name: string; email: string }) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider value={{
      location, setLocation,
      isLoggedIn, user, login, logout,
      showLoginModal, setShowLoginModal,
      showLocationModal, setShowLocationModal,
      selectedProfessional, setSelectedProfessional,
      favorites, toggleFavorite,
      loginIntent, setLoginIntent,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
