import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Professional } from '../api/professional';
import { api, del, post } from '../api/client';
import { DEFAULT_LOCATION } from '../utils/serviceArea';

type User = { id: string; name: string; email: string };
export type Category = { id: string; serviceId: string; name: string; icon: string; count: number; popular: boolean };
export type ProviderRow = { id: string; name: string; bio: string | null; available: boolean; rating: string;
  reviews: number; completed_jobs: number; profession: string; category: string; category_id: string;
  service_id: string; starting_price: string | null; services: string[]; service_tags: string[] };
type CategoryRow = { id: string; service_id: string; name: string; icon_key: string | null };

export function adaptProvider(row: ProviderRow): Professional {
  const price = Number(row.starting_price || 0);
  const initials = row.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  return {
    id: row.id, name: row.name, profession: row.profession, category: row.category,
    rating: Number(row.rating), reviews: row.reviews, completedJobs: row.completed_jobs,
    distance: 'Teresina', eta: 'Consulte', price: price ? `A partir de R$ ${price}` : 'Sob consulta',
    priceRange: price ? `A partir de R$ ${price}` : 'Sob consulta', available: row.available,
    badge: 'Profissional verificado', verified: true, initials, color: '#2563EB', discount: null,
    bio: row.bio || '', services: row.services, serviceTags: row.service_tags || [], responseTime: 'Consulte', availability: row.available ? 'Disponível agora' : 'Consulte disponibilidade',
    serviceId: row.service_id, categoryId: row.category_id,
  };
}

interface AppContextType {
  location: string; setLocation: (loc: string) => void;
  isLoggedIn: boolean; user: User | null; authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  showLoginModal: boolean; setShowLoginModal: (show: boolean) => void;
  showLocationModal: boolean; setShowLocationModal: (show: boolean) => void;
  selectedProfessional: Professional | null; setSelectedProfessional: (pro: Professional | null) => void;
  professionals: Professional[]; categories: Category[]; catalogLoading: boolean; catalogError: string | null;
  refreshCatalog: () => Promise<void>;
  favorites: string[]; toggleFavorite: (id: string | number) => Promise<void>;
  loginIntent: string; setLoginIntent: (intent: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loginIntent, setLoginIntent] = useState('');

  const refreshCatalog = async () => {
    setCatalogLoading(true);
    try {
      const [categoryData, providerData] = await Promise.all([
        api<{ categories: CategoryRow[] }>('/categories'),
        api<{ providers: ProviderRow[] }>('/providers'),
      ]);
      const mapped = providerData.providers.map(adaptProvider);
      setProfessionals(mapped);
      setCategories(categoryData.categories.map(row => ({
        id: row.id, serviceId: row.service_id, name: row.name, icon: row.icon_key || 'gerais',
        count: mapped.filter(pro => pro.categoryId === row.id).length, popular: false,
      })));
      setCatalogError(null);
    } catch (cause) {
      setCatalogError(cause instanceof Error ? cause.message : 'Catálogo indisponível');
    } finally { setCatalogLoading(false); }
  };

  useEffect(() => {
    refreshCatalog();
    api<{ user: User | null }>('/auth/me').then(result => setUser(result.user)).catch(() => setUser(null)).finally(() => setAuthLoading(false));
  }, []);
  useEffect(() => {
    if (!user) { setFavorites([]); return; }
    api<{ providerIds: string[] }>('/favorites').then(result => setFavorites(result.providerIds)).catch(() => setFavorites([]));
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    const result = await post<{ user: User }>('/auth/login', { email, password });
    setUser(result.user);
    setShowLoginModal(false);
  };
  const register = async (name: string, email: string, password: string) => {
    const result = await post<{ user: User }>('/auth/register', { name, email, password });
    setUser(result.user);
    setShowLoginModal(false);
  };
  const logout = async () => {
    await post('/auth/logout');
    setUser(null);
  };
  const toggleFavorite = async (id: string | number) => {
    if (!user) { setShowLoginModal(true); return; }
    const key = String(id);
    if (favorites.includes(key)) {
      await del(`/favorites/${key}`);
      setFavorites(prev => prev.filter(item => item !== key));
    } else {
      await post(`/favorites/${key}`);
      setFavorites(prev => [...prev, key]);
    }
  };

  return <AppContext.Provider value={{ location, setLocation, isLoggedIn: !!user, user, authLoading,
    login, register, logout, showLoginModal, setShowLoginModal, showLocationModal, setShowLocationModal,
    selectedProfessional, setSelectedProfessional, professionals, categories, catalogLoading, catalogError, refreshCatalog,
    favorites, toggleFavorite, loginIntent, setLoginIntent }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp precisa de AppProvider');
  return context;
}
