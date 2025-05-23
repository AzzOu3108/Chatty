import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { AuthStore, SignupBody, LoginBody } from "../types/Auth";
import toast from "react-hot-toast";
import { data } from "react-router-dom";


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
        set ({ isSigningUp: true})
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created successfully")
        } catch (error: any) {
            toast.error(error.response.data.message)
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
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () =>{
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    },

    updateProfil: async(data:any) =>{
        set({isUpdatedProfile: true});
        try {
           await axiosInstance.put("/auth/update-profile", data)
            toast.success("Profile updated successfully")
        } catch (error: any) {
            console.log("error in update profile", error)
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatedProfile: false })
        }
    },
}))