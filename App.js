  import React from 'react';
  import { createAppContainer } from 'react-navigation';
  import { createStackNavigator } from 'react-navigation-stack';

  import { Provider } from 'react-redux'
  import { createStore, applyMiddleware } from 'redux';
  import thunk from 'redux-thunk';

  import { rootReducer } from "./reducers/rootReducer";

  const store = createStore(rootReducer, applyMiddleware(thunk));

  import AuthScreen from "./views/AuthScreen";
  import MainScreen from "./views/MainScreen";
  import ThingScreen from "./views/ThingScreen";
  import BarcodeScanner from "./views/BarcodeScanner";
  import {
    Button
  } from 'react-native';

  const StackNavigator = createStackNavigator({
   Auth: {
     screen: AuthScreen,
       navigationOptions: () => ({
           title: `Aвторизация`,
           headerBackTitle: null,
         }),
  },
    Main: {
      screen: MainScreen,
        navigationOptions: () => ({
            title: `Запросы`,
            headerBackTitle: null,
        }),
    },
    Thing: {
      screen: ThingScreen,
      navigationOptions: () => ({
        title: `Карточка товара`,
        headerBackTitle: null,
      }),
    },
     Scan: {
       screen: BarcodeScanner,
       navigationOptions: () => ({
         title: `Сканировать`,
         headerBackTitle: null,
       }),
     }
    }, {
    headerMode: 'screen',
    mode: 'modal',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  });

  const AppContainer = createAppContainer(StackNavigator);

  const app = () => (
      <Provider store={store}><AppContainer /></Provider>
  );

  export default app;


