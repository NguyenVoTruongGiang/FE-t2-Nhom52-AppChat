import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  page: 1,
};

const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {
    setUserList: (state, action) => {
      console.log("Updating user list in state:", action.payload);
      state.users = action.payload; 
    },
    setPage: (state, action) => {
      console.log("Updating page in state:", action.payload);
      state.page = action.payload;
    },
    addUserToList: (state, action) => {
      state.users.push(action.payload);
    },
  },
});

export const { setUserList, setPage, addUserToList } = userListSlice.actions;
export default userListSlice.reducer;
