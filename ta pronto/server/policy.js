export const JOB_TRANSITIONS = {
  confirmed: { provider_en_route: 'provider', cancelled: 'customer' },
  provider_en_route: { in_progress: 'provider', cancelled: 'customer' },
  in_progress: { completed: 'provider', disputed: 'customer' },
  completed: { disputed: 'customer' },
  cancelled: {},
  disputed: {},
};

export function canTransition(current, next, actor) {
  return JOB_TRANSITIONS[current]?.[next] === actor;
}

export function isConversationMember(conversation, userId) {
  return conversation.customer_id === userId || conversation.provider_id === userId;
}
