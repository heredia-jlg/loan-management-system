
window.onload = () => {
    addNavBar();
    document.getElementById('login').addEventListener('click', authenticate);
    document.getElementById('username');
    document.getElementById('password');
    document.getElementById('signup').addEventListener('click', event => {
      event.preventDefault();
      gotoSignup();
    });
}
function gotoSignup(){
  window.open("/signup","_self")
}
function authenticate(){
    console.log("authenticate function was called")
    let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = loginSuccess;
	xhttp.open('POST', '/users/login');
	xhttp.setRequestHeader('Content-type',
            'application/x-www-form-urlencoded');
  let user = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  xhttp.send('user='+user+'='+password);
            
    function loginSuccess() {
        console.log("loginSuccess function was called")
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            loggedUserType = JSON.parse(xhttp.responseText);
            console.log("logged in ");
            console.log(loggedUserType);
            if(loggedUserType == 'customer'){
              window.open("/form", "_self");
            }
            else
            {
              window.open("/manager", "_self");
            }
        }
        else if( xhttp.readyState == 4 && xhttp.status == 401 ){
          alert("Password or Username were wrong. Try again.")
        }
    }
}
function addNavBar() {
    console.log('adding the nav bar');
    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.innerHTML = navbar;
    body.insertBefore(div, body.childNodes[0])
}
function showLoggedInMessage(){
    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.innerHTML = loggedInMessage;
    body.insertBefore(div, body.childNodes[0])
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