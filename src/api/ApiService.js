/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import App from '../Application';

let BASE_URL = 'http://123.207.15.167:9983/';

let newFetch = function (input, opts) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, opts.timeout);
        fetch(input, opts).then(resolve, reject);
    });
};
export  default  class ApiService {
    static postRequest(method, param) {
        let temp = BASE_URL + method;
        console.log('method:' + temp + '\nparam:' + param);

        return newFetch(temp, {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: param,
            timeout: 60000
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                return responseJson;
            })
    }

    static getRequest(method, param) {
        let temp = BASE_URL + method;
        console.log('method:' + temp + '\nparam:' + param);

        return newFetch(temp, {
            method: 'GET',
            timeout: 60000,
            //   body: param
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                return responseJson;
            })
    }


    static login(user, pwd, subId) {
        let method = 'login?user=' + user + '&pwd=' + pwd + '&subid=' + subId
        return this.getRequest(method, null);
    }

    static getNotice(id, subId) {
        let method = 'getnotice?id=' + id + '&subid=' + subId
        return this.getRequest(method, null);
    }

    static getLive(subId) {
        let method = 'getlive?subid=' + subId
        return this.getRequest(method, null);
    }

    static findAlarm(user, subId, start, end, areaId, alarmId, type, startId, max) {
        let method = 'login?user=' + user +
            '&subid=' + subId +
            '&start=' + start +
            '&end=' + end +
            '&areaId=' + areaId +
            '&alarmId=' + alarmId +
            '&type=' + type +
            '&startid=' + startId +
            '&max=' + max
        return this.getRequest(method, null);
    }

    static sendCmd(user, subId, areaId, alarmId, action) {
        let method = 'login?user=' + user + '&subid=' + subId + '&areaid=' + areaId + '&alarmid=' + alarmId + '&action=' + action
        return this.getRequest(method, null);
    }

    static getPic(subId, areaId, alarmId, id, ip) {
        let method = 'getpic?subid=' + subId + subId + '&areaid=' + areaId + '&alarmid=' + alarmId + '&id=' + id + '&ip=' + ip
        return this.getRequest(method, null);
    }

}