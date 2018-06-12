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
    View, TouchableOpacity, DeviceEventEmitter, ScrollView, RefreshControl, FlatList, SectionList
} from 'react-native';
import ApiService from "../api/ApiService";
import Loading from 'react-native-loading-spinner-overlay';
import App from "../Application";
import Color from "../utils/Color"
import SnackBar from 'react-native-snackbar-dialog'
import RefreshEmptyView from "../component/RefreshEmptyView";
import * as ColorGroup from "../utils/ColorGroup";
import AndroidModule from '../native/AndoridCommontModule'

const PushNotification = require('react-native-push-notification');
const {width, height} = Dimensions.get('window');

export default class DevicesPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            chaos: [],
            items: [],
            topItem: {},
            alarmItems: [],
            checkMap: [],
            totalCount: 0,
        };
    }

    componentDidMount() {
        //  console.log(this.props.nav)
        this.state.items = this.props.nav.state.params.data;
        this.state.chaos = JSON.parse(JSON.stringify(this.props.nav.state.params.data));
        this.init(true);
        this.feed();
        this.interval = setInterval(() => {
            this.feed()
        }, 1000 * 9);

    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    init(isFirst) {
        let topIndex = 0;
        let count = 0;
        this.state.items.map((data, i) => {
            console.log(data)
            count += data.items.length;
            if (data.id === 0) {
                this.state.topItem = data;
                topIndex = i;
            } else {
                if (isFirst) {
                    this.state.checkMap.push(false);
                }
                this.state.items[i]['data'] = this.state.checkMap[i - 1] ? data.items : [];//
                this.state.items[i]['isShow'] = this.state.checkMap[i - 1];
                this.state.items[i]['key'] = i;
                delete this.state.items[i]['items'];

            }
        });
        this.state.items.splice(topIndex, 1);
        this.state.chaos.splice(topIndex, 1);
        this.setState({totalCount: count});
        /*        console.log(this.state.chaos);
         console.log(this.state.items);
         */
        console.log(this.state.items[0].data);
        //  console.log('init:' + this.state.checkMap)

    }

    show(data) {
        this.state.items[data.key - 1]['isShow'] = !data.isShow;
        this.state.items[data.key - 1]['data'] = (data.isShow ? this.state.chaos[data.key - 1].items : []);
        this.state.checkMap[data.key - 1] = !this.state.checkMap[data.key - 1]
        this.setState({});

        //      console.log('show:' + this.state.checkMap)
        //   console.log('show:' + this.state.items[data.key - 1]['isShow'])
    }

    dialog(data) {
        if (App.noset === 0 && App.reset === 0 && App.set === 0) {
            SnackBar.show("没有权限")
            return
        }
        let nameColor = "";
        /*        Color.colorDeepPurple+','+
         Color.colorBlue+','+
         Color.colorRed+','+
         Color.colorLightGreen+','+
         Color.colorBrown+',';*/

        //   console.log(data)
        let rightGroup = ''
        if (App.noset === 1) {
            rightGroup += '撤防,';
            nameColor = nameColor + Color.colorDeepPurple + ','
        }

        if (App.set === 1) {
            rightGroup += '布防,';
            nameColor = nameColor + Color.colorBlue + ','
            if (data.section && data.item) {
                if (data.item.type === 1 || data.item.type === 2) {
                    rightGroup += '高压布防,';
                    rightGroup += '低压布防,';
                    nameColor = nameColor + Color.colorRed + ',' + Color.colorLightGreen + ','
                } else if (data.item.type === 3) {
                    rightGroup += '张力高压布防,';
                    rightGroup += '张力布防,';
                    nameColor = nameColor + Color.colorRed + ',' + Color.colorLightGreen + ','
                }
            } else {
                if (data.section) {
                    if (data.section.type === 1) {
                        rightGroup += '高压布防,';
                        rightGroup += '低压布防,';
                        nameColor = nameColor + Color.colorRed + ',' + Color.colorLightGreen + ','
                    } else if (data.section.type === 3) {
                        rightGroup += '张力高压布防,';
                        rightGroup += '张力布防,';
                        nameColor = nameColor + Color.colorRed + ',' + Color.colorLightGreen + ','
                    }
                } else {
                    if (data.type === 1) {
                        rightGroup += '高压布防,';
                        rightGroup += '低压布防,';
                        nameColor = nameColor + Color.colorRed + ',' + Color.colorLightGreen + ','
                    } else if (data.type === 3) {
                        rightGroup += '张力高压布防,';
                        rightGroup += '张力布防,';
                        nameColor = nameColor + Color.colorRed + ',' + Color.colorLightGreen + ','
                    }
                }
            }
        }


        if (App.reset === 1) {
            rightGroup += '复位';
            nameColor = nameColor + Color.colorBrown
        }

        AndroidModule.show(!data.item ? ('向【' + (data.section ? data.section.name : data.name) + '】发送指令') :
                ('向【' + data.section.name + '】下的【' + data.item.name + '】发送指令'), rightGroup, nameColor,
            (result) => {
                console.log();
                let temp = rightGroup.split(',')
                if (temp[result] === '撤防') {
                    this.command(data, 0)
                } else if (temp[result] === '布防') {
                    this.command(data, 1)
                } else if (temp[result] === '高压布防' || temp[result] === '张力高压布防') {
                    this.command(data, 2)
                } else if (temp[result] === '低压布防' || temp[result] === '张力布防') {
                    this.command(data, 3)
                } else if (temp[result] === '复位') {//
                    this.command(data, 4)
                }

            });
    }

    notification(num) {
        console.log("send notification")
        App.isNotify = true;
        PushNotification.cancelAllLocalNotifications()
        /*        PushNotification.configure({
         onNotification: function (notification) {
         console.log('NOTIFICATION:', notification);
         },
         popInitialNotification: true,
         requestPermissions: true,
         });*/
        PushNotification.localNotification({
            message: "收到" + num + "条报警信息", // (required)
            data: {
                nav: this.props.navigation
            }
        });
    }

    feed() {
        this.setState({isRefreshing: true});
        ApiService.getLive()
            .then((responseJson) => {
                this.setState({isRefreshing: false})
                if (responseJson.Code === 0 || responseJson.Code === '0') {
                    this.state.items = responseJson.info;
                    this.state.chaos = JSON.parse(JSON.stringify(responseJson.info));
                  /*  if (responseJson.alarm && responseJson.alarm.length !== 0) {
                        this.notification(responseJson.alarm.length);
                    }*/
                    this.state.alarmItems = this.state.alarmItems.concat(responseJson.alarm);
                    this.init(false);
                } else {
                    SnackBar.show(responseJson.Msg);
                }
            }).catch((error) => {
            this.setState({isRefreshing: false})
            console.log(error)
        }).done()
    }


    command(data, action) {
        this.setState({isLoading: true});
        ApiService.sendCmd(data.section ? data.section.id : 0, data.item ? data.item.id : 0, action)
            .then((responseJson) => {
                this.setState({isLoading: false})
                if (responseJson.Code === 0 || responseJson.Code === '0') {
                    SnackBar.show('操作成功')
                } else {
                    SnackBar.show(responseJson.Msg);
                }
            }).catch((error) => {
            this.setState({isLoading: false})
            console.log(error)
        }).done()
    }

    header() {
        return <View style={{
            margin: 16,
            elevation: 5,
            backgroundColor: 'white',
            borderRadius: 10,
            width: width - 32,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <View>
                <View style={{
                    flexDirection: 'row', height: 55, alignItems: 'center',
                }}>
                    <View style={{
                        width: 15,
                        height: 15,
                        borderRadius: 10,
                        elevation: 5,
                        margin: 16,
                        backgroundColor: ColorGroup.stateColor[this.state.topItem.state]
                    }}/>
                    <Text style={{fontSize: 18, color: 'black'}}>{this.state.topItem.name}</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 16, marginBottom: 16}}>
                    <Text style={{color: Color.colorBlue,}}>分区总数：</Text>
                    <Text style={{color: Color.colorBlue,}}>{this.state.items.length}</Text>
                    <Text style={{color: Color.colorBlue, marginLeft: 16}}>防区总数：</Text>
                    <Text style={{color: Color.colorBlue,}}>{this.state.totalCount}</Text>
                </View>

            </View>
            <TouchableOpacity onPress={() => {
                this.dialog(this.state.topItem)
            }} style={{
                justifyContent: 'center',
                backgroundColor: Color.colorCyan,
                margin: 16,
                borderRadius: 10,
                height: 35
            }}>
                <Text style={{color: 'white', padding: 10}}>指令</Text>
            </TouchableOpacity>
        </View>
    }

    parent(parent) {
        // console.log(parent)
        return <TouchableOpacity
            onPress={() => {
                this.show(parent.section)
            }}
        >
            <View>
                <View style={{backgroundColor: Color.line, height: 1, width: width}}/>
                <View style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{
                        width: 10,
                        height: 60,
                        elevation: 5,
                        backgroundColor: ColorGroup.stateColor[parent.section.state]
                    }}/>
                    <Text style={{
                        color: Color.content,
                        padding: 16,
                        fontSize: 15,
                        /*   borderTopWidth: 1,
                         borderTopColor: Color.line*/
                    }}>{parent.section.name}</Text>

                </View>
                <View style={{backgroundColor: Color.line, height: 1, width: width}}/>
            </View>
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Color.colorCyan,
                    margin: 16,
                    borderRadius: 10,
                    height: 35
                }}
                onPress={() => {
                    this.dialog(parent)
                }
                }>
                <Text style={{color: 'white', padding: 10}}>指令</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    }

    child(child) {
        console.log(child.index)
        //  console.log(child)
        return <TouchableOpacity
            style={{backgroundColor: child.index % 2 === 0 ? '#B3E5FC' : Color.background,}}
            onPress={
                () => {
                    this.dialog(child)
                }
            }>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    elevation: 5,
                    marginLeft: 16,
                    backgroundColor: ColorGroup.stateColor[child.item.state]
                }}/>
                <View style={{
                    padding: 16,
                    marginLeft: 16
                }}>
                    <Text style={{color: 'black', fontSize: 18, marginRight: 16}}>{child.item.name}</Text>
                    <Text>{child.item.memo}</Text>
                </View>
            </View>

        </TouchableOpacity>
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    (() => {
                        if (this.state.items.length === 0) {
                            return <RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                                this.feed()
                            } }/>
                        } else return <SectionList
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={() => this.feed()}
                                    tintColor={Color.colorBlueGrey}//ios
                                    title="刷新中..."//ios
                                    titleColor='white'
                                    colors={[Color.colorBlue]}
                                    progressBackgroundColor="white"
                                />}
                            ListHeaderComponent={() => this.header()}
                            ListFooterComponent={() => <View style={{height: 55}}/>}
                            keyExtractor={(item) => item.id}
                            renderSectionHeader={(parent) => this.parent(parent)}
                            renderItem={(child) => this.child(child) }
                            sections={this.state.items}
                        />

                    })()
                }
                <Loading visible={this.state.isLoading}/>
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
