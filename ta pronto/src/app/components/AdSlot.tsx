import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;
const slotId = import.meta.env.VITE_ADSENSE_HOME_SLOT;
const consentKey = 'ta-pronto-ads-consent';

export function AdSlot() {
  const [choice, setChoice] = useState<string | null>(() => localStorage.getItem(consentKey));
  useEffect(() => {
    const reset = () => { localStorage.removeItem(consentKey); window.location.reload(); };
    window.addEventListener('ta-pronto-manage-ads', reset);
    return () => window.removeEventListener('ta-pronto-manage-ads', reset);
  }, []);
  useEffect(() => {
    if (!publisherId || choice !== 'accepted') return;
    const scriptId = 'ta-pronto-adsense';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId)}`;
      document.head.appendChild(script);
    }
    if (slotId) {
      try { ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({}); } catch { /* A rede pode bloquear anúncios. */ }
    }
  }, [choice]);

  if (!publisherId) return null;
  const save = (value: string) => { localStorage.setItem(consentKey, value); setChoice(value); };
  return <>
    {choice === null && <div role="dialog" aria-label="Preferências de publicidade" className="fixed bottom-4 left-4 right-4 z-[110] mx-auto max-w-2xl rounded-2xl border border-white/20 bg-[#0D1F3C] p-5 text-white shadow-2xl">
      <p className="font-bold">Publicidade e cookies</p>
      <p className="mt-1 text-sm text-white/70">Podemos usar o Google AdSense para mostrar anúncios. O Google poderá usar cookies. Leia a <Link to="/privacidade" className="text-[#FFD100] underline">Política de Privacidade</Link>.</p>
      <div className="mt-4 flex gap-3"><button onClick={() => save('rejected')} className="rounded-xl border border-white/30 px-4 py-2 text-sm">Recusar</button><button onClick={() => save('accepted')} className="rounded-xl bg-[#FFD100] px-4 py-2 text-sm font-bold text-[#0A1628]">Aceitar anúncios</button></div>
    </div>}
    {choice === 'accepted' && slotId && <aside aria-label="Publicidade" className="mx-auto my-8 max-w-5xl px-4 text-center"><p className="mb-2 text-xs text-white/40">Publicidade</p><ins className="adsbygoogle block" style={{ display: 'block' }} data-ad-client={publisherId} data-ad-slot={slotId} data-ad-format="auto" data-full-width-responsive="true" /></aside>}
  </>;
}
