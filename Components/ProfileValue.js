import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';

const ProfileValue = ({icon, value, onPress, image}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',
      }}
      onPress={onPress}>
      {/* icon  */}
      <View
        style={{
          width: 35,
          height: 35,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          backgroundColor: COLORS.lightblue_100,
        }}>
        <Image
          source={icon}
          resizeMode="contain"
          style={{
            height: 20,
            width: 20,
            tintColor: COLORS.lightblue_800,
          }}
        />
      </View>

      {/* label & value  */}
      <View
        style={{
          flex: 1,
          marginLeft: SIZES.radius,
        }}>
        <Text style={{...FONTS.h3, color: COLORS.darkGray}}>{value}</Text>
      </View>
      {/* icon  */}
      <Image
        source={image}
        style={{
          height: 18,
          width: 18,
          tintColor: COLORS.darkGray,
        }}
      />
    </TouchableOpacity>
  );
};

export default ProfileValue;
