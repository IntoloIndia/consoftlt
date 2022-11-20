import React, {useMemo} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet
} from 'react-native';
import {icons, COLORS, SIZES, FONTS, dummyData} from '../../../constants';
import {get_completed_task} from '../UserReports/ReportApi.js';
import {useSelector} from 'react-redux';

const DoneModal = ({doneModal, setdoneModal, loading}) => {
  const userData = useSelector(state => state.user);

  const [assignWork, setAssignWork] = React.useState('');

  const fetchCompletedWorks = async () => {
    const data = await get_completed_task(userData._id);
    if (data.length > 0) {
      data.map(async (ele, index) => {
        setAssignWork(ele.assign_works);
      });
    }
  };

  useMemo(() => {
    fetchCompletedWorks();
  }, [loading]);

  const renderItem = ({item, index}) =>
    item.verify === true && item.work_status === true ? (
      <View style={{paddingVertical: 5}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: COLORS.majorelle_blue_700,
              padding: 5,
            }}>
            <Text style={{color: COLORS.white, ...FONTS.h3}}>
              {index + 1}
              {' . '}
            </Text>
            <Text style={{color: COLORS.white, ...FONTS.h3}}>{item.work}</Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : (
      <View>
        <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
          Doesn't exist any completed tasks right now.
        </Text>
      </View>
    );

  return (
    // <Modal animationType="slide" transparent={true} visible={doneModal}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: COLORS.transparentBlack6,
     
        }}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '80%',
            padding: 20,
            backgroundColor: COLORS.white,
            borderRadius:5,
            ...styles.shadow,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text style={{fontSize: 22, color: COLORS.darkGray}}>
              Completed Works
            </Text>
            <ImageBackground
              style={{
                backgroundColor: COLORS.white,
                padding: 2,
                elevation: 20,
              }}>
              {/* <TouchableOpacity onPress={() => setdoneModal(false)}>
                <Image
                  source={icons.cross}
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: COLORS.rose_600,
                  }}
                />
              </TouchableOpacity> */}
            </ImageBackground>
          </View>

          <FlatList
            contentContainerStyle={{marginTop: SIZES.radius}}
            data={assignWork}
            scrollEnabled={true}
            maxHeight={400}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
        </View>
      </View>
    //  </Modal> 
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
export default DoneModal;
