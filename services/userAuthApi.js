import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  setUserId,
  removeUserId,
  storeToken,
  removeToken,
} from './asyncStorageService';
import {constants} from '../constants';
import {API_URL} from '@env';

export const STATUSES = Object.freeze({
  IDLE: 'idle',
  ERROR: 'error',
  LOADING: 'loading',
  LOGOUT: 'logout',
});

const initialState = {
  token: '',
  refresh_token: '',
  _id: '',
  user_id: '',
  company_id: '',
  company_name: '',
  name: '',
  mobile: '',
  email: '',
  status: STATUSES.IDLE,
};

export const userSlice = createSlice({
  name: 'user_auth',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      (state.token = action.payload.access_token),
        (state.refresh_token = action.payload.refresh_token),
        (state._id = action.payload._id),
        (state.user_id = action.payload._id),
        (state.company_id = action.payload.company_id),
        (state.company_name = action.payload.company_name),
        (state.name = action.payload.name),
        (state.mobile = action.payload.mobile),
        (state.email = action.payload.email),
        (state.status = STATUSES.IDLE);
    },

    userLogout: (state, action) => {
      (state.token = null),
        (state.refresh_token = null),
        (state._id = null),
        (state.user_id = null),
        (state.company_id = null),
        (state.company_name = null),
        (state.name = null);
      state.mobile = null;
      state.email = null;
      state.status = STATUSES.LOGOUT;
      removeToken('token');
      removeUserId('user_id');
    },
  },

  extraReducers: builder => {
    builder
      .addCase(userLogin.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        // console.log(action.payload)

        if (
          action.payload.user_privilege === constants.USER_PRIVILEGES.OTHER_USER
        ) {
          if (action.payload.status === 200) {
            state.status = STATUSES.IDLE;
            state.token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
            state._id = action.payload._id;
            state.user_id = action.payload._id;
            state.company_id = action.payload.company_id;
            state.company_name = action.payload.company_name;
            state.name = action.payload.name;
            state.mobile = action.payload.mobile;
            state.email = action.payload.email;
            setUserId(action.payload._id);
            storeToken(action.payload.access_token);
          }
        } else {
          //admin section
          if (action.payload.status === 200) {
            state.status = STATUSES.IDLE;
            state.token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
            state._id = action.payload.company_id;
            state.user_id = action.payload._id;
            state.company_id = action.payload.company_id;
            state.company_name = action.payload.company_name;
            state.name = action.payload.name;
            state.mobile = action.payload.mobile;
            state.email = action.payload.email;
            setUserId(action.payload._id);
            storeToken(action.payload.access_token);
          }
        }
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const {setUserToken, userLogout} = userSlice.actions;
export default userSlice.reducer;

export const userLogin = createAsyncThunk('user/login', async userData => {
  const res = await fetch(API_URL + 'login', {
    method: 'post',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
});
