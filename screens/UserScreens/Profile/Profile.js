import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  LogBox,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  ProfileValue,
  DeleteConfirmationToast,
  LogoutConfirmation,
  CustomToast,
} from '../../../Components';
import {SIZES, COLORS, FONTS, icons, images} from '../../../constants';
import {userLogout} from '../../../services/userAuthApi';
import {defaultFallbackFonts} from 'react-native-render-html';

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const [userDetail, setUserDetail] = useState([]);
  const [logoutConfirm, setLogoutConfirm] = React.useState(false);
  const [logoutSuccessfully, setLogoutSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userDetailApi = () => {
    fetch(`${process.env.API_URL}user/${userData._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${userData.token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserDetail(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // get user data
  useEffect(() => {
    setIsLoading(true);
    userDetailApi();
  }, []);

  const logoutApiData = async () => {
    const res = await fetch(`${process.env.API_URL}logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userData._id,
        refresh_token: userData.refresh_token,
      }),
    });

    return res;
  };

  const logout = () => {
    const temp = logoutApiData();

    temp.then(data => {
      if (data.status == 200) {
        dispatch(userLogout());
        setLogoutSuccessfully(true);
        setTimeout(() => {
          setLogoutSuccessfully(false);
        }, 1500);
        setTimeout(() => {
          navigation.navigate('Login');
          setLogoutConfirm(false);
        }, 10);
      }
    });
  };

  // React.useEffect(() => {
  //   LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  // }, []);

  function renderProfileCard() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: SIZES.padding,
          paddingHorizontal: SIZES.padding,
          paddingVertical: 15,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.majorelle_blue_800,
          alignItems: 'center',
        }}>
        {/* profile image  */}
        <TouchableOpacity
          style={{
            width: 80,
            height: 80,
          }}
          onPress={() => alert('Upload Image')}>
          <Image
            source={images.civil_eng}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 15,
              borderWidth: 3,
              borderColor: COLORS.white,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                width: 30,
                height: 30,
                marginBottom: -15,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                backgroundColor: COLORS.success_300,
              }}>
              <Image
                source={icons.camera}
                resizeMode="contain"
                style={{
                  width: 17,
                  height: 17,
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
        {/* Details  */}
        <View
          style={{
            flex: 1,
            marginLeft: SIZES.radius,
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 25,
              textTransform: 'capitalize',
            }}>
            {userDetail.name}
          </Text>
          <Text style={{color: COLORS.white, ...FONTS.body4}}>
            {userDetail.email}
          </Text>
          <Text style={{color: COLORS.white, ...FONTS.body4}}>
            +91 {userDetail.mobile}
          </Text>
        </View>
      </View>
    );
  }

  function renderProfileSection2() {
    return (
      <View
        style={{
          ...styles.profileSectionContainer1,
        }}>
        <ProfileValue
          icon={icons.logout}
          value="LogOut"
          onPress={() => setLogoutConfirm(true)}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding,
          paddingBottom: 150,
        }}>
        {renderProfileCard()}
        {renderProfileSection2()}
      </ScrollView>
      {/* <DeleteConfirmationToast
        isVisible={logoutConfirm}
        onClose={() => setLogoutConfirm(false)}
        title={'Are You Sure?'}
        message={'Do you really want to Logout?'}
        color={COLORS.rose_600}
        icon={icons.logout}
        onClickYes={() => logout()}
      /> */}
      <LogoutConfirmation
        isVisible={logoutConfirm}
        onClose={() => setLogoutConfirm(false)}
        onClickLogout={() => {
          logout();
        }}
      />
      <CustomToast
        isVisible={logoutSuccessfully}
        onClose={() => setLogoutSuccessfully(false)}
        color={COLORS.green}
        title="Logout"
        message="Logout Successfully..."
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
  profileSectionContainer: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.radius,
    borderWidth: 1,
    borderRadius: SIZES.base,
    borderColor: COLORS.gray2,
  },
  profileSectionContainer1: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.radius,
    borderWidth: 1,
    borderRadius: SIZES.base,
    borderColor: COLORS.gray2,
  },
});
export default Profile;
