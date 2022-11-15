import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import utils from '../../../utils';
import {useSelector} from 'react-redux';
import {
  postCompanyTeam,
  updateCompanyTeam,
} from '../../../controller/CompanyController';
import {
  getPrivileges,
  getUserRole,
  getUsers,
} from '../../../controller/UserRoleController';
import {getProjects} from '../../../controller/ProjectController';
import {
  FormInput,
  TextButton,
  CustomDropdown,
  CustomToast,
  HeaderBar,
  DeleteConfirmationToast,
} from '../../../Components';
import {SIZES, COLORS, icons, FONTS} from '../../../constants';

const CompanyTeamShow = () => {
  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);

  var companyData;
  if (companyDetail._id) {
    companyData = companyDetail;
  } else {
    companyData = userData;
  }
  const company_id = companyData._id;

  const [addTeamModal, setAddTeamModal] = React.useState(false);
  const [companyTeam, setCompanyTeam] = React.useState([]);

  // toasts
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  // FORM STATES & DROPDOWN ROLE DATA FETCH FROM API
  const [openRole, setOpenRole] = React.useState(false);
  const [roleValue, setRoleValue] = React.useState([]);
  const [role, setRole] = React.useState([]);

  //PROJECTS
  const [openProject, setOpenProject] = React.useState(false);
  const [projectValue, setProjectValue] = React.useState('');
  const [project, setProject] = React.useState([]);

  // PRIVILEGES
  const [openPrivilege, setOpenPrivilege] = React.useState(false);
  const [privilegeValue, setPrivilegeValue] = React.useState([]);
  const [privilege, setPrivilege] = React.useState([]);

  // FORM STATES
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [mobile, setMobile] = React.useState('');

  //ERROR STATES
  const [nameError, setNameError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [mobileError, setMobileError] = React.useState('');

  function isEnableSubmit() {
    return (
      name != '' &&
      nameError == '' &&
      mobile != '' &&
      mobileError == '' &&
      email != '' &&
      emailError == ''
    );
  }
  // ================================================

  // CLOSE DROPDOWN ON OPEN ANOTHER DROPDOWN
  const onRoleOpen = React.useCallback(() => {
    userRole();
    setOpenProject(false);
    setOpenPrivilege(false);
  }, []);

  const onProjectOpen = React.useCallback(() => {
    projects();
    setOpenRole(false);
    setOpenPrivilege(false);
  }, []);

  const onPrivilegesOpen = React.useCallback(() => {
    fetchPrivilege();
    setOpenProject(false);
    setOpenRole(false);
  }, []);

  // SWITCH FOR ASSIGN USER IN PROJECTS
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // ================================ Apis ====================================
  const getCompanyTeam = async () => {
    let response = await getUsers(company_id);
    if (response.status === 200) {
      setCompanyTeam(response.data);
    }
  };

  const fetchPrivilege = async () => {
    let response = await getPrivileges();
    if (response.status === 200) {
      let privilesFromApi = response.data.map(one => {
        return {label: one.privilege, value: one._id};
      });
      setPrivilege(privilesFromApi);
    }
  };

  const userRole = async () => {
    let response = await getUserRole(company_id);
    if (response.status === 200) {
      let roleDataFromApi = response.data.map(one => {
        return {label: one.user_role, value: one._id};
      });
      setRole(roleDataFromApi);
    }
  };

  const projects = async () => {
    let response = await getProjects(company_id);
    if (response.status === 200) {
      let roleDataFromApi = response.data.map(ele => {
        return {label: ele.project_name, value: ele._id};
      });
      setProject(roleDataFromApi);
    }
  };

  // POST TEAM DATA
  const postTeam = async () => {
    const formData = {
      role_id: roleValue,
      name: name,
      email: email,
      mobile: mobile,
      company_id: company_id,
      assign_project: isEnabled,
      project_id: projectValue,
      user_privilege: privilegeValue,
    };

    let response = await postCompanyTeam(formData);
    if (response.status === 200) {
      setAddTeamModal(false);
      setSubmitToast(true);
      getCompanyTeam();
      setRoleValue('');
      setPrivilegeValue('');
      setName('');
      setEmail('');
      setMobile('');
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 1000);
  };

  const [userId, setUserId] = React.useState('');

  const onEdit = (id, roleId, privilegeId, name, email, mobile) => {
    setUserId(id);
    setRoleValue(roleId);
    setPrivilegeValue(privilegeId);
    setName(name);
    setEmail(email);
    setMobile(mobile);
    userRole();
    fetchPrivilege();
    setAddTeamModal(true);
  };

  const onEditTeam = async () => {
    const formData = {
      role_id: roleValue,
      name: name,
      email: email,
      mobile: mobile,
      user_privilege: privilegeValue,
      company_id: company_id,
      assign_project: isEnabled,
      project_id: projectValue,
    };
    const response = await updateCompanyTeam(formData, userId);
    if (response.status === 200) {
      setAddTeamModal(false);
      setUpdateToast(true);
      getCompanyTeam();
      setRoleValue('');
      setPrivilegeValue('');
      setName('');
      setEmail('');
      setMobile('');
      setUserId('');
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 1000);
  };

  const onDelete = id => {
    console.log(id);
  };

  React.useEffect(() => {
    getCompanyTeam();
  }, []);

  //====================================================================

  function renderAddTeamModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={addTeamModal}>
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
              position: 'absolute',
              backgroundColor: COLORS.white,
              padding: SIZES.padding,
              borderRadius: 5,
              width: '95%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 25, color: COLORS.darkGray}}>
                New Team
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setAddTeamModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{width: '50%'}}>
                  <CustomDropdown
                    placeholder="Select role"
                    open={openRole}
                    value={roleValue}
                    items={role}
                    setOpen={setOpenRole}
                    setValue={setRoleValue}
                    setItems={setRole}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    zIndex={3000}
                    maxHeight={150}
                    onOpen={onRoleOpen}
                  />
                </View>
                <View style={{width: '45%'}}>
                  <CustomDropdown
                    placeholder="Select"
                    open={openPrivilege}
                    value={privilegeValue}
                    items={privilege}
                    setOpen={setOpenPrivilege}
                    setValue={setPrivilegeValue}
                    setItems={setPrivilege}
                    listParentLabelStyle={{
                      color: COLORS.white,
                    }}
                    zIndex={2000}
                    maxHeight={150}
                    onOpen={onPrivilegesOpen}
                  />
                </View>
              </View>
              <FormInput
                label="Name"
                keyboardType="default"
                autoCompleteType="username"
                value={name}
                onChange={value => {
                  utils.validateText(value, setNameError);
                  setName(value);
                }}
                errorMsg={nameError}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        name == '' || (name != '' && nameError == '')
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          name == ''
                            ? COLORS.gray
                            : name != '' && nameError == ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <FormInput
                label="Email"
                keyboardType="email-address"
                autoCompleteType="email"
                value={email}
                onChange={value => {
                  utils.validateEmail(value, setEmailError);
                  setEmail(value);
                }}
                errorMsg={emailError}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        email == '' || (email != '' && emailError == '')
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          email == ''
                            ? COLORS.gray
                            : email != '' && emailError == ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <FormInput
                label="Mobile No."
                keyboardType="numeric"
                value={mobile}
                onChange={value => {
                  utils.validateNumber(value, setMobileError);
                  setMobile(value);
                }}
                errorMsg={mobileError}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        mobile == '' || (mobile != '' && mobileError == '')
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          mobile == ''
                            ? COLORS.gray
                            : mobile != '' && mobileError == ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{alignItems: 'flex-start'}}>
                  <Text style={{color: COLORS.darkGray, ...FONTS.body4}}>
                    {/* Assign to */}
                  </Text>
                  <Switch
                    trackColor={{
                      false: COLORS.darkGray,
                      true: COLORS.darkGray,
                    }}
                    thumbColor={isEnabled ? COLORS.red_300 : COLORS.lightGray1}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>

                {isEnabled == true && (
                  <View style={{width: '80%'}}>
                    <CustomDropdown
                      placeholder="Assign on project"
                      open={openProject}
                      value={projectValue}
                      items={project}
                      setOpen={setOpenProject}
                      setValue={setProjectValue}
                      setItems={setProject}
                      listParentLabelStyle={{
                        color: COLORS.white,
                      }}
                      zIndex={1000}
                      maxHeight={150}
                      onOpen={onProjectOpen}
                    />
                  </View>
                )}
              </View>

              <TextButton
                label={userId != '' ? 'Update' : 'Save'}
                buttonContainerStyle={{
                  height: 45,
                  alignItems: 'center',
                  marginTop: SIZES.padding,
                  borderRadius: SIZES.base,
                  backgroundColor: COLORS.lightblue_700,
                }}
                onPress={userId != '' ? onEditTeam : postTeam}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderCompanyTeam() {
    const renderItem = ({item, index}) => (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{...FONTS.h4, color: COLORS.black}}>{index + 1}.</Text>
            <Text
              style={{
                ...FONTS.h3,
                left: 5,
                color: COLORS.black,
                textTransform: 'capitalize',
              }}>
              {item.name}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                onEdit(
                  item._id,
                  item.role_id,
                  item.user_privilege,
                  item.name,
                  item.email,
                  item.mobile,
                );
              }}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.green,
                  padding: 3,
                  borderRadius: 2,
                  // right: 12,
                }}>
                <Image
                  source={icons.edit}
                  style={{
                    width: 12,
                    height: 12,
                    tintColor: COLORS.white,
                  }}
                />
              </ImageBackground>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                onDelete(item._id);
              }}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.rose_600,
                  padding: 3,
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
            </TouchableOpacity> */}
          </View>
        </View>
        <Text
          style={{
            ...FONTS.h4,
            left: 15,
            color: COLORS.darkGray,
            textTransform: 'capitalize',
          }}>
          Role - {item.user_role} ({item.privilege})
        </Text>
        <Text style={{...FONTS.h4, left: 15, color: COLORS.darkGray}}>
          Mobile No - {item.mobile}
        </Text>
        <Text style={{...FONTS.h4, left: 15, color: COLORS.darkGray}}>
          Email - {item.email}
        </Text>
      </View>
    );

    return (
      <FlatList
        contentContainerStyle={{
          marginHorizontal: SIZES.padding,
          paddingBottom: 50,
        }}
        data={companyTeam}
        keyExtractor={item => `${item._id}`}
        renderItem={renderItem}
        scrollEnabled={true}
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
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <HeaderBar right={true} title="Company Team" />
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
          setUserId('');
          setName('');
          setEmail('');
          setMobile('');
          setRoleValue('');
          setPrivilegeValue('');
          setAddTeamModal(true);
        }}
      />
      {renderAddTeamModal()}
      {renderCompanyTeam()}
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
      <DeleteConfirmationToast
        isVisible={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title={'Are You Sure?'}
        message={'Do you really want to delete this user?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => console.log(object)}
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
});

export default CompanyTeamShow;
