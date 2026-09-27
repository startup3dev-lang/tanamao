import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransition, isConversationMember } from './policy.js';

test('somente os atores permitidos avançam serviços', () => {
  assert.equal(canTransition('confirmed', 'provider_en_route', 'provider'), true);
  assert.equal(canTransition('confirmed', 'completed', 'provider'), false);
  assert.equal(canTransition('confirmed', 'provider_en_route', 'customer'), false);
  assert.equal(canTransition('completed', 'cancelled', 'customer'), false);
});

test('somente participantes acessam uma conversa', () => {
  const conversation = { customer_id: 'cliente', provider_id: 'prestador' };
  assert.equal(isConversationMember(conversation, 'cliente'), true);
  assert.equal(isConversationMember(conversation, 'prestador'), true);
  assert.equal(isConversationMember(conversation, 'terceiro'), false);
});
