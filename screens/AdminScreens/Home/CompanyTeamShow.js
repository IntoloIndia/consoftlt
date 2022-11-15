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
import {SIZES, COLORS, icons, FONTS} from '../../../constants';
import {
  FormInput,
  TextButton,
  CustomDropdown,
  CustomToast,
} from '../../../Components';
import {HeaderBar} from '../../../Components';
import utils from '../../../utils';
import {useSelector} from 'react-redux';
import {postCompanyTeam} from '../../../controller/CompanyController';
import {
  getPrivileges,
  getUserRole,
  getUsers,
} from '../../../controller/UserRoleController';
import {getProjects} from '../../../controller/ProjectController';

const CompanyTeamShow = () => {
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

  const [addTeamModal, setAddTeamModal] = React.useState(false);
  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);

  const [companyTeam, setCompanyTeam] = React.useState([]);
  // form states & dropdown role data fetch from api
  const [openRole, setOpenRole] = React.useState(false);
  const [roleValue, setRoleValue] = React.useState([]);
  const [role, setRole] = React.useState([]);
  //projects
  const [openProject, setOpenProject] = React.useState(false);
  const [projectValue, setProjectValue] = React.useState('');
  const [project, setProject] = React.useState([]);

  //privileges
  const [openPrivilege, setOpenPrivilege] = React.useState(false);
  const [privilegeValue, setPrivilegeValue] = React.useState([]);
  const [privilege, setPrivilege] = React.useState([]);

  //
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [mobile, setMobile] = React.useState('');

  //error states
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

  // switch
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
    }, 2000);
  };

  // const openModal = () => {
  //   setAddTeamModal(true);
  // };

  React.useEffect(() => {
    getCompanyTeam();
  }, []);

  // ====================================================================

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
                    zIndex={4000}
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
                    zIndex={4000}
                    maxHeight={150}
                    onOpen={onPrivilegesOpen}
                  />
                </View>
              </View>
              <FormInput
                label="Name"
                keyboardType="default"
                autoCompleteType="username"
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
                      zIndex={3000}
                      maxHeight={150}
                      onOpen={onProjectOpen}
                    />
                  </View>
                )}
              </View>

              <TextButton
                label="Save"
                disabled={isEnableSubmit() ? false : true}
                buttonContainerStyle={{
                  height: 45,
                  alignItems: 'center',
                  marginTop: SIZES.padding,
                  borderRadius: SIZES.base,
                  backgroundColor: isEnableSubmit()
                    ? COLORS.lightblue_700
                    : COLORS.transparentPrimary,
                }}
                onPress={postTeam}
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
        <View style={{flexDirection: 'row'}}>
          <Text style={{...FONTS.h4}}>{index + 1}.</Text>
          <Text
            style={{
              ...FONTS.h3,
              left: 5,
              color: COLORS.black,
              textTransform: 'capitalize',
            }}>
            {item.name}
          </Text>
          <Text style={{left: 5}}>{'  -  '}</Text>
          <Text
            style={{
              ...FONTS.h5,
              left: 5,
              color: COLORS.darkGray,
            }}>
            ({item.user_role})
          </Text>
        </View>
        <Text style={{...FONTS.h4, left: 15, color: COLORS.darkGray}}>
          Mobile No. {item.mobile}
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
        onPress={() => setAddTeamModal(true)}
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
