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
import styles from '../../ReportStyle.js'
import { EditDeletebuttons } from '../../../index.js'
import moment from 'moment';
import { COLORS, FONTS, SIZES, dummyData, icons, images } from '../../../../../constants'


const ReportDateTimeHeader = () => {
    const { header, con_body, input, body_del, body_edit, body_del_btn, body_edit_btn, body_ed_de_view } = styles


    //date time section
    const [date, setDate] = useState(new Date(1598051730000));
    const current_dat = moment().format("DD/MM/YYYY")

    const current_Time = moment().format("HH:mm:ss")


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = currentMode => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = (item) => {
        showMode('date');
        // setcon_item_id(item.id);
    };

    const showTimepicker = () => {
        showMode('time');
    };


    //adding calender on tabs
    const schedular_section = (item) => {

        return (
            <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: 115, alignSelf: "flex-start", marginLeft: -65 }}>
                    <View style={{ marginTop: SIZES.radius, justifyContent: 'center', backgroundColor: COLORS.lightblue_200, borderRadius: SIZES.base, borderWidth: 2, borderColor: COLORS.lightGray1, alignSelf: "center", paddingHorizontal: 5 }}>
                        <Text style={{
                            ...FONTS.h5,
                            color: COLORS.red,
                        }}
                        >
                            Date: {date.toLocaleDateString()}
                        </Text>
                    </View>
                    <View
                        style={{
                            top: SIZES.radius,
                            paddingVertical: SIZES.radius,
                            width: "31%",
                            height: 30,
                            borderRadius: SIZES.base,
                            backgroundColor: COLORS.lightblue_200,
                            justifyContent: 'center',
                            paddingLeft: SIZES.font * 0.5,
                            alignContent: "center"
                        }}>
                        <TouchableOpacity onPress={() => showDatepicker(item)}>
                            <Image
                                source={icons.date}
                                style={{
                                    width: 21,
                                    height: 21,
                                    tintColor: COLORS.black,
                                }}
                            />
                        </TouchableOpacity>
                    </View> 
                </View>
            </View>
        )
    }

    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: SIZES.base * 3 }}>
                <View >
                    <Text style={{ ...FONTS.h5, color: COLORS.black }}>Date:{' ' + current_dat}</Text>
                </View>
                <View>
                    <Text style={{ ...FONTS.h5, color: COLORS.black }}>Time:{' ' + current_Time}</Text>
                </View>
                <View style={{ left: SIZES.base * 3, top: -SIZES.base * 0.1 }}>
                    {<EditDeletebuttons edit_size={18} del_size={20} />}
                </View>

            </View>
        </>
    )
}

export default ReportDateTimeHeader