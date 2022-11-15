import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import {
  HeaderBar,
  CustomDropdown,
  TextButton,
  DeleteConfirmationToast,
  CustomToast,
} from '../../../Components';
import {
  getUserByPrivileges,
  getUserRole,
  roleByUser,
} from '../../../controller/UserRoleController';
import {getPrivileges} from '../../../controller/UserRoleController';
import {useSelector} from 'react-redux';
import {
  deleteReportPath,
  getProjectReportPath,
  postProjectReportPath,
  updateProjectReportPath,
} from '../../../controller/ReportController';
import {icons, images, SIZES, COLORS, FONTS} from '../../../constants';

const ReportSettings = ({route}) => {
  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);

  var companyData;
  if (companyDetail._id) {
    companyData = companyDetail;
  } else {
    companyData = userData;
  }

  const company_id = companyData._id;
  const {project_id} = route.params;

  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [submitToast, setSubmitToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);
  //modal
  const [pathAddModal, setPathAddModal] = React.useState(false);
  const [pathUpdateModal, setPathUpdatesModal] = React.useState(false);

  // STARTED BY
  const [openUserRole, setOpenUserRole] = React.useState(false);
  const [userRoleValue, setUserRoleValue] = React.useState([]);
  const [userRoles, setUserRoles] = React.useState([]);

  const [openUsers, setOpenUsers] = React.useState(false);
  const [usersValue, setUsersValue] = React.useState([]);
  const [users, setUsers] = React.useState([]);

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

  // on open role
  const onRoleOpen = React.useCallback(() => {
    getUserRoles();
    setOpenUsers(false);
    setOpenUserRole1(false);
    setOpenUsers1(false);
    setOpenPrivilege1(false);
    setOpenPrivilegeUser1(false);
    setOpenPrivilege2(false);
    setOpenPrivilegeUser2(false);
  }, []);

  // on open user
  const onUserOpen = React.useCallback(() => {
    setOpenUserRole(false);
    setOpenUserRole1(false);
    setOpenUsers1(false);
    setOpenPrivilege1(false);
    setOpenPrivilegeUser1(false);
    setOpenPrivilege2(false);
    setOpenPrivilegeUser2(false);
  }, []);

  // VERIFICATION 1
  const [openUserRole1, setOpenUserRole1] = React.useState(false);
  const [userRoleValue1, setUserRoleValue1] = React.useState([]);
  const [userRoles1, setUserRoles1] = React.useState([]);

  const [openUsers1, setOpenUsers1] = React.useState(false);
  const [usersValue1, setUsersValue1] = React.useState('');
  const [users1, setUsers1] = React.useState([]);

  const getUserRolesV1 = async () => {
    let response = await getUserRole(company_id);
    if (response.status === 200) {
      let roleDataFromApi = response.data.map((one, i) => {
        return {label: one.user_role, value: one._id};
      });
      setUserRoles1(roleDataFromApi);
    }
  };

  const getUserByRoleIdV1 = async role_id => {
    let response = await roleByUser(company_id, role_id);
    if (response.status === 200) {
      let roleDataFromApi = response.data.map(ele => {
        return {label: ele.name, value: ele._id};
      });
      setUsers1(roleDataFromApi);
    }
  };

  // on open role
  const onRoleOpen1 = React.useCallback(() => {
    getUserRolesV1();
    setOpenUsers(false);
    setOpenUserRole(false);
    setOpenUsers1(false);
    setOpenPrivilege1(false);
    setOpenPrivilegeUser1(false);
    setOpenPrivilege2(false);
    setOpenPrivilegeUser2(false);
  }, []);

  // on open user
  const onUserOpen1 = React.useCallback(() => {
    setOpenUserRole(false);
    setOpenUserRole1(false);
    setOpenUsers(false);
    setOpenPrivilege1(false);
    setOpenPrivilegeUser1(false);
    setOpenPrivilege2(false);
    setOpenPrivilegeUser2(false);
  }, []);

  // VERIFICATION 2
  const [openUserRole2, setOpenUserRole2] = React.useState(false);
  const [userRoleValue2, setUserRoleValue2] = React.useState([]);
  const [userRoles2, setUserRoles2] = React.useState([]);

  const [openUsers2, setOpenUsers2] = React.useState(false);
  const [usersValue2, setUsersValue2] = React.useState('');
  const [users2, setUsers2] = React.useState([]);

  const getUserRolesV2 = async () => {
    let response = await getUserRole(company_id);
    if (response.status === 200) {
      let roleDataFromApi = response.data.map((one, i) => {
        return {label: one.user_role, value: one._id};
      });
      setUserRoles2(roleDataFromApi);
    }
  };

  const getUserByRoleIdV2 = async role_id => {
    let response = await roleByUser(company_id, role_id);
    if (response.status === 200) {
      let roleDataFromApi = response.data.map(ele => {
        return {label: ele.name, value: ele._id};
      });
      setUsers2(roleDataFromApi);
    }
  };

  // on open role
  const onRoleOpen2 = React.useCallback(() => {
    getUserRolesV2();
    setOpenUsers(false);
    setOpenUserRole(false);
    setOpenUsers1(false);
    setOpenPrivilege1(false);
    setOpenPrivilegeUser1(false);
    setOpenPrivilege2(false);
    setOpenPrivilegeUser2(false);
  }, []);

  // on open user
  const onUserOpen2 = React.useCallback(() => {
    setOpenUserRole(false);
    setOpenUserRole1(false);
    setOpenUsers(false);
    setOpenPrivilege1(false);
    setOpenPrivilegeUser1(false);
    setOpenPrivilege2(false);
    setOpenPrivilegeUser2(false);
  }, []);

  // ADMIN 1
  const [openPrivilege1, setOpenPrivilege1] = React.useState(false);
  const [privilegeValue1, setPrivilegeValue1] = React.useState([]);
  const [privilege1, setPrivilege1] = React.useState([]);

  const [openPrivilegeUser1, setOpenPrivilegeUser1] = React.useState(false);
  const [privilegeUserValue1, setPrivilegeUserValue1] = React.useState('');
  const [privilegeUser1, setPrivilegeUser1] = React.useState([]);

  const fetchPrivilege1 = async () => {
    let response = await getPrivileges();
    if (response.status === 200) {
      let privilesFromApi = response.data.map(one => {
        return {label: one.privilege, value: one._id};
      });
      setPrivilege1(privilesFromApi);
    }
  };

  const fetchUserByPrivileges1 = async privilege_id => {
    let response = await getUserByPrivileges(company_id, privilege_id);
    if (response.status === 200) {
      let privilesFromApi = response.data.map(one => {
        return {label: one.name, value: one._id};
      });

      setPrivilegeUser1(privilesFromApi);
    }
  };

  // on open role
  const onPrivilegesOpen = React.useCallback(() => {
    fetchPrivilege1();
    setOpenUserRole(false);
    setOpenUserRole1(false);
    setOpenUsers(false);
    setOpenUsers1(false);
    setOpenPrivilegeUser1(false);
    setOpenPrivilege2(false);
    setOpenPrivilegeUser2(false);
  }, []);

  // on open user
  const onPrivilegesUserOpen = React.useCallback(() => {
    setOpenUserRole(false);
    setOpenUserRole1(false);
    setOpenUsers(false);
    setOpenUsers1(false);
    setOpenPrivilege1(false);
    setOpenPrivilege2(false);
    setOpenPrivilegeUser2(false);
  }, []);

  // ADMIN 2
  const [openPrivilege2, setOpenPrivilege2] = React.useState(false);
  const [privilegeValue2, setPrivilegeValue2] = React.useState([]);
  const [privilege2, setPrivilege2] = React.useState([]);

  const [openPrivilegeUser2, setOpenPrivilegeUser2] = React.useState(false);
  const [privilegeUserValue2, setPrivilegeUserValue2] = React.useState('');
  const [privilegeUser2, setPrivilegeUser2] = React.useState([]);

  const fetchPrivilege2 = async () => {
    let response = await getPrivileges();
    if (response.status === 200) {
      let privilesFromApi = response.data.map(one => {
        return {label: one.privilege, value: one._id};
      });
      setPrivilege2(privilesFromApi);
    }
  };
  //-----------------------------------------

  const fetchUserByPrivileges2 = async privilege_id => {
    let response = await getUserByPrivileges(company_id, privilege_id);
    if (response.status === 200) {
      let privilesFromApi = response.data.map(one => {
        return {label: one.name, value: one._id};
      });

      setPrivilegeUser2(privilesFromApi);
    }
  };

  const onPrivilegesOpen1 = React.useCallback(() => {
    fetchPrivilege2();
    setOpenUserRole(false);
    setOpenUserRole1(false);
    setOpenUsers(false);
    setOpenUsers1(false);
    setOpenPrivilegeUser1(false);
    setOpenPrivilege1(false);
    setOpenPrivilegeUser2(false);
  }, []);

  // on open user
  const onPrivilegesUserOpen1 = React.useCallback(() => {
    setOpenUserRole(false);
    setOpenUserRole1(false);
    setOpenUsers(false);
    setOpenUsers1(false);
    setOpenPrivilege1(false);
    setOpenPrivilege2(false);
    setOpenPrivilegeUser1(false);
  }, []);

  // ====================================================================================

  const [reportPath, setReportPath] = React.useState([]);

  const fetchReportSettingPath = async () => {
    const response = await getProjectReportPath(company_id, project_id);
    setReportPath(response.data);
  };

  const onSubmit = async () => {
    const formData = {
      company_id: company_id,
      project_id: project_id,
      started_by: usersValue,
      verification_1: usersValue1,
      verification_2: usersValue2,
      admin_1: privilegeUserValue1,
      admin_2: privilegeUserValue2,
      final_verify: company_id,
    };
    const response = await postProjectReportPath(formData);
    if (response.status === 200) {
      setSubmitToast(true);
      setPathAddModal(false);
      alert('Successfull');
      fetchReportSettingPath();
      setUsersValue('');
      setUsersValue1('');
      setUsersValue2('');
      setPrivilegeUserValue1('');
      setPrivilegeUserValue2('');
      setUserRoleValue('');
      setUserRoleValue1('');
      setUserRoleValue2('');
      setPrivilegeValue1();
      setPrivilegeValue2();
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const [pathId, setPathId] = React.useState('');
  const onDeletePath = async () => {
    const response = await deleteReportPath(pathId);
    if (response.status === 200) {
      fetchReportSettingPath();
      setDeleteToast(true);
      setDeleteConfirm(false);
    } else {
      alert(res.message);
    }
    setTimeout(() => {
      setDeleteToast(false);
    }, 2000);
  };

  React.useEffect(() => {
    fetchReportSettingPath();
  }, []);

  function renderPath() {
    return (
      <View style={{marginHorizontal: SIZES.padding}}>
        {reportPath.map((ele, i) => (
          <View key={i}>
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
                  textDecorationLine: 'underline',
                }}>
                Report Path:
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setPathId(ele._id);
                  setDeleteConfirm(true);
                }}>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.rose_600,
                    padding: 5,
                    borderRadius: 2,
                  }}>
                  <Image
                    source={icons.delete_icon}
                    style={{
                      width: 12,
                      height: 12,
                      tintColor: COLORS.white,
                    }}
                  />
                </ImageBackground>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginTop: 8,
                ...FONTS.h3,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
              }}>
              1. Started by {' :  '} {ele.started_by_name}
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
                marginTop: 1,
              }}>
              2. Verification_1 {' :  '} {ele.verification_1_name}
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
                marginTop: 1,
              }}>
              3. Verification_2 {' :  '} {ele.verification_2_name}
            </Text>

            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
                marginTop: 1,
              }}>
              4. Admin_1 {' :  '} {ele.admin_1_name}
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
                marginTop: 1,
              }}>
              5. Admin_2 {' :  '} {ele.admin_2_name}
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
                marginTop: 1,
              }}>
              6. Final Verify {' :  '} {ele.final_verify}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  function renderAddProjectPathModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={pathAddModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.transparentBlack7,
          }}>
          <View
            style={{
              top: 120,
              backgroundColor: COLORS.white,
              paddingHorizontal: SIZES.base,
              height: '100%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setPathAddModal(false);
                }}
                style={{top: -5}}>
                <Image
                  source={icons.minus}
                  style={{height: 30, width: 35, tintColor: COLORS.darkGray}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 0.7,
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.darkGray,
                    marginBottom: 60,
                    textTransform: 'capitalize',
                  }}>
                  started by {' - '}
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.darkGray,
                    marginBottom: 60,
                    textTransform: 'capitalize',
                  }}>
                  Verification 1 {' - '}
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.darkGray,
                    marginBottom: 60,
                    textTransform: 'capitalize',
                  }}>
                  Verification 2 {' - '}
                </Text>

                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.darkGray,
                    marginBottom: 60,
                    textTransform: 'capitalize',
                  }}>
                  Admin 1 {' - '}
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.darkGray,

                    textTransform: 'capitalize',
                  }}>
                  Admin 2 {' - '}
                </Text>
              </View>
              <View
                style={{
                  flex: 1.3,
                  alignItems: 'flex-start',
                }}>
                <View>
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: null,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: null}}
                    placeholder="Select user role"
                    open={openUserRole}
                    value={userRoleValue}
                    items={userRoles}
                    setOpen={setOpenUserRole}
                    setValue={setUserRoleValue}
                    setItems={setUserRoles}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    onSelectItem={value => getUserByRoleId(value.value)}
                    onOpen={onRoleOpen}
                    zIndex={10000}
                    zIndexInverse={1000}
                    maxHeight={100}
                  />
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: 30,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: 30}}
                    placeholder="Select user"
                    open={openUsers}
                    value={usersValue}
                    items={users}
                    setOpen={setOpenUsers}
                    setValue={setUsersValue}
                    setItems={setUsers}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    zIndex={9000}
                    zIndexInverse={2000}
                    onOpen={onUserOpen}
                    maxHeight={100}
                  />
                </View>
                <View style={{marginTop: 40}}>
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: null,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: null}}
                    placeholder="Select user role"
                    open={openUserRole1}
                    value={userRoleValue1}
                    items={userRoles1}
                    setOpen={setOpenUserRole1}
                    setValue={setUserRoleValue1}
                    setItems={setUserRoles1}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    onSelectItem={value => getUserByRoleIdV1(value.value)}
                    onOpen={onRoleOpen1}
                    zIndex={8000}
                    zIndexInverse={3000}
                    maxHeight={100}
                  />
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: 30,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: 30}}
                    placeholder="Select user"
                    open={openUsers1}
                    value={usersValue1}
                    items={users1}
                    setOpen={setOpenUsers1}
                    setValue={setUsersValue1}
                    setItems={setUsers1}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    zIndex={7000}
                    zIndexInverse={4000}
                    onOpen={onUserOpen1}
                    maxHeight={100}
                  />
                </View>

                <View style={{marginTop: 40}}>
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: null,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: null}}
                    placeholder="Select user role"
                    open={openUserRole2}
                    value={userRoleValue2}
                    items={userRoles2}
                    setOpen={setOpenUserRole2}
                    setValue={setUserRoleValue2}
                    setItems={setUserRoles2}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    onSelectItem={value => getUserByRoleIdV2(value.value)}
                    onOpen={onRoleOpen2}
                    zIndex={6000}
                    zIndexInverse={5000}
                    maxHeight={100}
                  />
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: 30,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: 30}}
                    placeholder="Select user"
                    open={openUsers2}
                    value={usersValue2}
                    items={users2}
                    setOpen={setOpenUsers2}
                    setValue={setUsersValue2}
                    setItems={setUsers2}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    zIndex={5000}
                    zIndexInverse={6000}
                    onOpen={onUserOpen2}
                    maxHeight={100}
                  />
                </View>

                <View style={{marginTop: 40}}>
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: null,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: null}}
                    placeholder="Select"
                    open={openPrivilege1}
                    value={privilegeValue1}
                    items={privilege1}
                    setOpen={setOpenPrivilege1}
                    setValue={setPrivilegeValue1}
                    setItems={setPrivilege1}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    onSelectItem={value => {
                      fetchUserByPrivileges1(value.value);
                    }}
                    onOpen={onPrivilegesOpen}
                    zIndex={4000}
                    zIndexInverse={7000}
                    maxHeight={100}
                  />
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: 30,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: 30}}
                    placeholder="Select"
                    open={openPrivilegeUser1}
                    value={privilegeUserValue1}
                    items={privilegeUser1}
                    setOpen={setOpenPrivilegeUser1}
                    setValue={setPrivilegeUserValue1}
                    setItems={setPrivilegeUser1}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    onOpen={onPrivilegesUserOpen}
                    zIndex={3000}
                    zIndexInverse={8000}
                    maxHeight={100}
                  />
                </View>
                <View style={{marginTop: 40}}>
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: null,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: null}}
                    placeholder="Select"
                    open={openPrivilege2}
                    value={privilegeValue2}
                    items={privilege2}
                    setOpen={setOpenPrivilege2}
                    setValue={setPrivilegeValue2}
                    setItems={setPrivilege2}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    onSelectItem={value => {
                      fetchUserByPrivileges2(value.value);
                    }}
                    onOpen={onPrivilegesOpen1}
                    zIndex={2000}
                    zIndexInverse={9000}
                    maxHeight={100}
                  />
                  <CustomDropdown
                    containerStyle={{
                      width: '70%',
                      marginTop: 30,
                      minHeight: 30,
                      paddingHorizontal: SIZES.radius,
                      borderRadius: null,
                      backgroundColor: COLORS.lightGray1,
                    }}
                    dropdownContainerStyle={{width: '70%', marginTop: 30}}
                    placeholder="Select"
                    open={openPrivilegeUser2}
                    value={privilegeUserValue2}
                    items={privilegeUser2}
                    setOpen={setOpenPrivilegeUser2}
                    setValue={setPrivilegeUserValue2}
                    setItems={setPrivilegeUser2}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    onOpen={onPrivilegesUserOpen1}
                    zIndex={1000}
                    zIndexInverse={10000}
                    maxHeight={100}
                  />
                </View>
              </View>
            </View>
            <View style={{alignItems: 'center', marginTop: SIZES.padding * 4}}>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.lightblue_800,
                  paddingHorizontal: 100,
                  paddingVertical: 8,
                  alignItems: 'center',
                }}
                onPress={() => onSubmit()}>
                <Text style={{...FONTS.h3, color: COLORS.white}}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View>
      <HeaderBar right={true} title="Report Settings" />
      <TextButton
        label="Add Report Path"
        buttonContainerStyle={{
          height: 45,
          alignItems: 'center',
          marginHorizontal: SIZES.radius,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightblue_700,
        }}
        onPress={() => {
          setPathAddModal(true);
        }}
      />
      {renderPath()}
      {renderAddProjectPathModal()}
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
        message={'Do you really want to delete current project report path?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => onDeletePath()}
      />
    </View>
  );
};

export default ReportSettings;
