import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import ProjectsBanner from './ProjectsBanner';
import AssignedWorks from './AssignedWorks';
import ProjectReports from './ProjectReports';
import SubmittedWorks from './SubmittedWorks';
import VerifyAndRevertWork from './VerifyAndRevertWork';
import {useSelector} from 'react-redux';
import {getSubmitWorks} from '../../../controller/AssignWorkController';
import {getVerifyAndRevertWorks} from '../../../controller/AssignWorkController';
import {getAssignWorks} from '../../../controller/AssignWorkController';
import {SIZES, COLORS, FONTS, images} from '../../../constants';
import {getProjectAtGlance} from '../../../controller/ReportController';
import {
  getCheckUserPresent,
  postUserAttendance,
} from '../../../controller/UserAttendanceController';
import {getUserId} from '../../../services/asyncStorageService';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = ({navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [attendanceModal, setAttendanceModal] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAssignWorks();
    fetchVerifyAndRevertWork();
    fetchSubmitWork();
    fetchProjectAtGlance();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);

  var companyData;
  if (companyDetail._id) {
    companyData = companyDetail;
  } else {
    companyData = userData;
  }

  const [userId, setUserId] = React.useState('');
  const getUser_Id = async () => {
    const id = await getUserId();
    setUserId(id);
  };

  const [submitWork, setSubmitWork] = React.useState([]);
  const fetchSubmitWork = async () => {
    const response = await getSubmitWorks(companyData._id);
    if (response.status === 200) {
      setSubmitWork(response.data);
    }
  };

  //==================
  // const [verifyAndRevert, setVerifyAndRevert] = React.useState([]);
  const [verify, setVerify] = React.useState([]);
  const [revert, setRevert] = React.useState([]);

  const fetchVerifyAndRevertWork = async () => {
    const response = await getVerifyAndRevertWorks(companyData._id);

    //filter revert & verify
    const verify_data = response.data.filter(el => el.verify === true);
    setVerify(verify_data);
    const revert_data = response.data.filter(el => el.revert_status === true);
    setRevert(revert_data);
  };

  //===========================
  const [assignWorkData, setAssignWorkData] = React.useState([]);
  const fetchAssignWorks = async () => {
    const response = await getAssignWorks(companyData._id);
    if (response.status === 200) {
      setAssignWorkData(response.data);
    }
  };

  //=======================
  const [reportData, setReportData] = React.useState([]);
  const fetchProjectAtGlance = async () => {
    const response = await getProjectAtGlance(companyData._id);
    if (response.status === 200) {
      setReportData(response.data);
    }
  };

  const onSubmitUserAttendance = async () => {
    const formData = {
      company_id: companyData._id,
      user_id: companyData.user_id,
    };
    const response = await postUserAttendance(formData);
    if (response.status === 200) {
      setAttendanceModal(false);
      alert(response.message);
    }
  };

  const CheckUserPresentStatus = async () => {
    const response = await getCheckUserPresent(
      companyData._id,
      companyData.user_id,
    );
    if (response.status == 200) {
      setAttendanceModal(true);
    }
  };

  React.useEffect(() => {
    fetchSubmitWork();
    fetchVerifyAndRevertWork();
    fetchAssignWorks();
    fetchProjectAtGlance();
    if (companyData.user_id) {
      CheckUserPresentStatus();
    }
    getUser_Id();
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}>
      <View
        style={{
          flex: 1,
          marginBottom: 20,
        }}>
        <View
          style={{
            marginHorizontal: SIZES.radius,
            marginVertical: SIZES.radius,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <Text
                style={{
                  ...FONTS.h2,
                  textTransform: 'capitalize',
                  color: COLORS.majorelle_blue_800,
                  fontWeight: 'bold',
                }}>
                {companyData.company_name}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{}}>
            <Image
              source={images.consoft_lt_logo}
              style={{
                height: 28,
                width: 90,
                borderRadius: 2,
              }}
            />
          </TouchableOpacity>
        </View>

        <ProjectsBanner company={companyData._id} />
        <SubmittedWorks data={submitWork} Submitfunction={fetchSubmitWork} />
        {/* <ProjectReports
            data={reportData}
            reportFunction={fetchProjectAtGlance}
          /> */}
        <AssignedWorks
          data={assignWorkData}
          AssignWorkfunction={fetchAssignWorks}
        />
        {/* <VerifyAndRevertWork verify={verify} revert={revert} /> */}
      </View>
      {renderAttendanceModal()}
    </ScrollView>
  );
};

export default Home;
