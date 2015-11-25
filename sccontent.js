//Seraphina Anderson Oct/Nov 2015

//# NOTES

$(document).ready(function() {


var sizechecker; // The feed object. Contains 1 attribute for now only: href

// Let's make sure that both the app and the extension are not inserting shotpagr mini to the page.
var scMarkedAlready = document.body.getAttribute( "data-sizechecker-mini" ) == "yes";

if( scMarkedAlready == false){
  document.body.setAttribute("data-sizechecker-mini", "yes" );
  (function(){

      chrome.runtime.sendMessage({type: "getLocalStorage", key: "urlWhiteList"}, function(response) {
        localStorage["urlWhiteList"] = response.data;
        var whiteList = localStorage["urlWhiteList"].split(',');

        d = !1;
        for (var g = null, f = 0; f < whiteList.length; f++){
          if (location.href.indexOf(whiteList[f]) > -1) {
              d = !0;
              g = whiteList[f];
              break;
          }
        }

        if (d == !1)
          return;
        // Check what this is doing to determine whether we need it or not
        if ((location.href.indexOf("go.sizechecker.com") > -1) || (location.href.indexOf("api.shopstyle.com") > -1) || (location.href.indexOf("www.google.com") > -1))
          return;

        chrome.runtime.sendMessage({type: "getLocalStorage", key: "slider_notification"}, function(response2) {
          localStorage["showIcon"] = response2.data;
          // Show the icon?
          if (localStorage["showIcon"] == "disabled")
            return;
          insertSizeChecker();
        });
      });
    })();
}


function insertSizeChecker(){


  var popup, // the popup containing the iframe
    iFrame, 
    arrow, // the small arrow between the popup and the mini icon
    iFrameLoaded = false; // is the iframe correctly loaded?

  var currentUrl = document.URL; // The url of our page, take the canonical url if there's one
  (function() {
    var result = document.evaluate(
              '//*[local-name()="link"][contains(@rel, "canonical")]',
              document, null, 0, null
          );
    if (item = result.iterateNext())
      currentUrl = item.href;
  })();



}

});
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "getState")
      sendResponse({state: "manualTagging"});
  });
