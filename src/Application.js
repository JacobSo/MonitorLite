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

                });
            }).then(callback).catch((err) => {
                console.log(err);
            }).done();
        });
    }

    static saveAccount(user, pwd, platformId,baseUrl) {
        this.user = user;
        this.pwd = pwd;
        this.platformId = platformId;
        this.baseUrl = baseUrl;

        AsyncStorage.multiSet(
            [
                ['user', user + ""],
                ['pwd', pwd + ""],
                ['platformId', platformId + ""],
                ['baseUrl', baseUrl + ""],
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