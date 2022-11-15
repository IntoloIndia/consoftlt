import React from 'react';
import {View, Text, FlatList, Image} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../../../constants';

const RevertWorks = ({RevertData}) => {
  const renderItem = ({item}) => (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.black,
              textTransform: 'capitalize',
              // fontWeight: 'bold',
            }}>
            {item.user_name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              left: 5,
              paddingHorizontal: 3,
              backgroundColor: COLORS.rose_600,
              color: COLORS.white,
              borderRadius: 2,
            }}>
            {item.work_code}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              right: 10,
            }}>
            <Image
              source={icons.date}
              style={{
                height: 12,
                width: 12,
                tintColor: COLORS.darkGray,
                right: 3,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: COLORS.darkGray,
              }}>
              {item.verify_date}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={icons.time}
              style={{
                height: 12,
                width: 12,
                tintColor: COLORS.darkGray,
                right: 3,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: COLORS.darkGray,
              }}>
              {item.verify_time}
            </Text>
          </View>
        </View>
      </View>
      <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
        <Text style={{...FONTS.h3, color: COLORS.darkGray}}>Work{' - '}</Text>
        {item.work}
      </Text>
      {/* <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
        <Text style={{...FONTS.h3, color: COLORS.darkGray}}>Msg{' - '}</Text>
        {item.submit_work_text}
      </Text> */}
    </View>
  );

  return (
    <FlatList
      data={RevertData}
      keyExtractor={item => `${item._id}`}
      contentContainerStyle={{marginTop: SIZES.base}}
      renderItem={renderItem}
      ItemSeparatorComponent={() => {
        return (
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.gray,
              marginVertical: 12,
            }}></View>
        );
      }}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default RevertWorks;
