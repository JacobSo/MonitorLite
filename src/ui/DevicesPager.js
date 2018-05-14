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
        };
    }

    componentDidMount() {
        // console.log(this.props.nav.state.params.data);
        this.state.items = this.props.nav.state.params.data;
        this.state.chaos = JSON.parse(JSON.stringify(this.props.nav.state.params.data));
        this.init();
        this.interval = setInterval(() => {
            console.log('123');
            this.feed()
        }, 1000*15);

    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    init() {
        let topIndex = 0;
        this.state.items.map((data, i) => {
            if (data.id === 0) {
                this.state.topItem = data;
                topIndex = i;
            } else {
                this.state.items[i]['data'] = data.items;
                this.state.items[i]['key'] = i;
                this.state.items[i]['isShow'] = 'off';
                delete this.state.items[i]['items'];
            }
        });
        this.state.items.splice(topIndex, 1);
        this.state.chaos.splice(topIndex, 1);
        this.setState({})
        /*        console.log(this.state.chaos);
         console.log(this.state.items);
         console.log(this.state.topItem);*/
    }

    show(data) {
        //  console.log(data)
        if (data.isShow === 'off') {
            this.state.items[data.key - 1]['data'] = this.state.chaos[data.key - 1].items;
            this.state.items[data.key - 1]['isShow'] = 'on';
            this.setState({});
        } else {
            this.state.items[data.key - 1]['data'] = [];
            this.state.items[data.key - 1]['isShow'] = 'off';
            this.setState({});
        }

    }


    feed() {
        this.setState({isLoading: true});
        ApiService.getLive()
            .then((responseJson) => {
                this.setState({isLoading: false})
                if (responseJson.Code === 0 || responseJson.Code === '0') {
                    this.state.items = responseJson.info;
                    this.state.chaos = JSON.parse(JSON.stringify(responseJson.info));
                    this.init();
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
            width: width - 32,
            margin: 16,
            padding: 16,
            elevation: 5,
            backgroundColor: 'white',
            flexDirection: 'row',
            borderRadius: 10,
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Text style={{fontSize: 18, color: 'black'}}>{this.state.topItem.name}</Text>
            <Text style={{
                backgroundColor: ColorGroup.stateColor[this.state.topItem.state],
                color: 'white',
                borderRadius: 10,
                padding: 5
            }}>{TextGroup.stateText[this.state.topItem.state]}</Text>
        </View>
    }

    parent(parent) {
        console.log(parent)
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
                    color: Color.colorBlue,
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
