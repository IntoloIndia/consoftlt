import React from 'react';
import {View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {COLORS, SIZES} from '../constants';

const Drop = ({
  open,
  setOpen,
  setValue,
  value,
  items,
  setItems,
  placeholder,
  categorySelectable,
  listParentLabelStyle,
  multiple,
  zIndex,
  zIndexInverse,
  onChangeValue,
  maxHeight,
  onOpen,
  closeAfterSelecting,
  onSelectItem,
  containerStyle,
  dropdownContainerStyle,
}) => {
  return (
    <View>
      <DropDownPicker
        style={{
          flex: 1,
          marginTop: SIZES.radius * 1.4,
          borderWidth: null,
          backgroundColor: COLORS.gray3,
          minHeight: 40,
          paddingHorizontal: SIZES.padding,
          ...containerStyle,
        }}
        maxHeight={maxHeight}
        dropDownContainerStyle={{
          marginTop: SIZES.radius * 1.4,
          backgroundColor: COLORS.majorelle_blue_900,
          borderWidth: null,
          // marginBottom:20
          ...dropdownContainerStyle,
        }}
        textStyle={{
          fontSize: 15,
          color: COLORS.black,
          // textTransform: 'capitalize',
        }}
        categorySelectable={categorySelectable}
        listParentLabelStyle={listParentLabelStyle}
        listChildContainerStyle={{
          paddingLeft: 30,
        }}
        listChildLabelStyle={{
          color: COLORS.white,
          fontSize: 15,
        }}
        placeholder={placeholder}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onOpen={onOpen}
        // multiple
        theme="LIGHT"
        multiple={multiple}
        mode="BADGE"
        badgeDotColors={[
          COLORS.rose_600,
          COLORS.green,
          COLORS.yellow_600,
          COLORS.blue,
        ]}
        tickIconStyle={{
          width: 15,
          height: 15,
          backgroundColor: COLORS.white,
          borderRadius: SIZES.base,
        }}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        onChangeValue={onChangeValue}
        onSelectItem={onSelectItem}
        closeAfterSelecting={closeAfterSelecting}
      />
    </View>
  );
};

export default Drop;
