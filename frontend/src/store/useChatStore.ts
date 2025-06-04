import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { ChatStore, Message } from "../types/Chat";
import { useAuthStore } from "./useAuthStore";

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

  sendMessage: async (data: { 
  text: string; 
  image?: string | null; 
  receiverId: string 
  }) => {
  const { messages } = get();
  try {
    const res = await axiosInstance.post(
      `/messages/send/${data.receiverId}`, 
      {
        text: data.text,
        image: data.image
      }
    );
    set({ messages: [...messages, res.data] });
  } catch (error) {
    const err = error as any;
    toast.error(err?.response?.data?.message);
  }
},

  subscribeToMessages: () => {
    const { selectedUser } = get();
    const authUser = useAuthStore.getState().authUser;
    const socket = useAuthStore.getState().socket;
    if (!selectedUser || !authUser || !socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage: Message) => {
        
        const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
        
        const isRelevantMessage = 
            (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser._id) ||
            (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser._id);

        if (isMessageFromSelectedUser || isRelevantMessage) {
            set((state) => ({
                messages: [...state.messages, newMessage]
            }));
        }
    });
},

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}))