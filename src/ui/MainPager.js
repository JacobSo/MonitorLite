/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Image,
    Dimensions,
    StyleSheet,
    Text,
    View, TouchableOpacity, KeyboardAvoidingView, ScrollView
} from 'react-native';
import ApiService from "../api/ApiService";
import Loading from 'react-native-loading-spinner-overlay';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import Color from "../utils/Color"
import SnackBar from 'react-native-snackbar-dialog'
import Toolbar from "../component/Toolbar";
import DevicesPager from "./DevicesPager";
import NotificationPager from "./NotifactionPager";
import App from '../Application'
import LoginPager from "./LoginPager";
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

const {width, height} = Dimensions.get('window');
const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});
export default class MainPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            baseUrl: '123.207.15.167',
            platformId: '1001',
            user: 'admin',
            pwd: 'admin',
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={0}
                    title={["  周界系统"]}
                    color={Color.colorBlue}
                    isHomeUp={false}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../drawable/setting.png")]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        ()=>{
                        }
                    ]}/>
                <ScrollableTabView
                    initialPage={0}
                    tabBarBackgroundColor={Color.colorBlue}
                    tabBarActiveTextColor='white'
                    locked={false}
                    tabBarInactiveTextColor={Color.background}
                    tabBarUnderlineStyle={{backgroundColor: 'white',}}>

                    <DevicesPager tabLabel='设备' nav={this.props.nav}/>
                    <NotificationPager tabLabel='通知'  nav={this.props.nav}/>
                </ScrollableTabView>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },

});
