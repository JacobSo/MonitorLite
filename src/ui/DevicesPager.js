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
import Hoshi from "react-native-textinput-effects/lib/Hoshi";
import Color from "../utils/Color"
import SnackBar from 'react-native-snackbar-dialog'
import Toolbar from "../component/Toolbar";
import RefreshEmptyView from "../component/RefreshEmptyView";
import * as ColorGroup from "../utils/ColorGroup";
import * as TextGroup from "../utils/TextGroup";

const {width, height} = Dimensions.get('window');
export default class DevicesPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            chaos: [],
            items: [],
            topItem: {},
            checkMap: [],
        };
    }

    componentDidMount() {
        // console.log(this.props.nav.state.params.data);
        this.state.items = this.props.nav.state.params.data;
        this.state.chaos = JSON.parse(JSON.stringify(this.props.nav.state.params.data));
        this.init(true);
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
         console.log(this.state.topItem);*/
        console.log('init:' + this.state.checkMap)

    }

    show(data) {
        this.state.items[data.key - 1]['isShow'] = !data.isShow;
        this.state.items[data.key - 1]['data'] = (data.isShow ? this.state.chaos[data.key - 1].items : []);
        this.state.checkMap[data.key - 1] = !this.state.checkMap[data.key - 1]
        this.setState({});

        console.log('show:' + this.state.checkMap)
        console.log('show:' + this.state.items[data.key - 1]['isShow'])
    }


    feed() {
        this.setState({isLoading: true});
        ApiService.getLive()
            .then((responseJson) => {
                this.setState({isLoading: false})
                if (responseJson.Code === 0 || responseJson.Code === '0') {
                    this.state.items = responseJson.info;
                    this.state.chaos = JSON.parse(JSON.stringify(responseJson.info));
                    this.init(false);
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
        }}>
            <View style={{padding: 16, width: width - 32, flexDirection: 'row', justifyContent: 'space-between',}}>
                <Text style={{fontSize: 18, color: 'black'}}>{this.state.topItem.name}</Text>
                <Text style={{
                    backgroundColor: ColorGroup.stateColor[this.state.topItem.state],
                    color: 'white',
                    borderRadius: 10,
                    padding: 5
                }}>{TextGroup.stateText[this.state.topItem.state]}</Text>
            </View>
            <View style={{flexDirection:'row-reverse',width:width-32,}}>
                <Text style={{padding:16,color:Color.colorBlue}}>发送命令</Text>
                <Text style={{padding:16}}>实时警报</Text>
                <Text style={{padding:16}}>查询警报</Text>
            </View>

        </View>
    }

    parent(parent) {
        // console.log(parent)
        return <TouchableOpacity
            onPress={() => {
                this.show(parent.section)
            }}>
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
        </TouchableOpacity>
    }

    child(child) {
        return <TouchableOpacity
            style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center'}}
            onPress={
                () => {

                }
            }>
            <View style={{
                width: 15,
                height: 15,
                borderRadius: 10,
                elevation: 5,
                marginLeft: 32,
                backgroundColor: ColorGroup.stateColor[child.item.state]
            }}/>
            <Text style={{
                color: Color.content,
                padding: 16,
                marginLeft: 16
            }}>{child.item.name}</Text>
            <Text>{child.item.type ? TextGroup.typeText[child.item.type] : ''}</Text>

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
