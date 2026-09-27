import { useState } from 'react';
import { useNavigate } from 'react-router';
import { post } from '../api/client';
import { useApp } from '../context/AppContext';
import { ServiceTagsInput } from '../components/ServiceTagsInput';

export function ProfessionalRegister() {
  const { categories, user, setShowLoginModal } = useApp();
  const navigate = useNavigate();
  const [publicName, setPublicName] = useState('');
  const [bio, setBio] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [startingPrice, setStartingPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Teresina');
  const [yearsExperience, setYearsExperience] = useState('0');
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [startsAt, setStartsAt] = useState('08:00');
  const [endsAt, setEndsAt] = useState('18:00');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const missing = [
    !publicName.trim() && 'Informe o nome público.',
    !serviceId && 'Selecione uma categoria.',
    tags.length === 0 && 'Adicione ao menos um serviço específico.',
    !bio.trim() && 'Descreva seu trabalho.',
    !/^\d{10,11}$/.test(phone.replace(/\D/g, '')) && 'Informe um telefone com DDD e 10 ou 11 dígitos.',
    city.trim().toLocaleLowerCase('pt-BR') !== 'teresina' && 'Nesta etapa, a cidade deve ser Teresina.',
    (!Number.isInteger(Number(yearsExperience)) || Number(yearsExperience) < 0 || Number(yearsExperience) > 70) && 'Informe a experiência entre 0 e 70 anos.',
    (startingPrice.trim() === '' || Number(startingPrice) < 0 || Number(startingPrice) > 1_000_000) && 'Informe um preço inicial válido.',
    weekdays.length === 0 && 'Selecione ao menos um dia de atendimento.',
    startsAt >= endsAt && 'O horário final deve ser depois do inicial.',
  ].filter((item): item is string => typeof item === 'string');

  const submit = async () => {
    setAttempted(true);
    if (missing.length) return;
    if (!user) { setShowLoginModal(true); return; }
    setBusy(true); setError('');
    try {
      await post('/providers/apply', { publicName, bio, serviceId, tags, startingPrice: Number(startingPrice),
        phone: phone.replace(/\D/g, ''), city, yearsExperience: Number(yearsExperience), weekdays, startsAt, endsAt });
      setDone(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Cadastro não enviado'); }
    finally { setBusy(false); }
  };

  return <main className="min-h-screen bg-[#0A1628] px-4 pb-24 pt-24 text-white"><div className="mx-auto max-w-xl">
    <h1 className="text-2xl font-black">Anuncie seu serviço</h1>
    <p className="mt-2 text-white/60">O cadastro é gratuito. A equipe analisa o perfil antes de publicar.</p>
    {done ? <div className="mt-8 rounded-2xl bg-[#0D1F3C] p-6"><h2 className="text-xl font-bold">Cadastro recebido</h2><p className="mt-2 text-white/60">Você poderá acompanhar a análise na sua área.</p><button onClick={() => navigate('/cliente')} className="mt-5 rounded-xl bg-[#FFD100] px-5 py-3 font-bold text-[#0A1628]">Ir para minha área</button></div>
      : <div className="mt-6 grid gap-4 rounded-2xl bg-[#0D1F3C] p-5">
        <label>Nome público<input value={publicName} onChange={event => setPublicName(event.target.value)} maxLength={120} className="mt-1 w-full rounded-xl bg-white p-3 text-[#0A1628]" /></label>
        <label>Serviço<select value={serviceId} onChange={event => setServiceId(event.target.value)} className="mt-1 w-full rounded-xl bg-white p-3 text-[#0A1628]"><option value="">Selecione</option>{categories.map(category => <option key={category.id} value={category.serviceId}>{category.name}</option>)}</select></label>
        <ServiceTagsInput tags={tags} onChange={setTags} disabled={busy} />
        <label>Sobre seu trabalho<textarea value={bio} onChange={event => setBio(event.target.value)} maxLength={2000} rows={5} className="mt-1 w-full rounded-xl bg-white p-3 text-[#0A1628]" /></label>
        <label>Telefone para contato<input type="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="DDD + número" className="mt-1 w-full rounded-xl bg-white p-3 text-[#0A1628]" /></label>
        <label>Cidade<input value={city} onChange={event => setCity(event.target.value)} className="mt-1 w-full rounded-xl bg-white p-3 text-[#0A1628]" /></label>
        <label>Anos de experiência<input type="number" min="0" max="70" value={yearsExperience} onChange={event => setYearsExperience(event.target.value)} className="mt-1 w-full rounded-xl bg-white p-3 text-[#0A1628]" /></label>
        <label>Preço inicial em reais<input type="number" min="0" value={startingPrice} onChange={event => setStartingPrice(event.target.value)} className="mt-1 w-full rounded-xl bg-white p-3 text-[#0A1628]" /></label>
        <fieldset><legend className="mb-2">Dias de atendimento</legend><div className="flex flex-wrap gap-2">{[
          ['Dom',0],['Seg',1],['Ter',2],['Qua',3],['Qui',4],['Sex',5],['Sáb',6],
        ].map(([label,day]) => <label key={day} className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-2 text-sm"><input type="checkbox" checked={weekdays.includes(Number(day))} onChange={() => setWeekdays(previous => previous.includes(Number(day)) ? previous.filter(value => value !== Number(day)) : [...previous, Number(day)])} />{label}</label>)}</div></fieldset>
        <div className="grid grid-cols-2 gap-3"><label>Das<input type="time" value={startsAt} onChange={event => setStartsAt(event.target.value)} className="mt-1 w-full rounded-xl bg-white p-3 text-[#0A1628]" /></label><label>Até<input type="time" value={endsAt} onChange={event => setEndsAt(event.target.value)} className="mt-1 w-full rounded-xl bg-white p-3 text-[#0A1628]" /></label></div>
        {attempted && missing.length > 0 && <div role="alert" className="rounded-xl bg-amber-950/70 p-4 text-sm text-amber-100"><p className="font-bold">Confira antes de enviar:</p><ul className="mt-2 list-disc space-y-1 pl-5">{missing.map(message => <li key={message}>{message}</li>)}</ul></div>}
        {error && <p role="alert" className="text-red-300">{error}</p>}
        <button onClick={submit} disabled={busy} className="rounded-xl bg-[#FFD100] p-3 font-bold text-[#0A1628] disabled:opacity-50">{busy ? 'Enviando...' : 'Enviar cadastro'}</button>
      </div>}
  </div></main>;
}
