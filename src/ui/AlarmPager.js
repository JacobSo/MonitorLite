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
    View, TouchableOpacity, KeyboardAvoidingView, ScrollView, FlatList, RefreshControl
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
import RefreshEmptyView from "../component/RefreshEmptyView";

const {width, height} = Dimensions.get('window');
export default class AlarmPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            items:this.props.data
        };
    }

    componentDidMount() {
    }

    feed() {
        this.setState({isRefreshing: true});
        ApiService.getNotice(0)
            .then((responseJson) => {
                this.setState({isRefreshing: false})
                if (responseJson.Code === 0 || responseJson.Code === "0") {
                    this.setState({items: responseJson.data})
                } else {
                    SnackBar.show(responseJson.Msg);
                }
            }).catch((error) => {
            this.setState({isRefreshing: false})
            console.log(error)
        }).done()
    }
    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={5}
                    title={["实时警报"]}
                    color={Color.colorBlue}
                    isHomeUp={false}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../drawable/search.png")]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        ()=>{

                        }
                    ]}/>
                {
                    (() => {
                        if (this.state.items.length === 0) {
                            return <RefreshEmptyView isRefreshing={this.state.isRefreshing}/>
                        } else return <FlatList
                            horizontal={false}
                            numColumns={2}
                            keyExtractor={(item, index) => item.id}
                            data={this.state.items}
                            extraData={this.state}
                            ListHeaderComponent={<View/>}
                            renderItem={({item, index}) => <TouchableOpacity
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    elevation: 5,
                                    margin: 16,
                                    width: width - 32
                                }}
                                onPress={() => {
                                    this.props.nav.navigate('web',{
                                        title:item.title,
                                        newsUrl:item.url
                                    })
                                }
                                }>
                                <View style={{flexDirection: 'row',justifyContent:'space-between',margin:16}}>
                                    <Text style={{ color: 'black', fontSize: 18}}>{item.title}</Text>

                                    <Text style={{borderRadius:10,backgroundColor:Color.colorRed,color:'white',padding:5}}>{'新消息'}</Text>
                                </View>
                                <Text style={{marginLeft: 10}}>{'来自：' + item.subid}</Text>

                                <Text style={{margin: 10}}>{item.time}</Text>
                            </TouchableOpacity>
                            }
                        />

                      /*  {
                            "level":2,     //报警等级
                            "type":23,           //类型

                            "alarmname":"Zone2",    //防区名称
                            "area":"Partition1"    //分区名称
                            "alarminfo":"0.1kV 0.2kV 30mA 40mA",  //详情

                            "user":"admin",   //操作用户
                            "time":"2018-05-12 12:59:01",   //触发时间
                        }*/
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

});
