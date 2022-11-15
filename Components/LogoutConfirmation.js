import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {FONTS, COLORS, icons} from '../constants';

const LogoutConfrmation = ({isVisible, onClose, onClickLogout}) => {
  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.transparentBlack5,
            }}>
            <View
              style={{
                position: 'absolute',
                width: '85%',
                backgroundColor: COLORS.white,
                ...styles.shadow,
                padding: 20,
                alignItems: 'center',
                borderRadius: 5,
              }}>
              <Image source={icons.logout} style={{height: 30, width: 30}} />
              <Text
                style={{...FONTS.h2, color: COLORS.darkGray, marginTop: 10}}>
                Logout Confirmation
              </Text>
              <Text
                style={{...FONTS.h3, color: COLORS.darkGray, marginTop: 10}}>
                Are you sure you want to logout?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={{
                    right: 20,
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    borderRadius: 2,
                    backgroundColor: COLORS.green,
                  }}
                  onPress={onClose}>
                  <Text style={{...FONTS.h3, color: COLORS.white}}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    borderRadius: 2,
                    backgroundColor: COLORS.red_600,
                  }}
                  onPress={onClickLogout}>
                  <Text style={{...FONTS.h3, color: COLORS.white}}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 20,
  },
});
export default LogoutConfrmation;
