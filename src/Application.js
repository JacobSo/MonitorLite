/**
 * Created by Administrator on 2017/3/16.
 */

import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';

export  default  class Application extends Component {
    static user = '';//
    static pwd = '';//
    static platformId = '';//
    static baseUrl = '';//
    static level = '';//
    static set = '';//
    static noset = '';//
    static reset = '';//

    /*

     static saveSingleToken(value) {
     console.log("save:")
     this.token = value
     return AsyncStorage.setItem("token", JSON.stringify(value));
     }
     */

    static getSingle(key) {
        return AsyncStorage.getItem(key).then((value) => {
            const jsonValue = JSON.parse(value);
            console.log("value:" + jsonValue);
            return jsonValue;
        });
    }

    static initAccount(callback) {
        AsyncStorage.getAllKeys((err, keys) => {
            console.log(keys)
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    let key = store[i][0];
                    let value = store[i][1];
                    console.log("-**--" + key + "-**--" + value);

                    if (key === "user") this.user = value;
                    if (key === "pwd") this.pwd = value;
                    if (key === "platformId") this.platformId = value;
                    if (key === "baseUrl") this.baseUrl = value;
                    if (key === "level") this.level = value;
                    if (key === "set") this.set = value;
                    if (key === "noset") this.noset = value;
                    if (key === "reset") this.reset = value;

                });
            }).then(callback).catch((err) => {
                console.log(err);
            }).done();
        });
    }

    static saveAccount(user, pwd, platformId,baseUrl,level,right1,right2,right3) {
        this.user = user;
        this.pwd = pwd;
        this.platformId = platformId;
        this.baseUrl = baseUrl;
        this.level = level;
        this.set = right1;
        this.noset = right2;
        this.reset = right3;

        AsyncStorage.multiSet(
            [
                ['user', user + ""],
                ['pwd', pwd + ""],
                ['platformId', platformId + ""],
                ['baseUrl', baseUrl + ""],
                ['level', level + ""],
                ['set', right1 + ""],
                ['noset', right2 + ""],
                ['reset', right3 + ""],
            ])
            .then((err) => {
                    console.log(err);
                    console.log("save success!");
                },
            ).catch(() => {
            console.log("save failed!");
        });
    }
}