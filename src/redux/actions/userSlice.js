import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  username: "",
  isLoggedIn: false,
  reloginCode: "",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username
      state.isLoggedIn = true
      state.reloginCode = action.payload.reloginCode
    },
    logout: state => {
      state.username = ""
      state.isLoggedIn = false
      state.reloginCode = ""
    },
    reLogin: (state, action) => {
      state.reloginCode = action.payload.reloginCode
    }
  }
})

export const { login, logout, reLogin } = userSlice.actions

export default userSlice.reducer
