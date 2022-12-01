import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import styles from '../UserReports/ReportStyle.js';
import {Dropdown} from 'react-native-element-dropdown';
import {Title, Divider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import utils from '../../../utils';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  get_stock_item_name,
  insert_voucher_details,
  get_pending_voucher_details,
  get_reverted_voucher,
  get_verified_voucher,
  edit_voucher_detail,
  update_voucher_detail,
  get_filter_voucher,
  get_projectBy_userId,
  get_all_unit,
} from '../UserReports/ReportApi.js';
import {
  COLORS,
  FONTS,
  SIZES,
  dummyData,
  icons,
  images,
  constants,
} from '../../../constants';
import {
  FormInput,
  TextButton,
  HeaderBar,
  CustomToast,
  DeleteConfirmationToast,
} from '../../../Components';

const UserEndVoucher = () => {
  const {cont_Project_list_drop, inputfromtwo} = styles;

  const [proListIsFocus, setProListIsFocus] = useState(false);
  const [voucherType, setVoucherType] = useState('');
  const [voucherCateg, setVoucherCateg] = useState('');
  const [voucherModal, setVoucherModal] = useState(false);
  const [testVal, settestVal] = useState('');
  const [itemList, setItemList] = useState([]);
  const [itemId, setItemId] = useState('');

  const [unitId, setUnitId] = useState('');

  const current_dat = moment().format('YYYY%2FMM%2FDD');

  let MyDateString = current_dat;

  const [qty, setQty] = useState('');
  const [qtyError, setQtyError] = useState('');

  const [remark, setRemark] = useState('');
  const [remarkError, setRemarkError] = useState('');

  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleNoError, setVehicleNoError] = useState('');

  const [location, setLocation] = useState('');
  const [locationError, setLocationError] = useState('');

  const [projectLists, setProjectLists] = useState([]);
  const [projectId, setProjectId] = useState('');

  const [pendingVoucher, setPendingVoucher] = useState([]);

  const [voucherId, setVoucherId] = useState('');

  const [voucherListModal, setVoucherListModal] = useState(false);
  const [allUnits, setAllUnits] = useState([]);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);
  const [toggleSubmitUpdate, setToggleSubmitUpdate] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  const [userOption, setUserOption] = useState('Purchase Request');
  const voucherArr = [
    {value: 'Purchase Request'},
    {value: 'Received'},
    {value: 'Purchased Return'},
    {value: 'Received Return'},
  ];

  const userCompanyData = useSelector(state => state.user);

  const getAllProjects = async () => {
      const resp =await get_projectBy_userId(userCompanyData._id);
      const temp=await resp.json();
      setProjectLists(temp);
  };

  useMemo(() => {
    getAllProjects();
  }, []);

  const getStockDataItems = async () => {
    try {
      const data = await get_stock_item_name();

      if (data.data.length >= 0) {
        setItemList(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    const resp = await get_all_unit();
    const data = await resp.json();
    setAllUnits(data);
    // setdata(data);
  };

  function RadioButton({data, onSelect}) {
    return (
      <View style={{flex: 0.7, justifyContent: 'space-evenly'}}>
        {voucherArr.map((item, i) => {
          return (
            <Pressable
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                onSelect(item.value);
                setUserOption(item.value);
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 2,
                  padding: 6,
                  width: 5,
                  borderColor: COLORS.gray,
                  backgroundColor:
                    item.value == userOption
                      ? COLORS.lightblue_500
                      : COLORS.white,
                }}></View>
              <View style={{left: 10}}>
                <Text style={{textAlign: 'center'}}> {item.value}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  }

  const getFilteredVoucher = async () => {
    try {
      const data = await get_filter_voucher(
        userCompanyData.company_id,
        MyDateString,
        userOption,
      );

      setPendingVoucher(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const editVoucher = async (
    id,
    project_id,
    voucher_type,
    _qty,
    item_id,
    unit_id,
    remark,
    location,
    vehicle_no,
  ) => {
    try {
      fetchData();
      getAllProjects();
      setVoucherId(id);
      setToggleSubmitUpdate(true);
      getStockDataItems();
      setVoucherModal(true);
      setVoucherType(voucher_type);
      setRemark(remark);
      setItemId(item_id);
      setQty(_qty);
      setUnitId(unit_id);
      setProjectId(project_id);
      setLocation(location);
      setVehicleNo(vehicle_no);

      if (voucher_type == constants.CHECK_VOUCHER_TYPE.PURCHASED_VOUCHER) {
        settestVal('1');
      } else if (
        voucher_type == constants.CHECK_VOUCHER_TYPE.RECEIVED_VOUCHER
      ) {
        settestVal('2');
      } else if (
        voucher_type == constants.CHECK_VOUCHER_TYPE.PURCHASED_RETURN_VOUCHER
      ) {
        settestVal('3');
      } else {
        settestVal('4');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateVoucherDetails = async () => {
    try {
      const data = {
        item_id: itemId,
        qty: qty,
        unit_id: unitId,
        voucher_type: voucherType,
        vehicle_no: vehicleNo,
        location: location,
        remark: remark,
      };
      setToggleSubmitUpdate(false);
      const temp = await update_voucher_detail(voucherId, data);
      if (temp.status == 200) {
        setUpdateToast(true);
        getFilteredVoucher();
      }
      setTimeout(() => {
        setVoucherModal(false);
        settestVal('');
        setVehicleNo('');
        setQty('');
        setRemark('');
        setUnitId('');
        setLocation('');
        setItemId('');
        setUpdateToast(false);
      }, 800);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFilteredVoucher();
  }, []);

  const saveVoucherDetails = async () => {
    const data = {
      voucher_type: voucherType,
      company_id: userCompanyData.company_id,
      project_id: projectId,
      item_id: itemId,
      unit_id: unitId,
      qty: qty,
      remark: remark,
      location: location,
      vehicle_no: vehicleNo,
    };

    const res = await insert_voucher_details(data);

    if (res.status == '200') {
      setSubmitToast(true);
      getFilteredVoucher();
      setTimeout(() => {
        setVoucherModal(false);
        settestVal('');
        setVehicleNo('');
        setQty('');
        setRemark('');
        setLocation('');
        setItemId('');
        setSubmitToast(false);
      }, 800);
    }
  };

  const addVoucherModal = () => {
    return (
      <Modal visible={voucherModal} transparent={false} animationType="slide">
        <View style={{flex: 1, backgroundColor: COLORS.transparentBlack1}}>
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
            <KeyboardAwareScrollView
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="handled"
              style={{flex: 1}}>
              <View
                style={{
                  height: '90%',
                  width: '100%',
                  backgroundColor: '#fff',
                  marginTop: 80,
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  padding: 22,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Title>{voucherType ? voucherType : 'Select Voucher'}</Title>
                  <Pressable
                    onPress={() => {
                      setVoucherModal(false);
                    }}>
                    <AntDesign name="close" size={24} color={COLORS.black} />
                  </Pressable>
                </View>
                <View style={{flex: 1}}>
                  <Dropdown
                    style={[
                      cont_Project_list_drop,
                      {
                        width: SIZES.width * 0.88,
                        // marginTop: 0,
                      },
                      proListIsFocus && {
                        borderColor: COLORS.gray2,
                      },
                    ]}
                    placeholderStyle={{fontSize: 16, color: COLORS.darkGray}}
                    selectedTextStyle={{color: COLORS.gray}}
                    containerStyle={{
                      width: SIZES.width * 0.88,
                      borderRadius: SIZES.base,
                      paddingTop: SIZES.base * 0.5,
                      marginTop: SIZES.base,
                    }}
                    iconStyle={{
                      height: 28,
                    }}
                    data={projectLists}
                    maxHeight={200}
                    labelField="project_name"
                    valueField="project_id"
                    placeholder={'Select Project'}
                    value={projectId}
                    // value={editVoucherDetail!=null?editVoucherDetail.item_id:projectId}
                    onFocus={() => setProListIsFocus(true)}
                    onBlur={() => setProListIsFocus(false)}
                    onChange={item => {
                      setProjectId(item.project_id);
                      setProListIsFocus(false);
                    }}
                  />
                  <Dropdown
                    style={[
                      cont_Project_list_drop,
                      {
                        width: SIZES.width * 0.88,
                      },
                      proListIsFocus && {
                        borderColor: COLORS.gray2,
                      },
                    ]}
                    placeholderStyle={{fontSize: 16, color: COLORS.darkGray}}
                    selectedTextStyle={{color: COLORS.gray}}
                    containerStyle={{
                      width: SIZES.width * 0.88,
                      borderRadius: SIZES.base,
                      paddingTop: SIZES.base * 0.5,
                      marginTop: SIZES.base,
                    }}
                    iconStyle={{
                      height: 28,
                    }}
                    data={constants.VOUCHER_TYPE}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    value={testVal}
                    placeholder={'Select Voucher Type'}
                    // onFocus={() => setProListIsFocus(true)}
                    // onBlur={() => setProListIsFocus(false)}
                    onChange={item => {
                      setVoucherType(item.label);
                      settestVal(item.value);
                      getStockDataItems();
                    }}
                  />
                  <Dropdown
                    style={[
                      cont_Project_list_drop,
                      {
                        width: SIZES.width * 0.88,
                      },
                      proListIsFocus && {
                        borderColor: COLORS.gray2,
                      },
                    ]}
                    placeholderStyle={{fontSize: 16, color: COLORS.darkGray}}
                    selectedTextStyle={{color: COLORS.gray}}
                    containerStyle={{
                      width: SIZES.width * 0.88,
                      borderRadius: SIZES.base,
                      paddingTop: SIZES.base * 0.5,
                      // marginTop: SIZES.base,
                    }}
                    iconStyle={{
                      height: 28,
                    }}
                    data={itemList}
                    maxHeight={200}
                    labelField="item_name"
                    valueField="_id"
                    value={itemId.toString()}
                    placeholder={'Select Item'}
                    // onFocus={() => setProListIsFocus(true)}
                    // onBlur={() => setProListIsFocus(false)}
                    onChange={item => {
                      setItemId(item._id);
                      // setVoucherModal(true);
                    }}
                  />
                  <Dropdown
                    style={[
                      cont_Project_list_drop,
                      {
                        width: SIZES.width * 0.88,
                        // marginTop: 0,
                      },
                      proListIsFocus && {
                        borderColor: COLORS.gray2,
                      },
                    ]}
                    placeholderStyle={{fontSize: 16, color: COLORS.darkGray}}
                    selectedTextStyle={{color: COLORS.gray}}
                    containerStyle={{
                      width: SIZES.width * 0.88,
                      borderRadius: SIZES.base,
                      paddingTop: SIZES.base * 0.5,
                      // marginTop: SIZES.base,
                    }}
                    iconStyle={{
                      height: 28,
                    }}
                    data={allUnits}
                    maxHeight={200}
                    labelField="unit_name"
                    valueField="_id"
                    value={unitId}
                    placeholder={'Select Unit'}
                    // onFocus={() => setProListIsFocus(true)}
                    // onBlur={() => setProListIsFocus(false)}
                    onChange={item => {
                      // setItemId(item._id);
                      setUnitId(item._id);
                      // setVoucherModal(true);
                    }}
                  />
                  <FormInput
                    placeholder="Qty"
                    onChange={value => {
                      utils.validateText(value, setQtyError);
                      setQty(value);
                    }}
                    value={qty.toString()}
                    keyboardType="numeric"
                    errorMsg={qtyError}
                    appendComponent={
                      <View style={{justifyContent: 'center'}}>
                        <Image
                          source={
                            qty == '' || (qty != '' && qtyError == '')
                              ? icons.correct
                              : icons.cancel
                          }
                          style={{
                            height: 20,
                            width: 20,
                            tintColor:
                              qty == ''
                                ? COLORS.gray
                                : qty != '' && qtyError == ''
                                ? COLORS.green
                                : COLORS.red,
                          }}
                        />
                      </View>
                    }
                  />
                  {constants.CHECK_VOUCHER_TYPE.RECEIVED_RETURN_VOUCHER ==
                  voucherType ? (
                    <FormInput
                      placeholder="Vehicle no"
                      onChange={value => {
                        utils.validateText(value, setVehicleNoError);
                        setVehicleNo(value);
                      }}
                      value={vehicleNo}
                      errorMsg={vehicleNoError}
                      appendComponent={
                        <View style={{justifyContent: 'center'}}>
                          <Image
                            source={
                              vehicleNo == '' ||
                              (vehicleNo != '' && vehicleNoError == '')
                                ? icons.correct
                                : icons.cancel
                            }
                            style={{
                              height: 20,
                              width: 20,
                              tintColor:
                                vehicleNo == ''
                                  ? COLORS.gray
                                  : vehicleNo != '' && vehicleNoError == ''
                                  ? COLORS.green
                                  : COLORS.red,
                            }}
                          />
                        </View>
                      }
                    />
                  ) : null}
                  {constants.CHECK_VOUCHER_TYPE.RECEIVED_VOUCHER ==
                  voucherType ? (
                    <FormInput
                      placeholder="Location"
                      onChange={value => {
                        utils.validateText(value, setLocationError);
                        setLocation(value);
                      }}
                      value={location}
                      errorMsg={locationError}
                      appendComponent={
                        <View style={{justifyContent: 'center'}}>
                          <Image
                            source={
                              location == '' ||
                              (location != '' && locationError == '')
                                ? icons.correct
                                : icons.cancel
                            }
                            style={{
                              height: 20,
                              width: 20,
                              tintColor:
                                location == ''
                                  ? COLORS.gray
                                  : location != '' && locationError == ''
                                  ? COLORS.green
                                  : COLORS.red,
                            }}
                          />
                        </View>
                      }
                    />
                  ) : null}
                  <FormInput
                    placeholder="Remark"
                    onChange={value => {
                      utils.validateText(value, setRemarkError);
                      setRemark(value);
                    }}
                    value={remark}
                    errorMsg={remarkError}
                    appendComponent={
                      <View style={{justifyContent: 'center'}}>
                        <Image
                          source={
                            remark == '' || (remark != '' && remarkError == '')
                              ? icons.correct
                              : icons.cancel
                          }
                          style={{
                            height: 20,
                            width: 20,
                            tintColor:
                              remark == ''
                                ? COLORS.gray
                                : remark != '' && remarkError == ''
                                ? COLORS.green
                                : COLORS.red,
                          }}
                        />
                      </View>
                    }
                  />
                </View>
                {toggleSubmitUpdate ? (
                  <TextButton
                    label="Update"
                    buttonContainerStyle={{
                      height: 50,
                      width: '100%',
                      alignItems: 'center',
                      borderRadius: SIZES.radius * 0.5,
                      backgroundColor: COLORS.lightblue_700,
                    }}
                    onPress={() => {
                      updateVoucherDetails();
                    }}
                  />
                ) : (
                  <TextButton
                    label="Submit"
                    buttonContainerStyle={{
                      height: 50,
                      width: '100%',
                      alignItems: 'center',
                      borderRadius: SIZES.radius * 0.5,
                      backgroundColor: COLORS.lightblue_700,
                    }}
                    onPress={() => {
                      saveVoucherDetails();
                    }}
                  />
                )}
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderPendingItem = ({item}) => (
    <View>
      {item.voucherData.map((ele, i) => {
        return (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              margin: 1,
              borderWidth: 0.05,
              marginVertical: SIZES.base * 0.5,
            }}>
            <View style={{width: 150}}>
              <Text style={{fontSize: 16, textAlign: 'left'}}>
                {ele.voucher_type}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 80}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                {ele.item_name}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 60}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>{ele.qty}</Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 120}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                {ele.unit_name}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 200}}>
              <Text style={{fontSize: 16, textAlign: 'left'}}>
                {ele.remark}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 100}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                {ele.verify_status == true
                  ? 'Verified'
                  : ele.revert_status == true
                  ? 'Reverted'
                  : 'Pending'}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View style={{width: 100}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                {ele.voucher_date}
              </Text>
            </View>
            <Divider
              style={{
                backgroundColor: COLORS.lightGray1,
                padding: 0.4,
                height: SIZES.height * 0.04,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingHorizontal: 20,
                width: 140,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    editVoucher(
                      ele._id,
                      ele.project_id,
                      ele.voucher_type,
                      ele.qty,
                      ele.item_id,
                      ele.unit_id,
                      ele.remark,
                      ele.location,
                      ele.vehicle_no,
                    );
                  }}>
                  <FontAwesome name="edit" color={COLORS.blue} size={16} />
                </TouchableOpacity>
              </View>
              <View style={{justifyContent: 'center'}}>
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="delete"
                    color={COLORS.red}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );

  // const renderRevertedItem = ({item}) => (
  //   <View>
  //     {item.voucherData.map((ele,idx2) => {
  //       return (
  //         <View
  //         key={idx2}
  //           style={{
  //             flexDirection: 'row',
  //             margin: 1,
  //             borderWidth: 0.05,
  //             marginVertical: SIZES.base * 0.5,
  //           }}>
  //           <View style={{width: 150}}>
  //             <Text style={{fontSize: 16, textAlign: 'left'}}>
  //               {ele.voucher_type}
  //             </Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View style={{width: 80}}>
  //             <Text style={{fontSize: 16, textAlign: 'center'}}>
  //               {ele.item_name}
  //             </Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View style={{width: 60}}>
  //             <Text style={{fontSize: 16, textAlign: 'center'}}>
  //               {ele.qty}
  //             </Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View style={{width: 200}}>
  //             <Text style={{fontSize: 16, textAlign: 'left'}}>
  //               {ele.remark}
  //             </Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View style={{width: 100}}>
  //             <Text style={{fontSize: 16, textAlign: 'center'}}>
  //               {ele.voucher_date}
  //             </Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               justifyContent: 'space-evenly',
  //               paddingHorizontal: 20,
  //               width: 140,
  //             }}>
  //             <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //               <TouchableOpacity
  //                 onPress={() => {
  //                   console.log('proejct id--', ele.project_id);
  //                   editVoucher(
  //                     ele._id,
  //                     ele.project_id,
  //                     ele.voucher_type,
  //                     ele.qty,
  //                     ele.item_id,
  //                     ele.remark,
  //                     ele.location,
  //                     ele.vehicle_no,
  //                   );
  //                 }}>
  //                 <FontAwesome name="edit" color={COLORS.blue} size={16} />
  //               </TouchableOpacity>
  //             </View>
  //             <View style={{justifyContent: 'center'}}>
  //               <TouchableOpacity>
  //                 <MaterialCommunityIcons
  //                   name="delete"
  //                   color={COLORS.red}
  //                   size={20}
  //                 />
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </View>
  //       );
  //     })}
  //   </View>
  // );

  // const renderInprogressItem = ({item}) => (
  //   <View>
  //     {item.voucherData.map((ele, idx) => {
  //       return (
  //         <View
  //           key={idx}
  //           style={{
  //             flexDirection: 'row',
  //             margin: 1,
  //             borderWidth: 0.05,
  //             marginVertical: SIZES.base * 0.5,
  //           }}>
  //           <View style={{width: 150}}>
  //             <Text style={{fontSize: 16, textAlign: 'left'}}>
  //               {ele.voucher_type}
  //             </Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View style={{width: 80}}>
  //             <Text style={{fontSize: 16, textAlign: 'center'}}>
  //               {ele.item_name}
  //             </Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View style={{width: 60}}>
  //             <Text style={{fontSize: 16, textAlign: 'center'}}>{ele.qty}</Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View style={{width: 200}}>
  //             <Text style={{fontSize: 16, textAlign: 'left'}}>
  //               {ele.remark}
  //             </Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View style={{width: 100}}>
  //             <Text style={{fontSize: 16, textAlign: 'center'}}>
  //               {ele.voucher_date}
  //             </Text>
  //           </View>
  //           <Divider
  //             style={{
  //               backgroundColor: COLORS.lightGray1,
  //               padding: 0.4,
  //               height: SIZES.height * 0.04,
  //             }}
  //           />
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               justifyContent: 'space-evenly',
  //               paddingHorizontal: 20,
  //               width: 140,
  //             }}>
  //             <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //               <TouchableOpacity
  //                 onPress={() => {
  //                   console.log('proejct id--', ele.project_id);
  //                   editVoucher(
  //                     ele._id,
  //                     ele.project_id,
  //                     ele.voucher_type,
  //                     ele.qty,
  //                     ele.item_id,
  //                     ele.remark,
  //                     ele.location,
  //                     ele.vehicle_no,
  //                   );
  //                 }}>
  //                 <FontAwesome name="edit" color={COLORS.blue} size={16} />
  //               </TouchableOpacity>
  //             </View>
  //             <View style={{justifyContent: 'center'}}>
  //               <TouchableOpacity>
  //                 <MaterialCommunityIcons
  //                   name="delete"
  //                   color={COLORS.red}
  //                   size={20}
  //                 />
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </View>
  //       );
  //     })}
  //   </View>
  // );

  const ListHeader = () => {
    return (
      <View style={[styles1.headerFooterStyle, styles1.shadow]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: 150, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Voucher Type
            </Text>
          </View>
          <View style={{width: 80, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Item Name
            </Text>
          </View>
          <View style={{width: 60, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Qty
            </Text>
          </View>
          <View style={{width: 120, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Unit Name
            </Text>
          </View>
          <View style={{width: 200, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Remark
            </Text>
          </View>
          <View style={{width: 100, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Status
            </Text>
          </View>
          <View style={{width: 120, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Voucher Date
            </Text>
          </View>
          <View style={{width: 130, backgroundColor: 'white'}}>
            <Text
              style={{
                ...FONTS.body3,
                fontWeight: '600',
                color: COLORS.darkGray,
                textAlign: 'center',
              }}>
              Action
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  const voucherSelectionModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={voucherListModal}
        onRequestClose={() => {
          setVoucherListModal(!voucherListModal);
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.transparentBlack6,
          }}>
          <View
            style={{
              position: 'absolute',
              width: '65%',
              padding: SIZES.padding,
              borderRadius: 5,
              backgroundColor: COLORS.white,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{}}>Select Voucher</Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setVoucherListModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: COLORS.rose_600,
                    }}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View style={{marginTop: 15}}>
              <RadioButton onSelect={value => setUserOption(value)} />
            </View>

            <Pressable
              style={{
                marginTop: 30,
                borderRadius: 6,
                padding: 5,
                elevation: 2,
                backgroundColor: '#2196F3',
              }}
              onPress={() => {
                getFilteredVoucher();
                setVoucherListModal(!voucherListModal);
              }}>
              <Text style={styles1.textStyle}>SUBMIT</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const ListFooter = () => {
    //View to set in Footer
    return (
      <View style={[styles1.headerFooterStyle, styles1.shadow]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: 150, backgroundColor: 'white'}}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
              Voucher Type
            </Text>
          </View>
          <View style={{width: 80, backgroundColor: 'white'}}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
              Item Name
            </Text>
          </View>
          <View style={{width: 60, backgroundColor: 'white'}}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
              Qty
            </Text>
          </View>
          <View style={{width: 200, backgroundColor: 'white'}}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
              Remark
            </Text>
          </View>
          <View style={{width: 100, backgroundColor: 'white'}}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
              Voucher Date
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, borderWidth: 1, alignContent: 'space-around'}}>
      <Pressable
        onPress={() => {
          getStockDataItems();
          getAllProjects();
          setToggleSubmitUpdate(false);
          setVoucherModal(true);
          fetchData();
        }}
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',

          paddingVertical: SIZES.base * 0.5,
          paddingHorizontal: SIZES.base * 1.5,
          borderWidth: 1,
          marginTop: SIZES.base,
          // width: SIZES.width * 0.95,
          backgroundColor: COLORS.lightblue_500,
          alignSelf: 'center',
          borderRadius: SIZES.base * 0.5,
          borderColor: COLORS.lightblue_300,
        }}>
        <Text
          style={[FONTS.body3, {color: COLORS.white2, textAlign: 'center'}]}>
          Voucher Entry
        </Text>
      </Pressable>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          ...styles1.shadow,
          alignItems: 'center',
          padding: 5,
          borderWidth: 0.2,
          backgroundColor: COLORS.white3,
          marginHorizontal: 2,
          marginTop: '10%',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <View
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: SIZES.base * 0.5,
                marginBottom: 2,
              },
            ]}>
            <Text
              style={[FONTS.body3, {fontWeight: '900', color: COLORS.gray}]}>
              {constants.CHECK_VOUCHER_TYPE.PURCHASED_VOUCHER == userOption
                ? 'Pending Voucher'
                : constants.CHECK_VOUCHER_TYPE.RECEIVED_VOUCHER == userOption
                ? 'Received Voucher'
                : constants.CHECK_VOUCHER_TYPE.PURCHASED_RETURN_VOUCHER ==
                  userOption
                ? 'Purchased Return Voucher'
                : constants.CHECK_VOUCHER_TYPE.RECEIVED_RETURN_VOUCHER ==
                  userOption
                ? 'Received Return Voucher'
                : 'Voucher List'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVoucherListModal(!voucherListModal);
              }}>
              <MaterialCommunityIcons
                name="filter-menu"
                size={25}
                color={COLORS.blue}></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <FlatList
                data={pendingVoucher}
                horizontal
                contentContainerStyle={{
                  flexDirection: 'column',
                  padding: 2,
                  marginHorizontal: 2,
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={renderPendingItem}
                ListHeaderComponent={ListHeader}
                keyExtractor={item => item._id.toString()}
              />
            </View>
          </ScrollView>
        </View>
      </View>

      {/* <View
        style={{
          flex: 1,
          justifyContent: 'center',
          ...styles1.shadow,
          padding: 5,
          borderWidth: 0.2,
          marginHorizontal: 3,
          borderLeftColor: COLORS.orange,
          backgroundColor: COLORS.white3,
          borderLeftWidth: 3,
          // alignItems: 'center',
          marginTop: '2%',
        }}>
        <View
          style={[
            // styles1.shadow,
            {borderWidth: 0.1, padding: SIZES.base * 0.5, marginBottom: 4},
          ]}>
          <Text style={[FONTS.body3, {color: COLORS.gray}]}>
            Reverted Voucher
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <FlatList
              data={revertedVoucher}
              horizontal
              contentContainerStyle={{
                flexDirection: 'column',
                // flexWrap: 'wrap',
                padding: 2,
                marginHorizontal: 2,
                // justifyContent: 'space-between',
                // marginBottom: SIZES.height * 0.61,
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={renderRevertedItem}
              //Header to show above listview
              ListHeaderComponent={ListHeader}
              //Footer to show below listview
              // ListFooterComponent={ListFooter}
              // ItemSeparatorComponent={ItemSeparatorView}
              keyExtractor={item => item._id.toString()}
            />
          </View>
        </ScrollView>
      </View> */}

      {/* <View
        style={{
          flex: 1,
          justifyContent: 'center',
          ...styles1.shadow,
          padding: 5,
          borderWidth: 0.2,
          marginHorizontal: 4,
          borderLeftColor: COLORS.green_400,
          backgroundColor: COLORS.white3,
          borderLeftWidth: 3,
          marginTop: '3%',
          marginBottom: '2%',
        }}>
        <View
          style={[
            // styles1.shadow,
            {borderWidth: 0.1, padding: SIZES.base * 0.5, marginBottom: 4},
          ]}>
          <Text style={[FONTS.body3, {color: COLORS.gray}]}>
            Inprogress Voucher
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          StickyHeaderComponent={() => <Text>df</Text>}>
          <View>
            <FlatList
              data={verifiedVoucher}
              horizontal
              contentContainerStyle={{
                flexDirection: 'column',
                // flexWrap: 'wrap',
                padding: 2,
                marginHorizontal: 2,
                // justifyContent: 'space-between',
                // marginBottom: SIZES.height * 0.61,
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={renderInprogressItem}
              // stickyHeaderHiddenOnScroll={true}
              //Header to show above listview
              ListHeaderComponent={ListHeader}
              //Footer to show below listview
              // ListFooterComponent={ListFooter}
              // ItemSeparatorComponent={ItemSeparatorView}
              keyExtractor={item => item._id.toString()}
            />
          </View>
        </ScrollView>
      </View> */}

      <View>{addVoucherModal()}</View>
      <View>{voucherSelectionModal()}</View>

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

export default UserEndVoucher;
const styles1 = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 1,
  },
  headerFooterStyle: {
    width: '100%',
    borderWidth: 0.1,
  },
  textStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    padding: 7,
  },
  centeredView: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 200,
    marginHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 6,
    padding: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  label: {
    margin: 8,
  },
  option: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});