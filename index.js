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

var ExchangeRateNotifer = function(kind){
  this.kind = kind;
  this.pre_value = 0;
  this.url = "http://info.finance.yahoo.co.jp/exchange/convert/?a=1&s=" + this.kind.from + "&t=" + this.kind.to;
  //this.url = "http://stocks.finance.yahoo.co.jp/stocks/detail/?code=" + that.kind + "=X";
};
  
ExchangeRateNotifer.prototype._scrape = function(callback){
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
        //var value = $(".stoksPrice").text();
        var value = $(".emphasis").text();
        var msg = "[" + moment().format('MM/DD HH:mm') + "] " + that.kind.from + "/" + that.kind.to + " : " + value;
        console.log(msg);

        // 前回値と異なれば Growlへ通知する
        if ( value != that.pre_value ){
          var upOrDown = "";
          if ( value > that.pre_value ){
            upOrDown = "🔼 ";
          }else{
            upOrDown = "🔽 ";
          }

          growl(upOrDown + msg);
          that.pre_value = value;
        }
      }
  );
};

ExchangeRateNotifer.prototype.startNotify = function(){
  var that = this;
  var startTimer = function(){
    setTimeout(function(){
      that._scrape(startTimer);
    }, 10000);
  };

  that._scrape(startTimer);
}


function main(){
  ExchangeRates.forEach(function(rate){
    var exnoti = new ExchangeRateNotifer(rate);
    exnoti.startNotify();
  });
}

main();

