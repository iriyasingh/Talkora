import { create } from "zustand";
import toast from "react-hot-toast";
import * as authApi from "../api/auth";
import { disconnectStreamClient } from "../lib/streamClient";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isOnboarding: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const data = await authApi.getAuthUser();
      set({ authUser: data.user ?? data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const data = await authApi.signup(formData);
      set({ authUser: data.user ?? data });
      toast.success("Account created");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const data = await authApi.login(formData);
      set({ authUser: data.user ?? data });
      toast.success("Welcome back");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await authApi.logout();
      await disconnectStreamClient();
      set({ authUser: null });
      toast.success("Logged out");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    } finally {
      set({ isLoggingOut: false });
    }
  },

  completeOnboarding: async (formData) => {
    set({ isOnboarding: true });
    try {
      const data = await authApi.completeOnboarding(formData);
      set({ authUser: data.user ?? data });
      toast.success("Profile set up");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Onboarding failed");
      return false;
    } finally {
      set({ isOnboarding: false });
    }
  },
}));

// convenience selector-free getter for non-component usage
export const getAuthUser = () => useAuthStore.getState().authUser;

