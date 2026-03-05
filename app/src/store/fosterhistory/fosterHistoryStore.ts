import { axiosInstance } from "@/services/authService";
import type { FosterHistory } from "@/types/types";
import { create } from "zustand";

interface FosterHistoryState {
  fosterHistory: FosterHistory[];
  selectedFosterHistory: FosterHistory | null;
  loading: boolean;
  error: string | null;

  fetchAllFosterHistory: () => Promise<void>;
  fetchUserFosterHistory: (userId: number) => Promise<void>;
  fetchAnimalFosterHistory: (animalId: number) => Promise<void>;
  createFosterHistory: (
    fosterHistory: Omit<FosterHistory, "foster_history_id">
  ) => Promise<void>;
  updateFosterHistory: (fosterHistory: FosterHistory) => Promise<void>;
  deleteFosterHistory: (id: number) => Promise<void>;
  setSelectedFosterHistory: (fosterHistory: FosterHistory | null) => void;
}

export const useFosterHistoryStore = create<FosterHistoryState>((set) => ({
  fosterHistory: [],
  selectedFosterHistory: null,
  loading: false,
  error: null,

  fetchAllFosterHistory: async () => {
    set({ loading: true, error: null });
    try {
      const response = (
        await axiosInstance.get<{ data: FosterHistory[] }>("foster-history")
      ).data;
      set({ fosterHistory: response.data });
    } catch (error) {
      set({ error: "Failed to fetch foster history" });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserFosterHistory: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = (
        await axiosInstance.get<{ data: FosterHistory[] }>(
          `foster-history/user/${userId}`
        )
      ).data;
      set({ fosterHistory: response.data });
    } catch (error) {
      set({ error: "Failed to fetch user foster history" });
    } finally {
      set({ loading: false });
    }
  },

  fetchAnimalFosterHistory: async (animalId) => {
    set({ loading: true, error: null });
    try {
      const response = (
        await axiosInstance.get<{ data: FosterHistory[] }>(
          `foster-history/animal/${animalId}`
        )
      ).data;
      set({ fosterHistory: response.data });
    } catch (error) {
      set({ error: "Failed to fetch animal foster history" });
    } finally {
      set({ loading: false });
    }
  },

  createFosterHistory: async (fosterHistory) => {
    set({ loading: true, error: null });
    try {
      const {
        animal_display,
        foster_history_id,
        animal,
        name,
        description,
        status,
        ...payload
      } = fosterHistory as any;

      const response = (
        await axiosInstance.post<{ data: FosterHistory }>(
          "foster-history",
          payload
        )
      ).data;

      set((state) => ({
        fosterHistory: [...state.fosterHistory, response.data],
      }));
    } catch (error) {
      set({ error: "Failed to create foster history" });
    } finally {
      set({ loading: false });
    }
  },

  updateFosterHistory: async (fosterHistory) => {
    set({ loading: true, error: null });
    try {
      const { animal_display, foster_history_id, animal, ...payload } =
        fosterHistory as any;
      const response = (
        await axiosInstance.put<{ data: FosterHistory }>(
          `foster-history/${fosterHistory.foster_history_id}`,
          payload
        )
      ).data;
      set((state) => ({
        fosterHistory: state.fosterHistory.map((f) =>
          f.foster_history_id === fosterHistory.foster_history_id
            ? response.data
            : f
        ),
      }));
    } catch (error) {
      set({ error: "Failed to update foster history" });
    } finally {
      set({ loading: false });
    }
  },

  deleteFosterHistory: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`foster-history/${id}`);
      set((state) => ({
        fosterHistory: state.fosterHistory.filter(
          (f) => f.foster_history_id !== id
        ),
      }));
    } catch (error) {
      set({ error: "Failed to delete foster history" });
    } finally {
      set({ loading: false });
    }
  },

  setSelectedFosterHistory: (fosterHistory) =>
    set({ selectedFosterHistory: fosterHistory }),
}));
