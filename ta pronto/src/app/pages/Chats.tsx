import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../api/client';
import type { Conversation } from '../api/types';
import { useApp } from '../context/AppContext';

export function Chats() {
  const { user, setShowLoginModal } = useApp();
  const navigate = useNavigate();
  const [items, setItems] = useState<Conversation[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!user) return;
    api<{ conversations: Conversation[] }>('/conversations').then(result => setItems(result.conversations)).catch(cause => setError(cause.message));
  }, [user?.id]);

  return <main className="min-h-screen bg-[#0A1628] px-4 pb-28 pt-24 text-white"><div className="mx-auto max-w-2xl">
    <h1 className="mb-5 text-2xl font-black">Conversas</h1>
    {!user && <button onClick={() => setShowLoginModal(true)} className="rounded-xl bg-[#FFD100] px-5 py-3 font-bold text-[#0A1628]">Entrar para ver conversas</button>}
    {error && <p role="alert" className="text-red-300">{error}</p>}
    {user && !items.length && !error && <p className="text-white/60">Nenhuma conversa ainda.</p>}
    <div className="space-y-3">{items.map(item => <button key={item.id} onClick={() => navigate(`/chat/${item.id}`)} className="w-full rounded-2xl border border-white/10 bg-[#0D1F3C] p-4 text-left hover:border-[#FFD100]/50">
      <span className="font-bold">{item.customer_id === user?.id ? item.provider_name : item.customer_name}</span>
      <p className="text-sm text-white/60">{item.title}</p><p className="mt-2 truncate text-sm text-white/40">{item.last_message || 'Inicie a conversa'}</p>
    </button>)}</div>
  </div></main>;
}
