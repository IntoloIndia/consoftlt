import React, { useState, useEffect, useRef } from 'react'
import {
    View, Animated,
    Easing, Switch,
    Text, FlatList,
    StyleSheet, Image,
    ScrollView, Modal,
    Pressable, TextInput, TouchableWithoutFeedback,
    TouchableOpacity, LogBox, LayoutAnimation, ImageBackground
} from 'react-native'
import { COLORS, FONTS, SIZES, dummyData, icons, images } from '../../../../../constants'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from '../../ReportStyle.js'



const EditDeletebuttons = ({ edit_size, del_size }) => {
    const { header, con_body, input, body_del, body_edit, body_del_btn, body_edit_btn, body_ed_de_view } = styles



    return (
        <> 
            <View style={body_ed_de_view}>
                {/* <View style={body_edit_btn}>
                    <TouchableOpacity
                    >
                        <MaterialIcons name='preview' color={COLORS.green} size={del_size} />
                    </TouchableOpacity>
                </View> */}
                <View style={body_del_btn}>

                    <TouchableOpacity
                    >
                        {/* <Foundation name='page-edit' color={item.id == selectedEditId ? "#2aaeff" : null} size={24} /> */}
                        <FontAwesome name='edit' color={COLORS.blue} size={edit_size} />
                    </TouchableOpacity>
                </View>
                <View style={body_edit_btn}>
                    <TouchableOpacity
                    >
                        <MaterialCommunityIcons name='delete' color={COLORS.red} size={del_size} />
                    </TouchableOpacity>
                </View>

            </View>
        </>
    )
}

export default EditDeletebuttons