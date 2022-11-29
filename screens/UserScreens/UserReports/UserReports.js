import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  LogBox,
} from 'react-native';
import {
  COLORS,
  FONTS,
  SIZES,
  dummyData,
  icons,
  images,
} from '../../../constants';
import {
  FormInput,
  Drop,
  IconButton,
  CustomDropdown,
  TextButton,
  CustomToast,
} from '../../../Components';
import {Divider} from '@ui-kitten/components';
import CheckBox from '@react-native-community/checkbox';

import DropDownPicker from 'react-native-dropdown-picker';
import styles from './ReportStyle.js';
import {
  EditDeletebuttons,
  ReportDateTimeHeader,
  Manpower,
  Stock,
  Quantity,
  Quality,
  TAndP,
} from '../index.js';
import {Dropdown} from 'react-native-element-dropdown';
import {Get_Project_Team_Data} from '../UserReports/ReportApi.js';
import {getToken, getUserId} from '../../../services/asyncStorageService';
// import Config from '../../../config'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
const UserReports = ({route}) => {
  LogBox.ignoreLogs(['EventEmitter.removeListener']);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);
  const current_dat = moment().format('YYYY%2FMM%2FDD');

  const {
    header,
    con_body,
    input,
    body_del,
    body_edit,
    body_del_btn,
    body_edit_btn,
    body_ed_de_view,
    Project_list_drop,
  } = styles;

  //project list setting
  const [ProList, setProList] = useState([]);
  const [proListIsFocus, setProListIsFocus] = useState(false);
  const [projectTeamList, setProjectTeamList] = useState([]);

  //Projects in dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  //for saving projects
  const [selectedIdProjects, setSelectedIdProjects] = useState([]);
  const [userid, setUserid] = useState(null);
  const userData = useSelector(state => state.user);

  // refresh
  function delay(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  const [loading, setLoading] = React.useState(false);

  const loadMore = React.useCallback(async () => {
    setLoading(true);

    delay(2000).then(() => setLoading(false));
  }, [loading]);
  // const Get_UserId_Data = async () => {
  //   const userid = await getUserId();
  //   const new_userid = userid;
  //   setUserid(new_userid);
  // }
  //getting user id state
  // useMemo(() => {
  //   Get_UserId_Data();

  //   // console.log("seconde.....................")

  // }, [getUserId])

  useMemo(() => {
    // console.log("userbyproject...........")
    // console.log(userData._id)
    if (userData._id) {
      const sendUserId = async () => {
        let data = await fetch(
          `${process.env.API_URL}user-by-projects/${userData._id}`,
        );
        //  console.log("🚀 ~ file: UserReports.js ~ line 70 ~ sendUserId ~ data", data)
        let resp = await data.json();
        // console.log("🚀 ~ file: UserReports.js ~ line 71 ~ sendUserId ~ resp", resp)
        setSelectedIdProjects(resp);
      };
      sendUserId();
    }
  }, [loading]);
  // console.log("selectedIdProjects..........584")
  // console.log(selectedIdProjects)

  // const prevValue = useridRef.current;
  //  console.log(prevValue)
  // const Get_userId = () => {
  //   getUserId().then((res) => setUserId(res));
  //   // console.log(userId)
  // }
  // useEffect(() => {
  //   (async () => {
  //     const userid = await ge tUserId();
  //     setUserId(userid);
  //     console.log(userId)
  //   })();
  // }, []);
  // console.log(userId)

  //getting and setting data in label value pair
  useMemo(() => {
    if (selectedIdProjects) {
      let ProData = selectedIdProjects.map(ele => {
        return {label: ele.project_name, value: ele.project_id};
      });

      setProList(ProData);
    }
  }, [selectedIdProjects, loading]);

  // console.log("ProList..........121")
  // console.log(ProList)
  // console.log(value)

  useMemo(() => {
    if (value) {
      const data = Get_Project_Team_Data(value);
      data
        .then(res => res.json())
        .then(result => {
          // console.log("result")
          // console.log(result)
          setProjectTeamList(result.data);
        });
    } else {
      return;
    }
  }, [value, loading]);
  // console.log(projectTeamList)

  const finalSubmitReport = async () => {
    try {
      const res = await fetch(
        `${process.env.API_URL}final-submit-report/${userData.company_id}/${value}/${userData._id}/${current_dat}/`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify(inputs),
        },
      );
      const data = await res.json();
      // console.log("🚀 ~ file: UserReports.js ~ line 154 ~ finalSubmitReport ~ data", data)
      if (data.status === 200) {
        setSubmitToast(true);
      }

      setTimeout(() => {
        setSubmitToast(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        margin: SIZES.radius,
      }}>
      <Dropdown
        style={{
          borderWidth: 1,
          borderColor: COLORS.majorelle_blue_800,
          paddingHorizontal: SIZES.radius,
          marginBottom: 5,
        }}
        placeholderStyle={{
          ...FONTS.h3,
          color: COLORS.darkGray,
        }}
        selectedTextStyle={{
          color: COLORS.darkGray,
          ...FONTS.h3,
        }}
        iconStyle={{
          height: 30,
        }}
        data={ProList}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={'Select Project'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setProListIsFocus(true)}
        onBlur={() => setProListIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setProListIsFocus(false);
        }}
      />

      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl
            progressBackgroundColor="white"
            tintColor="red"
            refreshing={loading}
            onRefresh={loadMore}
          />
        }        
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        horizontal={false}>
        <View
          style={{
            flex: 1,
            borderColor: COLORS.majorelle_blue_700,
            borderWidth: 1,
            padding: SIZES.radius,
          }}>
          <ReportDateTimeHeader />
          <Divider
            style={{
              backgroundColor: COLORS.majorelle_blue_600,
              top: 5,
            }}
          />
          {value ? (
            <View>
              <View
                style={{
                  marginVertical: 5,
                }}>
                <Manpower
                  projectTeamList={projectTeamList}
                  ProList={ProList}
                  Main_drp_pro_value={value}
                  loading={loading}
                />
              </View>
              <View style={{ marginVertical: 5 }}>
              <Stock project_id={value} Main_drp_pro_value={value} loading={loading} />
            </View>
              {/* <View style={{ marginVertical: 5 }} Main_drp_pro_value={value}>
              <Quantity project_id={value} Main_drp_pro_value={value} loading={loading} />
            </View> */}
              {/* <View style={{ marginVertical: 5 }}>
              <Quality />
            </View> */}
              <View style={{ }}>
              <TAndP Main_drp_pro_value={value} loading={loading} />
            </View>

              {/* <TouchableOpacity
                style={{
                  marginTop: SIZES.body1 * 4,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: COLORS.majorelle_blue_900,
                  width: '45%',
                  padding: 10,
                  alignSelf: 'center',
                  // top: 0,
                  // left: 0,
                  // right: 0,
                  // bottom:0,
                  // position:'absolute',
                  borderRadius: 5,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                  elevation: 8,
                }}
                onPress={() => {
                  // handleDoneTask()
                  finalSubmitReport();
                  // navigation.navigate('ViewReport');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.report}
                    style={{
                      height: 24,
                      tintColor: 'white',
                      width: 24,
                    }}
                  />
                  <Text
                    style={{
                      ...FONTS.h4,
                      color: COLORS.white,
                      textTransform: 'uppercase',
                      left: 10,
                    }}>
                    Final Submit
                  </Text>
                </View>
              </TouchableOpacity> */}
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            backgroundColor: COLORS.majorelle_blue_900,
            marginVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            elevation: 3,
            borderRadius: 5,
          }}
          onPress={() => {
            // handleDoneTask()
            finalSubmitReport();
            // navigation.navigate('ViewReport');
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                ...FONTS.h4,
                color: COLORS.white,
                textTransform: 'capitalize',
              }}>
              Final Report Submit
            </Text>
          </View>
        </TouchableOpacity>

        <CustomToast
          isVisible={submitToast}
          onClose={() => setSubmitToast(false)}
          color={COLORS.green}
          title="Final Report Submission"
          message=" Report submitted Successfully..."
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default UserReports;
