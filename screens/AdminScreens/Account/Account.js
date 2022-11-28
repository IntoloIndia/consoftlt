import React from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SIZES, COLORS, FONTS, icons, images} from '../../../constants';
import {
  ProfileValue,
  LineDivider,
  LogoutConfirmation,
} from '../../../Components';
import {useSelector, useDispatch} from 'react-redux';
import {companyLogout} from '../../../services/companyAuthApi';
import {userLogout} from '../../../services/userAuthApi';
import {
  postCompanyLogout,
  postUserLogout,
} from '../../../controller/LogoutController';
import Collapsible from 'react-native-collapsible';

const Account = () => {
  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);
  const [collapsed, setCollapsed] = React.useState(true);

  var companyData;
  if (companyDetail._id) {
    companyData = companyDetail;
  } else {
    companyData = userData;
  }

  const navigation = useNavigation();
  const dispatch = useDispatch();

  // logout confirmation
  const [LogoutConfirm, setLogoutConfirm] = React.useState(false);

  //
  const LogoutCompany = async () => {
    const formData = {
      refresh_token: companyData.refresh_token,
    };
    const res = await postCompanyLogout(formData);
    if (res.status == 200) {
      setLogoutConfirm(false);
      dispatch(companyLogout());
      navigation.navigate('Login');
    }
  };

  const LogoutUser = async () => {
    const formData = {
      user_id: companyData.user_id,
      refresh_token: companyData.refresh_token,
    };
    const res = await postUserLogout(formData);
    if (res.status == 200) {
      setLogoutConfirm(false);
      dispatch(userLogout());
      navigation.navigate('Login');
    }
  };

  const toggleExpanded = () => {
    setCollapsed(!collapsed);
  };

  function renderProfileCard() {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 20,
          borderRadius: SIZES.base,
          backgroundColor: COLORS.majorelle_blue_800,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: 70,
            height: 70,
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
                marginBottom: -10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                backgroundColor: COLORS.success_300,
              }}>
              <Image
                source={icons.camera}
                resizeMode="contain"
                style={{
                  width: 15,
                  height: 15,
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginLeft: SIZES.padding,
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              color: COLORS.white,
              ...FONTS.h2,
              textTransform: 'capitalize',
            }}>
            {companyData.name}
          </Text>
          <Text style={{color: COLORS.white, ...FONTS.body4}}>
            {companyData.email}
          </Text>
          <Text style={{color: COLORS.white, ...FONTS.body4}}>
            +91{companyData.mobile}
          </Text>
        </View>
      </View>
    );
  }

  function renderProfileSection1() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
        }}>
        <ProfileValue
          icon={icons.project_cate_type}
          value="Project Categories & Types"
          image={icons.right_arrow}
          onPress={() => navigation.navigate('CategoryandType')}
        />
        <LineDivider />
        <ProfileValue
          icon={icons.user_role}
          value="Create User Role"
          image={icons.right_arrow}
          onPress={() => navigation.navigate('UserRole')}
        />
        <LineDivider />
        <ProfileValue
          icon={icons.company_team}
          value="Company Team"
          image={icons.right_arrow}
          onPress={() => navigation.navigate('CompanyTeam')}
        />
        <LineDivider />
        <ProfileValue
          icon={icons.stock_management}
          value="Stock Management"
          image={icons.down_arro}
          onPress={toggleExpanded}
        />
        <Collapsible collapsed={collapsed} duration={300}>
          <View style={{marginLeft: SIZES.padding * 1.5}}>
            <ProfileValue
              icon={icons.itemss}
              value="Items"
              image={icons.right_arrow}
              onPress={() => navigation.navigate('items')}
            />
            <LineDivider />
            {/* <ProfileValue
              icon={icons.units}
              value="Unit"
              image={icons.right_arr}
              onPress={() => navigation.navigate('Unit')}
            /> */}
            {/* <LineDivider /> */}
            <ProfileValue
              icon={icons.manage_stock}
              value="Manage Stock"
              image={icons.right_arrow}
              onPress={() => navigation.navigate('ManageStock')}
            />
            {/* <LineDivider /> */}
            {/* <ProfileValue
              icon={icons.units}
              value="Option Type"
              image={icons.right_arrow}
              onPress={() => navigation.navigate('Optiontype')}
            /> */}
            {/* <LineDivider />
            <ProfileValue
              icon={icons.units}
              value="Tools & Machinery"
              image={icons.right_arrow}
              onPress={() => navigation.navigate('ToolsAndMachinery1')}
            /> */}
          </View>
        </Collapsible>
        <LineDivider />
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
        backgroundColor: COLORS.white,
        padding: 15,
      }}>
      <ScrollView>
        {renderProfileCard()}
        {renderProfileSection1()}
      </ScrollView>

      <View style={{alignItems: 'center', marginBottom: 5}}>
        <Text style={{fontSize: 20, color: COLORS.darkGray}}>Intenics</Text>
        <Text style={{fontSize: 10, color: COLORS.darkGray2}}>
          Version - 1.0.0
        </Text>
      </View>
      <LogoutConfirmation
        isVisible={LogoutConfirm}
        onClose={() => setLogoutConfirm(false)}
        onClickLogout={() => {
          companyData.user_id ? LogoutUser() : LogoutCompany();
        }}
      />
    </View>
  );
};

export default Account;
