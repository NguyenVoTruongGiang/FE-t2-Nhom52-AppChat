import { configureStore } from "@reduxjs/toolkit"
import chatReducer from "../actions/chatSlice";
import userListReducer from "../actions/userListSlice";
import userReducer from "../actions/userListSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    userList: userListReducer
  }
});

export default store;
