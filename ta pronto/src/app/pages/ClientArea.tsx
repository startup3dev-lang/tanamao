import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api, patch, post } from '../api/client';
import type { ProviderRequest, ServiceRequest } from '../api/types';
import { useApp } from '../context/AppContext';

const statusLabel: Record<string, string> = {
  open: 'Aguardando proposta', quoted: 'Proposta recebida', accepted: 'Contratado', cancelled: 'Cancelado',
  confirmed: 'Confirmado', provider_en_route: 'Profissional a caminho', in_progress: 'Em andamento', completed: 'Concluído', disputed: 'Em disputa',
};

export function ClientArea() {
  const { user, authLoading, setShowLoginModal, logout } = useApp();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [providerRequests, setProviderRequests] = useState<ProviderRequest[]>([]);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [laborAmount, setLaborAmount] = useState('');
  const [materialsAmount, setMaterialsAmount] = useState('0');
  const [quoteDescription, setQuoteDescription] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    if (!user) return;
    try {
      const [customer, provider, profile] = await Promise.all([
        api<{ requests: ServiceRequest[] }>('/requests'),
        api<{ requests: ProviderRequest[] }>('/provider/requests'),
        api<{ profile: { verification_status: string; available_now: boolean } | null }>('/provider/me'),
      ]);
      setRequests(customer.requests);
      setProviderRequests(provider.requests);
      setProfileStatus(profile.profile?.verification_status || null);
      setAvailable(!!profile.profile?.available_now);
      setError('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar seus pedidos'); }
  };
  useEffect(() => { refresh(); }, [user?.id]);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true); setError('');
    try { await action(); await refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Operação não concluída'); }
    finally { setBusy(false); }
  };
  const signOut = async () => {
    setError('');
    try { await logout(); navigate('/'); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível sair'); }
  };

  if (authLoading) return <main className="min-h-screen bg-[#0A1628] pt-28 text-center text-white">Carregando...</main>;
  if (!user) return <main className="min-h-screen bg-[#0A1628] px-4 pt-28 text-center text-white">
    <h1 className="text-2xl font-bold">Sua área</h1><p className="mt-3 text-white/60">Entre para acompanhar seus serviços.</p>
    <button onClick={() => setShowLoginModal(true)} className="mt-6 rounded-xl bg-[#FFD100] px-6 py-3 font-bold text-[#0A1628]">Entrar</button>
  </main>;

  return <main className="min-h-screen bg-[#0A1628] px-4 pb-28 pt-24 text-white">
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="flex items-center justify-between gap-4"><div><h1 className="text-2xl font-black">Olá, {user.name.split(' ')[0]}</h1><p className="text-white/50">{user.email}</p></div>
        <button onClick={signOut} className="rounded-xl border border-white/20 px-4 py-2">Sair</button></header>
      {error && <p role="alert" className="rounded-xl bg-red-900 p-3 text-red-100">{error}</p>}
      <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Meus pedidos</h2><button onClick={() => navigate('/profissionais')} className="text-[#FFD100]">Encontrar profissional</button></div>
        {requests.length === 0 && <p className="text-white/50">Você ainda não fez pedidos.</p>}
        <div className="space-y-3">{requests.map(request => <article key={request.id} className="rounded-2xl border border-white/10 bg-[#0D1F3C] p-4">
          <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold">{request.title}</h3><p className="text-sm text-white/60">{request.provider_name}</p></div><span className="text-sm text-[#FFD100]">{statusLabel[request.job_status || request.status] || request.status}</span></div>
          {request.quote_id && request.quote_status === 'sent' && <div className="mt-4 rounded-xl bg-white/10 p-3"><p>Proposta: R$ {Number(request.total_amount).toFixed(2)}</p><button disabled={busy} onClick={() => run(() => post(`/quotes/${request.quote_id}/accept`))} className="mt-2 rounded-lg bg-[#FFD100] px-4 py-2 font-bold text-[#0A1628]">Aceitar proposta</button></div>}
          <div className="mt-4 flex flex-wrap gap-3 text-sm"><button onClick={() => navigate(`/chat/${request.conversation_id}`)} className="text-[#FFD100]">Conversa</button>
            {request.job_id && <button onClick={() => navigate(`/acompanhamento/${request.job_id}`)} className="text-[#FFD100]">Acompanhar</button>}
            {request.job_status === 'completed' && <button onClick={() => navigate(`/avaliacao/${request.job_id}`)} className="text-[#FFD100]">Avaliar</button>}
            {['open','quoted'].includes(request.status) && <button disabled={busy} onClick={() => run(() => post(`/requests/${request.id}/cancel`))} className="text-red-300">Cancelar pedido</button>}
          </div>
        </article>)}</div>
      </section>
      <section><h2 className="mb-4 text-xl font-bold">Área do profissional</h2>
        {!profileStatus && <button onClick={() => navigate('/cadastro-profissional')} className="rounded-xl bg-[#FFD100] px-5 py-3 font-bold text-[#0A1628]">Cadastrar meus serviços</button>}
        {profileStatus && profileStatus !== 'verified' && <p className="rounded-xl bg-white/10 p-4">Cadastro em análise: {profileStatus}.</p>}
        {profileStatus === 'verified' && <div className="space-y-3"><label className="flex items-center gap-3 rounded-xl bg-[#0D1F3C] p-4"><input type="checkbox" checked={available} disabled={busy} onChange={event => run(async () => { await patch('/provider/availability', { available: event.target.checked }); setAvailable(event.target.checked); })} />Disponível para novos pedidos</label>{providerRequests.length === 0 && <p className="text-white/50">Nenhuma solicitação recebida.</p>}
          {providerRequests.map(request => <article key={request.id} className="rounded-2xl border border-white/10 bg-[#0D1F3C] p-4">
            <h3 className="font-bold">{request.title}</h3><p className="mt-2 text-sm text-white/70">{request.description}</p>
            <p className="mt-2 text-sm text-[#FFD100]">{statusLabel[request.status] || request.status}</p>
            <div className="mt-3 flex gap-4"><button onClick={() => navigate(`/chat/${request.conversation_id}`)} className="text-[#FFD100]">Conversa</button>
              {request.job_id && <button onClick={() => navigate(`/acompanhamento/${request.job_id}`)} className="text-[#FFD100]">Acompanhar serviço</button>}
              {request.status === 'open' && !request.quote_id && <button onClick={() => setQuoteId(request.id)} className="text-[#FFD100]">Enviar proposta</button>}</div>
            {quoteId === request.id && <div className="mt-4 grid gap-3 rounded-xl bg-white/10 p-4">
              <textarea value={quoteDescription} onChange={event => setQuoteDescription(event.target.value)} placeholder="Descreva o que está incluído" className="rounded-lg p-3 text-[#0A1628]" />
              <input type="number" min="0" value={laborAmount} onChange={event => setLaborAmount(event.target.value)} placeholder="Mão de obra (R$)" className="rounded-lg p-3 text-[#0A1628]" />
              <input type="number" min="0" value={materialsAmount} onChange={event => setMaterialsAmount(event.target.value)} placeholder="Materiais (R$)" className="rounded-lg p-3 text-[#0A1628]" />
              <button disabled={busy || !quoteDescription.trim() || !laborAmount} onClick={() => run(async () => { await post(`/requests/${request.id}/quotes`, { description: quoteDescription, laborAmount: Number(laborAmount), materialsAmount: Number(materialsAmount) }); setQuoteId(null); })} className="rounded-lg bg-[#FFD100] p-3 font-bold text-[#0A1628] disabled:opacity-50">Confirmar proposta</button>
            </div>}
          </article>)}</div>}
      </section>
    </div>
  </main>;
}
