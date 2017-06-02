
var baseUrl = '/SCB/5.5-人工智能机器回复项目/';
var mailAutoRule_step1 = 'mailAutoRule_step1';
var mailAutoRule_step2 = 'mailAutoRule_step2';
var mailAutoRule_step3 = 'mailAutoRule_step3';

if (window.sessionStorage) {
  var storage = window.sessionStorage;
}

//填充数据保存cookie
function setStorage (_name, _key, _value) {
  if (!getStorage(_name)) {
    var storage_c = {};
  } else {
    var storage_c = getStorage(_name);
  }
  storage_c[_key] = _value;
  storage.setItem(_name, JSON.stringify(storage_c));
}

//获取cookie数据
function getStorage (_name, _key) {
  var storage_c = storage.getItem(_name);
  if(typeof storage_c == 'undefined' || storage_c == '' || storage_c == null) {
    return false;
  } else {
    if (_key) {
      return JSON.parse(storage_c)[_key];
    } else {
      return JSON.parse(storage_c);
    } 
  }
}

//清楚storage数据
function clearStorage (_arr) {
  if (_arr instanceof Array) {
    for (i in _arr) {
      storage.removeItem(_arr[i]);
    }
  }
}

//阻止默认浏览器动作(W3C) 
function stopDefault( e ) { 
 if ( e && e.preventDefault ) {
  e.preventDefault(); 
  //IE中阻止函数器默认动作的方式 
 } else {
    window.event.returnValue = false; 
    return false; 
  }
}

