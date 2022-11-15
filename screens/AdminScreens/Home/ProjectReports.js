import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../../../constants';
import {getProjectAtGlance} from '../../../controller/ReportController';
import {useNavigation} from '@react-navigation/native';

const ProjectReports = ({data, reportFunction}) => {
  const navigation = useNavigation();
  function renderProjectAtGlance() {
    const renderItem = ({item, index}) => (
      <View style={{}}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.darkGray,
            }}>
            {index + 1}.{' '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProjectsDetails', {
                name: item.project_name,
                project_id: item._id,
              });
            }}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
              }}>
              {item.project_name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <FlatList
        contentContainerStyle={{marginTop: SIZES.radius}}
        data={data}
        keyExtractor={item => `${item._id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        maxHeight={300}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray2,
                marginVertical: 10,
              }}></View>
          );
        }}
      />
    );
  }

  return (
    <View
      style={{
        marginTop: SIZES.padding,
        backgroundColor: COLORS.white,
        marginHorizontal: SIZES.radius,
        borderRadius: 5,
        padding: 15,
        ...styles.shadow,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{...FONTS.h2, color: COLORS.darkGray}}>
          Project at a glance
        </Text>
        <TouchableOpacity onPress={() => alert('filter data...')}>
          <Image
            source={icons.filter}
            style={{height: 20, width: 20, tintColor: COLORS.darkGray}}
          />
        </TouchableOpacity>
      </View>
      {renderProjectAtGlance()}
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
export default ProjectReports;
