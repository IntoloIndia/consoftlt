import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  HeaderBar,
  TextButton,
  FormInput,
  IconButton,
  CustomDropdown,
  CustomToast,
  DeleteConfirmationToast,
} from '../../../Components';
import {COLORS, SIZES, FONTS, icons} from '../../../constants';
import {
  getItem,
  getStockEntry,
  postStockEntry,
} from '../../../controller/StockController';
import {useSelector} from 'react-redux';

const StocksAndInventry = ({route}) => {
  const {project_id} = route.params; //
  const companyData = useSelector(state => state.company);
  const company_id = companyData._id;
  // console.log(companyData._id)

  const [showAddMaterialsModal, setShowAddMaterialsModal] =
    React.useState(false);
  // company team states
  const [quantity, setQuantity] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [vehicleNo, setVehicleNo] = React.useState('');

  //drop
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState([]);
  const [items, setItems] = React.useState([]);

  //Gey data of stock-entry
  const [stocks, setStocks] = React.useState([]);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);

  //
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  // =============================== Apis ===================================

  const stockItem = async () => {
    let response = await getItem();
    // console.log(response);
    let itemFromApi = response.map(one => {
      return {label: one.item_name, value: one._id};
    });
    setItems(itemFromApi);
  };

  const stockEntry = async () => {
    let response = await getStockEntry();
    if (response.status === 200) {
      setStocks(response.data);
    }
  };

  const postStockEntryData = async () => {
    const formData = {
      item_id: value,
      qty: quantity,
      location: location,
      vehicle_no: vehicleNo,
      company_id: company_id,
      project_id: project_id,
    };

    let response = await postStockEntry(formData);
    if (response.status === 200) {
      setSubmitToast(true);
      stockEntry();
      setQuantity('');
      setLocation('');
      setVehicleNo('');
      setValue('');
      setShowAddMaterialsModal(false);
    } else {
      alert(response.message);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
  };

  React.useEffect(() => {
    stockItem();
    stockEntry();
  }, []);

  function renderTeamList() {
    const renderItem = ({item}) => (
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
            {item.item_name}
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
              alert('edit name');
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
              setDeleteConfirm(true);
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
    );
    return (
      <View
        style={{
          marginBottom: SIZES.padding,
          marginHorizontal: SIZES.padding,
          padding: 20,
          borderRadius: 3,
          backgroundColor: COLORS.white,
          ...styles.shadow,
        }}>
        <FlatList
          data={stocks}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          scrollEnabled={true}
          maxHeight={510}
          showsVerticalScrollIndicator={false}
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
    );
  }

  function renderAddMaterialModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddMaterialsModal}>
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{flex: 1, fontSize: 20, color: COLORS.darkGray}}>
                Materials
              </Text>
              <IconButton
                containerStyle={{
                  boborderWidth: 2,
                  borderRadius: 10,
                  borderColor: COLORS.gray2,
                }}
                icon={icons.cross}
                iconStyle={{
                  tintColor: COLORS.gray,
                }}
                onPress={() => setShowAddMaterialsModal(false)}
              />
            </View>
            <ScrollView>
              <CustomDropdown
                placeholder="Select Item"
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
              />
              <FormInput
                label="Quantity"
                keyboardType="numeric"
                onChange={value => {
                  setQuantity(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        quantity == '' || quantity != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          quantity == ''
                            ? COLORS.gray
                            : quantity != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <FormInput
                label="Location"
                keyboardType="default"
                onChange={value => {
                  setLocation(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        location == '' || location != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          location == ''
                            ? COLORS.gray
                            : location != ''
                            ? COLORS.green
                            : COLORS.red,
                      }}
                    />
                  </View>
                }
              />
              <FormInput
                label="Vehicle No"
                keyboardType="default"
                onChange={value => {
                  setVehicleNo(value);
                }}
                appendComponent={
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={
                        vehicleNo == '' || vehicleNo != ''
                          ? icons.correct
                          : icons.cancel
                      }
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          vehicleNo == ''
                            ? COLORS.gray
                            : vehicleNo != ''
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
                height: 55,
                alignItems: 'center',
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
              }}
              onPress={postStockEntryData}
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
      <HeaderBar right={true} title="Stock Inventry" />
      <TextButton
        label="Add New"
        buttonContainerStyle={{
          height: 45,
          alignItems: 'center',
          marginHorizontal: SIZES.padding,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightblue_700,
        }}
        onPress={() => setShowAddMaterialsModal(true)}
      />
      {renderTeamList()}
      {renderAddMaterialModal()}

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
        message={'Do you really want to delete?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => alert('delete')}
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
export default StocksAndInventry;
