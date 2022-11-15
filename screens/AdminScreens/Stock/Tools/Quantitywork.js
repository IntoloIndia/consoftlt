import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Image,
  Button,
} from 'react-native';
import {Card, Title, DataTable} from 'react-native-paper';
import {FormInput, TextButton, HeaderBar} from '../../../../Components';
import {COLORS, FONTS, SIZES, icons} from '../../../../constants';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import config from '../../../../config';

const Quantitywork = () => {
  const [value, setvalue] = useState(null);
  const [isFocus, setIsFocus] = React.useState(false);

  const [quantityitem, setquantityitem] = useState('');
  const [unitname, setunitname] = useState('');
  const [lenght, setlenght] = useState('');
  const [height, setheight] = useState('');
  const [breadth, setbreadth] = useState('');
  const [quantity, setquantity] = useState('');
  const [total, settotal] = useState(0);
  const [particulor, setparticulor] = useState('');

  const [datalist, setdatalist] = useState([]);
  const [quantityitemdata, setquantityitemdata] = useState([]);
  const [tabalshowdata, settabalshowdata] = useState([]);
  const [tabalshowdatamore, settabalshowdatamore] = useState([]);

  const [table, settable] = useState(false);
  const [additem, setadditem] = useState(false);
  const [workmodal, setworkmodal] = useState(false);
  const [showcardlist, setshowcardlist] = useState(false);

  React.useMemo(() => {
    const quantitytotal = lenght * breadth * height;
    setquantity(quantitytotal);
  }, [lenght, breadth, height]);

  //  console.log(quantity);
  const savedata = () => {
    const quantitywork = {
      particular: particulor,
      width: breadth,
      length: lenght,
      height: height,
      qty: quantity,
      item_id: value,
    };

    // fetch(`${config.API_URL}quantity-report`, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(quantitywork),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     setvalue('');
    //     setunitname('');
    //     setparticulor('');
    //     setlenght('');
    //     setbreadth('');
    //     setheight('');
    //     settotal('');
    //     console.log('Success:', data);
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
  };

  const saveQuantityitem = () => {
    const quantityworkitem = {
      item_name: quantityitem,
      unit_id: value,
    };
    try {
      fetch(`${config.API_URL}quantity-report-item`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quantityworkitem),
      })
        .then(response => response.json())
        .then(data => {
          setvalue('');
          setquantityitem('');
          // console.log('Success:', data);
        });
    } catch (error) {
      console.log('Error:', error);
    }
  };
  // quantity work get api

  const quantityworkdata = async () => {
    const resp = await fetch(`${config.API_URL}quantity-report-item`);
    const quantitydata = await resp.json();
    // console.log(quantitydata);
    setquantityitemdata(quantitydata);
  };
  useEffect(() => {
    quantityworkdata();
  }, []);

  // table data quantitytable api fetch api
  const quantitytable = async () => {
    try {
      const resp = await fetch(`${config.API_URL}quantity-report`);
      const tabledata = await resp.json();
      // console.log(tabledata);
      // setquantityitemdata(quantitydata);
    }
    catch (error) {
    console.log('error', error);
    }
  }

