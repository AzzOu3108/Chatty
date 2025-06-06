import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { AuthStore, SignupBody, LoginBody } from "../types/Auth";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:8000";

export const useAuthStore = create<AuthStore>((set, get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatedProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")

            set({ authUser: res.data })
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth :", error)
            set({ authUser: null })
        } finally {
           set({ isCheckingAuth: false})
        }
    },

    signup: async (data: SignupBody) =>{
        set ({ isSigningUp: true})
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {
            const err = error as any
            toast.error(err?.response?.data?.message);
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data: LoginBody) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket()
        } catch (error) {
            const err = error as any
            toast.error(err?.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () =>{
        try {
            await axiosInstance.post("/auth/logout")
            toast.success("Logged out successfully");
            set({ authUser: null })
            get().disconnectSocket()
        } catch (error) {
            const err = error as any
            toast.error(err?.response?.data?.message);
        }
    },

    updateProfil: async(data:any) =>{
        set({isUpdatedProfile: true});
        try {
           await axiosInstance.put("/auth/update-profile", data)
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("error in update profile", error)
            const err = error as any
            toast.error(err?.response?.data?.message);
        } finally {
            set({ isUpdatedProfile: false })
        }
    },

    connectSocket: async () =>{
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return

        const socket = io(BASE_URL, {
            query:{
                userId: authUser._id
            }
        })
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) =>{
            set({ onlineUsers: userIds});
        })
    },
    disconnectSocket: async () =>{
        if(get().socket.connect) get().socket.disconnect()
    }
}))