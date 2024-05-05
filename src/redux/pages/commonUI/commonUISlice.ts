import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PortfolioState {
    errors: any;
    loading: boolean;
}

const initialState: PortfolioState = {
	errors: "",
    loading: false,
};

const CommonUISlice = createSlice({
	name: "UI",
	initialState,
	reducers: {
        //error
		setErrors: (state, { payload }: PayloadAction<any>) => {
			state.errors = payload;
		},
        //loader
        setLoading: (state, { payload }: PayloadAction<any>) => {
			state.loading = payload;
		},
	}
})

export const {
    setErrors,
    setLoading,
	
} = CommonUISlice.actions;

export default CommonUISlice.reducer;
