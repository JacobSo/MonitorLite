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
export default class SelectPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            chaos: [],
        };
    }

    componentDidMount() {
        this.feed()
    }

    componentWillUnmount() {

    }


    show(data) {
        this.state.items[data.key]['isShow'] = !data.isShow;
        this.state.items[data.key]['data'] = (data.isShow ? this.state.chaos[data.key].items : []);
        this.setState({});
    }

    init() {
        console.log(this.state.items)

        this.state.items.map((data, i) => {
            this.state.items[i]['data'] = [];//
            this.state.items[i]['isShow'] = false;
            this.state.items[i]['key'] = i;
            delete this.state.items[i]['items'];

        });
        this.setState({})
        console.log(this.state.items)

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
                   this.props.finishFunc(parent.section.id,0,parent.section.name,'全部');
                   this.props.nav.goBack(null)
                }
                }>
                <Text style={{color: Color.colorBlue, padding: 16}}>选择</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    }

    child(child) {
          console.log(child)
        return <TouchableOpacity
            style={{backgroundColor: 'white',}}
            onPress={
                () => {
                    this.props.finishFunc(child.section.id,child.item.id,child.section.name,child.item.name);
                    this.props.nav.goBack(null)
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
                <Toolbar
                    elevation={5}
                    title={["选择设备"]}
                    color={Color.colorBlue}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },

                    ]}/>
                {
                    (() => {
                        if (this.state.items.length === 0) {
                            return null
                        } else {
                            return <SectionList
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
                                ListFooterComponent={() => <View style={{height: 55}}/>}
                                keyExtractor={(item) => item.id}
                                renderSectionHeader={(parent) => this.parent(parent)}
                                renderItem={(child) => this.child(child) }
                                sections={this.state.items}
                            />
                        }
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
