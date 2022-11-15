import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  //
  lightblue_50: '#f0f9ff',
  lightblue_100: '#e0f2fe',
  lightblue_200: '#bae6fd',
  lightblue_300: '#7dd3fc',
  lightblue_400: '#38bdf8',
  lightblue_500: '#0ea5e9',
  lightblue_600: '#0284c7',
  lightblue_700: '#0369a1',
  lightblue_800: '#075985',
  lightblue_900: '#0c4a6e',

  //
  yellow_50: '#fefce8',
  yellow_100: '#fef9c3',
  yellow_200: '#fef08a',
  yellow_300: '#fde047',
  yellow_400: '#facc15',
  yellow_500: '#eab308',
  yellow_600: '#ca8a04',
  yellow_700: '#b45309',
  yellow_800: '#92400e',
  yellow_900: '#78350f',

  //
  success_100: '#dcfce7',
  success_300: '#86efac',
  success_400: '#4ade80',
  success_500: '#22c55e',
  success_600: '#16a34a',
  success_700: '#15803d',
  success_800: '#166534',
  success_900: '#14532d',

  //
  rose_600: '#e11d48',
  red: '#FF1717',
  red_300: '#fca5a5',
  red_600: '#dc2626',

  //
  warning_100: '#ffedd5',
  warning_200: '#fecaca',

  //
  orange: '#FFA133',
  lightOrange: '#FFA133',
  lightOrange2: '#FDDED4',
  lightOrange3: '#FFD9AD',

  //
  green: '#27AE60',
  green_200: '#bbf7d0',
  green_400: '#4ade80',

  //
  darkGray: '#525C67',
  darkGray2: '#757D85',

  //
  gray: '#898B9A',
  gray2: '#BBBDC1',
  gray3: '#CFD0D7',

  //
  lightGray1: '#DDDDDD',
  lightGray2: '#F5F5F8',

  //
  white: '#FFFFFF',
  white2: '#FBFBFB',
  white3: '#F8F8FF',

  //
  black: '#000000',

  //
  primary: '#FF6C44',
  blue: '#0064C0',
  darkBlue: '#111A2C',
  tertiary50: '#ecfdf5',
  teal_400: '#2dd4bf',

  //
  transparentPrimary: '#bae6fd',
  transparent: 'transparent',
  transparentBlack1: 'rgba(0, 0, 0, 0.1)',
  transparentBlack2: 'rgba(0, 0, 0, 0.2)',
  transparentBlack3: 'rgba(0, 0, 0, 0.3)',
  transparentBlack4: 'rgba(0, 0, 0, 0.4)',
  transparentBlack5: 'rgba(0, 0, 0, 0.5)',
  transparentBlack6: 'rgba(0, 0, 0, 0.6)',
  transparentBlack7: 'rgba(0, 0, 0, 0.7)',
  transparentBlack8: 'rgba(0, 0, 0, 0.8)',
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  h5: 12,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  // app dimensions
  width,
  height,
};
export const FONTS = {
  largeTitle: {fontFamily: 'Poppins-Black', fontSize: SIZES.largeTitle},
  h1: {fontFamily: 'Poppins-Bold', fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontFamily: 'Poppins-Bold', fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontFamily: 'Poppins-SemiBold', fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontFamily: 'Poppins-SemiBold', fontSize: SIZES.h4, lineHeight: 22},
  h5: {fontFamily: 'Poppins-SemiBold', fontSize: SIZES.h5, lineHeight: 22},
  h6: {fontFamily: 'Poppins-SemiBold', fontSize: SIZES.h5, lineHeight: 18},
  body1: {fontFamily: 'Poppins-Regular', fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontFamily: 'Poppins-Regular', fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontFamily: 'Poppins-Regular', fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontFamily: 'Poppins-Regular', fontSize: SIZES.body4, lineHeight: 22},
  body5: {fontFamily: 'Poppins-Regular', fontSize: SIZES.body5, lineHeight: 22},
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
