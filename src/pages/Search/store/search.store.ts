import create from "zustand";
import { searchUsers } from "../../../services/github.service";

interface User {
  username: string;
  avatar: string;
}

export interface SearchStore {
  users: User[];
  loading: boolean;
  error?: string;
  search: (terms: string) => void;
}

export const useSearchStore = create<SearchStore>(set => ({
  users: [],
  loading: false,
  search: async (terms: string) => {
    set({ loading: true, error: undefined, users: [] });
    try {
      const searchResult = await searchUsers(terms);
      const users = searchResult.items.map(x => ({
        username: x.login,
        avatar: x.avatar_url,
      }));
      set({ users, loading: false });
    } catch (error) {
      let errorMessage = "An error occurred";
      if (error instanceof Error) errorMessage = error.message;
      set({ error: errorMessage, loading: false });
    }
  },
}));
