export const SET_CURRENT_STEP = "SET_CURRENT_STEP";
export const STORE_CV_RESULTS = "STORE_CV_RESULTS";

// Action creators
export const setCurrentStep = (step) => ({
  type: SET_CURRENT_STEP,
  payload: step,
});
// actions/userActions.js

export const setUser = (user) => {
  return {
    type: "SET_USER",
    payload: user,
  };
};
export const storeCVResults = (cvResults) => ({
  type: STORE_CV_RESULTS,
  payload: cvResults,
});
