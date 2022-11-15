import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import {FormInput, TextButton, HeaderBar} from '../../../../Components';
import {COLORS, FONTS, SIZES, icons} from '../../../../constants';
import config from '../../../../config';
import {getCompanyId, getToken} from '../../../../services/asyncStorageService';
import {Dropdown} from 'react-native-element-dropdown';

const ToolAndMachinery1 = () => {
  const [toolmodal, settoolmodal] = useState(false);
  const [updatemodal, setupdatemodal] = useState(false);
  const [Toolsname, setToolsname] = useState('');
  const [Toolquantity, setToolquantity] = useState('');

  const [tooldata, settooldata] = useState([]);
  const [toolsId, settoolsId] = useState('');

  const [datalist, setdatalist] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [isFocus, setIsFocus] = React.useState(false);

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
  //  console.log(accessTokenoptiontype);

  const tools = (id, name, qty) => {
    setupdatemodal(true);
    settoolsId(id);
    setToolsname(name);
    setToolquantity(qty);
    // console.log(qty);
  };

  const updateTools = () => {
    const toolsupdate = {
      tools_machinery_name: Toolsname,
      qty: Toolquantity,
      company_id: company_id,
    };
    fetch('http://192.168.1.99:8000/api/tools-machinery/' + `${toolsId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toolsupdate),
    })
      .then(response => response.json())
      .then(data => {
        fetchDatatools();
        setToolsname('');
        // console.log('Success:', data);

        {
          Toolsname == ''
            ? alert('plz fill Tools name')
            : data.message == 'This Tools is already exist'
            ? alert('This Tools is already exist')
            : alert('update');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const fetchDatatools = async () => {
    const resp = await fetch('http://192.168.1.99:8000/api/tools-machinery', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + accessTokenoptiontype,
      },
    });
    const data = await resp.json();
    // console.log(data);
    settooldata(data);
  };

  useEffect(() => {
    fetchDatatools();
  }, []);

  const DeleteTools = async toolsId => {
    try {
      let result = await fetch(
        'http://107.20.37.104:8000/api/tools-machinery/' + `${toolsId}`,
        {
          method: 'DELETE',
        },
      );
      result = await result.json();
      // console.log(result, alert('deleted'));
      fetchDatatools();
    } catch (error) {
      console.log('error', error);
    }
  };

  const saveTools = () => {
    fetch(`${config.API_URL}tools-machinery`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tools_machinery_name: Toolsname,
        qty: Toolquantity,
        company_id: company_id,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setToolsname('');
        setToolquantity('');
        fetchDatatools();
        // console.log('Success:', data);

        // {
        //   Toolsname == ''
        //     ? alert('plz fill Tools name')
        //     : data.message == 'This Tools is already exist'
        //     ? alert('This Tools is already exist')
        //     : alert(' create ');
        // }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const listData = async () => {
    const resp = await fetch('http://192.168.1.99:8000/api/item');
    const data = await resp.json();
    //console.log(data);
    setdatalist(data);
  };
  useEffect(()=>{
    listData();
  },[])

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: SIZES.base,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.darkGray,
              textTransform: 'capitalize',
            }}>
            {item.tools_machinery_name}
          </Text>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.darkGray,
              fontWeight: 'bold',
            }}>
            {item.qty}
          </Text>
        </View>
        <View style={{marginLeft: 40, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              tools(item._id, item.tools_machinery_name, item.qty);
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
          <TouchableOpacity
            onPress={() => {
              DeleteTools(item._id);
            }}>
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
    );
  };

  return (
    <View>
      <HeaderBar right={true} title="ToolsAndMachinery" />
      <View>
        <TextButton
          label="Create Tools"
          buttonContainerStyle={{
            height: 50,
            alignItems: 'center',
            marginHorizontal: SIZES.padding,
            marginBottom: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.lightblue_700,
          }}
          onPress={() => settoolmodal(true)}
        />
       
        <Modal animationType="fade" visible={toolmodal} transparent={false}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000aa',
              justifyContent: 'center',
              padding: 10,
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  alignItems: 'center',
                }}>
                <Text style={{...FONTS.body3}}>ToolsAndMachinery</Text>
                <Pressable onPress={settoolmodal}>
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: 'bold',
                    }}>
                    X
                  </Text>
                </Pressable>
              </View>
              <ScrollView>
                <View>
                  <FormInput
                    label="Tools name"
                    onChange={Toolsname => {
                      setToolsname(Toolsname);
                    }}
                  />
                  <FormInput
                    label="Quantity"
                    keyboardType="numeric"
                    onChange={Toolquantity => {
                      setToolquantity(Toolquantity);
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
                      saveTools();
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <View
          style={{
            marginBottom: SIZES.padding,
            // marginTop: 5,
            padding: 20,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
            ...styles.shadow,
            marginHorizontal: SIZES.padding,
            marginBottom: SIZES.padding,
            borderRadius: SIZES.radius,
          }}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={{...FONTS.h2, color: COLORS.darkGray}}>
              ToolAndMachineryList
            </Text>
          </View>
          <FlatList
            maxHeight={410}
            contentContainerStyle={{marginTop: SIZES.radius}}
            scrollEnabled={true}
            data={tooldata}
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
        
        <Modal animationType="fade" visible={updatemodal} transparent={false}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000aa',
              justifyContent: 'center',
              padding: 10,
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 20,
                // flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  alignItems: 'center',
                }}>
                <Text style={{...FONTS.body3}}>update ToolsAndMachinery</Text>
                <Pressable onPress={setupdatemodal}>
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: 'bold',
                    }}>
                    X
                  </Text>
                </Pressable>
              </View>
              <ScrollView>
                <View>
                  <FormInput
                    label="Tools name"
                    onChange={Toolsname => {
                      setToolsname(Toolsname);
                    }}
                    value={Toolsname}
                  />
                  <FormInput
                    label="Quantity"
                    keyboardType="numeric"
                    onChange={Toolquantity => {
                      setToolquantity(Toolquantity);
                    }}
                    value={Toolquantity.toString()}
                  />
                </View>
                <View>
                  <TextButton
                    label="update"
                    buttonContainerStyle={{
                      height: 45,
                      borderRadius: SIZES.radius,
                      marginTop: SIZES.padding,
                    }}
                    onPress={() => {
                      updateTools();
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default ToolAndMachinery1;
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.lightblue_700,
    padding: 5,
    height: 40,
    // borderRadius: 10,
  },
  
  scroll: {
    maxHeight: 300,
  },
  
  // container: {
  //   paddingTop: 100,
  //   paddingHorizontal: 30,
  // },
});
