import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../appStore";
import { setErrors, setLoading } from "../commonUI/commonUISlice";
import { client } from "../../../HttpService";

export interface PortfolioState {
    jobsList: any;
}

const initialState: PortfolioState = {
	jobsList: "",
};

const JobsSlice = createSlice({
	name: "Jobs",
	initialState,
	reducers: {
		setJobsList: (state, { payload }: PayloadAction<any>) => {
			state.jobsList = payload;
		},
	}
})

export const getJobListData = (body: any, previousData: any = []): AppThunk => async (dispatch: any) => {
	dispatch(setLoading(true));
	try {
		const res = await client({ url: "/adhoc/getSampleJdJSON", method: 'POST', data: body });
		if (res.status === 200) {
			dispatch(setLoading(false));
			if (previousData && previousData?.length) {	
				let result = JSON.parse(JSON.stringify(previousData));		
				res?.data?.jdList?.forEach((item: any) => {
					result.push(item);
				});
				res.data.jdList = result;
			}
			dispatch(setJobsList(res.data));
		} else {
			dispatch(setErrors(res.error));
			dispatch(setLoading(false));
		}
	} catch (error) {
		dispatch(setErrors(error));
		dispatch(setLoading(false));
	}
};

export const {
	setJobsList,
	
} = JobsSlice.actions;

export default JobsSlice.reducer;
