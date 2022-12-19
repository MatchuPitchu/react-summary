import { createSlice } from '@reduxjs/toolkit';

// add second slice of global state
const initialAutchState = { isAuth: false };

const authSlice = createSlice({
  name: 'authentification',
  initialState: initialAutchState,
  reducers: {
    login: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    },
  },
});

// export action dispatchers that you can use it in other components to update the state
export const authActions = authSlice.actions;

// if you only need reducer, then export only this
export default authSlice.reducer;
