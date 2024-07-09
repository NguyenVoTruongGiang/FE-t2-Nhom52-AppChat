import { configureStore } from "@reduxjs/toolkit"
import chatReducer from "../actions/chatSlice";
import userListReducer from "../actions/userListSlice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    userList: userListReducer
  }
});

export default store;
