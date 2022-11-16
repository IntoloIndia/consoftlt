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
  Button,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  UIManager,
  TouchableOpacity,
  LogBox,
  LayoutAnimation,
  ImageBackground,
} from 'react-native';
import styles from '../../ReportStyle.js';
import {Title, Divider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import {
  COLORS,
  FONTS,
  SIZES,
  dummyData,
  icons,
  images,
} from '../../../../../constants';
import {FormInput, TextButton, CustomToast} from '../../../../../Components';
import {
  get_equipment_item_name,
  save_new_equipment_item,
  update_TAndP_report_data,
  get_equipment_report,
  insert_TAndP_report,
  edit_TAndP_report_data,
} from '../../ReportApi';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const TAndP = ({project_id, Main_drp_pro_value, loading}) => {
  const {
    header,
    con_body,
    input,
    body_del,
    body_edit,
    body_del_btn,
    body_edit_btn,
    cont_Project_list_drop,
    body_ed_de_view,
    container,
    inputsContainer,
    inputContainer,
    inputfromone,
  } = styles;
  //T & P collapse
  const [tAndP, setTAndP] = useState(false);
  const [TAndPModal, setTandPModal] = useState(false);
  let calenderKey1;
  //calender
  const [date, setDate] = React.useState(new Date());
  const userData = useSelector(state => state.user);
  const animation = useRef(new Animated.Value(0)).current;
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  // const [showDate, setShowDate] = useState('')
  const [updateId, setUpdateId] = useState('');
  const [tAndPInsertStatus, setTandPInsertStatus] = useState(false);
  const [addNewEquipment, setAddNewEquipment] = useState(false);
  const userCompanyData = useSelector(state => state.user);
  const [calenderKey, setCalenderKey] = useState('');
  const [removeAddOnEdit, setRemoveAddOnEdit] = useState(false);
  const current_dat = moment().format('YYYY%2FMM%2FDD');

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 0.5,
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

  const CONST_FIELD = {
    MANPOWER: 'Manpower',
    STOCK: 'Stock',
    QUANTITY: 'Quantity',
    QUALITY: 'Quality',
    TANDP: 'Tandp',
  };
  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  const [getEquipmentReport, setGetEquipmentReport] = useState('');
  const [equipItemName, setEquipItemName] = useState('');
  const [getequipItemName, setGetEquipItemName] = useState('');
  const [equipmentField, setEquipmentField] = useState([
    {
      equipment_id: '',
      qty: '',
      onDateChange: '',
    },
  ]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    const formatedDate =
      selectedDate.getFullYear() +
      '/' +
      ('0' + (selectedDate.getMonth() + 1)).slice(-2) +
      '/' +
      ('0' + selectedDate.getDate()).slice(-2);

    // const formatedDate = `${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1
    //     }/${selectedDate.getDate()}`;

    const _inputs = [...equipmentField];
    _inputs[calenderKey1].onDateChange = formatedDate;
    _inputs[calenderKey1].key = calenderKey1;
    setEquipmentField(_inputs);
    setDate(selectedDate);
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      locale: 'en-IN',
      display: 'spinner',
    });
  };

  const showDatepicker = key => {
    calenderKey1 = key;
    showMode('date');
  };

  const getEquipmentItems = async () => {
    try {
      const data = await get_equipment_item_name(userData.company_id);
      if (data.length >= 0) {
        setGetEquipItemName(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEquipReport = async () => {
    try {
      const data = await get_equipment_report(
        Main_drp_pro_value,
        userCompanyData._id,
        current_dat,
      );
      setGetEquipmentReport(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEquipmentItems();
    getEquipReport();
  }, [loading]);
  //   }, [userCompanyData.company_id, loading, tAndPInsertStatus]);

  const saveNewEquipmentItems = async () => {
    let isMount = true;
    try {
      const data = {
        tools_machinery_name: equipItemName,
        company_id: userCompanyData.company_id,
      };

      const resp = await save_new_equipment_item(data);
      const temp = await resp.json();

      if ((isMount = true && temp.status == '200')) {
        setSubmitToast(true);
        getEquipmentItems();
        setTimeout(() => {
          setAddNewEquipment(false);
          setSubmitToast(false);
        }, 800);
      }
      return () => {
        isMount = false;
      };
    } catch (error) {
      console.log(error);
    }
  };

  const insertTAndPReport = async () => {
    let isMount = true;
    try {
      const data = {
        company_id: userCompanyData.company_id,
        project_id: Main_drp_pro_value,
        user_id: userCompanyData._id,
        equipmentField: equipmentField,
      };

      const resp = await insert_TAndP_report(data, CONST_FIELD);
      const temp = await resp.json();

      if (isMount === true && temp.status == '200') {
        setSubmitToast(true);
        // getEquipmentItems();
        getEquipReport();
        setTandPInsertStatus(true);
        setTimeout(() => {
          setTandPModal(false);
          setSubmitToast(false);
        }, 900);
        equipmentField.splice(0, equipmentField.length);
      }
      return () => {
        isMount = false;
      };
    } catch (error) {
      console.log(error);
    }
  };

  const editTAndPReportBtn = async id => {
    setTandPInsertStatus(false);
    setRemoveAddOnEdit(true);
    setTandPModal(true);
    setUpdateId(id);
    const data = await edit_TAndP_report_data(id);
    const resp = await data.json();

    setEquipmentField([
      {
        equipment_id: resp.equipment_id.toString(),
        qty: resp.qty.toString(),
        onDateChange: resp.onDateChange,
      },
    ]);
  };

  const updateTAndPReport = async () => {
    const temp = {
      equipmentField,
    };
    const data = await update_TAndP_report_data(updateId, temp);

    if (data.status === 200) {
      setUpdateToast(true);
      getEquipReport();
      setTandPModal(false);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 900);
  };

  const add_tAndP_icon_button = () => {
    return (
      <TouchableOpacity
        style={{
          borderRadius: SIZES.radius * 0.21,
          justifyContent: 'center',
          flexDirection: 'row',
          paddingHorizontal: 2,
        }}
        onPress={() => {
          setRemoveAddOnEdit(false);
          equipmentField.splice(0, equipmentField.length);
          setTandPModal(true);
        }}>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            position: 'absolute',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            backgroundColor: COLORS.lightblue_400,
            padding: SIZES.base * 0.1,
            paddingHorizontal: 2,
            paddingVertical: -2,
            borderRadius: 5,
            top: -SIZES.base * 1.2,
          }}>
          <View>
            <Text style={[FONTS.body5, {color: COLORS.white}]}>Add</Text>
          </View>
          <View>
            <MaterialIcons name="add" size={15} color={COLORS.white} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const add_new_equipment_modal = () => {
    return (
      <View>
        <Modal
          transparent={false}
          visible={addNewEquipment}
          animationType="slide">
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
                borderRadius: 5,
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{...FONTS.h2, color: COLORS.darkGray}}>
                  Add New Equipment
                </Text>
                <Pressable onPress={() => setAddNewEquipment(false)}>
                  <AntDesign name="close" size={30} color={COLORS.black} />
                </Pressable>
              </View>
              <View style={{marginTop: 20}}>
                <FormInput
                  label="Name"
                  onChange={text => {
                    setEquipItemName(text);
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
                    saveNewEquipmentItems();
                  }}
                />
              </View>
              {/* <Toast config={showToastItem} /> */}
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const inputEquipQuantity = (text, key) => {
    const _inputs = [...equipmentField];
    _inputs[key].qty = text;
    _inputs[key].key = key;
    setEquipmentField(_inputs);
  };

  const inputEquipItemName = (Id, key) => {
    const _inputs = [...equipmentField];
    _inputs[key].equipment_id = Id;
    _inputs[key].key = key;
    setEquipmentField(_inputs);
  };
  // const inputEquipOnDateChange = (text, key) => {
  //     const _inputs = [...equipmentField];
  //     _inputs[key].onDateChange = text;
  //     _inputs[key].key = key;
  //     setEquipmentField(_inputs);
  // };

  const deleteEquipHandler = key => {
    const _inputs = [...equipmentField];
    _inputs.splice(key, 1);
    setEquipmentField(_inputs);
  };

  const add_equipment_input = () => {
    return (
      <View style={container}>
        <ScrollView style={inputsContainer}>
          {equipmentField
            ? equipmentField.map((input, key) => {
                return (
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: COLORS.lightblue_100,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                      borderRadius: 1,
                      elevation: 2,
                      padding: 12,
                      margin: 2,
                    }}
                    key={key}>
                    <View
                      style={{
                        flex: 1,
                        paddingVertical: 5,
                      }}
                      key={key}>
                      <View
                        style={{
                          // flex: 1,
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                        }}>
                        <Dropdown
                          style={[
                            {
                              height: 35,
                              borderRadius: 5,
                              borderWidth: 1,
                              borderColor: COLORS.transparentBlack3,
                              alignSelf: 'center',
                              paddingHorizontal: 8,
                              marginBottom: SIZES.base,
                              width: '55%',
                            },
                          ]}
                          selectedTextStyle={{color: COLORS.gray}}
                          placeholderStyle={{
                            fontSize: 14,
                            color: COLORS.gray,
                            left: 5,
                          }}
                          inputSearchStyle={{
                            color: COLORS.gray,
                            height: 30,
                            borderRadius: 5,
                            padding: -4,
                          }}
                          data={getequipItemName}
                          search
                          maxHeight={300}
                          labelField="tools_machinery_name"
                          valueField="_id"
                          placeholder={'Select Equipment'}
                          searchPlaceholder="Search..."
                          value={input.equipment_id}
                          onChange={text => {
                            inputEquipItemName(text._id, key);
                          }}
                        />
                        <TextInput
                          style={[inputfromone, {width: '28%'}]}
                          placeholder="Qty"
                          keyboardType="numeric"
                          placeholderTextColor={COLORS.gray}
                          value={input.qty}
                          onChangeText={text => {
                            inputEquipQuantity(text, key);
                          }}
                        />
                        <TouchableOpacity
                          style={{
                            width: '50%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            elevation: 2,
                            borderRadius: 1,
                            borderColor: COLORS.lightblue_400,
                            paddingVertical: SIZES.base * 0.6,
                            justifyContent: 'space-between',
                          }}
                          onPress={() => {
                            showDatepicker(key);
                          }}>
                          <View
                            style={{
                              borderRadius: 2,
                              width: '50%',
                              marginHorizontal: 8,
                              height: '40%',
                              alignItems: 'center',
                            }}>
                            <Text style={{color: COLORS.black}}>
                              {input.onDateChange
                                ? input.onDateChange
                                : 'Select Date'}
                            </Text>
                          </View>
                          <View style={{}}>
                            <Image
                              source={icons.date}
                              style={{
                                width: 24,
                                height: 24,
                                tintColor: COLORS.lightblue_900,
                                right: 8,
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        {/* <TextInput
                                            style={[inputfromone, { width: "20%" }]}
                                            placeholder="Qty"
                                            keyboardType="numeric"
                                            placeholderTextColor={COLORS.gray}
                                            value={input.qty}
                                            onChangeText={text => {
                                                inputEquipQuantity(text, key);
                                            }}
                                        /> */}
                        <TouchableOpacity
                          style={{
                            elevation: 15,
                            borderWidth: 1,
                            borderColor: COLORS.transparent,
                          }}
                          onPress={() => deleteEquipHandler(key)}>
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
                  </View>
                );
              })
            : null}
        </ScrollView>
      </View>
    );
  };

  const addEquipmentInputHandler = () => {

    setEquipmentField([
      ...equipmentField,
      {equipment_id: '', qty: '', onDateChange: ''},
    ]);
  };

  const add_TAndP_modal = () => {
    return (
      <Modal visible={TAndPModal} transparent={true} animationType="slide">
        <View style={{flex: 1, backgroundColor: COLORS.transparentBlack1}}>
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
            <View
              style={{
                height: '90%',
                width: '100%',
                backgroundColor: '#fff',
                marginTop: 90,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 22,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  justifyContent: 'space-between',
                }}>
                <Title>Equipment Report</Title>
                <Pressable
                  onPress={() => {
                    equipmentField.splice(0, equipmentField.length);
                    setTandPModal(false);
                    setRemoveAddOnEdit(false);
                  }}>
                  <AntDesign name="close" size={30} color={COLORS.black} />
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                {removeAddOnEdit ? null : (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderRadius: 1,
                      borderColor: COLORS.transparentBlack1,
                      paddingHorizontal: 3,
                      elevation: 1,
                      margin: 4,
                    }}
                    onPress={addEquipmentInputHandler}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 1,
                      }}>
                      <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                        Add/Update Existing
                      </Text>
                      <MaterialIcons
                        name="add-box"
                        size={20}
                        color={COLORS.green}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 4,
                    margin: 5,
                    borderRadius: 1,
                    elevation: 1,
                    borderColor: COLORS.transparent,
                  }}
                  onPress={() => {
                    setAddNewEquipment(true);
                  }}>
                  <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                    Add New
                  </Text>
                </TouchableOpacity>
              </View>

              {add_equipment_input()}

              {removeAddOnEdit ? (
                <TextButton
                  label="Update"
                  buttonContainerStyle={{
                    height: 55,
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.lightblue_700,
                  }}
                  onPress={() => {
                    updateTAndPReport();
                  }}
                />
              ) : (
                <TextButton
                  label="Submit"
                  buttonContainerStyle={{
                    height: 55,
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.lightblue_700,
                  }}
                  onPress={() => {
                    insertTAndPReport();
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const Edit_delete_button = ({edit_size, del_size, __id}) => {
    return (
      <>
        <View style={body_ed_de_view}>
          <View style={body_del_btn}>
            <TouchableOpacity onPress={() => editTAndPReportBtn(__id)}>
              {/* <Foundation name='page-edit' color={item.id == selectedEditId ? "#2aaeff" : null} size={24} /> */}
              <FontAwesome name="edit" color={COLORS.blue} size={edit_size} />
            </TouchableOpacity>
          </View>
          <View style={body_edit_btn}>
            <TouchableOpacity
            // onPress={() => deleteReportButton(__id)}
            >
              <MaterialCommunityIcons
                name="delete"
                color={COLORS.red}
                size={del_size}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <Animated.View style={{transform: [{scale}]}}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
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
            setTAndP(!tAndP);
          }}
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.base,
            paddingVertical: 3,
            width: SIZES.width * 0.53,
            alignItems: 'center',
            justifyContent: 'space-between',
            top: SIZES.base * 2,
            borderColor: COLORS.lightblue_200,
            backgroundColor: COLORS.lightblue_600,
            borderWidth: 1,
            borderRadius: 4,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
          }}>
          <View style={{alignItems: 'center', alignSelf: 'center'}}>
            <Text
              onPressIn={onPressIn}
              onPressOut={onPressOut}
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
                setTAndP(!tAndP);
              }}
              style={[FONTS.h3, {color: COLORS.white2}]}>
              T & P
            </Text>
          </View>
          <View style={{alignItems: 'center', alignSelf: 'center'}}>
            <TouchableOpacity
              onPressIn={onPressIn}
              onPressOut={onPressOut}
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
                setTAndP(!tAndP);
              }}>
              <AntDesign name="caretdown" size={12} color={COLORS.white2} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Animated.View>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          right: SIZES.base * 2,
        }}>
        {tAndP ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <View style={{backgroundColor: 'blue', paddingLeft: 140}}>
              {add_tAndP_icon_button()}
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'skyblue',

                width: SIZES.width * 0.92,
                alignSelf: 'flex-start',
                position: 'relative',
                top: 20,
                marginLeft: 17,
                // height: 200,
                maxHeight: 200,
                paddingBottom: 6,
                // flex:2,
                // marginBottom: -20,
                // padding: 5,
                elevation: 1,
              }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  maxHeight: 500,
                  borderWidth: 2,
                }}>
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      top: 5,
                      left: -12,
                      position: 'relative',
                    }}>
                    <View
                      style={{
                        paddingHorizontal: 5,
                        marginRight: 2,
                        marginLeft: 16,
                        // borderRightWidth: 2,
                        justifyContent: 'center',
                        width: 45,
                        //  borderColor: COLORS.lightblue_200
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        S.no
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 8,
                        //  borderRightWidth: 2,
                        justifyContent: 'center',
                        width: 145,
                        //  borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Equipment Name
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 8,
                        justifyContent: 'center',
                        width: 100,
                        // borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Date
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 8,
                        // borderLeftWidth: 2,
                        paddingLeft: 4,
                        justifyContent: 'center',
                        width: 70,
                        // borderColor: COLORS.lightblue_200,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Quantity
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 0,
                        paddingLeft: 15,
                        justifyContent: 'center',
                        width: 60,
                      }}>
                      <Text
                        style={[
                          FONTS.h4,
                          {color: COLORS.black, textAlign: 'center'},
                        ]}>
                        Action
                      </Text>
                    </View>
                  </View>
                  <ScrollView
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                      top: 10,
                      paddingBottom: 15,
                    }}>
                    <>
                      {getEquipmentReport.data.length >= 0 ? (
                        getEquipmentReport.data.map((list, index) => (
                          <View
                            style={{
                              flexDirection: 'column',
                              alignContent: 'space-between',
                              paddingVertical: 20,
                              top: -20,
                            }}
                            key={index}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                top: 10,
                                paddingVertical: 3,
                                left: -26,
                              }}>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 45,
                                  position: 'absolute',

                                  left: 29,
                                  // right: 10,
                                  //  left:0,
                                  top: 3,
                                  //  bottom:0
                                }}>
                                <View>
                                  <Text
                                    style={[
                                      FONTS.h4,
                                      {
                                        color: COLORS.darkGray,
                                        textAlign: 'center',
                                      },
                                    ]}>
                                    {index + 1}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: 1,
                                    left: 42,
                                    top: -10,
                                  }}>
                                  <Divider
                                    style={{
                                      backgroundColor: COLORS.lightGray1,
                                      height: SIZES.height,
                                      top: 5,
                                    }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 145,
                                  position: 'absolute',
                                  left: 85,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  right: 10,
                                }}>
                                <View>
                                  <Text
                                    style={[
                                      FONTS.h4,
                                      {
                                        color: COLORS.darkGray,
                                        textAlign: 'center',
                                      },
                                    ]}>
                                    {
                                      list.toolsAndMachineryReportItem
                                        .equipment_name
                                    }
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: 1,
                                    left: 145,
                                    top: -10,
                                  }}>
                                  <Divider
                                    style={{
                                      backgroundColor: COLORS.lightGray1,
                                      height: SIZES.height,
                                      top: 5,
                                    }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 100,
                                  position: 'absolute',
                                  left: 239,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  right: 10,
                                }}>
                                <Text
                                  style={[
                                    FONTS.h4,
                                    {
                                      color: COLORS.darkGray,
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  {/* {new Date(list.toolsAndMachineryReportItem.onDateChange).toLocaleDateString()} */}
                                  {
                                    list.toolsAndMachineryReportItem
                                      .onDateChange
                                  }
                                </Text>
                              </View>
                              <View
                                style={{
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: 70,
                                  position: 'absolute',
                                  left: 350,
                                  top: 3,
                                  // borderWidth: 1,
                                  // borderColor: COLORS.lightblue_200,
                                  // right: 10,
                                }}>
                                <Text
                                  style={[
                                    FONTS.h4,
                                    {
                                      color: COLORS.darkGray,
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  {list.toolsAndMachineryReportItem.qty}
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: 60,
                                  position: 'absolute',
                                  left: 425,
                                  top: 3,
                                }}>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                  }}>
                                  <Edit_delete_button
                                    edit_size={18}
                                    del_size={22}
                                    __id={list.toolsAndMachineryReportItem._id}
                                  />
                                </View>
                              </View>
                            </View>
                            <View style={{position: 'absolute', top: 23}}>
                              <Divider
                                style={{
                                  backgroundColor: COLORS.lightGray1,
                                  width: SIZES.width * 3,
                                  marginHorizontal: 2,
                                  top: 5,
                                }}
                              />
                            </View>
                          </View>
                        ))
                      ) : (
                        <View>
                          <Text
                            style={[
                              FONTS.h4,
                              {color: COLORS.gray, textAlign: 'center'},
                            ]}>
                            Currently, no report to show!
                          </Text>
                        </View>
                      )}
                    </>
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </View>
        ) : null}
        {add_TAndP_modal()}
        {add_new_equipment_modal()}
      </View>
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
    </>
  );
};

export default TAndP;
