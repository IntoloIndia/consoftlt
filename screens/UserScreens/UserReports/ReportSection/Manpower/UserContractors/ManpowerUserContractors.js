import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Animated,
  Easing,
  Switch,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Platform,
  UIManager,
  ToastAndroid,
  Pressable,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  LogBox,
  LayoutAnimation,
  ImageBackground,
  Keyboard,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Divider} from '@ui-kitten/components';
import {Dropdown} from 'react-native-element-dropdown';
// import Config from '../../../../../../config'
import {
  COLORS,
  FONTS,
  SIZES,
  dummyData,
  icons,
  images,
} from '../../../../../../constants';
import {
  FormInput,
  Drop,
  IconButton,
  CustomDropdown,
  TextButton,
  CustomToast,
  DeleteConfirmationToast,
} from '../../../../../../Components';
import {EditDeletebuttons, ManPowerProjectTeam} from '../../../../index.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Get_Contractor_Data,
  insert_new_category,
  get_new_category,
  insert_new_sub_category,
  get_new_sub_category,
  insert_manpower_report,
  get_manpower_report,
  delete_manpower_data,
  filter_new_category_by_cont_Id,
  edit_manpower_report_data,
  update_manpower_report,
} from '../../../ReportApi.js';
import utils from '../../../../../../utils';
import styles from '../../../ReportStyle.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {Button} from 'react-native-paper';
import moment from 'moment';
import {TextInput} from 'react-native-paper';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ManpowerUserContractors = ({ProList, Main_drp_pro_value, loading}) => {
  // useEffect(() => {
  //   LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  // }, []);

  const {
    header,
    con_body,
    input,
    body_del,
    body_edit,
    body_del_btn,
    body_edit_btn,
    body_ed_de_view,
    cont_Project_list_drop,
  } = styles;
  //getting post data into state
  const [postContData, setPostContData] = useState('');

  const [updateManpowerId, setUpdateManpowerId] = useState(null);
  //using in dropdown
  // const [proListIsFocus, setProListIsFocus] = useState(false)
  // const [value, setValue] = useState(null);

  const [active, setactive] = useState(null);
  const [Report_list, setReport_list] = useState('');
  //main contractor collapse

  const animation = useRef(new Animated.Value(0)).current;
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  const [con_item_id, setcon_item_id] = useState(null);
  const [conTeamTabCollapse, setConTeamTabCollapse] = useState(false);

  const [deleteConStatus, setDeleteConStatus] = useState(false);
  const [manpowerPostStatus, setManpowerPostStatus] = useState('');
  const [manpowerUpdateStatus, setManpowerUpdateStatus] = useState('');

  const [manpowerReportData, setManpowerReportData] = useState('');

  const [removeAddManpowerOnEdit, setRemoveAddManpowerOnEdit] = useState(false);
  //create contractor  model section
  const [ConReportModal, setConReportModal] = useState(false);
  const [contractorId, setContractorId] = useState(' ');
  const [addConMemberModal, setAddConMemberReportModal] = useState(false);
  const [addCatetoryModal, setAddCategoryModal] = useState(false);

  const [categName, setCategName] = useState('');

  const [membername, setMemberName] = useState('');
  const [memberCount, setMemberCount] = useState('');
  const [memberErrorMsg, setMemberErrorMsg] = useState('');
  const [memberCountErrorMsg, setMemberCountErrorMsg] = useState('');

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  //for post status

  const [saveNewCategoryStatus, setSaveNewCategoryStatus] = useState(false);

  // const [reportShowHide, setReportShowHide] = useState(false)

  // add contractor name
  const [ContractorName, setContractorName] = useState('');
  const [ContError, setContError] = useState('');

  //add contractor phone no
  const [ContractorPhone, setContractorPhone] = useState('');
  const [ContractorPhoneError, setContractorPhoneError] = useState('');

  const [getNewCategory, setGetNewCategory] = useState([]);
  const [filterNewCategory, setFilterNewCategory] = useState([]);

  // const [editManpowerReport, setEditManpowerReport] = useState('')
  const [editManpowerReport, setEditManpowerReport] = useState('');
  // const [first, setfirst] = useState('')
  // const [getNewSubCategory, setGetNewSubCategory] = useState([])

  const current_dat = moment().format('YYYY%2FMM%2FDD');
  const CONST_FIELD = {
    MANPOWER: 'Manpower',
    STOCK: 'Stock',
    QUANTITY: 'Quantity',
    QUALITY: 'Quality',
    TANDP: 'Tandp',
  };

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 0.2,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    setTimeout(() => {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }, 150);
  };

  const validateFields = message => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
      25,
      10,
    );
  };

  //defining functions for all

  const companydata = useSelector(state => state.user);
  //works on button click
  function Insert_Contractor_data() {
    const data = {
      company_id: companydata.company_id,
      contractor_name: ContractorName,
      phone_no: ContractorPhone,
      project_id: Main_drp_pro_value,
    };

    data.contractor_name == ''
      ? validateFields('Contractor Field required!')
      : data.phone_no == ''
      ? validateFields('Phone number required!')
      : null;

    fetch(`${process.env.API_URL}contractor`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        setPostContData(data);
        if (data.status == '200') {
          setContractorName('');
          setContractorPhone('');
          // GetNewSubCategories();
          setSubmitToast(true);
          setTimeout(() => {
            setConReportModal(false);
          }, 500);

          // Get_Contractor_Data()
        }
      });
  }
  // console.log("company...................", companydata.company_id)
  // console.log("project...................", Main_drp_pro_value)
  // console.log("contra...................", contractorId)

  const deleteContReportButton = async id => {
    // const res = await delete_manpower_data(id);
    // if (res.status == 200) {
    //   setDeleteConStatus(true);
    //   setDeleteToast(true);
    //   getContractorName();
    //   // setTimeout(() => {
    //   //   setDeleteConfirm(false);
    //   // }, 300);
    // }
  };

  // console.log("🚀 ~ file: ManpowerUserContractors.js ~ line 165 ~ getContractorName ~ Main_drp_pro_value", Main_drp_pro_value)
  function getContractorName() {
    if (Main_drp_pro_value || postContData || deleteConStatus) {
      const data = Get_Contractor_Data(Main_drp_pro_value);
      data
        .then(res => res.json())
        .then(result => {
          setReport_list(result);
        });
    }
  }

  //getting contractor data functions
  useMemo(() => {
    getContractorName();
  }, [postContData, Main_drp_pro_value, deleteConStatus, loading]);

  // for new category
  const SaveNewCategory = async () => {
    let isMount = true;
    const data = {
      company_id: companydata.company_id,
      project_id: Main_drp_pro_value,
      contractor_id: contractorId,
      manpower_category: categName,
    };

    const res = await insert_new_category(data);
    if (isMount == true && res.status == '200') {
      setSubmitToast(true);
      setSaveNewCategoryStatus(res.status);
      filterCategoryByContId(contractorId);
      setTimeout(() => {
        setAddCategoryModal(false);
      }, 800);
    }
    return () => {
      isMount = false;
    };
  };

  function postData() {
    let manpowerCategories = [];
    filterNewCategory.map((ele, key) =>
      manpowerCategories.push({
        manpower_category_id: ele._id,
        manpower_member: ele.manpower_member,
      }),
    );
    return manpowerCategories;
  }

  const editManpowerReportBtn = async id => {
    setRemoveAddManpowerOnEdit(true);

    if (id) {
      const data = edit_manpower_report_data(id, current_dat);
      data
        .then(res => res.json())
        .then(result => {
          setEditManpowerReport(result);
          if (result.data != undefined && filterNewCategory) {
            setUpdateManpowerId(result.data._id);
            if (result.data.contractor_id === id) {
              setFilterNewCategory([
                ...result.data.manpowerCategories.map(ele => {
                  return {
                    manpower_category: ele.manpower_category_name,
                    manpower_member: ele.manpower_member.toString(),
                  };
                }),
              ]);
            }
          } else {
            setFilterNewCategory([]);
            setAddConMemberReportModal(true);
          }
          // alert(id)
          setAddConMemberReportModal(true);
        });
    }
  };

  //for inserting manpower data
  const InsertManpowerReport = async () => {
    const temp_data = postData();

    let data = {
      company_id: companydata.company_id,
      project_id: Main_drp_pro_value,
      user_id: companydata._id,
      contractor_id: contractorId,
      manpowerCategories: temp_data,
    };

    let res = await insert_manpower_report(data, CONST_FIELD);

    if (res.status == 200) {
      setTimeout(() => {
        GetManpowerData();
        setManpowerPostStatus(res);
        setAddConMemberReportModal(false);
        setSubmitToast(true);
      }, 100);
      setTimeout(() => {
        setSubmitToast(false);
      }, 1000);
    }
  };

  function postUpdateData() {
    let manpowerCategories = [];
    if (editManpowerReport.data != undefined) {
      filterNewCategory.map((list, idx) => {
        editManpowerReport.data.manpowerCategories.map((ele, key) => {
          if (idx == key) {
            manpowerCategories.push({
              manpower_category_id: ele.manpower_category_id,
              manpower_member: list.manpower_member,
            });
          }
        });
      });
      return manpowerCategories;
    }
  }

  const updateManpowerReport = async () => {
    // console.log("🚀 ~ file: ManpowerUserContractors.js ~ line 286 ~ updateManpowerReport ~ update_id", filterNewCategory)
    let temp_data = postUpdateData();
    // console.log("🚀 ~ file: ManpowerUserContractors.js ~ line 319 ~ updateManpowerReport ~ temp_data", temp_data)

    let data = {
      manpowerCategories: temp_data,
    };
    let res = await update_manpower_report(updateManpowerId, data);
    setManpowerUpdateStatus(res);
    if (res.status == '200') {
      setUpdateToast(true);
      setTimeout(() => {
        setAddConMemberReportModal(false);
        setUpdateToast(false);
      }, 1000);
    }
  };

  async function GetManpowerData() {
    if (
      Main_drp_pro_value ||
      manpowerPostStatus ||
      loading ||
      manpowerUpdateStatus
    ) {
      const data = await get_manpower_report(
        Main_drp_pro_value,
        companydata._id,
        current_dat,
      );
      if (data.status == 200) {
        setManpowerReportData(data.data);
      }
    }
  }

  useEffect(() => {
    GetManpowerData();
  }, [
    manpowerPostStatus,
    Main_drp_pro_value,
    conTeamTabCollapse,
    loading,
    manpowerUpdateStatus,
  ]);

  const filterCategoryByContId = async cont_id => {
    // console.log("🚀 ~ file: ManpowerUserContractors.js ~ line 396 ~ cont_id", cont_id)

    if (cont_id) {
      const get_data = await filter_new_category_by_cont_Id(
        companydata.company_id,
        Main_drp_pro_value,
        cont_id,
      );
      const get_temp = await get_data.json();
      let temp = get_temp.data.map((ele, key) => ({
        ...ele,
        manpower_member: '',
      }));
      setFilterNewCategory(temp);
    }
    // setRemoveAddManpowerOnEdit(true);
    setAddConMemberReportModal(true);
  };

  const GetNewCategories = async () => {
    const get_data = await get_new_category(
      companydata.company_id,
      Main_drp_pro_value,
    );
    const get_temp = await get_data.json();
    let temp = get_temp.data.map((ele, key) => ({
      ...ele,
      manpower_member: '',
    }));
    setGetNewCategory(temp);
  };

  useMemo(() => {
    let isMount = true;
    if (isMount) {
      GetNewCategories();
    }
    return () => {
      isMount = false;
    };
  }, [companydata.company_id, saveNewCategoryStatus, loading]);

  //for validation
  // function isEnableSubmit() {
  //   return (
  //     ContractorName != '' &&
  //     ContError == '' &&
  //     ContractorPhone != '' &&
  //     ContractorPhoneError == ''
  //   );
  // }

  //create contractor model
  function renderCreateContractorModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={ConReportModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.transparentBlack6,
          }}>
          <View
            style={{
              position: 'absolute',
              width: '95%',
              padding: SIZES.padding,
              borderRadius: 5,
              backgroundColor: COLORS.white,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 25, color: COLORS.darkGray}}>
                Add New Contractors
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setConReportModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: COLORS.rose_600,
                    }}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>

            <ScrollView scrollEnabled={false} nestedScrollEnabled={false}>
              <FormInput
                label="Contractor name"
                placeholder="Contractor Name"
                onChange={value => {
                  utils.validateText(value, setContError);
                  setContractorName(value);
                }}
                value={ContractorName}
                errorMsg={ContError}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        ContractorName == '' ||
                        (ContractorName != '' && ContError == '')
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          ContractorName == ''
                            ? COLORS.gray
                            : ContractorName != '' && ContError == ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <FormInput
                label="Mobile no"
                placeholder="Mobile No"
                keyboardType="numeric"
                autoCompleteType="cc-number"
                value={ContractorPhone}
                onChange={value => {
                  utils.validateNumber(value, setContractorPhoneError);
                  setContractorPhone(value);
                }}
                errorMsg={ContractorPhoneError}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        ContractorPhone == '' ||
                        (ContractorPhone != '' && ContractorPhoneError == '')
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          ContractorPhone == ''
                            ? COLORS.gray
                            : ContractorPhone !== '' &&
                              ContractorPhoneError == ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
            </ScrollView>
            <TextButton
              label="Submit"
              buttonContainerStyle={{
                height: 45,
                alignItems: 'center',
                marginTop: SIZES.padding * 1.5,
                borderRadius: SIZES.radius,
              }}
              onPress={() => {
                Insert_Contractor_data();
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  const __memberName = (text, index) => {
    const _memberInputs = [...filterNewCategory];
    _memberInputs[index].manpower_category = text;
    _memberInputs[index].key = index;
    setFilterNewCategory(_memberInputs);
  };
  const __memberCount = (manpower_memb, index) => {
    const _memberInputs = [...filterNewCategory];
    _memberInputs[index].manpower_member = manpower_memb;
    _memberInputs[index].key = index;
    setFilterNewCategory(_memberInputs);
  };

  const deleteMemberHandler = index => {
    const _memberInputs = [...filterNewCategory];
    _memberInputs.splice(index, 1);
    setFilterNewCategory(_memberInputs);
  };

  function add_category_modal() {
    return (
      <Modal
        transparent={true}
        visible={addCatetoryModal}
        animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.transparentBlack7,
          }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 5,
              width: '95%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 25, color: COLORS.darkGray}}>
                Add new category
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setAddCategoryModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: COLORS.rose_600,
                    }}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>

            <View>
              <FormInput
                label="Category name"
                placeholder="Category name"
                onChange={text => {
                  setCategName(text);
                }}
              />
            </View>

            <View>
              <TextButton
                label="Submit"
                buttonContainerStyle={{
                  height: 45,
                  borderRadius: SIZES.radius,
                  marginTop: SIZES.padding * 1.5,
                }}
                onPress={() => {
                  SaveNewCategory();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function ShowCategory() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={
          removeAddManpowerOnEdit || filterNewCategory.length > 0
            ? {
                // maxHeight: 370,
                marginVertical: SIZES.padding,
                // borderRadius: 1,
                elevation: 1,
                // borderColor: COLORS.black,
                // paddingBottom: SIZES.radius,
              }
            : null
        }>
        {filterNewCategory.length > 0 ? (
          filterNewCategory.map((memberInput, index) => {
            return (
              <View
                style={
                  {
                    // alignItems: 'stretch',
                    // margin: 1,
                  }
                }
                key={index}>
                <View
                  key={index}
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // marginHorizontal: SIZES.base,
                    // paddingBottom: SIZES.base,
                    // alignItems:'center',
                    paddingHorizontal: 12,
                  }}>
                  <FormInput
                    placeholder="Name"
                    containerStyle={{
                      width: '55%',
                      // width: 180,
                    }}
                    editable={false}
                    onChange={text => {
                      __memberName(text, index);
                      utils.validateText(text, setMemberErrorMsg);
                      setMemberName(text);
                    }}
                    value={memberInput.manpower_category}
                    // value={temp}
                    errorMsg={memberErrorMsg}
                    appendComponent={
                      <View style={{justifyContent: 'center'}}>
                        <Image
                          source={
                            membername == '' ||
                            (membername != '' && memberErrorMsg == '')
                              ? icons.correct
                              : icons.cancel
                          }
                          style={{
                            height: 20,
                            width: 20,
                            tintColor:
                              membername == ''
                                ? COLORS.gray
                                : membername != '' && memberErrorMsg == ''
                                ? COLORS.green
                                : COLORS.red,
                          }}
                        />
                      </View>
                    }
                  />

                  <FormInput
                    placeholder="Count"
                    containerStyle={{
                      width: '30%',
                      // width: 85,
                    }}
                    inputStyle={{height: 40, width: 30, marginLeft: -12}}
                    keyboardType="numeric"
                    onChange={text => {
                      __memberCount(text, index);
                      utils.validateNumber(text, setMemberCountErrorMsg);
                      setMemberCount(text);
                    }}
                    // value={manpower_memb}
                    value={memberInput.manpower_member}
                    errorMsg={memberCountErrorMsg}
                    appendComponent={
                      <View
                        style={{
                          justifyContent: 'center',
                          // backgroundColor:"red",
                          marginLeft: -SIZES.padding,
                          // left: 22
                        }}>
                        <Image
                          source={
                            memberCount == '' ||
                            (memberCount != '' && memberCountErrorMsg == '')
                              ? icons.correct
                              : icons.cancel
                          }
                          style={{
                            height: 20,
                            width: 20,
                            tintColor:
                              memberCount == ''
                                ? COLORS.gray
                                : memberCount != '' && memberCountErrorMsg == ''
                                ? COLORS.green
                                : COLORS.red,
                          }}
                        />
                      </View>
                    }
                  />

                  <TouchableOpacity
                    style={{
                      // alignSelf: 'center',
                      backgroundColor: COLORS.red,
                      padding: 8,
                      // height:20,
                      borderRadius: 5,
                      marginTop: 32,
                    }}
                    onPress={() => {
                      deleteMemberHandler(index);
                    }}>
                    <Image
                      source={icons.delete_icon}
                      style={{
                        width: 15,
                        height: 15,
                        tintColor: COLORS.white,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* {removeAddManpowerOnEdit ? <Text style={{ ...FONTS.h2, color: COLORS.darkGray }}>Currently, no category to Update!!</Text> : null} */}
            <Text style={{...FONTS.h3, color: COLORS.darkGray, marginTop: 100}}>
              Currently, no categories are available to show or update.
            </Text>
          </View>
        )}
      </ScrollView>
    );
  }

  //create contractor member modal
  function createContractorMemberModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={addConMemberModal}>
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
              padding: SIZES.padding,
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 22, color: COLORS.darkGray}}>
                Add category & members
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setRemoveAddManpowerOnEdit(false);
                    setAddConMemberReportModal(false);
                  }}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>

            <View
              style={{
                alignItems: 'flex-end',
              }}>
              {!removeAddManpowerOnEdit ? (
                <TextButton
                  label="Add New Category"
                  buttonContainerStyle={{
                    backgroundColor: COLORS.majorelle_blue_900,
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    borderRadius: 3,
                  }}
                  onPress={() => {
                    setAddCategoryModal(true);
                  }}
                />
              ) : null}
            </View>

            <View style={{flex: 1}}>{ShowCategory()}</View>
            <View
              style={{
                alignItems: 'center',
                paddingBottom: 12,
              }}>
              {removeAddManpowerOnEdit ? (
                <TextButton
                  label="Update"
                  buttonContainerStyle={{
                    height: 45,
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: SIZES.base,
                  }}
                  onPress={() => {
                    updateManpowerReport(updateManpowerId);
                  }}
                />
              ) : (
                <TextButton
                  label="Submit"
                  buttonContainerStyle={{
                    height: 45,
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: SIZES.base,
                  }}
                  onPress={() => {
                    setRemoveAddManpowerOnEdit(false);
                    InsertManpowerReport();
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  //button add contractor function
  const add_contractor = () => {
    return (
      <TouchableOpacity
        style={
          {
            // borderRadius: SIZES.radius * 0.2,
            // justifyContent: 'center',
            // flexDirection: 'row',
            // paddingHorizontal: 2,
          }
        }
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 300,
            create: {
              type: LayoutAnimation.Types.easeInEaseOut,
              property: LayoutAnimation.Properties.opacity,
            },
            update: {
              type: LayoutAnimation.Types.easeInEaseOut,
            },
          });
          setConReportModal(true);
        }}>
        <View
          style={{
            backgroundColor: COLORS.majorelle_blue_200,
            padding: 5,
            paddingHorizontal: 6,
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Ionicons
            name="person-add"
            size={16}
            color={COLORS.majorelle_blue_800}
          />
          <Text style={{fontSize: 12, color: COLORS.black, left: 3}}>
            Add New
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const sub_body_section = (item, index) => {
    return (
      <View
        style={
          {
            // flex: 1,
            // flexDirection: 'row',
            // width: SIZES.width * 0.7,
            // maxHeight: 300,
            // alignSelf: 'center',
            // paddingLeft: SIZES.base,
            // position: 'relative',
            // paddingBottom: 10,
          }
        }
        key={index}>
        {manpowerReportData.length > 0 ? (
          <ScrollView nestedScrollEnabled={true} contentContainerStyle={{}}>
            {
              <View>
                <View>
                  {manpowerReportData.map((main_list, index) => {
                    if (item._id === main_list.contractor_id) {
                      return (
                        <View key={index} style={{}}>
                          {main_list.manpowerCategories.map(
                            (sub_main_list, index1) => {
                              return (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}
                                  key={index1}>
                                  <View style={{flexDirection: 'row'}}>
                                    <Text
                                      style={{
                                        color: COLORS.black,
                                        ...FONTS.h5,
                                      }}>
                                      {index1 + 1}
                                      {'. '}
                                    </Text>
                                    <Text
                                      style={{
                                        color: COLORS.black,
                                        ...FONTS.h5,
                                        textTransform: 'capitalize',
                                      }}>
                                      {sub_main_list.manpower_category_name}
                                      {' - '}
                                    </Text>
                                  </View>
                                  <Text
                                    style={{
                                      color: COLORS.black,
                                      ...FONTS.h5,
                                    }}>
                                    {sub_main_list.manpower_member}
                                  </Text>
                                </View>
                              );
                            },
                          )}
                        </View>
                      );
                    }
                  })}
                </View>
              </View>
            }
          </ScrollView>
        ) : null}
      </View>
    );
  };

  const _body = (item, index) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          // width: SIZES.width * 0.7,
          // maxHeight: 310,
          // alignSelf: 'center',
          // paddingLeft: SIZES.base,
          // position: 'relative',
          // paddingBottom: 10,
          // elevation: 22,
          // backgroundColor: COLORS.transparent,
        }}
        key={index}>
        {sub_body_section(item, index)}
      </View>
    );
  };

  //contractor collapse button click code
  const toggleExpanded = (item, index) => {
    // editManpowerReport.map((sublist, index) => {
    //   const _memberInputs = [...editManpowerReport];
    //   _memberInputs[index].manpower_member = ' ';
    //   _memberInputs[index].key = index;
    //   setEditManpowerReport(_memberInputs);
    // });

    setcon_item_id(item._id);
    setactive(index == active ? null : index);
    // setactive(!active)
  };

  const Editdeletebutton = ({__id}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => editManpowerReportBtn(__id)}
          style={{
            backgroundColor: COLORS.green,
            padding: 5,
            right: 12,
            borderRadius: 3,
          }}>
          <Image
            source={icons.edit}
            style={{width: 12, height: 12, tintColor: COLORS.white}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteContReportButton(__id)}
          style={{backgroundColor: COLORS.red, padding: 5, borderRadius: 3}}>
          <Image
            source={icons.delete_icon}
            style={{width: 12, height: 12, tintColor: COLORS.white}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  //flatlist head render funciton
  //collapse contractor
  const _head = (item, index) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    const open = active == index;
    return (
      <View style={{marginVertical: 5}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: COLORS.majorelle_blue_100,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            key={item._id}
            onPress={() => {
              toggleExpanded(item, index);
            }}>
            <Text>
              {index + 1}
              {'. '}
            </Text>
            <Text
              style={{
                ...FONTS.h4,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
              }}>
              {item.contractor_name}
            </Text>
          </TouchableOpacity>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Pressable
              onPress={() => {
                setContractorId(item._id);
                filterCategoryByContId(item._id);
              }}
              style={{
                right: 20,
                backgroundColor: COLORS.majorelle_blue_800,
                padding: 5,
                borderRadius: 3,
              }}>
              <Image
                source={icons.plus}
                style={{width: 12, height: 12, tintColor: COLORS.white}}
              />
            </Pressable>

            <Editdeletebutton __id={item._id} />
          </View>
        </View>
        <View
          style={{
            marginTop: item._id == con_item_id ? 5 : null,
            backgroundColor: item._id == con_item_id ? COLORS.white : null,
            padding: item._id == con_item_id ? 5 : null,
            elevation: item._id == con_item_id ? 1 : null,
          }}>
          {open && item._id == con_item_id ? _body(item, index) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={{marginTop: 5}}>
      <Animated.View
        style={{
          transform: [{scale}],
          flexDirection: 'row',
          // justifyContent: 'space-between',
        }}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => setConTeamTabCollapse(!conTeamTabCollapse)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 3,
            paddingHorizontal: SIZES.radius,
            width: '60%',
            backgroundColor: COLORS.majorelle_blue_700,
          }}>
          <View>
            <Text
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => setConTeamTabCollapse(!conTeamTabCollapse)}
              style={{...FONTS.h4, color: COLORS.white}}>
              Contractors
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: SIZES.base * 0.5,
            }}>
            <TouchableOpacity
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                setConTeamTabCollapse(!conTeamTabCollapse);
              }}>
              <AntDesign name="caretdown" size={12} color={COLORS.white3} />
            </TouchableOpacity>
          </View>
        </Pressable>
        <View style={{left: 15}}>
          {conTeamTabCollapse ? add_contractor() : null}
        </View>
      </Animated.View>

      {/* getting data from api and display on screen */}
      {conTeamTabCollapse && Report_list.length > 0 ? (
        <View
          style={{
            marginBottom: Report_list.length > 0 ? -24 : 0,
            //  height: 270
          }}>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              borderWidth: 1,
              width: '100%',
              height: '100%',
            }}>
            <FlatList
              data={
                Report_list
                  ? Report_list
                  : alert('Currently there are no contractors!!')
              }
              scrollEnabled={true}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                // width: '70%',
                padding: 10,
                backgroundColor: COLORS.majorelle_blue_100,
              }}
              maxHeight={200}
              nestedScrollEnabled={true}
              renderItem={({item, index}) => _head(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: COLORS.lightblue_100,
            marginHorizontal: SIZES.h2 * 2,
            marginBottom: conTeamTabCollapse ? -24 : 0,
          }}>
          {conTeamTabCollapse ? (
            <Text
              style={[
                FONTS.h4,
                {
                  color: COLORS.gray,
                  textAlign: 'center',
                  marginHorizontal: SIZES.body1,
                },
              ]}>
              No Contractors right now!
            </Text>
          ) : null}
        </View>
      )}
      {/* create contractor model */}
      {renderCreateContractorModal()}
      {/* create add member modal */}
      {createContractorMemberModal()}
      {add_category_modal()}
      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Submit"
        message="Submitted Successfully..."
      />
      <CustomToast
        isVisible={updateToast}
        onClose={() => setUpdateToast(false)}
        color={COLORS.yellow_400}
        title="Update"
        message="Updated Successfully..."
      />
      <CustomToast
        isVisible={deleteToast}
        onClose={() => setDeleteToast(false)}
        color={COLORS.rose_600}
        title="Delete"
        message="Deleted Successfully..."
      />
      <DeleteConfirmationToast
        isVisible={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title={'Are You Sure?'}
        message={'Do you really want to delete?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => deleteContReportButton()}
      />
    </View>
  );
};

export default ManpowerUserContractors;
