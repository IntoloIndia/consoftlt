import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import {
  FormInput,
  HeaderBar,
  TextButton,
  CustomToast,
} from '../../../Components';
import {COLORS, FONTS, SIZES, icons} from '../../../constants';
import {
  postItem,
  getUnits,
  getItems,
  updateItems,
  deleteItems,
  postUnit,
} from '../../../controller/ItemsController';
import DropDownPicker from 'react-native-dropdown-picker';

const Items = () => {
  // all modals
  const [itemModal, setItemModal] = React.useState(false);
  const [unitModal, setUnitModal] = React.useState(false);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  //unit form
  const [unitName, setUnitName] = React.useState('');

  //itsm form
  const [itemName, setItemName] = React.useState('');
  //roloe dropdown
  const [openUnit, setOpenUnit] = useState(false);
  const [unitValue, setUnitValue] = useState([]);
  const [unitItems, setUnitItems] = useState([]);

  //
  const [Items, setItems] = React.useState([]);

  // post unit
  const postUnitData = async () => {
    const formData = {
      unit_name: unitName,
    };
    const res = await postUnit(formData);
    if (res.status === 200) {
      setUnitModal(false);
      setUnitName('');
      setSubmitToast(true);
    } else {
      alert(res.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  //post item
  const postItemData = async () => {
    const formData = {
      item_name: itemName,
      unit_id: unitValue,
    };
    const res = await postItem(formData);
    if (res.status === 200) {
      setItemModal(false);
      setUnitValue('');
      setItemName('');
      setSubmitToast(true);
      fetchItems();
    } else {
      alert(res.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const fetchUnits = async () => {
    const res = await getUnits();
    let unitFromApi = res.map(list => {
      return {label: list.unit_name, value: list._id};
    });
    setUnitItems(unitFromApi);
  };

  const fetchItems = async () => {
    const res = await getItems();
    setItems(res.data);
  };

  const [itemId, setItemId] = React.useState('');

  const ItemEditHandler = (item_id, item_name, unit_value) => {
    setItemId(item_id);
    setItemName(item_name);
    setUnitValue(unit_value);
  };

  const updateItemData = async () => {
    const formData = {
      item_name: itemName,
      unit_id: unitValue,
    };
    const res = await updateItems(itemId, formData);
    if (res.status === 200) {
      setItemModal(false);
      setUnitValue('');
      setItemName('');
      setUpdateToast(true);
      fetchItems();
      setItemId('')
    } else {
      alert(res.message);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 2000);
  };

  const DeleteItems = async item_id => {
    const res = await deleteItems(item_id);
    if (res.status === 200) {
      fetchItems();
      setDeleteToast(true);
    } else {
      alert(res.message);
    }
    setTimeout(() => {
      setDeleteToast(false);
    }, 2000);
  };

  React.useEffect(() => {
    fetchUnits();
    fetchItems();
  }, []);
  //----------------------------------------------

  function renderAddItemModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={itemModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.transparentBlack6,
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
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 22,
                }}>
                Add New Item
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => setUnitModal(true)}
                  style={{
                    backgroundColor: COLORS.majorelle_blue_700,
                    paddingHorizontal: 4,
                    borderRadius: 3,
                    height: 25,
                    right: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      ...FONTS.h5,
                      color: COLORS.white,
                      textAlign: 'center',
                    }}>
                    Add Unit
                  </Text>
                </TouchableOpacity>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity onPress={() => setItemModal(false)}>
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
            </View>
            <View>
              <FormInput
                label="Item name"
                placeholder="Item Name"
                keyboardType="default"
                value={itemName}
                onChange={value => {
                  setItemName(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        itemName == '' || itemName != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          itemName == ''
                            ? COLORS.gray
                            : itemName != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <DropDownPicker
                style={{
                  borderWidth: null,
                  backgroundColor: COLORS.gray3,
                  minHeight: 40,
                  marginTop: SIZES.radius,
                }}
                dropDownContainerStyle={{
                  marginTop: 10,
                  backgroundColor: COLORS.majorelle_blue_800,
                  borderWidth: null,
                }}
                textStyle={{
                  fontSize: 15,
                  color: COLORS.black,
                }}
                listParentLabelStyle={{color: COLORS.white, fontSize: 15}}
                placeholder="Select unit"
                open={openUnit}
                value={unitValue}
                items={unitItems}
                setOpen={setOpenUnit}
                setValue={setUnitValue}
                setItems={setUnitItems}
                tickIconStyle={{
                  width: 15,
                  height: 15,
                  backgroundColor: COLORS.success_300,
                  borderRadius: SIZES.base,
                }}
                onSelectItem={value => console.log(value)}
                autoScroll={false}
                maxHeight={150}
                onOpen={fetchUnits}
              />

              <TextButton
                label={itemId === '' ? 'Submit' : 'Update'}
                buttonContainerStyle={{
                  height: 45,
                  marginTop: SIZES.padding * 1.5,
                  alignItems: 'center',
                  borderRadius: SIZES.radius,
                }}
                onPress={() => {
                  itemId === '' ? postItemData() : updateItemData();
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderAddUnitModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={unitModal}>
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
              <Text
                style={{
                  fontSize: 22,
                  color: COLORS.darkGray,
                }}>
                Add new unit
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setUnitModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View style={{}}>
              <FormInput
                label="Unit name"
                placeholder="Unit Name"
                keyboardType="default"
                onChange={value => {
                  setUnitName(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        unitName == '' || unitName != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          unitName == ''
                            ? COLORS.gray
                            : unitName != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <TextButton
                label="Submit"
                buttonContainerStyle={{
                  height: 45,
                  marginTop: SIZES.padding * 1.5,
                  alignItems: 'center',
                  borderRadius: SIZES.radius,
                }}
                onPress={() => postUnitData()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderItems() {
    const renderItem = ({item, index}) => (
      <View style={{marginBottom: 3}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              ...FONTS.h3,
              flex: 0.4,
              color: COLORS.darkGray,
              textAlign: 'left',
            }}>
            {index + 1}.
          </Text>
          <Text
            style={{
              flex: 1.8,
              ...FONTS.h3,
              color: COLORS.darkGray,
              textAlign: 'left',
              textTransform: 'capitalize',
            }}>
            {item.item_name}
          </Text>

          <Text
            style={{
              ...FONTS.h3,
              flex: 0.8,
              color: COLORS.darkGray,
              textAlign: 'left',
              // textTransform: 'capitalize',
            }}>
            {item.unit_name}
          </Text>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  setItemModal(true);
                  ItemEditHandler(item._id, item.item_name, item.unit_id);
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
                      width: 12,
                      height: 12,
                      tintColor: COLORS.white,
                    }}
                  />
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  DeleteItems(item._id);
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
        </View>
      </View>
    );

    return (
      <FlatList
        contentContainerStyle={{
          marginHorizontal: SIZES.padding,
          paddingBottom: 180,
        }}
        data={Items}
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
                marginVertical: 10,
              }}></View>
          );
        }}
        ListHeaderComponent={
          <View style={{marginBottom: 3}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 0.4,
                  color: COLORS.darkGray,
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}>
                Sn.
              </Text>
              <Text
                style={{
                  flex: 1.8,
                  ...FONTS.h3,
                  color: COLORS.darkGray,
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}>
                Name
              </Text>

              <Text
                style={{
                  ...FONTS.h3,
                  flex: 0.8,
                  color: COLORS.darkGray,
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}>
                Unit
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 1,
                  color: COLORS.darkGray,
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}>
                Edit/Delete
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 0.6,
                backgroundColor: COLORS.lightGray1,
                marginVertical: 5,
              }}></View>
          </View>
        }
      />
    );
  }
  //-----------------------------------------

  return (
    <View>
      <HeaderBar right={true} title="Stock Items" />
      <TextButton
        label="Add New"
        buttonContainerStyle={{
          height: 45,
          alignItems: 'center',
          marginHorizontal: SIZES.padding,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
        }}
        onPress={() => {
          setItemId('')
          setItemName('');
          setUnitValue('');
          setItemModal(true);
        }}
      />
      {renderAddItemModal()}
      {renderAddUnitModal()}
      {renderItems()}

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
    </View>
  );
};

export default Items;
