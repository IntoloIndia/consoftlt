import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
} from 'react-native';
import {COLORS, icons, FONTS, SIZES, images} from '../../constants';
import {TextInput} from 'react-native-paper';
import utils from '../../utils';
import {FormInput, TextButton, HeaderBar, CustomToast} from '../../Components';
import {useDispatch} from 'react-redux';
import {registerCompany} from '../../services/companyAuthApi';

const CompanyRegistration = ({navigation}) => {
  const dispatch = useDispatch();
  const [cName, setCName] = React.useState('');
  const [cMobileNo, setCMobileNo] = React.useState('');
  const [cEmail, setCEmail] = React.useState('');
  const [cOwnerName, setCOwnername] = React.useState('');

  const [cNameError, setCNameError] = React.useState('');
  const [cMobileNoError, setCMobileNoError] = React.useState('');
  const [cEmailError, setCEmailError] = React.useState('');
  const [cOwnerNameError, setCOwnerNameError] = React.useState('');

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);

  const onSubmit = async () => {
    const companyData = {
      company_name: cName,
      mobile: cMobileNo,
      email: cEmail,
      name: cOwnerName,
    };
    const result = await dispatch(registerCompany(companyData));
    if (result.payload.status === 200) {
      setTimeout(() => {
        setSubmitToast(true);
        navigation.navigate('VerifyProductKey', {
          company_id: result.payload.company_id,
        });
        setCName('');
        setCMobileNo('');
        setCEmail('');
        setCOwnername('');
      }, 300);
    } else {
      alert(result.payload.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 4000);
  };

  //--------------------------

  function renderRegister() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              paddingHorizontal: SIZES.padding,
              paddingBottom: SIZES.padding,
              flex: 1,
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                marginBottom: 80,
                marginTop: 20,
              }}>
              <Image
                source={images.create_company}
                style={{height: 75, width: 75}}
              />
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.darkGray,
                  textAlign: 'center',
                }}>
                Register to continue
              </Text>
            </View>
            <View style={{marginBottom: 65}}>
              <TextInput
                mode="outlined"
                label="Comapny name"
                left={<TextInput.Icon icon="office-building" />}
                onChangeText={value => {
                  setCName(value);
                }}
              />
              <TextInput
                style={{marginTop: 5}}
                mode="outlined"
                label="Mobile No."
                left={<TextInput.Icon icon="dialpad" />}
                keyboardType="email-address"
                onChangeText={value => {
                  setCMobileNo(value);
                }}
              />
              <TextInput
                style={{marginTop: 5}}
                mode="outlined"
                label="Email"
                left={<TextInput.Icon icon="email" />}
                keyboardType="numeric"
                onChangeText={value => {
                  setCEmail(value);
                }}
              />
              <TextInput
                style={{marginTop: 5}}
                mode="outlined"
                label="Owner name"
                left={<TextInput.Icon icon="account-circle-outline" />}
                keyboardType="numeric"
                onChangeText={value => {
                  setCOwnerName(value);
                }}
              />
              <TextButton
                label="Submit & Continue"
                buttonContainerStyle={{
                  marginTop: 25,
                  height: 45,
                  alignItems: 'center',
                  borderRadius: 5,
                }}
                onPress={onSubmit}
              />
            </View>
            <View
              style={{
                flex: 1,
                marginTop: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                Already have an account ?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={{
                  backgroundColor: COLORS.majorelle_blue_800,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  left: 10,
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.white,
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={{flex: 1}}>
      <HeaderBar title="company register" />
      {renderRegister()}
      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Success"
        message="Registration Completed Successfully..."
      />
    </View>
  );
};

export default CompanyRegistration;
