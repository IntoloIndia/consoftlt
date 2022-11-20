import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  HeaderBar,
  TextButton,
  FormInput,
  CustomDropdown,
  CustomToast,
  DeleteConfirmationToast,
} from '../../../Components';
import {COLORS, SIZES, FONTS, icons} from '../../../constants';
import {useSelector} from 'react-redux';
import {
  deleteProjectCategory,
  getProjectCategory,
  getProjectType,
  postProjectCategory,
  updateProjectCategory,
  postProjectType,
  updateProjectType,
  deleteProjectType,
} from '../../../controller/ProjectCategoryAndTypeController';
import Tooltip from 'react-native-walkthrough-tooltip';

const CategoryandType = () => {
  const [showTip, setTip] = React.useState(false);
  const [showTip1, setTip1] = React.useState(false);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  // DELETE CONFIRMATION
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteConfirm1, setDeleteConfirm1] = React.useState(false);

  // COMPANY DATA
  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);

  var companyData;
  if (companyDetail._id) {
    companyData = companyDetail;
  } else {
    companyData = userData;
  }
  const company_id = companyData._id;

  // STATES FOR STORING CATEGORIES & PROJECT TYPES DATA
  const [projectCategories, setProjectCategories] = React.useState([]);
  const [projectTypes, setProjectTypes] = React.useState([]);

  //MODAL
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [showTypesModal, setShowTypesModal] = React.useState(false);

  // FORM DATA
  const [catName, setCatName] = React.useState('');
  const [typeName, setTypeName] = React.useState('');

  //DROPDOWN
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState([]);
  const [items, setItems] = React.useState([]);

  // GET PROJECT CATEGORY
  const projectCategory = async () => {
    let response = await getProjectCategory(company_id);
    if (response.status === 200) {
      let catFromApi = response.data.map(item => {
        return {label: item.category_name, value: item._id};
      });
      setProjectCategories(response.data);
      setItems(catFromApi);
    }
  };

  // POST PROJECT CATEGORY DATA
  const postCategory = async () => {
    const formData = {
      category_name: catName,
      company_id: company_id,
    };
    let response = await postProjectCategory(formData);
    if (response.status == 200) {
      setShowCategoryModal(false);
      setSubmitToast(true);
      setCatName('');
      projectCategory();
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const [id, setId] = React.useState('');
  const getId = id => {
    setId(id);
  };

  // GET CATEGORY DATA
  const getData = name => {
    setCatName(name);
  };

  // EDIT PROJECT CATEGORY
  const editCategory = async () => {
    const formData = {
      category_name: catName,
      company_id: company_id,
    };
    let response = await updateProjectCategory(id, formData);
    if (response.status == 200) {
      setUpdateToast(true);
      projectCategory();
      setId('');
      setCatName('');
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 2000);
  };

  // GET CATEGORY ID
  const getCategoryId = id => {
    setCategoryId(id);
    setDeleteConfirm(true);
  };
  const [category_id, setCategoryId] = React.useState('');

  // DELETE PROJECT CATEGORY
  const deletecategory = async () => {
    let response = await deleteProjectCategory(category_id);
    if (response.status == 200) {
      setDeleteConfirm(false);
      setDeleteToast(true);
      projectCategory();
    }
    setTimeout(() => {
      setDeleteToast(false);
    }, 1500);
  };

  // GET PROJECT TYPES
  const getprojectTypes = async () => {
    let response = await getProjectType(company_id);
    if (response.status === 200) {
      setProjectTypes(response.data);
    }
  };

  // POST PROJECT TYPES DATA
  const postTypes = async () => {
    const formData = {
      category_id: value,
      project_type: typeName,
      company_id: company_id,
    };
    let response = await postProjectType(formData);
    if (response.status === 200) {
      setSubmitToast(true);
      setTypeName('');
      setValue('');
      getprojectTypes();
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  // GET TYPE ID
  const [typeid, setTypeId] = React.useState('');
  const gettypeId = id => {
    setTypeId(id);
  };

  // GET TYPE DATA
  const getTypeData = (cat_id, name) => {
    setValue(cat_id);
    setTypeName(name);
  };

  // EDIT PROJECT TYPE
  const edittype = async () => {
    const formData = {
      category_id: value,
      project_type: typeName,
      company_id: company_id,
    };
    let response = await updateProjectType(typeid, formData);
    if (response.status === 200) {
      setUpdateToast(true);
      getprojectTypes();
      setTypeName('');
      setTypeId('');
      setValue('');
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 2000);
  };

  const getTypeId = id => {
    setTypId(id);
    setDeleteConfirm1(true);
  };
  const [type_id, setTypId] = React.useState('');

  // DELETE PROJECT TYPE
  const deleteType = async () => {
    let response = await deleteProjectType(type_id);
    if (response.status === 200) {
      setDeleteConfirm1(false);
      setDeleteToast(true);
      getprojectTypes();
    }
    setTimeout(() => {
      setDeleteToast(false);
    }, 1500);
  };

  React.useEffect(() => {
    projectCategory();
    getprojectTypes();
  }, []);

  function renderCategories() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            paddingVertical: SIZES.base,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
              {index + 1}.
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                marginLeft: SIZES.radius,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
              }}>
              {item.category_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                getId(item._id);
                getData(item.category_name);
                setShowCategoryModal(true);
                // OnEdit();
              }}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.green,
                  padding: 3,
                  borderRadius: 2,
                  right: 15,
                }}>
                <Image
                  source={icons.edit}
                  style={{
                    height: 12,
                    width: 12,
                    tintColor: COLORS.white,
                  }}
                />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getCategoryId(item._id)}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.rose_600,
                  padding: 3,
                  borderRadius: 2,
                }}>
                <Image
                  source={icons.delete_icon}
                  style={{height: 12, width: 12, tintColor: COLORS.white}}
                />
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <View
        style={{
          marginHorizontal: SIZES.padding,
          backgroundColor: COLORS.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...FONTS.h2, color: COLORS.darkGray}}>Categories</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextButton
              label="Add New"
              buttonContainerStyle={{
                paddingHorizontal: 5,
                borderRadius: 2,
                right: 10,
                backgroundColor: COLORS.majorelle_blue_800,
              }}
              labelStyle={{...FONTS.h5}}
              onPress={() => {
                setCatName(''), setShowCategoryModal(true);
              }}
            />
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
                    Project categories like residential, commercial, industrial,
                    institutional, mixed-use, etc.
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
        <FlatList
          data={projectCategories}
          contentContainerStyle={{marginTop: SIZES.base, paddingBottom: 25}}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          maxHeight={250}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.gray2,
                  marginVertical: 2,
                }}></View>
            );
          }}
        />
      </View>
    );
  }

  function renderTypes() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            paddingVertical: SIZES.base,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
              {index + 1}.
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                marginLeft: SIZES.radius,
                color: COLORS.darkGray,
                textTransform: 'capitalize',
              }}>
              {item.project_type}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                gettypeId(item._id);
                getTypeData(item.category_id, item.project_type);
                setShowTypesModal(true);
              }}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.green,
                  padding: 3,
                  borderRadius: 2,
                  right: 15,
                }}>
                <Image
                  source={icons.edit}
                  style={{
                    height: 12,
                    width: 12,
                    tintColor: COLORS.white,
                  }}
                />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getTypeId(item._id)}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.rose_600,
                  padding: 3,
                  borderRadius: 2,
                }}>
                <Image
                  source={icons.delete_icon}
                  style={{height: 12, width: 12, tintColor: COLORS.white}}
                />
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    return (
      <View
        style={{
          marginTop: SIZES.padding * 1.5,
          marginHorizontal: SIZES.padding,
          backgroundColor: COLORS.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...FONTS.h2, color: COLORS.darkGray}}>Types</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextButton
              label="Add New"
              buttonContainerStyle={{
                paddingHorizontal: 5,
                borderRadius: 2,
                right: 10,
                backgroundColor: COLORS.majorelle_blue_800,
              }}
              labelStyle={{...FONTS.h5}}
              onPress={() => {
                projectCategory();
                setTypeName('');
                setShowTypesModal(true);
              }}
            />
            <Tooltip
              isVisible={showTip1}
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
                    Project Types like Residential - bungalows, duplexes,
                    high-rise & mid-rise apartments. {'\n'}Commercial - offices,
                    malls & multiplexes. {'\n'}Industrial - warehouses,
                    factories. {'\n'}Institutional - schools, colleges.{'\n'}
                    Mixed-use - nursing homes, restaurants, etc.
                  </Text>
                </View>
              }
              onClose={() => setTip1(false)}
              placement="bottom">
              <TouchableOpacity style={{}} onPress={() => setTip1(true)}>
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
        <FlatList
          contentContainerStyle={{marginTop: SIZES.radius, paddingBottom: 25}}
          data={projectTypes}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          maxHeight={250}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.gray2,
                  marginVertical: 2,
                }}></View>
            );
          }}
        />
      </View>
    );
  }

  function renderAddCategoriesModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoryModal}>
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
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{flex: 1, fontSize: 25, color: COLORS.darkGray}}>
                Categories
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <ScrollView>
              <FormInput
                label="Name"
                keyboardType="default"
                autoCompleteType="username"
                value={catName}
                onChange={value => {
                  setCatName(value);
                }}
              />
            </ScrollView>
            <TextButton
              label={id === '' ? 'Submit' : 'Update'}
              buttonContainerStyle={{
                height: 45,
                alignItems: 'center',
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
              }}
              onPress={() => {
                id === ''
                  ? (postCategory(), setShowCategoryModal(false))
                  : (editCategory(), setShowCategoryModal(false));
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderAddTypesModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={showTypesModal}>
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
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{flex: 1, fontSize: 25, color: COLORS.darkGray}}>
                Project Types
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setShowTypesModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <CustomDropdown
              placeholder="Select Categories"
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              categorySelectable={true}
              listParentLabelStyle={{
                color: COLORS.white,
              }}
              maxHeight={150}
            />
            <View style={{marginTop: 30}}>
              <FormInput
                label="Type Name"
                keyboardType="default"
                autoCompleteType="username"
                value={typeName}
                onChange={value => {
                  setTypeName(value);
                }}
              />
            </View>
            <TextButton
              label={typeid === '' ? 'Submit' : 'Update'}
              buttonContainerStyle={{
                height: 45,
                alignItems: 'center',
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
              }}
              onPress={() => {
                typeid === ''
                  ? (postTypes(), setShowTypesModal(false))
                  : (edittype(), setShowTypesModal(false));
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <HeaderBar right={true} title="Categories & Types" />

      {renderCategories()}
      {renderTypes()}
      {renderAddCategoriesModal()}
      {renderAddTypesModal()}

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
        message={'Do you really want to delete this project category?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => {
          deletecategory();
        }}
      />
      <DeleteConfirmationToast
        isVisible={deleteConfirm1}
        onClose={() => setDeleteConfirm1(false)}
        title={'Are You Sure?'}
        message={'Do you really want to delete this project type?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => deleteType()}
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

export default CategoryandType;
