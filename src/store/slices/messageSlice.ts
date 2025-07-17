import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Message {
  id: string;
  chatroomId: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  imageUrl?: string; // For image messages
}

interface MessageState {
  messages: Record<string, Message[]>; // Keyed by chatroomId
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  currentPage: number;
  hasMoreMessages: boolean;
  messagesPerPage: number;
}

// Load messages from localStorage if available
const loadMessagesFromStorage = (): Record<string, Message[]> => {
  if (typeof window !== 'undefined') {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
  }
  return {};
};

// Initial state
const initialState: MessageState = {
  messages: loadMessagesFromStorage(),
  isLoading: false,
  error: null,
  isTyping: false,
  currentPage: 1,
  hasMoreMessages: false,
  messagesPerPage: 20,
};

// Helper function to save messages to localStorage
const saveMessagesToStorage = (messages: Record<string, Message[]>) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('messages', JSON.stringify(messages));
  }
};

// Generate AI response with delay
const generateAIResponse = async (userMessage: string): Promise<string> => {
  // Simple response logic - can be expanded
  const responses = [
    "That's an interesting point. Let me think about that.",
    "I understand what you're saying. Here's what I think...",
    "Based on my knowledge, I would suggest considering this approach.",
    "That's a great question. The answer depends on several factors.",
    "I've analyzed this and have some thoughts to share.",
  ];
  
  // Add some responses based on keywords in the user message
  if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
    responses.push("Hello! How can I assist you today?");
  }
  if (userMessage.toLowerCase().includes('help')) {
    responses.push("I'd be happy to help you with that. What specifically do you need assistance with?");
  }
  if (userMessage.toLowerCase().includes('thanks') || userMessage.toLowerCase().includes('thank you')) {
    responses.push("You're welcome! Is there anything else I can help you with?");
  }
  
  // Simulate thinking time - between 1-3 seconds
  const thinkingTime = Math.floor(Math.random() * 2000) + 1000;
  await new Promise(resolve => setTimeout(resolve, thinkingTime));
  
  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)];
};

// Async thunks
export const sendMessage = createAsyncThunk(
  'messages/send',
  async ({ chatroomId, content, imageUrl }: { chatroomId: string, content: string, imageUrl?: string }, { dispatch, getState }) => {
    try {
      // Create user message
      const userMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        chatroomId,
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        imageUrl,
      };
      
      // Return the user message first
      dispatch(addMessage(userMessage));
      
      // Set typing indicator
      dispatch(setTyping(true));
      
      // Generate AI response after a delay
      const aiResponse = await generateAIResponse(content);
      
      // Create AI message
      const aiMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        chatroomId,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      // Clear typing indicator
      dispatch(setTyping(false));
      
      return aiMessage;
    } catch (error) {
      throw new Error('Failed to send message');
    }
  }
);

export const loadMoreMessages = createAsyncThunk(
  'messages/loadMore',
  async (chatroomId: string, { getState }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate dummy older messages
      const olderMessages: Message[] = [];
      const state = getState() as { messages: MessageState };
      const currentMessages = state.messages.messages[chatroomId] || [];
      const oldestMessageTime = currentMessages.length > 0 
        ? new Date(currentMessages[currentMessages.length - 1].timestamp).getTime()
        : Date.now();
      
      // Create 10 older messages
      for (let i = 0; i < 10; i++) {
        const timestamp = new Date(oldestMessageTime - (i + 1) * 60000).toISOString();
        olderMessages.push({
          id: Math.random().toString(36).substring(2, 15),
          chatroomId,
          content: `This is an older message #${i + 1}`,
          sender: i % 2 === 0 ? 'user' : 'ai',
          timestamp,
        });
      }
      
      return { chatroomId, messages: olderMessages };
    } catch (error) {
      throw new Error('Failed to load more messages');
    }
  }
);

// Message slice
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const { chatroomId } = action.payload;
      
      // Initialize chatroom messages array if it doesn't exist
      if (!state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
      
      // Add message to the beginning of the array (newest first)
      state.messages[chatroomId] = [action.payload, ...state.messages[chatroomId]];
      
      // Save to localStorage
      saveMessagesToStorage(state.messages);
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.hasMoreMessages = true;
    },
    nextPage: (state) => {
      state.currentPage += 1;
    },
  },
  extraReducers: (builder) => {
    // Send message (AI response)
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      const { chatroomId } = action.payload;
      
      // Initialize chatroom messages array if it doesn't exist
      if (!state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
      
      // Add AI message to the beginning of the array
      state.messages[chatroomId] = [action.payload, ...state.messages[chatroomId]];
      
      // Save to localStorage
      saveMessagesToStorage(state.messages);
    });
    
    // Load more messages
    builder.addCase(loadMoreMessages.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loadMoreMessages.fulfilled, (state, action) => {
      const { chatroomId, messages } = action.payload;
      
      // Initialize chatroom messages array if it doesn't exist
      if (!state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
      
      // Add older messages to the end of the array
      state.messages[chatroomId] = [...state.messages[chatroomId], ...messages];
      
      // Update pagination
      state.hasMoreMessages = messages.length === 10; // If we got less than 10, we're at the end
      state.isLoading = false;
      
      // Save to localStorage
      saveMessagesToStorage(state.messages);
    });
    builder.addCase(loadMoreMessages.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to load more messages';
    });
  },
});

export const { addMessage, setTyping, resetPagination, nextPage } = messageSlice.actions;
export default messageSlice.reducer; 