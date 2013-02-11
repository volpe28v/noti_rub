
var jsdom = require("jsdom");
var _ = require('underscore');
var moment = require('moment');
var growl = require('growl');

function showRub(){
  jsdom.env(
    "http://info.finance.yahoo.co.jp/exchange/convert/?a=1&s=RUB&t=JPY",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      var $ = window.$;
      var msg = "[" + moment().format('MM/DD, HH:mm') + "]" + " Rub/JPY: " + $(".emphasis").text();
      console.log(msg);
      growl(msg);
    }
  );
}

showRub();

setInterval(function(){
  showRub();
}, 60000);

