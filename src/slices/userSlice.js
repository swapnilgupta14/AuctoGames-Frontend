import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  username: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { userId, email, username, token } = action.payload;
      state.userId = userId;
      state.email = email;
      state.username = username;
      state.token = token;
    },
    clearUser(state) {
      state.userId = null;
      state.email = null;
      state.username = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
