import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  LogBox,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {icons, COLORS, SIZES, FONTS, images} from '../../../constants';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {InProgressModal, DoneModal} from '../TaskModal';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  getCheckUserPresent,
  postUserAttendance,
} from '../../../controller/UserAttendanceController.js';
//saurabh
import UserAssignWorks from './UserAssignWorks';

const UserDashboard = () => {
  // refresh
  function delay(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const loadMore = React.useCallback(async () => {
    setLoading(true);
    delay(2000).then(() => setLoading(false));
  }, [loading]);

  const [inProgressModal, setinProgressModal] = React.useState(false);
  const [doneModal, setdoneModal] = React.useState(false);
  const [inProgressModalnum, setinProgressModalNum] = React.useState(false);
  const [doneModalnum, setdoneModalNum] = React.useState(false);
  const [attendanceModal, setAttendanceModal] = React.useState(false);
  const userData = useSelector(state => state.user);

  const handleInProgressTask = () => {
    setinProgressModalNum(true);
    setinProgressModal(true);
  };
  const handleDoneTask = () => {
    setdoneModalNum(true);
    setdoneModal(true);
  };

  React.useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const onSubmitUserAttendance = async () => {
    const formData = {
      company_id: userData.company_id,
      user_id: userData._id,
    };
    const response = await postUserAttendance(formData);
    if (response.status === 200) {
      setAttendanceModal(false);
      alert(response.message);
    }
  };

  const CheckUserPresentStatus = async () => {
    const response = await getCheckUserPresent(
      userData.company_id,
      userData._id,
    );
    if (response.status == 200) {
      setAttendanceModal(true);
    }
  };

  React.useEffect(() => {
    if (userData._id) {
      CheckUserPresentStatus();
    }
  }, []);

  function renderAttendanceModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={attendanceModal}>
        <TouchableWithoutFeedback onPress={() => setAttendanceModal(true)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.transparentBlack7,
            }}>
            <View
              style={{
                position: 'absolute',
                width: '90%',
                padding: 20,
                borderRadius: 5,
                backgroundColor: COLORS.white,
              }}>
              <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                Please, First Mark Your today's Attendance is "Compulsory"
                Before Entering the Home Screen.
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  backgroundColor: 'green',
                  paddingHorizontal: 15,
                  paddingVertical: 7,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}
                onPress={() => onSubmitUserAttendance()}>
                <Text style={{...FONTS.h3, color: COLORS.white}}>Present</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      refreshControl={
        <RefreshControl
          progressBackgroundColor="white"
          tintColor="red"
          refreshing={loading}
          onRefresh={loadMore}
        />
      }>
      <UserAssignWorks loading={loading} />
      <View
        style={
          {
            // flex: 1,
          }
        }>
        <TouchableOpacity
          style={{
            marginTop: SIZES.base,
            padding: 15,
            marginHorizontal: SIZES.radius,
            borderRadius: 5,
            backgroundColor: COLORS.white,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...styles.shadow,
          }}
          onPress={() => {
            handleDoneTask();
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={icons.completed}
              style={{height: 25, width: 25, tintColor: COLORS.green}}
            />
            <Text style={{...FONTS.h2, color: COLORS.darkGray, left: 15}}>
              Done tasks
            </Text>
          </View>
          <View>
            <Entypo name="chevron-right" size={25} color={COLORS.darkGray} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: SIZES.radius * 1.5,
            padding: 15,
            marginHorizontal: SIZES.radius,
            borderRadius: 5,
            backgroundColor: COLORS.white,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...styles.shadow,
          }}
          onPress={() => {
            // handleDoneTask()
            navigation.navigate('ViewReport');
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={icons.report}
              style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
            />
            <Text style={{...FONTS.h2, color: COLORS.darkGray, left: 15}}>
              View report
            </Text>
          </View>
          <View>
            <Entypo name="chevron-right" size={25} color={COLORS.darkGray} />
          </View>
        </TouchableOpacity>
        {doneModalnum && (
          <DoneModal
            doneModal={doneModal}
            setdoneModal={setdoneModal}
            loading={loading}
          />
        )}
      </View>
      {renderAttendanceModal()}
    </ScrollView>
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
export default UserDashboard;
