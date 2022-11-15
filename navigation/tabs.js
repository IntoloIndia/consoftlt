import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS, SIZES, icons, images} from '../constants';
import {
  Home,
  Account,
  Attendance,
  Requirement,
  ReportsDisplay,
} from '../screens/AdminScreens';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        // headerShown: false,
        style: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10,
          backgroundColor: COLORS.white,
          borderTopColor: 'transparent',
          height: 100,
        },
        headerTitleAlign: 'left',
        headerRight: () => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: SIZES.radius,
            }}>
            <Image
              source={images.consoft_PNG}
              resizeMode="contain"
              style={{height: 100, width: 100}}
            />
          </View>
        ),
      }}>
      <Tab.Screen
        name={'Dashboard'}
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.dashboard}
                resizeMode="contain"
                style={{
                  height: focused ? 20 : 18,
                  width: focused ? 20 : 18,
                  tintColor: COLORS.black,
                }}
              />
              <Text
                style={{
                  color: COLORS.black,
                  ...FONTS.body5,
                }}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Requirement"
        component={Requirement}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.tasks}
                style={{
                  height: focused ? 20 : 18,
                  width: focused ? 20 : 18,
                  tintColor: COLORS.black,
                }}
              />
              <Text
                style={{
                  color: COLORS.black,
                  ...FONTS.body5,
                }}>
                Requirement
              </Text>
            </View>
          ),
        }}
      /> */}

      <Tab.Screen
        name="Report"
        component={ReportsDisplay}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.tasks}
                style={{
                  height: focused ? 20 : 18,
                  width: focused ? 20 : 18,
                  tintColor: COLORS.black,
                }}
              />
              <Text
                style={{
                  color: COLORS.black,
                  ...FONTS.body5,
                }}>
                Report
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.date}
                style={{
                  height: focused ? 20 : 18,
                  width: focused ? 20 : 18,
                  tintColor: COLORS.black,
                }}
              />
              <Text
                style={{
                  color: COLORS.black,
                  ...FONTS.body5,
                }}>
                Attendance
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.account}
                style={{
                  height: focused ? 20 : 18,
                  width: focused ? 20 : 18,
                  tintColor: COLORS.black,
                }}
              />
              <Text
                style={{
                  color: COLORS.black,
                  ...FONTS.body5,
                }}>
                Account
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.39,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
export default Tabs;
