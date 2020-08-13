
window.onload = () => {
    addNavBar();
    document.getElementById('signUpButton').addEventListener('click', event => {
      event.preventDefault();
      registerUser();
    });
}

function registerUser(){
    console.log("authenticate function was called")
    let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = loginSuccess;
	xhttp.open('POST', '/users/signup');
	xhttp.setRequestHeader('Content-type',
            'application/x-www-form-urlencoded');
    let name = document.getElementById('inputName').value;
    let lastName = document.getElementById('inputLastName').value;
    let username = document.getElementById('inputUsername').value;
    let address = document.getElementById('inputAddress').value;
    let city = document.getElementById('inputCity').value;
    let state = document.getElementById('inputState').value;
    let password = document.getElementById('inputPassword').value;
    let income = document.getElementById('inputIncome').value;
    let debt = document.getElementById('inputDebt').value;
    let expenses = document.getElementById('inputExpenses').value;
    body = name+'='+lastName+'='+username+'='+password+'='+address+'='+city+'='+state+'='+income+'='+debt+'='+expenses;
    xhttp.send(body);
            
    function loginSuccess() {
        console.log("loginSuccess function was called")
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            loggedUser = JSON.parse(xhttp.responseText)
            window.open("/signedup","_self");
        }
        else if( xhttp.readyState == 4 && xhttp.status == 401 ){
          alert("Try again.")

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