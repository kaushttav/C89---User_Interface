  
import React, { Component } from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyBartersScreen from '../screens/MyBarters';
import Notifications from '../screens/Notifications';
import MyReceivedItems from '../screens/MyReceivedItems';
import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator,
        navigationOptions:{
          drawerIcon: <Icon name="home" type ="font-awesome" color = "#fff"/>,
          drawerLabel: 'Home'
        }
    },
    MyBarters: {
      screen : MyBartersScreen,
      navigationOptions:{
        drawerIcon: <Icon name="arrows-h" type ="font-awesome" color = "#fff"/>,
        drawerLabel: 'My Barters'
      }
    },
    MyReceivedItems: {
      screen: MyReceivedItems,
      navigationOptions:{
        drawerIcon: <Icon name="gift" type ="font-awesome" color = "#fff"/>,
        drawerLabel: 'My Received Items'
      }
    },
    Notifications : {
      screen: Notifications,
      navigationOptions:{
        drawerIcon: <Icon name="bell" type ="font-awesome" color = "#fff"/>,
        drawerLabel: 'Notifications'
      }
    },
    Settings: {
        screen: SettingsScreen,
        navigationOptions:{
          drawerIcon: <Icon name="settings" type ="fontawesome5" color = "#fff"/>,
          drawerLabel: 'Settings'
        }
    }
    },
    {contentComponent: CustomSideBarMenu},
    {initialRouteName: 'Home'}
)