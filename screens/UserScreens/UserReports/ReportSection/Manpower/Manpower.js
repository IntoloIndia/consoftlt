import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    Animated,
    Easing,
    Switch,
    Text,
    FlatList,
    StyleSheet,
    Platform,
    Image,
    ScrollView,
    Modal,
    Pressable,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    UIManager,
    LogBox,
    LayoutAnimation,
    ImageBackground,
} from 'react-native';
import {
    COLORS,
    FONTS,
    SIZES,
    dummyData,
    icons,
    images,
} from '../../../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../../ReportStyle.js';
import {
    EditDeletebuttons,
    ManPowerProjectTeam,
    ManpowerUserContractors,
} from '../../../index.js';
import { Get_Contractor_Data } from '../../ReportApi.js';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
const Manpower = ({ projectTeamList, ProList, Main_drp_pro_value, loading }) => {

    // useEffect(() => {
    //     LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    // }, []);
    const {
        header,
        con_body,
        input,
        body_del,
        body_edit,
        body_del_btn,
        body_edit_btn,
        body_ed_de_view,
    } = styles;

    const animation = useRef(new Animated.Value(0)).current;
    const scale = animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });
    // console.log("Manpower")
    // console.log("🚀 ~ file: Manpower.js ~ line 56 ~ Manpower ~ projectTeamList", projectTeamList)
    // console.log("🚀 ~ file: Manpower.js ~ line 58 ~ Manpower ~ ProList", ProList)
    // console.log("🚀 ~ file: Manpower.js ~ line 60 ~ Manpower ~ Main_drp_pro_value", Main_drp_pro_value)
    //Manpower collapse
    const [TabCollapse, setTabCollapse] = useState(false)

    const onPressIn = () => {
        Animated.spring(animation, {
            toValue: 0.5,
            useNativeDriver: true,
        }).start();
    };
    const onPressOut = () => {
        setTimeout(() => {
            Animated.spring(animation, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }, 150);
    };
    return (
        <View>
            <Animated.View style={{
                transform: [{ scale }]
            }}>
                <Pressable
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onPress={() => {
                        LayoutAnimation.configureNext({
                            duration: 300,
                            create:
                            {
                                type: LayoutAnimation.Types.easeInEaseOut,
                                property: LayoutAnimation.Properties.opacity,
                            },
                            update:
                            {
                                type: LayoutAnimation.Types.easeInEaseOut,
                            }
                        });
                        setTabCollapse(!TabCollapse)
                    }}

                    style={{
                        flexDirection: "row",
                        paddingHorizontal: SIZES.base,
                        paddingVertical: 3,
                        width: SIZES.width * 0.53,
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: COLORS.lightblue_600,
                        top: SIZES.base * 2,
                        borderColor: COLORS.lightblue_200,
                        borderWidth: 1,
                        borderRadius: 4,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                    }}>
                    <View style={{
                        alignItems: "center", alignSelf: "center"
                    }}>
                        <Text
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                            onPress={() => {
                                LayoutAnimation.configureNext({
                                    duration: 300,
                                    create:
                                    {
                                        type: LayoutAnimation.Types.easeInEaseOut,
                                        property: LayoutAnimation.Properties.opacity,
                                    },
                                    update:
                                    {
                                        type: LayoutAnimation.Types.easeInEaseOut,
                                    }
                                });
                                setTabCollapse(!TabCollapse)
                            }} style={[FONTS.h3, { color: COLORS.white }]}>Manpower</Text>
                    </View>

                    <View style={{ alignItems: "center", alignSelf: "center" }}>
                        <TouchableOpacity
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                            onPress={() => {
                                LayoutAnimation.configureNext({
                                    duration: 300,
                                    create:
                                    {
                                        type: LayoutAnimation.Types.easeInEaseOut,
                                        property: LayoutAnimation.Properties.opacity,
                                    },
                                    update:
                                    {
                                        type: LayoutAnimation.Types.easeInEaseOut,
                                    }
                                });

                                setTabCollapse(!TabCollapse)
                            }}>
                            <AntDesign name='caretdown' size={12} color={COLORS.white2} />
                        </TouchableOpacity>
                    </View>

                </Pressable>
            </Animated.View>
            {TabCollapse ? <View
                style={{ justifyContent: "space-evenly" }}>
                <View>
                    {/* project team start */}
                    <ManPowerProjectTeam projectTeamList={projectTeamList} Main_drp_pro_value={Main_drp_pro_value} loading={loading} />
                    {/* Project Team close */}
                </View>
                <View>
                    {/* Contractors start */}
                    <ManpowerUserContractors ProList={ProList} Main_drp_pro_value={Main_drp_pro_value} loading={loading} />
                    {/* Contractors close */}
                </View>

            </View> : null}
        </View>
    )
}

export default Manpower;