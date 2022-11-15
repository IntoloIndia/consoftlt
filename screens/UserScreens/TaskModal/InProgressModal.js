import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import React, { useState, useEffect,useCallback, useMemo } from 'react';
import {
  icons,
  COLORS,
  SIZES,
  FONTS,
  dummyData,
} from '../../../constants';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from './css/InProgressModalStyle';
import { IconButton } from '../../../Components';
import {get_works_in_progress} from '../UserReports/ReportApi.js';
import {useSelector} from 'react-redux'

Entypo.loadFont();

function InProgressModal({ inProgressModal, setinProgressModal }) {

 
  const [getTaskInProgress,setGetTaskInProgress]=useState(); 
  
  
  const __handle_increase_counter = (item, index1) => {
    const _inputs = [...getTaskInProgress];
    if (_inputs[index1].work_percent < 100) {
      _inputs[index1].work_percent = _inputs[index1].work_percent + 5;
      _inputs[index1].key = index1;
      setGetTaskInProgress(_inputs);
    }
  };
  
  const __handle_decrease_counter = (item, index1) => {
    const _inputs = [...getTaskInProgress];
    if (_inputs[index1].work_percent > 0) {
      _inputs[index1].work_percent =  _inputs[index1].work_percent - 5;
      _inputs[index1].key = index1;
      setGetTaskInProgress(_inputs);
    }
  };
  
  
  const userData = useSelector(state => state.user);
  
  const fetchAssignWorksForSubmission = async () => {
    
    const data = await get_works_in_progress(userData._id); 
    
    if (data) { 
      data.map(ele => {
        setGetTaskInProgress(ele.assign_works); 
      });
    }     
    
  }
  
  useEffect(() => { 
    fetchAssignWorksForSubmission();
  }, []);  
  
  
 

  function CountingComponent() {
    return (
      <View style={{ margin: 10 }}>
        {
          getTaskInProgress? getTaskInProgress.map((item, index) => {
            return (
              <View key={index}
                style={{
                  marginTop: 15,
                  backgroundColor: COLORS.lightblue_200, 
                  height: 150,
                  borderRadius: 5,
                  elevation: 10

                }}>
                <View style={{ backgroundColor: COLORS.lightblue_300, 
                width: `${item.work_percent}%`,
                 borderBottomWidth: 10, borderColor: COLORS.green }}>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                  <Text style={{ color: 'black' }}>{item.work_code}</Text>
                  <Text style={{ color: 'black' }}>{item.exp_completion_date}</Text>
                </View>
                <View style={{ backgroundColor: COLORS.lightblue_500, height: 80, marginHorizontal: 10, marginTop: 5, padding: 10, borderRadius: 5 }}>
                  <Text style={{ color: 'black' }}>{item.work}</Text>
                </View>
                <View style={{ marginTop: 5, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => __handle_decrease_counter(item, index)}
                    >
                      <Entypo
                        name="minus"
                        size={25}
                        color={COLORS.black}
                      />
                    </TouchableOpacity>
                    <View>
                      <TextInput
                        style={styles.inputfromone}
                        editable={false}
                        // value={item.count[index1]}
                        value={String(`${item.work_percent}%`)}
                        onChangeText={(text)=>__handle_increase_counter(text,index1)}
                        placeholderTextColor={COLORS.lightGray1}
                        keyboardType="numeric"
                        placeholder={'counter'}
                      />
                    </View>
                    <TouchableOpacity

                      onPress={() => __handle_increase_counter(item, index)}
                    >
                      <Entypo
                        name="plus"
                        size={25}
                        color={COLORS.black}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: COLORS.darkGray, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1 }}>
                    <Text style={{ color: 'white', ...FONTS.h5 }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }):null
        }
      </View>
    )
  };



  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={inProgressModal}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: COLORS.transparentBlack8,
        }}>
        <View
          style={{
            backgroundColor: COLORS.white2,
            // position: 'absolute',
            width: '100%',
            height: '90%',
            // padding: SIZES.radius,
            paddingHorizontal: SIZES.base,
            paddingTop: SIZES.radius,
            paddingBottom: SIZES.padding,
            borderTopRightRadius: SIZES.base,
            borderTopLeftRadius: SIZES.base,
            backgroundColor: COLORS.white,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ color: 'black', ...FONTS.h2 }}>Active Tasks Statistics</Text>
            <IconButton
              containerStyle={{
                boborderWidth: 2,
                borderRadius: 10,
                borderColor: COLORS.gray2,
              }}
              icon={icons.cross}
              iconStyle={{
                tintColor: COLORS.gray,
              }}
              onPress={() => setinProgressModal(false)}
            />
          </View>
          <ScrollView nestedScrollEnabled={true}>
            {CountingComponent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
export default InProgressModal;
