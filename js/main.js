var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports", "./motion-sensors"], function (require, exports, motion_sensors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var watcherID = null;
    var divConsole = document.querySelector('#console');
    var newGemDot = document.querySelector('#newGemDot');
    var southGatDot = document.querySelector('#southGatDot');
    var map = document.querySelector('#map');
    var myDot = document.querySelector('#myDot');
    var rmRate = 1.1400682183346926;
    var lmRate = 1.0595483446253406;
    var baselat = newGemDot.getAttribute("data-lat");
    var baselot = newGemDot.getAttribute("data-lot");
    var basetop = 1915;
    var baseleft = 1656;
    var sgtop = 2215;
    var sgleft = 748;
    var sglat = southGatDot.getAttribute("data-lat");
    var sglot = southGatDot.getAttribute("data-lot");
    var latcha;
    var lotcha;
    var EARTH_RADIUS = 6378137;
    var myquaternion = [];
    var thisLeft = 0;
    var thisTop = 0;
    var divLog = console.log;
    var divError = console.error;
    var divWarn = console.warn;
    // 初始化方向传感器
    var OrientationSensoroptions = { frequency: 60, referenceFrame: 'device' };
    var sensor = new motion_sensors_1.AbsoluteOrientationSensor(OrientationSensoroptions);
    Promise.all([navigator.permissions.query({ name: "accelerometer" }),
        navigator.permissions.query({ name: "magnetometer" }),
        navigator.permissions.query({ name: "gyroscope" }),
        navigator.permissions.query({ name: "geolocation" })])
        .then(function (results) {
        if (results.every(function (result) { return result.state === "granted"; })) {
            sensor.start();
        }
        else {
            console.log("No permissions to use AbsoluteOrientationSensor.");
        }
    });
    sensor.addEventListener('reading', function () {
        // model is a Three.js object instantiated elsewhere.
        // model.quaternion.fromArray(sensor.quaternion).inverse();
        var q = sensor.quaternion;
        /*
        q[0] = w; q[1] = x; q[2] = y; q[3] = z;
        */
        // let Psi = Math.atan2(2*(q[0]*q[3]+q[1]*q[2]),1-2*(Math.pow(q[2],2)+Math.pow(q[3],2)));
        // let Theta = Math.asin(2*(q[0]*q[2]+q[3]*q[1]));
        var Phi = Number((Math.atan2(2 * (q[0] * q[1] + q[3] * q[2]), 1 - 2 * (Math.pow(q[1], 2) + Math.pow(q[2], 2)))).toFixed(5));
        // console.log(sensor.quaternion);
        var endPhi = Number((Phi * 180 / 3.14159).toFixed(5));
        map.style.transformOrigin = (thisLeft + 28) + "px " + (thisTop + 29.55) + "px";
        // map.style.transformOrigin = thisLeft+"px "+thisTop+"px";
        map.style.transform = "rotate(" + endPhi + "deg)";
        // console.log(endPhi);
    });
    sensor.addEventListener('error', function (error) {
        if (event.error.name == 'NotReadableError') {
            console.log("Sensor is not available.");
        }
    });
    sensor.start();
    console.log = function (message) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        divConsole.innerHTML += "[" + window.Date().slice(16, 24) + "] " + String(message + "</br>");
        divLog.call.apply(divLog, __spreadArrays([console, message], rest));
        if (divConsole.scrollBy !== undefined) {
            divConsole.scrollBy(0, 100);
        }
    };
    console.error = function (message) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        divConsole.innerHTML += "<em>[" + window.Date().slice(16, 24) + "] " + String(message + "</em></br>");
        divError.call.apply(divError, __spreadArrays([console, message], rest));
        if (divConsole.scrollBy !== undefined) {
            divConsole.scrollBy(0, 100);
        }
    };
    console.warn = function (message) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        divConsole.innerHTML += "[" + window.Date().slice(16, 24) + "] " + String(message + "</br>");
        divWarn.call.apply(divWarn, __spreadArrays([console, message], rest));
        if (divConsole.scrollBy !== undefined) {
            divConsole.scrollBy(0, 100);
        }
    };
    // console.log = (text,lineNumber="") => {
    //     divConsole.innerHTML += "["+window.Date().slice(16,24)+"] "+"[ line: "+lineNumber+" ]" + String(text +"</br>");
    //     if (divConsole.scrollBy !== undefined) {
    //       divConsole.scrollBy(0,100);
    //     }
    // };
    // divConsole.error = (text) => {
    //   divConsole.innerHTML += "<em>["+window.Date().slice(16,24)+"] "+ String(text+"</em></br>");
    //   if (divConsole.scrollBy !== undefined) {
    //     divConsole.scrollBy(0,100);
    //   }
    // };
    divConsole.tag = function (text) {
        divConsole.innerHTML += "<color-tag>[" + window.Date().slice(16, 24) + "] " + String(text + "</color-tag></br>");
        if (divConsole.scrollBy !== undefined) {
            divConsole.scrollBy(0, 100);
        }
    };
    if ("geolocation" in navigator) {
        console.log("support geolocation!", 9);
    }
    else {
        console.log("not support geolocation!", 11);
    }
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function success(pos) {
        var crd = pos.coords;
        console.log("");
        console.log('你的位置 :');
        console.log('纬度 : ' + crd.latitude);
        console.log('经度 : ' + crd.longitude);
        console.log('误差 : ±' + crd.accuracy + ' 米.');
    }
    function error(err) {
        console.log('ERROR(' + err.code + '): ' + err.message);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
    navigator.geolocation.watchPosition(function (pos) {
        var crd = pos.coords;
        console.log("");
        console.log('你的位置 :');
        console.log('纬度 : ' + crd.latitude);
        console.log('经度 : ' + crd.longitude);
        console.log('误差 : ±' + crd.accuracy + ' 米.');
        var laDistance = GetDistance(baselat, baselot, crd.latitude, baselot);
        var lnDistance = GetDistance(baselat, baselot, baselat, crd.longitude);
        // let laDistance = getLineDistance(baselat,baselot,crd.latitude,baselot);
        // let lnDistance = getLineDistance(baselat,baselot,baselat,crd.longitude);
        var lnDirection = Math.sign(Number((crd.longitude - baselot).toFixed(8)));
        var laDirection = Math.sign(Number((crd.latitude - baselat).toFixed(8)));
        thisLeft = basetop + (lnDistance * lnDirection * rmRate - 260);
        thisTop = baseleft - (laDistance * laDirection * rmRate - 250);
        myDot.style.left = thisLeft + "px";
        myDot.style.top = thisTop + "px";
    }, error, options);
    // startWatch();
    function stopWatch(id) {
        navigator.geolocation.clearWatch(id);
        watcherID = null;
    }
    function startWatch() {
        if (watcherID !== null) {
            console.log("已经在监控");
            return;
        }
        else {
            var id = navigator.geolocation.watchPosition(success, error, options);
            watcherID = id;
        }
    }
    function setTag() {
        var element = document.querySelector('#tagName');
        divConsole.tag(element.value);
    }
    function rad(d) {
        return d * Math.PI / 180.0;
    }
    function GetDistance(lat1, lng1, lat2, lng2) {
        var radLat1 = rad(lat1);
        var radLat2 = rad(lat2);
        var a = radLat1 - radLat2;
        var b = rad(lng1) - rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s;
    }
    function styleDistance(left1, top1, left2, top2) {
        return Math.sqrt(Math.pow((left1 - left2), 2) + Math.pow((top1 - top2), 2));
    }
    function getLineDistance(lat1, lng1, lat2, lng2) {
        radLat1 = rad(lat1);
        radLat2 = rad(lat2);
        radlng1 = rad(lng1);
        radlng2 = rad(lng2);
        a = radLat2 - radLat1;
        return Math.sqrt(2 * Math.pow(EARTH_RADIUS, 2) *
            (1 - Math.cos(radlng1) * Math.cos(radlng2) * Math.cos(a) - Math.sin(radlng1) * Math.sin(radlng2)));
    }
    function reTry(params) {
        navigator.geolocation.watchPosition(function (pos) {
            var crd = pos.coords;
            var laDistance = GetDistance(baselat, baselot, crd.latitude, baselot);
            var lnDistance = GetDistance(baselat, baselot, baselat, crd.longitude);
            // let laDistance = getLineDistance(baselat,baselot,crd.latitude,baselot);
            // let lnDistance = getLineDistance(baselat,baselot,baselat,crd.longitude);
            var lnDirection = Math.sign(crd.longitude - baselot);
            var laDirection = Math.sign(crd.latitude - baselat);
            var thisLeft = basetop + (lnDistance * lnDirection * rmRate - 260);
            var thisTop = baseleft - (laDistance * laDirection * rmRate - 250);
            myDot.style.left = thisLeft + "px";
            myDot.style.top = thisTop + "px";
        }, error, options);
    }
});
// console.log(GetDistance(baselat,baselot,sglat,sglot));
// console.log(styleDistance(baseleft,basetop,sgleft,sgtop));
// console.log(styleDistance(baseleft,basetop,sgleft,sgtop)/GetDistance(baselat,baselot,sglat,sglot));
// console.log(styleDistance(baseleft,basetop,sgleft,sgtop)/getLineDistance(baselat,baselot,sglat,sglot));
//# sourceMappingURL=main.js.map