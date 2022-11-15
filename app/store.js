import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';

import companyAuthReducer from '../services/companyAuthApi';
import userAuthReducer from '../services/userAuthApi';

export const store = configureStore({
  reducer: {
    company: companyAuthReducer,
    user: userAuthReducer,
  },
});

export default store;
