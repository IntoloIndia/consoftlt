import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {COLORS, SIZES, FONTS, images, icons} from '../../../constants';
import {TextButton, HeaderBar} from '../../../Components';
import {useNavigation} from '@react-navigation/native';
import WorkAssignModal from '../Modals/WorkAssignModal';

const ProjectsDetails = ({route}) => {
  const navigation = useNavigation();
  const ProjectList = [
    {id: 1, img: icons.p_team, name: 'Project Team'},
    {id: 2, img: icons.contr, name: 'Contractors'},
    {id: 3, img: icons.report1, name: 'Report Settings'},
  ];

  //get name of project from project banner screen using params
  const {name, project_id} = route.params; //
  const [showWorkModal, setWorkModal] = React.useState(false);
  const [projects, setProjects] = React.useState(ProjectList);

  function renderProjectDetails() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          item.id == 1
            ? navigation.navigate('ProjectTeam', {project_id})
            : item.id == 2
            ? navigation.navigate('Contractors', {project_id})
            : item.id == 3
            ? navigation.navigate('ReportSettings', {project_id})
            : null;
        }}>
        <View
          style={{
            padding: 5,
            borderRadius: 20,
            backgroundColor: COLORS.lightblue_100,
          }}>
          <Image
            source={item.img}
            resizeMode="contain"
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.lightblue_800,
            }}
          />
        </View>
        <View
          style={{
            marginLeft: SIZES.radius * 1.5,
            flex: 1,
          }}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.darkGray,
              textTransform: 'capitalize',
            }}>
            {item.name}
          </Text>
        </View>
        <View>
          <Image
            source={icons.right_arr}
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.button_blue,
            }}
          />
        </View>
      </TouchableOpacity>
    );
    return (
      <FlatList
        contentContainerStyle={{
          marginTop: 10,
          marginHorizontal: SIZES.padding,
          paddingBottom: 50,
        }}
        data={projects}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                height: 1,
                backgroundColor: COLORS.lightGray1,
                marginVertical: 18,
              }}></View>
          );
        }}
      />
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <HeaderBar right={true} title={name} />
      <TextButton
        label="Assign Work"
        buttonContainerStyle={{
          height: 45,
          alignItems: 'center',
          marginHorizontal: SIZES.radius,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightblue_700,
          ...styles.shadow,
        }}
        onPress={() => setWorkModal(true)}
      />

      {/* {showWorkModal && ( */}
      <WorkAssignModal
        projectId={project_id}
        isVisible={showWorkModal}
        onClose={() => setWorkModal(false)}
      />
      {/* )} */}

      {renderProjectDetails()}
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

export default ProjectsDetails;
