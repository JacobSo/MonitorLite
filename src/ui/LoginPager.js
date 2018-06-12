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
import {NavigationActions, StackActions} from 'react-navigation';
import ApiService from "../api/ApiService";
import Loading from 'react-native-loading-spinner-overlay';
import Hoshi from "react-native-textinput-effects/lib/Hoshi";
import Color from "../utils/Color"
import SnackBar from 'react-native-snackbar-dialog'
import App from '../Application';
import moment from "moment";

const {width, height} = Dimensions.get('window');
export default class LoginPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isWelcome: true,
            isLoading: false,
            baseUrl: '123.207.15.167',//'123.207.15.167',
            platformId: '1001',//1001
            user: 'admin',
            pwd: 'admin',
        };
    }

    componentDidMount() {
        setTimeout(
            () => {
                this.setState({isWelcome: false})
            },
            2000
        );
        App.initAccount(() => {
            this.setState({
                baseUrl: App.baseUrl,
                platformId: App.platformId,
                user: App.user
            })
        })
    }

    login() {
        if (this.state.baseUrl === 0 || this.state.user.length === 0 || this.state.pwd.length === 0 || this.state.platformId.length === 0) {
            SnackBar.show("信息不能为空");
            return
        }
        this.setState({isLoading: true});
        ApiService.login(this.state.baseUrl, this.state.user, this.state.pwd, this.state.platformId)
            .then((responseJson) => {
                this.setState({isLoading: false})
                if (responseJson.Code === 0 || responseJson.Code === "0") {
                    App.saveAccount(
                        this.state.user,
                        this.state.pwd,
                        this.state.platformId,
                        this.state.baseUrl,
                        responseJson.Right,
                        responseJson.set,
                        responseJson.noset,
                        responseJson.reset,
                    );
                    App.loginTime =moment().format('YYYYMMDDHHmmss')
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({
                                routeName: 'main', params: {
                                    data: responseJson.dev,
                                    isShowLogo: responseJson.Showlogo === 1
                                }
                            })
                        ],


                    });
                    this.props.nav.dispatch(resetAction)
                    //   this.props.nav.navigate('main')
                } else {
                    SnackBar.show(responseJson.Msg);
                }
            }).catch((error) => {
            this.setState({isLoading: false})
            console.log(error)
            SnackBar.show("服务异常");
        }).done()
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={55}>
                {
                    (() => {
                        if (this.state.isWelcome) {
                            return <Image source={require('../drawable/welcome.jpg')}
                                          style={{width: width, height: height}}/>
                        } else {
                            return null
                        }
                    })()
                }
                <ScrollView>
                    <View style={styles.container}>
                        <Image style={{borderRadius: 100, width: 100, height: 100, margin: 32}}
                               source={require('../drawable/ic_launcher.png')}/>
                        <Text style={{fontSize: 25, fontWeight: 'bold', color: Color.colorBlue}}>周界管理系统</Text>
                        <Hoshi
                            style={{width: width - 64, marginTop: 16}}
                            label={'服务器'}
                            value={this.state.baseUrl}
                            borderColor={Color.colorBlue}
                            onChangeText={(text) => this.setState({baseUrl: text})}
                        />
                        <Hoshi
                            style={{width: width - 64, marginTop: 16}}
                            label={'用户名'}
                            value={this.state.user}
                            borderColor={Color.colorBlue}
                            onChangeText={(text) => this.setState({user: text})}
                        />
                        <Hoshi
                            style={{width: width - 64, marginTop: 16}}
                            label={'密码'}
                            value={this.state.pwd}
                            secureTextEntry={true}
                            borderColor={Color.colorBlue}
                            onChangeText={(text) => this.setState({pwd: text})}
                        />
                        <Hoshi
                            style={{width: width - 64, marginTop: 16}}
                            label={'服务编号'}
                            value={this.state.platformId}
                            borderColor={Color.colorBlue}
                            onChangeText={(text) => this.setState({platformId: text})}
                        />
                        <TouchableOpacity
                            style={[styles.button, {backgroundColor: Color.colorBlue,}]}
                            onPress={() => this.login()}>
                            <Text style={{color: 'white'}}>登录</Text>
                        </TouchableOpacity>
                        <Loading visible={this.state.isLoading}/>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        height: height
    },
    button: {
        width: width - 32,
        height: 55,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 2

    },
});