//       // console.log(tabledata); 
//      const data= tabledata.map((data) => {
//         return data.quantity;
//         // data.quantity.map((ab)=>{
//         //   return(console.log(ab.particular))
//         // })
//       });
//       const obj={}
// const val=data[0].map((res)=>{
//   Object.assign(obj,res)
// })
// console.log(obj)
// data[1].map(res=>{ Object.assign(val,res)})
//     } catch (error) {
//       console.log('error', error);
//     }
//   };
//   // console.log(tabalshowdatamore)
//   // useMemo(() => {
//   //   if (tabalshowdatamore) {
//   //     tabalshowdatamore[1].map((data, key) => {
//   //       console.log(data); 
//   //     });      
//   //   }else{
//   //     console.log("no data found")
//   //   }
//   // },[tabalshowdatamore]);

  useEffect(() => {
    quantitytable();
  }, []);

  //   unit api
  const listData = async () => {
    const resp = await fetch(`${config.API_URL}unit`);
    const data = await resp.json();
    //  console.log(data);
    setdatalist(data);
  };
  useEffect(() => {
    listData();
  }, []);

  // table show data api

  return (
    <View>
      <HeaderBar right={true} title="Quantity work" />
      <View>
        <Card style={{borderWidth: 3}}>
          <Card.Content>
            <TouchableOpacity
              onPress={() => {
                setshowcardlist(!showcardlist);
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Title>Quantity Work</Title>
                <AntDesign
                  size={18}
                  color="black"
                  name="caretdown"
                  style={{marginTop: 8, marginRight: 80}}
                />
                <TouchableOpacity
                  onPress={() => {
                    setadditem(true);
                  }}>
                  <Title
                    style={{
                      borderWidth: 1,
                      width: 100,
                      height: 35,
                      textAlign: 'center',
                    }}>
                    Add item
                  </Title>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
      <Modal transparent={false} visible={additem} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000aa',
            // justifyContent: 'center',
          }}>
          <View
            style={{
              // flex: 1,
              backgroundColor: '#fff',
              marginTop: 80,
              padding: 20,
              borderRadius: 20,
              margin: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // borderBottomWidth: 1,
              }}>
              <Text style={{...FONTS.body2}}>Quantity item</Text>
              <Pressable onPress={setadditem}>
                <AntDesign name="close" size={30} />
              </Pressable>
            </View>
            <View style={{marginTop: 20}}>
              <FormInput
                label="Name"
                onChange={quantityitem => {
                  setquantityitem(quantityitem);
                }}
              />
            </View>
            <View>
              <Dropdown
                style={[styles.dropdown1, isFocus && {borderColor: 'blue'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={datalist}
                search
                maxHeight={300}
                labelField="unit_name"
                valueField="_id"
                placeholder={!isFocus ? 'Select' : '...'}
                value={value}
                searchPlaceholder="Search..."
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setvalue(item._id);
                  setIsFocus(false);
                }}
              />
            </View>
            <View>
              <TextButton
                label="save"
                buttonContainerStyle={{
                  height: 45,
                  borderRadius: SIZES.radius,
                  marginTop: SIZES.padding,
                }}
                onPress={() => {
                  saveQuantityitem();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Card style={{borderWidth: 4, marginTop: 10}}>
        <Card.Content>
          {showcardlist && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  alignItems: 'center',
                }}>
                <Title>List works</Title>

                <TouchableOpacity
                  style={{
                    borderWidth: 2,
                    width: 90,
                    alignItems: 'center',
                    borderRadius: 10,
                    marginVertical: 5,
                  }}
                  onPress={() => {
                    setworkmodal(true);
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Title>Add</Title>
                    <Ionicons name="add-circle" size={28} color="black" />
                  </View>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.scroll} nestedScrollEnabled={true}>
                <TouchableOpacity
                  onPress={() => {
                    settable(!table);
                  }}>
                  {quantityitemdata.map((ele, key) => {
                    return (
                      <View key={key}>
                        <Title style={{textTransform: 'capitalize'}}>
                          {ele.item_name}
                        </Title>
                      </View>
                    );
                  })}
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
          <Modal transparent={false} visible={workmodal} animationType="slide">
            <View style={{flex: 1, backgroundColor: '#000000aa'}}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  marginTop: 80,
                  padding: 20,
                  borderRadius: 20,
                  margin: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                  }}>
                  <Text style={{...FONTS.body2}}></Text>
                  <Pressable onPress={setworkmodal}>
                    <AntDesign name="close" size={30} color="black" />
                  </Pressable>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Dropdown
                    style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={quantityitemdata}
                    search
                    maxHeight={300}
                    labelField="item_name"
                    valueField="_id"
                    placeholder={!isFocus ? 'Select' : '...'}
                    value={value}
                    searchPlaceholder="Search..."
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setvalue(item._id);
                      setunitname(item.unit_name);
                      setIsFocus(false);
                    }}
                  />
                  <FormInput
                    containerStyle={{width: '30%'}}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder={unitname}
                    onChange={unitname => {
                      setunitname(unitname);
                    }}
                  />
                </View>
                <ScrollView style={{maxHeight: 250}}>
                  <View>
                    <FormInput
                      label="Particular"
                      onChange={particulor => {
                        setparticulor(particulor);
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <FormInput
                      containerStyle={{width: '30%'}}
                      label="L"
                      keyboardType="numeric"
                      onChange={lenght => {
                        setlenght(lenght);
                      }}
                    />
                    <FormInput
                      containerStyle={{width: '30%'}}
                      label="B"
                      keyboardType="numeric"
                      onChange={breadth => {
                        setbreadth(breadth);
                      }}
                    />
                    <FormInput
                      containerStyle={{width: '30%'}}
                      label="H"
                      keyboardType="numeric"
                      onChange={height => {
                        setheight(height);
                      }}
                    />
                  </View>
                  <View>
                    <FormInput
                      label="Quantity"
                      // editable={false}
                      selectTextOnFocus={false}
                      onChange={text => {
                        settotal(text);
                        // console.log(quantity)
                      }}
                      value={quantity.toString()}
                    />
                  </View>
                </ScrollView>
                <View>
                  <TextButton
                    label="save"
                    buttonContainerStyle={{
                      height: 45,
                      borderRadius: SIZES.radius,
                      marginTop: SIZES.padding,
                    }}
                    onPress={() => {
                      savedata();
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          {table && (
            <View style={styles.container}>
              <Card style={{borderWidth: 2, marginTop: 10}}>
                <Card.Content>
                  <DataTable>
                    <DataTable.Header style={{borderBottomWidth: 1}}>
                      <DataTable.Cell>Sno</DataTable.Cell>
                      <DataTable.Cell>Part</DataTable.Cell>
                      <DataTable.Cell>L</DataTable.Cell>
                      <DataTable.Cell>B</DataTable.Cell>
                      <DataTable.Cell>H</DataTable.Cell>
                      <DataTable.Cell>qty</DataTable.Cell>
                      <DataTable.Cell>Unit</DataTable.Cell>
                    </DataTable.Header>

                    <DataTable.Row>
                      <DataTable.Cell>1</DataTable.Cell>
                      <DataTable.Cell>abc</DataTable.Cell>
                      <DataTable.Cell>11</DataTable.Cell>
                      <DataTable.Cell>22</DataTable.Cell>
                      <DataTable.Cell>35</DataTable.Cell>
                      <DataTable.Cell>--</DataTable.Cell>
                      <DataTable.Cell>Unit</DataTable.Cell>
                    </DataTable.Row>
                  </DataTable>
                </Card.Content>
              </Card>
            </View>
          )}
        </Card.Content>
      </Card>
      <View>
        {
          // console.log("neeche ............") &&
          //  console.log("data",tabalshowdatamore)
          // console.log("first") &&
          // console.log(tabalshowdatamore)
          // tabalshowdatamore.map((data,key)=>{
          //   return(
          //     <View key={key}>
          //     <Text>{console.log(data)}</Text>
          //     </View>
          //   )
          // })
        }
      </View>
    </View>
  );
};

export default Quantitywork;

const styles = StyleSheet.create({
  dropdown: {
    height: 45,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 28,
    width: '65%',
  },
  dropdown1: {
    height: 45,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 28,
  },
  scroll: {
    maxHeight: 100,
  },
});
