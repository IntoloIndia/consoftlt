import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Linking,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import utils from '../../utils';
import {FormInput, TextButton} from '../../Components';
import {FONTS, COLORS, SIZES, icons, images, constants} from '../../constants';
import {userLogin} from '../../services/userAuthApi';
import {companyLogin} from '../../services/companyAuthApi';
import {useDispatch} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TextInput, Button} from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [userMobileNo, setUserMobileNo] = React.useState('');
  const [userPassword, setUserPassword] = React.useState('');
  const [userMobileNoError, setUserMobileNoError] = React.useState('');
  const [companyMobileNo, setCompanyMobileNo] = React.useState('');
  const [companyPassword, setCompanyPassword] = React.useState('');
  const [companyMobileNoError, setCompanyMobileNoError] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [switchValue, setSwitchValue] = React.useState(false);
  const toggleSwitch = value => {
    setSwitchValue(value);
    if (value) {
      setUserMobileNo('');
      setUserPassword('');
    } else {
      setCompanyMobileNo('');
      setCompanyPassword('');
    }
  };

  const userOnSubmit = async () => {
    const UserData = {
      mobile: userMobileNo,
      password: userPassword,
    };
    const res = await dispatch(userLogin(UserData));
    if (res.payload.status === 200) {
      setSubmitToast(true);
      if (res.payload.user_privilege === constants.USER_PRIVILEGES.OTHER_USER) {
        navigation.navigate('UserDashboard');
      } else {
        navigation.navigate('Home');
      }
    } else {
      alert(res.payload.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const companyOnSubmit = async () => {
    const company_data = {
      mobile: companyMobileNo,
      password: companyPassword,
    };
    const res = await dispatch(companyLogin(company_data));
    if (res.payload.status === 200) {
      setSubmitToast(true);
      navigation.navigate('Home');
    } else if (res.payload.status == 301) {
      navigation.navigate('VerifyProductKey', {
        company_id: res.payload.company_id,
      });
    } else if (res.payload.status == 302) {
      navigation.navigate('CompanyPayment', {
        company_id: res.payload.company_id,
      });
    } else {
      alert(res.payload.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const makeCall = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:+91-8109093551';
    } else {
      phoneNumber = 'telprompt:${+919988774455}';
    }
    Linking.openURL(phoneNumber);
  };

  //--------------------------------------------------------------

  function renderLogin() {
    function renderUserForm() {
      return (
        <View
          style={{
            marginTop: SIZES.padding,
            marginHorizontal: SIZES.radius,
            ...styles.formContainer,
          }}>
          <View>
            {/* <FormInput
              placeholder="Mobile No."
              keyboardType="phone-pad"
              autoCompleteType="tel"
              onChange={value => {
                //validate email
                utils.validateNumber(value, setUserMobileNoError);
                setUserMobileNo(value);
              }}
              errorMsg={userMobileNoError}
              appendComponent={
                <View style={{justifyContent: 'center'}}>
                  <Image
                    source={
                      userMobileNo == '' ||
                      (userMobileNo != '' && userMobileNoError == '')
                        ? icons.correct
                        : icons.cancel
                    }
                    style={{
                      height: 20,
                      width: 20,
                      tintColor:
                        userMobileNo == ''
                          ? COLORS.gray
                          : userMobileNo != '' && userMobileNoError == ''
                          ? COLORS.green
                          : COLORS.red,
                    }}
                  />
                </View>
              }
            /> */}
            <TextInput
              style={{marginTop: 10}}
              mode="outlined"
              label="Mobile No."
              left={<TextInput.Icon icon="dialpad" />}
              keyboardType="phone-pad"
              onChangeText={value => {
                setUserMobileNo(value);
              }}
            />
            {/* <FormInput
              placeholder="Password"
              secureTextEntry={!showPass}
              keyboardType="default"
              autoCompleteType="password"
              onChange={value => setUserPassword(value)}
              appendComponent={
                <TouchableOpacity
                  style={{
                    width: 40,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                  onPress={() => setShowPass(!showPass)}>
                  <Image
                    source={showPass ? icons.eye_close : icons.eye}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: COLORS.gray,
                    }}
                  />
                </TouchableOpacity>
              }
            /> */}
            <TextInput
              style={{marginTop: 10}}
              mode="outlined"
              label="Password"
              left={<TextInput.Icon icon="security" />}
              secureTextEntry
              right={<TextInput.Icon icon="eye" />}
              onChangeText={value => {
                setUserPassword(value);
              }}
            />
            <TextButton
              label="Login"
              buttonContainerStyle={{
                height: 45,
                alignItems: 'center',
                marginTop: 30,
                marginVertical: SIZES.padding,
                borderRadius: SIZES.base,
                backgroundColor: COLORS.majorelle_blue_900,
              }}
              onPress={userOnSubmit}
            />
            {/* <Button
              style={{marginTop: 20}}
              icon="camera"
              mode="contained"
              onPress={() => console.log('Pressed')}>
              Press me
            </Button> */}
          </View>
        </View>
      );
    }

    function renderCompanyForm() {
      return (
        <View
          style={{
            marginTop: SIZES.padding,
            marginHorizontal: 15,
            ...styles.formContainer,
          }}>
          <View>
            {/* <FormInput
              placeholder="Mobile No."
              keyboardType="phone-pad"
              autoCompleteType="tel"
              onChange={value => {
                //validate email
                utils.validateNumber(value, setCompanyMobileNoError);
                setCompanyMobileNo(value);
              }}
              errorMsg={companyMobileNoError}
              appendComponent={
                <View style={{justifyContent: 'center'}}>
                  <Image
                    source={
                      companyMobileNo == '' ||
                      (companyMobileNo != '' && companyMobileNoError == '')
                        ? icons.correct
                        : icons.cancel
                    }
                    style={{
                      height: 20,
                      width: 20,
                      tintColor:
                        companyMobileNo == ''
                          ? COLORS.gray
                          : companyMobileNo != '' && companyMobileNoError == ''
                          ? COLORS.green
                          : COLORS.red,
                    }}
                  />
                </View>
              }
            /> */}
            <TextInput
              style={{marginTop: 10}}
              mode="outlined"
              label="Mobile No."
              left={<TextInput.Icon icon="dialpad" />}
              keyboardType="phone-pad"
              onChangeText={value => {
                setCompanyMobileNo(value);
              }}
            />
            {/* <FormInput
              placeholder="Password"
              secureTextEntry={!showPass}
              keyboardType="default"
              autoCompleteType="password"
              onChange={value => setCompanyPassword(value)}
              appendComponent={
                <TouchableOpacity
                  style={{
                    width: 40,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                  onPress={() => setShowPass(!showPass)}>
                  <Image
                    source={showPass ? icons.eye_close : icons.eye}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: COLORS.gray,
                    }}
                  />
                </TouchableOpacity>
              }
            /> */}
            <TextInput
              style={{marginTop: 10}}
              mode="outlined"
              label="Password"
              left={<TextInput.Icon icon="security" />}
              secureTextEntry
              right={<TextInput.Icon icon="eye" />}
              onChangeText={value => {
                setCompanyPassword(value);
              }}
            />
            <TextButton
              label="Login"
              buttonContainerStyle={{
                height: 45,
                alignItems: 'center',
                marginTop: 30,
                marginVertical: SIZES.padding,
                borderRadius: SIZES.base,
                backgroundColor: COLORS.majorelle_blue_900,
              }}
              onPress={companyOnSubmit}
            />
          </View>
          <View
            style={{
              // marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => alert('Demo Video')}>
              <Text
                style={{
                  fontSize: 15,
                  color: COLORS.darkGray,
                  fontWeight: '700',
                }}>
                Demo{' & '}
              </Text>
            </TouchableOpacity>
            <TextButton
              label="Free 7 - Days trial"
              buttonContainerStyle={{
                marginLeft: 4,
                backgroundColor: null,
              }}
              labelStyle={{
                fontSize: 15,
                color: COLORS.rose_600,
                fontWeight: '700',
              }}
              onPress={() => navigation.navigate('CompanyRegistration')}
            />
          </View>

          <TextButton
            label="Free Register & Purchase"
            buttonContainerStyle={{
              width: '60%',
              alignSelf: 'center',
              backgroundColor: COLORS.darkGray,
              marginTop: SIZES.base,
              padding: 3,
              ...styles.shadow,
            }}
            labelStyle={{
              color: COLORS.white,
              ...FONTS.h4,
            }}
            onPress={() => navigation.navigate('CompanyRegistration')}
          />
        </View>
      );
    }
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{padding: 20, flex: 1, justifyContent: 'space-around'}}>
            <View
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                marginBottom: 70,
              }}>
              <Image
                source={images.consoft_lt_logo}
                style={{
                  height: 60,
                  width: 200,
                  borderRadius: 10,
                  marginTop: 15,
                }}
              />
              <Image
                source={images.build_f}
                style={{
                  height: 85,
                  width: 160,
                  borderRadius: 10,
                  marginTop: 15,
                }}
              />
            </View>
            <View
              style={{
                height: 380,
                // padding: 10,
              }}>
              <Tab.Navigator
                initialRouteName="Team"
                screenOptions={{
                  tabBarPosition: 'top',
                  tabBarIndicatorStyle: {
                    height: 3,
                    backgroundColor: COLORS.majorelle_blue_800,
                  },
                  tabBarStyle: {
                    backgroundColor: COLORS.lightGray2,
                    elevation: 5,
                  },
                  tabBarActiveTintColor: COLORS.darkGray,
                  tabBarLabelStyle: {
                    fontSize: 15,
                    fontWeight: '600',
                  },
                  tabBarPressColor: COLORS.majorelle_blue_100,
                }}
                sceneContainerStyle={{
                  backgroundColor: COLORS.lightGray2,
                }}>
                <Tab.Screen
                  name="Team Login"
                  children={() => renderUserForm()}
                />
                <Tab.Screen
                  name="Company Login"
                  children={() => renderCompanyForm()}
                />
              </Tab.Navigator>
            </View>

            <View
              style={{
                flex: 1,
                marginTop: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 75,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.majorelle_blue_50,
                  padding: 10,
                  elevation: 10,
                }}
                onPress={() => {
                  Linking.openURL(
                    'mailto:ssdoffice44@gmail.com?subject=Subject&body=',
                  );
                }}>
                <Image
                  source={icons.mail}
                  resizeMode="contain"
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.black,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.majorelle_blue_50,
                  padding: 10,
                  elevation: 10,
                }}
                onPress={makeCall}>
                <Image
                  source={icons.call}
                  resizeMode="contain"
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.black,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.majorelle_blue_50,
                  padding: 10,
                  elevation: 10,
                }}
                onPress={() => {
                  Linking.openURL('https://wa.me/+91-8109093551');
                }}>
                <Image
                  source={icons.whatsapp}
                  resizeMode="contain"
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.majorelle_blue_50,
                  padding: 10,
                  elevation: 10,
                }}
                onPress={() => Linking.openURL('http://www.intenics.in/')}>
                <Image
                  source={icons.website}
                  resizeMode="contain"
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.black,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      {renderLogin()}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: COLORS.white,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
export default Login;
