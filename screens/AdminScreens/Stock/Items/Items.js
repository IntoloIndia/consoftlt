import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Card, Title} from 'react-native-paper';
import {FormInput, HeaderBar, TextButton} from '../../../../Components';
import {COLORS, FONTS, SIZES, icons} from '../../../../constants';
import {Dropdown} from 'react-native-element-dropdown';
import {
  submitItem,
  getUnits,
  saveUnitname,
  getItems,
  updateItems,
  deleteitems,
} from '../../../../controller/ItemsController';

const Items = () => {
  const [itemname, setItemname] = React.useState('');
  // const [itemunit, setItemunit] = React.useState('');

  // modal
  const [itemmodal, setItemmodal] = React.useState(false);
  const [unitmodal, setunitmodal] = React.useState(false);
  const [updateitemmodal, setupdateitemmodal] = useState(false);

  const [unitname, setUnitname] = React.useState('');

  const [data, setdata] = React.useState([]);

  const [datalist, setdatalist] = React.useState([]);

  const [value, setValue] = React.useState('');

  const [isFocus, setIsFocus] = React.useState(false);

  const [itemid, setitemid] = React.useState('');

  //  get units api
  const fetchData = async () => {
    let data = await getUnits();
    // console.log(data)
    setdata(data);
  };

  const listData = async () => {
    let data = await getItems();
    // console.log(data);
    setdatalist(data);
  };

  const submit = async () => {
    const dataitem = {
      item_name: itemname,
      unit_id: value,
    };
    let data = await submitItem(dataitem);
    // console.log(data);
    if (data.status === 200) {
      setItemname('');
      setValue('');
      listData();
      {
        itemname == '' || value == ''
          ? alert('all filed fill ')
          : data.message == 'This item is already exist'
          ? alert('This item is already exist')
          : alert('item  successfull create ');
      }
    }
    setItemmodal(false);
  };

  useEffect(() => {
    fetchData();
    listData();
  }, []);

  // unit create item modal
  const saveUnit = async () => {
    const unitdata = {
      unit_name: unitname,
    };
    let data = await saveUnitname(unitdata);
    // console.log(data);
    if (data.status === 200) {
      setUnitname('');
      fetchData();
      {
        unitname == ''
          ? alert('plz fill unitname')
          : data.message == 'This unit is already exist'
          ? alert('This unit is already exist')
          : alert('unit successfull create ');
      }
    }
  };
  const DeleteItem = async itemid => {
    let data = await deleteitems(itemid);
    alert('this item  deleted ');
    listData();
  };

  // edit modal api
  const edititem = (id, name, unit_id) => {
    setupdateitemmodal(true);
    setitemid(id);
    // console.log(id);
    setItemname(name);
    // console.log(name);
    setValue(unit_id);
    //  console.log(unit_id);
  };

  const updatedata = async () => {
    const updateItemdata = {
      item_name: itemname,
      unit_id: value,
    };
    let data = await updateItems(itemid, updateItemdata);
    if (data.status === 200) {
      setItemname('');
      setValue('');
      listData();
    }
    setupdateitemmodal(false);
  };

  function renderItems() {
    const renderItem = ({item, index}) => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
              color: COLORS.darkGray,
              left: 5,
              textTransform: 'capitalize',
            }}>
            {item.item_name}
          </Text>
        </View>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <View>
            <TouchableOpacity
              onPress={() => {
                edititem(item._id, item.item_name, item.unit_id);
              }}>
              <Image
                source={icons.edit}
                style={{
                  width: 18,
                  height: 18,
                  right: 15,
                  tintColor: COLORS.lightblue_900,
                }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => DeleteItem(item._id)}>
              <Image
                source={icons.delete_icon}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: COLORS.red,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
    return (
      <View
        style={{
          padding: 15,
          borderRadius: 3,
          backgroundColor: COLORS.lightblue_50,
          marginHorizontal: SIZES.padding,
          ...styles.shadow,
        }}>
        <FlatList
          data={datalist}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          maxHeight={410}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: COLORS.lightGray1,
                  marginVertical: 8,
                }}></View>
            );
          }}
        />
      </View>
    );
  }

  function renderAddModal() {
    return (
      <Modal animationType="slide" transparent={false} visible={itemmodal}>
        <View
          style={{
            backgroundColor: '#000000aa',
            flex: 1,
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 20,
              margin: 10,
            }}>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Item</Text>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={unitmodal}>
                  <View
                    style={{
                      backgroundColor: '#000000aa',
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#fff',

                        padding: 20,
                        borderRadius: 20,
                        margin: 10,
                      }}>
                      <View>
                        <Pressable onPress={setunitmodal}>
                          <Text
                            style={{
                              alignSelf: 'flex-end',
                              fontSize: 20,
                              fontWeight: 'bold',
                            }}>
                            X
                          </Text>
                        </Pressable>
                      </View>
                      <View>
                        <Card>
                          <Card.Content>
                            <Title>Unit</Title>
                          </Card.Content>
                        </Card>
                        <View>
                          <Card style={{borderWidth: 1}}>
                            <Card.Content>
                              <FormInput
                                label="unit name"
                                onChange={unitname => {
                                  setUnitname(unitname);
                                }}
                              />

                              <TextButton
                                label="Save"
                                buttonContainerStyle={{
                                  height: 45,
                                  borderRadius: SIZES.radius,
                                  marginTop: SIZES.padding,
                                }}
                                onPress={() => saveUnit()}
                              />
                            </Card.Content>
                          </Card>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
                <Pressable onPress={setItemmodal}>
                  <Text
                    style={{
                      alignSelf: 'flex-end',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    X
                  </Text>
                </Pressable>
              </View>

              <Card style={styles.Itemmodal}>
                <Card.Content>
                  <FormInput
                    label="item name"
                    onChange={itemname => {
                      setItemname(itemname);
                    }}
                  />
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                      Units
                    </Text>
                    <TouchableOpacity onPress={() => setunitmodal(true)}>
                      <Text
                        style={{
                          ...FONTS.body3,
                          borderWidth: 1,
                          paddingLeft: 10,
                          paddingRight: 10,
                          fontWeight: 'bold',
                          borderRadius: 10,
                          marginTop: 10,
                        }}>
                        Add unit
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Dropdown
                    style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="unit_name"
                    valueField="_id"
                    placeholder={!isFocus ? 'Select unit' : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setValue(item._id);
                      setIsFocus(false);
                    }}
                  />

                  <TextButton
                    label="Save"
                    buttonContainerStyle={{
                      height: 45,
                      borderRadius: SIZES.radius,
                      marginTop: SIZES.padding,
                    }}
                    onPress={() => submit()}
                  />
                </Card.Content>
              </Card>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  function renderUpdateModal() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={updateitemmodal}>
          <View
            style={{
              backgroundColor: '#000000aa',
              flex: 1,
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 20,
                margin: 10,
              }}>
              <ScrollView>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    Edit item
                  </Text>
                  <Pressable onPress={setupdateitemmodal}>
                    <Text
                      style={{
                        alignSelf: 'flex-end',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      X
                    </Text>
                  </Pressable>
                </View>

                <Card style={styles.Itemmodal}>
                  <Card.Content>
                    <FormInput
                      label="item name"
                      value={itemname}
                      onChange={value => {
                        setItemname(value);
                      }}
                    />
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {borderColor: 'blue'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={data}
                      search
                      maxHeight={300}
                      labelField="unit_name"
                      valueField="_id"
                      placeholder={!isFocus ? 'Select unit' : '...'}
                      searchPlaceholder="Search..."
                      value={value}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setValue(item._id);
                        setIsFocus(false);
                      }}
                    />

                    <TextButton
                      label="Update"
                      buttonContainerStyle={{
                        height: 45,
                        borderRadius: SIZES.radius,
                        marginTop: SIZES.padding,
                      }}
                      onPress={() => updatedata()}
                    />
                  </Card.Content>
                </Card>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };
  return (
    <View>
      <HeaderBar right={true} title="Items" />
      <TextButton
        label="Add New"
        buttonContainerStyle={{
          height: 45,
          alignItems: 'center',
          marginHorizontal: SIZES.padding,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
        }}
        onPress={() => setItemmodal(true)}
      />
      {renderItems()}
      {renderAddModal()}
      {renderUpdateModal()}
    </View>
  );
};

export default Items;
const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
  },
  Itemmodal: {
    borderWidth: 1,
    marginTop: 5,
    // backgroundColor:"yellow"
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 20,
    backgroundColor: COLORS.gray2,
    color: 'black',
    margin: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    // borderBottomWidth:1
  },
  title: {
    fontSize: 18,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
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
