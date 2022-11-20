import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs, user_tabs} from './navigation';
import {
  Login,
  CompanyRegistration,
  CompanyPayment,
  VerifyProductKey,
} from './screens/OnBoarding';
import {store} from './app/store';
import {Provider} from 'react-redux';
import {
  Home,
  VerifyAndRevertWork,
  ProjectTeam,
  ProjectSeheduleTime,
  ProjectsDetails,
  CompanyTeamShow,
  Contractors,
  CategoryandType,
  StocksAndInventry,
  ToolsAndMachinery,
  Account,
  UserRole,
  ReportSettings,
  Boq,
  CompanyTeam,
} from './screens/AdminScreens';

import * as eva from '@eva-design/eva';

import {ApplicationProvider, Layout, Text} from '@ui-kitten/components';

import {
  Profile,
  UserEndVoucher,
  UserReports,
  Demo1,
  MyProfile,
  ViewReport,
} from './screens/UserScreens';

import {LogBox} from 'react-native';

LogBox.ignoreAllLogs();
LogBox.ignoreLogs([`new NativeEventEmitter()`]);


const Stack = createStackNavigator();

const App = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Login'}>
          <Stack.Screen name="Home" component={Tabs} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="CompanyRegistration"
            component={CompanyRegistration}
          />
          <Stack.Screen name="CompanyPayment" component={CompanyPayment} />
          <Stack.Screen name="VerifyProductKey" component={VerifyProductKey} />
          <Stack.Screen name="Home1" component={Home} />
          <Stack.Screen
            name="VerifyAndRevertWork"
            component={VerifyAndRevertWork}
          />
          <Stack.Screen name="ProjectsDetails" component={ProjectsDetails} />
          <Stack.Screen name="CompanyTeamShow" component={CompanyTeamShow} />
          <Stack.Screen name="ProjectTeam" component={ProjectTeam} />
          <Stack.Screen name="Contractors" component={Contractors} />
          {/* <Stack.Screen name="ProjectReports" component={ProjectReports} /> */}
          <Stack.Screen
            name="StocksAndInventry"
            component={StocksAndInventry}
          />
          <Stack.Screen
            name="ToolsAndMachinery"
            component={ToolsAndMachinery}
          />
          <Stack.Screen
            name="ProjectSeheduleTime"
            component={ProjectSeheduleTime}
          />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="UserRole" component={UserRole} />
          <Stack.Screen name="ReportSettings" component={ReportSettings} />
          <Stack.Screen name="Boq" component={Boq} />
          <Stack.Screen name="CategoryandType" component={CategoryandType} />
          <Stack.Screen name="CompanyTeam" component={CompanyTeam} />
          {/* user */}
          <Stack.Screen name="UserDashboard" component={user_tabs} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="UserEndVoucher" component={UserEndVoucher} />
          <Stack.Screen name="ViewReport" component={ViewReport} />
          <Stack.Screen name="Demo1" component={Demo1} />
          <Stack.Screen name="MyProfile" component={MyProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
};

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
