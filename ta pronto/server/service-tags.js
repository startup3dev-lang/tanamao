import { z } from 'zod';

export const normalizeServiceTag = value => value.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ').trim();

const tag = z.string().trim().min(2).max(60)
  .regex(/^[\p{L}\p{N}][\p{L}\p{N} /+().,-]*$/u, 'Use apenas letras, números e pontuação simples');

export const serviceTags = z.array(tag).max(15).superRefine((tags, context) => {
  const seen = new Set();
  for (const [index, value] of tags.entries()) {
    const normalized = normalizeServiceTag(value);
    if (seen.has(normalized)) context.addIssue({ code: 'custom', path: [index], message: 'Serviço repetido' });
    seen.add(normalized);
  }
});

export async function saveServiceTags(client, providerId, tags) {
  await client.query('delete from provider_service_tags where provider_id=$1', [providerId]);
  for (const label of tags) {
    await client.query('insert into provider_service_tags(provider_id,label,normalized_tag) values($1,$2,$3)',
      [providerId, label, normalizeServiceTag(label)]);
  }
}
