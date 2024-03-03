export const SET_CURRENT_STEP = "SET_CURRENT_STEP";

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
