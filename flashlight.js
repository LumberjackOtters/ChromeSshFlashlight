var active = false;

function flashlight(info) {
  if (info.requestId == localStorage.sshFlashlightHandled && info.url == localStorage.sshFlashlightHandledUrl) {
    return
  }

  var urlMatch = info.url.match(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi)
  var host = urlMatch ? urlMatch[0] : null 
  var url = info.url
  if (info.originUrl) {
    var originMatch = info.originUrl.match(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi)
    var originHost = originMatch ? originMatch[0] : null
    info.originUrl = originHost
  }
  var initiator = info.initiator ? info.initiator : info.originUrl

  // Redirections part
  var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
  if (Object.keys(sshFlashlight.redirections).includes(host)) {
    localStorage.sshFlashlightHandled = info.requestId
    localStorage.sshFlashlightHandledUrl = info.url
    return { redirectUrl: sshFlashlight.redirections[host] }
  }

  // Flashlight part
  if (initiator && !initiator.includes("chrome-extension")) {
    var isSameHost = initiator.includes(host)
    if (host.indexOf("localhost") > 0 || !isSameHost) {
      localStorage.sshFlashlightHandled = info.requestId
      localStorage.sshFlashlightHandledUrl = info.url
      return { redirectUrl: url.replace(/^(?:http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gi, initiator + (info.originUrl ? "" : "/") ) }
    }
  }
}

// Init
chrome.browserAction.setIcon({path:"inactive.png"});
if (!localStorage.sshFlashlight) {
  localStorage.sshFlashlight = JSON.stringify({
    "flashs": { "example": "https://example.com" }, "redirections": { "https://example.com/": "https://test.com/" }
  })
}


chrome.browserAction.onClicked.addListener(function(tab) {
    active = !active;
    if (active) {
        chrome.browserAction.setIcon({path:"active.png"})
        var types = ["main_frame"]
        var urls = ["*://localhost/*"]

        var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
        for (let redirect in sshFlashlight.redirections) {
          urls.push(redirect)
        }
        
        chrome.webRequest.onBeforeRequest.addListener(
          flashlight,
          // filters
          {
            urls: urls,
            types: types
          },
          // extraInfoSpec
          ["blocking"]
        );
    }else{
      chrome.browserAction.setIcon({path:"inactive.png"});
      chrome.webRequest.onBeforeRequest.removeListener(
        flashlight
      );
    }

});

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function (text, suggest) {

    var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
    var filtered = Object.keys(sshFlashlight.flashs).filter(element => element.includes(text));

    suggest(
      Array.from(filtered, slug => {
        return { content: slug, description: sshFlashlight.flashs[slug] }
      })
    );
  }
);

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function (text) {
    var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.update(tabs[0].id, { url: sshFlashlight.flashs[text] });
    });
  }
);
