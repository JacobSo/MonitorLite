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
    View, TouchableOpacity, KeyboardAvoidingView, ScrollView, FlatList, RefreshControl, TextInput
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
import DialogAndroid from 'react-native-dialogs';
import RefreshEmptyView from "../component/RefreshEmptyView";
import * as TextGroup from "../utils/TextGroup";
import DatePicker from '../component/DatePicker';
import moment from "moment";

const {width, height} = Dimensions.get('window');
export default class AlarmPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            items: this.props.data,
            limitDate: 0,
            isSearch: false,
            beginTime: this.getNowFormatDate(),
            endTime: this.getNowFormatDate(),
            userText: '',
            alarmType: 255,
            alarmTypeText: '全部',
            areaId: 0,
            areaText: this.props.initData.name,
            alarmId: 0,
            alarmText: '全部',
            pageIndex: 0,
            isToadyData: true,
            monthDate:moment().format('MMDD')
        };
    }

    componentDidMount() {
        console.log(App.loginTime)
        console.log(App.loginTime.substring(4,8)+"="+this.state.monthDate)
        this.feed(false)
        this.interval = setInterval(() => {
            console.log('alarm feed')
            if (this.state.isToadyData&&App.isNotify){
                this.feed(false);
                App.isNotify = false;
            }
        }, 1000 * 3);
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    getNowFormatDate() {
        let date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    feed(isLoad) {
        if (!isLoad)
            this.state.pageIndex = 0;

        if (this.state.beginTime === 0) {
            this.state.beginTime = this.getNowFormatDate();
        }
        if (this.state.endTime === 0) {
            this.state.endTime = this.getNowFormatDate();
        }

        this.setState({isRefreshing: true});
        console.log(App.loginTime)
        console.log(this.state.isToadyData)
        ApiService.findAlarm(
            this.state.userText,
            this.state.isToadyData ? (App.loginTime.substring(4,8)===this.state.monthDate?
                App.loginTime:(this.getNowFormatDate().replace(/-/g, '') + '000001')): (this.state.beginTime.replace(/-/g, '') + '000001'),
            this.state.isToadyData ?this.getNowFormatDate().replace(/-/g, '') + '235959':this.state.endTime.replace(/-/g, '') + '235959',
            this.state.areaId,
            this.state.alarmId,
            this.state.alarmType,
            this.state.pageIndex)
            .then((responseJson) => {
                this.setState({isRefreshing: false})
                if (responseJson.Code === 0 || responseJson.Code === "0") {
                    if (responseJson.info.length === 0)
                        SnackBar.show('没有报警信息')

                    if (isLoad) {
                        this.setState({
                            items: this.state.items.concat(responseJson.info),
                            pageIndex: responseJson.LastId
                        })
                    } else {
                        this.setState({
                            items:responseJson.info,
                            pageIndex: responseJson.LastId
                        })
                    }


                } else {
                    SnackBar.show(responseJson.Msg);
                }
            }).catch((error) => {
            this.setState({isRefreshing: false})
            console.log(error)
        }).done()
    }


    dialog() {
        let dialog = new DialogAndroid();
        dialog.set({
            title: '警报类型',
            items: TextGroup.stateSelectText,
            positiveText: '取消',
            positiveColor: Color.colorBlue,
            itemsCallback: (index, name) => {
                this.setState({
                    alarmType: (index === 5 ? 255 : index),
                    alarmTypeText: name
                })
            }
        });
        dialog.show();
    }

    searchView() {
        return <View style={{backgroundColor: 'white', elevation: 5, paddingBottom: 55}}>
            <View style={styles.itemStyle}>
                <DatePicker
                    customStyles={ {
                        placeholderText: {
                            color: 'black',
                            textAlign: 'right'
                        },
                        dateText: {color: 'black', textAlign: 'right'},
                    }}
                    date={this.state.beginTime}
                    mode="date"
                    placeholder="选择"
                    format="YYYY-MM-DD"
                    confirmBtnText="确认"
                    cancelBtnText="取消"
                    showIcon={true}
                    onDateChange={(date) => {
                        this.setState({beginTime: date});
                    }}
                />
                <Text style={{position: 'absolute', left: 16, color: 'black'}}>开始时间</Text>

            </View>
            <View style={styles.itemStyle}>
                <DatePicker
                    customStyles={ {
                        placeholderText: {
                            color: 'black',
                            textAlign: 'right'
                        },
                        dateText: {color: 'black', textAlign: 'right'},
                    }}
                    date={this.state.endTime}
                    mode="date"
                    placeholder="选择"
                    format="YYYY-MM-DD"
                    confirmBtnText="确认"
                    cancelBtnText="取消"
                    showIcon={true}
                    onDateChange={(date) => {
                        this.setState({endTime: date});
                    }}
                />
                <Text style={{position: 'absolute', left: 16, color: 'black'}}>结束时间</Text>

            </View>
            <View style={styles.itemStyle}>
                <Text style={{marginLeft: 16}}>操作人</Text>
                <TextInput style={styles.textInput}
                           placeholder="填写"
                           returnKeyType={'done'}
                           keyboardType={'numeric'}
                           blurOnSubmit={true}
                           underlineColorAndroid="transparent"
                           onChangeText={(text) => this.setState({userText: text})}/>
            </View>
            <TouchableOpacity style={styles.itemStyle}
                              onPress={() => {
                                  this.dialog()
                              }
                              }>
                <Text style={{marginLeft: 16}}>警报类型</Text>
                <Text style={{marginRight: 16, color: 'black'}}>{this.state.alarmTypeText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemStyle}
                              onPress={() => {
                                  this.props.nav.navigate('select', {
                                      finishFunc: (areaId, alarmId, areaName, alarmName) => {
                                          this.setState({
                                              areaId: areaId,
                                              alarmId: alarmId,
                                              areaText: areaName,
                                              alarmText: alarmName
                                          })
                                      }
                                  })
                              }
                              }>
                <Text style={{marginLeft: 16}}>地点</Text>
                <Text style={{marginRight: 16}}>{'【' + this.state.areaText + '】【' + this.state.alarmText + '】'}</Text>
            </TouchableOpacity>
            <View style={{position: 'absolute', right: 0, bottom: 0, flexDirection: 'row'}}>
                <TouchableOpacity onPress={  () => {
                    this.setState({isSearch: !this.state.isSearch})
                }}>
                    <Text style={{padding: 16}}>收起</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.state.isToadyData = false
                    this.setState({
                        isSearch: false,
                    });
                    this.feed(false);
                }
                }>
                    <Text style={{color: Color.colorBlue, padding: 16}}>查询警报</Text>
                </TouchableOpacity>
            </View>
        </View>

    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={5}
                    title={[this.state.isToadyData?"报警信息":'搜索报警']}
                    color={Color.colorBlue}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../drawable/search.png")]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => {
                            this.setState({isSearch: !this.state.isSearch})
                        }
                    ]}/>
                {
                    (() => {
                        if (this.state.isSearch) {
                            return this.searchView()
                        }
                    })()
                }
                {
                    (() => {
                        if (this.state.items.length === 0) {
                            return <RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                                this.setState({items: this.props.requestFunc()})
                            }}/>
                        } else return <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={() => {
                                        this.state.isToadyData = true;
                                        this.feed(false)
                                    }}
                                    tintColor={Color.colorBlueGrey}//ios
                                    title="刷新中..."//ios
                                    titleColor='white'
                                    colors={[Color.colorBlue]}
                                    progressBackgroundColor="white"
                                />}
                            horizontal={false}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.items}
                            extraData={this.state}
                            ListHeaderComponent={<View/>}
                            ListFooterComponent={
                                <TouchableOpacity
                                    style={{
                                        height: 45,
                                        borderRadius: 10,
                                        backgroundColor: 'white',
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 16,
                                        marginRight: 16,
                                        marginTop: 16,
                                        marginBottom: 55,
                                    }}
                                    onPress={() => this.feed(true)}>
                                    <Text>加载更多</Text>
                                </TouchableOpacity>}
                            renderItem={({item, index}) => <TouchableOpacity
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    elevation: 5,
                                    margin: 16,
                                    width: width - 32
                                }}
                                onPress={() => {
                                    console.log(ApiService.getPic(item.areaid, item.alarmid, item.id))
                                    this.props.nav.navigate('web', {
                                        title: '报警详细',
                                        newsUrl: ApiService.getPic(item.areaid, item.alarmid, item.id)
                                    })
                                }
                                }>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    margin: 16,
                                    alignItems: 'center'
                                }}>
                                    <Text style={{color: 'black', fontSize: 18}}>{TextGroup.alarmText[item.type]}</Text>
                                    <View
                                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text >{item.user}</Text>
                                        <Text style={{marginLeft: 10,}}>{item.time}</Text>
                                    </View>
                                </View>
                                <Text style={{marginLeft: 10}}>{'警报详情：' + item.alarminfo}</Text>
                                <Text style={{
                                    marginLeft: 10,
                                    marginBottom: 10
                                }}>{'来自：【' + item.area + '】【' + item.alarmname + '】'}</Text>

                            </TouchableOpacity>
                            }
                        />

                    })()
                }
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },
    itemStyle: {
        margin: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        height: 45,
        borderColor: Color.line,
    },

    textInput: {
        width: width / 2,
        marginRight: 10,
        textAlign: 'right',
    },
});
