import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {COLORS, SIZES, FONTS, icons} from '../../../constants';
import {verifySubmitWorks} from '../../../controller/VerifyController';
import {revertSubmitWork} from '../../../controller/RevertController';
import {CustomToast} from '../../../Components';

const SubmittedWorks = ({data, Submitfunction}) => {
  const [revertModal, setRevertModal] = React.useState(false);
  const [revertMsg, setRevertMsg] = React.useState('');
  const [revertId, setRevertId] = React.useState('');
  const [submitToast, setSubmitToast] = React.useState(false);
  const [workPercent, setWorkPercent] = React.useState('');

  //=========================== Apis ==========================================
  // verify works
  const verifyHandler = async work_Id => {
    let data = await verifySubmitWorks(work_Id);
    if (data.status === 200) {
      Submitfunction();
    }
  };

  const getRevertWorkId = (id, work_percent) => {
    setRevertId(id);
  };

  const OnSubmit = async () => {
    const formData = {
      revert_msg: revertMsg,
      work_percent: workPercent,
    };
    let data = await revertSubmitWork(revertId, formData);
    if (data.status === 200) {
      Submitfunction();
      setRevertModal(false);
      setSubmitToast(true);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 1500);
  };

  function renderRevertModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={revertModal}>
        <TouchableWithoutFeedback onPress={() => setRevertModal(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.transparentBlack7,
            }}>
            <View
              style={{
                position: 'absolute',
                backgroundColor: COLORS.white,
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.radius,
                width: '90%',
                top: '30%',
                borderRadius: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={{fontSize: 20, color: COLORS.darkGray}}>
                  Comment
                </Text>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity onPress={() => setRevertModal(false)}>
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
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.darkGray,
                }}>
                <TextInput
                  style={{color: COLORS.black}}
                  placeholder="Write comment..."
                  onChangeText={value => {
                    setRevertMsg(value);
                  }}
                />
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.darkGray,
                }}>
                <Text style={{marginTop: 5}}>Progress %</Text>
                <TextInput
                  style={{color: COLORS.black}}
                  placeholder="%"
                  value={workPercent.toString()}
                  onChangeText={value => {
                    setWorkPercent(value);
                  }}
                />
              </View>

              <TouchableOpacity
                style={{
                  marginTop: SIZES.padding,
                  alignItems: 'center',
                }}
                onPress={() => OnSubmit()}>
                <Text
                  style={{
                    ...FONTS.h3,
                    backgroundColor: COLORS.lightblue_800,
                    paddingHorizontal: SIZES.radius,
                    paddingVertical: 5,
                    borderRadius: 3,
                    color: COLORS.white,
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  function renderSubmitWork() {
    const renderItem = ({item}) => {
      return (
        <View style={{}}>
          {/* username  */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                  textTransform: 'capitalize',
                }}>
                {item.user_name}
              </Text>
              <Text
                style={{
                  left: 5,
                  backgroundColor: COLORS.yellow_400,
                  paddingHorizontal: 5,
                  fontSize: 10,
                  color: COLORS.black,
                }}>
                {item.work_code}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', right: 10}}>
                <Image
                  source={icons.date}
                  style={{
                    height: 10,
                    width: 10,
                    tintColor: COLORS.darkGray,
                    right: 3,
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.darkGray,
                  }}>
                  {item.submit_work_date}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={icons.time}
                  style={{
                    height: 10,
                    width: 10,
                    tintColor: COLORS.darkGray,
                    right: 3,
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.darkGray,
                  }}>
                  {item.submit_work_time}
                </Text>
              </View>
            </View>
          </View>
          {/* work  */}
          <View
            style={{
              marginTop: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                ...FONTS.h3,
                color: COLORS.darkGray,
              }}>
              Work
              <Text style={{color: COLORS.darkGray, ...FONTS.h3}}>
                - {item.work}
              </Text>
            </Text>
            <TouchableOpacity onPress={() => verifyHandler(item._id)}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.green,
                  paddingHorizontal: 10,
                  borderRadius: 2,
                }}>
                <Text style={{fontSize: 14, color: COLORS.white}}>Verify</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                // marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.completion_date}
                style={{
                  height: 18,
                  width: 18,
                  tintColor: COLORS.darkGray,
                }}
              />
              <Text
                style={{
                  ...FONTS.h4,
                  color: COLORS.darkGray,
                  left: 10,
                }}>
                {item.exp_completion_date}
              </Text>

              <Image
                source={icons.persent_progress}
                style={{
                  height: 18,
                  width: 18,
                  tintColor: COLORS.darkGray,
                  left: 30,
                }}
              />
              <Text
                style={{
                  ...FONTS.h4,
                  color: COLORS.darkGray,
                  left: 40,
                }}>
                {item.work_percent}%
              </Text>
            </View>
            {/* <Text
              style={{
                flex: 1,
                ...FONTS.h4,
                color: COLORS.black,
              }}>
              Msg
              <Text style={{color: COLORS.darkGray}}>
                - {item.submit_work_text}
              </Text>
            </Text> */}
            <TouchableOpacity
              onPress={() => {
                setWorkPercent(item.work_percent);
                getRevertWorkId(item._id, item.work_percent),
                  setRevertModal(true);
              }}
              style={{alignItems: 'flex-end'}}>
              <ImageBackground
                style={{
                  backgroundColor: COLORS.rose_600,
                  paddingHorizontal: 8,
                  borderRadius: 2,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.white,
                  }}>
                  Revert
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <FlatList
        data={data}
        keyExtractor={item => `${item._id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        maxHeight={300}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray,
                marginVertical: 12,
              }}></View>
          );
        }}
      />
    );
  }

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        marginHorizontal: SIZES.radius,
        marginTop: SIZES.padding,
        borderRadius: 5,
        padding: 15,
        ...styles.shadow,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.darkGray,
            marginBottom: SIZES.radius,
          }}>
          Submitted Works
        </Text>
        {/* <TouchableOpacity onPress={() => console.log('fdjhg')}>
          <Image
            source={icons.filter}
            resizeMode="contain"
            style={{height: 18, width: 18, tintColor: COLORS.darkGray}}
          />
        </TouchableOpacity> */}
      </View>
      {renderSubmitWork()}
      {renderRevertModal()}
      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Submit"
        message="Submitted Successfully..."
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
export default SubmittedWorks;
