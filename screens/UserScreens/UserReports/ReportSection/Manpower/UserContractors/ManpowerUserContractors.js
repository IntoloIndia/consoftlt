import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  View, Animated,
  Easing, Switch,
  Text, FlatList,
  StyleSheet, Image,
  ScrollView, Modal, Platform, UIManager, ToastAndroid,
  Pressable, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView,
  TouchableOpacity, LogBox, LayoutAnimation, ImageBackground, Keyboard
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from '@ui-kitten/components';
import { Dropdown } from 'react-native-element-dropdown';
// import Config from '../../../../../../config'
import { COLORS, FONTS, SIZES, dummyData, icons, images } from '../../../../../../constants'
import { FormInput, Drop, IconButton, CustomDropdown, TextButton, CustomToast, DeleteConfirmationToast } from '../../../../../../Components';
import { EditDeletebuttons, ManPowerProjectTeam } from '../../../../index.js'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Get_Contractor_Data, insert_new_category, get_new_category, insert_new_sub_category,
  get_new_sub_category, insert_manpower_report, get_manpower_report, delete_manpower_data,
  filter_new_category_by_cont_Id, edit_manpower_report_data, update_manpower_report
} from '../../../ReportApi.js'
import utils from '../../../../../../utils';
import styles from '../../../ReportStyle.js'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { Button } from 'react-native-paper';
import moment from 'moment';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}


