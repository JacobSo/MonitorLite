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
    View, TouchableOpacity, KeyboardAvoidingView, ScrollView, RefreshControl, FlatList, SectionList
} from 'react-native';
import ApiService from "../api/ApiService";
import Loading from 'react-native-loading-spinner-overlay';
import App from "../Application";
import Color from "../utils/Color"
import SnackBar from 'react-native-snackbar-dialog'
import Toolbar from "../component/Toolbar";
import RefreshEmptyView from "../component/RefreshEmptyView";
import * as ColorGroup from "../utils/ColorGroup";
import * as TextGroup from "../utils/TextGroup";

import DialogAndroid from 'react-native-dialogs';
import {alarmText} from "../utils/TextGroup";

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

        };
    }

    componentDidMount() {
        // console.log(this.props.nav.state.params.data);
        this.state.items = this.props.nav.state.params.data;
        this.state.chaos = JSON.parse(JSON.stringify(this.props.nav.state.params.data));
        this.init(true);
        this.feed();
        this.interval = setInterval(() => {
            this.feed()
        }, 1000 * 15);
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    init(isFirst) {
        let topIndex = 0;
        this.state.items.map((data, i) => {
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
        this.setState({})
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
        //   console.log(data)
        let rightGroup = []
        if (App.noset === 1)
            rightGroup.push('撤防')
        if (App.set === 1)
            rightGroup.push('布防')
        if (data.section && data.item) {
            if (data.item.type === 1 || data.item.type === 2) {
                rightGroup.push('高压布防')
                rightGroup.push('低压布防')
            } else if (data.item.type === 3) {
                rightGroup.push('张力高压布防')
                rightGroup.push('张力布防')
            }
        } else {
            if (data.section) {
                if (data.section.type === 1) {
                    rightGroup.push('高压布防')
                    rightGroup.push('低压布防')
                } else if (data.section.type === 3) {
                    rightGroup.push('张力高压布防')
                    rightGroup.push('张力布防')
                }
            } else {
                if (data.type === 1) {
                    rightGroup.push('高压布防')
                    rightGroup.push('低压布防')
                } else if (data.type === 3) {
                    rightGroup.push('张力高压布防')
                    rightGroup.push('张力布防')
                }
            }

        }
        if (App.reset === 1)
            rightGroup.push('复位')


        let dialog = new DialogAndroid();
        dialog.set({
            title: '发送命令',
            content: !data.item ? ('向【' + (data.section ? data.section.name : data.name) + '】发送指令') :
                ('向【' + data.section.name + '】下的【' + data.item.name + '】发送指令'),
            items: rightGroup,
            positiveText: '取消',
            positiveColor: Color.colorBlue,
            itemsCallback: (index, name) => {
                this.command(data, index)
            }
        });
        dialog.show();
    }

    notification(num) {
        PushNotification.localNotification({
            message: "周界平台收到" + num + "条报警信息", // (required)
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
                    if (responseJson.alarm && responseJson.alarm.length !== 0) {
                        this.notification(responseJson.alarm.length);
                    }
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
            justifyContent: 'space-between',
            width: width - 32,
        }}>
            <View style={{
                flexDirection: 'row', height: 55, alignItems: 'center', justifyContent: 'center'
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
            <View style={{flexDirection: 'row'}}>
                <Text>分区总数：</Text>
                <Text>10</Text>
                <Text>防区总数：</Text>
                <Text>10</Text>
            </View>
            <TouchableOpacity onPress={() => {
                this.dialog(this.state.topItem)
            }} style={{height: 55, justifyContent: 'center',}}>
                <Text style={{color: Color.colorBlue, padding: 16}}>指令</Text>
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
            height: 55,
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
        style={{position: 'absolute', right: 0, height: 55, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
            this.dialog(parent)
        }
        }>
        <Text style={{color: Color.colorBlue, padding: 16}}>指令</Text>
        </TouchableOpacity>
        </TouchableOpacity>
    }

    child(child) {
        //  console.log(child)
        return <TouchableOpacity
        style={{backgroundColor: 'white',}}
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
