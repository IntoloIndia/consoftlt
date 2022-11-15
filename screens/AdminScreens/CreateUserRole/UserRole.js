import React from 'react';
import {
  View,
  Text,
  Modal,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  HeaderBar,
  TextButton,
  FormInput,
  CustomToast,
} from '../../../Components';
import {COLORS, FONTS, SIZES, icons} from '../../../constants';
import {postUserRole} from '../../../controller/UserRoleController';
import utils from '../../../utils';
import {useSelector} from 'react-redux';
import {
  getUserRole,
  updateUserRole,
} from '../../../controller/UserRoleController';

const UserRole = () => {
  // COMPANY & USER DATA
  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);

  var companyData;
  if (companyDetail._id) {
    companyData = companyDetail;
  } else {
    companyData = userData;
  }
  const company_id = companyData._id;

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [updateToast, setUpdateToast] = React.useState(false);
  const [submitToast, setSubmitToast] = React.useState(false);
  const [createUserModal, setCreateUserModal] = React.useState(false);

  // FORM STATES
  const [userRole, setUserRole] = React.useState('');
  const [userRoles, setUserRoles] = React.useState([]);

  //ERROR STATES
  const [userRoleError, setUserRoleError] = React.useState('');

  // ====================================Apis ==============================

  const submitUserRole = async () => {
    const formData = {user_role: userRole, company_id: company_id};
    let response = await postUserRole(formData);
    if (response.status === 200) {
      setSubmitToast(true);
      setCreateUserModal(false);
      setUserRole('');
      getUsersRole();
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 1500);
  };

  const getUsersRole = async () => {
    let response = await getUserRole(company_id);
    if (response.status === 200) {
      setUserRoles(response.data);
    }
  };

  const [roleId, setRoleId] = React.useState('');

  const onEdit = (id, name) => {
    setRoleId(id);
    setUserRole(name);
    setCreateUserModal(true);
  };

  const onEditUserRole = async () => {
    const formData = {user_role: userRole, company_id: company_id};
    const response = await updateUserRole(roleId, formData);
    if (response.status === 200) {
      setCreateUserModal(false);
      setUpdateToast(true);
      getUsersRole();
      setUserRole('');
      setRoleId('');
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 1000);
  };

  React.useEffect(() => {
    getUsersRole();
  }, []);

  function renderAddUserRoleModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={createUserModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
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
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 25, color: COLORS.darkGray}}>
                User Role
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setCreateUserModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <ScrollView>
              <FormInput
                label="User role"
                keyboardType="default"
                value={userRole}
                onChange={value => {
                  utils.validateText(value, setUserRoleError);
                  setUserRole(value);
                }}
                errorMsg={userRoleError}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        userRole == '' ||
                        (UserRole != '' && userRoleError == '')
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          userRole == ''
                            ? COLORS.gray
                            : userRole != '' && userRoleError == ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
            </ScrollView>
            <TextButton
              label={roleId != '' ? 'Update' : 'Save'}
              buttonContainerStyle={{
                height: 45,
                alignItems: 'center',
                marginTop: SIZES.padding,
                borderRadius: SIZES.base,
                backgroundColor: COLORS.lightblue_700,
              }}
              onPress={roleId != '' ? onEditUserRole : submitUserRole}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderUserRole() {
    const renderItem = ({item, index}) => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
            {index + 1}.
          </Text>
          <Text
            style={{
              ...FONTS.h3,
              left: 5,
              color: COLORS.darkGray,
              textTransform: 'capitalize',
            }}>
            {item.user_role}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              onEdit(item._id, item.user_role);
            }}>
            <ImageBackground
              style={{
                backgroundColor: COLORS.green,
                padding: 3,
                borderRadius: 2,
                right: 12,
              }}>
              <Image
                source={icons.edit}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: COLORS.white,
                }}
              />
            </ImageBackground>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => console.log('delete')}>
            <ImageBackground
              style={{
                backgroundColor: COLORS.rose_600,
                padding: 3,
                borderRadius: 2,
              }}>
              <Image
                source={icons.delete_icon}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: COLORS.white,
                }}
              />
            </ImageBackground>
          </TouchableOpacity> */}
        </View>
      </View>
    );

    return (
      <FlatList
        contentContainerStyle={{
          marginHorizontal: SIZES.padding,
          paddingBottom: 50,
        }}
        data={userRoles}
        keyExtractor={item => `${item._id}`}
        renderItem={renderItem}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                height: 1,
                backgroundColor: COLORS.lightGray1,
                marginVertical: 12,
              }}></View>
          );
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <HeaderBar right={true} title="User Role" />
      <TextButton
        label="Add New"
        buttonContainerStyle={{
          height: 45,
          alignItems: 'center',
          marginHorizontal: SIZES.radius,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightblue_700,
          ...styles.shadow,
        }}
        onPress={() => {
          setUserRole('');
          setRoleId('');
          setCreateUserModal(true);
        }}
      />
      {renderAddUserRoleModal()}
      {renderUserRole()}
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
    </View>
  );
};
export default UserRole;

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
});
