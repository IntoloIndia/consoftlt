import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Card, Title} from 'react-native-paper';
import {
  FormInput,
  TextButton,
  HeaderBar,
} from '../../../../Components';
import {FONTS, SIZES, COLORS, icons} from '../../../../constants';
import {Dropdown} from 'react-native-element-dropdown';
import { saveStockitem } from '../../../../controller/MangeStockController';
import { getCompanyId } from '../../../../services/asyncStorageService';


const url = 'http://192.168.1.99:8000/api/stock-entry';



const ManageStock = () => {
  const [modalstock, setmodalstock] = useState(false);
  // fix unit state
  const [unitname, setunitname] = useState('');

  const [unitmodal, setunitmodal] = React.useState(false);
  const [itemname, setItemname] = React.useState('');
  const [valueunit, setValueunit] = React.useState(null);
  const [isFocusunit, setIsFocusunit] = React.useState(false);

  // const [stockname, setstockname] = useState(null);

  const [data, setdata] = useState([]);
  const [dataunit, setdataunit] = useState([]);
  const [stocklist, setstocklist] = React.useState([]);

  const [qty, setqty] = useState('');
  const [location, setlocation] = useState('');
  const [vehicle, setvehicle] = useState('');

  const [value, setValue] = React.useState(null);
  const [isFocus, setIsFocus] = React.useState(false);

  // const [datalist, setdatalist] = React.useState([]);


  const [voucherId, setvoucherId] = React.useState('');
  const [test, settest] = React.useState(false)


  //get company id 
  const [company_id, setCompany_id] = useState('')
 
  const _companyId =async () => {
   
    const _id = await getCompanyId();
    setCompany_id(_id);
  }
  // console.log(company_id);
  //setting token
  React.useEffect(() => {
    (async () => await _companyId())();
  }, [])

const voucherItemupdate = (id,item_id,qty,location,vehicle,)=>{
    // Alert.alert(id,location);
    settest(true);
    setvoucherId(id);
        setValue(item_id);
        setqty(qty);
        setlocation(location);
        setvehicle(vehicle);
        // console.log(item_id,qty,location,vehicle);
        // setunitname(unitname);
  }
      // update api voucher 

      const Updatevocher = (e)=>{
        const voucherdata = {
          item_id: value,
          qty: qty,
          location: location,
          vehicle_no: vehicle,
          company_id:company_id
        }
          fetch('http://192.168.1.99:8000/api/stock-entry/'+ voucherId, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
          'Content-Type': 'application/json',
          },
          body:JSON.stringify(voucherdata),
        })
        .then(response => response.json())
        .then(data => {
          voucherItem();
          // console.log('Success:', data,alert("voucger update")); 
        })
    }



  // console.log(itemname,qty,place,vehicle);

  const itemData = async () => {
    try {
      const resp = await fetch('http://192.168.1.99:8000/api/item');
      const data = await resp.json();
      //  console.log(data);
      setdata(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    itemData();
  }, []);

  // post stock item
  const saveStock = async () => {
    // console.log(value, qty, location, vehicle);
    const voucheritem = {
      item_id: value,
      qty: qty,
      location: location,
      vehicle_no: vehicle,
      company_id:company_id
    };
    let data = await saveStockitem(voucheritem)
    // console.log(data)
    if(data.status===200){
        setValue('');
        setqty('');
        setlocation('');
        setvehicle('');
        setunitname('');
         voucherItem();
    }
        {
          value === '' ||
          unitname === '' ||
          qty === '' ||
          location === '' ||
          vehicle === ''
            ? alert('all field required')
            : alert('Created Succcessfully');
        }
      
  };

      //  show voucher list api 

        const voucherItem = async () => {
          try {
            const resp = await fetch('http://192.168.1.99:8000/api/stock-entry');
            const datavoucher = await resp.json();
            //  console.log(data);
            setstocklist(datavoucher);
          } catch (error) {
            console.log(error);
          }
        };

        useEffect(() => {
          voucherItem();
        }, [])
        


  const addstockitem = e => {
    //  alert("add item")
    const data = {
      item_name: itemname,
      unit_id: valueunit,
    };
    fetch('http://192.168.1.99:8000/api/item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        setItemname('');
        setValueunit('');
        // listData();
        itemData();
        // console.log('Success:', data);
        {
          itemname == '' || valueunit == ''
            ? alert('all filed fill ')
            : data.message == 'This item is already exist'
            ? alert('This item is already exist')
            : alert('item  successfull create ');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const fetchData = async () => {
    const resp = await fetch('http://192.168.1.99:8000/api/unit');
    const dataunit = await resp.json();
    // console.log(dataunit);
    setdataunit(dataunit);
  };

  useEffect(() => {
    fetchData();
  }, []);

 
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

  const renderLabelunit = () => {
    if (valueunit || isFocusunit) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const renderItem = ({item}) => {
    return (
      <ScrollView>
        <View>
          <View style={styles.item}>
            {/* <Text style={styles.title}>{item.item_id}</Text> */}
            <Text style={styles.title}>{item.location}</Text> 
             <View style={{justifyContent:"space-between", flexDirection: 'row',}}>
                <View style={{flexDirection:"row"}}>
                     <TouchableOpacity onPress={()=>voucherItemupdate(item._id,item.item_id,item.qty,item.location,item.vehicle_no)}>
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
                <TouchableOpacity onPress={()=>voucherDelete(item._id)}>
                <Image
                    source={icons.delete_icon}
                    style={{
                      width: 18,
                      height: 18,
                      right: 5,
                      tintColor: COLORS.red,
                    }}
                  />
                 </TouchableOpacity>
                </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View>
      <HeaderBar right={true} title="Manage Stock" />
       <View> 
       <TextButton
        label="Voucher"
        buttonContainerStyle={{
          height: 50,
          alignItems: 'center',
          marginHorizontal: SIZES.padding,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightblue_700,
        }}
        onPress={() => setmodalstock(true)}
      />
        
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={modalstock}>
                  <View style={{backgroundColor: '#000000aa', flex: 1}}>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        marginTop: 50,
                        padding: 20,
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                      }}>
                      <View>
                        <Pressable onPress={setmodalstock}>
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
                      <ScrollView>
                        <Card style={styles.card2}>
                          <Card.Content>
                            <TouchableOpacity
                              onPress={() => setunitmodal(true)}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-end',
                                }}>
                                <Text
                                  style={{
                                    ...FONTS.body3,
                                    borderWidth: 1,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    fontWeight: 'bold',
                                    borderRadius: 5,
                                  }}>
                                  add item
                                </Text>
                                <Modal
                                  animationType="slide"
                                  transparent={false}
                                  visible={unitmodal}>
                                  <View
                                    style={{
                                      backgroundColor: '#000000aa',
                                      flex: 1,
                                    }}>
                                    <View
                                      style={{
                                        backgroundColor: '#fff',
                                        flex: 1,
                                        marginTop: 40,
                                        padding: 20,
                                        borderRadius: 20,
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
                                            <Title>Item</Title>
                                          </Card.Content>
                                        </Card>
                                        <View>
                                          <Card style={{borderWidth: 1}}>
                                            <Card.Content>
                                              <FormInput
                                                label="Item name"
                                                onChange={itemname => {
                                                  setItemname(itemname);
                                                }}
                                              />

                                              <Dropdown
                                                style={[
                                                  styles.dropdowns,
                                                  isFocusunit && {
                                                    borderColor: 'blue',
                                                  },
                                                ]}
                                                placeholderStyle={
                                                  styles.placeholderStyle
                                                }
                                                selectedTextStyle={
                                                  styles.selectedTextStyle
                                                }
                                                inputSearchStyle={
                                                  styles.inputSearchStyle
                                                }
                                                iconStyle={styles.iconStyle}
                                                data={dataunit}
                                                search
                                                maxHeight={300}
                                                labelField="unit_name"
                                                valueField="_id"
                                                placeholder={
                                                  !isFocus
                                                    ? 'Select unit'
                                                    : '...'
                                                }
                                                searchPlaceholder="Search..."
                                                value={valueunit}
                                                onFocus={() =>
                                                  setIsFocusunit(true)
                                                }
                                                onBlur={() =>
                                                  setIsFocusunit(false)
                                                }
                                                onChange={item => {
                                                  // console.log(item);
                                                  setValueunit(item._id);

                                                  setIsFocusunit(false);
                                                }}
                                              
                                              />
                                              <TextButton
                                                label="Add item"
                                                buttonContainerStyle={{
                                                  height: 45,
                                                  borderRadius: SIZES.radius,
                                                  marginTop: SIZES.padding,
                                                }}
                                                onPress={() => addstockitem()}
                                              />
                                            </Card.Content>
                                          </Card>
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                </Modal>
                              </View>
                            </TouchableOpacity>
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
                              labelField="item_name"
                              valueField="_id"
                              placeholder={!isFocus ? 'Select item' : '...'}
                              searchPlaceholder="Search..."
                              value={value}
                              onFocus={() => setIsFocus(true)}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                // console.log(item.unit_id);
                                setValue(item._id);
                                setunitname(item.unit_name);
                                setIsFocus(false);
                              }}
                              
                            />
                            <View style={{justifyContent: 'space-between'}}>
                              <TextInput
                                style={styles.input}
                                editable={false}
                                selectTextOnFocus={false}
                                placeholder={unitname}
                              />
                              <FormInput
                                label="Quantity"
                                onChange={qty => {
                                  setqty(qty);
                                }}
                              />
                            </View>
                            <FormInput
                              label="Supplier/Vendor"
                              onChange={location => {
                                setlocation(location);
                              }}
                            />
                            <FormInput
                              label="Vehicle no"
                              onChange={vehicle => {
                                setvehicle(vehicle);
                              }}
                            />

                            <TextButton
                              label="save"
                              buttonContainerStyle={{
                                height: 45,
                                borderRadius: SIZES.radius,
                                marginTop: SIZES.padding,
                              }}
                              onPress={() => saveStock()}
                            />
                            
                          </Card.Content>
                        </Card>
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
        <View
          style={{
            marginBottom: SIZES.padding,
            marginTop: 5,
            padding: 20,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
            ...styles.shadow,
            marginHorizontal: SIZES.padding,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          // backgroundColor: COLORS.lightblue_700,
          }}>
          <Title style={{...FONTS.h2, color: COLORS.darkGray,borderBottomWidth:1}}>
            Voucher list
          </Title>
          <FlatList
            maxHeight={500}
            contentContainerStyle={{marginTop: SIZES.radius}}
            scrollEnabled={true}
            data={stocklist}
            keyExtractor={item => `${item._id}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={true}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: COLORS.lightGray1,
                    marginVertical: 5,
                  }}></View>
              );
            }}
          />
         </View> 
         {/* edit modal */}

         <Modal
                animationType="slide"
                transparent={false}
                  visible={test}>
                  <View style={{backgroundColor: '#000000aa', flex: 1}}>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        marginTop: 50,
                        padding: 30,
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                      }}>
                      <View>
                        <Pressable onPress={settest}>
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
                      <ScrollView>
                        <Card style={styles.card2}>
                          <Card.Content>
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
                              labelField="item_name"
                              valueField="_id"
                              placeholder={!isFocus ? 'Select item' : '...'}
                              searchPlaceholder="Search..."
                              value={value}
                              onFocus={() => setIsFocus(true)}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                // console.log(item.unit_id);
                                setValue(item._id);
                                setunitname(item.unit_id);
                                setIsFocus(false);
                              }}
                            />
                            <View style={{justifyContent: 'space-between'}}>
                              <FormInput
                                value={qty.toString()}
                                label="Quantity"
                                onChange={value => {
                                  setqty(value);
                                }}
                              />
                            </View>
                            <FormInput
                              value={location}
                              label="Supplier/Vendor"
                              onChange={value => {
                                setlocation(value);
                              }}
                            />
                            <FormInput
                              value={vehicle}
                              label="Vehicle no"
                              onChange={value => {
                                setvehicle(value);
                              }}
                            />

                            <TextButton
                              label="Update"
                              buttonContainerStyle={{
                                height: 45,
                                borderRadius: SIZES.radius,
                                marginTop: SIZES.padding,
                              }}
                              onPress={() => Updatevocher()}
                            />
                            
                          </Card.Content>
                        </Card>
                      </ScrollView>
                    </View>
                  </View>
                </Modal>

      </View> 
      </View>
  )
}

export default ManageStock;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 5,
  },
  card2: {
    borderWidth: 1,
    marginTop:20
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 5,
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
  // iconStyle: {
  //   width: 20,
  //   height: 20,
  // },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 20,
    backgroundColor: COLORS.gray2,
    color: 'black',
    marginTop: 20,
  },
  dropdowns: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    textTransform:"capitalize",
  },
});