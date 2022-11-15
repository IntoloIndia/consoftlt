import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import {COLORS, SIZES, FONTS, icons} from '../../../constants';
import {getUserAttendance} from '../../../controller/UserAttendanceController';
import {useSelector} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import {getUsers} from '../../../controller/UserRoleController';

const Attendance = () => {
  const [filterModal, setFilterModal] = React.useState(false);

  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);
  var companyData;
  if (companyDetail._id) {
    companyData = companyDetail;
  } else {
    companyData = userData;
  }
  const company_id = companyData._id;

  const [attendance, setAttendance] = React.useState('');

  //
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

  const [openUsers, setOpenUsers] = React.useState(false);
  const [usersValue, setUsersValue] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  const fetchUsers = async () => {
    let response = await getUsers(company_id);
    if (response.status === 200) {
      let roleDataFromApi = response.data.map((one, i) => {
        return {label: one.name, value: one._id};
      });
      setUsers(roleDataFromApi);
    }
  };

  const onYearOpen = () => {
    setOpenMonths(false);
    setOpenUsers(false);
  };

  const onMonthOpen = () => {
    setOpenYears(false);
    setOpenUsers(false);
  };

  const onUserOpen = () => {
    setOpenMonths(false);
    setOpenYears(false);
  };

  const user_id = usersValue == '' ? '' : usersValue;
  const [date, setDate] = React.useState(new Date());
  const year = yearsValue == '' ? date.getFullYear() : yearsValue;
  const month =
    monthsValue == '' ? ('0' + (date.getMonth() + 1)).slice(-2) : monthsValue;

  const userAttendance = async () => {
    let response = await getUserAttendance(company_id, year, month, user_id);
    setAttendance(response.data);
  };

  React.useEffect(() => {
    userAttendance();
    fetchUsers();
  }, []);

  function renderUserAttendance() {
    const renderItem = ({item, index}) => (
      <View>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.darkGray,
            textTransform: 'capitalize',
          }}>
          {index + 1}. {item.user_name}
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
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            color: COLORS.darkGray,
            marginBottom: 5,
          }}>
          Apply filters -
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <View style={{width: '25%'}}>
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
          <View style={{width: '28%'}}>
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

          <View style={{width: '42%'}}>
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
              placeholder="Users"
              open={openUsers}
              value={usersValue}
              items={users}
              setOpen={setOpenUsers}
              setValue={setUsersValue}
              setItems={setUsers}
              maxHeight={80}
              onOpen={onUserOpen}
              onChangeValue={userAttendance}
            />
          </View>
        </View>
        <Text style={{fontSize: 18, fontWeight: '500', color: COLORS.darkGray}}>
          All Employee Attendance -
        </Text>
        <FlatList
          contentContainerStyle={{marginTop: 10, paddingBottom: 20}}
          data={attendance}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          scrollEnabled={true}
          maxHeight={550}
          showsVerticalScrollIndicator={false}
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
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white, padding: 15}}>
      {renderUserAttendance()}
    </View>
  );
};

export default Attendance;
