import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  HeaderBar,
  FormInput,
  IconButton,
  TextButton,
  CustomDropdown,
  CustomToast,
} from '../../../Components';
import {COLORS, FONTS, SIZES, icons} from '../../../constants';
import {useSelector} from 'react-redux';
import {getUnits} from '../../../controller/UnitController';
import {
  postBoqNewAddItem,
  getBoqItemsList,
  postBOQItem,
  getBOQItems,
  updateBoqItem,
} from '../../../controller/BoqController';

const Boq = ({route}) => {
  // get company id
  // const companyData = useSelector(state => state.company);
  // const company_id = companyData._id;
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

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  const [addBoqModal, setAddBoqModal] = React.useState(false);
  const [addBoqNewItemModal, setAddBoqNewItemModal] = React.useState(false);
  const [editBoq, setEditBoq] = React.useState(false);

  //add new boq list items
  const [boqItemName, setBoqItemName] = React.useState('');
  // units
  const [openUnit, setOpenUnit] = React.useState(false);
  const [unitValue, setUnitValue] = React.useState([]);
  const [units, setUnits] = React.useState([]);

  //items dropdown
  const [openItems, setOpenItems] = React.useState(false);
  const [itemsValue, setItemsValue] = React.useState([]);
  const [items, setItems] = React.useState([]);

  // qty
  const [itemQty, setItemQty] = React.useState('');

  // get unit for show
  const [unit, getUnit] = React.useState('');
  // onselect
  const [unitId, getUnitId] = React.useState('');
  // get unit name for showing
  const [showUnitName, setShowUnitName] = React.useState('');

  const onBoqListOpen = React.useCallback(() => {
    fetchBoqItemsList();
  }, []);

  // get boq item units
  const fetchUnit = async () => {
    let data = await getUnits();
    let unitFromApi = data.map(ele => {
      return {label: ele.unit_name, value: ele._id};
    });
    setUnits(unitFromApi);
  };

  // post boq new list items
  const postBoqNewListItem = async () => {
    const formData = {
      company_id: company_id,
      item_name: boqItemName,
      unit_id: unitValue,
    };
    let data = await postBoqNewAddItem(formData);
    if (data.status === 200) {
      setAddBoqNewItemModal(false);
      setBoqItemName('');
      setUnitValue('');
      fetchUnit();
      setSubmitToast(true);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const addItemModal = () => {
    setBoqItemName('');
    setUnitValue('');
    fetchUnit();
    setAddBoqNewItemModal(true);
  };

  // get boq items
  const fetchBoqItemsList = async () => {
    let response = await getBoqItemsList(company_id);
    getUnit(response.data);
    let unitFromApi = response.data.map(ele => {
      return {label: ele.item_name, value: ele._id};
    });
    setItems(unitFromApi);
  };

  const openBOQModal = () => {
    fetchBoqItemsList();
    setItemsValue('');
    setItemQty('');
    setShowUnitName('');
    setAddBoqModal(true);
  };

  const OnSelectHandler = id => {
    unit.map(ele => {
      if (ele._id === id) {
        setShowUnitName(ele.unit_name);
        getUnitId(ele._id);
      }
    });
  };

  // post boq items
  const postBoqItem = async () => {
    const formData = {
      company_id: company_id,
      project_id: project_id,
      item_id: itemsValue,
      unit_name: showUnitName,
      qty: itemQty,
    };
    let data = await postBOQItem(formData);
    if (data.status === 200) {
      setAddBoqModal(false);
      fetchBoqItems();
      setItemsValue('');
      setItemQty('');
      setSubmitToast(true);
    } else {
      alert(data.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  const [boqItems, setBoqItems] = React.useState([]);

  const fetchBoqItems = async () => {
    let response = await getBOQItems(company_id, project_id);
    // console.log(response);
    if (response.status === 200) {
      setBoqItems(response.data);
    }
  };

  React.useEffect(() => {
    fetchBoqItems();
  }, []);

  const [getId, setGetId] = React.useState('');

  const editBoqItems = (item_id, id, itemQty, unitName) => {
    setGetId(id);
    setItemsValue(item_id);
    setItemQty(itemQty);
    setShowUnitName(unitName);
    setEditBoq(true);
    fetchBoqItemsList();
  };

  // update boq items
  const updateBoq = async () => {
    const formData = {
      company_id: company_id,
      project_id: project_id,
      item_id: itemsValue,
      unit_name: showUnitName,
      qty: itemQty,
    };
    let data = await updateBoqItem(getId, formData);
    if (data.status === 200) {
      setEditBoq(false);
      fetchBoqItems();
      setItemsValue('');
      setItemQty('');
      setUpdateToast(true);
    } else {
      alert(data.message);
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 2000);
  };

  function renderEditBoqItem() {
    return (
      <Modal animationType="slide" visible={editBoq} transparent={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              borderRadius: SIZES.base,
              backgroundColor: COLORS.white,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 20, color: COLORS.darkGray}}>
                Update BOQ
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.darkGray,
                  padding: 3,
                  borderRadius: 2,
                }}>
                <TouchableOpacity onPress={() => setEditBoq(false)}>
                  <Image
                    source={icons.cross}
                    style={{height: 12, width: 12, tintColor: COLORS.white}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View
              style={{
                marginTop: SIZES.padding,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '82%',
                  }}>
                  <DropDownPicker
                    style={{
                      borderWidth: null,
                      backgroundColor: COLORS.gray3,
                      minHeight: 40,
                    }}
                    dropDownContainerStyle={{
                      backgroundColor: COLORS.lightblue_800,
                      borderWidth: null,
                    }}
                    textStyle={{
                      fontSize: 15,
                      color: COLORS.black,
                      textTransform: 'capitalize',
                    }}
                    listParentLabelStyle={{color: COLORS.white, fontSize: 15}}
                    placeholder="Select items..."
                    open={openItems}
                    value={itemsValue}
                    items={items}
                    setOpen={setOpenItems}
                    setValue={setItemsValue}
                    setItems={setItems}
                    tickIconStyle={{
                      width: 15,
                      height: 15,
                      backgroundColor: COLORS.success_300,
                      borderRadius: SIZES.base,
                    }}
                    onSelectItem={value => OnSelectHandler(value.value)}
                    autoScroll={false}
                    // searchable={true}
                    // searchPlaceholder="Search..."
                    // searchContainerStyle={{
                    //   borderBottomColor: COLORS.white,
                    //   borderWidth: null,
                    //   borderColor: null,
                    //   height: 50,
                    // }}
                    // searchTextInputStyle={{
                    //   color: COLORS.black,
                    //   backgroundColor: COLORS.lightGray1,
                    // }}
                    // searchPlaceholderTextColor={COLORS.black}
                  />
                </View>
                <Text
                  style={{
                    height: 40,
                    backgroundColor: COLORS.gray3,
                    padding: 8,
                    borderRadius: SIZES.base,
                    fontSize: 15,
                    color: COLORS.black,
                    textAlign: 'center',
                  }}>
                  {showUnitName}
                </Text>
              </View>
              <FormInput
                label="Quantity"
                keyboardType="numeric"
                value={itemQty.toString()}
                onChange={value => {
                  setItemQty(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        itemQty == '' || itemQty != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          itemQty == ''
                            ? COLORS.gray
                            : itemQty != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <TextButton
                label="Update"
                buttonContainerStyle={{
                  height: 45,
                  marginTop: SIZES.padding * 1.5,
                  alignItems: 'center',
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightblue_700,
                }}
                onPress={() => updateBoq()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderBoqItems() {
    const renderItem = ({item, index}) => (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text
          style={{
            ...FONTS.h4,
            flex: 0.5,
            color: COLORS.darkGray,
          }}>
          {index + 1}.
        </Text>
        <Text
          style={{
            flex: 2,
            ...FONTS.h3,
            color: COLORS.darkGray,
          }}>
          {item.item_name}
        </Text>
        <Text
          style={{
            ...FONTS.h3,
            flex: 1.3,
            color: COLORS.darkGray,
            textAlign: 'right',
            // fontWeight: 'bold',
          }}>
          {item.completed_qty}/{item.qty}
        </Text>
        <Text
          style={{
            ...FONTS.h3,
            flex: 1,
            color: COLORS.darkGray,
            textAlign: 'right',
          }}>
          {item.unit_name}
        </Text>

        <TouchableOpacity
          style={{
            flex: 1.2,
            alignItems: 'flex-end',
          }}
          onPress={() =>
            editBoqItems(item.item_id, item._id, item.qty, item.unit_name)
          }>
          <ImageBackground
            style={{
              backgroundColor: COLORS.green,
              padding: 3,
              borderRadius: 2,
            }}>
            <Image
              source={icons.edit}
              style={{height: 12, width: 12, tintColor: COLORS.white}}
            />
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );

    return (
      <FlatList
        contentContainerStyle={{
          marginHorizontal: SIZES.padding,
          paddingBottom: 50,
        }}
        data={boqItems}
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
        ListHeaderComponent={
          <View style={{marginBottom: 3}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 0.5,
                  color: COLORS.black,
                  // fontWeight: 'bold',
                }}>
                Sn.
              </Text>
              <Text
                style={{
                  flex: 2,
                  ...FONTS.h3,
                  color: COLORS.black,
                  // fontWeight: 'bold',
                }}>
                Name
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 1.3,
                  color: COLORS.black,
                  textAlign: 'right',
                  // fontWeight: 'bold',
                }}>
                Quality
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 1,
                  color: COLORS.black,
                  textAlign: 'right',
                  // fontWeight: 'bold',
                }}>
                Unit
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 1.2,
                  color: COLORS.black,
                  textAlign: 'right',
                  // fontWeight: 'bold',
                }}>
                Edit{'\n'}/Delete
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: COLORS.black,
                marginVertical: SIZES.base,
              }}></View>
          </View>
        }
      />
    );
  }

  function renderAddItemModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={addBoqNewItemModal}>
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
                  fontSize: 25,
                  color: COLORS.darkGray,
                }}>
                Add items
              </Text>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.white,
                  padding: 2,
                  elevation: 20,
                }}>
                <TouchableOpacity onPress={() => setAddBoqNewItemModal(false)}>
                  <Image
                    source={icons.cross}
                    style={{height: 25, width: 25, tintColor: COLORS.rose_600}}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View style={{}}>
              <FormInput
                label="Item Name"
                keyboardType="default"
                onChange={value => {
                  setBoqItemName(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        boqItemName == '' || boqItemName != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          boqItemName == ''
                            ? COLORS.gray
                            : boqItemName != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <CustomDropdown
                placeholder="Select unit"
                open={openUnit}
                value={unitValue}
                items={units}
                setOpen={setOpenUnit}
                setValue={setUnitValue}
                setItems={setUnits}
                categorySelectable={true}
                listParentLabelStyle={{
                  color: COLORS.white,
                }}
                maxHeight={120}
              />
              <TextButton
                label="Submit"
                buttonContainerStyle={{
                  height: 45,
                  marginTop: SIZES.padding * 2.5,
                  alignItems: 'center',
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightblue_700,
                }}
                onPress={() => postBoqNewListItem()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderAddBoqModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={addBoqModal}>
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
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 25,
                }}>
                BOQ
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={addItemModal}
                  style={{
                    backgroundColor: COLORS.lightblue_700,
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
                    Add item
                  </Text>
                </TouchableOpacity>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity onPress={() => setAddBoqModal(false)}>
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
            <View style={{}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '82%',
                  }}>
                  <DropDownPicker
                    style={{
                      borderWidth: null,
                      backgroundColor: COLORS.gray3,
                      minHeight: 40,
                    }}
                    dropDownContainerStyle={{
                      backgroundColor: COLORS.lightblue_800,
                      borderWidth: null,
                    }}
                    textStyle={{
                      fontSize: 15,
                      color: COLORS.black,
                      textTransform: 'capitalize',
                    }}
                    listParentLabelStyle={{color: COLORS.white, fontSize: 15}}
                    placeholder="Select items..."
                    open={openItems}
                    value={itemsValue}
                    items={items}
                    setOpen={setOpenItems}
                    setValue={setItemsValue}
                    setItems={setItems}
                    tickIconStyle={{
                      width: 15,
                      height: 15,
                      backgroundColor: COLORS.success_300,
                      borderRadius: SIZES.base,
                    }}
                    onSelectItem={value => OnSelectHandler(value.value)}
                    autoScroll={false}
                    onOpen={onBoqListOpen}
                    maxHeight={120}
                    // searchable={true}
                    // searchPlaceholder="Search..."
                    // searchContainerStyle={{
                    //   borderBottomColor: COLORS.white,
                    //   borderWidth: null,
                    //   borderColor: null,
                    //   height: 50,
                    // }}
                    // searchTextInputStyle={{
                    //   color: COLORS.black,
                    //   backgroundColor: COLORS.lightGray1,
                    // }}
                    // searchPlaceholderTextColor={COLORS.black}
                  />
                </View>
                <Text
                  style={{
                    height: 40,
                    backgroundColor: COLORS.gray3,
                    padding: 8,
                    borderRadius: SIZES.base,
                    fontSize: 15,
                    color: COLORS.black,
                    textAlign: 'center',
                  }}>
                  {showUnitName}
                </Text>
              </View>
              <FormInput
                label="Quantity"
                keyboardType="numeric"
                onChange={value => {
                  setItemQty(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        itemQty == '' || itemQty != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          itemQty == ''
                            ? COLORS.gray
                            : itemQty != ''
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
                  marginTop: SIZES.padding,
                  alignItems: 'center',
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightblue_700,
                }}
                onPress={() => postBoqItem()}
              />
            </View>
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
      <HeaderBar right={true} title="Bill of Quantities" />
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
        onPress={openBOQModal}
      />
      {renderAddBoqModal()}
      {renderAddItemModal()}
      {renderBoqItems()}
      {renderEditBoqItem()}

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
export default Boq;
