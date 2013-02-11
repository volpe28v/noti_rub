var jsdom = require("jsdom");
var _ = require('underscore');
var moment = require('moment');
var growl = require('growl');

function showRub(pre_value, callback){
  jsdom.env(
    "http://stocks.finance.yahoo.co.jp/stocks/detail/?code=RUBJPY=X",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      var $ = window.$;
      var value = $(".stoksPrice").text();

      if ( value != pre_value ){
        var msg = "[" + moment().format('MM/DD HH:mm') + "]" + " Rub/JPY: " + value;
        console.log(msg);
        growl(msg);
        callback(value);
      }
    }
  );
}

function main(){
  var pre_rub = 0;

  var updatePreValue = function(value){
    pre_rub = value;
  }

  showRub(pre_rub, updatePreValue);

  setInterval(function(){
    showRub(pre_rub, updatePreValue);
  }, 30000);
}

main();

