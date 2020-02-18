  import React from 'react';
  import { createAppContainer } from 'react-navigation';
  import { createStackNavigator } from 'react-navigation-stack';

  import { Provider } from 'react-redux'
  import { createStore, applyMiddleware } from 'redux';
  import thunk from 'redux-thunk';

  import { rootReducer } from "./reducers/rootReducer";

  const store = createStore(rootReducer, applyMiddleware(thunk));

  import { Ionicons } from '@expo/vector-icons';

  import ConnectionComponent from "./components/ConnectionComponent";
  import AuthScreen from "./views/Auth/AuthScreen";
  import MainScreen from "./views/MainScreen";
  import ThingScreen from "./views/ThingScreen";
  import BarcodeScanner from "./views/BarcodeScanner";
  import SettingsScreen from "./views/SettingsScreen";
  import AdminPanel from "./views/Auth/AdminPanel";
  import {
   View
} from 'react-native';
  import {createBottomTabNavigator} from "react-navigation-tabs";


  const MainStack = createBottomTabNavigator({
    Main: {
      screen: MainScreen,
    },
    Scan: {
      screen: BarcodeScanner,
    }
  }, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Main') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Scan') {
          iconName = `md-barcode`;
        }

        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  });

  const StackNavigator = createStackNavigator({
   Auth: {
     screen: AuthScreen,
       navigationOptions: () => ({
           title: `Aвторизация`,
           headerBackTitle: null,
         }),
  },
    Main: {
      screen: MainStack,
        navigationOptions: ({navigation}) => ({
            title: `Запросы`,
            headerBackTitle: null,
            headerLeft: null,
            headerRight: (
              <View style={{
                width: 200,
                flex: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: 'space-around',
              }}>
                <ConnectionComponent navigate = {navigation}/>
                </View>
                ),
        }),
    },
    Thing: {
      screen: ThingScreen,
      navigationOptions: () => ({
        title: `Карточка товара`,
        headerBackTitle: null,
      }),
    },
    Set: {
      screen: SettingsScreen,
      navigationOptions: () => ({
        title: `Настройки`,
        headerShown: false,
      }),
    },
    Admin: {
      screen: AdminPanel,
      navigationOptions: () => ({
        title: `Панель администратора`,
        headerShown: false,
      }),
    },
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


