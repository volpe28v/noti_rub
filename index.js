var jsdom = require("jsdom");
var _ = require('underscore');
var moment = require('moment');
var growl = require('growl');

var ExchangeRates = [
  {
    from: "RUB",
    to:   "JPY"
  },
  {
    from: "AUD",
    to:   "JPY"
  }
];

var ExchangeRateNotifier = function(kind){
  this.kind = kind;
  this.pre_value = 0;
  //this.url = "http://info.finance.yahoo.co.jp/exchange/convert/?a=1&s=" + this.kind.from + "&t=" + this.kind.to; // 簡易表示
  this.url = "http://stocks.finance.yahoo.co.jp/stocks/detail/?code=" + this.kind.from + this.kind.to + "=X"; // 詳細表示
}
  
ExchangeRateNotifier.prototype.startNotify = function(){
  var that = this;
  var startTimer = function(){
    setTimeout(function(){
      that._scrape(startTimer);
    }, 30000);
  };

  that._scrape(startTimer);
}

ExchangeRateNotifier.prototype._scrape = function(callback){
  var that = this;
  console.log("scrape: " + that.url );
  jsdom.env(
      that.url,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
        callback();
        if (errors != null) {
          console.log(errors );
          return; 
        }

        var $ = window.$;
        //var value = $(".emphasis").text(); // 簡易表示
        var value = $(".stoksPrice").text(); // 詳細表示

        that._notify(value, that.pre_value);
        that.pre_value = value;
      }
  );
}

ExchangeRateNotifier.prototype._notify = function(value, pre_value){
  var that = this;

  var nowStr = "[" + moment().format('MM/DD HH:mm:ss') + "]";
  var msg = nowStr + " " + that.kind.from + "/" + that.kind.to + " : " + value;
  console.log(msg);

  // 前回値と異なれば Growlへ通知する
  if ( value != pre_value ){
    var upOrDown = "";
    if ( value > pre_value ){
      upOrDown = "🔼 ";
    }else{
      upOrDown = "🔽 ";
    }

    // growlの表示のされ方を空白で調整
    var growl_msg = nowStr + "　　　　　　　　" + upOrDown + that.kind.from + "/" + that.kind.to + " : " + value;
    growl(growl_msg);
  }
}

function main(){
  ExchangeRates.forEach(function(rate){
    var exnoti = new ExchangeRateNotifier(rate);
    exnoti.startNotify();
  });
}

main();

