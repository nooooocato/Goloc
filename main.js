let watcherID = null;
let divConsole = document.querySelector('#console');
let newGemDot = document.querySelector('#newGemDot');
let southGatDot = document.querySelector('#southGatDot');
let myDot = document.querySelector('#myDot');
let rmRate = 1.1400682183346926;
let baselat = newGemDot.getAttribute("data-lat");
let baselot = newGemDot.getAttribute("data-lot");
let basetop = 1915;
let baseleft = 1656;
let sgtop = 2215;
let sgleft = 748;
let sglat = southGatDot.getAttribute("data-lat");
let sglot = southGatDot.getAttribute("data-lot");
let latcha;
let lotcha;
let EARTH_RADIUS = 6378137;



divConsole.log = (text,lineNumber="") => {
    divConsole.innerHTML += "["+window.Date().slice(16,24)+"] "+"[ line: "+lineNumber+" ]" + String(text +"</br>");
    divConsole.scrollBy(0,100);
};
divConsole.error = (text) => {
  divConsole.innerHTML += "<em>["+window.Date().slice(16,24)+"] "+ String(text+"</em></br>");
  divConsole.scrollBy(0,100);
};
divConsole.tag = (text) => {
  divConsole.innerHTML += "<color-tag>["+window.Date().slice(16,24)+"] "+ String(text+"</color-tag></br>");
  divConsole.scrollBy(0,100);
};


if ("geolocation" in navigator) {
    divConsole.log("support geolocation!",9);
  } else {
    divConsole.log("not support geolocation!",11);
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    var crd = pos.coords;
    divConsole.log("");
    divConsole.log('你的位置 :');
    divConsole.log('纬度 : ' + crd.latitude);
    divConsole.log('经度 : ' + crd.longitude);
    divConsole.log('误差 : ±' + crd.accuracy + ' 米.');
  };
  
  function error(err) {
    divConsole.error('ERROR(' + err.code + '): ' + err.message);
  };
  
  navigator.geolocation.getCurrentPosition(success, error, options);
  navigator.geolocation.watchPosition((pos) => {
    let crd = pos.coords;
    let laDistance = GetDistance(baselat,baselot,crd.latitude,baselot);
    let lnDistance = GetDistance(baselat,baselot,baselat,crd.longitude);
    let lnDirection = Math.sign(crd.longitude-baselot);
    let laDirection = Math.sign(crd.latitude-baselat);
    let thisLeft = basetop + (lnDistance*lnDirection*rmRate-240);
    let thisTop = baseleft - (laDistance*laDirection*rmRate-240);
    myDot.style.left = thisLeft+"px";
    myDot.style.top = thisTop+"px";
  }, error, options);
  // startWatch();

function stopWatch(id) {
  navigator.geolocation.clearWatch(id);
  watcherID = null;
}
function startWatch() {
  if (watcherID !== null) {
    divConsole.log("已经在监控");
    return;
  }else{
    let id = navigator.geolocation.watchPosition(success, error, options);
    watcherID = id;
  }
}
function setTag() {
  let element = document.querySelector('#tagName');
  divConsole.tag(element.value);
}


function rad(d)
{
    return d * Math.PI / 180.0;
}
 
function GetDistance(lat1,lng1,lat2,lng2)
{
    radLat1 = rad(lat1);
    radLat2 = rad(lat2);
    a = radLat1 - radLat2;
    b = rad(lng1) - rad(lng2);
    s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + 
     Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

function styleDistance(left1,top1,left2,top2) {
  return Math.sqrt(Math.pow((left1-left2),2)+Math.pow((top1-top2),2));
}

function getLineDistance(lat1,lng1,lat2,lng2) {
  radLat1 = rad(lat1);
  radLat2 = rad(lat2);
  radlng1 = rad(lng1);
  radlng2 = rad(lng2);
  a = radLat2 - radLat1;
  return Math.sqrt(2*Math.pow(EARTH_RADIUS,2)*
  (1-Math.cos(radlng1)*Math.cos(radlng2)*Math.cos(a)-Math.sin(radlng1)*Math.sin(radlng2)))
}
console.log(GetDistance(baselat,baselot,sglat,sglot));
console.log(styleDistance(baseleft,basetop,sgleft,sgtop));
console.log(styleDistance(baseleft,basetop,sgleft,sgtop)/GetDistance(baselat,baselot,sglat,sglot));