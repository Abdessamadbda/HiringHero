import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

// Define reducer for the step slice
const stepReducer = (state = { currentStep: 0 }, action) => {
  switch (action.type) {
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };
    default:
      return state;
  }
};
const keywordsReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_KEYWORDS":
      return action.payload;
    default:
      return state;
  }
};
// Combine reducers
const rootReducer = combineReducers({
  // Assuming you have a products reducer elsewhere
  step: stepReducer, 
  keywords: keywordsReducer, // Include the step reducer
});

const middleware = [thunk];

const store = createStore(rootReducer, {}, applyMiddleware());

export default store;
