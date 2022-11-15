import React, { useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { icons, COLORS, SIZES, FONTS, dummyData } from '../../../constants';
import Entypo from 'react-native-vector-icons/Entypo';
import { Card } from '@ui-kitten/components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './css/DoneModalStyle';
import { get_completed_task } from '../UserReports/ReportApi.js'
import { useSelector } from 'react-redux';
const DoneModal = ({ doneModal, setdoneModal, loading }) => {

  const userData = useSelector(state => state.user);
  const [assignWork, setAssignWork] = React.useState('');
  const fetchCompletedWorks = async () => {
    // setUserDataId(userData._id);
    const data = await get_completed_task(userData._id);
    // console.log("🚀 ~ file: DoneModal.js ~ line 25 ~ fetchCompletedWorks ~ data", data)

    if (data.length>0) {
      data.map(async (ele, index) => {
        // console.log("🚀 ~ file: DoneModal.js ~ line 29 ~ data.map ~ ele", ele)
        // ele.assign_works.map(list => {

        setAssignWork(ele.assign_works); 
        // })

      });
    }
  };

  // console.log("🚀 ~ file: DoneModal.js ~ line 22 ~ DoneModal ~ assignWork", assignWork)


  useMemo(() => {
      fetchCompletedWorks();      
  }, [loading]); 



  const renderItem = ({ item }) => (
   item.verify===true && item.work_status===true? <View
      style={{
        flex: 1,
        backgroundColor: COLORS.gray3,
        justifyContent: "center",
        width: "100%",
        padding: SIZES.base,
        borderRadius: SIZES.base,
        elevation: 8,
        margin: 5,
        alignSelf: "center",
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          elevation: 18
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            opacity: 0.8,
            tintColor: "black"
          }}
          source={icons.checklist}
        />
        <View style={{
          // borderWidth:1,
          width: "70%"
        }}>
          <Text style={{ fontWeight: 'bold', color: COLORS.blue }}>
            {item.work}
          </Text>
        </View>
        <TouchableOpacity>
          <AntDesign name="rightcircleo" color={'#106853'} size={18} />
        </TouchableOpacity>
      </View>
    </View>
    :
    <View>
      <Text>No task completed!</Text>
    </View>
  );

  function Modalfunction() {
    return (
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.transparentBlack8,
            paddingTop: SIZES.width * 2,
          }}
          onPress={() => setdoneModal(!doneModal)}></TouchableOpacity>
        <Card
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            bottom: 20,
            right: 0,
            left: 0,
            borderColor: 'whitesmoke',
            height:'60%',
            marginTop: "40%",
            marginVertical: SIZES.width * 0.67,
            marginHorizontal: SIZES.base,
            backgroundColor: COLORS.white,
            borderRadius: 10,
            ...styles.shadow,
          }}>
          <View style={{ 
            alignSelf:"flex-end",
            marginHorizontal:-SIZES.body3,
            marginTop:-SIZES.base*0.5
            }}>
            <TouchableOpacity
              style={{
                borderRadius: SIZES.padding                
              }}
              onPress={() => setdoneModal(!doneModal)}>
              <Entypo name="cross" color={COLORS.black} size={25} />
            </TouchableOpacity>
          </View>
          <View style={[{ alignItems: 'center', marginTop: SIZES.h3 }]}>
            <Text style={{ ...FONTS.body2, color: COLORS.black }}>Completed Tasks </Text>
          </View>
          <View style={{ marginTop: SIZES.h1 }}>
            <FlatList
              data={assignWork}
              scrollEnabled={true}
              maxHeight={400} 
              showsVerticalScrollIndicator={false}
              renderItem={renderItem} 
              keyExtractor={item => item._id}
            />
          </View>
        </Card>
      </View>
    );
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={doneModal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setDoneModal(!doneModal);
      }}>
      {Modalfunction()}
    </Modal>
  );
};

export default DoneModal;
