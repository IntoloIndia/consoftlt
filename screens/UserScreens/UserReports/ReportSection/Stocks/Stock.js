import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
    View,
    Text, FlatList,
    StyleSheet, Image,
    ScrollView, Modal, Animated,
    Pressable, TextInput, KeyboardAvoidingView,
    Platform, LayoutAnimation, UIManager,
    TouchableOpacity, Button, Keyboard
} from 'react-native'
import styles from '../../ReportStyle.js'
import { Title, Divider } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { get_stock_item_name, insert_stock_data, get_stock_data } from '../../ReportApi.js'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';
import { COLORS, FONTS, SIZES, dummyData, icons, images } from '../../../../../constants'
import { FormInput, TextButton, HeaderBar, CustomToast } from '../../../../../Components';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const Stock = ({ project_id, Main_drp_pro_value, loading }) => {
    const {
        header,
        con_body,
        input,
        body_del,
        body_edit,
        body_del_btn,
        body_edit_btn,
        body_ed_de_view,
        dropdown,
        dropdown1,
        container,
        inputContainer,
        inputsContainer,
        inputfrom,
        inputfromtwo,
        inputfromone,
        cont_Project_list_drop
    } = styles;

    //Stock collapse
    const [stockCollapse, setStockCollapse] = useState(false)
    // CUSTOM TOAST OF CRUD OPERATIONS
    const [submitToast, setSubmitToast] = useState(false);
    const [updateToast, setUpdateToast] = useState(false);
    const [deleteToast, setDeleteToast] = useState(false);
    const [stockResponseStatus, setStockResponseStatus] = useState('')
    const [isFocus, setIsFocus] = useState(false);

    const animation = useRef(new Animated.Value(0)).current;
    const scale = animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });
    //Insertion modal
    const [stockReportModal, setStockReportModal] = useState(false);
    const [addNewMaterial, setAddNewMaterial] = useState(false)
    const userCompanyData = useSelector(state => state.user);
    const [stockItemData, setStockItemData] = useState([])

    const [materialItemName, setMaterialItemName] = useState('')
    const [getStockData, setGetStockData] = useState([])

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
    // all input fields
    const [stockEntry, setStockEntry] = useState([
        {
            item_id: '', unit_name: '', qty: '', vehicle_no: '', location: ''
        }
    ]);

    const [selectKey, setSelectKey] = useState('');






    const getStockDataItems = async () => {
        try {
            const data = await get_stock_item_name();
            setStockItemData(data);
        } catch (error) {

            console.log(error)

        }
    }

    useMemo(() => {
        getStockDataItems();
    }, [userCompanyData.company_id, loading])



    const GetStockData = async () => {
        try {
            const data = await get_stock_data();
            const res = await data.json();
            if (res.status == 200) {
                const temp_data = res.data.map(ele => {
                    return ele.stockEntryData;
                })
                setGetStockData(temp_data);
                // console.log("🚀 ~ file: Stock.js ~ line 103 ~ GetStockData ~ temp_data", temp_data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useMemo(() => {
        let isMount = true;
        GetStockData();
        return () => { isMount = false }
    }, [userCompanyData.company_id, loading])


    const postStockDataItems = async () => {
        try {
            const stock_post_data = {
                company_id: userCompanyData.company_id,
                project_id: project_id,
                user_id: userCompanyData._id,
                stockEntry: stockEntry
            }
            // console.log("🚀 ~ file: Stock.js ~ line 93 ~ postStockDataItems ~ stock_post_data", stock_post_data)

            if (stock_post_data) {
                const data = await insert_stock_data(stock_post_data)
                setStockResponseStatus(data)
                if (data.status == '200') {
                    setSubmitToast(true)
                    GetStockData();
                    setTimeout(() => {
                        setStockReportModal(false);
                        setSubmitToast(false)
                    }, 900);
                    stockEntry.splice(0, stockEntry.length);
                }
            } else {
                alert("Not inserted")
            }
        } catch (error) {

        }
    }

    const inputUnitName = (text, key) => {
        const _inputs = [...stockEntry];
        _inputs[key].unit_name = text;
        _inputs[key].key = key;
        setStockEntry(_inputs);
    };
    const inputQuantity = (text, key) => {
        const _inputs = [...stockEntry];
        _inputs[key].qty = text;
        _inputs[key].key = key;
        setStockEntry(_inputs);
    };
    const inputVehicleNo = (text, key) => {
        const _inputs = [...stockEntry];
        _inputs[key].vehicle_no = text;
        _inputs[key].key = key;
        setStockEntry(_inputs);
    };
    const inputLocation = (text, key) => {
        const _inputs = [...stockEntry];
        _inputs[key].location = text;
        _inputs[key].key = key;
        setStockEntry(_inputs);
    };

    const inputSelectItem = (item, key) => {

        const _inputs = [...stockEntry];
        _inputs[key].item_id = item._id;
        _inputs[key].unit_name = item.unit_name;
        _inputs[key].key = key;
        setStockEntry(_inputs);
    };


    const deleteStockHandler = (key) => {
        const _inputs = [...stockEntry]
        _inputs.splice(key, 1);
        setStockEntry(_inputs);
    }

    const addStockInputHandler = () => {

        setStockEntry([...stockEntry, { item_id: '', unit_name: '', qty: '', location: '', vehicle_no: '' }])
    }


    const add_stock_input = () => {
        return (
            <View style={container}>
                <ScrollView style={inputsContainer}>
                    {stockEntry ? stockEntry.map((input, key) => {

                        return (
                            <View style={[inputsContainer, {
                                borderWidth: 1,
                                borderColor: COLORS.lightGray1,
                                borderRadius: 2,
                                elevation: 2,
                                padding: 10,
                                margin: 5
                            }]} key={key}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 5,


                                    }}
                                    key={key}

                                >
                                    <Dropdown
                                        style={[
                                            styles.dropdown,
                                            // cont_Project_list_drop,
                                            isFocus && { borderColor: 'blue' },
                                        ]}
                                        selectedTextStyle={{ color: COLORS.gray, }
                                        }
                                        placeholderStyle={{ fontSize: 16, color: COLORS.gray, left: 5 }}
                                        inputSearchStyle={{ color: COLORS.gray, height: 40, borderRadius: 5, padding: -5 }}
                                        data={stockItemData}
                                        search
                                        maxHeight={300}
                                        labelField="item_name"
                                        valueField="_id"
                                        placeholder={!isFocus ? 'Select' : '...'}
                                        searchPlaceholder="Search..."
                                        value={input.item_id}
                                        onChange={item => {
                                            setSelectKey(input.key);
                                            inputSelectItem(item, key);
                                        }}
                                    />
                                    <TextInput
                                        style={inputfromtwo}
                                        selectTextOnFocus={false}
                                        placeholder={'unit name'}
                                        // value={key==selectKey?input.select.unit_name:selectKey==unitKey?input.select.unit_name:null}
                                        value={key == selectKey ? input.unit_name : input.unit_name}
                                        onChangeText={text => { inputUnitName(text, key) }}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                    }}>
                                    <TextInput
                                        style={[inputfromone, { width: "27%" }]}
                                        placeholder="Qty"
                                        keyboardType="numeric"
                                        placeholderTextColor={COLORS.gray}
                                        value={input.qty}
                                        onChangeText={text => {
                                            inputQuantity(text, key);
                                        }}
                                    />
                                    <TextInput
                                        style={[inputfromone, { width: "28%" }]}
                                        placeholder="Vehicle no"
                                        placeholderTextColor={COLORS.gray}
                                        value={input.vehicle_no}
                                        onChangeText={text => {
                                            inputVehicleNo(text, key);
                                        }}
                                    />
                                    <TextInput
                                        style={[inputfromone, { width: "40%" }]}
                                        placeholder="Location"
                                        placeholderTextColor={COLORS.gray}
                                        value={input.location}
                                        onChangeText={text => {
                                            inputLocation(text, key);
                                        }}
                                    />
                                </View>
                                <View style={{

                                    width: "100%",
                                    alignItems: "flex-end"
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            elevation: 8,
                                            borderColor: COLORS.transparent
                                        }}
                                        onPress={() => deleteStockHandler(key)}>
                                        <Image
                                            source={icons.delete_icon}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                tintColor: COLORS.red,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                        :
                        null
                    }
                </ScrollView>
            </View>
        )
    }

    const add_stock_data_modal = () => {

        return (

            <Modal visible={stockReportModal} transparent={false} animationType="slide">
                <View
                    style={{ flex: 1, backgroundColor: COLORS.transparentBlack1 }}
                >
                    <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
                        <View
                            style={{
                                height: "90%",
                                width: "100%",
                                backgroundColor: '#fff',
                                marginTop: 90,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                padding: 22,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    justifyContent: 'space-between',
                                }}>
                                <Title>Add Stock Data</Title>
                                <Pressable onPress={() => {
                                    // inputs.splice(0, inputs.length);
                                    setStockReportModal(false);
                                }}>
                                    <AntDesign name="close" size={30} color={COLORS.black} />
                                </Pressable>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 10,
                                }}>
                                <TouchableOpacity
                                    style={{
                                        paddingHorizontal: 2,
                                        margin: 5,
                                        borderRadius: 1,
                                        elevation: 1,
                                        borderColor: COLORS.transparent,
                                    }}
                                    onPress={() => {
                                        addStockInputHandler();
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingVertical: 1
                                        }}>
                                        <Text style={{ ...FONTS.h3, color: COLORS.darkGray }}>Add Existing Material</Text>
                                        <MaterialIcons
                                            name="add-box"
                                            size={20}
                                            color={COLORS.green}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        paddingHorizontal: 4,
                                        margin: 5,
                                        borderRadius: 1,
                                        elevation: 1,
                                        borderColor: COLORS.transparent,
                                    }}
                                    onPress={() => {
                                        setAddNewMaterial(true);
                                    }}>
                                    <Text style={{ ...FONTS.h3, color: COLORS.darkGray }}>Add New Material</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                {add_stock_input()}
                            </View>
                            {/* <Button
                                title="submit"
                                onPress={() => {
                                    postStockDataItems();
                                }}
                            /> */}
                            <TextButton
                                label="Submit"
                                buttonContainerStyle={{
                                    height: 55,
                                    width: '100%',
                                    alignItems: 'center',
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.lightblue_700
                                }}
                                onPress={() => {
                                    postStockDataItems();
                                }
                                }
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    const add_new_material_modal = () => {
        return (
            <View>
                <Modal transparent={false} visible={addNewMaterial} animationType="slide">
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#000000aa',
                        }}>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                marginTop: 80,
                                padding: 20,
                                borderRadius: 8,
                                margin: 10,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                <Text style={{ ...FONTS.h2, color: COLORS.darkGray }}>Add New Material</Text>
                                <Pressable onPress={() => setAddNewMaterial(false)}>
                                    <AntDesign name="close" size={30} color={COLORS.black} />
                                </Pressable>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <FormInput
                                    label="Name"
                                    onChange={text => {
                                        setMaterialItemName(text)
                                    }}
                                />
                            </View>
                            <View>
                                <TextButton
                                    label="save"
                                    buttonContainerStyle={{
                                        height: 45,
                                        borderRadius: SIZES.radius,
                                        marginTop: SIZES.padding,
                                    }}
                                    onPress={() => {
                                        // saveNewMaterial();
                                    }}
                                />
                            </View>
                            {/* <Toast config={showToastItem} /> */}
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }



    const add_stock_icon_button = () => {
        return (
            <Animated.View style={{ transform: [{ scale }] }}>
                <TouchableOpacity
                    style={{
                        // backgroundColor: COLORS.white,
                        borderRadius: SIZES.radius * 0.2,
                        justifyContent: "center",
                        flexDirection: "row",
                        paddingHorizontal: 2,
                    }}

                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onPress={() => {
                        stockEntry.splice(0, stockEntry.length);
                        setStockReportModal(true);
                    }}>
                    <View style={{
                        alignSelf: "center",
                        alignItems: "center",
                        position: "absolute",
                        justifyContent: "space-evenly",
                        flexDirection: "row",
                        backgroundColor: COLORS.lightblue_400,
                        padding: SIZES.base * 0.1,
                        paddingHorizontal: 2,
                        paddingVertical: -2,
                        borderRadius: 5,
                        top: -SIZES.base * 1.2
                    }}>
                        <View>
                            <Text
                                onPressIn={onPressIn}
                                onPressOut={onPressOut}
                                style={[FONTS.body5, { color: COLORS.white }]}>Add</Text>
                        </View>
                        <View>
                            <MaterialIcons
                                name='add'
                                size={15}
                                color={COLORS.white}
                            />
                        </View>

                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    return (
        <View>
            {/* Stock */}
            <Animated.View style={{ transform: [{ scale }] }}>
                <Pressable
                    onPress={() => {
                        GetStockData();
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
                        setStockCollapse(!stockCollapse)
                    }}

                    onPressIn={onPressIn}
                    onPressOut={onPressOut}

                    style={{
                        flexDirection: "row",
                        paddingHorizontal: SIZES.base,
                        paddingVertical: 3,
                        width: SIZES.width * 0.53,
                        alignItems: "center",
                        justifyContent: "space-between",
                        top: SIZES.base * 2,
                        borderColor: COLORS.lightblue_200,
                        backgroundColor: COLORS.lightblue_600,
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
                    <View style={{ alignItems: "center", alignSelf: "center" }}>
                        <Text
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                            onPress={() => {
                                Main_drp_pro_value ? null : alert("Select Project First!")
                                setStockCollapse(!stockCollapse);
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
                            }} style={[FONTS.h3, { color: COLORS.white2 }]}>Stock</Text>
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
                                setStockCollapse(!stockCollapse)

                            }}>
                            <AntDesign name='caretdown' size={12} color={COLORS.white2} />
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Animated.View>
            <View
                style={{
                    alignSelf: "center",
                    flexDirection: "row",
                    right: SIZES.base * 2,
                }}
            >
                {stockCollapse ?
                    <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                        {/* <View style={{ backgroundColor: "blue", paddingLeft: 140 }}>
                            {add_stock_icon_button()}
                        </View> */}
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: "skyblue",
                                width: SIZES.width * 0.92,
                                alignSelf: "flex-start",
                                position: "relative",
                                top: 20,
                                marginLeft: 17,
                                maxHeight: 200,
                                paddingBottom: 6,
                                elevation: 1
                            }}
                        >


                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle=
                                {{
                                    flexGrow: 1,
                                    maxHeight: 500,
                                    borderWidth: 2
                                }} >
                                <View style={{}}>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        top: 5,
                                        left: -12,
                                        position: "relative"
                                    }}>
                                        <View
                                            style={{
                                                paddingHorizontal: 5,
                                                marginRight: 2,
                                                marginLeft: 16,
                                                // borderRightWidth: 2,
                                                justifyContent: 'center',
                                                width: 45,
                                                //  borderColor: COLORS.lightblue_200 
                                            }}
                                        >
                                            <Text style={[FONTS.h4, { color: COLORS.black, textAlign: "center" }]}>S.no</Text>
                                        </View>
                                        <View
                                            style={{
                                                marginLeft: 8,
                                                //  borderRightWidth: 2,
                                                justifyContent: 'center',
                                                width: 145,
                                                //  borderColor: COLORS.lightblue_200, 
                                            }}
                                        >
                                            <Text style={[FONTS.h4, { color: COLORS.black, textAlign: "center" }]}>Item Name</Text>
                                        </View>
                                        <View
                                            style={{
                                                marginLeft: 24,
                                                justifyContent: 'center',
                                                width: 70,
                                                // borderColor: COLORS.lightblue_200, 
                                            }}
                                        >
                                            <Text style={[FONTS.h4, { color: COLORS.black, textAlign: "center" }]}>Unit Name</Text>
                                        </View>
                                        <View
                                            style={{
                                                marginLeft: 18,
                                                // borderLeftWidth: 2, 
                                                paddingLeft: 8,
                                                justifyContent: 'center',
                                                width: 80,
                                                // borderColor: COLORS.lightblue_200, 
                                            }}
                                        >
                                            <Text style={[FONTS.h4, { color: COLORS.black, textAlign: "center" }]}>Quantity</Text>
                                        </View>
                                        <View
                                            style={{
                                                marginLeft: 15,
                                                // borderLeftWidth: 2, 
                                                paddingLeft: 15,
                                                justifyContent: 'center',
                                                width: 100,
                                                // borderColor: COLORS.lightblue_200, 
                                            }}
                                        >
                                            <Text style={[FONTS.h4, { color: COLORS.black, textAlign: "center" }]}>Vehicle No.</Text>
                                        </View>
                                        <View
                                            style={{
                                                marginLeft: 18,
                                                //  borderLeftWidth: 2, 
                                                justifyContent: 'center',
                                                width: 125,
                                                // borderColor: COLORS.lightblue_200, 
                                            }}
                                        >
                                            <Text style={[FONTS.h4, { color: COLORS.black, textAlign: "center" }]}>Location</Text>
                                        </View>
                                    </View>
                                    {/* getStockData */}
                                    {/* vertical scrool view */}
                                    <ScrollView nestedScrollEnabled={true}
                                        contentContainerStyle={{
                                            top: 10,
                                            paddingBottom: 15
                                        }}>

                                        <>
                                            {
                                                getStockData.length > 0 ? getStockData.map((list, index) => (
                                                    <View
                                                        style={{
                                                            flexDirection: "column",
                                                            alignContent: "space-between",
                                                            paddingVertical: 20,
                                                            top: -20
                                                        }} key={index}>
                                                        <View
                                                            style={{
                                                                flexDirection: "row",
                                                                justifyContent: "space-evenly",
                                                                top: 10,
                                                                paddingVertical: 3,
                                                                left: -26,
                                                            }} >
                                                            <View
                                                                style={{
                                                                    alignContent: "center",
                                                                    alignSelf: "center",
                                                                    width: 45,
                                                                    position: "absolute",

                                                                    left: 29,
                                                                    // right: 10,
                                                                    //  left:0,
                                                                    top: 3,
                                                                    //  bottom:0                             
                                                                }} >
                                                                <View>
                                                                    <Text style={[FONTS.h4, { color: COLORS.darkGray, textAlign: "center" }]}>
                                                                        {index + 1}
                                                                    </Text>
                                                                </View>
                                                                <View style={{ position: "absolute", width: 1, left: 42, top: -10 }}>
                                                                    <Divider style={{ backgroundColor: COLORS.lightGray1, height: SIZES.height, top: 5 }} />
                                                                </View>
                                                            </View>
                                                            <View style={{
                                                                alignContent: "center",
                                                                alignSelf: "center",
                                                                width: 145,
                                                                position: "absolute",
                                                                left: 155,
                                                                top: 3,

                                                                // right: 10,

                                                            }}>
                                                                <View>
                                                                    <Text style={[FONTS.h4, { color: COLORS.darkGray }]}>
                                                                        {list.item_name}
                                                                    </Text>
                                                                </View>
                                                                <View style={{ position: "absolute", width: 1, left: 85, top: -10 }}>
                                                                    <Divider style={{ backgroundColor: COLORS.lightGray1, height: SIZES.height, top: 5 }} />
                                                                </View>
                                                            </View>
                                                            <View
                                                                style={{
                                                                    alignContent: "center",
                                                                    alignSelf: "center",
                                                                    width: 70,
                                                                    position: "absolute",
                                                                    left: 250,
                                                                    top: 3,
                                                                    // borderWidth: 1,
                                                                    // borderColor: COLORS.lightblue_200,
                                                                    // right: 10,
                                                                }}
                                                            >
                                                                <Text style={[FONTS.h4, { color: COLORS.darkGray, textAlign: "center" }]}>
                                                                    {list.unit_name}
                                                                </Text>
                                                                <View style={{ position: "absolute", width: 1, left: 85, top: -10 }}>
                                                                    <Divider style={{ backgroundColor: COLORS.lightGray1, height: SIZES.height, top: 5 }} />
                                                                </View>
                                                            </View>
                                                            <View
                                                                style={{
                                                                    alignContent: "center",
                                                                    alignSelf: "center",
                                                                    width: 80,
                                                                    position: "absolute",
                                                                    left: 350,
                                                                    top: 3,
                                                                    // borderWidth: 1,
                                                                    // borderColor: COLORS.lightblue_200,
                                                                    // right: 10,
                                                                }}
                                                            >
                                                                <Text style={[FONTS.h4, { color: COLORS.darkGray, textAlign: "center" }]}>
                                                                    {list.qty}
                                                                </Text>
                                                                <View style={{ position: "absolute", width: 1, left: 85, top: -10 }}>
                                                                    <Divider style={{ backgroundColor: COLORS.lightGray1, height: SIZES.height, top: 5 }} />
                                                                </View>
                                                            </View>
                                                            <View
                                                                style={{
                                                                    alignContent: "center",
                                                                    alignSelf: "center",
                                                                    width: 100,
                                                                    position: "absolute",
                                                                    left: 450,
                                                                    top: 3,
                                                                    // borderWidth: 1,
                                                                    // borderColor: COLORS.lightblue_200,
                                                                    // right: 10,
                                                                }}
                                                            >
                                                                <Text style={[FONTS.h4, { color: COLORS.darkGray, textAlign: "center" }]}>
                                                                    {list.vehicle_no}
                                                                </Text>
                                                                <View style={{ position: "absolute", width: 1, left: 100, top: -10 }}>
                                                                    <Divider style={{ backgroundColor: COLORS.lightGray1, height: SIZES.height, top: 5 }} />
                                                                </View>
                                                            </View>
                                                            <View
                                                                style={{
                                                                    alignContent: "center",
                                                                    alignSelf: "center",
                                                                    width: 125,
                                                                    position: "absolute",
                                                                    left: 560,
                                                                    top: 3,
                                                                    // borderWidth: 1,
                                                                    // borderColor: COLORS.lightblue_200,
                                                                    // right: 10,
                                                                }}
                                                            >
                                                                <Text style={[FONTS.h4, { color: COLORS.darkGray, textAlign: "center" }]}>
                                                                    {list.location}
                                                                </Text>
                                                                {/* <View style={{ position: "absolute", width: 3, left: 100, top: -10 }}>
                                                                    <Divider style={{ backgroundColor: COLORS.lightGray1, height: SIZES.height, top: 5 }} />
                                                                </View> */}
                                                            </View>
                                                            {/* <View
                                                                style={{
                                                                    // alignContent: "center",
                                                                    // alignSelf: "center",
                                                                    width: 60,
                                                                    position: "absolute",
                                                                    left: 905,
                                                                    top: 3,
                                                                    // borderWidth: 1,
                                                                    // borderColor: COLORS.lightblue_200,
                                                                    // right: 10,
                                                                }}
                                                            >
                                                                <View style={{ justifyContent: "center", alignSelf: "center" }}>
                                                                    <Edit_delete_button edit_size={18} del_size={22} __id={list.quantityWorkItems._id} />
                                                                </View>
                                                            </View> */}
                                                        </View>
                                                        {/* sub items  */}
                                                        <View style={{ position: "absolute", top: 23 }}>
                                                            <Divider style={{ backgroundColor: COLORS.lightGray1, width: SIZES.width * 3, marginHorizontal: 2, top: 5 }} />
                                                        </View>
                                                    </View>

                                                ))
                                                    :
                                                    <View>
                                                        <Text style={[FONTS.h4, { color: COLORS.gray, textAlign: "center" }]}>Currently, no report to show!</Text>
                                                    </View>
                                            }

                                        </>
                                    </ScrollView>
                                </View>
                            </ScrollView>


                        </View>


                    </View> : null
                }
                {add_new_material_modal()}
                {add_stock_data_modal()}
            </View>

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

        </View>

    )
}

export default Stock