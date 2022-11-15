import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity, LayoutAnimation,
  RefreshControl, ScrollView, Pressable
} from 'react-native';
import { SIZES, COLORS, FONTS, icons, images } from '../../../constants';
import { AccordionList } from 'accordion-collapse-react-native';
import { TextInput } from 'react-native-paper';
import { Divider, IndexPath } from '@ui-kitten/components';
import { CustomToast, DeleteConfirmationToast } from '../../../Components'
import styles from '../TaskModal/css/InProgressModalStyle.js';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
// import Config from '../../../config';
import {
  getAssignWorks,
  submitWork,
  submitComment
} from '../../../controller/UserAssignWorkController';

Entypo.loadFont();
const UserAssignWorks = ({ loading }) => {
  // const dispatch = useDispatch();
  const [assignWorksData, setAssignWorksData] = React.useState([]);
  const [assignWork, setAssignWork] = React.useState('');

  const [textMsg, setTextMsg] = React.useState('');
  const [userDataId, setUserDataId] = useState('');
  const [getTaskInProgress, setGetTaskInProgress] = useState('');

  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);
  const [updateToast, setUpdateToast] = React.useState(false);
  const [deleteToast, setDeleteToast] = React.useState(false);


  const animation = useRef(new Animated.Value(0)).current;
  const scale = animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });

  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [commentCollapse, setCommentCollapse] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false)

  const userData = useSelector(state => state.user);
  // console.log(userData._id)
  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 0.5,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    setTimeout(() => {
      Animated.spring(animation, {
        toValue: 0.2,
        useNativeDriver: true,
      }).start();
    }, 150);
  };



  const fetchAssignWorks = async () => {
    setUserDataId(userData._id);
    const data = await getAssignWorks(userData._id);

    if (data) {
      data.map(async (ele, index) => {

        setAssignWork(ele.assign_works);
        setGetTaskInProgress(ele.assign_works);

      });
    }
  };



  useMemo(() => {
    fetchAssignWorks();
  }, [loading, ' ']);

  // submit comment
  const submitComments = async work_id => {

    const submit_data = {
      comment: textMsg
    };

    const data = await submitComment(submit_data, work_id);

    if (data.status === 200) {
      setTextMsg('');
      setSubmitToast(true);
      setCommentStatus(true);
      fetchAssignWorks();
      setTimeout(() => {
        setSubmitToast(false);
      }, 900);
    }

  };

  const submitWorkPercent = async (item, index) => {


    const submit_data = {
      work_percent: item.work_percent
    }

    // console.log("🚀 ~ file: UserAssignWorks.js ~ line 79 ~ submitWorkPercent ~ item.work_percent", item.work_percent)
    // const _inputs = [...getTaskInProgress];
    // _inputs[index].work_percent
    // setIsExpandId(_inputs[index].work_percent);


    const data = await submitWork(submit_data, item._id);

    if (data.status === 200) {
      fetchAssignWorks();
      setSubmitToast(true);
      setTimeout(() => {
        setSubmitToast(false);
      }, 900);
    }
  }


  const __handle_increase_counter = (item, index1) => {

    const _inputs = [...getTaskInProgress];

    if (_inputs[index1].work_percent < 100) {

      _inputs[index1].work_percent = _inputs[index1].work_percent + 5;
      _inputs[index1].key = index1;

      setGetTaskInProgress(_inputs);
    }


  };

  // const __handle_counter = (text, index1) => {

  //   const _inputs = [...getTaskInProgress];
  //   // console.log("🚀 ~ file: UserAssignWorks.js ~ line 104 ~ UserAssignWorks ~ _inputs", assignWork)


  //   // if (_inputs[index1].work_percent < 100) {
  //   // _inputs[index1].work_percent = item.work_percent + 5;
  //   _inputs[index1].work_percent = text;
  //   _inputs[index1].key = index1;
  //   setGetTaskInProgress(_inputs);
  //   // }

  // };


  const __handle_decrease_counter = async (item, index1) => {

    const _inputs = [...getTaskInProgress];
    const data = await getAssignWorks(userData._id);

    data.map((ele) => {
      ele.assign_works.map((sub_ele) => {
        if (_inputs[index1].work_code === sub_ele.work_code) {
          if (_inputs[index1].work_percent > 0) {
            if (_inputs[index1].work_percent <= sub_ele.work_percent) {
              return false;
            }
            _inputs[index1].work_percent = _inputs[index1].work_percent - 5;
            _inputs[index1].key = index1;
            setGetTaskInProgress(_inputs);

          }

        }
      })
    })

    // setDecreaseCounter(_inputs[index1].work_percent);  

    // if (_inputs[index1].work_percent > 0) {
    //   _inputs[index1].work_percent = _inputs[index1].work_percent - 5;
    //   // setDecreaseCounter(item.work_percent);
    //   _inputs[index1].key = index1;
    //   setGetTaskInProgress(_inputs);
    // }

  };




  const WorkDetails = ({ item, message, color, index }) => {


    return (
      <View
        style={{
          marginTop: index == 0 ? null : SIZES.base,
          paddingHorizontal: SIZES.base,
          elevation: 1,
          paddingVertical: 5,
          backgroundColor: COLORS.darkGray,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}>
        <View style={{
          backgroundColor: COLORS.white,
          elevation: 15,
          width: `${item.work_percent}%`,
          borderBottomWidth: 10, borderColor: COLORS.green
        }}>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                paddingHorizontal: 5,
                backgroundColor: COLORS.white,
                color: COLORS.black,
                elevation: 10,
                borderRadius: 1,
              }}>
              {item.work_code}
            </Text>
            <Text
              style={{
                ...FONTS.h4,
                color: COLORS.lightGray2,
                left: 10,
              }}>
              {item.work}
            </Text>
          </View>
          <Image
            source={icons.down_arrow}
            style={{ height: 15, width: 15, tintColor: COLORS.white }}
          />
        </View>
        <View style={{
          flexDirection: "row",

        }}>
          <Text style={{ color: color, marginTop: 3 }}>{message}</Text>
          {message == 'Revert' ? <Text style={{ color: color, marginTop: 3 }}>{" - "+ item.revert_msg}</Text> : null}
        </View>
      </View>
    );
  };

  const renderHeader = (item, index) => {

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <View>
          {item.work_status == true &&
            item.verify == false &&
            item.revert_status == false ? (
            <WorkDetails
              item={item}
              message={'Pending from the admin side'}
              color={COLORS.yellow_400}
            />
          ) : item.work_status == false &&
            item.verify == false &&
            item.revert_status == true ? (
            <WorkDetails item={item} message={'Revert'} color={COLORS.rose_600} />
          ) : item.work_status == false &&
            item.verify == false &&
            item.revert_status == false ? (
            <WorkDetails item={item} message={''} color={COLORS.black} />
          )
            : null
          }
        </View>
      </Animated.View>
    );
  };

  function counterSection(item, index) {
    return (
      <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ elevation: 20 }}
            onPress={() => {
              __handle_decrease_counter(item, index)
            }}
          >
            <Entypo
              name="minus"
              size={25}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <View>
            <TextInput
              style={[styles.inputfromone, { elevation: 5 }]}
              editable={false}
              value={String(`${item.work_percent} %`)}
              onChangeText={(text) => __handle_counter(text, index)}
              placeholderTextColor={COLORS.lightGray1}
              keyboardType="numeric"
              placeholder={'counter'}
            />
          </View>
          <TouchableOpacity
            style={{ elevation: 20 }}
            onPress={() => __handle_increase_counter(item, index)}
          >
            <Entypo
              name="plus"
              size={25}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
            marginTop: SIZES.base,
            // backgroundColor: COLORS.red
          }}
          onPress={(text) => {
            submitWorkPercent(item, index)
          }}>
          <Text
            style={{
              color: COLORS.white,
              backgroundColor: COLORS.lightblue_500,
              elevation: 15,
              // borderWidth: 1,
              backgroundColor: COLORS.lightblue_600,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 3,
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderBody = (item, index) => {

    return (
      <View
        style={{
          backgroundColor: COLORS.darkGray,
          padding: SIZES.radius,
          borderBottomLeftRadius: 5,
          elevation: 15,
          borderBottomRightRadius: 5,
        }}
        key={item.key}>
        <View style={{}}>
          {/* <View style={{
            backgroundColor: COLORS.white,
            width: `${item.work_percent}%`,
            borderBottomWidth: 10, borderColor: COLORS.green
          }}>
          </View> */}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: "space-between"
            }}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: 2 }}>
              <Text style={{ ...FONTS.h5, color: COLORS.white }}>
                Targate Date:  {item.exp_completion_date}
              </Text>
              <Text style={{ ...FONTS.h5, color: COLORS.white }}>
                Targate Time:  {item.exp_completion_time}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: 2 }}>
              <Text style={{ ...FONTS.h5, color: COLORS.white }}>
                Assign Date:   {item.assign_date}
              </Text>
              <Text style={{ ...FONTS.h5, color: COLORS.white }}>
                Assign Time: {item.assign_time}
              </Text>
            </View>
            {item.comment ? <View style={{
              backgroundColor: COLORS.darkGray2,
              paddingHorizontal: 5
            }}>
              <Text
                style={{ ...FONTS.h5, color: COLORS.white2 }}
              >Comment Msg: {item.comment}
              </Text>
            </View> : null}
            <View style={{
              top: 5
            }}>
              {item.comment_status == false && item.work_percent == 0 ?
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.lightblue_600,
                    paddingVertical: SIZES.base * 0.3,
                    alignContent: "center",
                    borderColor: COLORS.lightblue_500,
                    elevation: 15,
                    borderWidth: 1,
                    borderRadius: 2,
                    paddingHorizontal: SIZES.radius * 0.5
                  }}
                  onPress={() => {

                    setCommentCollapse(!commentCollapse)
                  }}
                >
                  <Text style={{ color: COLORS.white }}>Comment</Text>
                </TouchableOpacity> : null}
            </View>
          </View>
          <Divider
            style={{
              backgroundColor: COLORS.gray,
              marginVertical: SIZES.base,
            }}
          />
          <View style={{ flexdirection: 'row' }}>
            {commentCollapse && item.work_percent == 0 ?
              item.comment_status === false ? <View style={{ backgroundColor: COLORS.white, borderRadius: 5 }}>
                <TextInput
                  style={{
                    paddingHorizontal: SIZES.radius,
                    backgroundColor: COLORS.white,
                  }}
                  multiline={true}
                  placeholder="Comment section..."
                  placeholderTextColor={COLORS.gray}
                  onChangeText={text => setTextMsg(text)}
                  value={textMsg}
                />
                <TouchableOpacity
                  style={{
                    alignItems: 'flex-end',
                    paddingHorizontal: 4,
                    // marginTop: SIZES.base,
                    // backgroundColor: "red",
                    marginLeft: SIZES.body1 * 4,
                    padding: 2
                  }}
                  onPress={() => submitComments(item._id)}>
                  {item.work_status == false ? (
                    <Text
                      style={{
                        color: COLORS.lightGray2,

                        backgroundColor: COLORS.lightblue_900,
                        paddingHorizontal: 5,
                        paddingVertical: 3,
                        elevation: 8,
                        borderRadius: 3,
                      }}>
                      Submit comment
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View> : null
              : null}
            {item.work_status == false && item.comment_status == true && item.comment_reply_status == true ?
              counterSection(item, index)
              : item.work_status == false && item.comment_status == true && item.comment_reply_status == false ?
                null :
                item.work_status == false && item.comment_status == false && item.comment_reply_status === false ?
                  counterSection(item, index) :
                  null}
          </View>
        </View>
      </View>
    );
  };
  return (

    <View
      style={{
        marginHorizontal: SIZES.base,
        marginVertical: SIZES.radius,
        paddingHorizontal: SIZES.base,
        paddingTop: SIZES.base,
        paddingBottom: SIZES.base,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.base,
        // borderWidth:1,
        ...styles1.shadow,
      }}>
      <Text
        style={{
          ...FONTS.h2,
          color: COLORS.darkGray,
          marginHorizontal: SIZES.base,
          marginBottom: SIZES.base,
        }}>
        Assigned Works
      </Text>

      {/* {
      assignWorks.map((ele)=>{
        return(
          <View key ={ele._id}>
            <Text>{ele.assign_works}</Text>
          </View>
        )
      })
     } */}


      {getTaskInProgress.length > 0 ?
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            width: '100%',
            height: '100%',
            // padding: 5,
            // paddingBottom: 10
          }}>
          <AccordionList
            list={getTaskInProgress ? getTaskInProgress : null}
            header={renderHeader}

            body={renderBody}
            // onPress={
            //   // LayoutAnimation.easeInEaseOut()
            // ()=> { alert('sd')}
            // }
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            isExpanded={false}
            style={{
              // borderWidth: 1,
              // borderColor: COLORS.lightblue_400,
              padding: 5,
              // marginBottom:40,

            }}
            contentContainerStyle={{
              bottom: 14
            }}
            // onToggle={(isExpanded) => {
            //   setIsExpand(!isExpand);
            //   // setIsExpandId(isExpanded);
            // }}
            keyExtractor={item => `${item._id}`}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            maxHeight={450}
          />
        </ScrollView> : null
      }
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
      {/* <DeleteConfirmationToast
        isVisible={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title={'Are You Sure?'}
        message={'Do you really want to delete?'}
        color={COLORS.rose_600}
        icon={icons.delete_withbg}
        onClickYes={() => deleteContReportButton()}
      /> */}
    </View>
  );
};
const styles1 = StyleSheet.create({
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
export default UserAssignWorks;
