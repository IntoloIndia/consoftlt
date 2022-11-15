import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  setCompanyId,
  removeCompanyId,
  storeToken,
  removeToken,
} from './asyncStorageService';
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
  company_name: '',
  name: '',
  mobile: '',
  email: '',
  status: STATUSES.IDLE,
};

export const companySlice = createSlice({
  name: 'company_auth',
  initialState,
  reducers: {
    setCompanyToken: (state, action) => {
      (state.token = action.payload.access_token),
        (state.refresh_token = action.payload.refresh_token),
        (state._id = action.payload._id),
        (state.company_name = action.payload.company_name),
        (state.name = action.payload.name),
        (state.mobile = action.payload.mobile),
        (state.email = action.payload.email),
        (state.status = STATUSES.IDLE);
    },

    companyLogout: (state, action) => {
      (state.token = null),
        (state.refresh_token = null),
        (state._id = null),
        (state.company_name = null),
        (state.name = null),
        (state.mobile = null),
        (state.email = null),
        (state.status = STATUSES.LOGOUT);
      removeToken('token');
      removeCompanyId('company_id');
    },
  },

  extraReducers: builder => {
    builder
      //register company
      .addCase(registerCompany.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })

      .addCase(registerCompany.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          state.status = STATUSES.IDLE;
          state._id = action.payload._id;
          state.company_name = action.payload.company_name;
          state.mobile = action.payload.mobile;
          state.email = action.payload.email;
        }
      })

      //verify product key
      .addCase(verifyProductKey.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })

      .addCase(verifyProductKey.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          state.token = action.payload.access_token;
          state.status = STATUSES.IDLE;
          storeToken(action.payload.access_token);
          setCompanyId(action.payload._id);
        }
      })

      //login company
      .addCase(companyLogin.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(companyLogin.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          state.status = STATUSES.IDLE;
          state.token = action.payload.access_token;
          state.refresh_token = action.payload.refresh_token;
          state._id = action.payload._id;
          state.company_name = action.payload.company_name;
          state.name = action.payload.name;
          state.mobile = action.payload.mobile;
          state.email = action.payload.email;
          setCompanyId(action.payload._id);
          storeToken(action.payload.access_token);
        }
      })
      .addCase(companyLogin.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const {setCompanyToken, companyLogout} = companySlice.actions;
export default companySlice.reducer;

//register company
export const registerCompany = createAsyncThunk(
  'company/register',
  async companyData => {
    const res = await fetch(API_URL + 'company', {
      method: 'post',
      body: JSON.stringify(companyData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  },
);

//verify product key
export const verifyProductKey = createAsyncThunk(
  'company/verify_product_key',
  async productKey => {
    const res = await fetch(API_URL + 'verify-product-key', {
      method: 'post',
      body: JSON.stringify(productKey),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  },
);

//login company
export const companyLogin = createAsyncThunk(
  'company/login',
  async companyData => {
    const res = await fetch(API_URL + 'company-login', {
      method: 'post',
      body: JSON.stringify(companyData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  },
);
