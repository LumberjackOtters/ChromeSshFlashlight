document.addEventListener("DOMContentLoaded", function(event) {
  console.log(localStorage)
  if (!localStorage.sshFlashlight) {
    localStorage.sshFlashlight = JSON.stringify({
      "redirections": {"example": "https://example.com"}
    })
  }
  
  var redirections = JSON.parse(localStorage.sshFlashlight).redirections
  for (let slug in redirections) {
    var data = document.getElementById('redirections').insertRow()
    data.insertCell().innerHTML = slug;
    data.insertCell().innerHTML = redirections[slug];
    data.insertCell().innerHTML = '<button id="'+slug+'" class="delete button button-clear">Delete</button>';
  }
  
  for (let item of document.getElementsByClassName("delete")) {
    item.addEventListener('click', (event) => {
      var sshFlashlight = JSON.parse(localStorage.sshFlashlight);
      
      delete sshFlashlight.redirections[event.target.id]
      localStorage.sshFlashlight = JSON.stringify(sshFlashlight)
      
      event.target.parentElement.parentElement.remove()
    })
  }
  
  var form = document.getElementById('config');
  form.addEventListener('submit', function(e) {
      e.preventDefault(); // don't submit
      var sshFlashlight = JSON.parse(localStorage.sshFlashlight);

      sshFlashlight.redirections[document.getElementById('slug').value] = document.getElementById('redirect').value
      
      var data = document.getElementById('redirections').insertRow()
      data.insertCell().innerHTML = document.getElementById('slug').value;
      data.insertCell().innerHTML = document.getElementById('redirect').value;
      data.insertCell().innerHTML = '<button id="'+slug+'" class="delete button button-clear">Delete</button>';
      
      localStorage.sshFlashlight = JSON.stringify(sshFlashlight)
      form.reset()
  })
});