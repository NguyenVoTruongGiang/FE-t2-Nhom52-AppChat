import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  messages: []
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload)
    },
    setChatMessages(state, action) {
      state.messages = action.payload
    },
    // getPeopleChatMessages(state, action) {
    //   state.messages = action.payload;
    // }
  }
})

export const { addMessage, setChatMessages } = chatSlice.actions
export default chatSlice.reducer
