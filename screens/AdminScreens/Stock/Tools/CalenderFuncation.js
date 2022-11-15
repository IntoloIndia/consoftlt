import React, {useEffect, useState, Fragment} from 'react';
import {
  StyleSheet,
  Button,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import {Title} from 'react-native-paper';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns';
import {COLORS, FONTS, SIZES} from '../../../../constants';
import {HeaderBar} from '../../../../Components';

const weekdays = [
  {
    key: '1',
    name: 'Sun',
  },
  {
    key: '2',
    name: 'Mon',
  },
  {
    key: '3',
    name: 'Tus',
  },
  {
    key: '4',
    name: 'Wed',
  },
  {
    key: '5',
    name: 'Thus',
  },
  {
    key: '6',
    name: 'Fri',
  },
  {
    key: '7',
    name: 'Sat',
  },
];

const numColumns = 9;
const WIDTH = Dimensions.get('window').width

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// const Item = ({ title }) => (
//   <View style={styles.item}>
//     <Text style={styles.title}>{title}</Text>
//   </View>
// );

const CalenderFuncation = () => {
  let today = startOfToday();
  // console.log(today)
  let [selectedDay, setSelectedDay] = useState(today);
  // console.log(selectedDay)
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });
  // console.log(days)

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, {months: -1});
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, {months: +1});
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  // let selectedDayMeetings = meetings.filter((meeting) =>
  //   isSameDay(parseISO(meeting.startDatetime), selectedDay)
  // )
  //

  const formateDate =(weekdays,numColumns)=>{
    const totalRows = Math.floor(weekdays.length/numColumns)
    let totalLassRow =weekdays.length-(totalRows*numColumns)

    while(totalLassRow!==0 && totalLassRow!==numColumns){
      weekdays.push({key:'bank',empty:true})
      totalLassRow++;
    }
    return weekdays;
  }
  const renderItem = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: COLORS.blue,
         
          alignItems:"center",
          margin:0.5,
          flexWrap:'wrap',
          // height: WIDTH/numColumns,
          flex:1
        }}>
        <Title style={{}}>{item.name}</Title>
       </View>
    );
  };
  return (
    <View
      style={{
       flex:1
      }}>
      <HeaderBar />
      <View style={{backgroundColor: 'yellow',margin:10,padding:10}}>
        <View>
          <View>
            <View
              style={{
              flexDirection:"row",justifyContent:"space-between",alignItems:"center"
              }}>
              <Title>{format(firstDayCurrentMonth, 'MMMM yyyy')}</Title>
             
                <TouchableOpacity onPress={previousMonth}>
                  <Text style={{paddingRight: 10}}>Previous month</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextMonth}>
                  <Text>Next month</Text>
                </TouchableOpacity>
             </View>
           

           
              <FlatList
                data={formateDate(weekdays,numColumns)}
                renderItem={renderItem}
                keyExtractor={(item, key) => key.toString()}
                numColumns={9}
              />
           
            
           

            <View>
              {days.map((day, dayIdx) => (
                <View
                  
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                  )}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDay(day);

                      //   isEqual(day, selectedDay) && 'text-white',
                      //   !isEqual(day, selectedDay) &&
                      //     isToday(day) &&
                      //     tw`text-red-500`,
                      //   !isEqual(day, selectedDay) &&
                      //     !isToday(day) &&
                      //     isSameMonth(day, firstDayCurrentMonth) &&
                      //     'text-gray-900',
                      //   !isEqual(day, selectedDay) &&
                      //     !isToday(day) &&
                      //     !isSameMonth(day, firstDayCurrentMonth) &&
                      //     'text-gray-400',
                      //   isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                      //   isEqual(day, selectedDay) &&
                      //     !isToday(day) &&
                      //     'bg-gray-900',
                      //   !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                      //   (isEqual(day, selectedDay) || isToday(day)) &&
                      //     'font-semibold',
                      //   'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                    }}>
                    <Title dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'dd')}
                    </Title>
                  </TouchableOpacity>

                  <View>
                    {/* {meetings.some((meeting) =>
                        isSameDay(parseISO(meeting.startDatetime), day)
                      ) && (
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                      )} */}
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View>
            <Text>
              Schedule for{' '}
              <Title dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                {format(selectedDay, 'MMM dd, yyy')}
              </Title>
            </Text>
            {/* <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                {selectedDayMeetings.length > 0 ? (
                  selectedDayMeetings.map((meeting) => (
                    <Meeting meeting={meeting} key={meeting.id} />
                  ))
                ) : (
                  <p>No meetings for today.</p>
                )}
              </ol> */}
          </View>
        </View>
      </View>
     
    </View>
  );
};

export default CalenderFuncation;

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];

const styleSheet = StyleSheet.create({});
