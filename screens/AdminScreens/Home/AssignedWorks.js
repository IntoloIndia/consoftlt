import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Animated,
  ImageBackground,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {DeleteConfirmationToast} from '../../../Components';
import {COLORS, SIZES, icons, FONTS} from '../../../constants';
import {Swipeable} from 'react-native-gesture-handler';
import {
  getAssignWorks,
  deleteAssignWorks,
} from '../../../controller/AssignWorkController';
import {getUserRole} from '../../../controller/UserRoleController';
import {useSelector} from 'react-redux';
import {
  revertAssignWorks,
  revertSubmitWorks,
} from '../../../controller/RevertController';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {CustomToast} from '../../../Components';

const AssignedWorks = ({data, AssignWorkfunction}) => {
  const companyData = useSelector(state => state.company);
  const company_id = companyData._id;
  // console.log(companyData._id)
  const [revertModal, setRevertModal] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [assignWorkData, setAssignWorkData] = React.useState([]);
  const [filterRoleModal, setFilterRoleModal] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const [submitToast, setSubmitToast] = React.useState(false);
  //get assign works
  // const fetchAssignWorks = async () => {
  //   const response = await getAssignWorks(company_id);
  //   // console.log(response)
  //   if (response.status === 200) {
  //     setAssignWorkData(response.data);
  //   }
  // };

  //get user role
  const fetchUserRole = async () => {
    const response = await getUserRole(company_id);
    if (response.status === 200) {
      setItems(response.data);
    }
  };

  // get work id
  const onDeleteAssignWork = id => {
    setDeleteConfirm(true);
    setWorkId(id);
  };
  const [workId, setWorkId] = React.useState('');

  // delete assign works
  const fetchAssignWorkDelete = async () => {
    const response = await deleteAssignWorks(workId);
    if (response.status === 200) {
      // fetchAssignWorks();
      AssignWorkfunction();
      setDeleteConfirm(false);
    }
  };

  // React.useEffect(() => {
  //   fetchAssignWorks();
  //   fetchUserRole();
  //   LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  // }, []);

  // React.useMemo(() => {
  //   fetchAssignWorks();
  // }, []);

  //----------------------------

  // date & time
  const [date, setDate] = React.useState(new Date());
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes.toString().padStart(2, '0');
  let strTime = hours + ':' + minutes + ' ' + ampm;
  const formatedTime = strTime;
  // const formatedDate = `${date.getFullYear()}/${
  //   date.getMonth() + 1
  // }/${date.getDate()}`;
  const formatedDate =
    date.getFullYear() +
    '/' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + date.getDate()).slice(-2);
    
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

  const [assignWorkId, setAssignWorkId] = React.useState('');
  const getAssignWorkId = id => {
    setAssignWorkId(id);
  };

  const OnSubmit = async () => {
    const formData = {
      exp_completion_date: formatedDate,
      exp_completion_time: formatedTime,
    };
    let data = await revertAssignWorks(assignWorkId, formData);
    if (data.status === 200) {
      AssignWorkfunction();
      setRevertModal(false);
      setSubmitToast(true);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  //----------------------------

  function renderRoleFilterModal() {
    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
          }}
          onPress={() => OnChangeValueHandler(item._id)}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.white,
              textTransform: 'capitalize',
            }}>
            {item.user_role}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <Modal animationType="fade" transparent={true} visible={filterRoleModal}>
        <TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: COLORS.darkBlue,
                position: 'absolute',
                width: '100%',
                height: '40%',
                paddingHorizontal: SIZES.radius,
                paddingTop: SIZES.radius,
                paddingBottom: SIZES.padding,
                borderTopRightRadius: SIZES.base,
                borderTopLeftRadius: SIZES.base,
              }}>
              <TouchableOpacity
                style={{alignItems: 'flex-end'}}
                onPress={() => setFilterRoleModal(false)}>
                <Image
                  source={icons.cross}
                  resizeMode="contain"
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.darkGray2,
                  }}
                />
              </TouchableOpacity>

              <FlatList
                data={items}
                keyExtractor={item => `${item._id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderColor: COLORS.lightGray1,
                        marginVertical: SIZES.base,
                      }}></View>
                  );
                }}
                style={{
                  padding: SIZES.padding,
                  marginBottom: SIZES.padding,
                }}
                ListFooterComponent={
                  <View
                    style={{
                      marginBottom: SIZES.padding,
                    }}></View>
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  function renderSwipeList() {
    const renderRight = (progress, id) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 0],
      });
      return (
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: 50,
            transform: [{translateX: 0}],
          }}>
          <TouchableOpacity onPress={() => onDeleteAssignWork(id)}>
            <ImageBackground
              style={{
                backgroundColor: COLORS.white,
                padding: 5,
                borderRadius: 3,
              }}>
              <Image
                source={icons.delete_icon}
                style={{height: 18, width: 18, tintColor: COLORS.rose_600}}
              />
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>
      );
    };

    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            backgroundColor: COLORS.lightblue_600,
            padding: 10,
            borderRadius: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 5,
            }}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.white,
              }}>
              {index + 1}.
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.white,
                left: 5,
                textTransform: 'capitalize',
              }}>
              {item.user_name}
            </Text>
          </View>

          {item.assign_works.map((ele, i) => {
            return (
              <Swipeable
                key={ele._id}
                renderRightActions={progress => renderRight(progress, ele._id)}>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    marginTop: i == 0 ? null : 8,
                    padding: 6,
                    borderRadius: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        backgroundColor: COLORS.yellow_400,
                        paddingHorizontal: 5,
                        fontSize: 10,
                        color: COLORS.black,
                      }}>
                      {ele.work_code}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.darkGray,
                        ...FONTS.h3,
                        left: 8,
                        flex: 1,
                      }}>
                      {ele.work}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={icons.completion_date}
                      style={{
                        height: 18,
                        width: 18,
                        tintColor: COLORS.darkGray,
                      }}
                    />
                    <Text
                      style={{
                        ...FONTS.h4,
                        color: COLORS.darkGray,
                        left: 10,
                      }}>
                      {ele.exp_completion_date}
                    </Text>

                    <Image
                      source={icons.persent_progress}
                      style={{
                        height: 18,
                        width: 18,
                        tintColor: COLORS.darkGray,
                        left: 30,
                      }}
                    />
                    <Text
                      style={{
                        ...FONTS.h4,
                        color: COLORS.darkGray,
                        left: 40,
                      }}>
                      {ele.work_percent}%
                    </Text>
                  </View>
                  {ele.comment_status == true ? (
                    <View
                      style={{
                        height: 1,
                        marginVertical: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.gray2,
                      }}></View>
                  ) : null}
                  {ele.comment_status == true &&
                  ele.comment_reply_status == false ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          ...FONTS.h3,
                          color: COLORS.darkGray,
                        }}>
                        Msg{' - '}
                        <Text style={{color: COLORS.darkGray}}>
                          {ele.comment}
                        </Text>
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          getAssignWorkId(ele._id);
                          setRevertModal(true);
                        }}>
                        <ImageBackground
                          style={{
                            backgroundColor: COLORS.rose_600,
                            paddingHorizontal: 6,
                            borderRadius: 2,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: COLORS.white,
                            }}>
                            Reply
                          </Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </Swipeable>
            );
          })}
        </View>
      );
    };

    return (
      <SwipeListView
        data={data}
        keyExtractor={item => `${item._id}`}
        contentContainerStyle={{}}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        maxHeight={400}
        showsVerticalScrollIndicator={false}
        disableRightSwipe={true}
        renderItem={renderItem}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                height: 1,
                backgroundColor: COLORS.gray,
                marginVertical: 12,
              }}></View>
          );
        }}
      />
    );
  }

  function renderStartDate() {
    return (
      <View style={{marginTop: 10}}>
        {/* <Text style={{...FONTS.h3, color: 'black'}}>New Date & Time</Text> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{}}>
            <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
              Date - {formatedDate}
            </Text>
            <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
              Time - {formatedTime}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={showDatepicker}
              style={{
                borderWidth: 1,
                padding: 6,
                borderRadius: 2,
                right: 15,
              }}>
              <Image
                source={icons.date}
                style={{
                  width: 22,
                  height: 22,
                  tintColor: COLORS.black,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showTimepicker}
              style={{borderWidth: 1, padding: 6, borderRadius: 2}}>
              <Image
                source={icons.time}
                style={{
                  width: 22,
                  height: 22,
                  tintColor: COLORS.black,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderRevertModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={revertModal}>
        <TouchableWithoutFeedback onPress={() => setRevertModal(false)}>
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
                backgroundColor: COLORS.white,
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.radius,
                width: '90%',
                top: '30%',
                borderRadius: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={{fontSize: 20, color: COLORS.darkGray}}>
                  New targeted date & time
                </Text>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity onPress={() => setRevertModal(false)}>
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

              {renderStartDate()}

              {/* <FormInput
                label={'Comment'}
                placeholder=""
                multiline={true}
                numberOfLines={3}
                onChange={value => {
                  setRevertMsg(value);
                }}
              /> */}
              {/* <View
                style={{
                  marginTop: SIZES.base,
                  paddingHorizontal: SIZES.base,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.gray,
                }}>
                <TextInput
                  placeholder="Write your message here.."
                  
                  multiline={true}
                  numberOfLines={3}
                  onChange={value => {
                    setRevertMsg(value);
                  }}
                />
              </View> */}

              <TouchableOpacity
                style={{
                  marginTop: SIZES.padding,
                  alignItems: 'center',
                }}
                onPress={() => OnSubmit()}>
                <Text
                  style={{
                    ...FONTS.h3,
                    backgroundColor: COLORS.lightblue_800,
                    paddingHorizontal: SIZES.radius,
                    paddingVertical: 5,
                    borderRadius: 3,
                    color: COLORS.white,
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <View
      style={{
        marginTop: SIZES.padding,
        marginHorizontal: SIZES.radius,
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 5,
        ...styles.shadow,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.darkGray,
            marginBottom: SIZES.radius,
          }}>
          Assigned Works
        </Text>
        <></>
      </View>
      {renderRevertModal()}
      {renderRoleFilterModal()}
      {renderSwipeList()}

      <DeleteConfirmationToast
        isVisible={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title={'Are You Sure?'}
        message={'Do you really want to delete this work?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => fetchAssignWorkDelete()}
      />
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
  cartItemContainer: {
    marginBottom: SIZES.base,
    paddingVertical: SIZES.radius,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.base,
  },
});

export default AssignedWorks;
