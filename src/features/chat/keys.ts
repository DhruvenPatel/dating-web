export const chatKeys = {
  lookup: (friendId: string) => ["chat", "conversation", friendId] as const,
  ensure: (friendId: string) => ["chat", "ensure", friendId] as const,
  messages: (conversationId: string) => ["chat", "messages", conversationId] as const,
  unread: (conversationId: string) => ["chat", "unread", conversationId] as const,
};