import React, {useEffect, useState, useMemo,useRef, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  Modal,
  Pressable,
  Platform,
  UIManager,
  Button,
} from 'react-native';
import {Title, DataTable, Card} from 'react-native-paper';
import {FormInput, HeaderBar, TextButton} from '../../../../Components';
import {COLORS, FONTS, SIZES, icons} from '../../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Dropdown} from 'react-native-element-dropdown';
import config from '../../../../config';
import {getCompanyId, getToken} from '../../../../services/asyncStorageService';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Quantity = () => {
  // state
  const [quantityitem, setquantityitem] = useState('');
  const [unitname, setunitname] = useState('');
  const [value, setvalue] = useState(null);
  const [isFocus, setIsFocus] = React.useState(false);
  // modal
  const [additem, setadditem] = useState(false);
  const [reportmodal, setReportmodal] = useState(false);
  const [data, setdata] = useState([]);
  const [reportdata, setReportdata] = useState([]);
  // qtytotal
  const [qtyTotal, setQtyTotal] = useState([]);
  // console.log(qtyTotal)
  const [selectData, setSelectData] = useState([]);

  

  const [inputs, setInputs] = useState([
    {
      select: '',
      numlangth: '',
      numwidth: '',
      numheight: '',
      total: '',
      Remark: '',
    },
  ]);


  //get company id
  const [company_id, setCompany_id] = useState('');
  const [accessTokenoptiontype, setAccessTokenoptiontype] = useState('');

  const _companyId = async () => {
    const _id = await getCompanyId();
    setCompany_id(_id);
  };
  //  console.log(company_id);
  //setting token
  React.useEffect(() => {
    (async () => await _companyId())();
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      setAccessTokenoptiontype(token);
    })();
  });

     const inputkeyRef = useRef(inputs);
    //  inputkey.current.unitname


  const addHandler = () => {
    const _inputs = [...inputs];
    _inputs.push({
      select: '',
      numlangth: '',
      numwidth: '',
      numheight: '',
      total: '',
      Remark: '',
    });
    setInputs(_inputs) 
  };



  useMemo((e) => {
    inputs.map((rel, index) => {
      if (rel.key == index) {
        const test = rel.numlangth * rel.numwidth * rel.numheight;
        rel.total = test;
        setQtyTotal(rel.total);
      }
    });
  }, [qtyTotal]);


  useEffect(()=>{
    inputs.map((ele,index)=>{
      if(ele.key===index){
        setSelectData(ele.select)
      }
    })
  },[unitname])

  // const selectunitdata = useCallback(()=>{
  //   inputs.map((ele,index)=>{
  //         if(ele.key===index){
  //           setSelectData(ele.select)
  //         }
  //       })
  // },[selectData])

  

  const deleteHandler = key => {
    const _inputs = inputs.filter((input, index) => index != key);
    setInputs(_inputs);
  };


  function filterOnlyNumericValue(value){
    return value.replace(/[^0-9]/g,'');
}

  const inputselect = (item, key) => {
    const _inputselcet = [...inputs];
    _inputselcet[key].select = item;
    _inputselcet[key].key = key;
    setInputs(_inputselcet);
  };

  

  
  // console.log(selectData);
  
  const inputunit = (text, key) => {
      const _inputsunit = [...inputs];
      _inputsunit[key].unit = text;
      _inputsunit[key].key = key;
      setInputs(_inputsunit);
  };
  const inputlangth = (text, key) => {
    const _inputlangth = [...inputs];
    _inputlangth[key].numlangth = filterOnlyNumericValue(text);
    _inputlangth[key].key = key;
    setInputs(_inputlangth);
  };
  const inputwidth = (text, key) => {
    const _inputwidth = [...inputs];
    _inputwidth[key].numwidth = filterOnlyNumericValue(text);
    _inputwidth[key].key = key;
    setInputs(_inputwidth);
  };
  const inputhight = (text, key) => {
    const _inputhight = [...inputs];
    _inputhight[key].numheight = filterOnlyNumericValue(text);
    _inputhight[key].key = key;
    setInputs(_inputhight);
  };
  const inputtotal = (value, key) => {
    const _inputtotal = [...inputs];
    _inputtotal[key].total = value;
    _inputtotal[key].key = key;
    setInputs(_inputtotal);
  };

  const inputRemark = (text, key) => {
    const _inputRemark = [...inputs];
    _inputRemark[key].Remark = text;
    _inputRemark[key].key = key;
    setInputs(_inputRemark);
  };

  const addsubmit = () => {
      // console.log(inputs);
    }


  const fetchData = async () => {
    const resp = await fetch(`${config.API_URL}unit`);
    const data = await resp.json();
    //  console.log(data);
    setdata(data);
  };
  // get data api list

  useEffect(() => {
    fetchData();
  }, []);

  const saveItems = () => {
    const quantityworkitem = {
      item_name: quantityitem,
      unit_id: value,
      company_id: company_id,
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
          reportdataitem();
          // console.log('Success:', data);
        });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const reportdataitem = async () => {
    try {
      const resp = await fetch(
        `${config.API_URL}quantity-report-item/` + `${company_id}`,
      );
      const quantitydata = await resp.json();
    //   console.log(quantitydata);
      setReportdata(quantitydata);
      reportdataitem();
    } catch (error) {
      console.log(error, 'error');
    }
  };
  useEffect(() => {
    reportdataitem();
  }, []);

  // const moreItembox=()=>{
  //  alert('')
  // }


 

  return (
    <View>
      <HeaderBar right={true} title="Quantity" />
      <View>
        <TextButton
          label="Create Report"
          buttonContainerStyle={{
            height: 50,
            alignItems: 'center',
            marginHorizontal: SIZES.padding,
            marginBottom: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.lightblue_700,
          }}
          onPress={() => {
            setReportmodal(true);
          }}
        />
      </View>
      <View>
        <Modal visible={reportmodal} transparent={false} animationType="slide">
          <View style={{flex: 1, backgroundColor: '#000000aa', padding: 10}}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                marginTop: 50,
                borderRadius: 20,
                padding: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  justifyContent: 'space-between',
                }}>
                <Title>Items</Title>
                <Pressable onPress={setReportmodal}>
                  <AntDesign name="close" size={30} />
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{borderWidth: 1, borderRadius: 10}}
                  onPress={() => {
                    addHandler();
                    // selectunitdata();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 2,
                    }}>
                    <Text>Item</Text>
                    <MaterialIcons
                      name="add-box"
                      size={30}
                      color={COLORS.green}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{borderWidth: 1, borderRadius: 10, padding: 5}}
                  onPress={() => {
                    setadditem(true);
                  }}>
                  <Text>Add Item</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.container}>
                <ScrollView style={styles.inputsContainer}>
                  {inputs.map((input, key) => {
                      return(
                    <View style={styles.inputContainer} key={key}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          // alignItems: 'center',
                        }}
                        key={key}>
                        <Dropdown
                          style={[
                            styles.dropdown,
                            isFocus && {borderColor: 'blue'},
                          ]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={reportdata}
                          search
                          maxHeight={300}
                          labelField="item_name"
                          valueField="_id"
                          placeholder={!isFocus ? 'Select' : '...'}
                          searchPlaceholder="Search..."
                          value={input.value}
                          onChange={item => {
                            inputselect(item, key);
                            setunitname(item.unit_name);
                            
                            
                            // setValue(item._id);
                            // setIsFocus(false);
                          }}
                        />
                        <TextInput
                          style={styles.inputfromtwo}
                          editable={false}
                          selectTextOnFocus={false}
                          placeholder={'unit'}
                          value={(input.key===selectData.key)?"null":unitname}
                          // value={(selectData.index <= inputs.key)?unitname:"null"}
                          //  value = {(input.key==selectData.key)? unitname : null}
                          // value={selectData && unitname}
                          onChangeText={text => 
                            {inputunit(text, key)}}
                            />
                          


                        {/* <TouchableOpacity
                          onPress={() => {
                            // moreItembox();
                            alert('');
                          }}>
                          <MaterialIcons
                            name="add-box"
                            size={25}
                            color={COLORS.darkBlue}
                            style={{alignItems: 'center'}}
                          />
                        </TouchableOpacity> */}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <TextInput
                          style={styles.inputfromone}
                          placeholder="langth"
                          value={input.numlangth}
                          keyboardType="numeric"
                          onChangeText={text => {
                            inputlangth(text, key);
                          }}
                        />
                        <TextInput
                          style={styles.inputfromone}
                          placeholder="width"
                          value={input.numwidth}
                          keyboardType="numeric"
                          onChangeText={text => {
                            inputwidth(text, key);
                          }}
                        />
                        <TextInput
                          style={styles.inputfromone}
                          placeholder="hight"
                          value={input.numheight}
                          keyboardType="numeric"
                          onChangeText={text => {
                            inputhight(text, key);
                          }}
                        />
                        <TextInput
                         style={styles.inputfromtwo}
                          editable={false}
                          selectTextOnFocus={false}
                          placeholder={'Total'}
                            value={input.total==''?input.value:qtyTotal.toString()}
                            // value={qtyTotal.toString()}
                            keyboardType="numeric"
                            onChangeText={value => {
                              inputtotal(value, key);
                              // console.log(value)
                          }}
                        />
                     
                      </View>
                      <TextInput
                        style={{
                          width: '90%',
                          borderWidth: 1,
                          height: 30,
                          padding: -6,
                          paddingLeft: 5,
                          marginBottom: 5,
                          borderRadius: 10,
                          marginLeft: 5,
                          borderColor: COLORS.gray,
                          flexWrap: 'wrap',
                        }}
                        placeholder={'Remark'}
                        value={input.value}
                        onChangeText={text => inputRemark(text, key)}
                      />
                      <TouchableOpacity onPress={() => deleteHandler(key)}>
                        <Image
                          source={key == 0 ? null : icons.delete_icon}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.red,
                          }}
                        />
                      </TouchableOpacity>
                      {/* <View style={{flexDirection: 'row'}}>
                        {inputsmore.map((input, key) => (
                          <View
                            style={{flexDirection: 'row', flexWrap: 'wrap'}}
                            key={key}>
                            <TextInput
                              style={{
                                // width:"30%",
                                borderWidth: 1,
                                height: 30,
                                padding: -6,
                                paddingLeft: 5,
                                marginBottom: 5,
                                borderRadius: 10,
                                marginLeft: 5,
                                borderColor: COLORS.gray,
                                flexWrap: 'wrap',
                              }}
                              placeholder={'Name'}
                              value={input.value}
                              onChangeText={text => inputHandler(text, key)}
                            />
                            <TouchableOpacity
                              onPress={() => deleteHandlermore(key)}>
                              <Image
                                source={key == 0 ? null : icons.delete_icon}
                                style={{
                                  width: 20,
                                  height: 20,
                                  tintColor: COLORS.red,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View> */}
                    </View>
                    )
                  })}
                </ScrollView>
              </View>
              <View style={{marginTop: 10}}>
                <Button
                  title="submit"
                  onPress={() => {
                    addsubmit();
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View>
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
                <Dropdown
                  style={[styles.dropdown1, isFocus && {borderColor: 'blue'}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={data}
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
                    // setunitname(item.unit_name);
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
                    saveItems();
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Quantity;

const styles = StyleSheet.create({
  dropdown: {
    height: 35,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    // marginTop: 28,
    width: '60%',
    marginBottom: 5,
    borderColor: COLORS.gray,
  },
  dropdown1: {
    height: 45,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 28,
    marginBottom: 5,
    borderColor: COLORS.gray,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10,
  },
  inputsContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  inputfrom: {
    width: '30%',
    borderWidth: 1,
    height: 30,
    padding: -6,
    paddingLeft: 5,
    marginBottom: 5,
    borderRadius: 10,
    marginLeft: 5,
    borderColor: COLORS.gray,
  },
  inputfromtwo:{
  width: '25%',
  borderWidth: 1,
  height: 30,
  padding: -6,
  paddingLeft: 5,
  marginBottom: 5,
  borderRadius: 10,
  marginLeft: 5,
  backgroundColor: COLORS.gray2,
  color: 'black',
  textAlign: 'center',
  borderColor: COLORS.gray,
},
  inputfromone: {
    width: '23%',
    borderWidth: 1,
    height: 30,
    padding: -6,
    paddingLeft: 5,
    marginBottom: 5,
    borderRadius: 10,
    marginLeft: 5,
    borderColor: COLORS.gray,
  },
});


 // const addresult = useCallback(()=>{
      //   inputs.map((data)=>{
      //     data.total = (parseInt(data.numheight)* parseInt(data.numlangth)*
      //    parseInt(data.numwidth))
      //    setQtyTotal( data.total);
      //     console.log(qtyTotal);
      //   })
      // },[inputs,qtyTotal])