const ManpowerUserContractors = ({ ProList, Main_drp_pro_value, loading }) => {

  // useEffect(() => {
  //   LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  // }, []);

  const { header, con_body, input, body_del, body_edit, body_del_btn, body_edit_btn, body_ed_de_view, cont_Project_list_drop } = styles
  //getting post data into state
  const [postContData, setPostContData] = useState('')

  const [updateManpowerId, setUpdateManpowerId] = useState(null)
  //using in dropdown
  // const [proListIsFocus, setProListIsFocus] = useState(false)
  // const [value, setValue] = useState(null);

  const [active, setactive] = useState(null)
  const [Report_list, setReport_list] = useState('')
  //main contractor collapse


  const animation = useRef(new Animated.Value(0)).current;
  const scale = animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });

  const [con_item_id, setcon_item_id] = useState(null)
  const [conTeamTabCollapse, setConTeamTabCollapse] = useState(false)

  const [deleteConStatus, setDeleteConStatus] = useState(false)
  const [manpowerPostStatus, setManpowerPostStatus] = useState('')
  const [manpowerUpdateStatus, setManpowerUpdateStatus] = useState('')

  const [manpowerReportData, setManpowerReportData] = useState('')


  const [removeAddManpowerOnEdit, setRemoveAddManpowerOnEdit] = useState(false)
  //create contractor  model section
  const [ConReportModal, setConReportModal] = useState(false);
  const [contractorId, setContractorId] = useState(" ")
  const [addConMemberModal, setAddConMemberReportModal] = useState(false);
  const [addCatetoryModal, setAddCategoryModal] = useState(false)




  const [categName, setCategName] = useState('')


  const [membername, setMemberName] = useState('')
  const [memberCount, setMemberCount] = useState('')
  const [memberErrorMsg, setMemberErrorMsg] = useState('')
  const [memberCountErrorMsg, setMemberCountErrorMsg] = useState('')

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  //for post status

  const [saveNewCategoryStatus, setSaveNewCategoryStatus] = useState(false)


  // const [reportShowHide, setReportShowHide] = useState(false)

  // add contractor name
  const [ContractorName, setContractorName] = useState('');
  const [ContError, setContError] = useState('');

  //add contractor phone no
  const [ContractorPhone, setContractorPhone] = useState('');
  const [ContractorPhoneError, setContractorPhoneError] = useState('');

  const [getNewCategory, setGetNewCategory] = useState([])
  const [filterNewCategory, setFilterNewCategory] = useState([])

  // const [editManpowerReport, setEditManpowerReport] = useState('')
  const [editManpowerReport, setEditManpowerReport] = useState('')
  // const [first, setfirst] = useState('')
  // const [getNewSubCategory, setGetNewSubCategory] = useState([])

  const current_dat = moment().format("YYYY%2FMM%2FDD")
  const CONST_FIELD = {
    MANPOWER: 'Manpower',
    STOCK: 'Stock',
    QUANTITY: 'Quantity',
    QUALITY: 'Quality',
    TANDP: 'Tandp'
  }

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

  const validateFields = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
      25,
      10
    );
  }


  //defining functions for all

  const companydata = useSelector(state => state.user);
  //works on button click
  function Insert_Contractor_data() {
    const data = {
      company_id: companydata.company_id,
      contractor_name: ContractorName,
      phone_no: ContractorPhone,
      project_id: Main_drp_pro_value
    }

    data.contractor_name == '' ?
      validateFields('Contractor Field required!') :
      data.phone_no == '' ?
        validateFields('Phone number required!') :
        null



    fetch(`${process.env.API_URL}contractor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then(data => {

        setPostContData(data)
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

      })

  }
  // console.log("company...................", companydata.company_id)
  // console.log("project...................", Main_drp_pro_value)
  // console.log("contra...................", contractorId)


  const deleteContReportButton = async (id) => {
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
      const data = Get_Contractor_Data(Main_drp_pro_value)
      data.then(res => res.json())
        .then(result => {
          setReport_list(result)
        })
    }
  }

  //getting contractor data functions
  useMemo(() => {
    getContractorName();
  }, [postContData, Main_drp_pro_value, deleteConStatus, loading])

  // for new category
  const SaveNewCategory = async () => {
    let isMount = true;
    const data = {
      company_id: companydata.company_id,
      project_id: Main_drp_pro_value,
      contractor_id: contractorId,
      manpower_category: categName
    }

    const res = await insert_new_category(data);
    if (isMount == true && res.status == '200') {
      setSubmitToast(true)
      setSaveNewCategoryStatus(res.status);
      filterCategoryByContId(contractorId);
      setTimeout(() => {
        setAddCategoryModal(false);
      }, 800);

    }
    return () => { isMount = false }
  }

  function postData() {
    let manpowerCategories = [];
    filterNewCategory.map((ele, key) => manpowerCategories.push({ manpower_category_id: ele._id, manpower_member: ele.manpower_member }))
    return manpowerCategories;
  }


  const editManpowerReportBtn = async (id) => {
    setRemoveAddManpowerOnEdit(true);

    if (id) {
      const data = edit_manpower_report_data(id, current_dat);
      data.then(res => res.json())
        .then(result => {

          setEditManpowerReport(result);
          if (result.data != undefined && filterNewCategory) {
            setUpdateManpowerId(result.data._id);
            if (result.data.contractor_id === id) {
              setFilterNewCategory([
                ...result.data.manpowerCategories.map((ele) => {
                  return {
                    manpower_category: ele.manpower_category_name,
                    manpower_member: ele.manpower_member.toString()
                  }
                })
              ])
            }
          }
          else {
            setFilterNewCategory([])
            setAddConMemberReportModal(true);
          }
          // alert(id)
          setAddConMemberReportModal(true);
        })

    }
  }



  //for inserting manpower data
  const InsertManpowerReport = async () => {
    const temp_data = postData();

    let data = {
      company_id: companydata.company_id,
      project_id: Main_drp_pro_value,
      user_id: companydata._id,
      contractor_id: contractorId,
      manpowerCategories: temp_data
    }

    let res = await insert_manpower_report(data, CONST_FIELD);

    if (res.status == 200) {
      setTimeout(() => {
        GetManpowerData();
        setManpowerPostStatus(res);
        setAddConMemberReportModal(false);
        setSubmitToast(true)
      }, 100);
      setTimeout(() => {
        setSubmitToast(false);
      }, 200);
    }

  }

  function postUpdateData() {
    let manpowerCategories = [];
    if (editManpowerReport.data != undefined) {
      filterNewCategory.map((list, idx) => {
        editManpowerReport.data.manpowerCategories.map((ele, key) => {
          if (idx == key) {
            manpowerCategories.push({ manpower_category_id: ele.manpower_category_id, manpower_member: list.manpower_member })
          }
        })
      })
      return manpowerCategories;
    }
  }


  const updateManpowerReport = async () => {
    // console.log("🚀 ~ file: ManpowerUserContractors.js ~ line 286 ~ updateManpowerReport ~ update_id", filterNewCategory)
    let temp_data = postUpdateData();
    // console.log("🚀 ~ file: ManpowerUserContractors.js ~ line 319 ~ updateManpowerReport ~ temp_data", temp_data)

    let data = {
      manpowerCategories: temp_data
    }
    let res = await update_manpower_report(updateManpowerId, data);
    setManpowerUpdateStatus(res)
    if (res.status == '200') {

      setUpdateToast(true);
      setTimeout(() => {
        setAddConMemberReportModal(false);
        setUpdateToast(false);
      }, 900);
    }
  }


  async function GetManpowerData() {
    if (Main_drp_pro_value || manpowerPostStatus || loading || manpowerUpdateStatus) {
      const data = await get_manpower_report(Main_drp_pro_value, companydata._id, current_dat)
      if (data.status == 200) {
        setManpowerReportData(data.data);
      }
    }

  }

  useEffect(() => {
    GetManpowerData();
  }, [manpowerPostStatus, Main_drp_pro_value, conTeamTabCollapse, loading, manpowerUpdateStatus])


  const filterCategoryByContId = async (cont_id) => {

    // console.log("🚀 ~ file: ManpowerUserContractors.js ~ line 396 ~ cont_id", cont_id)

    if (cont_id) {
      const get_data = await filter_new_category_by_cont_Id(companydata.company_id, Main_drp_pro_value, cont_id);
      const get_temp = await get_data.json();
      let temp = get_temp.data.map((ele, key) => ({
        ...ele, manpower_member: ''
      }))
      setFilterNewCategory(temp)
    }
    // setRemoveAddManpowerOnEdit(true);
    setAddConMemberReportModal(true);
  }



  const GetNewCategories = async () => {
    const get_data = await get_new_category(companydata.company_id, Main_drp_pro_value);
    const get_temp = await get_data.json();
    let temp = get_temp.data.map((ele, key) => ({
      ...ele, manpower_member: ''
    }))
    setGetNewCategory(temp)
  }





  useMemo(() => {
    let isMount = true;
    if (isMount) {
      GetNewCategories();
    }
    return () => { isMount = false }
  }, [companydata.company_id, saveNewCategoryStatus, loading])




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

      <Modal
        animationType="fade"
        transparent={true}
        visible={ConReportModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.transparentBlack7,
          }}>
          <View
            style={{
              width: '90%',
              padding: SIZES.padding,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.white,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontSize: 20, color: COLORS.darkGray }}>
                Contractors
              </Text>
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
                onPress={() => setConReportModal(false)}
              />
            </View>
            <ScrollView scrollEnabled={false} nestedScrollEnabled={false}>
              {/* <Dropdown
                style={[
                  cont_Project_list_drop,
                  proListIsFocus && {
                    borderColor: COLORS.lightblue_600,
                  },

                ]}
                placeholderStyle={{ fontSize: 16, color: COLORS.darkGray, left: 5 }
                }
                selectedTextStyle={{ color: COLORS.gray, }
                }

                containerStyle={{ width: 320, borderRadius: 5 }}
                inputSearchStyle={{ color: COLORS.gray, height: 40, borderRadius: 5, padding: -5 }}
                iconStyle={{
                  height: 28
                  // fontSize: 16, 
                }}
                data={ProList}
                search
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder={'Select Project'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() =>
                  setProListIsFocus(true)
                }
                onBlur={() =>
                  setProListIsFocus(false)
                }
                onChange={item => {
                  setValue(item.value);
                  setProListIsFocus(false);
                }}

              /> */}

              <FormInput
                placeholder="Contractor Name"
                onChange={value => {

                  utils.validateText(value, setContError);
                  setContractorName(value);
                }}
                value={ContractorName}
                errorMsg={ContError}
                appendComponent={
                  <View style={{ justifyContent: 'center' }}>
                    <Image
                      source={
                        ContractorName == '' || (ContractorName != '' && ContError == '')
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
                label="Phone no."
                keyboardType="numeric"
                autoCompleteType="cc-number"
                value={ContractorPhone}
                onChange={value => {
                  utils.validateNumber(value, setContractorPhoneError);
                  setContractorPhone(value);
                }}
                errorMsg={ContractorPhoneError}
                appendComponent={
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      source={ContractorPhone == '' ||
                        (ContractorPhone != '' && ContractorPhoneError == '')
                        ? icons.correct :
                        icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: ContractorPhone == '' ? COLORS.gray :
                          (ContractorPhone !== '' && ContractorPhoneError == '')
                            ? COLORS.green :
                            COLORS.red
                      }}
                    />

                  </View>
                }
              />

            </ScrollView>
            <TextButton
              label="Submit"
              // disabled={isEnableSubmit() ? false : true}
              buttonContainerStyle={{
                height: 55,
                alignItems: 'center',
                marginTop: SIZES.padding * 2,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.lightblue_700

              }}
              onPress={() => {
                Insert_Contractor_data()
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


  }
  const __memberCount = (manpower_memb, index) => {

    const _memberInputs = [...filterNewCategory];
    _memberInputs[index].manpower_member = manpower_memb;
    _memberInputs[index].key = index;
    setFilterNewCategory(_memberInputs);
  }

  const deleteMemberHandler = (index) => {
    const _memberInputs = [...filterNewCategory]
    _memberInputs.splice(index, 1);
    setFilterNewCategory(_memberInputs);
  }


  function add_category_modal() {
    return (
      <View>
        <Modal transparent={false} visible={addCatetoryModal} animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000aa',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: 80,
                padding: 20,
                borderRadius: 20,
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{ ...FONTS.h2, color: COLORS.darkGray }}>Add New Category</Text>
                <Pressable onPress={() => setAddCategoryModal(false)}>
                  <AntDesign name="close" size={30} color={COLORS.black} />
                </Pressable>
              </View>
              <View style={{ marginTop: 20 }}>
                <FormInput
                  label="Category Name"
                  onChange={text => {
                    setCategName(text);
                  }}
                />
              </View>
              <View>
                <TextButton
                  label="save"
                  buttonContainerStyle={{
                    height: 45,
                    borderRadius: SIZES.radius,
                    marginTop: SIZES.padding,
                  }}
                  onPress={() => {
                    SaveNewCategory();
                  }}
                />
              </View>
              {/* <Toast config={showToastItem} /> */}
            </View>
          </View>
        </Modal>
      </View>
    )
  }



  function ShowCategory() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={
          removeAddManpowerOnEdit || filterNewCategory.length > 0 ? {
            maxHeight: 370,
            marginVertical: SIZES.padding * 2,
            borderRadius: 2,
            elevation: 2,
            borderColor: COLORS.lightblue_100,
            paddingBottom: SIZES.base * 2,
          } : null
        }

      >
        {
          filterNewCategory.length > 0 ? filterNewCategory.map((memberInput, index) => {

            return (
              <View
                style={{
                  alignItems: "stretch",
                  margin: 1
                }}
                key={index}>
                <View key={index}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginHorizontal: SIZES.base,
                    paddingBottom: SIZES.base
                  }}>

                  <FormInput
                    placeholder="Name"
                    containerStyle={{
                      width: 180,

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
                      <View style={{ justifyContent: 'center' }}>
                        <Image
                          source={
                            membername == '' || (membername != '' && memberErrorMsg == '')
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
                      width: 85,

                    }}
                    inputStyle={{ height: 40, width: 30, marginLeft: -12 }}
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
                      <View style={{
                        justifyContent: 'center',
                        // backgroundColor:"red",
                        marginLeft: -SIZES.padding,
                        // left: 22

                      }}>
                        <Image
                          source={
                            memberCount == '' || (memberCount != '' && memberCountErrorMsg == '')
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

                  <View style={{
                    alignSelf: "flex-end",
                    paddingBottom: SIZES.base * 0.8
                  }}>
                    <TouchableOpacity
                      style={{
                        alignSelf: "center",
                        elevation: 8,
                        // borderWidth: 1,
                        borderColor: COLORS.transparent
                      }}
                      onPress={() => {
                        deleteMemberHandler(index)
                      }
                      }>
                      <Image
                        source={icons.delete_icon}
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: COLORS.red,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>)
          })
            : (
              <View style={{
                flex: 1,
                alignSelf: "center",
                marginVertical: SIZES.body1,
              }}>
                {/* {removeAddManpowerOnEdit ? <Text style={{ ...FONTS.h2, color: COLORS.darkGray }}>Currently, no category to Update!!</Text> : null} */}
                <Text style={{ ...FONTS.h2, color: COLORS.darkGray }}>Currently, no category to show or update!!</Text>
              </View>
            )


        }
      </ScrollView>
    )
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
            backgroundColor: COLORS.transparentBlack7,
          }}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 85,
              right: 0,
              width: '100%',
              height: '90%',
              padding: SIZES.padding,
              borderTopRightRadius: SIZES.radius,
              borderTopLeftRadius: SIZES.radius,
              backgroundColor: COLORS.white,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
              <Text style={{ ...FONTS.h2, color: COLORS.darkGray }}>
                Add Category and Members
              </Text>
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
                onPress={() => {
                  setRemoveAddManpowerOnEdit(false);
                  setAddConMemberReportModal(false);
                }}
              />
            </View>
            <View style={{
              justifyContent: "space-between"
            }}>
              {!removeAddManpowerOnEdit ? <TextButton
                label="Add Category"
                buttonContainerStyle={{
                  height: 33,
                  alignItems: 'center',
                  width: 110,
                  paddingHorizontal: 0,
                  marginTop: SIZES.padding,
                  borderRadius: SIZES.radius * 0.5,
                  backgroundColor: COLORS.lightblue_700
                }}
                onPress={() => {
                  setAddCategoryModal(true)
                }}
              /> : null}
            </View>
            <View style={{ flex: 1 }}>
              {
                ShowCategory()
              }
            </View>
            <View
              style={{
                alignItems: "center",
                paddingBottom: 12
                // height: "10%"                
              }}>
              {removeAddManpowerOnEdit ?
                <TextButton
                  label="Update"
                  buttonContainerStyle={{
                    height: 55,
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.lightblue_700
                  }}
                  onPress={() => {
                    updateManpowerReport(updateManpowerId)
                  }}
                /> :
                <TextButton
                  label="Submit"
                  buttonContainerStyle={{
                    height: 55,
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.lightblue_700
                  }}
                  onPress={() => {
                    setRemoveAddManpowerOnEdit(false)
                    InsertManpowerReport()
                  }
                  }
                />

              }
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
        style={{
          borderRadius: SIZES.radius * 0.2,
          justifyContent: "center",
          flexDirection: "row",
          paddingHorizontal: 2,

        }}
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 300,
            create:
            {
              type: LayoutAnimation.Types.easeInEaseOut,
              property: LayoutAnimation.Properties.opacity,
            },
            update:
            {
              type: LayoutAnimation.Types.easeInEaseOut,
            }
          });
          setConReportModal(true)
        }}>
        <View style={{
          alignSelf: "center"
        }}>
          <Ionicons
            name='person-add'
            size={22}
            color={COLORS.lightblue_400}
          />
        </View>
      </TouchableOpacity>
    )
  }


  const sub_body_section = (item, index) => {

    return <View
      style={{
        flex: 1,
        flexDirection: "row",
        width: SIZES.width * 0.7,
        maxHeight: 300,
        alignSelf: "center",
        paddingLeft: SIZES.base,
        position: "relative",
        paddingBottom: 10,
      }}
      key={index}
    >
      {
        (manpowerReportData.length > 0) ?
          <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ left: -2, paddingBottom: 15 }} >
            {
              <View>
                <View>
                  {manpowerReportData.map((main_list, index) => {
                    if (item._id === main_list.contractor_id) {
                      return (
                        <View key={index} style={{}}>
                          {
                            main_list.manpowerCategories.map((sub_main_list, index1) => {
                              return (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around"
                                  }}
                                  key={index1}>
                                  <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%"
                                  }}>
                                    <View style={{ backgroundColor: COLORS.lightGray1, width: 1, position: "absolute", left: -3, top: 0, right: 0, bottom: 0 }}>
                                    </View>
                                    <View style={{ width: 50, paddingLeft: 18 }}>
                                      <Text style={{ color: COLORS.gray, ...FONTS.h5, textAlign: "center" }}>{index1 + 1}</Text>
                                    </View>
                                    <View style={{ width: 150 }}>
                                      <Text style={{ color: COLORS.blue, ...FONTS.h5 }}>{sub_main_list.manpower_category_name}</Text>
                                    </View>
                                    <View style={{ width: 120 }}>
                                      <Text style={{ color: COLORS.black, ...FONTS.h5 }}>{sub_main_list.manpower_member}</Text>
                                    </View>
                                  </View>
                                </View>
                              )
                            })
                          }
                        </View>)
                    }
                  }
                  )
                  }
                </View>
              </View>
            }
          </ScrollView>
          : null
      }
    </View>
  }





  const _body = (item, index) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: SIZES.width * 0.7,
          maxHeight: 310,
          alignSelf: "center",
          paddingLeft: SIZES.base,
          position: "relative",
          // paddingBottom: 10,
          elevation: 22,
          backgroundColor: COLORS.transparent
        }}
        key={index}
      >
        {
          sub_body_section(item, index)
        }
      </View>
    )
  }


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


  const Editdeletebutton = ({ edit_size, del_size, __id }) => {
    return (
      <>
        <View style={body_ed_de_view}>
          <View style={body_del_btn}>
            <TouchableOpacity
              onPress={() => editManpowerReportBtn(__id)}
            >
              <FontAwesome name='edit' color={COLORS.blue} size={edit_size} />
            </TouchableOpacity>
          </View>
          <View style={body_edit_btn}>
            <TouchableOpacity
              onPress={() => deleteContReportButton(__id)}
            >
              <MaterialCommunityIcons name='delete' color={COLORS.red} size={del_size} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  }




  //flatlist head render funciton
  //collapse contractor 
  const _head = (item, index) => {

    LayoutAnimation.configureNext({
      duration: 300,
      create:
      {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update:
      {
        type: LayoutAnimation.Types.easeInEaseOut,
      }
    });
    const open = active == index
    return (
      <>
        <TouchableOpacity style={[header, {
          width: "100%",
          // width: SIZES.width * 0.70,
          justifyContent: "space-between",
          alignSelf: "center"
        }]} key={item._id} onPress={() => {
          toggleExpanded(item, index)
        }} >
          <View
            style={{
              width: SIZES.width * 0.7,
              justifyContent: "center",
            }}
            activeOpacity={1}>
            <Text style={[FONTS.body5, { color: COLORS.black, letterSpacing: 1, textAlign: "left" }]}>
              {item.contractor_name}
            </Text>
          </View>
          <View style={{ right: 68, top: 2 }}>
            <Pressable
              onPress={() => {
                setContractorId(item._id);
                filterCategoryByContId(item._id);
              }}
            >
              <MaterialIcons
                name="add-box"
                size={18}
                color={COLORS.lightblue_600}
              />
            </Pressable>
          </View>
          <View style={{
            justifyContent: "space-between",
            alignSelf: "center",
            alignItems: "center",
            left: -65
          }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Editdeletebutton edit_size={15} del_size={18} __id={item._id} />
            </View>
          </View>
        </TouchableOpacity>
        <View style={{
          borderBottomWidth: item._id == con_item_id ? 1 : 0,
          borderColor: item._id == con_item_id ? COLORS.lightblue_300 : null
        }}>
          {open && item._id == con_item_id ? _body(item, index) : null}
        </View>
      </>
    );
  }


  return (
    <View style={{ marginTop: 5 }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => setConTeamTabCollapse(!conTeamTabCollapse)}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: -22,
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderWidth: 1,
            width: SIZES.width * 0.72,
            backgroundColor: COLORS.lightblue_500,
            alignSelf: "center",
            borderRadius: 4,
            borderColor: COLORS.lightblue_300,
          }}>
          <View>
            <Text
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => setConTeamTabCollapse(!conTeamTabCollapse)} style={[FONTS.body4, { color: COLORS.white2 }]}>Contractors</Text>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center", marginLeft: SIZES.base * 0.5 }}>
            <TouchableOpacity
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                setConTeamTabCollapse(!conTeamTabCollapse)
              }}>
              <AntDesign name='caretdown' size={12} color={COLORS.white3} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Animated.View>
      <View
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
          right: SIZES.base,
          bottom: SIZES.base * 0.5
          // top: 0
        }}
      >
        {/* button section adding contractor */}
        {conTeamTabCollapse ? add_contractor() : null}
      </View>

      {/* getting data from api and display on screen */}
      {conTeamTabCollapse && Report_list.length > 0 ?
        (
          <View
            style={{
              marginBottom: Report_list.length > 0 ? -24 : 0,
              //  height: 270 
            }}
          >
            <ScrollView
              horizontal={false}
              contentContainerStyle={{ borderWidth: 1, width: '100%', height: '100%' }}>
              <FlatList
                data={Report_list ? Report_list : alert('Currently there are no contractors!!')}
                scrollEnabled={true}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  borderWidth: 1,
                  // paddingBottom: 235,
                  // paddingBottom: 235,
                  borderColor: COLORS.lightblue_300,
                  marginHorizontal: 42
                }}
                // maxHeight={268}
                maxHeight={200}
                nestedScrollEnabled={true}
                renderItem={({ item, index }) => _head(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>
          </View>
        ) :
        <View style={{
          backgroundColor: COLORS.lightblue_100,
          marginHorizontal: SIZES.h2 * 2,
          marginBottom: conTeamTabCollapse ? -24 : 0,
        }}>
          {conTeamTabCollapse ? <Text style={[FONTS.h4, { color: COLORS.gray, textAlign: "center", marginHorizontal: SIZES.body1 }]}>No Contractors right now!</Text> : null}
        </View>
      }
      {/* create contractor model */}
      {renderCreateContractorModal()}
      {/* create add member modal */}
      {createContractorMemberModal()}
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
      {add_category_modal()}

    </View>
  )
}


export default ManpowerUserContractors