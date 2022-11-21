import React, {useState, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import {getUserId} from '../services/asyncStorageService.js';
import {COLORS, FONTS, SIZES, icons, images} from '../constants';
import {
  UserDashboard,
  Profile,
  UserEndVoucher,
  MyProfile,
  UserReports,
  ViewReport,
  Stock
} from '../screens/UserScreens';

const Tab = createBottomTabNavigator();

const UserTabs = ({navigation, route}) => {
  const TabBarCustomButton = ({children, onPress}) => {
    return (
      <TouchableOpacity
        style={{
          top: -15,
          justifyContent: 'center',
          alignItems: 'center',
          ...styles.shadow,
        }}
        onPress={() => {
          // Get_UserId_Data()
          onPress();
        }}>
        <LinearGradient
          colors={[COLORS.lightblue_800, COLORS.lightblue_600]}
          style={{
            width: 50,
            elevation: 15,
            height: 50,
            borderRadius: 35,
          }}>
          {children}
        </LinearGradient>
        <Text
          style={{
            color: COLORS.black,
            ...FONTS.body5,
            textAlign: 'auto',
          }}>
          Show Report
        </Text>
      </TouchableOpacity>
    );
  };

  // const selectedIdProjects = route.params.selectedIdProjects;
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
          elevation: 0,
          backgroundColor: COLORS.white,
          borderTopColor: 'transparent',
          height: 100,
        },
        headerStyle: {
          // height: 78,
        },
        navigation: {navigation},
        route: {route},
        headerTitleAlign: 'left',
        headerRight: () => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: SIZES.radius,
            }}>
            <Image
              source={images.consoft_lt_logo}
              resizeMode="contain"
              style={{height: '100%', width: 100}}
            />
          </View>
        ),
      }}>
      <Tab.Screen
        name="User Dashboard"
        screenOptions={{
          tabBarShowLabel: false,
        }}
        component={UserDashboard}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.dashboard}
                resizeMode="contain"
                style={{
                  height: 18,
                  width: 18,
                  tintColor: focused
                    ? COLORS.majorelle_blue_1000
                    : COLORS.black,
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.majorelle_blue_1000 : COLORS.black,
                  ...FONTS.body5,
                }}>
                Dashboard
              </Text>
            </View>
          ),
          headerShown: true,
        }}
      />
        <Tab.Screen
        name="Stock"
        component={Stock}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.stock}
                style={{
                  height: 18,
                  width: 18,
                  tintColor: focused
                    ? COLORS.majorelle_blue_1000
                    : COLORS.black,
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.majorelle_blue_1000 : COLORS.black,
                  ...FONTS.body5,
                }}>
                Voucher
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={UserReports}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.report}
                style={{
                  height: 18,
                  width: 18,
                  tintColor: focused
                    ? COLORS.majorelle_blue_1000
                    : COLORS.black,
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.majorelle_blue_1000 : COLORS.black,
                  ...FONTS.body5,
                }}>
                Report
              </Text>
            </View>
          ),
        }}
      />
    
      {/* <Tab.Screen
        name="Report"
        component={UserReports}
        // initialParams={{userId: useridRef}}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                source={icons.report}
                resizeMode="contain"
                style={{
                  height: focused ? 22 : 20,
                  width: focused ? 22 : 20,
                  tintColor: COLORS.white,
                }}
              />
            </View>
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />,
          // headerShown:false
        }}
      /> */}
      <Tab.Screen
        name="My Profile"
        component={MyProfile}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.tracker}
                style={{
                  height: 18,
                  width: 18,
                  tintColor: focused
                    ? COLORS.majorelle_blue_1000
                    : COLORS.black,
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.majorelle_blue_1000 : COLORS.black,
                  ...FONTS.body5,
                }}>
                My Profile
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={icons.account}
                style={{
                  height: 18,
                  width: 18,
                  tintColor: focused
                    ? COLORS.majorelle_blue_1000
                    : COLORS.black,
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.majorelle_blue_1000 : COLORS.black,
                  ...FONTS.body5,
                }}>
                Profile
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
export default UserTabs;
