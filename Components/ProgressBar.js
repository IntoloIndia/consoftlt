import React from 'react';
import {View, Text} from 'react-native';
import {COLORS} from '../constants';

const ProgressBar = ({containerStyle, progress}) => {
  return (
    <View
      style={{
        width: '100%',
        height: 10,
        borderRadius: 10,
        backgroundColor: COLORS.lightGray1,
        ...containerStyle,
      }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          height: '100%',
          width: progress,
          borderRadius: 10,
          backgroundColor: COLORS.rose_600,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 6,
            textAlign: 'right',
            color: COLORS.white,
            right: 10,
            fontWeight: 'bold',
          }}>
          {progress}%
        </Text>
      </View>
    </View>
  );
};

export default ProgressBar;
