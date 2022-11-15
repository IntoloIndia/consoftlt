import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {COLORS, icons, SIZES} from '../constants';
import {Swipeable} from 'react-native-gesture-handler';

const ItemBox = props => {
  const renderRight = progress => {
    let x = 50;
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    return (
      <Animated.View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 100,
          height: 80,
          flexDirection: 'row',
          transform: [{translateX: 0}],
        }}>
        <TouchableOpacity>
          <ImageBackground
            style={{
              backgroundColor: COLORS.warning_200,
              padding: 8,
              borderRadius: SIZES.base,
              right: 10,
            }}>
            <Image
              source={icons.delete_icon}
              style={{height: 20, width: 20, tintColor: COLORS.rose_600}}
            />
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity>
          <ImageBackground
            style={{
              backgroundColor: COLORS.lightblue_200,
              padding: 8,
              borderRadius: SIZES.base,
            }}>
            <Image
              source={icons.edit}
              style={{height: 20, width: 20, tintColor: COLORS.lightblue_700}}
            />
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const leftSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clarp',
    });

    return (
      <Animated.View
        style={{
          backgroundColor: COLORS.rose_600,
          justifyContent: 'center',
          alignItems: 'center',
          width: 100,
          height: 80,
          transform: [{scale: scale}],
        }}>
        <TouchableOpacity onPress={() => console.log('delete')}>
          <Animated.Image
            source={icons.delete_icon}
            style={{
              height: 25,
              width: 25,
              tintColor: COLORS.white2,
              transform: [{scale: scale}],
            }}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <Swipeable
      //   renderLeftActions={leftSwipe}
      renderRightActions={progress => renderRight(progress)}>
      <View
        style={{
          height: 80,
          //   backgroundColor: COLORS.white,
          justifyContent: 'center',
          padding: 16,
        }}>
        <Text>Name is {props.data.name}</Text>
      </View>
    </Swipeable>
  );
};
const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default ItemBox;
