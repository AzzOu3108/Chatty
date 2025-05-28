import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { ChatStore, Message } from "../types/Chat";

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      const err = error as any
      toast.error(err?.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

    getMessages: async (userId:any) => {
        set({isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data});
        } catch (error) {
            const err = error as any
            toast.error(err?.response?.data?.message);
        } finally {
            set({isMessagesLoading: false})
        }
    },

  sendMessage: async (data: { content: string; image?: string | null; receiverId: string }) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${data.receiverId}`, data);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      const err = error as any;
      toast.error(err?.response?.data?.message);
    }
  },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}))