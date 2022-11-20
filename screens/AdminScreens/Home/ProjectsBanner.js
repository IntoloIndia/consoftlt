import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  LogBox,
  ImageBackground,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {
  FormInput,
  CustomDropdown,
  IconButton,
  TextButton,
  CustomToast,
  DeleteConfirmationToast,
} from '../../../Components';
import {useNavigation} from '@react-navigation/native';
import utils from '../../../utils';
import {COLORS, SIZES, FONTS, icons, STATUS} from '../../../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
  getProjectType,
  getProjectCategory,
} from '../../../controller/ProjectController';
import Tooltip from 'react-native-walkthrough-tooltip';
import {useSelector} from 'react-redux';

const ProjectsBanner = ({company}) => {
  // const companyData = useSelector(state => state.company);
  const company_id = company;

  const [showTip, setTip] = React.useState(false);

  const navigation = useNavigation();
  const [collapsed, setCollapsed] = React.useState(true);

  //PROJECT CREATE & UPDATE MODAL
  const [showCreateProjectModal, setCreateProjectModal] = React.useState(false);
  const [showUpdateProjectModal, setUpdateProjectModal] = React.useState(false);
  const [projectCrud, setProjectCrud] = React.useState(false);

  // STORE PROJECT DATA
  const [projects, setProjects] = React.useState([]);

  // CREATE & UPDATE PROJECTS FORM DATA
  const [projectname, setProjectName] = React.useState('');
  const [projectlocation, setProjectLocation] = React.useState('');
  const [projectplotarea, setProjectPlotArea] = React.useState('');

  // getting categories from api - dropdown
  const [openCategory, setOpenCategory] = React.useState(false);
  const [categoryValue, setCategoryValue] = React.useState([]);
  const [projectCategory, setProjectCategory] = React.useState([]);

  // getting types from api - dropdown
  const [openType, setOpenType] = React.useState(false);
  const [typeValue, setTypeValue] = React.useState([]);
  const [projectType, setProjectType] = React.useState([]);

  //project area units
  const [openUnit, setOpenUnit] = React.useState(false);
  const [unitValue, setUnitValue] = React.useState([]);
  const [projectUnit, setProjectUnit] = React.useState([
    {label: 'Hect', value: '1'},
    {label: 'Acre', value: '2'},
    {label: 'Sqm', value: '3'},
    {label: 'Sqf', value: '4'},
  ]);

  const [projectId, setProjectId] = React.useState('');

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  // delete confirmation
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  // CLOSE DROPDOWN ON OPEN ANOTHER DROPDOWN
  const onCategoryOpen = React.useCallback(() => {
    setOpenType(false);
    setOpenUnit(false);
    fetchProjectCategory();
  }, []);

  const onTypeOpen = React.useCallback(() => {
    setOpenCategory(false);
    setOpenUnit(false);
  }, []);

  const onUnitOpen = React.useCallback(() => {
    setOpenCategory(false);
    setOpenType(false);
  }, []);

  //FORM VALIDATION ERROR STATES
  const [projectError, setProjectError] = React.useState('');
  const [projectLocationError, setProjectLocationError] = React.useState('');
  const [projectPlotAreaError, setProjectPlotAreaError] = React.useState('');

  const toggleExpanded = () => {
    setCollapsed(!collapsed);
  };

  // get projects
  const fetchProjects = async () => {
    const data = await getProjects(company_id);
    if (data.status === 200) {
      setProjects(data.data);
    }
  };

  useEffect(() => {
    fetchProjects();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  // ON BUTTON SUBMISSON VALIDATION
  function isEnableSubmit() {
    return (
      projectname != '' &&
      projectError == '' &&
      projectlocation != '' &&
      projectLocationError == '' &&
      projectplotarea != '' &&
      projectPlotAreaError == ''
    );
  }

  const fetchProjectCategory = async () => {
    const response = await getProjectCategory(company_id);
    if (response.status === 200) {
      const proCatFromApi = response.data.map(item => {
        return {label: item.category_name, value: item._id};
      });
      setProjectCategory(proCatFromApi);
    }
  };

  // get project types
  const fetchProjectsTypes = async category_id => {
    const response = await getProjectType(category_id);
    if (response.status === 200) {
      const proTypeFromApi = response.data.map(item => {
        return {label: item.project_type, value: item._id};
      });
      setProjectType(proTypeFromApi);
    }
  };

  //save project
  const saveProjectSubmit = async () => {
    const projectData = getProjectData();
    const res = await saveProject(projectData);
    if (res.status === 200) {
      setSubmitToast(true);
      fetchProjects();
      setCreateProjectModal(false);
      createProjectModalForm();
    } else {
      alert(res.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 1500);
  };

  // GETTING PROJECTS ID
  const modalHandler = project_id => {
    setProjectId(project_id); //project ID state
    setProjectCrud(true);
  };

  const editProject = (name, location, category, type, area, unit) => {
    setProjectName(name);
    setProjectLocation(location);
    setCategoryValue(category);
    setTypeValue(type);
    setProjectPlotArea(area);
    setUnitValue(unit);
  };

  //update project
  const updateProjectSubmit = async () => {
    const projectData = getProjectData();
    const res = await updateProject(projectId, projectData);
    if (res.status === 200) {
      fetchProjects();
      setUpdateToast(true);
      setUpdateProjectModal(false);
      setProjectCrud(false);
    } else {
      alert(res.message);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 1500);
  };

  // project data
  const getProjectData = () => {
    const projectData = {
      project_name: projectname,
      project_location: projectlocation,
      project_area: projectplotarea,
      project_category: categoryValue,
      project_type: typeValue,
      project_measurement: unitValue,
      company_id: company_id,
    };
    return projectData;
  };

  // EMPTY ALL FORM STATED
  function createProjectModalForm() {
    setProjectName('');
    setProjectLocation('');
    setProjectPlotArea('');
    setCategoryValue('');
    setTypeValue('');
    setUnitValue('');
  }

  // DELETE PROJECTS
  const projectDeleteSubmit = async () => {
    const res = await deleteProject(projectId);
    if (res.status === STATUS.RES_SUCCESS) {
      setTimeout(() => {
        setDeleteConfirm(false);
        setProjectCrud(false);
      }, 300);
      fetchProjects();
    }
  };

  const createProject = () => {
    setCreateProjectModal(true);
    createProjectModalForm();
    fetchProjectCategory();
    fetchProjectsTypes();
  };

  //RENDER PROJECTS
  function renderProjects() {
    const renderItem = ({item, index}) => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProjectsDetails', {
            name: item.project_name,
            project_id: item._id,
          });
        }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 15,
            borderRadius: 5,
            ...styles.shadow,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                {index + 1}.
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  left: 5,
                  color: COLORS.darkGray,
                  textTransform: 'capitalize',
                }}>
                {item.project_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <TouchableOpacity
                onPress={() => {
                  alert('All Notification Message Show in here...');
                }}>
                <Image
                  source={icons.notification}
                  style={{
                    right: 8,
                    width: 20,
                    height: 20,
                    tintColor: COLORS.darkGray,
                  }}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  modalHandler(item._id);
                  editProject(
                    item.project_name,
                    item.project_location,
                    item.project_category,
                    item.project_type,
                    item.project_area,
                    item.project_measurement,
                  );
                }}>
                <Image
                  source={icons.menu}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.darkGray,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        contentContainerStyle={{
          marginTop: SIZES.padding,
        }}
        data={projects}
        keyExtractor={item => `${item._id}`}
        renderItem={renderItem}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        maxHeight={300}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return <View style={{marginBottom: SIZES.radius}}></View>;
        }}
      />
    );
  }

  // CREATE PROJECT MODAL
  function renderCreateProjectModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCreateProjectModal}>
        <TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: COLORS.transparentBlack2,
            }}>
            <View
              style={{
                backgroundColor: COLORS.white2,
                position: 'absolute',
                width: '100%',
                height: '70%',
                // padding: SIZES.radius,
                paddingHorizontal: SIZES.padding,
                paddingTop: SIZES.radius,
                paddingBottom: SIZES.padding,
                borderTopRightRadius: SIZES.base,
                borderTopLeftRadius: SIZES.base,
                backgroundColor: COLORS.white,
              }}>
              <View style={{alignItems: 'flex-end', marginBottom: 10}}>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => setCreateProjectModal(false)}>
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
              <ScrollView showsVerticalScrollIndicator={false}>
                <FormInput
                  label="Name"
                  keyboardType="default"
                  autoCompleteType="username"
                  // value={projectname}
                  onChange={value => {
                    utils.validateText(value, setProjectError);
                    setProjectName(value);
                  }}
                  errorMsg={projectError}
                  appendComponent={
                    <View style={{justifyContent: 'center'}}>
                      <Image
                        source={
                          projectname == '' ||
                          (projectname != '' && projectError == '')
                            ? icons.correct
                            : icons.cancel
                        }
                        style={{
                          height: 20,
                          width: 20,
                          tintColor:
                            projectname == ''
                              ? COLORS.gray
                              : projectname != '' && projectError == ''
                              ? COLORS.green
                              : COLORS.red,
                        }}
                      />
                    </View>
                  }
                />
                <FormInput
                  label="Location"
                  keyboardType="default"
                  autoCompleteType="username"
                  // value={projectlocation}
                  onChange={value => {
                    utils.validateText(value, setProjectLocationError);
                    setProjectLocation(value);
                  }}
                  errorMsg={projectLocationError}
                  appendComponent={
                    <View style={{justifyContent: 'center'}}>
                      <Image
                        source={
                          projectlocation == '' ||
                          (projectlocation != '' && projectLocationError == '')
                            ? icons.correct
                            : icons.cancel
                        }
                        style={{
                          height: 20,
                          width: 20,
                          tintColor:
                            projectlocation == ''
                              ? COLORS.gray
                              : projectlocation != '' &&
                                projectLocationError == ''
                              ? COLORS.green
                              : COLORS.red,
                        }}
                      />
                    </View>
                  }
                />
                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '90%',
                    }}>
                    <CustomDropdown
                      placeholder="Select category"
                      open={openCategory}
                      value={categoryValue}
                      items={projectCategory}
                      setOpen={setOpenCategory}
                      setValue={setCategoryValue}
                      setItems={setProjectCategory}
                      multiple={false}
                      listParentLabelStyle={{
                        color: COLORS.white,
                      }}
                      maxHeight={150}
                      zIndex={3000}
                      zIndexInverse={1000}
                      onOpen={onCategoryOpen}
                      onChangeValue={value => fetchProjectsTypes(value)}
                    />
                  </View>
                  <View style={{marginTop: 15}}>
                    <Tooltip
                      isVisible={showTip}
                      content={
                        <View style={{padding: 5}}>
                          <Text
                            style={{
                              ...FONTS.h4,
                              color: COLORS.lightblue_600,
                              fontWeight: 'bold',
                            }}>
                            Help
                          </Text>
                          <Text
                            style={{
                              ...FONTS.h4,
                              color: COLORS.darkGray,
                              textAlign: 'left',
                            }}>
                            Before creating the new projects, Click on the
                            account tab and create the project categories and
                            it's types, it's compulsory for creating a new
                            project.
                          </Text>
                        </View>
                      }
                      onClose={() => setTip(false)}
                      placement="bottom">
                      <TouchableOpacity style={{}} onPress={() => setTip(true)}>
                        <Image
                          source={icons.help1}
                          style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.lightblue_600,
                          }}
                        />
                      </TouchableOpacity>
                    </Tooltip>
                  </View>
                </View>

                <CustomDropdown
                  placeholder="Select types"
                  open={openType}
                  value={typeValue}
                  items={projectType}
                  setOpen={setOpenType}
                  setValue={setTypeValue}
                  setItems={setProjectType}
                  listParentLabelStyle={{
                    color: COLORS.white,
                  }}
                  maxHeight={150}
                  zIndex={2000}
                  zIndexInverse={2000}
                  onOpen={onTypeOpen}
                />

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <FormInput
                    label="Land area"
                    keyboardType="numeric"
                    autoCompleteType="cc-number"
                    containerStyle={{width: '60%'}}
                    // value={projectplotarea.toString()}
                    onChange={value => {
                      utils.validateNumber(value, setProjectPlotAreaError);
                      setProjectPlotArea(value);
                    }}
                    errorMsg={projectPlotAreaError}
                  />
                  <View
                    style={{
                      marginTop: 13,
                      marginLeft: SIZES.radius,
                      width: '35%',
                    }}>
                    <CustomDropdown
                      placeholder="Unit"
                      open={openUnit}
                      value={unitValue}
                      items={projectUnit}
                      setOpen={setOpenUnit}
                      setValue={setUnitValue}
                      setItems={setProjectUnit}
                      listParentLabelStyle={{
                        color: COLORS.white,
                      }}
                      maxHeight={100}
                      zIndex={1000}
                      zIndexInverse={3000}
                      onOpen={onUnitOpen}
                    />
                  </View>
                </View>
                <TextButton
                  label="Submit"
                  disabled={isEnableSubmit() ? false : true}
                  buttonContainerStyle={{
                    height: 45,
                    alignItems: 'center',
                    marginTop: SIZES.padding,
                    marginBottom: SIZES.padding,
                    borderRadius: SIZES.base,
                    backgroundColor: isEnableSubmit()
                      ? COLORS.majorelle_blue_800
                      : COLORS.majorelle_blue_300,
                  }}
                  onPress={() => saveProjectSubmit()}
                />
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // CREATE PROJECT MODAL
  function renderUpdateProjectModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showUpdateProjectModal}>
        <TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: COLORS.transparentBlack2,
            }}>
            <View
              style={{
                backgroundColor: COLORS.white2,
                position: 'absolute',
                width: '100%',
                height: '70%',
                // padding: SIZES.radius,
                paddingHorizontal: SIZES.padding,
                paddingTop: SIZES.radius,
                paddingBottom: SIZES.padding,
                borderTopRightRadius: SIZES.base,
                borderTopLeftRadius: SIZES.base,
                backgroundColor: COLORS.white,
              }}>
              <View style={{alignItems: 'flex-end', marginBottom: 10}}>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => setUpdateProjectModal(false)}>
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
              <ScrollView showsVerticalScrollIndicator={false}>
                <FormInput
                  label="Name"
                  keyboardType="default"
                  autoCompleteType="username"
                  value={projectname}
                  onChange={value => {
                    utils.validateText(value, setProjectError);
                    setProjectName(value);
                  }}
                  errorMsg={projectError}
                  appendComponent={
                    <View style={{justifyContent: 'center'}}>
                      <Image
                        source={
                          projectname == '' ||
                          (projectname != '' && projectError == '')
                            ? icons.correct
                            : icons.cancel
                        }
                        style={{
                          height: 20,
                          width: 20,
                          tintColor:
                            projectname == ''
                              ? COLORS.gray
                              : projectname != '' && projectError == ''
                              ? COLORS.green
                              : COLORS.red,
                        }}
                      />
                    </View>
                  }
                />
                <FormInput
                  label="Location"
                  keyboardType="default"
                  autoCompleteType="username"
                  value={projectlocation}
                  onChange={value => {
                    utils.validateText(value, setProjectLocationError);
                    setProjectLocation(value);
                  }}
                  errorMsg={projectLocationError}
                  appendComponent={
                    <View style={{justifyContent: 'center'}}>
                      <Image
                        source={
                          projectlocation == '' ||
                          (projectlocation != '' && projectLocationError == '')
                            ? icons.correct
                            : icons.cancel
                        }
                        style={{
                          height: 20,
                          width: 20,
                          tintColor:
                            projectlocation == ''
                              ? COLORS.gray
                              : projectlocation != '' &&
                                projectLocationError == ''
                              ? COLORS.green
                              : COLORS.red,
                        }}
                      />
                    </View>
                  }
                />

                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '90%',
                    }}>
                    <CustomDropdown
                      placeholder="Select category"
                      open={openCategory}
                      value={categoryValue}
                      items={projectCategory}
                      setOpen={setOpenCategory}
                      setValue={setCategoryValue}
                      setItems={setProjectCategory}
                      multiple={false}
                      listParentLabelStyle={{
                        color: COLORS.white,
                      }}
                      maxHeight={150}
                      zIndex={3000}
                      zIndexInverse={1000}
                      onOpen={onCategoryOpen}
                      onChangeValue={value => fetchProjectsTypes(value)}
                    />
                  </View>
                  <View style={{marginTop: 15}}>
                    <Tooltip
                      isVisible={showTip}
                      content={
                        <View style={{padding: 5}}>
                          <Text
                            style={{
                              ...FONTS.h4,
                              color: COLORS.lightblue_600,
                              fontWeight: 'bold',
                            }}>
                            Help
                          </Text>
                          <Text
                            style={{
                              ...FONTS.h4,
                              color: COLORS.darkGray,
                              textAlign: 'left',
                            }}>
                            Before creating the new projects, Click on the
                            account tab and create the project categories and
                            it's types, it's compulsory for creating a new
                            project.
                          </Text>
                        </View>
                      }
                      onClose={() => setTip(false)}
                      placement="bottom">
                      <TouchableOpacity style={{}} onPress={() => setTip(true)}>
                        <Image
                          source={icons.help1}
                          style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.lightblue_600,
                          }}
                        />
                      </TouchableOpacity>
                    </Tooltip>
                  </View>
                </View>

                <CustomDropdown
                  placeholder="Select types"
                  open={openType}
                  value={typeValue}
                  items={projectType}
                  setOpen={setOpenType}
                  setValue={setTypeValue}
                  setItems={setProjectType}
                  listParentLabelStyle={{
                    color: COLORS.white,
                  }}
                  maxHeight={150}
                  zIndex={2000}
                  zIndexInverse={2000}
                  onOpen={onTypeOpen}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <FormInput
                    label="Land area"
                    keyboardType="numeric"
                    autoCompleteType="cc-number"
                    containerStyle={{width: '60%'}}
                    value={projectplotarea.toString()}
                    onChange={value => {
                      utils.validateNumber(value, setProjectPlotAreaError);
                      setProjectPlotArea(value);
                    }}
                    errorMsg={projectPlotAreaError}
                  />
                  <View
                    style={{
                      marginTop: 13,
                      marginLeft: SIZES.radius,
                      width: '35%',
                    }}>
                    <CustomDropdown
                      placeholder="Unit"
                      open={openUnit}
                      value={unitValue}
                      items={projectUnit}
                      setOpen={setOpenUnit}
                      setValue={setUnitValue}
                      setItems={setProjectUnit}
                      listParentLabelStyle={{
                        color: COLORS.white,
                      }}
                      maxHeight={100}
                      zIndex={1000}
                      zIndexInverse={3000}
                      onOpen={onUnitOpen}
                    />
                  </View>
                </View>
                <TextButton
                  label="Update"
                  disabled={isEnableSubmit() ? false : true}
                  buttonContainerStyle={{
                    height: 45,
                    alignItems: 'center',
                    marginTop: SIZES.padding,
                    marginBottom: SIZES.padding,
                    borderRadius: SIZES.base,
                    backgroundColor: isEnableSubmit()
                      ? COLORS.majorelle_blue_800
                      : COLORS.transparentPrimary,
                  }}
                  onPress={() => updateProjectSubmit()}
                />
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // EDIT & UPDATE MODAL OF PROJECTS
  function renderProjectCrudModal() {
    return (
      <Modal animationType="fade" transparent={true} visible={projectCrud}>
        <TouchableWithoutFeedback onPress={() => setProjectCrud(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.transparentBlack5,
            }}>
            <View
              style={{
                position: 'absolute',
                width: '40%',
                backgroundColor: COLORS.white,
                paddingHorizontal: SIZES.radius,
                paddingVertical: SIZES.radius,
                borderRadius: 3,
              }}>
              <View>
                <TextButton
                  label="Update"
                  disabled={false}
                  buttonContainerStyle={{
                    backgroundColor: null,
                  }}
                  labelStyle={{
                    color: COLORS.black,
                    ...FONTS.h3,
                  }}
                  onPress={() => {
                    setUpdateProjectModal(true);
                    fetchProjectCategory();
                    // fetchProjectsTypes();
                  }}
                />
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: COLORS.gray,
                    marginVertical: SIZES.base,
                    marginHorizontal: SIZES.padding,
                  }}></View>
                <TextButton
                  label="Delete"
                  disabled={false}
                  buttonContainerStyle={{
                    backgroundColor: null,
                  }}
                  labelStyle={{
                    color: COLORS.black,
                    ...FONTS.h3,
                  }}
                  onPress={() => {
                    setDeleteConfirm(true);
                  }}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <View
      style={{
        marginTop: SIZES.radius,
        marginHorizontal: SIZES.radius,
        padding: 15,
        backgroundColor: COLORS.majorelle_blue_800,
        borderRadius: 5,
        ...styles.shadow,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={toggleExpanded}>
        <Text style={{...FONTS.h2, color: COLORS.white}}>Projects</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              right: 15,
              alignItems: 'center',
              backgroundColor: COLORS.yellow_400,
              paddingHorizontal: 5,
              paddingVertical: 1,
              borderRadius: 1,
            }}
            onPress={() => createProject()}>
            <Text style={{...FONTS.h4, color: COLORS.darkBlue}}>
              Create New
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleExpanded}>
            <Image
              source={collapsed ? icons.down_arrow : icons.up_arrow}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>{renderProjects()}</Collapsible>

      {renderCreateProjectModal()}
      {renderProjectCrudModal()}
      {renderUpdateProjectModal()}

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
        message={'Do you really want to delete this project?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => projectDeleteSubmit()}
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
export default ProjectsBanner;
