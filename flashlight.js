var active = false;

function flashlight(info) {
  var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
  
  var host = info.url.match(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi)[0]
  
  if (host.indexOf("localhost") > 0) {
      if (info.initiator) {
        var url = info.url
        return { redirectUrl : url.replace(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi, info.initiator + '/' ) }
      }
  }
  
  for (let slug in sshFlashlight.redirections) {
    console.log(host.match("https://"+slug) || host.match("http://"+slug))
    if (host.match("https://"+slug) || host.match("http://"+slug)) {
      var url = info.url
      return { redirectUrl : url.replace(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi, sshFlashlight.redirections[slug] + '/' ) }
    }
  }
}

chrome.browserAction.setIcon({path:"inactive.png"});

chrome.browserAction.onClicked.addListener(function(tab) {
    active = !active;
    if (active) {
        chrome.browserAction.setIcon({path:"active.png"});
        var types = ["main_frame"];
        chrome.webRequest.onBeforeRequest.addListener(
        flashlight,
          // filters
          {
            urls: [
            "<all_urls>"
            ],
            types: types
          },
          // extraInfoSpec
          ["blocking"]);
    }else{
        chrome.browserAction.setIcon({path:"inactive.png"});
        chrome.webRequest.onBeforeRequest.removeListener(
          flashlight
        );
    }

});
