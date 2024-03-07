import create from 'zustand'

// Define a user store
interface UserState {
  user: undefined  | {
    id: string,
    name: string,
    email: string,
    emailVerified: Date | undefined,
    image: string,
  },
  setUser: (user: UserState['user']) => void,
}

export const useUser = create<UserState>((set) => ({
  user: undefined,
  setUser: (user) => set(() => ({ user })),
}))
