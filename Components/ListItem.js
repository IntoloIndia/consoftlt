import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {icons} from '../constants';

export const ListItem = ({item, onPress}) => {
  const [expanded, setExpanded] = useState(false);
  const onItemPress = () => {
    onPress();
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={onItemPress} style={{}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text>{item.user_name}</Text>
        <Image
          source={icons.arr_down}
          style={{height: 15, width: 15, tintColor: 'black'}}></Image>
      </View>

      {expanded && (
        <View style={{marginTop: 5}}>
          <Text>sdfjhg</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
