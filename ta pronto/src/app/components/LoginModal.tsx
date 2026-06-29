import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, X, Zap, Phone, Mail, User } from 'lucide-react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, loginIntent } = useApp();
  const [step, setStep] = useState<'options' | 'email'>('options');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showLoginModal) {
      document.body.style.overflow = 'hidden';
      setStep('options');
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

  const handleGoogleLogin = () => {
    login({ name: 'Usuário Google', email: 'usuario@gmail.com' });
    handleContinueAfterLogin();
  };

  const handleEmailLogin = () => {
    if (name && email) {
      login({ name, email });
      handleContinueAfterLogin();
    }
  };

  const handleContinueAfterLogin = () => {
    setShowLoginModal(false);
    if (loginIntent === 'orcamento') navigate('/orcamento');
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
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 w-full border-2 border-gray-200 rounded-xl py-3 text-[#1A2A4A] font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.805.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                Entrar com Google
              </button>

              <button className="flex items-center justify-center gap-3 w-full border-2 border-gray-200 rounded-xl py-3 text-[#1A2A4A] font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all">
                <Phone size={18} className="text-green-600" />
                Entrar com telefone
              </button>

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

              <button className="flex items-center justify-center gap-3 w-full bg-[#0A1628] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#0D1F3C] transition-colors">
                <User size={18} />
                Criar conta rapidamente
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={() => setStep('options')} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-1">
                <ChevronLeft size={14} /> Voltar
              </button>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#1A2A4A] text-sm focus:outline-none focus:border-[#FFD100] transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#1A2A4A] text-sm focus:outline-none focus:border-[#FFD100] transition-colors"
              />
              <button
                onClick={handleEmailLogin}
                className="w-full bg-[#FFD100] text-[#0A1628] font-bold py-3 rounded-xl hover:bg-[#FFDE33] transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          <p className="text-gray-400 text-[11px] text-center mt-4">
            Ao continuar, você concorda com nossos{' '}
            <span className="text-[#0A1628] underline cursor-pointer">Termos de Uso</span>{' '}
            e nossa{' '}
            <span className="text-[#0A1628] underline cursor-pointer">Política de Privacidade</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
