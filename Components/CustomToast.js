import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {COLORS, SIZES, FONTS} from '../constants';

const CustomToast = ({isVisible, onClose, color, title, message}) => {
  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              marginHorizontal: SIZES.padding * 1.5,
            }}>
            <View
              style={{
                position: 'absolute',
                top: '5%',
                width: '100%',
                backgroundColor: COLORS.white,
                borderLeftColor: color,
                borderLeftWidth: 10,
                borderRadius: 5,
                paddingHorizontal: SIZES.padding,
                paddingVertical: 5,
                ...styles.shadow,
              }}>
              <TouchableOpacity>
                <Text style={{...FONTS.h3, color: COLORS.black}}>{title}</Text>
              </TouchableOpacity>
              <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                {message}
              </Text>
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

export default CustomToast;
