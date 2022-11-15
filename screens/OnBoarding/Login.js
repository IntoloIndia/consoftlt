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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import utils from '../../utils';
import {FormInput, TextButton} from '../../Components';
import {FONTS, COLORS, SIZES, icons, images, constants} from '../../constants';
import {userLogin} from '../../services/userAuthApi';
import {companyLogin} from '../../services/companyAuthApi';
import {useDispatch} from 'react-redux';

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

  function renderHeaderLogo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={images.consoft_new}
          resizeMode="contain"
          style={{
            height: 100,
          }}
        />
      </View>
    );
  }

  function renderHeaderImage() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={images.build_f}
          resizeMode="contain"
          style={{
            width: '60%',
          }}
        />
      </View>
    );
  }

  function renderUserForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.radius,
          ...styles.formContainer,
        }}>
        <View>
          <FormInput
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
          />
          <FormInput
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
          />
          <TextButton
            label="Login"
            buttonContainerStyle={{
              height: 45,
              alignItems: 'center',
              marginVertical: SIZES.padding,
              borderRadius: SIZES.base,
            }}
            onPress={userOnSubmit}
          />
        </View>
        <View
          style={{
            marginTop: 30,
            marginHorizontal: SIZES.padding * 3.8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              padding: 6,
              borderRadius: 3,
            }}
            onPress={() => {
              Linking.openURL(
                'mailto:ssdoffice44@gmail.com?subject=Subject&body=description',
              );
            }}>
            <Image
              source={icons.mail}
              resizeMode="contain"
              style={{
                height: 15,
                width: 15,
                tintColor: COLORS.black,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              padding: 6,
              borderRadius: 3,
            }}
            onPress={makeCall}>
            <Image
              source={icons.call}
              resizeMode="contain"
              style={{
                height: 15,
                width: 15,
                tintColor: COLORS.black,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              padding: 6,
              borderRadius: 3,
            }}
            onPress={() => {
              Linking.openURL('https://wa.me/+91-8109093551');
            }}>
            <Image
              source={icons.whatsapp}
              resizeMode="contain"
              style={{
                height: 15,
                width: 15,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              padding: 6,
              borderRadius: 3,
            }}
            onPress={() => Linking.openURL('http://www.intoloindia.com/')}>
            <Image
              source={icons.website}
              resizeMode="contain"
              style={{
                height: 15,
                width: 15,
                tintColor: COLORS.black,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderCompanyForm() {
    return (
      <View
        style={{
          marginTop: SIZES.base,
          marginHorizontal: SIZES.radius,
          ...styles.formContainer,
        }}>
        <Text style={{}}>{/* Registered Company Login */}</Text>
        <View>
          <FormInput
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
          />
          <FormInput
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
          />
          <TextButton
            label="Login"
            buttonContainerStyle={{
              height: 45,
              alignItems: 'center',
              marginTop: SIZES.padding,
              borderRadius: SIZES.base,
            }}
            onPress={companyOnSubmit}
          />
        </View>
        <View
          style={{
            marginTop: SIZES.padding,
            flexDirection: 'row',
            justifyContent: 'center',
            paddingBottom: 5,
          }}>
          <TouchableOpacity onPress={() => alert('Demo Video')}>
            <Text
              style={{
                color: COLORS.black,
                ...FONTS.h3,
                fontWeight: 'bold',
              }}>
              Demo{' '}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.h3,
              fontWeight: 'bold',
            }}>
            &
          </Text>
          <TextButton
            label="Free 7 - Days trial"
            buttonContainerStyle={{
              marginLeft: 4,
              backgroundColor: null,
            }}
            labelStyle={{
              color: COLORS.red,
              ...FONTS.h3,
              fontWeight: 'bold',
            }}
            onPress={() => navigation.navigate('CompanyRegistration')}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingBottom: SIZES.radius,
          }}>
          <TextButton
            label="Free Register Or Purchase"
            buttonContainerStyle={{
              backgroundColor: COLORS.lightblue_900,
              paddingHorizontal: SIZES.radius * 3,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            labelStyle={{
              color: COLORS.white,
              ...FONTS.h4,
            }}
            onPress={() => navigation.navigate('CompanyRegistration')}
          />
        </View>
        <View
          style={{
            marginHorizontal: SIZES.padding * 3.8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              padding: 6,
              borderRadius: 3,
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
                height: 15,
                width: 15,
                tintColor: COLORS.black,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              padding: 6,
              borderRadius: 5,
            }}
            onPress={makeCall}>
            <Image
              source={icons.call}
              resizeMode="contain"
              style={{
                height: 15,
                width: 15,
                tintColor: COLORS.black,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              padding: 6,
              borderRadius: 5,
            }}
            onPress={() => {
              Linking.openURL('https://wa.me/+91-8109093551');
            }}>
            <Image
              source={icons.whatsapp}
              resizeMode="contain"
              style={{
                height: 15,
                width: 15,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              padding: 6,
              borderRadius: 5,
            }}
            onPress={() => Linking.openURL('http://www.intoloindia.com/')}>
            <Image
              source={icons.website}
              resizeMode="contain"
              style={{
                height: 15,
                width: 15,
                tintColor: COLORS.black,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderToggleButton() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 4,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            ...FONTS.h3,
            marginRight: SIZES.base,
            color: switchValue ? COLORS.gray : COLORS.black,
          }}>
          Team Login
        </Text>
        <Switch
          onValueChange={toggleSwitch}
          value={switchValue}
          trackColor={{false: COLORS.gray, true: COLORS.gray}}
          thumbColor={switchValue ? COLORS.white : COLORS.white}
          ios_backgroundColor={COLORS.blue}
        />
        <Text
          style={{
            ...FONTS.h3,
            marginLeft: SIZES.base,
            color: switchValue ? COLORS.black : COLORS.gray,
          }}>
          Company Login
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.lightblue_100, COLORS.lightblue_300]}
      style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                marginBottom: 48,
                alignItems: 'center',
              }}>
              <Image
                source={images.consoft_new}
                resizeMode="contain"
                style={{
                  height: 100,
                }}
              />
              <View
                style={{
                  marginTop: SIZES.radius,
                  height: 30,
                  justifyContent: 'center',
                }}>
                <Image
                  source={images.build_f}
                  resizeMode="contain"
                  style={{
                    width: 180,
                  }}
                />
              </View>
            </View>
            <View style={{}}>
              {renderToggleButton()}
              {switchValue ? renderCompanyForm() : renderUserForm()}
            </View>
            <View style={{marginBottom: 80}}></View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: SIZES.radius,
    paddingBottom: SIZES.padding,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});

export default Login;
