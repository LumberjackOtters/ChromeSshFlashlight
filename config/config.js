document.addEventListener("DOMContentLoaded", function(event) {  
  var flashs = JSON.parse(localStorage.sshFlashlight).flashs
  for (let slug in flashs) {
    var data = document.getElementById('flashs').insertRow()
    data.insertCell().innerHTML = slug;
    data.insertCell().innerHTML = flashs[slug];
    data.insertCell().innerHTML = '<button id="'+slug+'" class="delete button button-clear">Delete</button>';
  }
  
  for (let item of document.getElementsByClassName("delete")) {
    item.addEventListener('click', (event) => {
      var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
      
      delete sshFlashlight.flashs[event.target.id]
      localStorage.sshFlashlight = JSON.stringify(sshFlashlight)
      
      event.target.parentElement.parentElement.remove()
    })
  }
  
  var form = document.getElementById('configf');
  form.addEventListener('submit', function(e) {
      e.preventDefault(); // don't submit
      var sshFlashlight = JSON.parse(localStorage.sshFlashlight);

      sshFlashlight.flashs[document.getElementById('slug').value] = document.getElementById('flash').value
      
      var data = document.getElementById('flashs').insertRow()
      data.insertCell().innerHTML = document.getElementById('slug').value;
      data.insertCell().innerHTML = document.getElementById('flash').value;
      data.insertCell().innerHTML = '<button id="'+slug+'" class="delete button button-clear">Delete</button>';
      
      localStorage.sshFlashlight = JSON.stringify(sshFlashlight)
      form.reset()
  })
});


document.addEventListener("DOMContentLoaded", function (event) {
  var redirections = JSON.parse(localStorage.sshFlashlight).redirections
  for (let host in redirections) {
    var data = document.getElementById('redirections').insertRow()
    data.insertCell().innerHTML = host;
    data.insertCell().innerHTML = redirections[host];
    data.insertCell().innerHTML = '<button id="' + host + '" class="delete button button-clear">Delete</button>';
  }

  for (let item of document.getElementsByClassName("delete")) {
    item.addEventListener('click', (event) => {
      var sshFlashlight = JSON.parse(localStorage.sshFlashlight);

      delete sshFlashlight.redirections[event.target.id]
      localStorage.sshFlashlight = JSON.stringify(sshFlashlight)

      event.target.parentElement.parentElement.remove()
    })
  }

  var form = document.getElementById('configr');
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // don't submit
    var sshFlashlight = JSON.parse(localStorage.sshFlashlight);

    sshFlashlight.redirections[document.getElementById('host').value] = document.getElementById('redirect').value

    var data = document.getElementById('redirections').insertRow()
    data.insertCell().innerHTML = document.getElementById('host').value;
    data.insertCell().innerHTML = document.getElementById('redirect').value;
    data.insertCell().innerHTML = '<button id="' + host + '" class="delete button button-clear">Delete</button>';

    localStorage.sshFlashlight = JSON.stringify(sshFlashlight)
    form.reset()
  })
});

