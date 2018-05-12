/**
 * Created by Administrator on 2017/11/27.
 */
/**
 * @flow
 */

import React from 'react';
import {StackNavigator,} from 'react-navigation';
import {Platform, Dimensions, View, StatusBar,Linking} from 'react-native';
import App from "../App";
import Color from "./utils/Color"
import Login from "./ui/Login";

const {width, height} = Dimensions.get('window');

_renderScreen = (pager) => {
    //  console.log("screen1");

    return (
        <View
            style={{
                width: width,
                height: height,
            }}>
            {pager}
        </View>
    )
};

_statusBar = (color, barSet) => {
    return (
        <View>
            { (() => {
                if (Platform.OS === 'ios')
                    return <View style={{width: width, height: 20, backgroundColor: color}}/>
            })()}
            <StatusBar
                backgroundColor={color}
                barStyle={barSet ? barSet : "dark-content"}
                networkActivityIndicatorVisible={true}
                hidden={false}/></View>)
};


const LauncherScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<Login {...navigation.state.params}
                                                                     nav={navigation}/></View>);


const RouterStack = StackNavigator({
        launcher: {
            screen: LauncherScreen,
            path:'launcher'
        },
    },
    {
        initialRouteName: 'launcher',
        headerMode: 'none',
    });
export default RouterStack;