import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { api, post } from '../api/client';
import type { Message } from '../api/types';
import { useApp } from '../context/AppContext';

export function Chat() {
  const { id } = useParams();
  const { user } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !user) return;
    let active = true;
    const load = () => api<{ messages: Message[] }>(`/conversations/${id}/messages`)
      .then(result => { if (active) { setMessages(result.messages); setError(''); } })
      .catch(cause => { if (active) setError(cause.message); });
    load();
    const timer = window.setInterval(load, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [id, user?.id]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const send = async () => {
    if (!id || !input.trim() || busy) return;
    setBusy(true);
    try {
      const result = await post<{ message: Message }>(`/conversations/${id}/messages`, { body: input.trim() });
      setMessages(previous => [...previous, result.message]);
      setInput(''); setError('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Mensagem não enviada'); }
    finally { setBusy(false); }
  };

  if (!id) return <main className="min-h-screen bg-[#0A1628] pt-28 text-center text-white"><p>Escolha uma conversa.</p><button onClick={() => navigate('/chats')} className="mt-4 text-[#FFD100]">Ver conversas</button></main>;
  return <main className="flex h-[100dvh] flex-col bg-[#0A1628] pt-16 text-white">
    <header className="border-b border-white/10 bg-[#0D1F3C] p-4"><button onClick={() => navigate('/chats')} className="text-[#FFD100]">← Conversas</button></header>
    <div className="flex-1 space-y-3 overflow-y-auto p-4"><div className="mx-auto max-w-2xl space-y-3">
      {messages.map(message => <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${message.sender_id === user?.id ? 'bg-[#FFD100] text-[#0A1628]' : 'bg-white text-[#0A1628]'}`}><p>{message.body}</p><time className="text-xs opacity-60">{new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</time></div></div>)}
      <div ref={end} />
    </div></div>
    {error && <p role="alert" className="px-4 text-center text-red-300">{error}</p>}
    <div className="border-t border-white/10 bg-[#0D1F3C] p-3"><div className="mx-auto flex max-w-2xl gap-2"><input value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') send(); }} placeholder="Escreva uma mensagem" className="min-w-0 flex-1 rounded-xl bg-white/10 p-3 text-white outline-none" /><button disabled={busy || !input.trim()} onClick={send} className="rounded-xl bg-[#FFD100] px-5 font-bold text-[#0A1628] disabled:opacity-50">Enviar</button></div></div>
  </main>;
}
