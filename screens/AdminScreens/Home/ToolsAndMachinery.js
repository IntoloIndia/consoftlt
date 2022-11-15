import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
  FormInput,
  IconButton,
  TextButton,
  CustomToast,
  DeleteConfirmationToast,
} from '../../../Components';
import {COLORS, FONTS, SIZES, icons} from '../../../constants';
import {useSelector} from 'react-redux';
import {
  getToolsAndMachinery,
  postToolsAndMachinery,
  deleteToolsAndMachinery,
  editToolsAndMachinery,
} from '../../../controller/ToolsAndMachineryController';

const ToolsAndMachinery = ({route}) => {
  // const companyData = useSelector(state => state.company);
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
  const [showTAndMModal, setShowTAndMModal] = React.useState(false);
  const [showEditTAndMModal, setShowEditTAndMModal] = React.useState(false);
  const [toolsAndMachinery, setToolsAndMachinery] = React.useState([]);

  //Form data
  const [toolsName, setToolsName] = React.useState('');
  const [toolsQty, setToolsQty] = React.useState('');

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  //
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  //====================== Apis =========================================

  // get tools & machinery
  const fetchToolsAndMachinery = async () => {
    let data = await getToolsAndMachinery();
    setToolsAndMachinery(data);
  };

  // post tools & machinery
  const SubmitToolsAndMachinery = async () => {
    const formData = {
      tools_machinery_name: toolsName,
      qty: toolsQty,
      company_id: company_id,
    };
    let data = await postToolsAndMachinery(formData);
    if (data.status === 200) {
      setSubmitToast(true);
      setShowTAndMModal(false);
      setToolsName('');
      setToolsQty('');
      fetchToolsAndMachinery();
    } else {
      alert(data.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 1500);
  };

  const [toolId, setToolId] = React.useState('');

  const deletetoolandmachine = id => {
    setToolId(id);
    setDeleteConfirm(true);
  };

  // delete tools & machinery
  const DeleteToolsAndMachinery = async () => {
    let data = await deleteToolsAndMachinery(toolId);
    if (data.status === 200) {
      setDeleteToast(true);
      fetchToolsAndMachinery();
      setDeleteConfirm(false);
    }
    setTimeout(() => {
      setDeleteToast(false);
    }, 1500);
  };

  // edit tools & machinery
  const EditToolsAndMachinery = async () => {
    const formData = {
      tools_machinery_name: toolsName,
      qty: toolsQty,
      company_id: company_id,
    };
    let data = await editToolsAndMachinery(formData, toolsId);
    if (data.status === 200) {
      setUpdateToast(true);
      setShowEditTAndMModal(false);
      setToolsName('');
      setToolsQty('');
      fetchToolsAndMachinery();
    } else {
      alert(data.message);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 1500);
  };

  React.useEffect(() => {
    fetchToolsAndMachinery();
  }, []);

  const [toolsId, setToolsId] = React.useState('');
  const getEditData = (id, name, qty) => {
    setToolsName(name);
    setToolsQty(qty);
    setToolsId(id);
    setShowEditTAndMModal(true);
  };

  function renderToolsAndMachinery() {
    const renderItem = ({item, index}) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...FONTS.body4,
            color: COLORS.darkGray,
          }}>
          {index + 1}.
        </Text>
        <View
          style={{
            marginLeft: SIZES.radius,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              ...FONTS.body3,
              color: COLORS.darkGray,
              textTransform: 'capitalize',
            }}>
            {item.tools_machinery_name}
          </Text>
          <Text
            style={{
              ...FONTS.body3,
              color: COLORS.darkGray,
              // fontWeight: 'bold',
              right: 40,
            }}>
            {item.qty}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() =>
              getEditData(item._id, item.tools_machinery_name, item.qty)
            }>
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
                  width: 12,
                  height: 12,
                  tintColor: COLORS.white,
                }}
              />
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              // DeleteToolsAndMachinery(item._id)
              deletetoolandmachine(item._id)
            }>
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
    );
    return (
      <FlatList
        contentContainerStyle={{
          marginHorizontal: SIZES.padding,
          paddingBottom: 50,
        }}
        data={toolsAndMachinery}
        keyExtractor={item => `${item._id}`}
        scrollEnabled={true}
        renderItem={renderItem}
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

  function renderAddToolsAndMachineModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={showTAndMModal}>
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
              width: '90%',
              padding: SIZES.padding,
              borderRadius: 5,
              backgroundColor: COLORS.white,
            }}>
            {/* header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 25, color: COLORS.darkGray}}>
                Tools & Machine
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setShowTAndMModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <ScrollView>
              <FormInput
                label="Item name"
                keyboardType="default"
                autoCompleteType="username"
                // value={toolsName}
                onChange={value => {
                  setToolsName(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        toolsName == '' || toolsName != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          toolsName == ''
                            ? COLORS.gray
                            : toolsName != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <FormInput
                label="Quantity"
                keyboardType="numeric"
                // value={toolsQty.toString()}
                onChange={value => {
                  setToolsQty(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        toolsQty == '' || toolsQty != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          toolsQty == ''
                            ? COLORS.gray
                            : toolsQty != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
            </ScrollView>
            <TextButton
              label="Submit"
              buttonContainerStyle={{
                height: 45,
                marginTop: SIZES.padding,
                alignItems: 'center',
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.lightblue_700,
              }}
              onPress={() => SubmitToolsAndMachinery()}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderEditToolsAndMachineModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditTAndMModal}>
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
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 25, color: COLORS.darkGray}}>
                Tools & Machine
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setShowEditTAndMModal(false)}>
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
              <FormInput
                label="Item name"
                keyboardType="default"
                autoCompleteType="username"
                value={toolsName}
                onChange={value => {
                  setToolsName(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        toolsName == '' || toolsName != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          toolsName == ''
                            ? COLORS.gray
                            : toolsName != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <FormInput
                label="Quantity"
                keyboardType="numeric"
                value={toolsQty.toString()}
                onChange={value => {
                  setToolsQty(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        toolsQty == '' || toolsQty != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          toolsQty == ''
                            ? COLORS.gray
                            : toolsQty != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
            </ScrollView>
            <TextButton
              label="Update"
              buttonContainerStyle={{
                height: 45,
                marginTop: SIZES.padding,
                alignItems: 'center',
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.lightblue_700,
              }}
              onPress={() => EditToolsAndMachinery()}
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
      <HeaderBar right={true} title="Tools & Machinery" />
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
          setToolsName('');
          setToolsQty('');
          setShowTAndMModal(true);
        }}
      />
      {renderToolsAndMachinery()}
      {renderAddToolsAndMachineModal()}
      {renderEditToolsAndMachineModal()}

      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Submit"
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
        message={'Do you really want to delete?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => DeleteToolsAndMachinery()}
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
export default ToolsAndMachinery;
