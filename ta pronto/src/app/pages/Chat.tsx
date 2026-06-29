import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Send, Image, MapPin, X } from 'lucide-react';
import gsap from 'gsap';
import { PageTransition } from '../components/PageTransition';
import { useApp } from '../context/AppContext';

type Message = { id: number; from: 'user' | 'pro'; text: string; time: string };

const initialMessages: Message[] = [
  { id: 1, from: 'pro', text: 'Olá! Vi sua solicitação. Posso passar hoje às 15h, tudo bem?', time: '14:22' },
  { id: 2, from: 'user', text: 'Oi! Sim, pode ser. Vou estar em casa.', time: '14:25' },
  { id: 3, from: 'pro', text: 'Ótimo! Vou levar o material necessário. Pode me confirmar o endereço completo?', time: '14:26' },
];

export function Chat() {
  const navigate = useNavigate();
  const { selectedProfessional } = useApp();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pro = selectedProfessional;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = { id: Date.now(), from: 'user', text: input.trim(), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate pro reply
    setTimeout(() => {
      const replies = ['Entendido!', 'Ok, anotei.', 'Perfeito, até logo!', 'Pode deixar, cuido disso.'];
      const reply: Message = { id: Date.now() + 1, from: 'pro', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, reply]);
    }, 1200);
  };

  return (
    <PageTransition>
      <div className="h-screen bg-[#0A1628] flex flex-col pt-16">
        {/* Chat header */}
        <div className="bg-[#0D1F3C] border-b border-white/10 py-3 px-4 shrink-0">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} className="text-white" />
            </button>
            {pro && (
              <>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: pro.color }}>
                  {pro.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{pro.name}</p>
                  <p className="flex items-center gap-1.5 text-green-400 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Online · Responde rápido
                  </p>
                </div>
              </>
            )}
            <button onClick={() => navigate('/acompanhamento')} className="ml-auto bg-[#FFD100]/10 border border-[#FFD100]/30 text-[#FFD100] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#FFD100]/20 transition-colors">
              Fechar serviço
            </button>
          </div>
        </div>

        {/* Service summary card */}
        <div className="max-w-2xl mx-auto w-full px-4 pt-3 shrink-0">
          <div className="bg-[#0D1F3C] border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <p className="text-white/60 text-xs">Solicitação: <span className="text-white font-semibold">Instalação elétrica</span></p>
            <button onClick={() => navigate('/acompanhamento')} className="text-[#FFD100] text-xs underline">Ver status</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-2xl mx-auto space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.from === 'user'
                    ? 'bg-[#FFD100] text-[#0A1628] rounded-tr-sm'
                    : 'bg-white text-[#1A2A4A] rounded-tl-sm shadow-sm'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-[#0A1628]/50' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-[#0D1F3C] border-t border-white/10 px-4 py-3 shrink-0">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <button className="p-2 text-white/40 hover:text-white transition-colors">
              <Image size={20} />
            </button>
            <button className="p-2 text-white/40 hover:text-white transition-colors">
              <MapPin size={20} />
            </button>
            <div className="flex-1 flex items-center bg-white/10 border border-white/20 rounded-2xl px-4 py-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Escreva uma mensagem..."
                className="flex-1 bg-transparent text-white text-sm placeholder-white/40 outline-none"
              />
            </div>
            <button
              onClick={sendMessage}
              className="w-9 h-9 bg-[#FFD100] rounded-full flex items-center justify-center hover:bg-[#FFDE33] transition-colors shrink-0"
            >
              <Send size={15} className="text-[#0A1628]" />
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
