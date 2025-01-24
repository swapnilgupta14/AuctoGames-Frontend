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
      const { userId, email, username, token, imageUrl, role } = action.payload;
      state.userId = userId;
      state.email = email;
      state.username = username;
      state.token = token;
      state.imageUrl = imageUrl;
      state.role = role;
    },
    clearUser(state) {
      state.userId = null;
      state.email = null;
      state.username = null;
      state.token = null;
      state.imageUrl = null;
      state.role = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
