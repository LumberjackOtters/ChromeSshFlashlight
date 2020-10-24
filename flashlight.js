var active = false;

function flashlight(info) {

  if (info.requestId == localStorage.sshFlashlightHandled) {
    return
  }  

  var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
  var urlMatch = info.url.match(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi)
  var host = urlMatch ? urlMatch[0] : null 
  var url = info.url

  for (let slug in sshFlashlight.redirections) {
    if (host.includes(slug)) {
      localStorage.sshFlashlightHandled = info.requestId
      return { redirectUrl : url.replace(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi, sshFlashlight.redirections[slug] + '/' ) }
    }
  }

  if (info.initiator) {
    var isSameHost = host.includes(info.initiator)

    if (host.indexOf("localhost") > 0 || !isSameHost) {
      localStorage.sshFlashlightHandled = info.requestId
      return { redirectUrl : url.replace(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi, info.initiator + '/' ) }
    }
  }
}

// Init
chrome.browserAction.setIcon({path:"inactive.png"});
if (!localStorage.sshFlashlight) {
  localStorage.sshFlashlight = JSON.stringify({
    "redirections": {"example": "https://example.com"}
  })
}


chrome.browserAction.onClicked.addListener(function(tab) {
    active = !active;
    if (active) {
        
        chrome.browserAction.setIcon({path:"active.png"})
        var types = ["main_frame"]
        var urls = ["*://localhost:*/*"]
        
        var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
        for (let slug in sshFlashlight.redirections) {
            urls.push("*://"+slug+":*/*")
        }
        
        chrome.webRequest.onBeforeRequest.addListener(
      
        flashlight,
      
        // filters
        {
          urls: urls,
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