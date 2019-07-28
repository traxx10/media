/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { Provider } from "react-redux";
import store from "./src/store";
import Navigation from "./src/Navigation";
import HomeScreen from "./src/screens/HomeScreen/HomeScreen";

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </SafeAreaView>
  );
};

export default App;
