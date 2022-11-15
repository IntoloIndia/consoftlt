import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Button,
  Text,
  FlatList,
} from 'react-native';
import {HeaderBar} from '../../../../Components';
import {Title, Card} from 'react-native-paper';
import {Calendar} from 'react-native-calendars';
import {COLORS} from '../../../../constants';
import CustomCalender from './CustomCalender';

const Calenderleaves = () => {
  const [leavesdate, setLeavesDate] = useState([])
  const {
    calendarRows,
    selectedDate,
    todayFormatted,
    daysShort,
    monthNames,
    getNextMonth,
    getPrevMonth,
  } = CustomCalender();

  const dateClickHandler = date => {
    setLeavesDate(date)
  };
  // console.log(leavesdate)
  return (
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
                      <TouchableOpacity onPress={getPrevMonth}>
                        <Text style={{marginRight: 10, fontSize: 18}}>
                          Prev
                        </Text>
                      </TouchableOpacity>
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
                marginBottom: 20,
               
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
                  {cols.map(col =>
                  
                    col.date === todayFormatted ? (
                      <TouchableOpacity
                        key={col.date}
                        style={[todayFormatted?{backgroundColor:"green",padding:5}:null]} 
                        // style={{color:"red"}}
                        onPress={() =>
                         {
                          dateClickHandler(col.date)
                          
                        }
                       }>
                          
                        <Title style={{color:"#fff"}} >{col.value}</Title>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={col.date}
                        className={col.classes}
                        onPress={() => {dateClickHandler(col.date)
                          
                          }
                        }>
                        <Title style={[col.classes=="in-prev-month"?{opacity:0.5}
                        :col.classes=="in-next-month"?{opacity:0.5}:null]}>{col.value}</Title>
                      </TouchableOpacity>
                    ),
                  )}
                  
                </View>
              );
            })}
          </Card.Content>
        </Card>
      </View>
  );
};

export default Calenderleaves;

const styles = StyleSheet.create({
  // .table {
  //   margin: 0 auto 20px;
  // }
// today :{
//   "today":{
//     backgroundColor: "#009e6c",
//     color: "#fff",

//   }
//   }
  // .in-prev-month,
  // .in-next-month {
  //   opacity: 0.5;
  // }
});
