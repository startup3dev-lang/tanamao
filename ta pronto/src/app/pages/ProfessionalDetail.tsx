import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

type Review = { id: string; rating: number; comment: string | null; created_at: string; author: string };

export function ProfessionalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { professionals, catalogLoading, setSelectedProfessional, favorites, toggleFavorite, isLoggedIn, setShowLoginModal, setLoginIntent } = useApp();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState('');
  const pro = professionals.find(item => String(item.id) === id);

  useEffect(() => {
    if (!id) return;
    api<{ reviews: Review[] }>(`/providers/${id}/reviews`).then(result => setReviews(result.reviews)).catch(cause => setError(cause.message));
  }, [id]);
  const request = () => {
    if (!pro) return;
    setSelectedProfessional(pro);
    if (!isLoggedIn) { setLoginIntent('orcamento'); setShowLoginModal(true); }
    else navigate(`/orcamento?profissional=${pro.id}`);
  };

  if (!pro) return <main className="min-h-screen bg-[#0A1628] pt-28 text-center text-white">{catalogLoading ? 'Carregando profissional...' : 'Profissional não encontrado'}</main>;
  return <main className="min-h-screen bg-[#0A1628] px-4 pb-28 pt-24 text-white"><div className="mx-auto max-w-3xl space-y-5">
    <button onClick={() => navigate(-1)} className="text-[#FFD100]">← Voltar</button>
    <header className="flex gap-4 rounded-2xl bg-[#0D1F3C] p-5"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold" style={{ backgroundColor: pro.color }}>{pro.initials}</div><div className="flex-1"><h1 className="text-2xl font-black">{pro.name}</h1><p className="text-white/60">{pro.profession}</p><p className="mt-1 text-sm text-[#FFD100]">Perfil aprovado · {pro.rating} ★ ({pro.reviews} avaliações)</p></div><button onClick={() => toggleFavorite(pro.id).catch(cause => alert(cause.message))} aria-label="Salvar favorito" className="self-start text-2xl text-[#FFD100]">{favorites.includes(String(pro.id)) ? '♥' : '♡'}</button></header>
    <section className="rounded-2xl bg-white p-5 text-[#0A1628]"><h2 className="font-bold">Sobre o profissional</h2><p className="mt-2 text-sm text-gray-600">{pro.bio}</p><p className="mt-3 font-semibold">{pro.price}</p></section>
    <section className="rounded-2xl bg-white p-5 text-[#0A1628]"><h2 className="font-bold">Serviços oferecidos</h2><div className="mt-3 flex flex-wrap gap-2">{pro.services.map(service => <span key={service} className="rounded-full bg-gray-100 px-3 py-2 text-sm">{service}</span>)}</div></section>
    <section><h2 className="mb-3 text-lg font-bold">Avaliações</h2>{error && <p role="alert" className="text-red-300">{error}</p>}{!reviews.length && !error && <p className="text-white/50">Ainda não há avaliações.</p>}
      <div className="space-y-3">{reviews.map(review => <article key={review.id} className="rounded-2xl bg-white p-4 text-[#0A1628]"><div className="flex justify-between"><strong>{review.author}</strong><span className="text-amber-500">{'★'.repeat(review.rating)}</span></div><p className="mt-2 text-sm text-gray-600">{review.comment}</p><time className="mt-2 block text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('pt-BR')}</time></article>)}</div>
    </section>
    <button onClick={request} className="w-full rounded-xl bg-[#FFD100] p-4 font-bold text-[#0A1628]">Solicitar orçamento</button>
  </div></main>;
}
