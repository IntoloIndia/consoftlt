import React from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import FilePicker, {types} from 'react-native-document-picker';
import {COLORS, SIZES, FONTS, icons} from '../../../constants';
import {
  IconButton,
  CustomDropdown,
  TextButton,
  CustomToast,
} from '../../../Components';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useSelector} from 'react-redux';
import {getUserRole, roleByUser} from '../../../controller/UserRoleController';
import {postAssignWork} from '../../../controller/AssignWorkController';

const WorkAssignModal = ({projectId, isVisible, onClose}) => {
  // const companyData = useSelector(state => state.company);
  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);

  var companyData;
  if (companyDetail._id) {
    companyData = useSelector(state => state.company);
  }
  if (userData._id) {
    companyData = useSelector(state => state.user);
  }
  const company_id = companyData._id;

  //ADD DYNAMICALLY INPUT FEILD
  const [work, setWork] = React.useState([{key: '', value: ''}]);
  const [newWork, setNewWork] = React.useState([]);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);

  //GETTING USER ROLES FROM API
  const [openUserRole, setOpenUserRole] = React.useState(false);
  const [userRoleValue, setUserRoleValue] = React.useState([]);
  const [userRoles, setUserRoles] = React.useState([]);

  //GETTING USER FROM APIS ON CHANGE OF USER ROLES
  const [openUsers, setOpenUsers] = React.useState(false);
  const [usersValue, setUsersValue] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  const addHandler = () => {
    const inputs = [...work];
    inputs.push({key: '', value: ''});
    setWork(inputs);
  };

  const removeHandler = key => {
    const inputs = work.filter((input, index) => index != key);
    setWork(inputs);
  };

  const assignWorkArr = [];
  const inputHandler = (text, key) => {
    const inputs = [...work];
    inputs[key].value = text;
    inputs[key].key = key;
    setWork(inputs);
  };

  React.useEffect(() => {
    work.map((item, i) => {
      assignWorkArr.push(item.value);
      setNewWork(assignWorkArr);
    });
  }, [work]);

  // CLOSE DROPDOWN ON OPEN ANOTHER DROPDOWN
  const onRoleOpen = React.useCallback(() => {
    setOpenUsers(false);
    getUserRoles();
  }, []);

  const onUserOpen = React.useCallback(() => {
    setOpenUserRole(false);
  }, []);

  //=================================== Apis ===================================

  const getUserRoles = async () => {
    let response = await getUserRole(company_id);
    if (response.status === 200) {
      let roleDataFromApi = response.data.map((one, i) => {
        return {label: one.user_role, value: one._id};
      });
      setUserRoles(roleDataFromApi);
    }
  };

  const getUserByRoleId = async role_id => {
    let response = await roleByUser(company_id, role_id);
    if (response.status === 200) {
      let roleDataFromApi = response.data.map(ele => {
        return {label: ele.name, value: ele._id};
      });
      setUsers(roleDataFromApi);
    }
  };

  const postAssignWorks = async () => {
    const formData = {
      role_id: userRoleValue,
      user_id: usersValue,
      work: newWork,
      exp_completion_date: formatedDate,
      exp_completion_time: formatedTime,
      company_id: company_id,
      project_id: projectId,
    };
    let response = await postAssignWork(formData);
    if (response.status === 200) {
      setSubmitToast(true);
      onClose();
      setUsersValue('');
      setUserRoleValue('');
      setNewWork('');
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 1500);
  };

  // React.useEffect(() => {
  //   getUserRoles();
  // }, []);

  // DOCUMENT PICKER
  // const [fileData, setFileData] = React.useState([]);
  // const handleFilePicker = () => {
  //   try {
  //     const response = FilePicker.pick({
  //       presentationStyle: 'fullScreen',
  //       allowMultiSelection: true,
  //       type: [types.images, types.pdf, types.plainText],
  //     });
  //     setFileData(response);
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // DATE & TIME
  const [date, setDate] = React.useState(new Date());
  const formatedDate = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()}`;

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes.toString().padStart(2, '0');
  let strTime = hours + ':' + minutes + ' ' + ampm;
  const formatedTime = strTime;

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
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

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  function renderStartDate() {
    return (
      <View>
        <Text style={{color: COLORS.darkGray, ...FONTS.body4}}>
          Target date & Time
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: SIZES.base,
            backgroundColor: COLORS.gray3,
            paddingHorizontal: SIZES.radius,
            paddingVertical: SIZES.base,
            // ...styles.shadow,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  ...FONTS.body4,
                  color: COLORS.darkGray,
                }}>
                Date - {formatedDate}
              </Text>
              <Text
                style={{
                  ...FONTS.body4,
                  color: COLORS.darkGray,
                  left: 10,
                }}>
                Time - {date.toLocaleTimeString()}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={showDatepicker}>
                <Image
                  source={icons.date}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: COLORS.black,
                    right: 10,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={showTimepicker}>
                <Image
                  source={icons.time}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: COLORS.black,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.transparentBlack6,
          }}>
          <View
            style={{
              width: '95%',
              padding: SIZES.padding,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.white,
              maxHeight: 500,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 25, color: COLORS.darkGray}}>
                Assign Work
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={onClose}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <CustomDropdown
              placeholder="Select role"
              open={openUserRole}
              value={userRoleValue}
              items={userRoles}
              setOpen={setOpenUserRole}
              setValue={setUserRoleValue}
              setItems={setUserRoles}
              listParentLabelStyle={{
                color: COLORS.white,
              }}
              onChangeValue={value => getUserByRoleId(value)}
              // onSelectItem={value => console.log(value)}
              onOpen={onRoleOpen}
              zIndex={2000}
              zIndexInverse={1000}
              maxHeight={150}
            />
            <View style={{marginTop: 30, marginBottom: 25}}>
              <CustomDropdown
                placeholder="Select user"
                open={openUsers}
                value={usersValue}
                items={users}
                setOpen={setOpenUsers}
                setValue={setUsersValue}
                setItems={setUsers}
                // categorySelectable={true}
                listParentLabelStyle={{
                  color: COLORS.white,
                }}
                zIndex={1000}
                zIndexInverse={2000}
                onOpen={onUserOpen}
                maxHeight={150}
              />
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{marginVertical: 5}}>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {work.map((input, key) => (
                  <View style={{}} key={key}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          color: COLORS.darkGray,
                          ...FONTS.body4,
                          marginTop: SIZES.radius,
                        }}>
                        Work {key + 1}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          width: key == 0 ? '90%' : '82%',
                          height: 40,
                          paddingHorizontal: SIZES.padding,
                          borderRadius: SIZES.base,
                          backgroundColor: COLORS.gray3,
                          right: 3,
                        }}>
                        <TextInput
                          style={{color: COLORS.black}}
                          placeholder="Write here..."
                          placeholderTextColor={COLORS.darkGray}
                          value={input.value}
                          onChangeText={text => inputHandler(text, key)}
                        />
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => removeHandler(key)}>
                          {key != 0 && (
                            <ImageBackground
                              style={{
                                backgroundColor: COLORS.rose_600,
                                padding: 5,
                                right: 5,
                              }}>
                              <Image
                                source={icons.minus}
                                style={{
                                  height: 12,
                                  width: 12,
                                  tintColor: 'white',
                                }}
                              />
                            </ImageBackground>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addHandler}>
                          <ImageBackground
                            style={{
                              backgroundColor: COLORS.success_600,
                              padding: 5,
                            }}>
                            <Image
                              source={icons.plus}
                              style={{
                                height: key == 0 ? 12 : 12,
                                width: key == 0 ? 12 : 12,
                                tintColor: 'white',
                              }}
                            />
                          </ImageBackground>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* <Text
              style={{
                marginTop: SIZES.radius,
                ...FONTS.body4,
                color: COLORS.darkGray,
                // marginLeft: SIZES.base,
              }}>
              Upload files
              </Text>
              <View
              style={{
                borderRadius: SIZES.base,
                backgroundColor: COLORS.gray3,
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.base,
              }}>
              <View style={{}}>
              {fileData.length > 0
                ? fileData.map((list, index) => {
                  return (
                    <View key={index}>
                    <Text
                    style={{
                      ...FONTS.body4,
                      color: COLORS.lightblue_900,
                    }}>
                    {index + 1}.{''} {list.name}
                    </Text>
                    </View>
                    );
                  })
                  : null}
                  </View>
                  <TouchableOpacity
                  onPress={handleFilePicker}
                  style={{alignItems: 'flex-end'}}>
                  <Image
                  source={icons.upload_files}
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: COLORS.black,
                  }}
                />
                </TouchableOpacity>
              </View> */}
            </ScrollView>
            <View style={{}}>{renderStartDate()}</View>
            <TextButton
              label="Submit"
              buttonContainerStyle={{
                height: 45,
                alignItems: 'center',
                marginTop: SIZES.padding * 1.5,
                borderRadius: SIZES.radius,
              }}
              onPress={() => postAssignWorks()}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Submit"
        message="Submitted Successfully..."
      />
    </View>
  );
};
export default WorkAssignModal;
