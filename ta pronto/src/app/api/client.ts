const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try { response = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
  }); } catch (cause) {
    if (cause instanceof Error && cause.name === 'AbortError') throw cause;
    throw new Error('Sem conexão com o serviço. Tente novamente em alguns instantes.');
  }
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const labels: Record<string, string> = {
      name: 'Nome', email: 'E-mail', password: 'Senha', publicName: 'Nome público', bio: 'Sobre seu trabalho',
      serviceId: 'Categoria', tags: 'Serviços', startingPrice: 'Preço inicial', phone: 'Telefone', city: 'Cidade',
      yearsExperience: 'Anos de experiência', weekdays: 'Dias de atendimento', startsAt: 'Horário inicial',
      endsAt: 'Horário final', description: 'Descrição', preferredAt: 'Data do serviço', postalCode: 'CEP',
      street: 'Rua', number: 'Número', neighborhood: 'Bairro', state: 'UF',
    };
    const details = Array.isArray(body.details) ? body.details.map((item: { path?: string; message?: string }) => {
      const field = item.path?.split('.').find(part => labels[part]);
      return `${field ? labels[field] : 'Campo'}: ${item.message || 'valor inválido'}`;
    }).join('; ') : '';
    throw new Error(details || body.error || 'Não foi possível completar a operação');
  }
  return body as T;
}

export const post = <T>(path: string, data?: unknown) => api<T>(path, { method: 'POST', body: JSON.stringify(data ?? {}) });
export const patch = <T>(path: string, data: unknown) => api<T>(path, { method: 'PATCH', body: JSON.stringify(data) });
export const del = (path: string) => api<void>(path, { method: 'DELETE' });
