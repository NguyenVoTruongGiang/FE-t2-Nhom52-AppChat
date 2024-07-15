import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  username: ""
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUsername: (state, action) => {
      state.username = action.payload.username
    }
  }
})

export const { getUsername } = userSlice.actions

export default userSlice.reducer
