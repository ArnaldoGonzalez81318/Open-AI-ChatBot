import { useCallback, useState } from 'react';
import type { ChatMessage } from '../types/chat';

const API_URL = (import.meta as any)?.env?.VITE_API_URL ?? '';

type UseChatApiResult = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  resetConversation: () => void;
};

const generateId = () => crypto.randomUUID();

export function useChatApi(): UseChatApiResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim();
      if (!trimmedContent) {
        return;
      }

      if (!API_URL) {
        setError('Missing VITE_API_URL. Please configure your API endpoint.');
        return;
      }

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmedContent,
        createdAt: new Date().toISOString()
      };

      const conversation = [...messages, userMessage].map(({ role, content }) => ({
        role,
        content
      }));

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: trimmedContent,
            history: conversation
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error ?? 'Unable to retrieve a response.');
        }

        if (typeof data?.message !== 'string' || !data.message.trim()) {
          throw new Error('The assistant returned an empty response.');
        }

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: data.message.trim(),
          createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const fallback = err instanceof Error ? err.message : 'Unknown error';
        setError(fallback);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation
  };
}
