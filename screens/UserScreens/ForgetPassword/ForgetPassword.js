import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Image,
  Pressable,
  Keyboard,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS, SIZES, images, FONTS, icons} from '../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  send_otp_verification,
  verify_password_otp,
  reset_password,
} from '../UserReports/ReportApi.js';
import {useSelector} from 'react-redux';
import {CustomToast} from '../../../Components';

const ForgetPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [Otp, setOtp] = useState('');
  const [verifyStatus, setverifyStatus] = useState(false);
  const [respUserId, setRespUserId] = useState('');

  const [resetDiag, setResetDiag] = useState(false);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [submitVerifyToast, setSubmitVerifyToast] = React.useState(false);
  const [resetStatus, setResetStatus] = useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(true);

  const [rightIcon, setRightIcon] = useState('eye');
  const [newRightIcon, setNewRightIcon] = useState('eye');

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const userData = useSelector(state => state.user);

  const sendVerificationCode = async () => {
    const body = {
      email: email,
    };

    const temp = await send_otp_verification(body);

    const resp = await temp.json();

    if (resp.success == true) {
      setRespUserId(resp.data.res.user_id);
      setSubmitToast(true);
      setverifyStatus(true);
      setEmail('');
      setTimeout(() => {
        setSubmitToast(false);
      }, 2000);
    } else if (resp.message.status == '401') {
      alert('Email does not exist');
    } else {
      console.log('Network error');
    }
  };

  const verifyOtp = async () => {
    const body = {otp: Otp};

    const temp = await verify_password_otp(respUserId, body);
    const resp = await temp.json();
    if (resp.success) {
      setSubmitVerifyToast(true);
      setOtp('');
      setTimeout(() => {
        setSubmitVerifyToast(false);
        setResetDiag(true);
      }, 800);
    } else if (resp.data.isMatch == false) {
      alert('Entered Otp is Wrong');
    } else {
      console.log('Network error');
    }
  };

  const resetPassword = async () => {
    if (newPassword === confirmPassword) {
      const body = {
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      };
      const temp = await reset_password(respUserId, body);
      const resp = await temp.json();
      if (resp.success) {
        setResetStatus(true);
        setNewPassword('');
        setConfirmPassword('');
        setResetDiag(false);
        setTimeout(() => {
          setResetStatus(false);
          navigation.navigate('Login');
        }, 700);
      }
    } else {
      alert('New Password and Confirm Password do not Matched!');
    }
  };

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };
  const handleNewPasswordVisibility = () => {
    if (newRightIcon === 'eye') {
      setNewRightIcon('eye-off');
      setNewPasswordVisibility(!newPasswordVisibility);
    } else if (newRightIcon === 'eye-off') {
      setNewRightIcon('eye');
      setNewPasswordVisibility(!newPasswordVisibility);
    }
  };

  const resetPasswordDialogue = () => {
    return (
      <View style={{}}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={resetDiag}
          onRequestClose={() => {
            setResetDiag(!resetDiag);
          }}>
          <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled">
            <View
              style={{
                flex: 1,
                backgroundColor: '#000000aa',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: SIZES.height * 0.2,
                  marginBottom: SIZES.height * 0.19,
                  backgroundColor: COLORS.success_100,
                  // backgroundColor: 'white',
                  borderRadius: SIZES.base,
                  height: '60%',
                  width: '85%',
                }}>
                <Pressable
                  style={{
                    borderRadius: 4,
                    borderColor: COLORS.white,
                    margin: SIZES.body4,
                    alignSelf: 'flex-end',
                    padding: SIZES.base,
                  }}
                  // onPress={() => setResetDiag(!resetDiag)}
                >
                  {/* <AntDesign name="close" size={20} color={COLORS.gray} /> */}
                </Pressable>
                <Text style={{textAlign: 'center', ...FONTS.body2}}>
                  Forget Password ?
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: SIZES.body2,
                  }}>
                  <Image
                    source={images.change_pass}
                    style={{
                      width: 100,
                      height: 100,
                      tintColor: COLORS.green,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-evenly',
                    paddingVertical: SIZES.body3,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      paddingHorizontal: SIZES.base,
                    }}>
                    <TextInput
                      style={{
                        color: COLORS.black,
                        borderBottomWidth: 1,
                        alignSelf: 'center',
                        width: '90%',
                        borderBottomColor: COLORS.lightblue_300,
                      }}
                      value={newPassword}
                      placeholder={'New Password'}
                      secureTextEntry={passwordVisibility}
                      enablesReturnKeyAutomatically
                      placeholderTextColor={COLORS.darkGray}
                      onChangeText={text => {
                        setNewPassword(text);
                      }}
                    />
                    <Pressable onPress={handlePasswordVisibility}>
                      <MaterialCommunityIcons
                        name={rightIcon}
                        size={22}
                        color="#232323"
                      />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      paddingHorizontal: SIZES.base,
                    }}>
                    <TextInput
                      style={{
                        color: COLORS.black,
                        borderBottomWidth: 1,
                        alignSelf: 'center',
                        width: '90%',
                        borderBottomColor: COLORS.lightblue_300,
                      }}
                      value={confirmPassword}
                      placeholder={'Confirm New Password'}
                      secureTextEntry={newPasswordVisibility}
                      placeholderTextColor={COLORS.darkGray}
                      onChangeText={text => {
                        setConfirmPassword(text);
                      }}
                    />
                    <Pressable onPress={handleNewPasswordVisibility}>
                      <MaterialCommunityIcons
                        name={newRightIcon}
                        size={22}
                        color="#232323"
                      />
                    </Pressable>
                  </View>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.lightblue_700,
                      padding: SIZES.base,
                      borderRadius: SIZES.base,
                      paddingHorizontal: SIZES.body2 * 2,
                      marginVertical: SIZES.base,
                      elevation: 10,
                    }}
                    onPress={() => resetPassword()}>
                    <Text style={{...FONTS.body3, color: COLORS.white}}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.lightblue_50, COLORS.green_200]}
      style={{flex: 1, justifyContent: 'center'}}>
      <View
        style={{
          backgroundColor: COLORS.lightblue_500,
          padding: SIZES.base * 0.25,
        }}></View>
      <KeyboardAwareScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View
              style={[
                {
                  marginTop: SIZES.height * 0.18,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 30,
                },
                styles.shadow,
              ]}>
              <Image
                source={images.mail_image}
                resizeMode="contain"
                style={{
                  width: 230,
                }}
              />
            </View>
            <View style={{justifyContent: 'space-around'}}>
              <View>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Verification code on your email
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    ...FONTS.h4,
                    color: COLORS.darkGray,
                    textAlign: 'center',
                    flexWrap: 'wrap',
                  }}>
                  We will send Verification code on {'\n'} your email id
                </Text>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              {verifyStatus ? (
                <TextInput
                  style={{
                    color: COLORS.black,
                    borderBottomWidth: 1,
                    width: '95%',
                    borderBottomColor: COLORS.lightblue_300,
                  }}
                  value={Otp}
                  placeholder={'Enter Otp'}
                  placeholderTextColor={COLORS.darkGray}
                  onChangeText={text => {
                    setOtp(text);
                  }}
                  multiline={true}
                  keyboardType={'number-pad'}
                  numberOfLines={2}
                />
              ) : (
                <TextInput
                  style={{
                    color: COLORS.black,
                    borderBottomWidth: 1,
                    width: '95%',
                    borderBottomColor: COLORS.lightblue_300,
                  }}
                  value={email}
                  placeholder={'Enter your registered email id'}
                  placeholderTextColor={COLORS.darkGray}
                  onChangeText={text => {
                    setEmail(text);
                  }}
                  // value={value}
                  multiline={true}
                  numberOfLines={2}
                />
              )}
            </View>
            <View style={{alignItems: 'center', marginBottom: SIZES.base}}>
              {verifyStatus ? (
                <TouchableOpacity
                  style={{
                    borderRadius: SIZES.base * 0.5,
                    width: '95%',
                    borderColor: COLORS.transparentBlack2,
                    backgroundColor: COLORS.lightblue_500,
                    borderWidth: 1,
                    padding: SIZES.base,
                  }}
                  onPress={verifyOtp}>
                  <Text style={{color: COLORS.white, textAlign: 'center'}}>
                    Verfiy Send Otp
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    borderRadius: SIZES.base * 0.5,
                    width: '95%',
                    borderColor: COLORS.transparentBlack2,
                    backgroundColor: COLORS.lightblue_500,
                    borderWidth: 1,
                    padding: SIZES.base,
                  }}
                  onPress={sendVerificationCode}>
                  <Text style={{color: COLORS.white, textAlign: 'center'}}>
                    Send verification code
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      {resetPasswordDialogue()}

      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.lightblue_400}
        title="Submit"
        message="Otp has been sent to your email........."
      />
      <CustomToast
        isVisible={submitVerifyToast}
        onClose={() => setSubmitVerifyToast(false)}
        color={COLORS.lightblue_400}
        title="Submit"
        message="Otp verified successfully!"
      />
      <CustomToast
        isVisible={resetStatus}
        onClose={() => setResetStatus(false)}
        color={COLORS.green_400}
        title="Submit"
        message="Password resetted successfully!"
      />
    </LinearGradient>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
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
});
