"use client";
// pages/signin.js
import Signin from "../components/signin/signin";
import { Provider } from "react-redux";
import store from "../lib/store";
export default function Sign() {
  return (
    <Provider store={store}>
      <Signin />
    </Provider>
  );
}
