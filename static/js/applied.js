window.onload = () => {
    addNavBar();
    getUser()
}
function addNavBar() {
  console.log('adding the nav bar');
  let body = document.getElementsByTagName('body')[0];
  let div = document.createElement('div');
  div.innerHTML = navbar;
  body.insertBefore(div, body.childNodes[0])
}


function showResponse(loanStatus) {
    console.log('adding the nav bar');
    let body = document.getElementById('applicationResponse');
    let div = document.createElement('p');
    div.innerHTML = loanStatus;
    body.insertBefore(div, body.childNodes[0])
}


function getUser(){
    console.log("gerUser function was called")
    let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = user;
  xhttp.open('GET', '/users');
  xhttp.setRequestHeader('Content-type',
            'application/x-www-form-urlencoded');
  xhttp.send('')
            
    function user() {
        console.log("user function was called")
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            loanStatus = JSON.parse(xhttp.responseText)
            console.log(loanStatus)
            showResponse(loanStatus);
        }
        else if( xhttp.readyState == 4 && xhttp.status == 401 ){
          alert("Password or Username were wrong. Try again.")
        }
    }
  }

  let navbar = `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="/index">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/login">Log In</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Menu Item</a>
      </li>
    </ul>
  </div>
</nav>
`;