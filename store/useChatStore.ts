import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversation, Message, UserPreferences } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  preferences: UserPreferences;

  // Actions
  createConversation: () => string;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  deleteConversation: (id: string) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  renameConversation: (id: string, title: string) => void;
}

const defaultPreferences: UserPreferences = {
  aiMode: 'explain',
  programmingLevel: 'intermediate',
  responseStyle: 'balanced',
  creativity: 'balanced',
  temperature: 0.3,
  responseLength: 'medium',
  theme: 'dark',
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: {},
      activeConversationId: null,
      preferences: defaultPreferences,

      createConversation: () => {
        const id = uuidv4();
        const now = Date.now();
        const newConversation: Conversation = {
          id,
          title: 'New Conversation',
          messages: [],
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          conversations: {
            ...state.conversations,
            [id]: newConversation,
          },
          activeConversationId: id,
        }));

        return id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) => {
        set((state) => {
          const conv = state.conversations[conversationId];
          if (!conv) return state;

          // If it's the first user message and title is "New Conversation", we could update it later
          // Update the title if first user message
          let newTitle = conv.title;
          if (conv.messages.length === 0 && message.role === 'user') {
            newTitle = message.content.substring(0, 40) + (message.content.length > 40 ? '...' : '');
          }

          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conv,
                title: newTitle,
                messages: [...conv.messages, message],
                updatedAt: Date.now(),
              },
            },
          };
        });
      },

      updateMessage: (conversationId, messageId, updates) => {
        set((state) => {
          const conv = state.conversations[conversationId];
          if (!conv) return state;

          const updatedMessages = conv.messages.map((m) =>
            m.id === messageId ? { ...m, ...updates } : m
          );

          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conv,
                messages: updatedMessages,
                updatedAt: Date.now(),
              },
            },
          };
        });
      },

      deleteConversation: (id) => {
        set((state) => {
          const newConversations = { ...state.conversations };
          delete newConversations[id];
          
          return {
            conversations: newConversations,
            activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
          };
        });
      },

      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }));
      },

      renameConversation: (id, title) => {
        set((state) => {
          const conv = state.conversations[id];
          if (!conv) return state;

          return {
            conversations: {
              ...state.conversations,
              [id]: {
                ...conv,
                title,
                updatedAt: Date.now(),
              },
            },
          };
        });
      },
    }),
    {
      name: 'devora-ai-storage',
    }
  )
);
