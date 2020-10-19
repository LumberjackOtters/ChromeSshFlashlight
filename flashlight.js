var active = false;

function flashlight(info) {
  if (!localStorage.sshFlashlight) {
    localStorage.sshFlashlight = JSON.stringify({
      "redirections": {"example": "https://example.com"}
    })
  }
  var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
  var host = info.url.match(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi)[0]

  for (let slug in sshFlashlight.redirections) {
    if (host.match("https://"+slug) || host.match("http://"+slug)) {
      var url = info.url
      return { redirectUrl : url.replace(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi, sshFlashlight.redirections[slug] + '/' ) }
    }
  }

  if (info.initiator) {
    var isSameHost = host.includes(info.initiator)

    if (host.indexOf("localhost") > 0 || !isSameHost) {
      var url = info.url
      return { redirectUrl : url.replace(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi, info.initiator + '/' ) }
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
