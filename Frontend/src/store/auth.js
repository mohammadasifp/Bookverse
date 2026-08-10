import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, role: null },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.role = action.payload.role;
    },
    
    logout(state) {
      state.isLoggedIn = false;
      state.role = "";
    },
    changeRole(state, action) {
      state.role = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
