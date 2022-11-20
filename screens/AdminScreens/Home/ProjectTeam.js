import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LogBox,
  Image,
  TouchableWithoutFeedback,
  Modal,
  ImageBackground,
} from 'react-native';
import {
  HeaderBar,
  TextButton,
  CustomDropdown,
  CustomToast,
  DeleteConfirmationToast,
} from '../../../Components';
import {COLORS, FONTS, icons, SIZES, STATUS} from '../../../constants';
import {
  getProjectTeam,
  saveProjectTeam,
  deleteProjectTeam,
} from '../../../controller/ProjectTeamController';
import {getUserRole, roleByUser} from '../../../controller/UserRoleController';
import {useSelector} from 'react-redux';

const ProjectTeam = ({route}) => {
  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);

  var companyData;
  if (companyDetail._id) {
    companyData = companyDetail;
  } else {
    companyData = userData;
  }
  const company_id = companyData._id;

  const {project_id} = route.params; //
  const [addProjectTeamModal, setAddProjectTeamModal] = useState(false);

  const [projectTeam, setProjectTeam] = useState([]);
  const [teamDeleteConfirmation, setTeamDeleteConfirmation] = useState(false);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  //
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  //roloe dropdown
  const [openRole, setOpenRole] = useState(false);
  const [roleValue, setRoleValue] = useState([]);
  const [roleItems, setRoleItems] = useState([]);

  // users dropdown
  const [openUser, setOpenUser] = useState(false);
  const [userValue, setUserValue] = useState([]);
  const [userItems, setUserItems] = useState([]);

  const [userId, setUserId] = useState('');

  //==================================== Apis ==================================

  // fetch project team
  const fetchProjectTeam = async () => {
    const team = await getProjectTeam(project_id);
    // console.log(team);
    if (team.status === 200) {
      setProjectTeam(team.data);
    }
  };

  const addProjectTeam = async () => {
    const res = await getUserRole(company_id);
    if (res.status === 200) {
      let roleFromApi = res.data.map(list => {
        return {label: list.user_role, value: list._id};
      });
      setRoleItems(roleFromApi);
    }
  };

  const getRolebyUser = async role_id => {
    const res = await roleByUser(company_id, role_id);
    if (res.status === 200) {
      let usersFromApi = res.data.map(ele => {
        return {label: ele.name, value: ele._id};
      });
      setUserItems(usersFromApi);
    }
  };

  // post data
  const saveProjectTeamSubmit = async () => {
    const teamData = {
      company_id: company_id,
      project_id: project_id,
      user_id: userValue,
    };
    const res = await saveProjectTeam(teamData);
    if (res.status === 200) {
      setAddProjectTeamModal(false);
      setSubmitToast(true);
      fetchProjectTeam();
    } else {
      alert(res.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const deleteTeamSubmit = async () => {
    const res = await deleteProjectTeam(userId);
    if (res.status === STATUS.RES_SUCCESS) {
      fetchProjectTeam();
      setDeleteToast(true);
      setDeleteConfirm(false);
    } else {
      alert(res.message);
    }
    setTimeout(() => {
      setDeleteToast(false);
    }, 2000);
  };

  const onRoleOpen = useCallback(() => {
    addProjectTeam();
    setOpenUser(false);
  }, []);

  const onUserOpen = useCallback(() => {
    setOpenRole(false);
  }, []);

  useEffect(() => {
    fetchProjectTeam();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  function renderTeamList() {
    const renderItem = ({item, index}) => (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text style={{...FONTS.h3, color: COLORS.darkGray}}>{index + 1}</Text>
        <View style={{flex: 1, marginLeft: SIZES.radius}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.lightblue_900,
                textTransform: 'capitalize',
              }}>
              {item.user_name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              {/* <TouchableOpacity
                onPress={() => {
                  alert('edit name');
                }}>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.green,
                    padding: 3,
                    borderRadius: 2,
                    right: 10,
                  }}>
                  <Image
                    source={icons.edit}
                    style={{
                      width: 12,
                      height: 12,
                      // right: 15,
                      tintColor: COLORS.white,
                    }}
                  />
                </ImageBackground>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  setUserId(item._id);
                  setDeleteConfirm(true);
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
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.darkGray,
              textTransform: 'capitalize',
            }}>
            Designation - {item.user_role}
          </Text>
        </View>
      </View>
    );
    return (
      <FlatList
        contentContainerStyle={{
          marginHorizontal: SIZES.padding,
          paddingBottom: 50,
        }}
        data={projectTeam}
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

  function renderAddProjectTeamModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={addProjectTeamModal}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.transparentBlack6,
          }}>
          <View
            style={{
              position: 'absolute',
              width: '95%',
              padding: SIZES.padding,
              borderRadius: 5,
              backgroundColor: COLORS.white,
            }}>
            <View style={{}}>
              {/* header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Text style={{fontSize: 25, color: COLORS.darkGray}}>
                  Project Team
                </Text>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => setAddProjectTeamModal(false)}>
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
              <ScrollView>
                <CustomDropdown
                  placeholder="Select role"
                  open={openRole}
                  value={roleValue}
                  items={roleItems}
                  setOpen={setOpenRole}
                  setValue={setRoleValue}
                  setItems={setRoleItems}
                  onOpen={onRoleOpen}
                  categorySelectable={true}
                  listParentLabelStyle={{
                    color: COLORS.white,
                  }}
                  maxHeight={100}
                  zIndex={2000}
                  zIndexInverse={1000}
                  onSelectItem={value => getRolebyUser(value.value)}
                />
                <CustomDropdown
                  placeholder="Select users"
                  open={openUser}
                  value={userValue}
                  items={userItems}
                  setOpen={setOpenUser}
                  setValue={setUserValue}
                  setItems={setUserItems}
                  onOpen={onUserOpen}
                  multiple={true}
                  listParentLabelStyle={{
                    color: COLORS.white,
                  }}
                  maxHeight={80}
                  zIndex={1000}
                  zIndexInverse={2000}
                  closeAfterSelecting={true}
                />

                <TextButton
                  label="Submit"
                  buttonContainerStyle={{
                    height: 45,
                    alignItems: 'center',
                    marginTop: SIZES.padding * 1.5,
                    borderRadius: SIZES.radius,
                  }}
                  onPress={saveProjectTeamSubmit}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <HeaderBar right={true} title="Project Team" />
      <TextButton
        label="Add New"
        buttonContainerStyle={{
          height: 45,
          alignItems: 'center',
          marginHorizontal: SIZES.radius,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
        }}
        onPress={() => {
          setRoleValue('');
          setAddProjectTeamModal(true);
        }}
      />
      {renderTeamList()}
      {renderAddProjectTeamModal()}

      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Add Team"
        message="Addedd Successfully..."
      />
      <CustomToast
        isVisible={updateToast}
        onClose={() => setUpdateToast(false)}
        color={COLORS.yellow_400}
        title="Update"
        message="Updated Successfully..."
      />
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
        message={
          'Do you really want to delete this project team member from this project?'
        }
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => deleteTeamSubmit()}
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

export default ProjectTeam;
