import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    TouchableWithoutFeedback,
    RefreshControl,

    PermissionsAndroid
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { getProjects } from '../../../../../controller/ProjectController'
import { SIZES, FONTS, COLORS, icons, images } from '../../../../../constants'
// import Config from '../../../../../config/index.js'
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
    getManpower,
    getReport,
    getQuantity,
    verifyReport,
    revertReport,
    getProjectReportPath
} from '../../../../../controller/ReportController'
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';



const ViewReport = () => {
    const userData = useSelector(state => state.user);
    // const user_id = userData._id;

    const company_id = userData.company_id;
    const current_dat = moment().format("YYYY%2FMM%2FDD")
    const navigation = useNavigation();
    const [filterDate, setFilterDate] = useState();
    // projects
    const [user_id, setUserId] = useState(userData._id);
    // setUserId(userData._id);
    const [onSelect, setOnSelect] = React.useState(false);
    const [openProject, setOpenProject] = React.useState(false);
    const [projectValue, setProjectValue] = React.useState([]);
    const [project, setProject] = React.useState([]);
    const onProjectOpen = React.useCallback(() => {
        setOnSelect(false);
        fetchProject();
    }, []);


    // const [filePath, setFilePath] = useState('');

    // const isPermitted = async () => {
    //     if (Platform.OS === 'android') {
    //         try {
    //             const granted = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //                 {
    //                     title: 'External Storage Write Permission',
    //                     message: 'App needs access to Storage data',
    //                 },
    //             );

    //             return granted === PermissionsAndroid.RESULTS.GRANTED;
    //         } catch (err) {
    //             alert('Write permission err', err);
    //             return false;
    //         }
    //     } else {
    //         return true;
    //     }
    // };


    // const createPDF = async () => {
    //     if (await isPermitted()) {
    //         let options = {
    //             //Content to print
    //             html:
    //                 '<h1 style="text-align: center;"><strong>Hello Guys</strong></h1><p style="text-align: center;">${<Text></Text>}</p><p style="text-align: center;"><strong>Team About React</strong></p>',
    //             //File Name
    //             fileName: 'test',
    //             //File directory
    //             directory: '../Downloads',
    //         };

    //         let file = await RNHTMLtoPDF.convert(options);

    //         console.log(file.filePath);

    //         setFilePath(file.filePath);
    //     }
    // };



    function delay(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
    const [loading, setLoading] = React.useState(false);
    const loadMore = React.useCallback(async () => {
        setLoading(true);

        delay(2000).then(() => setLoading(false));
    }, [loading]);


    const [trackId, setTrackId] = useState('')

    const [report, setReport] = React.useState([]);
    const [reportModal, setReportModal] = React.useState(false);
    const [reportData, setReportData] = React.useState('');

    //report
    const [manpower, setManpower] = React.useState([]);
    const [quantity, setQuantity] = React.useState([]);

    //report path
    const [reportPath, setReportPath] = React.useState([]);

    // for report verify
    const [projectId, setProjectId] = React.useState('');
    const [reportId, setReportId] = React.useState('');

    //modal
    const [revertModal, setRevertModal] = React.useState(false);
    const [revertMsg, setRevertMsg] = React.useState('');
    let rep_resp;
    let MyDateString = current_dat;
    // get projects
    const fetchProject = async () => {
        let response = await getProjects(company_id);
        if (response.status === 200) {
            let projectFromApi = response.data.map(ele => {
                return { label: ele.project_name, value: ele._id };
            });
            setProject(projectFromApi);
        }
    };





    // fetch manpower on click
    const fetchManpower = async report_id => {
        setReportId(report_id);
        let response = await getManpower(report_id);
        // console.log("🚀 ~ file: ViewReport.js ~ line 160 ~ fetchManpower ~ response", response)
        if (response.status === 200) {
            setManpower(response.data);
        }
    };

    // fetch quantity on click
    const fetchQuantity = async report_id => {
        let response = await getQuantity(report_id);
        // console.log("🚀 ~ file: ViewReport.js ~ line 168 ~ fetchQuantity ~ response", response)
        // response.data.map(ele => {
        //     ele.quantityWorkItems.map(sub => {
        //         console.log("🚀 ~ file: ViewReport.js ~ line 172 ~ fetchQuantity ~ sub", sub)
        //     })
        // })
        // console.log("🚀 ~ file: ViewReport.js ~ line 168 ~ fetchQuantity ~ response", response);
        if (response.status === 200) {
            setQuantity(response.data);
        }
        // console.log("🚀 ~ file: ViewReport.js ~ line 180 ~ fetchQuantity ~ quantity", quantity)
    };

    // fetch report path
    const fetchReportPath = async () => {
        const response = await getProjectReportPath(company_id, projectId);
  

        if (response.data) {
            {
           
                response.data.map(async (ele, i) => {

                    if (ele.verification_1 === user_id || ele.verification_2 === user_id || ele.started_by === user_id) {

                        let user_id = '';
                        rep_resp = await getReport(projectId, MyDateString, user_id);
                        // console.log("🚀 ~ file: ViewReport.js ~ line 195 ~ response.data.map ~ rep_resp", rep_resp)
                        

                        if (rep_resp.data) {

                            rep_resp.data.map((item, idx) => {

                                if (item._id === trackId) {
                                    setReportData({
                                        project_name: item.project_name,
                                        user_name: item.user_name,
                                        date: item.report_date,
                                        time: item.report_time,

                                        verify_1_status: item.verify_1_status,
                                        verify_1_revert: item.verify_1_revert,
                                        verify_1_revert_msg: item.verify_1_revert_msg,

                                        verify_2_status: item.verify_2_status,
                                        verify_2_revert: item.verify_2_revert,
                                        verify_2_revert_msg: item.verify_2_revert_msg,


                                        admin_1_status: item.admin_1_status,
                                        admin_1_revert: item.admin_1_revert,
                                        admin_1_revert_msg: item.admin_1_revert_msg,

                                        admin_2_status: item.admin_2_status,
                                        admin_2_revert: item.admin_2_revert,
                                        admin_2_revert_msg: item.admin_2_revert_msg,


                                        final_verify_status: item.final_verify_status,
                                        final_verify_revert: item.final_verify_revert,
                                        final_verify_revert_msg: item.final_verify_revert_msg



                                    });
                                }
                            })
                        }


                    } else {
                        rep_resp = await getReport(projectId, date, user_id);
                        if (rep_resp.data) {
                            rep_resp.data.map((item, idx) => {
                                if (item._id === trackId) {
                                    setReportData({
                                        project_name: item.project_name,
                                        user_name: item.user_name,
                                        date: item.report_date,
                                        time: item.report_time,

                                        verify_1_status: item.verify_1_status,
                                        verify_1_revert: item.verify_1_revert,
                                        verify_1_revert_msg: item.verify_1_revert_msg,

                                        verify_2_status: item.verify_2_status,
                                        verify_2_revert: item.verify_2_revert,
                                        verify_2_revert_msg: item.verify_2_revert_msg,

                                        admin_1_status: item.admin_1_status,
                                        admin_1_revert: item.admin_1_revert,
                                        admin_1_revert_msg: item.admin_1_revert_msg,

                                        admin_2_status: item.admin_2_status,
                                        admin_2_revert: item.admin_2_revert,
                                        admin_2_revert_msg: item.admin_2_revert_msg,

                                        final_verify_status: item.final_verify_status,
                                        final_verify_revert: item.final_verify_revert,
                                        final_verify_revert_msg: item.final_verify_revert_msg

                                    });
                                }
                            })
                        }

                    }

                    setReport(rep_resp.data);

                })
            }
            setReportPath(response.data);
        }

    };

    useMemo(() => {
        fetchReportPath()

    }, [loading, trackId]);



    // fetch verify report
    const fetchVerifyReport = async () => {

        let response = await verifyReport(projectId, reportId, user_id);
    
        if (response.status === 200) {
            alert('Verified');
            fetchReportPath(projectId);
        }
    };




    // fetch revert report
    const submitRevertReport = async () => {
        const formData = {
            revert_msg: revertMsg,
        };
        let response = await revertReport(projectId, reportId, user_id, formData);
        if (response.status === 200) {
            alert('Reverted Successfully');
            setRevertMsg('');
            setRevertModal(false);
            fetchReportPath();
        } else {
            alert(response.message);
        }
    };

    React.useEffect(() => {
        fetchReportPath();
    }, [onSelect]);

    // date
    const [date, setDate] = React.useState(new Date());
    MyDateString =
        date.getFullYear() +
        '%2F' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '%2F' +
        ('0' + date.getDate()).slice(-2);

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

    const showDatepicker = () => {
        showMode('date');
    };




    function renderProjectFilter() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingRight: -SIZES.radius * 0.5,
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        width: '70%',
                        ...styles.shadow,
                    }}>
                    <DropDownPicker
                        style={{
                            borderWidth: null,
                            backgroundColor: COLORS.white,
                            minHeight: 40,
                            borderRadius: 5,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: COLORS.darkGray,
                            borderWidth: null,
                            borderRadius: 5,
                        }}
                        textStyle={{
                            fontSize: 16,
                            color: COLORS.black,
                            textTransform: 'capitalize',
                        }}
                        listParentLabelStyle={{ color: COLORS.white, fontSize: 15 }}
                        placeholder="Select project"
                        open={openProject}
                        value={projectValue}
                        items={project}
                        setOpen={setOpenProject}
                        setValue={setProjectValue}
                        setItems={setProject}
                        tickIconStyle={{
                            width: 18,
                            height: 18,
                            backgroundColor: COLORS.white,
                            tintColor: 'black',
                        }}
                        onSelectItem={value => {
                            // fetchReport(value.value);
                            setProjectId(value.value);
                            setOnSelect(true);
                            fetchReportPath();
                        }}
                        onOpen={onProjectOpen}
                        autoScroll={false}
                        arrowIconStyle={{
                            width: 25,
                            height: 25,
                            tintColor: 'black',
                        }}
                        // maxHeight={200}
                        // zIndex={1000}
                        zIndexInverse={1000}
                    />
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: COLORS.darkGray,
                        padding: 10,
                        borderRadius: 2,
                    }}
                    onPress={showDatepicker}>
                    <Image
                        source={icons.filter}
                        style={{ height: 18, width: 18, tintColor: '#ffffff' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        backgroundColor: COLORS.gray,
                        padding: 5,
                        paddingVertical: 9,
                        // right: -SIZES.base * 4,
                        alignItems: 'center',
                        borderRadius: 5,
                    }}
                    onPress={() => {
                        navigation.navigate('UserDashboard')
                    }}
                >
                    <Ionicons
                        name={'arrow-back'}
                        color={COLORS.white2}
                    />
                    <Text
                        style={{
                            color: COLORS.white2
                        }}
                    > Back </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // console.log("🚀 ~ file: ViewReport.js ~ line 305 ~ ViewReport ~ reportPath", reportPath)



    // report user list
    function renderReport() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: 10,
                    elevation: 1,
                    borderLeftWidth: 5,
                    borderColor: item.final_verify_status ? COLORS.green : COLORS.yellow_500
                }}

                onPress={() => {
                    setReportModal(true);
                    setTrackId(item._id);
                    // console.log("🚀 ~ file: ViewReport.js ~ line 337 ~ renderReport ~ item", item)

                    // setReportData({
                    //     project_name: item.project_name,
                    //     user_name: item.user_name,
                    //     date: item.report_date,
                    //     time: item.report_time,

                    //     verify_1_status: item.verify_1_status,
                    //     verify_1_revert: item.verify_1_revert,
                    //     verify_1_revert_msg: item.verify_1_revert_msg,

                    //     admin_1_status: item.admin_1_status,
                    //     admin_1_revert: item.admin_1_revert,
                    //     admin_1_revert_msg: item.admin_1_revert_msg,

                    //     admin_2_status: item.admin_2_status,
                    //     admin_2_revert: item.admin_2_revert,
                    //     admin_2_revert_msg: item.admin_2_revert_msg

                    // });
                    fetchManpower(item._id);
                    fetchQuantity(item._id);
                }}>
                <Text
                    style={{
                        ...FONTS.h2,
                        color: COLORS.darkGray,
                        textTransform: 'capitalize',
                    }}>
                    {item.user_name}
                </Text>
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={icons.date}
                            style={{ height: 12, width: 12, right: 10 }}
                        />
                        <Text style={{ fontSize: 12, color: COLORS.darkGray }}>
                            {item.report_date}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={icons.time}
                            style={{ height: 12, width: 12, right: 10 }}
                        />
                        <Text style={{ fontSize: 12, color: COLORS.darkGray }}>
                            {item.report_time}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
        return (
            <FlatList
                contentContainerStyle={{ marginTop: 20 }}
                data={report}
                keyExtractor={item => `${item._id}`}
                renderItem={renderItem}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                    return (
                        <View
                            style={{
                                marginVertical: SIZES.base - 2,
                            }}></View>
                    );
                }}
            />
        );
    }

    const trackVerificationProcess = () => {

        return (<View
            style={{
                flex: 1,
                borderWidth: 1,
                padding: SIZES.base,
                maxHeight: 210,
                marginTop: 5
            }}
        >
            <Text
                style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                    marginBottom: 5,
                    textAlign: 'center'
                }}>
                Track Verification Process :
            </Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        progressBackgroundColor="white"
                        tintColor="red"
                        refreshing={loading}
                        onRefresh={loadMore}
                    />
                }
                style={{
                    flex: 1,
                    height: 500
                }}
                contentContainerStyle={{ flexGrow: 1, height: 200 }}
            >
                {reportPath ? reportPath.map((ele, idx) => {
                    return (
                        <View style={{
                        }}
                            key={idx}
                        >
                            {
                                (
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        position: 'relative',
                                        // backgroundColor: 'dodgerblue',
                                        // top: 20,
                                        left: 0,
                                        right: 0,
                                        bottom: 0
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            flexWrap: 'wrap'

                                        }}>
                                            <View style={{
                                                // backgroundColor: 'red',
                                                position: 'absolute',
                                                left: 0,
                                                width: SIZES.width * 0.17

                                            }}>
                                                <Text>Verifier</Text>
                                            </View>
                                            <View style={{
                                                // backgroundColor: 'dodgerblue',
                                                position: 'absolute',
                                                left: 70,
                                                width: SIZES.width * 0.3
                                            }}>
                                                <Text>Verifier Name</Text>
                                            </View>
                                            <View style={{
                                                // backgroundColor: 'green',
                                                position: 'absolute',
                                                left: 185,
                                                width: SIZES.width * 0.3
                                            }}>
                                                <Text>Verify Status</Text>
                                            </View>
                                            <View style={{
                                                // backgroundColor: 'yellow',
                                                position: 'absolute',
                                                left: 272,
                                                width: SIZES.width * 0.3
                                            }}>
                                                <Text>Revtd. Status</Text>
                                            </View>
                                            <View style={{
                                                // backgroundColor: 'yellow',
                                                position: 'absolute',
                                                top: 150,
                                                left: 0,
                                                width: SIZES.width * 0.35
                                            }}>
                                                <Text style={{
                                                    ...FONTS.h3,
                                                    textTransform: 'capitalize',
                                                    color: COLORS.black,
                                                }}>Reverted-Message</Text>
                                            </View>
                                        </View>

                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            // alignContent:'space-between',
                                            // justifyContent: 'space-between',
                                            // position: 'absolute',
                                            // left: 0,
                                            // bottom: 0,
                                            marginTop: 28
                                        }}>
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    left: 1,
                                                    width: SIZES.width * 0.48,
                                                    // backgroundColor: 'yellow'
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        ...FONTS.h3,
                                                        textTransform: 'capitalize',
                                                        color: COLORS.black,
                                                    }}>
                                                    Verifier 1: {ele.verification_1_name}
                                                </Text>
                                                <View style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    borderWidth: 1,
                                                    marginTop: 22,
                                                    borderColor: COLORS.lightGray1
                                                }}>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    left: 1,
                                                    top: 25,
                                                    width: SIZES.width * 0.5,
                                                    // backgroundColor: 'yellow'
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        ...FONTS.h3,
                                                        textTransform: 'capitalize',
                                                        color: COLORS.black,
                                                    }}>
                                                    Verfier 2:  {ele.verification_2_name}
                                                </Text>
                                                <View style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    borderWidth: 1,
                                                    marginTop: 22,
                                                    borderColor: COLORS.lightGray1
                                                }}>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    left: 1,
                                                    top: 48,
                                                    width: SIZES.width * 0.5,
                                                    // backgroundColor: 'yellow'
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        ...FONTS.h3,
                                                        textTransform: 'capitalize',
                                                        color: COLORS.black,
                                                    }}>
                                                    Admin 1:  {ele.admin_1_name}
                                                </Text>
                                                <View style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    borderWidth: 1,
                                                    marginTop: 22,
                                                    borderColor: COLORS.lightGray1
                                                }}>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    left: 1,
                                                    top: 70,
                                                    width: SIZES.width * 0.5,
                                                    // backgroundColor: 'yellow'
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        ...FONTS.h3,
                                                        textTransform: 'capitalize',
                                                        color: COLORS.black,
                                                    }}>
                                                    Admin 2:  {ele.admin_2_name}
                                                </Text>
                                                <View style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    borderWidth: 1,
                                                    marginTop: 22,
                                                    borderColor: COLORS.lightGray1
                                                }}>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    left: 1,
                                                    top: 95,
                                                    width: SIZES.width * 0.5,
                                                    // backgroundColor: 'yellow'
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        ...FONTS.h3,
                                                        textTransform: 'capitalize',
                                                        color: COLORS.black,
                                                    }}>
                                                    Final verifier:  {ele.final_verify}
                                                </Text>
                                                <View style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    borderWidth: 1,
                                                    marginTop: 22,
                                                    borderColor: COLORS.lightGray1
                                                }}>
                                                </View>
                                            </View>
                                            <View style={{
                                                position: 'absolute',
                                                width: '100%',
                                                borderWidth: 0.2,
                                                bottom: 3,
                                                borderColor: COLORS.lightGray1
                                            }}>
                                            </View>
                                        </View>

                                        {
                                            (
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'column',
                                                        position: 'absolute',
                                                        left: 190,
                                                        marginTop: 25
                                                    }}
                                                >
                                                    {
                                                        reportData.verify_1_status === false && reportData.verify_1_revert === false &&
                                                            reportData.verify_2_status === false && reportData.verify_2_revert === false &&
                                                            reportData.admin_1_status === false && reportData.admin_1_revert === false &&
                                                            reportData.admin_2_status === false && reportData.admin_2_revert === false &&
                                                            reportData.final_verify_status === false && reportData.final_verify_revert === false

                                                            ? (
                                                                <>
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            alignContent: 'space-between',
                                                                            position: 'absolute'
                                                                        }}>

                                                                        <View style={{
                                                                            left: 70,
                                                                            top: 3
                                                                        }}>

                                                                            <TouchableOpacity
                                                                                style={{
                                                                                    left: 15,
                                                                                    paddingHorizontal: 2,
                                                                                    paddingVertical: 0.5,
                                                                                    backgroundColor: COLORS.rose_600,
                                                                                }}
                                                                                onPress={() => { ele.verification_1 === user_id ? setRevertModal(true) : null }}>
                                                                                <Text style={{ color: 'white', ...FONTS.h5 }}>
                                                                                    Revert
                                                                                </Text>
                                                                            </TouchableOpacity>
                                                                            <TouchableOpacity
                                                                                style={{
                                                                                    left: 15,
                                                                                    top: 1,
                                                                                    paddingHorizontal: 2,
                                                                                    paddingVertical: 0.5,
                                                                                    backgroundColor: COLORS.red_300,
                                                                                }}
                                                                                onPress={() => {
                                                                                    ele.admin_1 === user_id ? setRevertModal(true) : null
                                                                                }}>
                                                                                <Text style={{ color: 'white', ...FONTS.h5 }}>
                                                                                    Revert
                                                                                </Text>
                                                                            </TouchableOpacity>
                                                                            {/* <TouchableOpacity
                                                                            style={{
                                                                                left: 15,
                                                                                top: 2,
                                                                                paddingHorizontal: 5,
                                                                                paddingVertical: 1,
                                                                                backgroundColor: COLORS.red_300,
                                                                            }}
                                                                            onPress={() => {
                                                                                ele.admin_2 === user_id ? setRevertModal(true) : null
                                                                            }}>
                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                Revert
                                                                            </Text>
                                                                        </TouchableOpacity> */}

                                                                        </View>
                                                                        <View style={{
                                                                            position: 'absolute',
                                                                            left: 0,
                                                                            top: 3
                                                                        }}>
                                                                            <View
                                                                                style={{
                                                                                    left: 20,

                                                                                    flexDirection: 'row',
                                                                                }}>
                                                                                <TouchableOpacity
                                                                                    style={{
                                                                                        paddingHorizontal: 3,
                                                                                        paddingVertical: 0.5,
                                                                                        backgroundColor: COLORS.success_600,
                                                                                    }}
                                                                                    onPress={() => {
                                                                                        ele.verification_1 === user_id ? fetchVerifyReport() : null
                                                                                    }}>
                                                                                    <Text style={{ color: 'white', ...FONTS.h5 }}>
                                                                                        Verify
                                                                                    </Text>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                            <View
                                                                                style={{
                                                                                    left: 20,
                                                                                    top: 1,
                                                                                    flexDirection: 'row',
                                                                                }}>
                                                                                <TouchableOpacity
                                                                                    style={{
                                                                                        paddingHorizontal: 3,
                                                                                        paddingVertical: 0.4,
                                                                                        backgroundColor: COLORS.success_400
                                                                                    }}
                                                                                    onPress={() => {
                                                                                        ele.admin_1 === user_id ? fetchVerifyReport() : null
                                                                                    }
                                                                                    }>
                                                                                    <Text style={{ color: 'white', ...FONTS.h5 }}>
                                                                                        Verify
                                                                                    </Text>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                            {/* <View
                                                                            style={{
                                                                                left: 20,
                                                                                top: 2,
                                                                                flexDirection: 'row',
                                                                            }}>
                                                                            <TouchableOpacity
                                                                                style={{
                                                                                    paddingHorizontal: 5,
                                                                                    paddingVertical: 1,
                                                                                    backgroundColor: COLORS.success_300,
                                                                                }}
                                                                                onPress={() => {
                                                                                    ele.admin_2 === user_id ? fetchVerifyReport() : null
                                                                                }}>
                                                                                <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                    Verify
                                                                                </Text>
                                                                            </TouchableOpacity>
                                                                        </View> */}
                                                                        </View>
                                                                    </View>

                                                                </>

                                                            ) :
                                                            reportData.verify_1_status === true && reportData.verify_1_revert === false &&
                                                                reportData.verify_2_status === false && reportData.verify_2_revert === false &&
                                                                reportData.admin_1_status === false && reportData.admin_1_revert === false &&
                                                                reportData.admin_2_status === false && reportData.admin_2_revert === false &&
                                                                reportData.final_verify_status === false && reportData.final_verify_revert === false
                                                                ? (
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            alignContent: 'space-between',
                                                                            position: 'absolute'
                                                                        }}>
                                                                        <View>
                                                                            <View
                                                                                style={{
                                                                                    left: 20,
                                                                                    top: 8,
                                                                                    flexDirection: 'row',
                                                                                }}>
                                                                                <TouchableOpacity
                                                                                    style={{
                                                                                        paddingHorizontal: 16,
                                                                                        paddingVertical: 1,
                                                                                        alignItems: 'center',
                                                                                        backgroundColor: COLORS.transparent,
                                                                                    }}
                                                                                    onPress={() => {
                                                                                        // ele.verification_1 === user_id ? fetchVerifyReport() : null
                                                                                    }}>
                                                                                    <Image
                                                                                        source={icons.verify}
                                                                                        style={{
                                                                                            // left: 8,
                                                                                            width: 16,
                                                                                            height: 16,
                                                                                            tintColor: 'green',
                                                                                        }}
                                                                                    />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                            <View
                                                                                style={{
                                                                                    left: 20,
                                                                                    flexDirection: 'row',
                                                                                }}>
                                                                                <TouchableOpacity
                                                                                    style={{
                                                                                        paddingHorizontal: 3,
                                                                                        paddingVertical: 0.6,
                                                                                        top: 8,
                                                                                        backgroundColor: COLORS.success_600,
                                                                                    }}
                                                                                    onPress={() => {
                                                                                        ele.verification_2 === user_id ? fetchVerifyReport() : null
                                                                                    }}>
                                                                                    <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                        Verify
                                                                                    </Text>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                            {/* <View
                                                                                style={{
                                                                                    left: 20,
                                                                                    flexDirection: 'row',
                                                                                }}>
                                                                                <TouchableOpacity
                                                                                    style={{
                                                                                        paddingHorizontal: 5,
                                                                                        top: 5,
                                                                                        paddingVertical: 1,
                                                                                        backgroundColor: COLORS.success_300,
                                                                                    }}
                                                                                    onPress={() => {
                                                                                        ele.admin_2 === user_id ? fetchVerifyReport() : null

                                                                                    }}>
                                                                                    <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                        Verify
                                                                                    </Text>
                                                                                </TouchableOpacity>
                                                                            </View> */}
                                                                        </View>
                                                                        <View
                                                                            style={{
                                                                                left: 25,
                                                                                top: 25
                                                                            }}>
                                                                            {/* <TouchableOpacity
                                                                                style={{
                                                                                    left: 15,
                                                                                    paddingHorizontal: 5,
                                                                                    paddingVertical: 1,
                                                                                    backgroundColor: COLORS.red_300,
                                                                                }}
                                                                                onPress={() => {
                                                                                    // setRevertModal(true)
                                                                                    // ele.verification_1 === user_id ? setRevertModal(true) : null

                                                                                }}>
                                                                                <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                    Revert
                                                                                </Text>
                                                                            </TouchableOpacity> */}
                                                                            <TouchableOpacity
                                                                                style={{
                                                                                    left: 15,
                                                                                    top: 1,
                                                                                    paddingHorizontal: 3,
                                                                                    paddingVertical: 0.5,
                                                                                    backgroundColor: COLORS.rose_600,
                                                                                }}
                                                                                onPress={() => {
                                                                                    // setRevertModal(true)
                                                                                    ele.verification_2 === user_id ? setRevertModal(true) : null

                                                                                }}>
                                                                                <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                    Revert
                                                                                </Text>
                                                                            </TouchableOpacity>
                                                                            {/* <TouchableOpacity
                                                                                style={{
                                                                                    left: 15,
                                                                                    top: 2,
                                                                                    paddingHorizontal: 5,
                                                                                    paddingVertical: 1,
                                                                                    backgroundColor: COLORS.rose_600,
                                                                                }}
                                                                                onPress={() => {
                                                                                    // setRevertModal(true)
                                                                                    ele.admin_2 === user_id ? setRevertModal(true) : null

                                                                                }}>
                                                                                <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                    Revert
                                                                                </Text>
                                                                            </TouchableOpacity> */}
                                                                        </View>
                                                                    </View>
                                                                ) :
                                                                reportData.verify_1_status === true && reportData.verify_1_revert === false &&
                                                                    reportData.verify_2_status === true && reportData.verify_2_revert === false &&
                                                                    reportData.admin_1_status === false && reportData.admin_1_revert === false &&
                                                                    reportData.admin_2_status === false && reportData.admin_2_revert === false &&
                                                                    reportData.final_verify_status === false && reportData.final_verify_revert === false
                                                                    ? (
                                                                        <View
                                                                            style={{
                                                                                flexDirection: 'row',
                                                                                alignContent: 'space-between',
                                                                                position: 'absolute'
                                                                            }}
                                                                        >
                                                                            <View>
                                                                                <View
                                                                                    style={{
                                                                                        left: 20,
                                                                                        top: 3,
                                                                                        flexDirection: 'row',
                                                                                    }}>
                                                                                    <TouchableOpacity
                                                                                        style={{
                                                                                            paddingHorizontal: 16,
                                                                                            paddingVertical: 1,
                                                                                            alignItems: 'center',
                                                                                            backgroundColor: COLORS.transparent,
                                                                                        }}
                                                                                        onPress={() => {
                                                                                            // fetchVerifyReport()
                                                                                            // ele.verification_1 === user_id ? fetchVerifyReport() : null

                                                                                        }}>
                                                                                        <Image
                                                                                            source={icons.verify}
                                                                                            style={{
                                                                                                // left: 8,
                                                                                                width: 16,
                                                                                                height: 16,
                                                                                                tintColor: 'green',
                                                                                            }}
                                                                                        />
                                                                                    </TouchableOpacity>
                                                                                </View>
                                                                                <View
                                                                                    style={{
                                                                                        left: 20,
                                                                                        top: 8,
                                                                                        flexDirection: 'row',
                                                                                    }}>
                                                                                    <TouchableOpacity
                                                                                        style={{
                                                                                            paddingHorizontal: 16,
                                                                                            paddingVertical: 1,
                                                                                            alignItems: 'center',
                                                                                            backgroundColor: COLORS.transparent,
                                                                                        }}
                                                                                        onPress={() => {
                                                                                            // fetchVerifyReport()
                                                                                            // ele.admin_1 === user_id ? fetchVerifyReport() : null

                                                                                        }}>
                                                                                        <Image
                                                                                            source={icons.verify}
                                                                                            style={{
                                                                                                // left: 8,
                                                                                                width: 16,
                                                                                                height: 16,
                                                                                                tintColor: 'green',
                                                                                            }}
                                                                                        />
                                                                                    </TouchableOpacity>
                                                                                </View>
                                                                                {/* <View
                                                                                    style={{
                                                                                        left: 20,
                                                                                        top: 13,
                                                                                        flexDirection: 'row',
                                                                                    }}>
                                                                                    <TouchableOpacity
                                                                                        style={{
                                                                                            paddingHorizontal: 5,
                                                                                            paddingVertical: 1,
                                                                                            backgroundColor: COLORS.success_600,
                                                                                        }}
                                                                                        onPress={() => {
                                                                                            // fetchVerifyReport()
                                                                                            ele.admin_2 === user_id ? fetchVerifyReport() : null

                                                                                        }}>
                                                                                        <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                            Verify
                                                                                        </Text>
                                                                                    </TouchableOpacity>
                                                                                </View> */}
                                                                            </View>
                                                                            {/* <View>
                                                                                <View
                                                                                    style={{
                                                                                        left: 30
                                                                                    }}>
                                                                                    <TouchableOpacity
                                                                                        style={{
                                                                                            left: 15,
                                                                                            paddingHorizontal: 5,
                                                                                            paddingVertical: 1,
                                                                                            backgroundColor: COLORS.rose_600,
                                                                                        }}
                                                                                        onPress={() => {
                                                                                            // setRevertModal(true)
                                                                                            // ele.verification_1 === user_id ? setRevertModal(true) : null

                                                                                        }}>
                                                                                        <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                            Revert
                                                                                        </Text>
                                                                                    </TouchableOpacity>
                                                                                    <TouchableOpacity
                                                                                        style={{
                                                                                            left: 15,
                                                                                            top: 1,
                                                                                            paddingHorizontal: 5,
                                                                                            paddingVertical: 1,
                                                                                            backgroundColor: COLORS.rose_600,
                                                                                        }}
                                                                                        onPress={() => {
                                                                                            // setRevertModal(true)
                                                                                            // ele.admin_1 === user_id ? setRevertModal(true) : null

                                                                                        }}>
                                                                                        <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                            Revert
                                                                                        </Text>
                                                                                    </TouchableOpacity>
                                                                                    <TouchableOpacity
                                                                                        style={{
                                                                                            left: 15,
                                                                                            top: 2,
                                                                                            paddingHorizontal: 5,
                                                                                            paddingVertical: 1,
                                                                                            backgroundColor: COLORS.rose_600,
                                                                                        }}
                                                                                        onPress={() => {
                                                                                            // setRevertModal(true)
                                                                                            ele.admin_2 === user_id ? setRevertModal(true) : null

                                                                                        }}>
                                                                                        <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                            Revert
                                                                                        </Text>
                                                                                    </TouchableOpacity>
                                                                                </View>
                                                                            </View> */}
                                                                        </View>
                                                                    )
                                                                    : reportData.verify_1_status === true && reportData.verify_1_revert === false &&
                                                                        reportData.verify_2_status === true && reportData.verify_2_revert === false &&
                                                                        reportData.admin_1_status === true && reportData.admin_1_revert === false &&
                                                                        reportData.admin_2_status === false && reportData.admin_2_revert === false &&
                                                                        reportData.final_verify_status === false && reportData.final_verify_revert === false
                                                                        ? (
                                                                            <View style={{
                                                                                flexDirection: 'row',
                                                                                alignContent: 'space-between',
                                                                                position: 'absolute'
                                                                            }}>
                                                                                <View>
                                                                                    <View
                                                                                        style={{
                                                                                            left: 20,
                                                                                            top: 3,
                                                                                            flexDirection: 'row',
                                                                                        }}>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                paddingHorizontal: 16,
                                                                                                paddingVertical: 1,
                                                                                                alignItems: 'center',
                                                                                                backgroundColor: COLORS.transparent,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // fetchVerifyReport()
                                                                                                // ele.verification_1 === user_id ? fetchVerifyReport() : null

                                                                                            }}>
                                                                                            <Image
                                                                                                source={icons.verify}
                                                                                                style={{
                                                                                                    // left: 8,
                                                                                                    width: 16,
                                                                                                    height: 16,
                                                                                                    tintColor: 'green',
                                                                                                }}
                                                                                            />
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                    <View
                                                                                        style={{
                                                                                            left: 20,
                                                                                            top: 8,
                                                                                            flexDirection: 'row',
                                                                                        }}>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                paddingHorizontal: 16,
                                                                                                paddingVertical: 1,
                                                                                                alignItems: 'center',
                                                                                                backgroundColor: COLORS.transparent,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // fetchVerifyReport()
                                                                                                // ele.admin_1 === user_id ? fetchVerifyReport() : null

                                                                                            }}>
                                                                                            <Image
                                                                                                source={icons.verify}
                                                                                                style={{
                                                                                                    // left: 8,
                                                                                                    width: 16,
                                                                                                    height: 16,
                                                                                                    tintColor: 'green',
                                                                                                }}
                                                                                            />
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                    <View
                                                                                        style={{
                                                                                            left: 20,
                                                                                            top: 16,
                                                                                            flexDirection: 'row',
                                                                                        }}>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                paddingHorizontal: 16,
                                                                                                paddingVertical: 1,
                                                                                                alignItems: 'center',
                                                                                                backgroundColor: COLORS.transparent,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // fetchVerifyReport()
                                                                                                // ele.admin_2 === user_id ? fetchVerifyReport() : null

                                                                                            }}>
                                                                                            <Image
                                                                                                source={icons.verify}
                                                                                                style={{
                                                                                                    // left: 8,
                                                                                                    width: 16,
                                                                                                    height: 16,
                                                                                                    tintColor: 'green',
                                                                                                }}
                                                                                            />
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                </View>
                                                                                {/* <View>
                                                                                    <View
                                                                                        style={{
                                                                                            left: 30
                                                                                        }}>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                left: 15,
                                                                                                paddingHorizontal: 5,
                                                                                                paddingVertical: 1,
                                                                                                backgroundColor: COLORS.rose_600,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // setRevertModal(true)
                                                                                                // ele.verification_1 === user_id ? setRevertModal(true) : null

                                                                                            }}>
                                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                                Revert
                                                                                            </Text>
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                left: 15,
                                                                                                top: 1,
                                                                                                paddingHorizontal: 5,
                                                                                                paddingVertical: 1,
                                                                                                backgroundColor: COLORS.rose_600,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // setRevertModal(true)
                                                                                                // ele.admin_1 === user_id ? setRevertModal(true) : null

                                                                                            }}>
                                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                                Revert
                                                                                            </Text>
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                left: 15,
                                                                                                top: 2,
                                                                                                paddingHorizontal: 5,
                                                                                                paddingVertical: 1,
                                                                                                backgroundColor: COLORS.rose_600,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // setRevertModal(true)
                                                                                                // ele.admin_2 === user_id ? setRevertModal(true) : null

                                                                                            }}>
                                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                                Revert
                                                                                            </Text>
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                </View> */}
                                                                            </View>
                                                                        )
                                                                        : reportData.verify_1_status === true && reportData.verify_1_revert === false &&
                                                                            reportData.verify_2_status === true && reportData.verify_2_revert === false &&
                                                                            reportData.admin_1_status === true && reportData.admin_1_revert === false &&
                                                                            reportData.admin_2_status === true && reportData.admin_2_revert === false &&
                                                                            reportData.final_verify_status === false && reportData.final_verify_revert === false
                                                                            ? (
                                                                                <View style={{
                                                                                    flexDirection: 'row',
                                                                                    alignContent: 'space-between',
                                                                                    position: 'absolute'
                                                                                }}>
                                                                                    <View>
                                                                                        <View
                                                                                            style={{
                                                                                                left: 20,
                                                                                                top: 3,
                                                                                                flexDirection: 'row',
                                                                                            }}>
                                                                                            <TouchableOpacity
                                                                                                style={{
                                                                                                    paddingHorizontal: 16,
                                                                                                    paddingVertical: 1,
                                                                                                    alignItems: 'center',
                                                                                                    backgroundColor: COLORS.transparent,
                                                                                                }}
                                                                                                onPress={() => {
                                                                                                    // fetchVerifyReport()
                                                                                                    // ele.verification_1 === user_id ? fetchVerifyReport() : null

                                                                                                }}>
                                                                                                <Image
                                                                                                    source={icons.verify}
                                                                                                    style={{
                                                                                                        // left: 8,
                                                                                                        width: 16,
                                                                                                        height: 16,
                                                                                                        tintColor: 'green',
                                                                                                    }}
                                                                                                />
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                        <View
                                                                                            style={{
                                                                                                left: 20,
                                                                                                top: 8,
                                                                                                flexDirection: 'row',
                                                                                            }}>
                                                                                            <TouchableOpacity
                                                                                                style={{
                                                                                                    paddingHorizontal: 16,
                                                                                                    paddingVertical: 1,
                                                                                                    alignItems: 'center',
                                                                                                    backgroundColor: COLORS.transparent,
                                                                                                }}
                                                                                                onPress={() => {
                                                                                                    // fetchVerifyReport()
                                                                                                    // ele.admin_1 === user_id ? fetchVerifyReport() : null

                                                                                                }}>
                                                                                                <Image
                                                                                                    source={icons.verify}
                                                                                                    style={{
                                                                                                        // left: 8,
                                                                                                        width: 16,
                                                                                                        height: 16,
                                                                                                        tintColor: 'green',
                                                                                                    }}
                                                                                                />
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                        <View
                                                                                            style={{
                                                                                                left: 20,
                                                                                                top: 16,
                                                                                                flexDirection: 'row',
                                                                                            }}>
                                                                                            <TouchableOpacity
                                                                                                style={{
                                                                                                    paddingHorizontal: 16,
                                                                                                    paddingVertical: 1,
                                                                                                    alignItems: 'center',
                                                                                                    backgroundColor: COLORS.transparent,
                                                                                                }}
                                                                                                onPress={() => {
                                                                                                    // fetchVerifyReport()
                                                                                                    // ele.admin_2 === user_id ? fetchVerifyReport() : null

                                                                                                }}>
                                                                                                <Image
                                                                                                    source={icons.verify}
                                                                                                    style={{
                                                                                                        // left: 8,
                                                                                                        width: 16,
                                                                                                        height: 16,
                                                                                                        tintColor: 'green',
                                                                                                    }}
                                                                                                />
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                        <View
                                                                                            style={{
                                                                                                left: 20,
                                                                                                top: 25,
                                                                                                flexDirection: 'row',
                                                                                            }}>
                                                                                            <TouchableOpacity
                                                                                                style={{
                                                                                                    paddingHorizontal: 16,
                                                                                                    paddingVertical: 1,
                                                                                                    alignItems: 'center',
                                                                                                    backgroundColor: COLORS.transparent,
                                                                                                }}
                                                                                                onPress={() => {
                                                                                                    // fetchVerifyReport()
                                                                                                    // ele.admin_2 === user_id ? fetchVerifyReport() : null

                                                                                                }}>
                                                                                                <Image
                                                                                                    source={icons.verify}
                                                                                                    style={{
                                                                                                        // left: 8,
                                                                                                        width: 16,
                                                                                                        height: 16,
                                                                                                        tintColor: 'green',
                                                                                                    }}
                                                                                                />
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                    </View>
                                                                                    {/* <View>
                                                                                    <View
                                                                                        style={{
                                                                                            left: 30
                                                                                        }}>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                left: 15,
                                                                                                paddingHorizontal: 5,
                                                                                                paddingVertical: 1,
                                                                                                backgroundColor: COLORS.rose_600,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // setRevertModal(true)
                                                                                                // ele.verification_1 === user_id ? setRevertModal(true) : null

                                                                                            }}>
                                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                                Revert
                                                                                            </Text>
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                left: 15,
                                                                                                top: 1,
                                                                                                paddingHorizontal: 5,
                                                                                                paddingVertical: 1,
                                                                                                backgroundColor: COLORS.rose_600,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // setRevertModal(true)
                                                                                                // ele.admin_1 === user_id ? setRevertModal(true) : null

                                                                                            }}>
                                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                                Revert
                                                                                            </Text>
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                left: 15,
                                                                                                top: 2,
                                                                                                paddingHorizontal: 5,
                                                                                                paddingVertical: 1,
                                                                                                backgroundColor: COLORS.rose_600,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // setRevertModal(true)
                                                                                                // ele.admin_2 === user_id ? setRevertModal(true) : null

                                                                                            }}>
                                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                                Revert
                                                                                            </Text>
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                </View> */}
                                                                                </View>
                                                                            )
                                                                            : reportData.verify_1_status === true && reportData.verify_1_revert === false &&
                                                                                reportData.verify_2_status === true && reportData.verify_2_revert === false &&
                                                                                reportData.admin_1_status === true && reportData.admin_1_revert === false &&
                                                                                reportData.admin_2_status === true && reportData.admin_2_revert === false &&
                                                                                reportData.final_verify_status === true && reportData.final_verify_revert === false
                                                                                ? (
                                                                                    <View style={{
                                                                                        flexDirection: 'row',
                                                                                        alignContent: 'space-between',
                                                                                        position: 'absolute'
                                                                                    }}>
                                                                                        <View>
                                                                                            <View
                                                                                                style={{
                                                                                                    left: 20,
                                                                                                    top: 3,
                                                                                                    flexDirection: 'row',
                                                                                                }}>
                                                                                                <TouchableOpacity
                                                                                                    style={{
                                                                                                        paddingHorizontal: 16,
                                                                                                        paddingVertical: 1,
                                                                                                        alignItems: 'center',
                                                                                                        backgroundColor: COLORS.transparent,
                                                                                                    }}
                                                                                                    onPress={() => {
                                                                                                        // fetchVerifyReport()
                                                                                                        // ele.verification_1 === user_id ? fetchVerifyReport() : null

                                                                                                    }}>
                                                                                                    <Image
                                                                                                        source={icons.verify}
                                                                                                        style={{
                                                                                                            // left: 8,
                                                                                                            width: 16,
                                                                                                            height: 16,
                                                                                                            tintColor: 'green',
                                                                                                        }}
                                                                                                    />
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                            <View
                                                                                                style={{
                                                                                                    left: 20,
                                                                                                    top: 8,
                                                                                                    flexDirection: 'row',
                                                                                                }}>
                                                                                                <TouchableOpacity
                                                                                                    style={{
                                                                                                        paddingHorizontal: 16,
                                                                                                        paddingVertical: 1,
                                                                                                        alignItems: 'center',
                                                                                                        backgroundColor: COLORS.transparent,
                                                                                                    }}
                                                                                                    onPress={() => {
                                                                                                        // fetchVerifyReport()
                                                                                                        // ele.admin_1 === user_id ? fetchVerifyReport() : null

                                                                                                    }}>
                                                                                                    <Image
                                                                                                        source={icons.verify}
                                                                                                        style={{
                                                                                                            // left: 8,
                                                                                                            width: 16,
                                                                                                            height: 16,
                                                                                                            tintColor: 'green',
                                                                                                        }}
                                                                                                    />
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                            <View
                                                                                                style={{
                                                                                                    left: 20,
                                                                                                    top: 14,
                                                                                                    flexDirection: 'row',
                                                                                                }}>
                                                                                                <TouchableOpacity
                                                                                                    style={{
                                                                                                        paddingHorizontal: 16,
                                                                                                        paddingVertical: 1,
                                                                                                        alignItems: 'center',
                                                                                                        backgroundColor: COLORS.transparent,
                                                                                                    }}
                                                                                                    onPress={() => {
                                                                                                        // fetchVerifyReport()
                                                                                                        // ele.admin_2 === user_id ? fetchVerifyReport() : null

                                                                                                    }}>
                                                                                                    <Image
                                                                                                        source={icons.verify}
                                                                                                        style={{
                                                                                                            // left: 8,
                                                                                                            width: 16,
                                                                                                            height: 16,
                                                                                                            tintColor: 'green',
                                                                                                        }}
                                                                                                    />
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                            <View
                                                                                                style={{
                                                                                                    left: 20,
                                                                                                    top: 22,
                                                                                                    flexDirection: 'row',
                                                                                                }}>
                                                                                                <TouchableOpacity
                                                                                                    style={{
                                                                                                        paddingHorizontal: 16,
                                                                                                        paddingVertical: 1,
                                                                                                        alignItems: 'center',
                                                                                                        backgroundColor: COLORS.transparent,
                                                                                                    }}
                                                                                                    onPress={() => {
                                                                                                        // fetchVerifyReport()
                                                                                                        // ele.admin_2 === user_id ? fetchVerifyReport() : null

                                                                                                    }}>
                                                                                                    <Image
                                                                                                        source={icons.verify}
                                                                                                        style={{
                                                                                                            // left: 8,
                                                                                                            width: 16,
                                                                                                            height: 16,
                                                                                                            tintColor: 'green',
                                                                                                        }}
                                                                                                    />
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                            <View
                                                                                                style={{
                                                                                                    left: 20,
                                                                                                    top: 28,
                                                                                                    flexDirection: 'row',
                                                                                                }}>
                                                                                                <TouchableOpacity
                                                                                                    style={{
                                                                                                        paddingHorizontal: 16,
                                                                                                        paddingVertical: 1,
                                                                                                        alignItems: 'center',
                                                                                                        backgroundColor: COLORS.transparent,
                                                                                                    }}
                                                                                                    onPress={() => {
                                                                                                        // fetchVerifyReport()
                                                                                                        // ele.admin_2 === user_id ? fetchVerifyReport() : null

                                                                                                    }}>
                                                                                                    <Image
                                                                                                        source={icons.verify}
                                                                                                        style={{
                                                                                                            // left: 8,
                                                                                                            width: 16,
                                                                                                            height: 16,
                                                                                                            tintColor: 'green',
                                                                                                        }}
                                                                                                    />
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                        </View>
                                                                                        {/* <View>
                                                                                    <View
                                                                                        style={{
                                                                                            left: 30
                                                                                        }}>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                left: 15,
                                                                                                paddingHorizontal: 5,
                                                                                                paddingVertical: 1,
                                                                                                backgroundColor: COLORS.rose_600,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // setRevertModal(true)
                                                                                                // ele.verification_1 === user_id ? setRevertModal(true) : null

                                                                                            }}>
                                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                                Revert
                                                                                            </Text>
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                left: 15,
                                                                                                top: 1,
                                                                                                paddingHorizontal: 5,
                                                                                                paddingVertical: 1,
                                                                                                backgroundColor: COLORS.rose_600,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // setRevertModal(true)
                                                                                                // ele.admin_1 === user_id ? setRevertModal(true) : null

                                                                                            }}>
                                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                                Revert
                                                                                            </Text>
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity
                                                                                            style={{
                                                                                                left: 15,
                                                                                                top: 2,
                                                                                                paddingHorizontal: 5,
                                                                                                paddingVertical: 1,
                                                                                                backgroundColor: COLORS.rose_600,
                                                                                            }}
                                                                                            onPress={() => {
                                                                                                // setRevertModal(true)
                                                                                                // ele.admin_2 === user_id ? setRevertModal(true) : null

                                                                                            }}>
                                                                                            <Text style={{ color: 'white', ...FONTS.h4 }}>
                                                                                                Revert
                                                                                            </Text>
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                </View> */}
                                                                                    </View>
                                                                                )
                                                                                : reportData.verify_1_revert === true &&
                                                                                    reportData.verify_2_revert === false &&
                                                                                    reportData.admin_1_revert === false &&
                                                                                    reportData.admin_2_revert === false &&
                                                                                    reportData.final_verify_revert === false
                                                                                    ? (
                                                                                        <View
                                                                                            style={{
                                                                                                flex: 1,
                                                                                                position: 'absolute'

                                                                                            }}
                                                                                        >
                                                                                            <View style={{
                                                                                                flexDirection: 'row',
                                                                                                alignContent: 'space-between',

                                                                                            }}>
                                                                                                <View style={{
                                                                                                    flex: 1,
                                                                                                    left: 60,
                                                                                                    flexDirection: "row",
                                                                                                    top: 5,
                                                                                                    flexWrap: 'wrap',
                                                                                                    alignContent: "space-around"
                                                                                                }}>
                                                                                                    <View
                                                                                                        style={{
                                                                                                            left: 15,
                                                                                                            flexDirection: 'row',
                                                                                                            alignItems: 'center',
                                                                                                            paddingHorizontal: 20

                                                                                                        }}>
                                                                                                        <Image
                                                                                                            source={icons.verify}
                                                                                                            style={{
                                                                                                                width: 16,
                                                                                                                height: 16,
                                                                                                                tintColor: 'red',
                                                                                                            }}
                                                                                                        />
                                                                                                    </View>
                                                                                                </View>
                                                                                            </View>
                                                                                            <View
                                                                                                style={{
                                                                                                    width: SIZES.width * 0.5,
                                                                                                    top: 120,
                                                                                                    right: 192,
                                                                                                    padding: 2
                                                                                                }}
                                                                                            >
                                                                                                <Text
                                                                                                    numberOfLines={1}
                                                                                                    style={{
                                                                                                        ...FONTS.h5,
                                                                                                        textTransform: 'capitalize',
                                                                                                        color: COLORS.black,
                                                                                                    }}>
                                                                                                    {reportData.verify_1_revert_msg}
                                                                                                </Text>
                                                                                            </View>
                                                                                        </View>
                                                                                    )
                                                                                    :
                                                                                    reportData.verify_1_status === false &&
                                                                                        reportData.verify_2_revert === true &&
                                                                                    {/* reportData.admin_1_revert === false &&
                                                                                        reportData.admin_2_revert === false &&
                                                                                        reportData.final_verify_revert === false */}
                                                                                        ? (
                                                                                            <View
                                                                                                style={{
                                                                                                    flexDirection: 'row',
                                                                                                    alignContent: 'space-between',
                                                                                                    position: 'absolute'
                                                                                                }}>

                                                                                                <View style={{
                                                                                                    left: 80,
                                                                                                }}>
                                                                                                    <TouchableOpacity
                                                                                                        style={{
                                                                                                            left: 18,
                                                                                                            top: 30,
                                                                                                            paddingHorizontal: 5,
                                                                                                            paddingVertical: 1,
                                                                                                            alignItems: 'center',
                                                                                                            backgroundColor: COLORS.transparent,
                                                                                                        }}
                                                                                                        onPress={() => {
                                                                                                        }}>
                                                                                                        <Image
                                                                                                            source={icons.verify}
                                                                                                            style={{
                                                                                                                width: 16,
                                                                                                                height: 16,
                                                                                                                tintColor: 'red',
                                                                                                            }}
                                                                                                        />
                                                                                                    </TouchableOpacity>
                                                                                                </View>
                                                                                                <View style={{
                                                                                                    position: 'absolute',
                                                                                                    left: 0,
                                                                                                }}>
                                                                                                    <View
                                                                                                        style={{
                                                                                                            width: SIZES.width * 0.5,
                                                                                                            top: 140,
                                                                                                            right: 191,
                                                                                                            padding: 2
                                                                                                        }}
                                                                                                    >
                                                                                                        <Text
                                                                                                            numberOfLines={1}
                                                                                                            style={{
                                                                                                                ...FONTS.h5,
                                                                                                                textTransform: 'capitalize',
                                                                                                                color: COLORS.black,
                                                                                                            }}>
                                                                                                            {reportData.verify_2_revert_msg}
                                                                                                        </Text>
                                                                                                    </View>
                                                                                                </View>
                                                                                            </View>

                                                                                        )
                                                                                        :

                                                                                        reportData.verify_2_status === false &&
                                                                                            reportData.admin_1_revert === true &&
                                                                                        {/* reportData.admin_2_revert === false &&
                                                                                        reportData.final_verify_revert === false */}
                                                                                            ? (
                                                                                                <View
                                                                                                    style={{
                                                                                                        flexDirection: 'row',
                                                                                                        alignContent: 'space-between',
                                                                                                        position: 'absolute'
                                                                                                    }}>

                                                                                                    <View style={{

                                                                                                        left: 80,
                                                                                                    }}>
                                                                                                        <TouchableOpacity
                                                                                                            style={{
                                                                                                                left: 18,

                                                                                                                top: 52,
                                                                                                                paddingHorizontal: 5,
                                                                                                                paddingVertical: 1,
                                                                                                                alignItems: 'center',
                                                                                                                backgroundColor: COLORS.transparent,
                                                                                                            }}
                                                                                                            onPress={() => {
                                                                                                            }}>
                                                                                                            <Image
                                                                                                                source={icons.verify}
                                                                                                                style={{
                                                                                                                    // left: 8,
                                                                                                                    width: 16,
                                                                                                                    height: 16,
                                                                                                                    tintColor: 'red',
                                                                                                                }}
                                                                                                            />
                                                                                                        </TouchableOpacity>
                                                                                                    </View>
                                                                                                    <View style={{
                                                                                                        position: 'absolute',
                                                                                                        left: 0,
                                                                                                    }}>
                                                                                                        <View
                                                                                                            style={{
                                                                                                                left: 20,
                                                                                                                top: 3,
                                                                                                                flexDirection: 'row',
                                                                                                            }}>
                                                                                                        </View>
                                                                                                        <View
                                                                                                            style={{
                                                                                                                width: SIZES.width * 0.5,
                                                                                                                top: 140,
                                                                                                                right: 191,
                                                                                                                padding: 2
                                                                                                            }}
                                                                                                        >
                                                                                                            <Text
                                                                                                                numberOfLines={1}
                                                                                                                style={{
                                                                                                                    ...FONTS.h5,
                                                                                                                    textTransform: 'capitalize',
                                                                                                                    color: COLORS.black,
                                                                                                                }}>
                                                                                                                {reportData.admin_1_revert_msg}
                                                                                                            </Text>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                </View>

                                                                                            )
                                                                                            :
                                                                                            reportData.admin_1_status === false &&
                                                                                                reportData.admin_2_revert === true &&
                                                                                                {/* reportData.final_verify_revert === false */ }
                                                                                                ? (

                                                                                                    <View
                                                                                                        style={{
                                                                                                            flexDirection: 'row',
                                                                                                            alignContent: 'space-between',
                                                                                                            position: 'absolute'
                                                                                                        }}>

                                                                                                        <View style={{

                                                                                                            left: 80,
                                                                                                        }}>
                                                                                                            <TouchableOpacity
                                                                                                                style={{
                                                                                                                    left: 18,
                                                                                                                    top: 75,
                                                                                                                    paddingHorizontal: 5,
                                                                                                                    paddingVertical: 1,
                                                                                                                    alignItems: 'center',
                                                                                                                    backgroundColor: COLORS.transparent,
                                                                                                                }}
                                                                                                                onPress={() => {
                                                                                                                }}>
                                                                                                                <Image
                                                                                                                    source={icons.verify}
                                                                                                                    style={{
                                                                                                                        width: 16,
                                                                                                                        height: 16,
                                                                                                                        tintColor: 'red',
                                                                                                                    }}
                                                                                                                />
                                                                                                            </TouchableOpacity>
                                                                                                        </View>
                                                                                                        <View style={{
                                                                                                            position: 'absolute',
                                                                                                            left: 0,
                                                                                                        }}>
                                                                                                            <View
                                                                                                                style={{
                                                                                                                    width: SIZES.width * 0.5,
                                                                                                                    top: 140,
                                                                                                                    right: 191,
                                                                                                                    padding: 2
                                                                                                                }}
                                                                                                            >
                                                                                                                <Text
                                                                                                                    numberOfLines={1}
                                                                                                                    style={{
                                                                                                                        ...FONTS.h5,
                                                                                                                        textTransform: 'capitalize',
                                                                                                                        color: COLORS.black,
                                                                                                                    }}>
                                                                                                                    {reportData.admin_2_revert_msg}
                                                                                                                </Text>
                                                                                                            </View>
                                                                                                        </View>
                                                                                                    </View>


                                                                                                )
                                                                                                :
                                                                                                reportData.admin_2_status === false &&
                                                                                                    reportData.final_verify_revert === true
                                                                                                    ? (
                                                                                                        <>
                                                                                                            <View style={{
                                                                                                                flexDirection: 'row',
                                                                                                                alignContent: 'space-between',
                                                                                                                position: 'absolute'
                                                                                                            }}>
                                                                                                                <View
                                                                                                                    style={{
                                                                                                                        left: 25,
                                                                                                                        position: 'absolute'
                                                                                                                    }}>
                                                                                                                    <TouchableOpacity
                                                                                                                        style={{
                                                                                                                            left: 70,
                                                                                                                            top: 98,
                                                                                                                            paddingHorizontal: 16,
                                                                                                                            paddingVertical: 1,
                                                                                                                            alignItems: 'center',
                                                                                                                            backgroundColor: COLORS.transparent,
                                                                                                                        }}
                                                                                                                        onPress={() => {
                                                                                                                        }}>
                                                                                                                        <Image
                                                                                                                            source={icons.verify}
                                                                                                                            style={{
                                                                                                                                // left: 8,
                                                                                                                                width: 16,
                                                                                                                                height: 16,
                                                                                                                                tintColor: 'red',
                                                                                                                            }}
                                                                                                                        />
                                                                                                                    </TouchableOpacity>
                                                                                                                </View>
                                                                                                                <View
                                                                                                                    style={{
                                                                                                                        width: SIZES.width * 0.5,
                                                                                                                        top: 140,
                                                                                                                        right: 190,
                                                                                                                        padding: 2
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Text
                                                                                                                        numberOfLines={1}
                                                                                                                        style={{

                                                                                                                            ...FONTS.h5,
                                                                                                                            textTransform: 'capitalize',
                                                                                                                            color: COLORS.black,
                                                                                                                        }}>
                                                                                                                        {reportData.final_verify_revert_msg}
                                                                                                                    </Text>
                                                                                                                </View>
                                                                                                            </View>
                                                                                                        </>
                                                                                                    ) : null
                                                    }
                                                </View>

                                            )
                                        }
                                    </View>
                                )


                            }
                        </View>
                    );
                }) : null
                }
            </ScrollView>
        </View>)

    }




    // report showing modal
    function renderReportModal() {

        const renderItem = ({ item, index }) => (
            <View
                style={{
                    borderWidth: 1,
                    borderColor: COLORS.gray2,
                    padding: 5,
                    borderRadius: 3,
                    width: SIZES.width / 2.4,
                }}
            >
                <Text style={{ ...FONTS.h3, color: 'black' }}>
                    {item.contractor_name}
                </Text>
                <View style={{}}>
                    {item.manpowerCategories.map((ele, i) => {
                        return (
                            <View
                                key={i}
                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.darkGray }}>
                                    {i + 1}.
                                </Text>
                                <View
                                    style={{
                                        left: 5,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            ...FONTS.h4,
                                            color: COLORS.black,
                                        }}>
                                        {ele.manpower_category_name} {' - '}
                                    </Text>
                                    <Text
                                        style={{
                                            ...FONTS.h4,
                                            color: COLORS.black,
                                        }}>
                                        {ele.manpower_member}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        );

        // const renderFooter =()=>(

        // );

        const footerComponent = () => (
            <View style={{ flex: 1 }}>
                {/* {renderQuantity()} */}
                {/* {user_id && renderFooter()} */}
            </View>
        );

        return (
            <Modal animationType="slide" transparent={true} visible={reportModal}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.transparentBlack7,
                        justifyContent:'flex-end'
                    }}>
                    <View
                        style={{
                            top: 50,
                            backgroundColor: COLORS.white,
                            paddingHorizontal: SIZES.radius,
                            paddingBottom: SIZES.radius,
                            height: '55%',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }}>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <ImageBackground
                                style={{
                                    borderWidth: 2,
                                    borderRadius: 20,
                                    borderColor: 'white',
                                    padding: 3,
                                    top: -20,
                                    backgroundColor: COLORS.rose_600,
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setReportModal(false);
                                    }}>
                                    <Image
                                        source={icons.cross}
                                        style={{ height: 25, width: 25, tintColor: COLORS.white }}
                                    />
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Text
                            style={{
                                textAlign: 'center',
                                marginBottom: 8,
                                ...FONTS.h2,
                                color: COLORS.lightblue_900,
                                fontWeight: '500',
                                textDecorationLine: 'underline',
                            }}>
                            Daily Progress Report
                        </Text>
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: COLORS.darkGray2,
                                borderRadius: 3,
                                padding: 15,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    // alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                        ...FONTS.h2,
                                        color: COLORS.black,
                                        textTransform: 'capitalize',
                                    }}>
                                    {reportData.project_name}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                    }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: COLORS.darkGray }}>
                                            Date{' - '}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: COLORS.darkGray }}>
                                            {reportData.date}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: COLORS.darkGray }}>
                                            Time{' - '}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: COLORS.darkGray }}>
                                            {reportData.time}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    borderBottomWidth: 1,
                                    marginVertical: 10,
                                    borderColor: COLORS.gray2,
                                }}></View>
                            <View>
                                <Text
                                    style={{
                                        ...FONTS.h3,
                                        color: COLORS.black,
                                        textAlign: 'center',
                                    }}>
                                    Manpower
                                </Text>
                                <Text style={{ ...FONTS.h3, color: COLORS.black }}>
                                    Contractors
                                </Text>

                                <FlatList
                                    contentContainerStyle={{ marginTop: 5 }}
                                    numColumns={2}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                    data={manpower}
                                    keyExtractor={item => `${item._id}`}
                                    renderItem={renderItem}
                                    showsVerticalScrollIndicator={false}
                                    ItemSeparatorComponent={() => {
                                        return <View style={{ margin: 5 }}></View>;
                                    }}
                                    ListFooterComponent={footerComponent}
                                    maxHeight={200}
                                    scrollEnabled
                                    ListFooterComponentStyle={{
                                        flex: 1,
                                        // borderWidth:1,
                                        height: "100%",
                                        paddingBottom: 10
                                    }}
                                />
                            </View>
                        </View>
                        {/* <View style={{ flex: 1 }}>
                            {trackVerificationProcess()}
                        </View> */}

                    </View>
                </View>
            </Modal>
        );
    }


    // quantity report
    function renderQuantity() {
        return (
            <View>
                <View
                    style={{
                        borderBottomWidth: 1,
                        marginTop: 15,
                        marginBottom: 5,
                        borderColor: COLORS.gray2,
                    }}></View>
                <Text
                    style={{
                        fontSize: 18,
                        color: COLORS.lightblue_700,
                        textAlign: 'center',
                        textDecorationLine: 'underline',
                        marginBottom: 15,
                    }}>
                    Executed Quantity
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: COLORS.yellow_200,
                                padding: 5,
                            }}>
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 20,
                                    textAlign: 'left',
                                }}>
                                Sn.
                            </Text>
                            <View style={{ marginHorizontal: 5 }}></View>
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 60,
                                    textAlign: 'left',
                                }}>
                                Items
                            </Text>
                            <View style={{ marginHorizontal: 10 }}></View>

                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 30,
                                    textAlign: 'right',
                                }}>
                                Nos
                            </Text>
                            <View style={{ marginHorizontal: 10 }}></View>
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 50,
                                    textAlign: 'right',
                                }}>
                                L
                            </Text>
                            <View style={{ marginHorizontal: 10 }}></View>
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 50,
                                    textAlign: 'right',
                                }}>
                                W
                            </Text>
                            <View style={{ marginHorizontal: 10 }}></View>
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 50,
                                    textAlign: 'right',
                                }}>
                                H
                            </Text>
                            <View style={{ marginHorizontal: 10 }}></View>
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 30,
                                    textAlign: 'right',
                                }}>
                                Unit
                            </Text>
                            <View style={{ marginHorizontal: 10 }}></View>
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 50,
                                    textAlign: 'right',
                                }}>
                                MM
                            </Text>
                            <View style={{ marginHorizontal: 10 }}></View>
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 50,
                                    textAlign: 'right',
                                }}>
                                Qty
                            </Text>
                            <View style={{ marginHorizontal: 15 }}></View>
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: COLORS.black,
                                    width: 200,
                                    textAlign: 'left',
                                }}>
                                Remarks
                            </Text>
                        </View>
                        <View
                            style={{
                                borderBottomWidth: 1,
                                borderColor: COLORS.darkGray,
                                marginBottom: 3,
                            }}></View>

                        <ScrollView nestedScrollEnabled={true}>
                            {quantity.map((ele, index) =>
                                ele.quantityWorkItems.map((ele1, index1) => {
                                    return (
                                        <View style={{}} key={index1}>
                                            {index1 != 0 ? (
                                                <View
                                                    style={{
                                                        borderBottomWidth: 1,
                                                        borderColor: COLORS.darkGray2,
                                                        marginVertical: 5,
                                                    }}></View>
                                            ) : null}
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    padding: 5,
                                                }}>
                                                <Text
                                                    style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.black,
                                                        width: 20,
                                                        textAlign: 'left',
                                                    }}>
                                                    {index1 + 1}.
                                                </Text>
                                                <View style={{ marginHorizontal: 5 }}></View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.black,
                                                        width: 60,
                                                        textAlign: 'left',
                                                        textTransform: 'capitalize',
                                                    }}>
                                                    {ele1.item_name}
                                                </Text>
                                                <View style={{ marginHorizontal: 10 }}></View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.black,
                                                        width: 30,
                                                        textAlign: 'right',
                                                    }}>
                                                    {ele1.nos == null ? '-' : ele1.nos}
                                                </Text>
                                                <View style={{ marginHorizontal: 10 }}></View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.black,
                                                        width: 50,
                                                        textAlign: 'right',
                                                    }}>
                                                    {ele1.num_length == null ? '-' : ele1.num_length}
                                                </Text>
                                                <View style={{ marginHorizontal: 10 }}></View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.black,
                                                        width: 50,
                                                        textAlign: 'right',
                                                    }}>
                                                    {ele1.num_width == null ? '-' : ele1.num_width}
                                                </Text>
                                                <View style={{ marginHorizontal: 10 }}></View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.black,
                                                        width: 50,
                                                        textAlign: 'right',
                                                    }}>
                                                    {ele1.num_height == null ? '-' : ele1.num_height}
                                                </Text>
                                                <View style={{ marginHorizontal: 10 }}></View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.black,
                                                        width: 30,
                                                        textAlign: 'right',
                                                    }}>
                                                    {ele1.unit_name == null ? '-' : ele1.unit_name}
                                                </Text>
                                                <View style={{ marginHorizontal: 10 }}></View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.black,
                                                        width: 50,
                                                        textAlign: 'right',
                                                    }}>
                                                    {ele1.steel_mm == null ? '-' : ele1.steel_mm}
                                                </Text>
                                                <View style={{ marginHorizontal: 10 }}></View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.black,
                                                        width: 50,
                                                        textAlign: 'right',
                                                    }}>
                                                    {ele1.num_total == null ? '-' : ele1.num_total}
                                                </Text>
                                                <View style={{ marginHorizontal: 15 }}></View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h5,
                                                        color: COLORS.black,
                                                        width: 200,
                                                        textAlign: 'left',
                                                    }}>
                                                    {ele1.remark}
                                                </Text>
                                            </View>
                                            <View>
                                                {ele1.subquantityitems.map((ele2, index2) => {
                                                    return (
                                                        <View key={index2}>
                                                            <View
                                                                style={{
                                                                    width: '85%',
                                                                    alignSelf: 'flex-end',
                                                                    borderBottomWidth: 1,
                                                                    borderColor: COLORS.lightblue_600,
                                                                }}></View>
                                                            {index2 == 0 ? (
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        padding: 5,
                                                                    }}>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 20,
                                                                            textAlign: 'left',
                                                                        }}></Text>
                                                                    <View style={{ marginHorizontal: 5 }}></View>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 60,
                                                                            textAlign: 'left',
                                                                        }}></Text>
                                                                    <View style={{ marginHorizontal: 10 }}></View>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 30,
                                                                            textAlign: 'right',
                                                                        }}>
                                                                        Nos
                                                                    </Text>
                                                                    <View style={{ marginHorizontal: 10 }}></View>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 50,
                                                                            textAlign: 'right',
                                                                        }}>
                                                                        L
                                                                    </Text>
                                                                    <View style={{ marginHorizontal: 10 }}></View>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 50,
                                                                            textAlign: 'right',
                                                                        }}>
                                                                        W
                                                                    </Text>
                                                                    <View style={{ marginHorizontal: 10 }}></View>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 50,
                                                                            textAlign: 'right',
                                                                        }}>
                                                                        H
                                                                    </Text>
                                                                    <View style={{ marginHorizontal: 10 }}></View>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 30,
                                                                            textAlign: 'right',
                                                                        }}>
                                                                        Unit
                                                                    </Text>
                                                                    <View style={{ marginHorizontal: 10 }}></View>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 50,
                                                                            textAlign: 'right',
                                                                        }}>
                                                                        MM
                                                                    </Text>
                                                                    <View style={{ marginHorizontal: 10 }}></View>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 50,
                                                                            textAlign: 'right',
                                                                        }}>
                                                                        Qty
                                                                    </Text>
                                                                    <View style={{ marginHorizontal: 15 }}></View>
                                                                    <Text
                                                                        style={{
                                                                            ...FONTS.h5,
                                                                            color: COLORS.lightblue_700,
                                                                            width: 200,
                                                                            textAlign: 'left',
                                                                        }}>
                                                                        Remarks
                                                                    </Text>
                                                                </View>
                                                            ) : null}
                                                            <View
                                                                style={{
                                                                    alignSelf: 'flex-end',
                                                                    borderBottomWidth: 1,
                                                                    borderColor: COLORS.lightblue_700,
                                                                    width: '85%',
                                                                }}></View>
                                                            <View
                                                                key={index2}
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    padding: 5,
                                                                }}>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 20,
                                                                        textAlign: 'left',
                                                                    }}></Text>
                                                                <View style={{ marginHorizontal: 5 }}></View>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 60,
                                                                        textAlign: 'left',
                                                                    }}></Text>
                                                                <View style={{ marginHorizontal: 10 }}></View>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 30,
                                                                        textAlign: 'right',
                                                                    }}>
                                                                    {ele2.sub_nos == null ? '-' : ele2.sub_nos}
                                                                </Text>
                                                                <View style={{ marginHorizontal: 10 }}></View>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 50,
                                                                        textAlign: 'right',
                                                                    }}>
                                                                    {ele2.sub_length == null
                                                                        ? '-'
                                                                        : ele2.sub_length}
                                                                </Text>
                                                                <View style={{ marginHorizontal: 10 }}></View>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 50,
                                                                        textAlign: 'right',
                                                                    }}>
                                                                    {ele2.sub_width == null
                                                                        ? '-'
                                                                        : ele2.sub_width}
                                                                </Text>
                                                                <View style={{ marginHorizontal: 10 }}></View>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 50,
                                                                        textAlign: 'right',
                                                                    }}>
                                                                    {ele2.sub_height == null
                                                                        ? '-'
                                                                        : ele2.sub_height}
                                                                </Text>
                                                                <View style={{ marginHorizontal: 10 }}></View>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 30,
                                                                        textAlign: 'right',
                                                                    }}>
                                                                    -
                                                                </Text>
                                                                <View style={{ marginHorizontal: 10 }}></View>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 50,
                                                                        textAlign: 'right',
                                                                    }}>
                                                                    {ele2.sub_steel_mm == null
                                                                        ? '-'
                                                                        : ele2.sub_steel_mm}
                                                                </Text>
                                                                <View style={{ marginHorizontal: 10 }}></View>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 50,
                                                                        textAlign: 'right',
                                                                    }}>
                                                                    {ele2.sub_total == null
                                                                        ? '-'
                                                                        : ele2.sub_total}
                                                                </Text>
                                                                <View style={{ marginHorizontal: 15 }}></View>
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h5,
                                                                        color: COLORS.black,
                                                                        width: 200,
                                                                        textAlign: 'left',
                                                                    }}>
                                                                    {ele2.sub_remark} ({ele2.sub_quality_type})
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    );
                                }),
                            )}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        );
    }

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
                                <Text style={{ fontSize: 20, color: COLORS.darkGray }}>
                                    Revert message
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
                                    borderBottomColor: COLORS.darkGray
                                }}>
                                <TextInput
                                    placeholder="Write your message..."
                                    multiline={true}
                                    numberOfLines={3}
                                    onChangeText={value => {
                                        setRevertMsg(value);
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{
                                    marginTop: SIZES.padding,
                                    alignItems: 'center',
                                }}
                                onPress={() => submitRevertReport()}>
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
    return (
        <View style={{ margin: SIZES.radius }}>
            {renderProjectFilter()}
            {renderRevertModal()}
            {renderReportModal()}
            {onSelect == true && renderReport()}
        </View>
    );
}

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
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 18,
        padding: 10,
        color: 'black',
        textAlign: 'center',
    },
    imageStyle: {
        width: 150,
        height: 150,
        margin: 5,
        resizeMode: 'stretch',
    },
});

export default ViewReport