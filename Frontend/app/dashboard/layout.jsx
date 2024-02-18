"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "../lib/store";
import Layout1 from "../components/dashboard/layout";
import Stepper from "../components/dashboard/stepper";

const Layout = ({ children }) => (
  <Provider store={store}>
    <Layout1 />
    <Stepper className="bg-white" />
    <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-white">
      {children}
    </div>
  </Provider>
);

export default Layout;
