import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  id: string | null
  email: string | null
  name: string | null
  created_at: string | null
  updated_at: string | null
  photo: string | null
  enable_picture: boolean
  new_user: boolean
}

const initialState: UserState = {
  id: null,
  email: null,
  name: null,
  created_at: null,
  updated_at: null,
  photo: null,
  enable_picture: false,
  new_user: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload }
    },
    clearUser: () => initialState,
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
