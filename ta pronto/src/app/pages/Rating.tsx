import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { post } from '../api/client';

export function Rating() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async () => {
    if (!id) { setError('Serviço não encontrado.'); return; }
    if (!rating) { setError('Escolha de 1 a 5 estrelas antes de enviar.'); return; }
    setBusy(true); setError('');
    try { await post(`/jobs/${id}/reviews`, { rating, comment }); setDone(true); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Avaliação não enviada'); }
    finally { setBusy(false); }
  };
  if (!id) return <main className="min-h-screen bg-[#0A1628] pt-28 text-center text-white">Selecione um serviço concluído na sua área.</main>;
  return <main className="min-h-screen bg-[#0A1628] px-4 pb-24 pt-24 text-white"><div className="mx-auto max-w-xl rounded-2xl bg-[#0D1F3C] p-6">
    {done ? <><h1 className="text-2xl font-bold">Obrigado pela avaliação!</h1><button onClick={() => navigate('/cliente')} className="mt-5 text-[#FFD100]">Voltar aos pedidos</button></>
      : <><h1 className="text-2xl font-bold">Avaliar serviço</h1><div className="my-6 flex gap-2">{[1,2,3,4,5].map(value => <button key={value} onClick={() => setRating(value)} aria-label={`${value} estrelas`} className={`text-4xl ${value <= rating ? 'text-[#FFD100]' : 'text-white/30'}`}>★</button>)}</div>
        <textarea value={comment} onChange={event => setComment(event.target.value)} maxLength={2000} placeholder="Conte como foi sua experiência" className="w-full rounded-xl bg-white p-3 text-[#0A1628]" rows={5} />
        {error && <p role="alert" className="mt-3 text-red-300">{error}</p>}
        <button disabled={busy} onClick={submit} className="mt-5 rounded-xl bg-[#FFD100] px-5 py-3 font-bold text-[#0A1628] disabled:opacity-50">{busy ? 'Enviando...' : 'Enviar avaliação'}</button></>}
  </div></main>;
}
