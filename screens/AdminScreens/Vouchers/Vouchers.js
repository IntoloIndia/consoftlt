import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  Button,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import {FONTS, SIZES, COLORS, images, icons} from '../../../constants';
import {
  getPendingVoucher,
  getRevertedVoucher,
  getVerifiedVoucher,
  revertVoucher,
  verifyVoucher,
} from '../../../controller/VoucherController';
import {useSelector} from 'react-redux';
import {CustomToast} from '../../../Components';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Vouchers = () => {
  const companyDetail = useSelector(state => state.company);
  const company_id = companyDetail._id;
  // console.log(company_id);
  const [date, setDate] = React.useState(new Date());
  const MyDateString =
    date.getFullYear() +
    '%2F' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '%2F' +
    ('0' + date.getDate()).slice(-2);

  // voucher data
  const [pendingVoucher, setPendingVoucher] = React.useState([]);
  const [verifiedVoucher, setVerifiedVoucher] = React.useState([]);
  const [revertedVoucher, setRevertedVoucher] = React.useState([]);

  const [voucherModal, setVoucherModal] = React.useState(false);
  const [voucherModalData, setVoucherModalData] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);

  // console.log(voucherModalData);

  const fetchVerifiedVouchers = async () => {
    const res = await getVerifiedVoucher(company_id, MyDateString);
    setVerifiedVoucher(res.data);
  };

  const PURCHASED_VOUCHER = 'Purchase Request';
  const fetchPendingVouchers = async () => {
    const res = await getPendingVoucher(
      company_id,
      MyDateString,
      PURCHASED_VOUCHER,
    );
    setPendingVoucher(res.data);
  };

  const fetchRevertedVouchers = async () => {
    const res = await getRevertedVoucher(company_id, MyDateString);
    setRevertedVoucher(res.data);
  };

  const postVerifyVouchers = async id => {
    const res = await verifyVoucher(id);
    if (res.status === 200) {
      setVoucherModal(false);
      setSubmitToast(true);
      fetchVerifiedVouchers();
      fetchPendingVouchers();
      fetchRevertedVouchers();
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 2000);
    // console.log(res);
  };

  const postRevertVouchers = async id => {
    const res = await revertVoucher(id);
    if (res.status === 200) {
      setVoucherModal(false);
      setUpdateToast(true);
      fetchVerifiedVouchers();
      fetchPendingVouchers();
      fetchRevertedVouchers();
    }
    setTimeout(() => {
      setUpdateToast(false);
    }, 2000);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchVerifiedVouchers();
    fetchPendingVouchers();
    fetchRevertedVouchers();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    fetchVerifiedVouchers();
    fetchPendingVouchers();
    fetchRevertedVouchers();
  }, []);

  function renderVouchers() {
    const renderItem = ({item, index}) => (
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => setVoucherModal(true)}>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.darkGray,
          }}>
          {index + 1}.
        </Text>
        <Text
          style={{
            left: 3,
            ...FONTS.h3,
            textTransform: 'capitalize',
            color: COLORS.darkGray,
          }}>
          {item.item_name}
          {'  -  '}
        </Text>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.darkGray,
          }}>
          {item.qty}
        </Text>
      </TouchableOpacity>
    );

    return (
      <ScrollView>
        {voucherData.map((element, index) => {
          return (
            <View
              style={{
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.darkGray,
                  fontWeight: '500',
                }}>
                {element.voucher_type}
              </Text>

              {element.voucherData.map((ele, i) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      margin: 3,
                      backgroundColor: COLORS.white,
                      padding: 10,
                      elevation: 2,
                      borderRadius: 2,
                    }}
                    onPress={() => {
                      setVoucherModalData({
                        voucher_type: element.voucher_type,
                        project_name: element.project_name,
                        item_name: ele.item_name,
                        qty: ele.qty,
                        vehicle_no: ele.vehicle_no,
                        location: ele.location,
                        remark: ele.remark,
                      });
                      setVoucherModal(true);
                    }}>
                    <Text
                      style={{
                        ...FONTS.h3,
                        color: COLORS.darkGray,
                      }}>
                      {i + 1}.
                    </Text>
                    <Text
                      style={{
                        left: 3,
                        ...FONTS.h3,
                        textTransform: 'capitalize',
                        color: COLORS.darkGray,
                      }}>
                      {ele.item_name}
                      {'  -  '}
                    </Text>
                    <Text
                      style={{
                        ...FONTS.h3,
                        color: COLORS.darkGray,
                      }}>
                      {ele.qty}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    );
  }

  function renderVoucherModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={voucherModal}>
        <TouchableWithoutFeedback onPress={() => setVoucherModal(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              backgroundColor: COLORS.transparentBlack6,
            }}>
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '80%',
                padding: SIZES.padding,
                backgroundColor: COLORS.white,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}>
              {/* header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: COLORS.darkGray,
                    fontWeight: '500',
                  }}>
                  Voucher Details
                </Text>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity onPress={() => setVoucherModal(false)}>
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
              <View
                style={{
                  borderBottomWidth: 0.8,
                  borderColor: COLORS.darkGray2,
                  marginVertical: 5,
                  marginBottom: 15,
                }}></View>
              {/* <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                    Project name{' - '}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                    }}>
                    {voucherModalData.project_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                    Item name{' - '}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                    }}>
                    {voucherModalData.item_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                    Quantity{' - '}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                    }}>
                    {voucherModalData.qty}
                  </Text>
                </View>
                {voucherModalData.location != null ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                      Location{' - '}
                    </Text>
                    <Text
                      style={{
                        ...FONTS.h3,
                        color: COLORS.darkGray,
                        textTransform: 'capitalize',
                      }}>
                      {voucherModalData.location}
                    </Text>
                  </View>
                ) : null}
                {voucherModalData.vehicle_no != null ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                      Vehicle no{' - '}
                    </Text>
                    <Text
                      style={{
                        ...FONTS.h3,
                        color: COLORS.darkGray,
                        textTransform: 'capitalize',
                      }}>
                      {voucherModalData.vehicle_no}
                    </Text>
                  </View>
                ) : null}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...FONTS.h3, color: COLORS.darkGray}}>
                    Remark{' - '}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                    }}>
                    {voucherModalData.remark}
                  </Text>
                </View>
              </View> */}
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, alignItems: 'flex-start'}}>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    Item name
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    Quantity
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    Voucher Date
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    Location
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    Vehicle no
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    Remark
                  </Text>
                </View>
                <View style={{flex: 0.4, alignItems: 'center'}}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      marginBottom: 5,
                    }}>
                    -
                  </Text>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      marginBottom: 5,
                    }}>
                    -
                  </Text>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      marginBottom: 5,
                    }}>
                    -
                  </Text>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      marginBottom: 5,
                    }}>
                    -
                  </Text>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      marginBottom: 5,
                    }}>
                    -
                  </Text>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      marginBottom: 5,
                    }}>
                    -
                  </Text>
                </View>
                <View style={{flex: 1.6, alignItems: 'flex-start'}}>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    {voucherModalData.item_name}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    {voucherModalData.qty}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    {voucherModalData.voucher_date}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    {voucherModalData.location}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    {voucherModalData.vehicle_no}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.darkGray,
                      textTransform: 'capitalize',
                      marginBottom: 5,
                    }}>
                    {voucherModalData.remark}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderBottomWidth: 0.8,
                  borderColor: COLORS.lightGray1,
                  marginVertical: 10,
                }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: COLORS.green,
                  }}
                  onPress={() => postVerifyVouchers(voucherModalData._id)}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.white,
                      fontWeight: '500',
                    }}>
                    Verify
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: COLORS.red_600,
                    left: 20,
                  }}
                  onPress={() => postRevertVouchers(voucherModalData._id)}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.white,
                      fontWeight: '500',
                    }}>
                    Revert
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  function renderPendingVouchers() {
    const renderItem = ({item, index}) => (
      <>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.majorelle_blue_800,
            textTransform: 'capitalize',
            marginBottom: 5,
          }}>
          {item.project_name} -
        </Text>
        {item.voucherData.map((ele, i) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.success_400,
              marginBottom: 5,
              padding: 5,
              borderRadius: 2,
            }}
            onPress={() => {
              setVoucherModalData({
                project_name: item.project_name,
                voucher_type: ele.voucher_type,
                voucher_date: ele.voucher_date,
                item_name: ele.item_name,
                qty: ele.qty,
                vehicle_no: ele.vehicle_no,
                location: ele.location,
                remark: ele.remark,
                _id: ele._id,
              });
              setVoucherModal(true);
            }}>
            <Text
              style={{
                flex: 0.3,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {i + 1}.
            </Text>
            <Text
              style={{
                flex: 1.4,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.voucher_date}
            </Text>
            <Text
              style={{
                flex: 1.3,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.voucher_type}
            </Text>
            <Text
              style={{
                flex: 1.2,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.item_name}
            </Text>
            <Text
              style={{
                flex: 0.8,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.qty}
            </Text>
          </TouchableOpacity>
        ))}
      </>
    );

    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 6,
          elevation: 5,
          borderColor: COLORS.darkGray,
          borderWidth: 1,
          // marginTop: 20,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            color: COLORS.darkGray,
            textDecorationLine: 'underline',
          }}>
          Pending
        </Text>
        <FlatList
          contentContainerStyle={{marginTop: 10}}
          data={pendingVoucher}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  marginVertical: 5,
                }}></View>
            );
          }}
          // ListHeaderComponent={
          //   <View style={{marginBottom: 5}}>
          //     <View
          //       style={{
          //         flexDirection: 'row',
          //       }}>
          //       <Text
          //         style={{
          //           flex: 0.4,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Sn.
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1.2,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Date
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1.1,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Type
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1.8,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Name
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Qty
          //       </Text>
          //     </View>
          //     <View
          //       style={{
          //         height: 1,
          //         backgroundColor: COLORS.gray3,
          //         marginVertical: 5,
          //       }}></View>
          //   </View>
          // }
        />
      </View>
    );
  }

  function renderRevertVouchers() {
    const renderItem = ({item, index}) => (
      <>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.majorelle_blue_800,
            textTransform: 'capitalize',
            marginBottom: 5,
          }}>
          {item.project_name} -
        </Text>
        {item.voucherData.map((ele, i) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.lightGray2,
              marginBottom: 5,
              padding: 5,
              borderRadius: 2,
              elevation: 3,
              borderColor: COLORS.darkGray2,
              borderWidth: 0.3,
            }}>
            <Text
              style={{
                flex: 0.3,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {i + 1}.
            </Text>
            <Text
              style={{
                flex: 1.5,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.voucher_date}
            </Text>
            <Text
              style={{
                flex: 1.3,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.voucher_type}
            </Text>
            <Text
              style={{
                flex: 1.1,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.item_name}
            </Text>
            <Text
              style={{
                flex: 0.8,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.qty}
            </Text>
            {ele.revert_status === true ? (
              <Text
                style={{
                  flex: 0.8,
                  fontSize: 11,
                  color: COLORS.white,
                  textAlign: 'center',
                  backgroundColor: COLORS.red_600,
                  padding: 1,
                }}>
                Reverted
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </>
    );

    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 6,
          elevation: 5,
          borderColor: COLORS.darkGray,
          borderWidth: 1,
          marginTop: 20,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            color: COLORS.darkGray,
            textDecorationLine: 'underline',
          }}>
          Reverted
        </Text>
        <FlatList
          contentContainerStyle={{marginTop: 10}}
          data={revertedVoucher}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  marginVertical: 5,
                }}></View>
            );
          }}
          // ListHeaderComponent={
          //   <View style={{marginBottom: 5}}>
          //     <View
          //       style={{
          //         flexDirection: 'row',
          //       }}>
          //       <Text
          //         style={{
          //           flex: 0.4,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Sn.
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1.2,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Date
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1.1,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Type
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1.8,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Name
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Qty
          //       </Text>
          //     </View>
          //     <View
          //       style={{
          //         height: 1,
          //         backgroundColor: COLORS.gray3,
          //         marginVertical: 5,
          //       }}></View>
          //   </View>
          // }
        />
      </View>
    );
  }

  function renderAllVouchers() {
    const renderItem = ({item, index}) => (
      <>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.majorelle_blue_800,
            textTransform: 'capitalize',
            marginBottom: 5,
          }}>
          {item.project_name} -
        </Text>
        {item.voucherData.map((ele, i) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.lightGray2,
              marginBottom: 5,
              padding: 5,
              borderRadius: 2,
              elevation: 3,
              borderColor: COLORS.darkGray2,
              borderWidth: 0.3,
            }}>
            <Text
              style={{
                flex: 0.3,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {i + 1}.
            </Text>
            <Text
              style={{
                flex: 1.5,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.voucher_date}
            </Text>
            <Text
              style={{
                flex: 1.3,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.voucher_type}
            </Text>
            <Text
              style={{
                flex: 1.1,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.item_name}
            </Text>
            <Text
              style={{
                flex: 0.8,
                fontSize: 14,
                color: COLORS.black,
                textAlign: 'left',
              }}>
              {ele.qty}
            </Text>
            {ele.verify_status === true ? (
              <Text
                style={{
                  flex: 0.8,
                  fontSize: 12,
                  color: COLORS.white,
                  textAlign: 'center',
                  backgroundColor: COLORS.success_600,
                  padding: 1,
                }}>
                Verified
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </>
    );

    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 6,
          elevation: 5,
          borderColor: COLORS.darkGray,
          borderWidth: 1,
          marginTop: 20,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            color: COLORS.darkGray,
            textDecorationLine: 'underline',
          }}>
          Verified
        </Text>
        <FlatList
          contentContainerStyle={{marginTop: 10}}
          data={verifiedVoucher}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  marginVertical: 5,
                }}></View>
            );
          }}
          // ListHeaderComponent={
          //   <View style={{marginBottom: 5}}>
          //     <View
          //       style={{
          //         flexDirection: 'row',
          //       }}>
          //       <Text
          //         style={{
          //           flex: 0.4,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Sn.
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1.2,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Date
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1.1,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Type
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1.8,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Name
          //       </Text>
          //       <Text
          //         style={{
          //           flex: 1,
          //           fontSize: 15,
          //           fontWeight: '500',
          //           color: COLORS.darkGray,
          //           textAlign: 'left',
          //         }}>
          //         Qty
          //       </Text>
          //     </View>
          //     <View
          //       style={{
          //         height: 1,
          //         backgroundColor: COLORS.gray3,
          //         marginVertical: 5,
          //       }}></View>
          //   </View>
          // }
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1, margin: 10}}>
      <ScrollView
        style={{marginBottom: 20}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {renderPendingVouchers()}
        {renderRevertVouchers()}
        {renderAllVouchers()}
      </ScrollView>

      {renderVoucherModal()}
      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Voucher"
        message="Verified Successfully"
      />
      <CustomToast
        isVisible={updateToast}
        onClose={() => setUpdateToast(false)}
        color={COLORS.green}
        title="Revert"
        message="Reverted Successfully"
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

export default Vouchers;
