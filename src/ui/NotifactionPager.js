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
import Hoshi from "react-native-textinput-effects/lib/Hoshi";
import Color from "../utils/Color"
import SnackBar from 'react-native-snackbar-dialog'
import Toolbar from "../component/Toolbar";
import RefreshEmptyView from "../component/RefreshEmptyView";

const {width, height} = Dimensions.get('window');
export default class NotificationPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            items: []
        };
    }

    componentDidMount() {
             this.feed()

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
                {
                    (() => {
                        if (this.state.items.length === 0) {
                            return <RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                                this.feed()
                            } }/>
                        } else return <FlatList
                            horizontal={false}
                            numColumns={2}
                            keyExtractor={(item, index) => item.id}
                            data={this.state.items}
                            extraData={this.state}
                            ListHeaderComponent={<View/>}
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

                    })()
                }

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eeeeee',
        flex: 1
    },

});
