import React from 'react';
import {View} from 'react-native';
import {COLORS} from '../constants';

const LineDivider = () => {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: COLORS.lightGray1,
      }}></View>
  );
};

export default LineDivider;
