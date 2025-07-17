import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Chatroom {
  id: string;
  title: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ChatroomState {
  chatrooms: Chatroom[];
  filteredChatrooms: Chatroom[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  selectedChatroomId: string | null;
}

// Load chatrooms from localStorage if available
const loadChatroomsFromStorage = (): Chatroom[] => {
  if (typeof window !== 'undefined') {
    const savedChatrooms = localStorage.getItem('chatrooms');
    if (savedChatrooms) {
      return JSON.parse(savedChatrooms);
    }
  }
  return [];
};

// Initial state
const initialState: ChatroomState = {
  chatrooms: loadChatroomsFromStorage(),
  filteredChatrooms: loadChatroomsFromStorage(),
  searchQuery: '',
  isLoading: false,
  error: null,
  selectedChatroomId: null,
};

// Async thunks
export const createChatroom = createAsyncThunk(
  'chatrooms/create',
  async (title: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newChatroom: Chatroom = {
        id: Math.random().toString(36).substring(2, 15),
        title,
        createdAt: new Date().toISOString(),
      };
      
      // Get existing chatrooms from localStorage
      const existingChatrooms = loadChatroomsFromStorage();
      
      // Add new chatroom
      const updatedChatrooms = [newChatroom, ...existingChatrooms];
      
      // Save to localStorage
      localStorage.setItem('chatrooms', JSON.stringify(updatedChatrooms));
      
      return newChatroom;
    } catch (error) {
      return rejectWithValue('Failed to create chatroom');
    }
  }
);

export const deleteChatroom = createAsyncThunk(
  'chatrooms/delete',
  async (chatroomId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get existing chatrooms from localStorage
      const existingChatrooms = loadChatroomsFromStorage();
      
      // Filter out the chatroom to delete
      const updatedChatrooms = existingChatrooms.filter(
        chatroom => chatroom.id !== chatroomId
      );
      
      // Save to localStorage
      localStorage.setItem('chatrooms', JSON.stringify(updatedChatrooms));
      
      return chatroomId;
    } catch (error) {
      return rejectWithValue('Failed to delete chatroom');
    }
  }
);

// Chatroom slice
const chatroomSlice = createSlice({
  name: 'chatrooms',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      
      // Filter chatrooms based on search query
      if (action.payload.trim() === '') {
        state.filteredChatrooms = state.chatrooms;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredChatrooms = state.chatrooms.filter(
          chatroom => chatroom.title.toLowerCase().includes(query)
        );
      }
    },
    selectChatroom: (state, action: PayloadAction<string>) => {
      state.selectedChatroomId = action.payload;
    },
    clearSelectedChatroom: (state) => {
      state.selectedChatroomId = null;
    },
  },
  extraReducers: (builder) => {
    // Create chatroom
    builder.addCase(createChatroom.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createChatroom.fulfilled, (state, action) => {
      state.chatrooms = [action.payload, ...state.chatrooms];
      state.filteredChatrooms = state.searchQuery
        ? state.filteredChatrooms.filter(c => 
            c.title.toLowerCase().includes(state.searchQuery.toLowerCase())
          )
        : state.chatrooms;
      state.isLoading = false;
    });
    builder.addCase(createChatroom.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Delete chatroom
    builder.addCase(deleteChatroom.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteChatroom.fulfilled, (state, action) => {
      state.chatrooms = state.chatrooms.filter(
        chatroom => chatroom.id !== action.payload
      );
      state.filteredChatrooms = state.filteredChatrooms.filter(
        chatroom => chatroom.id !== action.payload
      );
      if (state.selectedChatroomId === action.payload) {
        state.selectedChatroomId = null;
      }
      state.isLoading = false;
    });
    builder.addCase(deleteChatroom.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSearchQuery, selectChatroom, clearSelectedChatroom } = chatroomSlice.actions;
export default chatroomSlice.reducer; 