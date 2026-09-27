import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, X, Zap, Phone, Mail, User } from 'lucide-react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, register, loginIntent } = useApp();
  const [step, setStep] = useState<'options' | 'email' | 'register'>('options');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showLoginModal) {
      document.body.style.overflow = 'hidden';
      setStep('options');
      setError('');
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.88, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' }
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showLoginModal]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(modalRef.current, {
      opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: 'power2.in',
      onComplete: () => setShowLoginModal(false)
    });
  };

  const handleEmailLogin = async () => {
    setError('');
    if (step === 'register' && !name.trim()) { setError('Informe seu nome.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Informe um e-mail válido.'); return; }
    if (!password) { setError('Informe sua senha.'); return; }
    if (step === 'register' && password.length < 12) { setError('A senha precisa ter pelo menos 12 caracteres.'); return; }
    setBusy(true);
    try {
      if (step === 'register') await register(name, email, password);
      else await login(email, password);
      handleContinueAfterLogin();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível entrar');
    } finally { setBusy(false); }
  };

  const handleContinueAfterLogin = () => {
    setShowLoginModal(false);
    if (loginIntent === 'orcamento') navigate('/orcamento');
    if (loginIntent === 'chat') navigate('/chat');
    if (loginIntent === 'agenda') navigate('/acompanhamento');
  };

  if (!showLoginModal) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A1628] p-6 text-center relative">
          <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors">
            <X size={18} className="text-white/70" />
          </button>
          <div className="w-12 h-12 bg-[#FFD100] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Zap size={22} className="text-[#0A1628]" fill="#0A1628" />
          </div>
          <h2 className="text-white font-black text-xl">Entre para continuar</h2>
          <p className="text-white/60 text-sm mt-1">sua solicitação</p>
        </div>

        <div className="p-5">
          <p className="text-gray-500 text-sm text-center mb-5">
            Você só precisa entrar para confirmar o serviço, conversar com o profissional e acompanhar sua solicitação.
          </p>

          {step === 'options' ? (
            <div className="space-y-3">

              <button
                onClick={() => setStep('email')}
                className="flex items-center justify-center gap-3 w-full border-2 border-gray-200 rounded-xl py-3 text-[#1A2A4A] font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <Mail size={18} className="text-blue-500" />
                Entrar com e-mail
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"/></div>
                <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">ou</div>
              </div>

              <button onClick={() => setStep('register')} className="flex items-center justify-center gap-3 w-full bg-[#0A1628] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#0D1F3C] transition-colors">
                <User size={18} />
                Criar conta rapidamente
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={() => setStep('options')} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-1">
                <ChevronLeft size={14} /> Voltar
              </button>
              {step === 'register' && <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome completo" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#1A2A4A] text-sm focus:outline-none focus:border-[#FFD100]" />}
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#1A2A4A] text-sm focus:outline-none focus:border-[#FFD100] transition-colors"
              />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha (mínimo de 12 caracteres)" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#1A2A4A] text-sm focus:outline-none focus:border-[#FFD100]" />
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <button
                onClick={handleEmailLogin}
                disabled={busy}
                className="w-full bg-[#FFD100] text-[#0A1628] font-bold py-3 rounded-xl hover:bg-[#FFDE33] transition-colors"
              >
                {busy ? 'Aguarde...' : step === 'register' ? 'Criar conta' : 'Entrar'}
              </button>
            </div>
          )}

          <button onClick={() => { setShowLoginModal(false); navigate('/privacidade'); }} className="mt-4 block w-full text-center text-xs text-[#0A1628] underline">Política de Privacidade</button>

        </div>
      </div>
    </div>
  );
}
