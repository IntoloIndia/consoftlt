import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Text,
} from 'react-native';
import utils from '../../utils';
import {FormInput, TextButton, HeaderBar, CustomToast} from '../../Components';
import {COLORS, images, SIZES, icons, FONTS} from '../../constants';
import {useSelector, useDispatch} from 'react-redux';
import {verifyProductKey} from '../../services/companyAuthApi';

const VerifyProductKey = ({navigation, route}) => {
  const {company_id} = route.params;

  const dispatch = useDispatch();
  const companyData = useSelector(state => state.company);
  const [productKey, setProductKey] = React.useState('');
  const [productKeyError, setProductKeyError] = React.useState('');

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);

  const OnSubmit = async () => {
    const productData = {
      company_id: companyData._id == '' ? company_id : companyData._id,
      product_key: productKey,
    };
    const result = await dispatch(verifyProductKey(productData));
    if (result.payload.status === 200) {
      setSubmitToast(true);
      navigation.navigate('CompanyPayment', {
        company_id: result.payload.company_id,
      });
      setProductKey('');
    } else {
      alert(result.payload.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 1500);
  };

  return (
    <View style={{flex: 1}}>
      <HeaderBar right={true} title="Verify Product Key" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              padding: SIZES.padding,
              flex: 1,
              justifyContent: 'space-around',
            }}>
            <View style={{marginBottom: 40, alignItems: 'center'}}>
              <Image
                source={images.product_key}
                resizeMode="contain"
                style={{
                  height: 100,
                  width: 200,
                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  ...FONTS.h2,
                }}>
                Verify Your Product Key
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: COLORS.darkGray,
                  marginTop: SIZES.base,
                  ...FONTS.body3,
                }}>
                Product key has been sent to your email
              </Text>
            </View>
            <View>
              <FormInput
                // label="Email"
                placeholder="Product key"
                keyboardType="email-address"
                autoCompleteType="email"
                onChange={value => {
                  utils.validateText(value, setProductKeyError);
                  setProductKey(value);
                }}
                errorMsg={productKeyError}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        productKey == '' ||
                        (productKey != '' && productKeyError == '')
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          productKey == ''
                            ? COLORS.gray
                            : productKey != '' && productKeyError == ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <TextButton
                label="Submit & Continue"
                buttonContainerStyle={{
                  height: 45,
                  alignItems: 'center',
                  marginTop: SIZES.padding,
                  borderRadius: SIZES.base,
                }}
                onPress={OnSubmit}
              />
            </View>
            <View style={{marginBottom: 130}}></View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Success"
        message="Verification Successful..."
      />
    </View>
  );
};

export default VerifyProductKey;
