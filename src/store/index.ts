import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import counterReducer from './slices/counterSlice';
import authReducer from './slices/authSlice';
import chatroomReducer from './slices/chatroomSlice';
import themeReducer from './slices/themeSlice';
import messageReducer from './slices/messageSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    chatrooms: chatroomReducer,
    theme: themeReducer,
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 