import React, {useState, useEffect, useParams} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput, 
  FlatList,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Card, Title} from 'react-native-paper';
import {FormInput, HeaderBar, TextButton} from '../../../../Components';
import {SIZES, COLORS, icons, Images, FONTS} from '../../../../constants';

import {
  getUnits,
  postUnits,
  unitDelete,
  updateUnit,
} from '../../../../controller/UnitController';


const Unit = () => {
  const [unitname, setUintname] = useState('');
  const [data, setdata] = useState([]);

  // modal create unit
  const [modal, setModal] = useState(false);
  const [showBox, setShowBox] = useState(false);

  const [unitid, setunitid] = useState('');

  const updateunit = (id, name) => {
    setShowBox(true);
    setunitid(id);
    setUintname(name);
    //  console.log(name)
  };

  const Update = async () => {
    const updateunitdata = {
      unit_name: unitname,
    };

    let data = await updateUnit(unitid, updateunitdata);
    setUintname('');
    fetchData();
    alert('unit successfull update ');
    unitname == '';

    setShowBox(false);
  };

  const fetchData = async () => {
    const data = await getUnits();
    setdata(data);
  };
  // get data api list

  useEffect(() => {
    fetchData();
  }, []);

  // console.log(data);

  const submit = async e => {
    const unitdata = {
      unit_name: unitname,
    };
    let data = await postUnits(unitdata);
    if (data.status === 200) {
      setUintname('');
      fetchData();
    }
    {
      unitname == ''
        ? alert('plz fill unitname')
        : data.message == 'This unit is already exist'
        ? alert('This unit is already exist')
        : alert(' create ');
    }
    setModal(false);
  };

  //  delete unit api
  const DeleteUnit = async unitid => {
    let data = await unitDelete(unitid);
    alert('this unit  deleted ');
    fetchData();
  };

  const renderItem = ({item}) => {
    return (
      <ScrollView>
        <View>
          <View style={styles.item}>
            <Text style={styles.title}>{item.unit_name}</Text>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => updateunit(item._id, item.unit_name)}>
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
                <TouchableOpacity onPress={() => DeleteUnit(item._id)}>
                  <Image
                    source={icons.delete_icon}
                    style={{
                      width: 18,
                      height: 18,
                      right: 10,
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
      <HeaderBar right={true} title="Units" />
      <View
        style={{
          marginHorizontal: SIZES.padding,
        }}>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModal(true);
            }}>
            <Title style={{color: 'white'}}>Add unit</Title>
          </TouchableOpacity>

          <Modal animationType="fade" transparent={false} visible={modal}>
            <View
              style={{
                backgroundColor: '#000000aa',
                flex: 1,
              }}>
              <View
                style={{
                  marginTop: 100,
                  padding: 20,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderRadius: 20,
                  margin: 10,
                }}>
                <View>
                  <Pressable onPress={setModal}>
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
                <View style={{marginTop: 10}}>
                  <Card style={{backgroundColor: ''}}>
                    <Card.Content>
                      <Title>Unit name</Title>
                      <FormInput
                        onChange={unitname => {
                          setUintname(unitname);
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
                </View>
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
            }}>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={{...FONTS.h2, color: COLORS.darkGray}}>Units</Text>
            </View>
            <FlatList
              maxHeight={410}
              contentContainerStyle={{marginTop: SIZES.radius}}
              scrollEnabled={true}
              data={data}
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
          <View>
            <Modal animationType="fade" transparent={false} visible={showBox}>
              <View
                style={{
                  backgroundColor: '#000000aa',
                  flex: 1,
                }}>
                <View
                  style={{
                    marginTop: 100,
                    padding: 20,
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 20,
                    margin: 10,
                  }}>
                  <View>
                    <Pressable onPress={setShowBox}>
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
                  <View style={{marginTop: 10}}>
                    <Card style={{backgroundColor: ''}}>
                      <Card.Content>
                        <Title>Edit unit</Title>
                        <FormInput
                          value={unitname}
                          label="unit name"
                          onChange={value => {
                            setUintname(value);
                          }}
                        />

                        <TextButton
                          label="Update"
                          buttonContainerStyle={{
                            height: 45,
                            borderRadius: SIZES.radius,
                            marginTop: SIZES.padding,
                          }}
                          onPress={() => Update()}
                        />
                      </Card.Content>
                    </Card>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Unit;
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 20,
    backgroundColor: COLORS.gray2,
    color: 'black',
  },
  // listcard:{
  //   backgroundColor:"#FDF6EC",
  //   borderWidth:2,
  //   shadowColor:"#787A91",
  //   margin:5,
  //   elevation:50
  // },
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
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.lightblue_700,
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
});
