import { MessageCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { PageTransition } from '../components/PageTransition';
import { useApp } from '../context/AppContext';
import { professionals } from '../data/mockData';

const activeChats = [
  { professionalId: 1, message: 'Posso passar hoje às 15h, tudo bem?', time: '14:26', unread: 2 },
  { professionalId: 2, message: 'Confirmado para amanhã pela manhã.', time: '11:08', unread: 0 },
  { professionalId: 3, message: 'Enviei os detalhes do orçamento.', time: 'Ontem', unread: 1 },
  { professionalId: 5, message: 'Obrigado! Qualquer dúvida estou à disposição.', time: 'Ter', unread: 0 },
];

export function Chats() {
  const navigate = useNavigate();
  const { setSelectedProfessional } = useApp();
  const [search, setSearch] = useState('');

  const conversations = useMemo(() => activeChats
    .map(chat => ({ ...chat, professional: professionals.find(pro => pro.id === chat.professionalId) }))
    .filter(chat => chat.professional?.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))), [search]);

  const openChat = (professionalId: number) => {
    const professional = professionals.find(pro => pro.id === professionalId);
    if (!professional) return;
    setSelectedProfessional(professional);
    navigate('/chat');
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0A1628] px-4 pb-28 pt-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#FFD100]">Atendimento</p>
            <h1 className="text-2xl font-black text-white">Conversas ativas</h1>
            <p className="mt-1 text-sm text-white/50">Continue seus atendimentos e acompanhe cada negociação.</p>
          </div>

          <label className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3">
            <Search size={18} className="shrink-0 text-white/40" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Buscar conversa"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder-white/35"
            />
          </label>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0D1F3C] shadow-2xl shadow-black/15">
            {conversations.length ? conversations.map(({ professional, message, time, unread }, index) => professional && (
              <button
                key={professional.id}
                onClick={() => openChat(professional.id)}
                className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.05] ${index ? 'border-t border-white/[0.07]' : ''}`}
              >
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-white" style={{ backgroundColor: professional.color }}>
                  {professional.initials}
                  {professional.available && <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0D1F3C] bg-green-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-white">{professional.name}</p>
                    <span className="ml-auto shrink-0 text-[11px] text-white/35">{time}</span>
                  </div>
                  <p className="text-xs text-white/45">{professional.profession}</p>
                  <p className={`mt-1 truncate text-sm ${unread ? 'font-semibold text-white/80' : 'text-white/45'}`}>{message}</p>
                </div>
                {unread > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#FFD100] px-1.5 text-[10px] font-black text-[#0A1628]">
                    {unread}
                  </span>
                )}
              </button>
            )) : (
              <div className="px-5 py-14 text-center">
                <MessageCircle size={28} className="mx-auto mb-3 text-[#FFD100]" />
                <p className="font-semibold text-white">Nenhuma conversa encontrada</p>
                <p className="mt-1 text-sm text-white/45">Tente buscar pelo nome do profissional.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
