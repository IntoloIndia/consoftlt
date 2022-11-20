import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Animated,
  Easing,
  Switch,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  LogBox,
  LayoutAnimation,
  ImageBackground,
} from 'react-native';
import {
  COLORS,
  FONTS,
  SIZES,
  dummyData,
  icons,
  images,
} from '../../../../../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../ReportStyle.js';

const EditDeletebuttons = ({edit_size, del_size}) => {
  const {
    header,
    con_body,
    input,
    body_del,
    body_edit,
    body_del_btn,
    body_edit_btn,
    body_ed_de_view,
  } = styles;

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity
        style={{
          padding: 4,
          backgroundColor: COLORS.green,
          borderRadius: 3,
          right: 5,
        }}
        onPress={() => console.log('edit')}>
        <FontAwesome name="edit" color={COLORS.white} size={12} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{padding: 4, backgroundColor: COLORS.red, borderRadius: 3}}
        onPress={() => console.log('delete')}>
        <MaterialCommunityIcons name="delete" color={COLORS.white} size={12} />
      </TouchableOpacity>
    </View>
  );
};

export default EditDeletebuttons;
