import type { AuthUser } from "./Auth";

export interface ChatStore {
  messages: any[];
  users: AuthUser[];
  selectedUser: AuthUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: AuthUser | null) => void;
}

export interface Message {
  _id: string;
  sender: string; 
  receiver: string;
  content: string;
  createdAt: string;
}