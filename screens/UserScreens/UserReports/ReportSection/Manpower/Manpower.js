import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  Pressable,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../../ReportStyle.js';
import {
  EditDeletebuttons,
  ManPowerProjectTeam,
  ManpowerUserContractors,
} from '../../../index.js';
import {Get_Contractor_Data} from '../../ReportApi.js';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const Manpower = ({projectTeamList, ProList, Main_drp_pro_value, loading}) => {
  const animation = useRef(new Animated.Value(0)).current;
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  const [TabCollapse, setTabCollapse] = useState(false);

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 0.5,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    setTimeout(() => {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }, 150);
  };

  return (
    <View>
      <Animated.View
        style={{
          transform: [{scale}],
        }}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => {
            LayoutAnimation.configureNext({
              duration: 300,
              create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
              },
              update: {
                type: LayoutAnimation.Types.easeInEaseOut,
              },
            });
            setTabCollapse(!TabCollapse);
          }}
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.radius,
            paddingVertical: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: COLORS.majorelle_blue_800,
            top: SIZES.radius,
          }}>
          <View style={{}}>
            <Text
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                LayoutAnimation.configureNext({
                  duration: 300,
                  create: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                    property: LayoutAnimation.Properties.opacity,
                  },
                  update: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                  },
                });
                setTabCollapse(!TabCollapse);
              }}
              style={{...FONTS.h3, color: COLORS.white}}>
              Manpower
            </Text>
          </View>

          <View style={{alignItems: 'center', alignSelf: 'center'}}>
            <TouchableOpacity
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                LayoutAnimation.configureNext({
                  duration: 300,
                  create: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                    property: LayoutAnimation.Properties.opacity,
                  },
                  update: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                  },
                });

                setTabCollapse(!TabCollapse);
              }}>
              <AntDesign name="caretdown" size={12} color={COLORS.white2} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Animated.View>
      {TabCollapse ? (
        <View style={{justifyContent: 'space-evenly'}}>
          <View>
            {/* project team start */}
            <ManPowerProjectTeam
              projectTeamList={projectTeamList}
              Main_drp_pro_value={Main_drp_pro_value}
              loading={loading}
            />
          </View>
          <View style={{marginTop: 5}}>
            <ManpowerUserContractors
              ProList={ProList}
              Main_drp_pro_value={Main_drp_pro_value}
              loading={loading}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default Manpower;
