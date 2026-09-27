import { useState, type KeyboardEvent } from 'react';

type Props = { tags: string[]; onChange: (tags: string[]) => void; disabled?: boolean };

const normalize = (value: string) => value.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ').trim();

export function ServiceTagsInput({ tags, onChange, disabled = false }: Props) {
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState('');

  const add = () => {
    const label = draft.trim().replace(/\s+/g, ' ');
    if (!label) return;
    if (label.length < 2 || label.length > 60 || !/^[\p{L}\p{N}][\p{L}\p{N} /+().,-]*$/u.test(label)) {
      setHint('Use de 2 a 60 caracteres: letras, números e pontuação simples.'); return;
    }
    if (tags.length >= 15) { setHint('Você pode adicionar até 15 serviços.'); return; }
    if (tags.some(tag => normalize(tag) === normalize(label))) { setHint('Este serviço já foi adicionado.'); return; }
    onChange([...tags, label]); setDraft(''); setHint('');
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); add(); }
  };

  return <div>
    <label htmlFor="service-tag-input" className="block font-medium">Serviços que você faz</label>
    <p className="mt-1 text-sm text-white/60">Escreva um serviço por vez e pressione Enter. Ex.: capinar quintal, instalar tomada.</p>
    <div className="mt-2 flex gap-2">
      <input id="service-tag-input" value={draft} onChange={event => { setDraft(event.target.value); setHint(''); }} onKeyDown={keyDown}
        maxLength={60} disabled={disabled} placeholder="Digite um serviço específico"
        className="min-w-0 flex-1 rounded-xl bg-white p-3 text-[#0A1628] disabled:opacity-60" />
      <button type="button" onClick={add} disabled={disabled || !draft.trim()} className="rounded-xl bg-white/15 px-4 py-2 font-bold disabled:opacity-50">Adicionar</button>
    </div>
    {hint && <p role="alert" className="mt-2 text-sm text-amber-300">{hint}</p>}
    {tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2" aria-label="Serviços adicionados">{tags.map(tag =>
      <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-[#FFD100] px-3 py-1.5 text-sm font-medium text-[#0A1628]">
        {tag}<button type="button" onClick={() => onChange(tags.filter(item => item !== tag))} disabled={disabled}
          aria-label={`Remover ${tag}`} className="font-bold hover:opacity-60">×</button>
      </span>)}</div>}
    <p className="mt-2 text-xs text-white/45">{tags.length}/15 serviços</p>
  </div>;
}
