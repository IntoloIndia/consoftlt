import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, SIZES, FONTS, icons} from '../constants';

const HeaderBar = ({right, title}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: SIZES.radius,
        paddingVertical: SIZES.padding,
      }}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{alignItems: 'center', alignItems: 'flex-start'}}
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            style={{width: 20, height: 20, tintColor: COLORS.black}}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: SIZES.radius,
            ...FONTS.h2,

            color: COLORS.lightblue_900,
            textTransform: 'capitalize',
          }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default HeaderBar;
