import React from 'react';
import {View, Text, Image, FlatList, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES, icons, images} from '../../../constants';

const ProjectWorksIdentifier = () => {
  const projectTasksIdentifier = [
    {id: 1, name: 'Important', img: images.red},
    {id: 2, name: 'Moderate', img: images.green},
    {id: 3, name: 'Informational', img: images.yellow},
  ];

  const [indentifierColor, setIdentifierColor] = React.useState(
    projectTasksIdentifier,
  );

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        style={{
          flex: 1,
          ...FONTS.h3,
          color: COLORS.darkGray,
        }}>
        {item.name}
      </Text>
      <Image
        source={item.img}
        style={{
          height: 12,
          width: 25,
          borderRadius: SIZES.base,
        }}
      />
    </View>
  );
  return (
    <View
      style={{
        marginTop: SIZES.padding,
        marginHorizontal: SIZES.padding,
        padding: 20,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.lightblue_50,
        ...styles.shadow,
      }}>
      <Text style={{...FONTS.h3, color: COLORS.black}}>Work Tasks</Text>
      <FlatList
        contentContainerStyle={{marginTop: SIZES.radius}}
        scrollEnabled={false}
        data={indentifierColor}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: COLORS.lightGray1,
                marginVertical: 5,
              }}></View>
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
export default ProjectWorksIdentifier;
