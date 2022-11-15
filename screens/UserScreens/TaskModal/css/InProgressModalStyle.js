import { StyleSheet } from 'react-native'
import { FONTS, icons, SIZES, COLORS } from '../../../../constants'

export default StyleSheet.create({
    modal_container: {
        flex: 1,
        // backgroundColor: COLORS.blue,  
        backgroundColor: "white"

    },
    circle: {
        height: 10,
        width: 10,
        marginVertical: 4,
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 1
    },
    active_task_view: {
        margin: 1,
        paddingVertical: SIZES.largeTitle,
        paddingHorizontal: SIZES.h2,
        borderRadius: 10,
        alignItems: "center",
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: "#000",
        shadowOpacity: 1.2,
        bottom: -10
    },
    active_task_title: {
        elevation: 2,
        fontSize: SIZES.h4,
        fontWeight: "bold",
        paddingHorizontal: SIZES.font,
        textAlign: "center",
        bottom: -15,
        color: COLORS.black
    },
    act_tsk_stat: {

        ...FONTS.h2,
        textAlign: "center"
    },
    act_tsk_stat_view: {

        backgroundColor: COLORS.lightblue_500,

    },

    act_tsk_list_view: {
        marginTop: SIZES.body1,
        padding: SIZES.base,
        marginBottom: -SIZES.base
    },

    pie_tag: {
        marginLeft: SIZES.base,
        color: COLORS.black,
        ...FONTS.h4,
        // fontWeight:"bold"
    },
    plus_btn: {
        backgroundColor: COLORS.white,
        color: "white",
        borderRadius: 10,
        paddingHorizontal: 1,
        borderColor: COLORS.transparentBlack7,
        justifyContent: "center",
        margin: 3,
        marginLeft: -14,
        marginRight: 14,
        marginTop: 3

    },
    minus_btn: {

        backgroundColor: COLORS.white,
        color: "white",
        borderRadius: 10,
        paddingHorizontal: 1,
        paddingRight: 5,
        borderColor: COLORS.transparentBlack7,
        justifyContent: "center",
        margin: 3,
        marginRight: 15,
        marginTop: 5,



    },
    plus_minus_text: {
        textAlign: "center",
        width: 50,
        paddingRight: 15,
        backgroundColor: COLORS.white,
        fontWeight: "bold",
        fontSize: 14,
        // marginHorizontal:-14,
        marginLeft: -9,
        color: COLORS.darkBlue
    },
    inputfromone: {
        width: '85%',
        borderWidth: 1,
        height: 20,
        // top:2,
        marginTop:4,
        padding: -15,
        textAlign: 'center',
        color: COLORS.black,
        // paddingLeft: 5,
        // marginBottom: 5,
        borderRadius: 5,
        marginLeft: 5,
        borderColor: COLORS.gray,
    },

})