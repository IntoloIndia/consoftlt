import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {HeaderBar, TextButton, CustomToast} from '../../Components';
import {COLORS, SIZES, FONTS, icons, images} from '../../constants';
import {payment} from '../../controller/PaymentController';
import {useSelector} from 'react-redux';

const CompanyPayment = ({navigation, route}) => {
  const {company_id} = route.params;

  const companyDetail = useSelector(state => state.company);

  const [paymentSuccessModal, setPaymentSuccessModal] = React.useState(false);
  const [amount, setAmount] = React.useState('150000');

  const onPaymentSubmit = async () => {
    const formData = {
      payment: amount,
      company_id: companyDetail._id == '' ? company_id : companyDetail._id,
    };
    const response = await payment(formData);
    if (response.status === 200) {
      setPaymentSuccessModal(true);
      setTimeout(() => {
        navigation.navigate('Login');
        setPaymentSuccessModal(false);
      }, 10000);
      setAmount('');
    } else {
      alert(response.message);
    }
  };

  function renderPaymentSuccessModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentSuccessModal}>
        <TouchableWithoutFeedback onPress={() => setPaymentSuccessModal(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.transparentBlack7,
            }}>
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 25,
                width: '85%',
                borderRadius: 10,
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={icons.completed}
                  style={{width: 80, height: 80}}
                />
                <Text
                  style={{
                    ...FONTS.h2,
                    color: COLORS.black,
                    fontWeight: 'bold',
                    marginTop: 10,
                  }}>
                  Payment Successfull
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                    textAlign: 'center',
                    color: COLORS.darkGray,
                    marginTop: 5,
                  }}>
                  We sent you a confirmation email {'\n'}on your registered
                  email. thank you!
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                  onPress={() => navigation.navigate('Login')}>
                  <Image
                    source={icons.back}
                    style={{width: 20, height: 20, tintColor: COLORS.black}}
                  />
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.black,
                      left: 5,
                      borderWidth: 1,
                      borderColor: COLORS.darkGray,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 3,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <HeaderBar right={true} title="Payment" />
      {renderPaymentSuccessModal()}
      <View style={{marginHorizontal: 20}}>
        <ImageBackground
          source={images.home_banner}
          style={{padding: 30, alignItems: 'center'}}>
          <Text style={{color: 'white', ...FONTS.h3}}>Total amount</Text>
          <Text
            style={{
              ...FONTS.h2,
              color: 'white',
              fontWeight: 'bold',
            }}>
            Rs. 150,000
          </Text>
        </ImageBackground>

        <TextButton
          label="Save & Continue"
          buttonContainerStyle={{
            height: 45,
            alignItems: 'center',
            marginTop: SIZES.padding * 2,
            borderRadius: SIZES.base,
          }}
          onPress={() => onPaymentSubmit()}
        />
      </View>
    </View>
  );
};

export default CompanyPayment;
