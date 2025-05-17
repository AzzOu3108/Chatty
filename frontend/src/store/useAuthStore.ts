import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { AuthStore, SignupBody } from "../types/Auth";

export const useAuthStore = create<AuthStore>((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatedProfile: false,

    isCheckingAuth: true,
    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")

            set({ authUser: res.data })
        } catch (error) {
            console.log("Error in checkAuth :", error)
            set({ authUser: null })
        } finally {
           set({ isCheckingAuth: false})
        }
    },

    signup: async (data: SignupBody) =>{

    }
}))