import type { AuthUser } from "./Auth";

export interface ChatStore {
  messages: any[];
  users: AuthUser[];
  selectedUser: AuthUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (data: { text: string; image?: string | null; receiverId: string }) => Promise<void>;
  setSelectedUser: (user: AuthUser | null) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
}