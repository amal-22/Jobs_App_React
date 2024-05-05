import { combineReducers } from '@reduxjs/toolkit';
import JoblistSlice from './pages/joblist/JoblistSlice';
import commonUISlice from './pages/commonUI/commonUISlice';

const rootReducer = combineReducers({
    commonUISlice: commonUISlice,
    jobListSlice: JoblistSlice
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;