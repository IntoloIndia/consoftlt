import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants';

const FormInput = ({
  containerStyle,
  label,
  placeholder,
  inputStyle,
  prependComponent,
  appendComponent,
  onChange,
  secureTextEntry,
  keyboardType = 'default',
  autoCompleteType = 'off',
  autoCapitalize = 'none',
  errorMsg = '',
  value,
  multiline,
  numberOfLines,
  editable,
}) => {
  return (
    <View style={{...containerStyle}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            color: COLORS.darkGray,
            ...FONTS.body4,
            marginTop: SIZES.base,
          }}>
          {label}
        </Text>
        <Text style={{color: COLORS.red, ...FONTS.body4}}>{errorMsg}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          height: 40,
          paddingHorizontal: SIZES.radius,
          // marginTop: SIZES.base,
          borderRadius: SIZES.base,
          backgroundColor: COLORS.gray3,
        }}>
        {prependComponent}
        <TextInput
          style={{flex: 1, ...inputStyle, color: COLORS.black}}
          placeholder={placeholder}
          placeholderTextColor={COLORS.darkGray}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCompleteType={autoCompleteType}
          autoCapitalize={autoCapitalize}
          onChangeText={text => onChange(text)}
          value={value}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
        />
        {appendComponent}
      </View>
    </View>
  );
};

export default FormInput;
