import React, {useState, useEffect, useMemo} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {Title} from 'react-native-paper';
import {
  SIZES,
  COLORS,
  icons,
  FONTS,
  images,
  INTERNAL_SERVER_ERROR,
} from '../../../constants';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {getUserAttendance} from '../../../controller/UserAttendanceController';
import CustomCalender from './CustomCalender';
import {useSelector} from 'react-redux';
import Collapsible from 'react-native-collapsible';
import DropDownPicker from 'react-native-dropdown-picker';

const MyProfile = () => {
  const userData = useSelector(state => state.user);
  const user_id = userData._id;

  const [leavesmodal, setLeavesModal] = useState(false);
  const [leavesdate, setLeavesDate] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [userDetail, setUserDetail] = useState([]);
  const [showleaves, setShowLeaves] = useState([]);
  const [monthshow, setMonthShow] = useState([]);
  const [leavesday, setLeavesDay] = useState([]);
  const [haliddayates, setHalidayDates] = useState([]);
  const [loginTime, setLoginTime] = useState('');
  const [logoutTime, setLogoutTime] = useState('');

  const [allAppliedLeave, setAllAppliedLeave] = useState('');

  const [attendance, setAttendance] = React.useState('');
  // console.log(userDetail);
  // const [removedate, setRemoveDate] = useState(false)
  const [pushdate, setPushDate] = useState([]);

  const {
    calendarRows,
    selectedDate,
    todayFormatted,
    daysShort,
    monthNames,
    getNextMonth,
    getPrevMonth,
  } = CustomCalender();
  // console.log(todayFormatted)

  useEffect(() => {
    fetch(`${process.env.API_URL}user/${userData._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // authorization: `Bearer ${userData.token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserDetail(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const userAttendance = async () => {
    let response = await getUserAttendance(
      userData.company_id,
      year,
      month,
      user_id,
    );
    // console.log('response--', response);
    // console.log(userData.company_id,year,month,user_id)
    if (response.data.length > 0) {
      response.data.map(ele => {
        let data = ele.presentdates;
        data.map(e => {
          let inTime = e.in_time;
          let outTime = e.out_time;

          setLoginTime(inTime);
          setLogoutTime(outTime);
        });
      });
    }
    // setAttendance(response.data);
  };

  React.useEffect(() => {
    // userLeaves();
    userAttendance();
  }, []);

  const dateClickHandler = (date, i) => {
    //  const newDate= removedate?[...leavesdate, date]:leavesdate.pop(date);
    const selectDate = [...leavesdate, date];
    // setLeavesDate(date=> [...leavesdate,  ${date.length}`]);
    // if(leavesdate){
    // const obj = [...new Map(
    // leavesdate.map(item => [JSON.stringify(item), item])).values()];
    // setPushDate(obj);
    // }
    setLeavesDate(selectDate);
    setSelectedId(i);
    const newselectdate = [...new Set(leavesdate), date];
    // console.log(newselectdate);
    setPushDate(newselectdate);
  };

  const submitLeaves = () => {
    const applyleaves = {
      leavedates: pushdate,
      user_id: user_id,
      company_id: userData.company_id,
    };
    // console.log(applyleaves)
    try {
      fetch(`${process.env.API_URL}apply-leaves`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applyleaves),
      })
        .then(response => response.json())
        .then(data => {
          showleavesdata(data);
          // console.log('Success:', data);
        });
    } catch (error) {
      console.error('Error:', error);
    }
    setLeavesModal(false);
  };

  // get data api leaves apply for user

  const showleavesdata = async () => {
    const resp = await fetch(process.env.API_URL + 'attendance/' + user_id);
    const leavesDate = await resp.json();
    setShowLeaves(leavesDate);
  };

  const appliedLeave = async () => {
    const resp = await fetch(
      process.env.API_URL + 'leaves/' + userData.company_id,
    );
    const leavesDate = await resp.json();
    if (leavesDate.data.length > 0) {
      leavesDate.data.map((ele, idx) => {
        setAllAppliedLeave(ele.leavedates);
      });
    }
  };

  useEffect(() => {
    showleavesdata();
    userPresentDays();
    appliedLeave();
  }, []);

  useMemo(() => {
    if (showleaves.data) {
      showleaves.data.map(ele => {
        // console.log(ele)
        setMonthShow(ele);
      });
    }
  }, [showleaves]);

  useMemo(() => {
    if (monthshow.months) {
      monthshow.months.map((month, index) => {
        setLeavesDay(month);
      });
    }
  }, [showleaves]);

  // useMemo(() => {
  //   if (leavesday.leavedays) {

  //      leavesday.leavedays.map((days,index)=> {
  //         console.log(days)
  //       // console.log(index)
  //       let dates = days.leave_date
  //         // console.log(dates)
  //       setHalidayDates(dates)
  //     });
  //   }
  // }, []);

  // console.log(haliddayates)

  const ClearDate = () => {
    setPushDate('');
    setLeavesDate('');
  };

  // const TodayDate = () => {

  // };

  var dt = new Date();
  var dt = new Date();

  var hours = dt.getHours(); // gives the value in 24 hours format
  var AmOrPm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  var minutes = dt.getMinutes();
  // var finalTime = "Time  - " + hours + ":" + minutes + " " + AmOrPm;
  var finalTime = hours + ':' + minutes + AmOrPm;

  //===================================================================
  // saurabh
  const [collapsed1, setCollapsed1] = React.useState(true);
  const toggleExpanded1 = () => {
    setCollapsed1(!collapsed1);
  };
  const [attendancedDate, setAttendanceDate] = React.useState('');

  const [date, setDate] = React.useState(new Date());

  const [openMonths, setOpenMonths] = React.useState(false);
  const [monthsValue, setMonthsValue] = React.useState('');
  const [months, setMonths] = React.useState([
    {label: 'Jan', value: '01'},
    {label: 'Feb', value: '02'},
    {label: 'Mar', value: '03'},
    {label: 'Apr', value: '04'},
    {label: 'May', value: '05'},
    {label: 'Jun', value: '06'},
    {label: 'Jul', value: '07'},
    {label: 'Aug', value: '08'},
    {label: 'Sept', value: '09'},
    {label: 'Oct', value: '10'},
    {label: 'Nov', value: '11'},
    {label: 'Dec', value: '12'},
  ]);

  const currentYear = new Date().getFullYear();

  const [openYears, setOpenYears] = React.useState(false);

  const [yearsValue, setYearsValue] = React.useState('');

  const [years, setYears] = React.useState([
    {label: currentYear, value: currentYear},
    {label: currentYear - 1, value: currentYear - 1},
    {label: currentYear - 2, value: currentYear - 2},
  ]);

  const onYearOpen = () => {
    setOpenMonths(false);
  };

  const onMonthOpen = () => {
    setOpenYears(false);
  };

  const year = yearsValue == '' ? date.getFullYear() : yearsValue;

  const month =
    monthsValue == '' ? ('0' + (date.getMonth() + 1)).slice(-2) : monthsValue;


  const [leaveFilterDate, setLeaveFilterDate] = React.useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setLeaveFilterDate(currentDate);
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');  
  };

  const userPresentDays = async () => {
    let response = await getUserAttendance(
      userData.company_id,
      year,
      month,
      user_id,
    );
    setAttendanceDate(response.data);
  };

  function renderUserAttendance() {
    const renderItem = ({item}) => (
      <View>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.darkGray,
            textTransform: 'capitalize',
          }}>
          {item.user_name}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            // justifyContent:'space-evenly',
          }}>
          {item.presentdates.map((ele, i) => (
            <View
              key={i}
              style={{
                marginTop: 5,
                flexBasis: '20%',
              }}>
              <View
                style={{
                  backgroundColor: COLORS.success_700,
                  padding: 5,
                  alignItems: 'center',
                  borderLeftWidth: i != 0 && i % 5 ? 5 : null,
                  borderColor: 'white',
                }}>
                <Text style={{fontSize: 9, color: COLORS.white}}>
                  {ele.present_date}
                </Text>
                <Text style={{fontSize: 8, color: COLORS.white}}>
                  In - {ele.in_time}
                </Text>
                <Text style={{fontSize: 8, color: COLORS.white}}>
                  Out - {ele.out_time}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );

    return (
      <View
        style={{
          margin: 15,
          padding: 15,
          backgroundColor: COLORS.white,
          elevation: 5,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={toggleExpanded1}>
          <Text style={{...FONTS.h2, color: COLORS.darkGray}}>Attendance</Text>
          <Image
            source={icons.down_arrow}
            style={{height: 20, width: 20, tintColor: 'black'}}
          />
        </TouchableOpacity>
        <Collapsible collapsed={collapsed1}>
          <View
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 50,
            }}>
            <View style={{width: '45%'}}>
              <DropDownPicker
                style={{
                  borderWidth: null,
                  borderRadius: null,
                  backgroundColor: COLORS.gray3,
                  minHeight: 30,
                }}
                dropDownContainerStyle={{
                  borderWidth: null,
                  borderRadius: null,
                  backgroundColor: COLORS.gray3,
                }}
                placeholder="Year"
                open={openYears}
                value={yearsValue}
                items={years}
                setOpen={setOpenYears}
                setValue={setYearsValue}
                setItems={setYears}
                onChangeValue={userAttendance}
                maxHeight={80}
                onOpen={onYearOpen}
              />
            </View>
            <View style={{width: '45%'}}>
              <DropDownPicker
                style={{
                  borderWidth: null,
                  borderRadius: null,
                  backgroundColor: COLORS.gray3,
                  minHeight: 30,
                }}
                dropDownContainerStyle={{
                  borderWidth: null,
                  borderRadius: null,
                  backgroundColor: COLORS.gray3,
                }}
                placeholder="Month"
                open={openMonths}
                value={monthsValue}
                items={months}
                setOpen={setOpenMonths}
                setValue={setMonthsValue}
                setItems={setMonths}
                maxHeight={80}
                onChangeValue={userAttendance}
                onOpen={onMonthOpen}
              />
            </View>
          </View>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              borderWidth: 1,
              width: '100%',
              height: '100%',
            }}>
            <FlatList
              data={attendancedDate}
              contentContainerStyle={{
                // marginTop: SIZES.radius,
                paddingBottom: 20,
              }}
              keyExtractor={item => `${item._id}`}
              renderItem={renderItem}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              maxHeight={200}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: COLORS.gray2,
                      marginVertical: 12,
                    }}></View>
                );
              }}
            />
          </ScrollView>
        </Collapsible>
      </View>
    );
  }

  function renderModal() {
    return (
      <Modal transparent={false} visible={leavesmodal} animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.transparentBlack7,
          }}>
          <View
            style={{
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
                marginBottom: 15,
              }}>
              <Text style={{fontSize: 25, color: COLORS.darkGray}}>Leaves</Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={setLeavesModal}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View style={{}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                  {`${
                    monthNames[selectedDate.getMonth()]
                  }-${selectedDate.getFullYear()}`}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={getPrevMonth}>
                    <Text
                      style={{
                        marginRight: 10,
                        ...FONTS.h3,
                        color: COLORS.darkGray,
                      }}>
                      Prev
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={getNextMonth}>
                    <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  marginBottom: 15,
                  marginTop: 20,
                }}>
                {daysShort.map((day, index) => (
                  <Title
                    style={[index == 6 ? {color: 'red'} : null]}
                    key={index}>
                    {day}
                  </Title>
                ))}
              </View>

              {Object.values(calendarRows).map((cols, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      // backgroundColor:"red"
                    }}>
                    {cols.map((col, i) =>
                      col.date === todayFormatted ? (
                        <TouchableOpacity
                          key={i}
                          style={[
                            todayFormatted
                              ? {
                                  backgroundColor: 'green',
                                  borderRadius: 50,
                                  paddingHorizontal: 10,
                                  marginLeft: -5,
                                }
                              : null,
                          ]}
                          onPress={() => {
                            dateClickHandler({leave_date: col.date});
                          }}>
                          <Title style={{color: '#fff'}}>{col.value}</Title>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          key={i}
                          className={col.classes}
                          onPress={() => {
                            dateClickHandler({leave_date: col.date});
                          }}>
                          <Title
                            style={[
                              col.classes == 'in-prev-month'
                                ? {opacity: 0.5}
                                : col.classes == 'in-next-month'
                                ? {opacity: 0.5}
                                : i == 6
                                ? {
                                    backgroundColor: 'orange',
                                    borderRadius: 50,
                                    paddingHorizontal: 5,
                                    marginLeft: -5,
                                  }
                                : col.date == leavesdate[i]
                                ? {
                                    backgroundColor: 'red',
                                    borderRadius: 50,
                                    paddingHorizontal: 5,
                                    marginLeft: -5,
                                    color: '#fff',
                                  }
                                : {
                                    backgroundColor: COLORS.gray3,
                                    borderRadius: 50,
                                    paddingHorizontal: 5,
                                    marginLeft: -5,
                                  },
                            ]}>
                            {col.value}
                          </Title>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                );
              })}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.lightblue_700,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    elevation: 3,
                  }}
                  onPress={() => submitLeaves()}>
                  <Text style={{...FONTS.h3, color: COLORS.white}}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    ClearDate();
                  }}
                  style={{
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    backgroundColor: COLORS.red,
                  }}>
                  <Text style={{...FONTS.h3, color: COLORS.white}}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginTop: 15}}>
              <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                {JSON.stringify(pushdate)}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function renderDetails() {
    return (
      <View
        style={{
          margin: 15,
          padding: 15,
          backgroundColor: COLORS.darkGray,
          elevation: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Text style={{...FONTS.h3, color: COLORS.white}}>Name - </Text>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.white,
              textTransform: 'capitalize',
            }}>
            {userDetail.name} ({userDetail.role})
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Image
            source={icons.email}
            style={{height: 15, width: 15, tintColor: COLORS.white}}
          />
          <Text style={{...FONTS.h3, color: COLORS.white, left: 10}}>
            {userDetail.email}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Image
            source={icons.account}
            style={{height: 15, width: 15, tintColor: COLORS.white}}
          />
          <Text style={{...FONTS.h3, color: COLORS.white, left: 10}}>
            {userDetail.role_id}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={icons.call}
            style={{height: 15, width: 15, tintColor: COLORS.white}}
          />
          <Text style={{...FONTS.h3, color: COLORS.white, left: 10}}>
            {userDetail.mobile}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: COLORS.lightblue_700,
            paddingHorizontal: 10,
            paddingVertical: 5,
            alignSelf: 'flex-start',
            elevation: 2,
          }}
          onPress={() => setLeavesModal(true)}>
          <Text style={{...FONTS.h3, color: COLORS.white}}>Apply leaves</Text>
        </TouchableOpacity>
        <View style={{marginTop: 5}}>
          {leavesday.leavedays != undefined
            ? leavesday.leavedays.map((Ldays, index) => {
                {
                  /* console.log(Ldays) */
                }
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {Ldays.leave_date}
                    </Text>

                    <TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          backgroundColor: 'orange',
                          marginTop: 2,
                          padding: 2,
                          margin: 2,
                        }}>
                        Pending
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            : null}
        </View>
        {/* leacves modal start  */}
      </View>
    );
  }

  const renderAllLeave = ({item}) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text style={{color: COLORS.darkGray}}>{item.leave_date}</Text>
          {item.approved == true ? (
            <Text style={{color: COLORS.green_400}}>Approoved</Text>
          ) : (
            <Text style={{color: COLORS.red}}>Unapproved</Text>
          )}
        </View>
      </View>
    );
  };

  function renderDetails1() {
    return (
      <View
        style={{
          flex: 1,
          // height:"100%",
          margin: 15,
          padding: 15,
          backgroundColor: COLORS.white2,
          elevation: 5,
        }}>
        <View
          style={{
            // flex:1,
            height: '100%',
            marginTop: 5,
            marginBottom: 15,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
              Applied Leave Roaster
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.darkGray,
                padding: 10,
                borderRadius: 2,
              }}
              onPress={showDatepicker}
            >
              <Image
                source={icons.filter}
                style={{height: 14, width: 14, tintColor: '#ffffff'}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: '100%',
              marginTop: 15,
            }}>
            <FlatList
              data={allAppliedLeave}
              contentContainerStyle={{
                borderWidth: 1,
                borderColor:COLORS.lightGray1,
                padding: 5,
                // height: '100%',
                paddingVertical: 10,
              }}
              keyExtractor={item => `${item._id}`}
              renderItem={renderAllLeave}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              // maxHeight={1000}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: COLORS.gray2,
                      marginVertical: 12,
                    }}></View>
                );
              }}
            />
          </View>
        </View>
      </View>
    );
  }
  return (
    <ScrollView style={{flex: 1}}>
      {/* {renderDetails()} */}
      {/* {renderDetails1()} */}
      {renderModal()}
      {renderUserAttendance()}
    </ScrollView>
  );
};

export default MyProfile;
