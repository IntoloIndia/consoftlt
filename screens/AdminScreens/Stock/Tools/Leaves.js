import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import {HeaderBar, TextButton} from '../../../../Components';
import {Title, Card} from 'react-native-paper';
import {SIZES, COLORS} from '../../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomCalender from './CustomCalender';

const Leaves = () => {
  const [leavesmodal, setLeavesModal] = useState(false);
  const [leavesdate, setLeavesDate] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  const {
    calendarRows,
    selectedDate,
    todayFormatted,
    daysShort,
    monthNames,
    getNextMonth,
    getPrevMonth,
  } = CustomCalender();

  const dateClickHandler = (date, i) => {
    // console.log(date);
    const newDate = [...leavesdate, date];
    setLeavesDate(newDate);
    setSelectedId(i);
  };

  // console.log(selectedId);
  // console.log(leavesdate);


  const submitLeaves=()=>{
    // alert(JSON.stringify(leavesdate))
      //const leavesdata = {
      //   option_type:leavesdate,
      //   company_id:user_id
      // };
      // try {
      //   fetch(`${config.API_URL}checklist-option-type`, {
      //     method: 'POST',
      //     headers: {
      //       Accept: 'application/json',
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(leavesdata),
      //   })
      //     .then(response => response.json())
      //     .then(data => {
      //       check();
      //       console.log('Success:', data);
      //     });
      // } catch (error) {
      //   console.error('Error:', error);
      // }
  }

  return (
    <View>
      <HeaderBar right={true} title="Leaves" />
      <View
        style={{
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.white,
          ...styles.shadow,
          marginHorizontal: SIZES.padding,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          padding: 20,
          borderWidth: 1,
          elevation: 0.9,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontSize:15,fontWeight:"bold",}}>Name:-{"Anmol"}</Text>
          <Text style={{fontSize:15,fontWeight:"bold",}}>Designation:-{"Empyloee"}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontSize:15,fontWeight:"bold",}}>Email:-{"anmol@gmail.com"}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontSize:15,fontWeight:"bold",}}>Emp_id:-{"101"}</Text>
          <Text style={{fontSize:15,fontWeight:"bold",}}>Join_Date:-{"20/08/2022"}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontSize:15,fontWeight:"bold"}}>Mobile-No:-{"8989898989"}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
          }}>
          <TextButton
            label="Apply leaves"
            buttonContainerStyle={{
              paddingHorizontal: SIZES.base,
              borderRadius: 5,
            }}
            // labelStyle={{...FONTS.h5}}
            onPress={() => setLeavesModal(true)}
          />
        </View>
      </View>
      {/* leacves modal start  */}
      <Modal transparent={false} visible={leavesmodal} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000aa',
            // justifyContent: 'center',
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              marginTop: 50,
              padding: 10,
              borderRadius: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Title>Leaves from </Title>
              <Pressable onPress={setLeavesModal}>
                <AntDesign name="close" size={30} color="black" />
              </Pressable>
            </View>
            <View style={{marginTop: 10}}>
              <View>
                <Card style={{borderWidth: 2, elevation: 10, margin: 10}}>
                  <Card.Content>
                    <View>
                      <Card style={{borderWidth: 2}}>
                        <Card.Content>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <Title>
                              {`${
                                monthNames[selectedDate.getMonth()]
                              }-${selectedDate.getFullYear()}`}
                            </Title>
                            {/* <Text>Today{todayFormatted}</Text> */}
                            <View style={{flexDirection: 'row'}}>
                              <TouchableOpacity onPress={getNextMonth}>
                                <Text style={{fontSize: 18}}>Next</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        marginBottom: 15,
                        marginTop: 25,
                      }}>
                      {daysShort.map(day => (
                        <Title key={day}>{day}</Title>
                      ))}
                    </View>

                    {Object.values(calendarRows).map((cols, index) => {
                      // {console.log(cols)}
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
                                  dateClickHandler(col.date, i);
                                }}>
                                <Title style={{color: '#fff'}}>
                                  {col.value}
                                </Title>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                key={i}
                                className={col.classes}
                                onPress={() => {
                                  dateClickHandler(col.date, i);
                                  // console.log(col.date);
                                  //  console.log("index",index)
                                }}>
                                {/* { console.log(index)} */}
                                <Title
                                  style={[
                                    col.classes == 'in-prev-month'
                                      ? {opacity: 0.5}
                                      : col.classes == 'in-next-month'
                                      ? {opacity: 0.5}
                                      : leavesdate == col.date
                                      ? // : col.date == leavesdate
                                        {
                                          backgroundColor: 'red',
                                          borderRadius: 50,
                                          paddingHorizontal: 10,
                                          marginLeft: -5,
                                        }
                                      : {
                                          backgroundColor: COLORS.gray3,
                                          borderRadius: 50,
                                          paddingHorizontal: 10,
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
                  </Card.Content>
                </Card>
              </View>
            </View>
            <View>
              <TextButton
                label="Save"
                buttonContainerStyle={{
                  height: 45,
                  borderRadius: SIZES.radius,
                  marginTop: SIZES.padding,
                }}
                onPress={() => submitLeaves()}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* modal end  */}
     
      <View
        style={{
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.white,
          ...styles.shadow,
          marginHorizontal: SIZES.padding,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
        }}>
        <Card style={{borderWidth: 2, elevation: 10}}>
          <Card.Content>
            <View>
              {/* <Card style={{borderWidth: 2}}>
                <Card.Content> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Title>
                  {`${
                    monthNames[selectedDate.getMonth()]
                  }-${selectedDate.getFullYear()}`}
                </Title>
                {/* <Text>Today{todayFormatted}</Text> */}
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={getPrevMonth}>
                    <Text style={{marginRight: 10, fontSize: 18}}>Prev</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={getNextMonth}>
                    <Text style={{fontSize: 18}}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* </Card.Content>
              </Card> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                marginBottom: 10,
                marginTop: 5,
              }}>
              {daysShort.map(day => (
                <Title key={day}>{day}</Title>
              ))}
            </View>

            {Object.values(calendarRows).map(cols => {
              // {console.log(cols)}
              return (
                <View
                  key={cols[0].date}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                    // backgroundColor:"red"
                  }}>
                  {cols.map((col,i) =>
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
                        // style={{color:"red"}}
                      >
                        <Title style={{color: '#fff'}}>{col.value}</Title>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity key={col.date} className={col.classes}>
                        <Title
                          style={[
                            col.classes == 'in-prev-month'
                              ? {opacity: 0.5}
                              : col.classes == 'in-next-month'
                              ? {opacity: 0.5}
                              : {
                                  backgroundColor: COLORS.gray3,
                                  borderRadius: 50,
                                  paddingHorizontal: 10,
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
            <View>
              <Text style={{fontSize: 15}}>Working days:{26}</Text>
              <Text style={{fontSize: 15}}>Leaves days:{4}</Text>
              <Text style={{fontSize: 15}}>Total days:{30}</Text>
            </View>
          </Card.Content>
        </Card>
        {/* <View>
         <Text>Card</Text>
        </View> */}
      </View>
    </View>
  );
};

export default Leaves;

const styles = StyleSheet.create({});





