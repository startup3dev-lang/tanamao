import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { api, patch } from '../api/client';
import { useApp } from '../context/AppContext';

type Job = { id: string; request_id: string; customer_id: string; provider_id: string; status: string; created_at: string; street: string; number: string; neighborhood: string; city: string; state: string; postal_code: string };
const labels: Record<string, string> = { confirmed: 'Serviço confirmado', provider_en_route: 'Profissional a caminho', in_progress: 'Serviço em andamento', completed: 'Serviço concluído', cancelled: 'Cancelado', disputed: 'Em disputa' };
const nextStatus: Record<string, string> = { confirmed: 'provider_en_route', provider_en_route: 'in_progress', in_progress: 'completed' };

export function ServiceTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [job, setJob] = useState<Job | null>(null);
  const [history, setHistory] = useState<{ status: string; created_at: string }[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!id) return;
    Promise.all([api<{ job: Job }>(`/jobs/${id}`), api<{ history: { status: string; created_at: string }[] }>(`/jobs/${id}/history`)])
      .then(([result, events]) => { setJob(result.job); setHistory(events.history); }).catch(cause => setError(cause.message));
  }, [id]);
  const change = async (status: string) => {
    if (!id) return;
    setBusy(true); setError('');
    try { const result = await patch<{ job: Job }>(`/jobs/${id}/status`, { status }); setJob(previous => previous ? { ...previous, ...result.job } : null); setHistory(previous => [...previous, { status, created_at: new Date().toISOString() }]); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível atualizar'); }
    finally { setBusy(false); }
  };
  if (!id) return <main className="min-h-screen bg-[#0A1628] pt-28 text-center text-white"><p>Selecione um serviço na sua área.</p><button onClick={() => navigate('/cliente')} className="mt-4 text-[#FFD100]">Meus pedidos</button></main>;
  return <main className="min-h-screen bg-[#0A1628] px-4 pb-24 pt-24 text-white"><div className="mx-auto max-w-xl">
    <button onClick={() => navigate('/cliente')} className="text-[#FFD100]">← Meus pedidos</button><h1 className="mt-5 text-2xl font-black">Acompanhar serviço</h1>
    {error && <p role="alert" className="mt-4 text-red-300">{error}</p>}
    {job && <div className="mt-6 space-y-4 rounded-2xl bg-[#0D1F3C] p-6"><p className="text-xl font-bold text-[#FFD100]">{labels[job.status] || job.status}</p>
      <p className="text-sm text-white/70">Endereço: {job.street}, {job.number} — {job.neighborhood}, {job.city}/{job.state} · CEP {job.postal_code}</p>
      <p className="text-sm text-white/50">Atualizado em {new Date(job.created_at).toLocaleDateString('pt-BR')}</p>
      <ol className="space-y-2 border-l-2 border-[#FFD100] pl-4">{history.map((event, index) => <li key={`${event.status}-${index}`}><span className="font-semibold">{labels[event.status] || event.status}</span><time className="block text-xs text-white/50">{new Date(event.created_at).toLocaleString('pt-BR')}</time></li>)}</ol>
      {job.provider_id === user?.id && nextStatus[job.status] && <button disabled={busy} onClick={() => change(nextStatus[job.status])} className="rounded-xl bg-[#FFD100] px-5 py-3 font-bold text-[#0A1628]">{busy ? 'Atualizando...' : `Marcar: ${labels[nextStatus[job.status]]}`}</button>}
      {job.customer_id === user?.id && ['confirmed','provider_en_route'].includes(job.status) && <button disabled={busy} onClick={() => change('cancelled')} className="block text-red-300">Cancelar serviço</button>}
      {job.customer_id === user?.id && job.status === 'completed' && <button onClick={() => navigate(`/avaliacao/${job.id}`)} className="block text-[#FFD100]">Avaliar profissional</button>}
    </div>}
  </div></main>;
}
