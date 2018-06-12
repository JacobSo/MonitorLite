/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    BackHandler,
    StyleSheet,
    View
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Color from "../utils/Color"
import Toolbar from "../component/Toolbar";
import DevicesPager from "./DevicesPager";
import NotificationPager from "./NotifactionPager";
import JPushModule from 'jpush-react-native'
import App from '../Application';

export default class MainPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            baseUrl: '123.207.15.167',
            platformId: '1001',
            user: 'admin',
            pwd: 'admin',

            alarmItems: [],

        };
        this.jumpSecondActivity = this.jumpSecondActivity.bind(this)
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            return true;
        });
    }
    componentWillUnmount () {
        JPushModule.removeReceiveOpenNotificationListener('openNotification')
        JPushModule.clearAllNotifications()
    }
    componentDidMount() {
        JPushModule.initPush()
        JPushModule.setAlias(App.platformId, map => {
            if (map.errorCode === 0) {
                console.log('set alias succeed')
            } else {
                console.log('set alias failed, errorCode: ' + map.errorCode)
            }
        })
        JPushModule.notifyJSDidLoad((resultCode) => {
            if (resultCode === 0) {
                console.log("notifyJSDidLoad:success")
            }
        });
        JPushModule.addReceiveOpenNotificationListener(map => {
            console.log('Opening notification!')
            console.log('map.extra: ' + map.extras)
            this.jumpSecondActivity()
        })
    }

    jumpSecondActivity() {
        this.props.nav.navigate('alarm', {
            data: this.refs.devices.state.alarmItems,
            initData: this.refs.devices.state.topItem,
            requestFunc: () => {
                return this.refs.devices.state.alarmItems.reverse()
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={0}
                    title={this.props.isShowLogo ? ["周界管理系统", "周界管理系统"] : ["  周界管理系统"]}
                    color={Color.colorBlue}
                    isHomeUp={false}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../drawable/alarm.png")]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => {
                            console.log(this.refs.devices.state.chaos)
                            this.props.nav.navigate('alarm', {
                                data: this.refs.devices.state.alarmItems,
                                initData: this.refs.devices.state.topItem,
                                requestFunc: () => {
                                    return this.refs.devices.state.alarmItems.reverse()
                                }
                            })
                        }
                    ]}/>
                <ScrollableTabView
                    initialPage={0}
                    tabBarBackgroundColor={Color.colorBlue}
                    tabBarActiveTextColor='white'
                    locked={false}
                    tabBarInactiveTextColor={Color.background}
                    tabBarUnderlineStyle={{backgroundColor: 'white',}}>

                    <DevicesPager tabLabel='设备' nav={this.props.nav} ref="devices"/>
                    <NotificationPager tabLabel='通知' nav={this.props.nav}/>
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
